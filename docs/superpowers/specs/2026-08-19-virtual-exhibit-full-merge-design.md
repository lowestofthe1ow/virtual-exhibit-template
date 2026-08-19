# Virtual Exhibit Umbrella Integration (All 53) — Design

- **Date:** 2026-08-19
- **Status:** Approved design, pre-implementation
- **Author:** Justin Rainier Go (with Claude)
- **Source data:** `docs/CSARCH2 Web exhibit information (Responses).xlsx` (53 rows)
- **Supersedes:** `2026-07-22-virtual-exhibit-integration-design.md` (38 exhibits, stale tier data)

## Goal

Merge all **53** CSARCH2 student virtual-exhibit repositories into the single
Astro + MDX umbrella site — one repo, one `astro build`, one deploy — with every
exhibit on its own route and listed in one gallery.

## What changed since the 2026-07-22 design

The previous design was written against a 38-row spreadsheet and an
`integration-compatibility.csv` that no longer exists. This revision re-derives
everything from the 53-row sheet and from a fresh clone-and-inspect pass over
all 53 repositories.

1. **53 exhibits, not 38.** S01–S05 have 9 groups each; S40 has 8.
2. **The gallery is data-driven, not glob-driven.** `HomepageLayout.astro`
   reads `src/data/exhibits.json`; it no longer runs
   `Astro.glob('../pages/*.mdx')`. The old "add gallery frontmatter" step is
   obsolete.
3. **`s02g4_2` is really `s40g4`.** The updated sheet lists "[Group 4] FDE
   Exhibit" (`Michael-Maglente/-CSARCH2-Group-2`) under S40 G4, not S02 G4.
4. **Tier assignments were wrong in several places** because the old data
   compared files without normalizing line endings. `s02g3`, previously tiered
   "rework" for modifying `ExhibitLayout.astro` and `global.css`, has
   byte-identical copies of both once CRLF is stripped.
5. **Asset weight is a first-class problem.** `src/` + `public/` across the 53
   repos totals **757 MB**, against a 1 GB GitHub Pages published-site limit.
   The old design never measured this.

## Non-goals

- Redesigning individual exhibits' content or visuals.
- Upgrading the umbrella to a newer Astro major.
- Rewriting the Next.js exhibit as MDX (it is static-embedded instead).

## Decisions locked in

1. **Integration model:** source-level merge into one Astro site.
2. **Baseline:** Astro 5 + React 18, union of all dependencies.
3. **Git:** commit per exhibit, straight to `main`.
4. **Assets:** prune losslessly, then optimize everything that remains.
5. **Escape hatch:** any exhibit that resists source-merge is built in place and
   embedded as static output under `public/<slug>/`.

## Baseline: Astro 5 + React 18 (forced, not chosen)

The previous design picked Astro 5 / React 18 by plurality. Recon gives a hard
constraint instead:

- `s02g4` and `s04g7` depend on `@react-three/fiber@^8.18.0`, which does not
  support React 19. React 18 is therefore the only version that satisfies every
  exhibit.
- No exhibit uses a React-19-only API (`useActionState`, `useFormStatus`,
  `useOptimistic`), and none uses `defaultProps`, `propTypes`, or
  `ReactDOM.render`. Nothing pulls in the other direction.

Observed distribution across the 53 repos:

| | Versions |
|---|---|
| Astro | 5 × 34, 7 × 8, 6 × 6, 4 × 4 |
| React | 18 × 41, 19 × 11 |
| Tailwind | v4 × 12 (`@tailwindcss/vite`), v3 × 2 (`@astrojs/tailwind@5`) |

`s01g3` additionally lists `tailwindcss@^4` in `package.json` but wires it
nowhere — no integration, no config, no directives. It is a dead dependency and
is dropped; that exhibit uses `webcoreui` + `sass-embedded`, which is its actual
tier-B adaptation need (a Sass toolchain must be added to the umbrella).

75 distinct third-party dependencies. Every version conflict resolves within a
semver minor range except the Tailwind major split: `s01g5` and `s03g3` migrate
from v3 to v4 so a single `tailwindcss` version serves all 14 Tailwind exhibits.

