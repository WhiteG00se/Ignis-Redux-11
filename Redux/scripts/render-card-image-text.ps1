param(
  [int[]]$OfficialIds = @(
    72989439, 72989440, 69243953, 4031928, 40391316, 69015963, 53129443,
    23557835, 78706415, 93369354, 27970830, 85742772,
    85602018, 3136426, 34206604, 44656491, 74191942, 82732705, 84749824,
    90140980,
    52687916, 3078576, 12580477, 23434538,
    12580478, 83764718, 83764719, 79571449, 9126351, 17484499, 21502796,
    86099788, 20663556, 46239604, 68638985, 62671448, 19333131, 47805931,
    62070231, 90508760, 52352005, 15475415, 62315111, 98719226, 62437709, 652362, 73262676,
    97697678, 99342953, 96875080, 24082387, 24104865, 63253763, 97127906,
    21768554, 53291093, 60946968, 39163598
  ),
  [int[]]$UnofficialIds = @(
    511002993, 511000819, 511001039, 511000229, 511003116, 511002996,
    21593987, 511003019, 16226796, 511002992, 511000824, 511000825, 511002631,
    511000818, 511003012
  ),
  [switch]$OnlySpellTrap,
  [switch]$OnlyMonster
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")
$assetsDir = Join-Path $repoRoot "Redux\assets\pics"
$vanillaPicsDir = Join-Path $repoRoot "Redux\cache\pics"
$cacheDir = Join-Path $repoRoot "pics"
$targetWidth = 813
$targetHeight = 1185
$sourceImageIds = @{
  511000824 = 83555666 # Ring of Destruction pre-errata source is low-res.
  511000825 = 83555667 # Ring of Destruction pre-errata alternate art source is low-res.
  16226796 = 16226786 # Night Assailant pre-errata source is low-res.
}

New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null
New-Item -ItemType Directory -Force -Path $vanillaPicsDir | Out-Null

$officialIdsJson = $OfficialIds -join ","
$unofficialIdsJson = $UnofficialIds -join ","
$cardNameChangesJs = (Join-Path $PSScriptRoot "card-name-changes.js").Replace("\", "/")
$metadataScript = @"
const { DatabaseSync } = require("node:sqlite");
const nameChangedIds = require("$cardNameChangesJs");
const officialIds = [$officialIdsJson];
const unofficialIds = [$unofficialIdsJson];
const jobs = [
  ["Redux/modded/cards.cdb", "Redux/vanilla/cards.cdb", officialIds],
  ["Redux/modded/cards-unofficial.cdb", "Redux/vanilla/cards-unofficial.cdb", unofficialIds],
];
const rows = [];
for (const [dbPath, sourceDbPath, ids] of jobs) {
  const db = new DatabaseSync(dbPath);
  const sourceDb = new DatabaseSync(sourceDbPath);
  const stmt = db.prepare("SELECT texts.id, texts.name, texts.desc, datas.type, datas.race, datas.atk, datas.def, datas.level, datas.attribute FROM texts JOIN datas ON datas.id = texts.id WHERE texts.id = ?");
  const sourceStmt = sourceDb.prepare("SELECT datas.type FROM datas WHERE id = ?");
  for (const id of ids) {
    const row = stmt.get(id);
    if (!row) throw new Error("Missing card metadata for " + id);
    const sourceRow = sourceStmt.get(id);
    row.sourceType = sourceRow ? sourceRow.type : row.type;
    row.nameChangedByRedux = nameChangedIds.has(id);
    rows.push(row);
  }
  db.close();
  sourceDb.close();
}
console.log(JSON.stringify(rows));
"@

$metadataPath = Join-Path ([System.IO.Path]::GetTempPath()) "redux-card-image-metadata.cjs"
[System.IO.File]::WriteAllText($metadataPath, $metadataScript)
$metadataJson = node $metadataPath
Remove-Item -LiteralPath $metadataPath -Force
$cards = $metadataJson | ConvertFrom-Json
if ($OnlySpellTrap) {
  $cards = @($cards | Where-Object {
    (([int64]$_.type -band 0x2) -ne 0) -or (([int64]$_.type -band 0x4) -ne 0)
  })
}
if ($OnlyMonster) {
  $cards = @($cards | Where-Object {
    ([int64]$_.type -band 0x1) -ne 0
  })
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
  [System.Drawing.Imaging.Encoder]::Quality,
  [int64]96
)

function Get-SourcePath([int]$id) {
  $sourceId = if ($sourceImageIds.ContainsKey($id)) { $sourceImageIds[$id] } else { $id }
  $candidates = @(
    (Join-Path $vanillaPicsDir "$sourceId.jpg"),
    (Join-Path $cacheDir "$sourceId.jpg")
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  $download = Join-Path $vanillaPicsDir "$sourceId.jpg"
  $url = "https://images.ygoprodeck.com/images/cards/$sourceId.jpg"
  try {
    Invoke-WebRequest -Uri $url -OutFile $download -UseBasicParsing | Out-Null
    if (Test-Path -LiteralPath $download) {
      return (Resolve-Path -LiteralPath $download).Path
    }
  } catch {
    if (Test-Path -LiteralPath $download) {
      Remove-Item -LiteralPath $download -Force
    }
  }

  return $null
}

function Get-WrappedLines(
  [System.Drawing.Graphics]$graphics,
  [string]$text,
  [System.Drawing.Font]$font,
  [int]$maxWidth
) {
  $output = New-Object System.Collections.Generic.List[string]
  $paragraphs = ($text -replace "`r`n", "`n" -replace "`r", "`n") -split "`n"

  foreach ($paragraph in $paragraphs) {
    if ([string]::IsNullOrWhiteSpace($paragraph)) {
      $output.Add("")
      continue
    }

    $line = ""
    foreach ($word in ($paragraph -split " ")) {
      $candidate = if ($line.Length -eq 0) { $word } else { "$line $word" }
      if ($graphics.MeasureString($candidate, $font).Width -le $maxWidth -or $line.Length -eq 0) {
        $line = $candidate
      } else {
        $output.Add($line)
        $line = $word
      }
    }

    if ($line.Length -gt 0) {
      $output.Add($line)
    }
  }

  return $output
}

function Get-FittedTextBlock(
  [System.Drawing.Graphics]$graphics,
  [string]$text,
  [int]$maxWidth,
  [int]$maxHeight,
  [float]$minFontSize,
  [float]$maxFontSize
) {
  $fontSize = [float]$minFontSize
  $bestFontSize = [float]$minFontSize
  $bestLines = $null
  $bestLineHeight = 0

  while ($true) {
    $testFont = New-Object System.Drawing.Font("Times New Roman", $fontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $testLines = Get-WrappedLines $graphics $text $testFont $maxWidth
    $testLineHeight = [int][Math]::Ceiling($testFont.GetHeight($graphics) * 1.02)
    $testTotalHeight = $testLines.Count * $testLineHeight
    $testFont.Dispose()

    if ($testTotalHeight -gt $maxHeight) {
      break
    }

    $bestFontSize = $fontSize
    $bestLines = $testLines
    $bestLineHeight = $testLineHeight
    $fontSize += [float]0.75

    if ($fontSize -gt $maxFontSize) {
      break
    }
  }

  if ($null -eq $bestLines) {
    $font = New-Object System.Drawing.Font("Times New Roman", $minFontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $bestLines = Get-WrappedLines $graphics $text $font $maxWidth
    $bestLineHeight = [int][Math]::Ceiling($font.GetHeight($graphics) * 1.02)
    $bestFontSize = $minFontSize
  } else {
    $font = New-Object System.Drawing.Font("Times New Roman", $bestFontSize, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
  }

  return [PSCustomObject]@{
    Font = $font
    FontSize = $bestFontSize
    Lines = $bestLines
    LineHeight = $bestLineHeight
  }
}

function Get-LightAverageBrush(
  [System.Drawing.Bitmap]$bitmap,
  [System.Drawing.Rectangle]$rect
) {
  [int64]$r = 0
  [int64]$g = 0
  [int64]$b = 0
  [int64]$count = 0
  $stepX = [Math]::Max(1, [int]($rect.Width / 90))
  $stepY = [Math]::Max(1, [int]($rect.Height / 45))

  for ($y = $rect.Top; $y -lt $rect.Bottom; $y += $stepY) {
    for ($x = $rect.Left; $x -lt $rect.Right; $x += $stepX) {
      $pixel = $bitmap.GetPixel($x, $y)
      $brightness = ([int]$pixel.R + [int]$pixel.G + [int]$pixel.B) / 3
      if ($brightness -gt 135) {
        $r += $pixel.R
        $g += $pixel.G
        $b += $pixel.B
        $count++
      }
    }
  }

  if ($count -eq 0) {
    return New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(224, 238, 226))
  }

  $color = [System.Drawing.Color]::FromArgb(
    [Math]::Min(255, [int]($r / $count) + 3),
    [Math]::Min(255, [int]($g / $count) + 3),
    [Math]::Min(255, [int]($b / $count) + 3)
  )
  return New-Object System.Drawing.SolidBrush($color)
}

function Get-RaceName([int64]$race) {
  $raceNames = @{
    1 = "WARRIOR"
    2 = "SPELLCASTER"
    4 = "FAIRY"
    8 = "FIEND"
    16 = "ZOMBIE"
    32 = "MACHINE"
    64 = "AQUA"
    128 = "PYRO"
    256 = "ROCK"
    512 = "WINGED BEAST"
    1024 = "PLANT"
    2048 = "INSECT"
    4096 = "THUNDER"
    8192 = "DRAGON"
    16384 = "BEAST"
    32768 = "BEAST-WARRIOR"
    65536 = "DINOSAUR"
    131072 = "FISH"
    262144 = "SEA SERPENT"
    524288 = "REPTILE"
    1048576 = "PSYCHIC"
    2097152 = "DIVINE-BEAST"
    4194304 = "CREATOR GOD"
    8388608 = "WYRM"
    16777216 = "CYBERSE"
  }

  if ($raceNames.ContainsKey([int]$race)) {
    return $raceNames[[int]$race]
  }

  return "UNKNOWN"
}

function Get-MonsterTypeLine([int64]$type, [int64]$race) {
  $labels = New-Object System.Collections.Generic.List[string]
  $labels.Add((Get-RaceName $race))

  if (($type -band 0x40) -ne 0) { $labels.Add("FUSION") }
  if (($type -band 0x80) -ne 0) { $labels.Add("RITUAL") }
  if (($type -band 0x2000) -ne 0) { $labels.Add("SYNCHRO") }
  if (($type -band 0x800000) -ne 0) { $labels.Add("XYZ") }
  if (($type -band 0x1000000) -ne 0) { $labels.Add("PENDULUM") }
  if (($type -band 0x200) -ne 0) { $labels.Add("SPIRIT") }
  if (($type -band 0x400) -ne 0) { $labels.Add("UNION") }
  if (($type -band 0x800) -ne 0) { $labels.Add("GEMINI") }
  if (($type -band 0x1000) -ne 0) { $labels.Add("TUNER") }
  if (($type -band 0x200000) -ne 0) { $labels.Add("FLIP") }
  if (($type -band 0x20) -ne 0) { $labels.Add("EFFECT") }
  if (($type -band 0x10) -ne 0) { $labels.Add("NORMAL") }

  return "[$($labels -join ' / ')]"
}

function Convert-NormalMonsterFrameToEffect(
  [System.Drawing.Bitmap]$bitmap
) {
  $width = $bitmap.Width
  $height = $bitmap.Height
  $artLeft = [int]($width * 0.104)
  $artTop = [int]($height * 0.173)
  $artRight = [int]($width * 0.899)
  $artBottom = [int]($height * 0.715)
  $attributeX = [int]($width * 718 / 813)
  $attributeY = [int]($height * 88 / 1185)
  $attributeRadius = [int]($width * 37 / 813)
  $attributeRadiusSquared = $attributeRadius * $attributeRadius
  $rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
  $data = $bitmap.LockBits(
    $rect,
    [System.Drawing.Imaging.ImageLockMode]::ReadWrite,
    [System.Drawing.Imaging.PixelFormat]::Format24bppRgb
  )

  try {
    $bytes = New-Object byte[] ([Math]::Abs($data.Stride) * $height)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)

    for ($y = 0; $y -lt $height; $y++) {
      for ($x = 0; $x -lt $width; $x++) {
        if ($x -ge $artLeft -and $x -le $artRight -and $y -ge $artTop -and $y -le $artBottom) {
          continue
        }

        $dx = $x - $attributeX
        $dy = $y - $attributeY
        if (($dx * $dx + $dy * $dy) -le $attributeRadiusSquared) {
          continue
        }

        $offset = ($y * $data.Stride) + ($x * 3)
        $b = [int]$bytes[$offset]
        $g = [int]$bytes[$offset + 1]
        $r = [int]$bytes[$offset + 2]
        if ($r -lt 80 -or $g -lt 55 -or $r -lt ($b + 12) -or $g -lt ($b - 5)) {
          continue
        }

        if ([Math]::Max($r, [Math]::Max($g, $b)) -lt 45) {
          continue
        }

        $targetB = $b * 0.594
        $targetG = $g * 0.596
        $targetR = $r * 0.938
        $luma = (0.299 * $r) + (0.587 * $g) + (0.114 * $b)
        $highlightBlend = [Math]::Max(0.0, [Math]::Min(1.0, ($luma - 150.0) / 60.0))
        $effectBlend = 1.0 - (0.97 * $highlightBlend)

        $bytes[$offset] = [byte][Math]::Max(0, [Math]::Min(255, [Math]::Round($b + (($targetB - $b) * $effectBlend))))
        $bytes[$offset + 1] = [byte][Math]::Max(0, [Math]::Min(255, [Math]::Round($g + (($targetG - $g) * $effectBlend))))
        $bytes[$offset + 2] = [byte][Math]::Max(0, [Math]::Min(255, [Math]::Round($r + (($targetR - $r) * $effectBlend))))
      }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
  } finally {
    $bitmap.UnlockBits($data)
  }
}

function Copy-CircleFromBitmap(
  [System.Drawing.Graphics]$graphics,
  [System.Drawing.Bitmap]$source,
  [int]$centerX,
  [int]$centerY,
  [int]$radius
) {
  $rect = New-Object System.Drawing.Rectangle(
    ($centerX - $radius),
    ($centerY - $radius),
    ($radius * 2),
    ($radius * 2)
  )
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse($rect)
  $state = $graphics.Save()
  $graphics.SetClip($clip)
  $graphics.DrawImage($source, $rect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Restore($state)
  $clip.Dispose()
}

function Restore-MonsterIconsFromSource(
  [System.Drawing.Graphics]$graphics,
  [System.Drawing.Bitmap]$source,
  [int]$level
) {
  Copy-CircleFromBitmap $graphics $source 718 88 37

  $visibleLevel = [Math]::Min(12, [Math]::Max(0, ($level -band 0xff)))
  $starRadius = [int]([Math]::Ceiling((192 - 145) / 2))
  $starSpacing = ($starRadius * 2) + 2
  for ($starIndex = 0; $starIndex -lt $visibleLevel; $starIndex++) {
    Copy-CircleFromBitmap $graphics $source (707 - ($starIndex * $starSpacing)) 169 $starRadius
  }
}

function Add-GoldErrataFrame(
  [System.Drawing.Graphics]$graphics,
  [int]$width,
  [int]$height
) {
  $outer = New-Object System.Drawing.Rectangle(
    0,
    0,
    $width,
    $height
  )
  $inner = New-Object System.Drawing.Rectangle(
    [int]($width * 28 / 813),
    [int]($height * 28 / 1185),
    [int]($width * 757 / 813),
    [int]($height * 1129 / 1185)
  )
  $innerRadius = [int]($width * 12 / 813)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddRectangle($outer)
  $path.CloseFigure()
  $path.AddArc($inner.Left, $inner.Top, $innerRadius, $innerRadius, 180, 90)
  $path.AddArc(($inner.Right - $innerRadius), $inner.Top, $innerRadius, $innerRadius, 270, 90)
  $path.AddArc(($inner.Right - $innerRadius), ($inner.Bottom - $innerRadius), $innerRadius, $innerRadius, 0, 90)
  $path.AddArc($inner.Left, ($inner.Bottom - $innerRadius), $innerRadius, $innerRadius, 90, 90)
  $path.CloseFigure()

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $outer,
    [System.Drawing.Color]::FromArgb(255, 255, 238, 142),
    [System.Drawing.Color]::FromArgb(255, 118, 76, 5),
    45
  )
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend 4
  $blend.Colors = @(
    [System.Drawing.Color]::FromArgb(255, 255, 238, 142),
    [System.Drawing.Color]::FromArgb(255, 224, 167, 35),
    [System.Drawing.Color]::FromArgb(255, 118, 76, 5),
    [System.Drawing.Color]::FromArgb(255, 255, 238, 142)
  )
  $blend.Positions = @(0.0, 0.35, 0.75, 1.0)
  $brush.InterpolationColors = $blend
  $graphics.FillPath($brush, $path)

  $path.Dispose()
  $brush.Dispose()
}

function Add-GoldErrataLetter(
  [System.Drawing.Graphics]$graphics,
  [int]$x
) {
  $fontSize = 74
  $font = New-Object System.Drawing.Font("Times New Roman", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $text = "R"
  $size = $graphics.MeasureString($text, $font)
  $rect = New-Object System.Drawing.RectangleF(
    [float](-($size.Width / 2)),
    [float](-($size.Height / 2)),
    [float]$size.Width,
    [float]$size.Height
  )
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddString(
    $text,
    $font.FontFamily,
    [int][System.Drawing.FontStyle]::Bold,
    [float]$fontSize,
    $rect,
    [System.Drawing.StringFormat]::GenericDefault
  )

  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $rect,
    [System.Drawing.Color]::FromArgb(255, 255, 238, 142),
    [System.Drawing.Color]::FromArgb(255, 118, 76, 5),
    45
  )
  $blend = New-Object System.Drawing.Drawing2D.ColorBlend 4
  $blend.Colors = @(
    [System.Drawing.Color]::FromArgb(255, 255, 246, 177),
    [System.Drawing.Color]::FromArgb(255, 224, 167, 35),
    [System.Drawing.Color]::FromArgb(255, 118, 76, 5),
    [System.Drawing.Color]::FromArgb(255, 255, 238, 142)
  )
  $blend.Positions = @(0.0, 0.36, 0.72, 1.0)
  $brush.InterpolationColors = $blend
  $shadowPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(190, 79, 45, 0), 3)
  $shinePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(235, 255, 252, 190), 2)
  $shineRect = New-Object System.Drawing.RectangleF(
    [float]-36,
    [float]-50,
    [float]($size.Width + 30),
    [float]($size.Height + 30)
  )
  $shineBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    $shineRect,
    [System.Drawing.Color]::FromArgb(245, 255, 255, 218),
    [System.Drawing.Color]::FromArgb(0, 255, 255, 214),
    135
  )

  $state = $graphics.Save()
  $graphics.TranslateTransform($x, 174)
  $graphics.RotateTransform(7)
  $graphics.FillPath($brush, $path)
  $graphics.DrawPath($shadowPen, $path)
  $graphics.DrawPath($shinePen, $path)
  $graphics.FillPath($shineBrush, $path)
  $graphics.Restore($state)

  $shineBrush.Dispose()
  $shinePen.Dispose()
  $shadowPen.Dispose()
  $brush.Dispose()
  $path.Dispose()
  $font.Dispose()
}

function Add-ErrataMarker(
  [System.Drawing.Graphics]$graphics,
  [int]$width,
  [int]$height,
  [int64]$type
) {
  Add-GoldErrataFrame $graphics $width $height
  $letterX = if (($type -band 0x800000) -ne 0) { 66 } else { 91 }
  Add-GoldErrataLetter $graphics $letterX
}

function Get-CleanCardName([string]$name) {
  return (($name -replace '^\[Redux\]\s*', '') -replace '\s*[^\x00-\x7F]+$', '')
}

function Add-CardNameText(
  [System.Drawing.Graphics]$graphics,
  [System.Drawing.Bitmap]$bitmap,
  [string]$name,
  [int64]$type
) {
  $cleanName = (Get-CleanCardName $name) -replace '"', ''
  $nameText = $cleanName.ToUpperInvariant()
  $patchRect = New-Object System.Drawing.Rectangle(59, 61, 609, 64)
  $templateName = Get-NameTextboxTemplateName $type
  $templatePath = Join-Path $repoRoot "Redux\assets\templates\$templateName"
  if (-not (Test-Path -LiteralPath $templatePath)) {
    throw "Missing name textbox template: $templatePath"
  }

  $templateBytes = [System.IO.File]::ReadAllBytes($templatePath)
  $templateStream = New-Object System.IO.MemoryStream @(,$templateBytes)
  $templateImage = [System.Drawing.Image]::FromStream($templateStream)
  $graphics.DrawImage($templateImage, $patchRect)
  $templateImage.Dispose()
  $templateStream.Dispose()

  $fontFamily = New-Object System.Drawing.FontFamily("Times New Roman")
  $format = [System.Drawing.StringFormat]::GenericTypographic
  $nameColor = if ((($type -band 0x2) -ne 0) -or (($type -band 0x4) -ne 0)) {
    [System.Drawing.Color]::White
  } else {
    [System.Drawing.Color]::Black
  }
  $brush = New-Object System.Drawing.SolidBrush($nameColor)
  $wordGap = [float]24
  $largeSmallGap = [float]1.5
  $maxTextWidth = [float]609

  function Get-NameSegmentWidth(
    [string]$text,
    [float]$top,
    [float]$bottom,
    [float]$widthScale
  ) {
    if ($text.Length -eq 0) {
      return [float]0
    }
    if ($text -eq "-") {
      return [float](24 * $widthScale)
    }

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddString(
      $text,
      $fontFamily,
      [int][System.Drawing.FontStyle]::Bold,
      [float]100,
      [System.Drawing.PointF]::new(0, 0),
      $format
    )
    $bounds = $path.GetBounds()
    $height = $bottom - $top
    $scaleY = $height / $bounds.Height
    $width = [float]($bounds.Width * $scaleY * $widthScale)
    $path.Dispose()
    return $width
  }

  function Add-NameSegment(
    [string]$text,
    [float]$left,
    [float]$top,
    [float]$bottom,
    [float]$widthScale
  ) {
    if ($text.Length -eq 0) {
      return [float]0
    }
    if ($text -eq "-") {
      $dashWidth = [float](24 * $widthScale)
      $dashY = [float](($top + $bottom) / 2)
      $pen = New-Object System.Drawing.Pen($brush.Color, [float](3.5 * $widthScale))
      $graphics.DrawLine($pen, [float]$left, $dashY, [float]($left + $dashWidth), $dashY)
      $pen.Dispose()
      return $dashWidth
    }

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddString(
      $text,
      $fontFamily,
      [int][System.Drawing.FontStyle]::Bold,
      [float]100,
      [System.Drawing.PointF]::new(0, 0),
      $format
    )
    $bounds = $path.GetBounds()
    $height = $bottom - $top
    $scaleY = $height / $bounds.Height
    $scaleX = $scaleY * $widthScale
    $state = $graphics.Save()
    $graphics.TranslateTransform(
      [float]($left - ($bounds.Left * $scaleX)),
      [float]($bottom - ($bounds.Bottom * $scaleY))
    )
    $graphics.ScaleTransform([float]$scaleX, [float]$scaleY)
    $graphics.FillPath($brush, $path)
    $graphics.Restore($state)
    $width = [float]($bounds.Width * $scaleX)
    $path.Dispose()
    return $width
  }

  function Get-NameRuns(
    [string]$word,
    [string]$sourceWord
  ) {
    $runs = New-Object System.Collections.Generic.List[object]
    $currentText = ""
    $currentIsLarge = $null

    for ($charIndex = 0; $charIndex -lt $word.Length; $charIndex++) {
      $char = $word.Substring($charIndex, 1)
      $sourceChar = $sourceWord.Substring($charIndex, 1)
      $isLarge = $charIndex -eq 0 -or ($sourceChar -cmatch '[A-Z]')
      if ($null -ne $currentIsLarge -and $currentIsLarge -ne $isLarge) {
        $runs.Add([PSCustomObject]@{ Text = $currentText; IsLarge = $currentIsLarge })
        $currentText = ""
      }
      $currentText += $char
      $currentIsLarge = $isLarge
    }

    if ($currentText.Length -gt 0) {
      $runs.Add([PSCustomObject]@{ Text = $currentText; IsLarge = $currentIsLarge })
    }

    return $runs
  }

  $words = @($nameText -split " " | Where-Object { $_.Length -gt 0 })
  $fullWidth = [float]0
  $sourceWords = @(($cleanName -split " ") | Where-Object { $_.Length -gt 0 })
  for ($wordIndex = 0; $wordIndex -lt $words.Count; $wordIndex++) {
    $word = $words[$wordIndex]
    $sourceWord = $sourceWords[$wordIndex]
    $previousRunWasLarge = $false
    foreach ($run in (Get-NameRuns $word $sourceWord)) {
      if ($previousRunWasLarge -and -not $run.IsLarge) {
        $fullWidth += $largeSmallGap
      }
      if ($run.IsLarge) {
        $fullWidth += Get-NameSegmentWidth $run.Text 69 115 1
      } else {
        $fullWidth += Get-NameSegmentWidth $run.Text 80 115 1
      }
      $previousRunWasLarge = $run.IsLarge
    }
    $fullWidth += $wordGap
  }
  if ($words.Count -gt 0) {
    $fullWidth -= $wordGap
  }
  $widthScale = if ($fullWidth -gt $maxTextWidth) { $maxTextWidth / $fullWidth } else { [float]1 }
  $x = [float]59

  for ($wordIndex = 0; $wordIndex -lt $words.Count; $wordIndex++) {
    $word = $words[$wordIndex]
    $sourceWord = $sourceWords[$wordIndex]
    $previousRunWasLarge = $false
    foreach ($run in (Get-NameRuns $word $sourceWord)) {
      if ($previousRunWasLarge -and -not $run.IsLarge) {
        $x += $largeSmallGap * $widthScale
      }
      if ($run.IsLarge) {
        $x += Add-NameSegment $run.Text $x 69 115 $widthScale
      } else {
        $x += Add-NameSegment $run.Text $x 80 115 $widthScale
      }
      $previousRunWasLarge = $run.IsLarge
    }
    $x += $wordGap * $widthScale
  }

  $brush.Dispose()
  $format.Dispose()
  $fontFamily.Dispose()
}

function Get-NameTextboxTemplateName([int64]$type) {
  if (($type -band 0x2) -ne 0) {
    return "spell-name-textbox.png"
  }
  if (($type -band 0x4) -ne 0) {
    return "trap-name-textbox.png"
  }
  if (($type -band 0x40) -ne 0) {
    return "fusion-name-textbox.png"
  }
  if (($type -band 0x80) -ne 0) {
    return "ritual-monster-name-textbox.png"
  }
  if (($type -band 0x2000) -ne 0) {
    return "synchro-name-textbox.png"
  }
  if (($type -band 0x800000) -ne 0) {
    return "xyz-name-textbox.png"
  }
  if (($type -band 0x20) -ne 0) {
    return "effect-monster-name-textbox.png"
  }

  return "normal-monster-name-textbox.png"
}

function Get-TextLayout([int]$width, [int]$height, [int64]$type) {
  $isSpellOrTrap = (($type -band 0x2) -ne 0) -or (($type -band 0x4) -ne 0)

  if ($isSpellOrTrap) {
    return @{
      Patch = New-Object System.Drawing.Rectangle(
        [int]($width * 56 / 813),
        [int]($height * 892 / 1185),
        [int]($width * 701 / 813),
        [int]($height * 218 / 1185)
      )
      TextMaskPoints = @(
        [System.Drawing.Point]::new([int]($width * 66 / 813), [int]($height * 892 / 1185)),
        [System.Drawing.Point]::new([int]($width * 747 / 813), [int]($height * 892 / 1185)),
        [System.Drawing.Point]::new([int]($width * 757 / 813), [int]($height * 902 / 1185)),
        [System.Drawing.Point]::new([int]($width * 757 / 813), [int]($height * 1100 / 1185)),
        [System.Drawing.Point]::new([int]($width * 747 / 813), [int]($height * 1110 / 1185)),
        [System.Drawing.Point]::new([int]($width * 66 / 813), [int]($height * 1110 / 1185)),
        [System.Drawing.Point]::new([int]($width * 56 / 813), [int]($height * 1100 / 1185)),
        [System.Drawing.Point]::new([int]($width * 56 / 813), [int]($height * 902 / 1185))
      )
      TextX = [int]($width * 0.083)
      TextY = [int]($height * 0.762)
      TextW = [int]($width * 0.816)
      TextH = [int]($height * 0.158)
      MinFont = [float]($height * 0.011)
      MaxFont = [float]($height * 0.026)
      IsMonster = $false
    }
  }

  return @{
    Patch = New-Object System.Drawing.Rectangle(
      [int]($width * 0.074),
      [int]($height * 0.755),
      [int]($width * 0.850),
      [int]($height * 0.180)
    )
    TextX = [int]($width * 0.080)
    TextY = [int]($height * 0.790)
    TextW = [int]($width * 0.825)
    TextH = [int]($height * 0.116)
    TypeX = [int]($width * 0.080)
    TypeY = [int]($height * 0.755)
    TypeW = [int]($width * 0.825)
    TypeFont = [float]($height * 0.023 + 3)
    StatY = [int]($height * 0.913)
    StatRight = [int]($width * 0.908)
    StatFont = [float]($height * 0.021 + 4)
    MinFont = [float]($height * 0.009)
    MaxFont = [float]($height * 0.022)
    IsMonster = $true
  }
}

function Add-SpellTrapSubtypeIcon(
  [System.Drawing.Graphics]$graphics,
  [int]$width,
  [int]$height,
  [int64]$type
) {
  $isEquip = ($type -band 0x40000) -ne 0
  if (-not $isEquip) {
    return
  }

  $templatePath = Get-SourcePath 69243953
  if ($null -eq $templatePath) {
    throw "Missing Equip Spell subtype icon source image: 69243953"
  }

  $templateBytes = [System.IO.File]::ReadAllBytes($templatePath)
  $templateStream = New-Object System.IO.MemoryStream @(,$templateBytes)
  $templateImage = [System.Drawing.Image]::FromStream($templateStream)
  $templateBitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $templateGraphics = [System.Drawing.Graphics]::FromImage($templateBitmap)
  $templateGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $templateGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $templateGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $templateGraphics.DrawImage($templateImage, 0, 0, $width, $height)

  $subtypeRect = New-Object System.Drawing.Rectangle(
    [int]($width * 390 / 813),
    [int]($height * 130 / 1185),
    [int]($width * 380 / 813),
    [int]($height * 78 / 1185)
  )
  $graphics.DrawImage($templateBitmap, $subtypeRect, $subtypeRect, [System.Drawing.GraphicsUnit]::Pixel)

  $templateGraphics.Dispose()
  $templateBitmap.Dispose()
  $templateImage.Dispose()
  $templateStream.Dispose()
}

$missing = New-Object System.Collections.Generic.List[int]
$rendered = New-Object System.Collections.Generic.List[object]

foreach ($card in $cards) {
  $source = Get-SourcePath ([int]$card.id)
  if ($null -eq $source) {
    $missing.Add([int]$card.id)
    continue
  }

  $output = Join-Path $assetsDir "$($card.id).jpg"
  $bytes = [System.IO.File]::ReadAllBytes($source)
  $inputStream = New-Object System.IO.MemoryStream @(,$bytes)
  $src = [System.Drawing.Image]::FromStream($inputStream)
  $bitmap = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.DrawImage($src, 0, 0, $targetWidth, $targetHeight)
  $sourceBitmap = $bitmap.Clone()

  $targetType = [int64]$card.type
  $sourceType = [int64]$card.sourceType
  if (
    (($targetType -band 0x20) -ne 0) -and
    (($targetType -band 0x10) -eq 0) -and
    (($sourceType -band 0x10) -ne 0) -and
    (($sourceType -band 0x20) -eq 0)
  ) {
    Convert-NormalMonsterFrameToEffect $bitmap
    Restore-MonsterIconsFromSource $graphics $sourceBitmap ([int]$card.level)
  }

  $layout = Get-TextLayout $bitmap.Width $bitmap.Height ([int64]$card.type)
  $preserved = $null
  if ($layout.ContainsKey("Preserve")) {
    $preserved = $bitmap.Clone($layout.Preserve, $bitmap.PixelFormat)
  }
  $preservedRects = @()
  if ($layout.ContainsKey("PreserveRects")) {
    foreach ($rect in $layout.PreserveRects) {
      $preservedRects += [PSCustomObject]@{
        Rect = $rect
        Bitmap = $bitmap.Clone($rect, $bitmap.PixelFormat)
      }
    }
  }
  $background = Get-LightAverageBrush $bitmap $layout.Patch
  if ($layout.ContainsKey("TextMaskPoints")) {
    $graphics.FillPolygon($background, $layout.TextMaskPoints)
  } else {
    $graphics.FillRectangle($background, $layout.Patch)
  }
  $background.Dispose()
  if ($preserved) {
    $graphics.DrawImage($preserved, $layout.Preserve)
    $preserved.Dispose()
  }
  foreach ($entry in $preservedRects) {
    $graphics.DrawImage($entry.Bitmap, $entry.Rect)
    $entry.Bitmap.Dispose()
  }

  $textBlock = Get-FittedTextBlock $graphics ([string]$card.desc) ([int]$layout.TextW) ([int]$layout.TextH) ([float]$layout.MinFont) ([float]$layout.MaxFont)
  $font = $textBlock.Font
  $fontSize = [float]$textBlock.FontSize
  $lines = $textBlock.Lines
  $lineHeight = [int]$textBlock.LineHeight

  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
  if ($layout.IsMonster) {
    $typeFont = New-Object System.Drawing.Font("Times New Roman", [float]$layout.TypeFont, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $graphics.DrawString(
      (Get-MonsterTypeLine ([int64]$card.type) ([int64]$card.race)),
      $typeFont,
      $brush,
      [float]$layout.TypeX,
      [float]$layout.TypeY
    )
    $typeFont.Dispose()
  }

  $y = [int]$layout.TextY
  foreach ($line in $lines) {
    $graphics.DrawString($line, $font, $brush, [float]$layout.TextX, [float]$y)
    $y += $lineHeight
  }

  if ($layout.IsMonster) {
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::Black, [Math]::Max(1.0, $bitmap.Height * 0.002))
    $lineY = [int]($bitmap.Height * 0.912)
    $graphics.DrawLine(
      $pen,
      [int]($bitmap.Width * 0.074),
      $lineY,
      [int]($bitmap.Width * 0.920),
      $lineY
    )
    $pen.Dispose()

    $statFont = New-Object System.Drawing.Font("Times New Roman", [float]$layout.StatFont, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $atk = if ([int]$card.atk -lt 0) { "?" } else { [string][int]$card.atk }
    $def = if ([int]$card.def -lt 0) { "?" } else { [string][int]$card.def }
    $statText = "ATK/  $atk DEF/  $def"
    $statSize = $graphics.MeasureString($statText, $statFont)
    $graphics.DrawString(
      $statText,
      $statFont,
      $brush,
      [float]($layout.StatRight - $statSize.Width),
      [float]$layout.StatY
    )
    $statFont.Dispose()
  }

  if ($card.nameChangedByRedux) {
    Add-CardNameText $graphics $bitmap ([string]$card.name) ([int64]$card.type)
  }
  if ([string]$card.name -like "[[]Redux[]]*") {
    Add-ErrataMarker $graphics $bitmap.Width $bitmap.Height ([int64]$card.type)
  }
  Add-SpellTrapSubtypeIcon $graphics $bitmap.Width $bitmap.Height ([int64]$card.type)

  $out = New-Object System.IO.MemoryStream
  $bitmap.Save($out, $jpegCodec, $encoderParams)
  $newBytes = $out.ToArray()
  $out.Dispose()
  $brush.Dispose()
  $font.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
  $sourceBitmap.Dispose()
  $src.Dispose()
  $inputStream.Dispose()

  $status = "Written"
  if (Test-Path -LiteralPath $output) {
    $existingBytes = [System.IO.File]::ReadAllBytes($output)
    if ($existingBytes.Length -eq $newBytes.Length) {
      $same = $true
      for ($i = 0; $i -lt $existingBytes.Length; $i++) {
        if ($existingBytes[$i] -ne $newBytes[$i]) {
          $same = $false
          break
        }
      }
      if ($same) {
        $status = "Unchanged"
      }
    }
  } else {
    $status = "New"
  }

  if ($status -ne "Unchanged") {
    [System.IO.File]::WriteAllBytes($output, $newBytes)
  }

  $rendered.Add([PSCustomObject]@{
    Id = [int]$card.id
    Name = [string]$card.name
    Status = $status
    Bytes = [int](Get-Item -LiteralPath $output).Length
    FontSize = [Math]::Round($fontSize, 2)
    Lines = $lines.Count
  })
}

$rendered | Format-Table -AutoSize
$changed = @($rendered | Where-Object { $_.Status -ne "Unchanged" })
if ($changed.Count -gt 0) {
  Write-Host ""
  Write-Host "Updated $($changed.Count) image(s):"
  $changed | Format-Table Id, Name, Status, Bytes -AutoSize
} else {
  Write-Host ""
  Write-Host "No image files changed."
}
if ($missing.Count -gt 0) {
  throw "Missing source image(s): $($missing -join ', ')"
}
