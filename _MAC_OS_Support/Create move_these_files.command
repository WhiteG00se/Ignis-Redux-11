#!/usr/bin/env bash
set -euo pipefail

SUPPORT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SUPPORT_ROOT/.." && pwd)"
OUTPUT_DIR="$SUPPORT_ROOT/move_these_files"
ZIP_PATH="$SUPPORT_ROOT/move_these_files.zip"
STATUS=0
ZIP_CREATED=0

copy_tree() {
  local source="$1"
  local destination="$2"
  mkdir -p "$(dirname "$destination")"
  cp -R "$source" "$destination"
}

echo ""
echo "Ignis-Redux-11 Mac support packager"
echo "==================================="
echo ""

REQUIRED=(
  "$REPO_ROOT/Redux/modded/cards.cdb"
  "$REPO_ROOT/Redux/modded/cards-unofficial.cdb"
  "$REPO_ROOT/Redux/modded/Redux-11.lflist.conf"
  "$REPO_ROOT/config/configs.json"
)

MISSING=()
for path in "${REQUIRED[@]}"; do
  [[ -e "$path" ]] || MISSING+=("$path")
done

if ((${#MISSING[@]} > 0)); then
  echo "Missing required files in this clone:"
  printf '  %s\n' "${MISSING[@]}"
  STATUS=1
else
  echo "Preparing move_these_files from scratch..."
  rm -rf "$OUTPUT_DIR" "$ZIP_PATH"
  mkdir -p "$OUTPUT_DIR"

  copy_tree "$REPO_ROOT/Redux/modded" "$OUTPUT_DIR/Redux/modded"
  copy_tree "$REPO_ROOT/Redux/scripts/card-scripts" "$OUTPUT_DIR/Redux/scripts/card-scripts"
  copy_tree "$REPO_ROOT/Redux/assets/pics" "$OUTPUT_DIR/Redux/assets/pics"
  copy_tree "$REPO_ROOT/config/configs.json" "$OUTPUT_DIR/config/configs.json"

  echo ""
  echo "Created folder:"
  echo "  $OUTPUT_DIR"

  if command -v zip >/dev/null 2>&1; then
    echo ""
    echo "Creating move_these_files.zip..."
    if (cd "$OUTPUT_DIR" && zip -qr "$ZIP_PATH" Redux config); then
      ZIP_CREATED=1
      echo "Created zip:"
      echo "  $ZIP_PATH"
    else
      echo "Could not create move_these_files.zip. Use the folder instead."
    fi
  else
    echo ""
    echo "zip not found. Use the move_these_files folder instead."
  fi
fi

echo ""
echo "=========================================="
if [[ $STATUS -eq 0 ]]; then
  echo "Ignis-Redux-11 Mac files are ready."
else
  echo "Packaging failed."
fi
echo "=========================================="
echo ""

if [[ $STATUS -eq 0 ]]; then
  if [[ $ZIP_CREATED -eq 1 ]]; then
    echo "Use either:"
    echo "  $ZIP_PATH"
    echo "  $OUTPUT_DIR"
  else
    echo "Use:"
    echo "  $OUTPUT_DIR"
  fi
  echo ""
  echo "Install:"
  echo "  1. Install vanilla Project Ignis EDOPro for Mac."
  echo "  2. Copy Redux and config from move_these_files into your EDOPro folder"
  echo "     (the one with EDOPro.app, config, and script)."
  echo "  3. In EDOPro, select Redux-11 banlist / rules."
  echo ""
  echo "Note: back up config/configs.json first if you changed it."
fi

echo ""
read -r -p "Press Enter to close..."
exit "$STATUS"