The 7 exhibits authored against Astro 4/6/7 are fixed per exhibit. Their content
is ordinary MDX plus components, so breaks are expected at the config level
rather than in page source.

## Architecture — one namespace per exhibit

Each exhibit gets slug `s<section>g<group>`:

```
src/pages/<slug>.mdx        Entry page -> route /<slug>
src/pages/<slug>/...        Sub-pages for multi-page exhibits
src/components/<slug>/...   All of the exhibit's components
src/assets/<slug>/...       Bundled assets
src/styles/<slug>/...       Styles (a directory: 9 exhibits ship 5+ stylesheets)
public/<slug>/...           Only what must bypass the bundler (3D models,
                            HDR/EXR maps, s02g7's static export)
```

Rules:

- **Never modify** `src/layouts/ExhibitLayout.astro` or the shared
  `src/styles/global.css`. `HomepageLayout.astro` is the umbrella's own file and
  may be edited.
- The 7 exhibits that really modified `ExhibitLayout.astro` get their version
  copied to `src/components/<slug>/Layout.astro` and referenced from their own
  pages only.
- Import paths are rewritten mechanically to the namespaced locations.
- Inherited template leftovers (`linux.mdx`, the stock `DistroQuiz.jsx` /
  `ImageGallery.jsx` / `TextWithImage.astro`, the Linux distro PNGs) are dropped
  on merge — the umbrella already provides them.

### Gallery integrity

`src/data/exhibits.json` already contains all 53 entries, so a card renders
whether or not its page exists — a broken exhibit would show a card linking to a
404. Each entry gains a **`status`** field; `HomepageLayout.astro` renders only
`status: "live"` entries, and each exhibit flips to `"live"` in the same commit
that lands its page.

## Style isolation

- Each exhibit's `global.css` becomes `src/styles/<slug>/base.css`, wrapped so
  its selectors cannot escape the exhibit.
- **Tailwind v4:** one shared install. Per-exhibit CSS imports `theme.css` and
  `utilities.css` as layers but **omits preflight**, which is the only genuinely
  global part. Where an exhibit visibly depends on preflight's reset, it is
  re-added scoped under that exhibit's wrapper element. Per-exhibit `@theme`
  token blocks are namespaced so one exhibit's `--color-primary` cannot
  overwrite another's.
- Three exhibits (`s02g6`, `s40g2`, `s40g7`) put Tailwind directives inside
  `global.css`; that is why they show very large `global.css` diffs. They are
  split into a scoped Tailwind entry plus their own base styles.

## Asset strategy

757 MB of `src/` + `public/` payload. Two passes, lossless first.

### Pass 1 — prune (lossless, ~224 MB)

Media files with no reference anywhere in the repo's source are dropped, along
with proposal PDFs and DOCX files (35 MB), which are not exhibit content.

Confirmed by inspection:

- **`s02g8`** — `voice_media1.mp4` (75 MB) and `voice_media2.mp4` (26 MB) are
  unreferenced; `HCITimeline.jsx` sources the Voice/Media section from YouTube
  embed URLs. Both are deleted, taking s02g8 from 108 MB to ~5 MB.
- **`s02g9`** — `historic_cloister_passage_4k.exr` (22 MB) is unreferenced.

**Caveat:** orphan detection is basename matching and cannot see references
built dynamically. Seven repos use `import.meta.glob` — `s03g2`, `s03g5`,
`s03g7`, `s03g8`, `s04g1`, `s05g5`, `s40g5` — and are **excluded from automatic
pruning**; their orphan candidates are verified by hand first. `s03g8`'s
18.8 MB of `Desk *.png` is a known false positive.

### Pass 2 — optimize (lossy, on the ~533 MB that remains)

| Type | Conversion | Reference impact |
|---|---|---|
| PNG / JPG | downscale to max 2560px, re-encode WebP q82 | rewrite `.png`/`.jpg` -> `.webp` |
| GIF | -> **animated WebP** (renders in a plain `<img>`) | rewrite `.gif` -> `.webp` |
| MP4 | re-encode H.264 CRF 24 + AAC, cap 1080p | none |
| GLB | `gltf-transform` Draco + texture resize | none |
| SVG | downscale bitmaps embedded in the 3 raster-stuffed files | none |
| EXR / HDR | downscale to 2K | none |

