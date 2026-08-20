# Asset optimization report

This is the audit trail for a deliberate project decision: to bring all 53
CSARCH2 student exhibit repositories into one Astro site under GitHub Pages'
1 GB published-site limit, every exhibit's media was pruned (delete
unreferenced files) and then optimized (re-encode raster images to WebP,
re-encode/compress video, GLB/GLTF model compression) — accepting some
fidelity risk in exchange for shipping all 53 exhibits from one repository.
This document reconstructs what happened, exhibit by exhibit, from the
per-batch integration reports in
`.superpowers/sdd/2026-08-19-virtual-exhibit-full-merge/` (`batch-*-report.md`
and `task-*-report.md`). Where a batch report did not record a number, this
document says so rather than inventing one.

## Headline numbers

| Metric | Value |
|---|---|
| Total source payload (`src/` + `public/` across all 53 source repos, pre-merge) | **757 MB** (per the project spec, `docs/superpowers/specs/2026-08-19-virtual-exhibit-full-merge-design.md`) |
| Of which: unreferenced media, pruned losslessly before any optimization | **~224 MB** (orphan files) + **~35 MB** (proposal PDFs/DOCX, not exhibit content) |
| Merged asset footprint now (`src/assets/` + `public/`, this repo) | **123 MB** (107 MB + 16 MB, measured directly) |
| `dist/` after `npm run build` (the number GitHub Pages' 1 GB limit actually applies to) | **~137 MB** |
| GitHub Pages published-site limit | 1 GB |

The 757 MB → ~137 MB `dist/` figure is roughly an 82% reduction. This is not
a single number computed by one tool run — it's the sum of 53 independent
prune+optimize passes (one per exhibit, via
`tools/integrate/import-exhibit.mjs`), each recorded in its own batch report,
plus one exhibit (`s02g7`) that was never run through this pipeline at all
(see "s02g7" below).

## Per-exhibit table

"Before" and "after" are as recorded in the cited batch/task report, in MB
unless noted. "Not recorded" means no batch report captured a before/after
pair for that exhibit — this happens for exhibits that shipped no local
media (nothing to optimize) and for four exhibits integrated in a batch
whose report did not survive (see "Gaps in the record" below).

| Slug | Before | After | Source | Notes |
|---|---:|---:|---|---|
| s01g1 | not recorded | not recorded | — | Integrated before this SDD ledger existed (commit `0aad38f`, predates the batch-report scheme). |
| s01g2 | 8.5 MB | 1.3 MB | batch-J | png/jpg → webp; 3 `.ttf` fonts and one other file untouched. |
| s01g3 | 2.4 MB | 2.3 MB | batch-H | `collision.gif`/`summary.gif` re-encode came out *larger*; "no gain" gate kept the GIFs. `HOWWIFI.png` converted. |
| s01g4 | not recorded | not recorded | — | Integrated before this SDD ledger existed (commit `5b03a94`, predates the batch-report scheme). |
| s01g5 | 2.8 MB | 0.6 MB | batch-I | |
| s01g6 | 4.8 MB (source repo total) | 0 MB kept | batch-G | Ships no images at all — canvas-drawn Wi-Fi heatmap, no media to optimize. |
| s01g7 | 17 MB (staged `src/`) | 1.7 MB (final footprint) | task-10 | Assets specifically: 11.1 MB → 0.9 MB. First real exhibit run through the tooling end to end. |
| s01g8 | not recorded | not recorded | — | See "Gaps in the record". Current on-disk: `src/assets/s01g8` 900 KB, `public/s01g8` 16 KB. |
| s01g9 | 9.0 MB (source repo total) | 0 MB kept | batch-G | Ships no images — Tailwind/SVG/`framer-motion` only. |
| s02g1 | — | — | batch-L | No local images in the real content at all. |
| s02g2 | 1.3 MB | 0.6 MB | batch-A | |
| s02g3 | 9.2 MB | 1.1 MB | batch-I | 23 of 24 remaining images converted; `windows 95.png` hit the "no gain" gate and stayed PNG. |
| s02g4 | not recorded | not recorded | batch-M | Only asset is a pruned `favicon.svg`; no media to size. |
| s02g5 | not recorded | not recorded | — | See "Gaps in the record". Current on-disk: `src/components/s02g5` 72 KB only (no `assets/` or `public/` dir). |
| s02g6 | not recorded | not recorded | batch-M | Only asset is a pruned `favicon.svg`; no media to size. |
| s02g7 | — | 9.5 MB (`out/` output) | task-60 | Next.js static export embedded under `public/s02g7/`, never run through the prune/optimize pipeline — see "s02g7" below. |
| s02g8 | 106 MB | 952 KB | batch-K | Task brief estimated "108 MB → ~5 MB" from two unreferenced MP4s; actual measured result was smaller. See "Notable conversions". |
| s02g9 | not recorded | not recorded | — | See "Gaps in the record". `public/` measured ~26 MB pre-optimization (Task 9 ruling note). Current on-disk: `public/s02g9` 2.2 MB, `src/assets/s02g9` 8 KB. |
| s03g1 | 0.0 MB | 0.0 MB | batch-F | No local media; Tailwind/CSS exhibit. |
| s03g2 | — | — | batch-H | Entirely procedural CSS/canvas — no images. |
| s03g3 | 0.4 MB | 0.4 MB | batch-I | |
| s03g4 | 154.64 MB | 27.81 MB | batch-E2 | Matches task brief's stated 154.6 MB exactly. See "Notable conversions". |
| s03g5 | 6.7 MB | ~1.2 MB | batch-J | 3.5 MB tool-pruned orphans + 3 hand-pruned files + optimizer pass on the remainder. |
| s03g6 | 0.9 MB | 0.5 MB | batch-A | |
| s03g7 | — | — | batch-H | All 26 `public/` PNGs were orphaned doc/README screenshots, not site assets — all pruned, nothing kept. |
| s03g8 | 8.8 MB | 5.6 MB | batch-D | `matrix-bg.mp4` re-encoded av1→h264 (dominant contributor). See also the `mobile.png` orphan-scanner miss under "Limitations". |
| s03g9 | not recorded | not recorded | — | See "Gaps in the record". `moon.svg` specifically: 49 MB → 0.51 MB, verified directly against the shipped `public/s03g9/moon.webp` (533,254 bytes) — see "Notable conversions". |
| s04g1 | — | — | batch-M | No `src/assets/`, no `public/` — nothing to optimize. |
| s04g2 | 2.1 MB | 0.3 MB | batch-C | |
| s04g3 | 2.0 MB | 0.2 MB | batch-A | |
| s04g4 | negligible | negligible | batch-L | Only asset is one SVG (`ComputerThatIsABus.svg`); no before/after total given. |
| s04g5 | — | — | batch-L | No local media assets outside the 11 dropped stock PNGs. |
| s04g6 | 25.5 MB | 2.9 MB | batch-C | ~89% (or 43.1 MB → 2.9 MB, ~93%, counting the out-of-scope stray `revised.png`). Matches task's stated figures. See "Notable conversions". |
| s04g7 | 14.06 MB | 1.85 MB | batch-E2 | Matches task brief's stated 14.1 MB. See "Notable conversions". |
| s04g8 | 0.0 MB | 0.0 MB | batch-F | No local media. |
| s04g9 | 32.7 MB | 13.8 MB | batch-D | Four multi-MB SVGs individually verified; one is a genuine pure vector and correctly got "no gain". See "No gain / failed conversions". |
| s05g1 | 0.0 MB | 0.0 MB | batch-B | No media left after leftover pruning. |
| s05g2 | 17 MB | 384 KB | batch-K | ~97.7%, dominated by pruning one 8.8 MB orphan GIF, not the optimizer. |
| s05g3 | 10.4 MB (source repo total) | 0.7 MB (staged 5.1 MB → 0.7 MB) | batch-G | 11 images converted to WebP. |
| s05g4 | 302.9 KB | 269.7 KB | batch-F | 7 team photos, byte-level table in batch-F-report.md. |
| s05g5 | ~0.6 MB (unchanged) | ~0.6 MB | batch-K | No sizeable assets; two tiny stock-Astro-starter SVGs hand-pruned (see "Limitations"). |
| s05g6 | 2.3 MB | 0.6 MB | batch-B | |
| s05g7 | 1.9 MB | 0.4 MB | batch-C | |
| s05g8 | 38.7 MB | 20.5 MB | batch-D | 9 `.glb` models via `gltf-transform optimize --texture-size 1024 --compress draco`. |
| s05g9 | 28.4 MB (kept assets) | 9.27 MB | batch-H | Plus one orphaned `.glb` dropped; total relevant footprint before was ~28.6 MB. Audio (8.07 MB mp3) untouched — out of optimizer scope. |
| s40g1 | 21.9 MB (`public/`, 11 files) | 2.2 MB | batch-D | `src/assets` stock leftovers dropped pre-pipeline, not counted. |
| s40g2 | not recorded | not recorded | batch-M | Only asset is a pruned `favicon.svg`; `clock_oscillator_bg.svg` rides along unconverted (referenced only by dead code). |
| s40g3 | 0.0 MB | 0.0 MB | batch-B | No `assets` tree exists. |
| s40g4 | 8.0 MB (`src/assets`, incl. 5.7 MB stock leftovers) | ~2.5 MB (final `src/assets/s40g4/`) | batch-K | |
| s40g5 | 14.6 MB | 1.0 MB | batch-J | Optimizer pass on 30 real images. |
| s40g6 | 0.9 MB (images) | 0.3 MB | batch-C | Plus the 3D model (`usb_type-c.glb`) separately: 0.9 MB → 0.3 MB via Draco. **Note:** this exhibit still imports all 11 stock distro PNGs — see Task 61 report for why they were not deleted. |
| s40g7 | 0.2 MB | 0.1 MB | batch-L | 3 of 8 convertible images survived pruning and converted; 5 pruned as orphans. |
| s40g8 | 0.0 MB | 0.0 MB | batch-B | No `assets` tree exists. |

## Notable individual conversions

- **s02g8 — two unreferenced MP4s pruned entirely.** `voice_media1.mp4`
  (75 MB) and `voice_media2.mp4` (26 MB), 100.8 MB combined, had zero
  references anywhere in source — the exhibit's "voice interfaces" section
  sources video entirely from embedded YouTube URLs instead. Batch-K's task
  brief estimated this would bring the exhibit from "108 MB to about 5 MB";
  the actual measured result came in smaller than that estimate: **106 MB →
  952 KB (~99.1% reduction)**, because the 11 stock distro PNGs also
  auto-dropped as `TEMPLATE_LEFTOVERS`, and the sole remaining real asset
  (`Elevator Music.mp3`, ~0.95 MB) passes through unconverted (audio is
  outside the optimizer's scope).
- **s03g9 — `moon.svg` rasterized, 49 MB → 0.51 MB.** The spec initially
  assumed oversized SVGs across the corpus were "bitmaps in a vector
  wrapper" whose embedded raster data could simply be re-encoded. `moon.svg`
  broke that assumption: it contains zero base64 data URIs and 71,701
  `<path>` elements — a raster image traced into vector paths, not a vector
  with an embedded bitmap. The optimizer's normal pass correctly made no
  change (nothing to re-encode) and preserved the original — the "no gain"
  guard working as designed, not a defect. s03g9's individual integration
  task then rasterized it to WebP instead. No batch report survives for this
  exhibit (see "Gaps in the record"), so this figure is verified directly
  against the shipped file: `public/s03g9/moon.webp` is 533,254 bytes
  (0.51 MB) on disk today.
- **s03g4 — 154.6 MB → 27.8 MB (~82%).** Dominant contributors:
  `innovations-bg.png` (38 MB → `.webp`), `apollo11-video.mp4` (33 MB,
  re-encoded), `AGC.gif` (27 MB), `moonlanding.gif` (16 MB), `IC.gif`
  (16 MB), and a fourth GIF (`apollo11.gif`, 8 MB) not called out in the
  original task brief but converted the same way.
- **s04g6 — 25.5 MB → 2.9 MB.** The project-level success criterion cited
  for this exhibit. A 17.5 MB stray `revised.png` sat outside `src/` at the
  source repo's root and was correctly never merged (the orchestrator only
  ever stages `<repo>/src` and `<repo>/public`); counting that stray file in
  the "naive `cp -r`" baseline gives 43.1 MB → 2.9 MB, ~93% smaller.
- **s04g7 — 14.1 MB → 1.85 MB (~87%).** Already a lightweight exhibit
  (small WebP/JPG stills, a couple of tiny retro-sprite GIFs, no video); the
  reduction is dominated by 5 pruned orphan images (1.81 MB) plus routine
  PNG/JPG→WebP conversion of the rest.

## No gain / failed conversions

No conversion was recorded as outright `failed` in any batch report — every
build failure encountered during integration (s05g5's esbuild parse error,
s05g9's Astro-version incompatibility) was a code/tooling defect unrelated to
asset conversion, not an asset that failed to convert. What the batch reports
do record is the optimizer's "no gain" gate firing correctly and leaving the
original file in place when re-encoding would not have shrunk it:

| File | Exhibit | Before | After | Why |
|---|---|---:|---:|---|
| `ADEOS_Group9_SLCvsTLCBackground.svg` | s04g9 | 4.04 MB | 4.04 MB (byte-identical) | Genuine pure vector — 499 `<path>` elements, zero embedded raster data. Correctly left untouched. |
| `windows 95.png` | s02g3 | — | — (stayed `.png`) | WebP re-encode came out larger than the source PNG. |
| `collision.gif`, `summary.gif` | s01g3 | — | — (stayed `.gif`, both files) | WebP re-encode came out larger than the source GIFs for both. |

## Gaps in the record

Four live exhibits — **s01g8, s02g5, s02g9, s03g9** — have no surviving
per-exhibit batch report. Per the project ledger
(`.superpowers/sdd/2026-08-19-virtual-exhibit-full-merge/progress.md`):
s01g8's integration was interrupted by a session limit mid-run and completed
by hand by the controller (mechanical recovery, not logged as a sized
before/after); s02g5, s02g9, and s03g9 were the final three ("Batch N," the
hardest in the corpus), and that batch also hit a session limit during
s02g9 — s02g5 and s03g9 were committed by the dispatched agent, s02g9 was
completed by the controller, but no `batch-N-report.md` was ever written or
committed. What survives for these four in the ledger is fragmentary (cited
inline in the table above): pre-optimization `public/` sizes for s02g9
(~26 MB) and s03g9 (~57 MB) from an earlier cross-cutting note, and the
`moon.svg` figure verified directly against the shipped file. No before/after
total exists for s01g8 or s02g5 at all. This document does not invent one.

Two exhibits — **s01g1, s01g4** — were integrated before this SDD ledger
existed (commits `0aad38f` and `5b03a94`), predating the batch-report
convention entirely; no size data was ever recorded for them.

**s02g7** is excluded from the prune/optimize pipeline by design: it is a
statically-embedded Next.js export under `public/s02g7/`, not a source-merged
Astro exhibit, so `tools/integrate/import-exhibit.mjs` never runs against it.
Its only recorded figure is the Next.js build's own `out/` output size,
9.5 MB (`task-60-report.md`).

## Limitations

- **The orphan scanner has a known false-negative mode.** `findOrphans`
  flags a file as "referenced" (and therefore keeps it) whenever its
  filename or stem appears as a plain substring anywhere in the source tree
  — including inside unrelated prose, CSS comments, or other filenames that
  merely share the string. This produced at least two confirmed misses
  during integration: s03g8's `mobile.png` (a 3.4 MB stray full-page
  screenshot) was missed because the bare word "mobile" appears inside an
  unrelated CSS comment (`/* Hide TOC stepper on tablet/mobile */`); s05g5's
  `astro.svg` and `background.svg` (stock Astro-starter leftovers) were
  missed because "astro" and "background" each occur as substrings all over
  the rest of the codebase (`.astro` file extensions, CSS `background:`
  properties). Both cases were caught and hand-pruned during their
  exhibit's individual integration because that exhibit happened to get
  close manual scrutiny. Exhibits that received less individual attention —
  particularly the ones with no dedicated batch report (see "Gaps in the
  record") — did not get the same scrutiny, so it is likely some dead
  weight of this kind survives undetected in the current tree.
- **No headless browser was available in this environment.** Build,
  route, and asset-path correctness were verified by `curl` against `npm run
  preview` and by static reference-sweeps of the built HTML/CSS/JS, not by
  actually rendering pages. Image quality after WebP/AVIF conversion, video
  quality after re-encoding, and 3D-model fidelity after Draco compression
  were never visually inspected — only file existence, byte size, and (for
  a few models) direct HTTP fetch of the correct byte count were confirmed.
  This is the concrete form of the fidelity risk this whole optimization
  pass accepted.
