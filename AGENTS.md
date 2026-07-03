# Project Context

This project is a fork-style customization of EDOPro, made by the Project
Ignis team, started from its distributable / portable release rather than a
git fork of the upstream repo.

The current goal is to build a pre-XYZ era Yu-Gi-Oh! experience through data
customization only:

- edit the forbidden / limited list
- limit the playable card pool
- apply custom card erratas

In EDOPro, `.lflist.conf` files hold the combined forbidden /
limited list data and the allowed card-pool data for a format.

# Development Workflow

The custom format is built from project-owned inputs under `Redux/`:

- Use [Node.js LTS 22](https://nodejs.org/) for the Redux build scripts.
- `Redux/vanilla/` contains baseline source snapshots. Treat these as immutable
  after they are intentionally added.
- `Redux/scripts/` contains the readable build / transformation scripts. Future
  card errata, stat edits, text edits, and card-pool changes should be expressed
  here so Git history explains the project changes.
- `Redux/assets/pics/` contains tracked Redux-owned card-image overrides.
- `Redux/modded/` is generated data output for databases and the LF list. Do
  not hand-edit generated files here; update the scripts and rebuild instead.

Run the build from the repository root:

```powershell
node .\Redux\scripts\build.js
```

The build deletes and recreates `Redux/modded/`, copies baseline databases and
the LF list from `Redux/vanilla/`, and then applies transformations declared in
`Redux/scripts/`. The EDOPro local repo entry in `config/configs.json` reads
generated `.cdb` and `.lflist.conf` files from `Redux/modded/`, Lua overrides
from `Redux/scripts/card-scripts/`, and card-image overrides from
`Redux/assets/pics/`; it must stay local-only with updates disabled.

On Windows in Codex, a sandboxed build may report `EPERM` while deleting a
generated `.cdb` file in `Redux/modded/`, even when EDOPro is not running. If
the build fails at `fs.rmSync` / `unlink` there, rerun the same build with
approval to replace generated output before diagnosing it as a client file
lock.

For new Redux changes:

1. Do not edit files in `Redux/modded/` by hand.
2. Do not edit the baseline in `Redux/vanilla/` when making a format change.
3. Express LF list and database changes in `Redux/scripts/`, then rebuild.
   Express effect-script overrides in `Redux/scripts/card-scripts/`, which
   EDOPro reads directly.
4. Update `README.md` whenever a card's forbidden / limited status, stats, or
   other card properties change, or its effect / English card text is errataed.
   Document all Redux banned-list changes in the banned-list table and all
   custom errata in the errata table.
5. Verify generated output after the build, and verify behavior in EDOPro when
   runtime load order or effect behavior matters.

In the `README.md` errata table, describe changes in short and simplistic summary phrases (easy language)
consistent with the existing entries rather than full card-text wording.

In errataed card effect text (`.cdb` desc fields), do not insert line breaks
(`\n`). Write the effect as continuous prose. The only exceptions are bullet
points of list-style effects (`●` lines), the standard Fusion / Synchro / Xyz
materials line at the start of the text (for example `1 Tuner + 1+ non-Tuner
monsters`), the `(This card is always treated as a "…" card.)` prefix when
followed by the rest of the effect, and cases where the user explicitly
requests a line break.

When changing a card, check whether the selected passcode has alternate-art or
alias print rows in the relevant `.cdb`. Apply the `[Redux]` name prefix, text
changes, type/stat/property changes, and needed image metadata fixes to every
print row for that same card, not only the first passcode found.

Redux-owned card image overrides belong only in `Redux/assets/pics/`; EDOPro
reads that folder directly through `config/configs.json`. Root `/pics` is only
a local client cache.
Redux card-image rendering should use clean vanilla source images from
`Redux/cache/pics/`, not generated images from `Redux/assets/pics/`, so repeated
render runs do not stack edits on top of previous Redux artwork. Keep
`Redux/cache/` ignored; it is a local source cache, not a tracked asset folder.
When an image override is needed, prefer deterministic local editing in Codex
from a high-resolution source image. Find or download clean source art directly
when possible. Validate dimensions and file signatures, convert to the expected
format if needed, then place final overrides in `Redux/assets/pics/`. Update all
visible card-image metadata changes such as name, attribute, Level/Rank,
ATK/DEF, monster type, Tuner/Fusion/Synchro/etc. labels, and Spell/Trap
subtype. For Redux errata, render the generated `.cdb` effect text onto the
image for every same-card print/alternate artwork, instead of preserving
outdated printed source text. If a legacy or pre-official-errata passcode only
has a blurry source image, check whether it aliases to a newer official passcode
and use that cleaner art as the base when it preserves the intended artwork/card
identity; this may include using a newer official print as the source because
Redux renders the generated `.cdb` text over it anyway. Only ask the user for image-source help when local files, aliases,
configured download sources, and reasonable automated fixes are not enough.
Redux errata card images use a visual marker: `Redux/scripts/render-card-image-text.ps1`
applies the golden frame and shiny gold `R` marker deterministically.
Do not keep preview experiments under `Redux/previews/` once a marker style is
chosen.
For Spell/Trap errata image text replacement, keep the textbox overwrite simple:
use the card's sampled textbox background color and the requested text-box shape
only. Do not invent extra borders, outlines, or separately colored corner
patches.
For monster errata image text replacement, repaint the generated effect area
from the clean source and redraw the monster type line plus ATK/DEF from `.cdb`
metadata, not only the effect text.

Legacy / pre-errata cards may come from supplemental baseline databases such as
`cards-unofficial.cdb`, not only `cards.cdb`.

`Redux/vanilla/2011-Redux.lflist.conf` intentionally accounts for cards that
have distinct pre-errata and post-errata passcodes. Treat the card IDs selected
in that list as authoritative for the Redux format; do not replace them with
modern-version IDs merely because the modern record appears in `cards.cdb`.
For example, the list intentionally uses the pre-errata Makyura the Destructor
passcode (`21593987`) instead of its post-errata passcode (`21593977`).

Do not change the EDOPro client, engine, or software behavior unless the
user explicitly asks for that. Treat this as a card-pool and card-data project,
not a client development project.

# Upstream Refresh Checklist

These deliberate differences from the portable EDOPro release must be
reapplied or preserved when refreshing files from upstream:

- The distributed client executable is `Ignis-Redux-11.exe`, not `EDOPro.exe`.
  Its window title, Product name, and File description are `Ignis-Redux-11`;
  its upstream `Original filename` metadata remains `EDOPro.exe`. After adding
  a refreshed upstream `EDOPro.exe` at the repository root, run
  `node .\Redux\scripts\brand-client.js` to apply the branding and replace it
  with the fork-named executable. That script also changes the client's
  built-in Master Rule 1 duel preset into the default `Redux-11` ruleset:
  Master Rule 1 with first-turn draw disabled.
- The custom LF list is generated as `Redux/modded/Redux-11.lflist.conf` and
  displays as `Redux-11`. The intentionally immutable baseline remains
  `Redux/vanilla/2011-Redux.lflist.conf`; its name is transformed only by
  `Redux/scripts/build-lflist.js`.
- The local generated-data repository label in `config/configs.json` is
  `Redux-11`, matching the LF list. Its repo path is `./Redux`, with generated
  data and LF list files in `modded`, script overrides in
  `scripts/card-scripts`, and image overrides in `assets/pics`.

# User Context

The user knows the basics of JS, TS, Node.js, HTML, SQL, Git, and related tools,
but may not have domain-specific context for Android apps, game clients, mods,
or C/C++ code. Handle domain-specific implementation details proactively and
explain them when they matter.