Extension changes are applied in the same mechanical pass that rewrites import
paths for namespacing. GIF converts to animated WebP rather than MP4
specifically so that `<img>` tags need no markup change.

Every conversion is scripted and logged to a before/after report
(`docs/asset-optimization-report.md`) recording each file's old size, new size,
and settings, so any visual regression is traceable to a specific conversion.

**Accepted risk:** blanket optimization touches hundreds of files and can cause
subtle visual regressions. Mitigation is the per-exhibit render check below; any
exhibit that cannot be made to look right is reported rather than silently
shipped.

Tooling available: `ffmpeg`, ImageMagick, `cwebp`, `avifenc`, `gifsicle`,
`rsvg-convert`. `gltf-transform` is run via `npx`.

## Homepage

Top 15 exhibits by `ARCH MUSEUM RANKINGS.xlsx`, then the remaining 38 grouped
under S01 / S02 / S03 / S04 / S05 / S40 headings.

Rankings are read from `src/data/rankings.json` so the spreadsheet can be
converted in without touching layout code. **That xlsx is not yet available**;
until it is, the top row falls back to the first 15 entries in section/group
order, and the layout code is written so that swapping in real rankings is a
data change only.

## Exhibit map (53)

Tier: **A** drop-in · **B** adapt (Tailwind and/or non-5 Astro) · **C** rework
(own layout, modified `global.css`, index-squatter, or dynamic routes) · **D**
static embed.

| Slug | Tier | Astro | TW | Title | Repo |
|---|---|---|---|---|---|
| s01g1 | done | 5 | | Journey of a Message | DMDLSU/virtual-exhibit-template |
| s01g4 | done | 5 | | Instruction Level Parallelism | jeroentenorio930/instruction-level-parallelism |
| s01g7 | A | 5 | | Full Capacity | skyparado/virtual-exhibit-template |
| s01g8 | A | 5 | | GPU Wars | K-K-R-C/CSARCH2-G8-GPU-WARS-FORKED- |
| s02g2 | A | 5 | | Made in Asia | justineaniko/csarch-virtual-exhibit |
| s03g4 | A | 5 | | The Apollo Guidance Computer | chiramisu/S03-CSARCH2-G4-AGC |
| s03g6 | A | 5 | | Multicore Processors | Kwimbowo/virtual-exhibit-67cores |
| s03g8 | A | 5 | | The Chiplet Revolution | Kemo1006/CSARCH2-Chiplet-Revolution |
| s04g2 | A | 5 | | Virtual Memory | Hase1202/virtual-exhibit-template |
| s04g3 | A | 5 | | Microprogramming | beepatricio/CSARCH2_VirtualExhibit |
| s04g6 | A | 5 | | Inside-RAM | dev-gabb-711/arch2-case-study-2 |
| s04g7 | A | 5 | | The Glass Canvas | 20-ash/CSARCH2-virtual-exhibit |
| s04g9 | A | 5 | | Flash Memory | pitowalosian/CSARCH2-ADEOS |
| s05g1 | A | 5 | | The Enigma Machine | shaocodes/virtual_exhibit_g1 |
| s05g6 | A | 5 | | History of ARM Architecture | miraiTee/ARCH2---VET-G6-S05- |
| s05g7 | A | 5 | | History of Macintosh | Aidan-Papa/CSARCH2-Group-7 |
| s05g8 | A | 5 | | Bytes of the Past | festivities/CSARCH2-S05-Y2526T3_virtual-exhibit |
| s40g1 | A | 5 | | Alice Through the Snooping Bus | 04leafcloverr/virtual-exhibit |
| s40g3 | A | 5 | | How Drawing Tablets Work | Enzo-user/virtual-exhibit-template |
| s40g6 | A | 5 | | Understanding USB-C | TheNinjaDude12/virtual-exhibit-template |
| s40g8 | A | 5 | | How SSDs Work | trem4ngo/virtual-exhibit-grp8 |
| s01g2 | B | 5 | TW | FreeBSD | notgian/freebsd-virtual-exhibit |
| s01g3 | B | 5 | | Evolution of Wi-Fi (Sass/webcoreui) | mykanadine/WifiGeneration |
| s01g5 | B | 4 | TW v3 | Silicon Minds | theoithinkk/virtual-exhibit-template |
| s01g6 | B | 5 | TW | The Evolution of Wifi | pring-nt/virtual-exhibit-wifi-evolution |
| s01g9 | B | 5 | TW | ARM vs x86 | zachhallare/virtual-exhibit-template |
| s02g3 | B | 4 | | Evolution of Windows OS | pyxlaria/CSARCH2-Virtual-Exhibit-Group-3 |
| s03g1 | B | 5 | TW | The Heartbleed Bug | 2ru17/virtual-exhibit-proj-2026-g1 |
| s03g2 | B | 6 | | FATAL CONVERS10N | DREV-c/G2-S03-virtual-exhibit (integration/final) |
| s03g3 | B | 5 | TW v3 | Memory Block Blast | rdgonzaga/memory-block-blast |
| s03g5 | B | 7 | | The Y2K & Y2K38 Bug | mbchavez27/arch-virtual-exhibit |
| s03g7 | B | 7 | | Project Spectre | imnotneon-dev/CSARCH2-Virtual-Exhibit |
| s04g8 | B | 5 | TW | Inside a Digital Image | PrinceMPS/virtual-exhibit-template |
| s05g3 | B | 5 | TW | The Internet's Journey | HungryDavid/virtual-exhibit-template |
| s05g4 | B | 5 | TW | Mga Nanguna | Oldcow25/Group4_CSARCH2_... |
| s05g9 | B | 7 | | Kumusta Mundo | tartar121/KumustaMundo |
| s40g5 | B | 7 | | Cloud Storage Architecture | robnigel0313/CSARCH2-G5-S40-Virtual-Exhibit |
| s02g1 | C | 5 | | From Mainframes to Microprocessors | seoyunnie/ARCH2-Mainframes-to-Microprocessors |
| s02g4 | C | 4 | TW | Evolution of Computer Graphics | kimsajaang/... (deployment-v2) |
| s02g5 | C | 6 | | From Pixels to Polygons | margz05/CSARCH2-S02-Group5 |
| s02g6 | C | 7 | TW | Computing in the Philippines | gabe-0017/CSARCH2-Group-6 |
| s02g8 | C | 7 | | Human-Computer Interaction | rainahlga/CSARCH2-HCI-Virtual-Exhibit |
| s02g9 | C | 7 | | CipherToSilicon | NathanJC2/CipherToSilicon |
| s03g9 | C | 6 | | GO or ABORT: Apollo 11 1202 | hsimingg/CSARCH2-G9-Exhibit |
| s04g1 | C | 6 | | Inside the ALU | CSARCH2-GROUP1/CSARCH2-Virtual-Exhibit-Group-1 |
| s04g4 | C | 6 | | Bus Arbitration | kekekoby/CSARCH2_S04_G4 |
| s04g5 | C | 5 | TW | CPU Cache Visualizer | gbrlgrg/arch2-virtual-exhibit-group5 |
| s05g2 | C | 5 | | HerStory | oresamu/CSARCH2_Case-Study |
| s05g5 | C | 7 | | deep-dive-apollo | sauv1gnon/csarch2-virtual-exhibit |
| s40g2 | C | 4 | TW | CLOCKWORK | chewsdaycat/CSARCH2_GRP2 |
| s40g4 | C | 5 | | [Group 4] FDE Exhibit | Michael-Maglente/-CSARCH2-Group-2 |
| s40g7 | C | 6 | TW | GPU Texture Filtering | cath-felix/CSARCH2-Case-Project |
| s02g7 | D | — | | x86-64 NASM History | JoseBryanPerez/CSARCH2_Group_7 |

Counts: 2 done, 19 tier A, 16 tier B, 15 tier C, 1 tier D.

### Rework reasons (tier C)

| Slug | Reason |
|---|---|
| s02g1 | `global.css` rewritten (239 lines changed) |
| s02g4 | Content on `index.astro` + `timeline.astro`; Astro 4; Tailwind |
| s02g5 | `ExhibitLayout` rewritten (173); `global.css` rewritten; content on `index.astro` with decade sub-dirs |
| s02g6 | No `layouts/` dir; Tailwind inside `global.css`; content on `index.astro` |
| s02g8 | Exhibit lives in `index.mdx` |
| s02g9 | Content on `index.astro`; own `Layout.astro`; 39 components; 3D museum + photo-sphere |
| s03g9 | Own `S03_Group9_Layout.astro`; `global.css` rewritten (604); content on `index.astro` |
| s04g1 | `ExhibitLayout` rewritten (129); `global.css` rewritten (263); dynamic route `operations/[slug].astro` |
| s04g4 | Exhibit lives in `index.mdx` with 5 top-level sibling pages |
| s04g5 | `ExhibitLayout` tweaked; Tailwind; own visualizer layout |
| s05g2 | `ExhibitLayout` tweaked (6); `global.css` modified (154) |
| s05g5 | `ExhibitLayout` tweaked (18); whole exhibit wrapped in one component |
| s40g2 | `ExhibitLayout` rewritten (145); `global.css` rewritten (531); Tailwind inside `global.css` |
| s40g4 | `ExhibitLayout` tweaked (4) |
| s40g7 | Own `BaseLayout.astro`; `global.css` rewritten (1286); Tailwind inside `global.css` |

### s02g7 (tier D)

Next.js 16 + React 19 + Blockly, living under `x86-history/`, with a
`patch-package` postinstall step. `next.config.mjs` has no `output: 'export'`,
so static export needs that plus `images.unoptimized`. Built in place, output
copied to `public/s02g7/`, linked from its gallery card. Fallback if export
fails: link out to the existing deployment.

## Per-exhibit procedure

1. Copy pages to `src/pages/<slug>.mdx` (+ `src/pages/<slug>/`), components to
   `src/components/<slug>/`, assets to `src/assets/<slug>/`, styles to
   `src/styles/<slug>/`.
2. For index-squatters, promote the index content to `src/pages/<slug>.mdx`.
3. Drop template leftovers and pruned assets.
4. Run the asset optimizer over the exhibit's assets.
5. Rewrite import paths and changed extensions; give layout-modifying exhibits
   their own `Layout.astro`.
6. Scope styles; handle Tailwind via the shared v4 install without preflight.
7. Set `status: "live"` on the exhibit's `exhibits.json` entry.
8. `npm run build` must stay green and `/<slug>` must render.
9. If it resists after reasonable effort, fall back to static embed under
   `public/<slug>/`.
10. Commit as `feat: <slug> integration`.

## Phases

| Phase | Work | Gate |
|---|---|---|
| 0 | Dependency union, Tailwind v4 setup, `rankings.json`, `status` field, `s40g4` slug fix, asset-optimizer script | build green |
| 1 | 19 tier-A exhibits | build green, 21 live, **pause for review** |
| 2 | 16 tier-B exhibits | build green, 37 live |
| 3 | 15 tier-C exhibits | build green, 52 live |
| 4 | `s02g7` static export | build green, 53 live |

## Success criteria

- `npm run build` completes with zero errors with all 53 exhibits present.
- The gallery lists every exhibit exactly once, top 15 first, then grouped by
  section.
- Each exhibit renders at `/<slug>` with interactivity intact and no visible
  regression against its original deployment.
- No exhibit's styles bleed into another exhibit or the homepage.
- `src/layouts/ExhibitLayout.astro` and `src/styles/global.css` are unmodified.
- Total repository payload is well under the 1 GB GitHub Pages limit.

## Risks

- **Blanket asset optimization** is the largest fidelity risk; mitigated by the
  per-exhibit render check and the conversion report.
- **Tailwind preflight scoping** is the largest technical risk; mitigated by the
  static-embed escape hatch.
- **Orphan pruning false positives** in the 7 `import.meta.glob` repos;
  mitigated by excluding them from automatic pruning.
- **Astro major mismatches** across 19 exhibits authored on 4/6/7.
- **`s02g9`** remains the most likely static-embed fallback.
- **`ARCH MUSEUM RANKINGS.xlsx` is missing**, so the top-15 row ships with a
  placeholder ordering until the file is supplied.
