# Virtual Exhibit Full Merge (53 Exhibits) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge all 53 CSARCH2 student virtual-exhibit repositories into this single Astro + MDX site, each on its own route, all listed in one gallery, building green under a 1 GB asset budget.

**Architecture:** Every exhibit is namespaced under a slug (`s<section>g<group>`) across `pages/`, `components/`, `assets/`, and `styles/`. Phase 0 builds reusable tooling — data validation, gallery ordering, asset pruning, asset optimization, reference rewriting, and site verification — so that each of the 51 remaining exhibit integrations is a small, scripted, independently verifiable task. Phases 1–4 then work through the exhibits in ascending order of difficulty, committing one per exhibit.

**Tech Stack:** Astro 5, React 18, MDX, Tailwind v4 (`@tailwindcss/vite`), Sass (`sass-embedded`), Node's built-in `node:test` runner, `ffmpeg` / ImageMagick / `cwebp` / `gifsicle` / `rsvg-convert` for media, `gltf-transform` via `npx` for 3D models.

**Spec:** `docs/superpowers/specs/2026-08-19-virtual-exhibit-full-merge-design.md`

## Global Constraints

Every task's requirements implicitly include this section.

- **Astro 5** and **React 18** exactly. React 19 is forbidden: `@react-three/fiber@^8.18.0` (used by `s02g4` and `s04g7`) does not support it.
- **One `tailwindcss` version: v4**, wired through `@tailwindcss/vite`. `@astrojs/tailwind` must not appear in `package.json`.
- **Never modify** `src/layouts/ExhibitLayout.astro` or `src/styles/global.css`. `src/layouts/HomepageLayout.astro` is the umbrella's own file and may be edited.
- Site config is fixed: `site: 'https://jrgo7.github.io'`, `base: 'virtual-exhibit-template'`.
- Every exhibit owns exactly these paths and touches nothing else: `src/pages/<slug>.mdx`, `src/pages/<slug>/`, `src/components/<slug>/`, `src/assets/<slug>/`, `src/styles/<slug>/`, and `public/<slug>/` only where the bundler must be bypassed.
- **Commit per exhibit, straight to `main`**, message form `feat: <slug> integration`.
- `npm run build` must be green at the end of every task. A task is not done with a red build.
- `npm test` must be green at the end of every task. The script is `node --test tools/test/*.mjs` — Node 26 rejects a bare directory argument to `--test` with MODULE_NOT_FOUND, so the glob form is required, not cosmetic.
- Exhibit source repos are cloned to `.integration-src/<slug>/` which is git-ignored. Never commit them.
- Template leftovers are dropped on merge, never namespaced: `linux.mdx`, the stock `index.mdx`, `DistroQuiz.jsx`, `ImageGallery.jsx`, the umbrella's own `TextWithImage.astro`, and the Linux distro PNGs (`Tux.png`, `Ubuntu.png`, `Debian.png`, `Fedora.png`, `Mint.png`, `Manjaro.png`, `Zorin.png`, `PopOS.png`, `MX-Linux.png`, `CachyOS.png`, `Endeavour.png`).
- Proposal documents (`*.pdf`, `*.docx`) are never merged.

## File Structure

**Tooling (new, not shipped to the site):**

| Path | Responsibility |
|---|---|
| `tools/lib/exhibits.mjs` | Load and validate `src/data/exhibits.json` |
| `tools/lib/gallery.mjs` | Order exhibits into the top-N row and per-section groups |
| `tools/assets/prune.mjs` | Find and delete unreferenced media in a source tree |
| `tools/assets/optimize.mjs` | Re-encode media; emit an extension-change map and a report |
| `tools/integrate/rewrite.mjs` | Rewrite import paths, changed extensions, and `${base}` internal links |
| `tools/integrate/import-exhibit.mjs` | Orchestrate one exhibit's copy → prune → optimize → rewrite |
| `tools/verify-site.mjs` | Assert every live exhibit built a route and no card 404s |
| `tools/test/*.test.mjs` | `node:test` suites for all of the above |

**Site data and layout (modified):**

| Path | Change |
|---|---|
| `src/data/exhibits.json` | `s02g4_2` → `s40g4`; add `status` to all 53 entries |
| `src/data/rankings.json` | New. Top-15 slug order from `ARCH MUSEUM RANKINGS.xlsx` |
| `src/layouts/HomepageLayout.astro` | Render top-15 row, then per-section groups; live entries only |
| `src/styles/tailwind-scoped.css` | New. Tailwind v4 theme + utilities, no preflight |
| `package.json` | Dependency union; `test` script |
| `astro.config.mjs` | `@tailwindcss/vite` plugin |
| `.gitignore` | `.integration-src/` |

**Per exhibit (created, 51 times):** `src/pages/<slug>.mdx`, optionally `src/pages/<slug>/`, `src/components/<slug>/`, `src/assets/<slug>/`, `src/styles/<slug>/`.

---
# Phase 0 — Infrastructure

## Task 1: Exhibit data contract

**Files:**
- Create: `tools/lib/exhibits.mjs`
- Create: `tools/test/exhibits.test.mjs`
- Modify: `src/data/exhibits.json`
- Modify: `package.json` (add `test` script)
- Modify: `.gitignore`

**Interfaces:**
- Produces: `loadExhibits(path?: string) => Exhibit[]` and `validateExhibits(exhibits: Exhibit[]) => { ok: boolean, errors: string[] }` from `tools/lib/exhibits.mjs`. An `Exhibit` is `{ section: string, group: number, slug: string, title: string, authors: string[], description: string, keywords: string[], repo: string, url: string, submittedUrl: string, status: 'pending' | 'live' | 'external' }`.

- [ ] **Step 1: Write the failing test**

Create `tools/test/exhibits.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadExhibits, validateExhibits } from '../lib/exhibits.mjs';

test('exhibits.json holds all 53 exhibits and validates', () => {
  const exhibits = loadExhibits();
  assert.equal(exhibits.length, 53);
  const { ok, errors } = validateExhibits(exhibits);
  assert.deepEqual(errors, []);
  assert.ok(ok);
});

test('the S40 G4 entry uses the s40g4 slug', () => {
  const slugs = loadExhibits().map((e) => e.slug);
  assert.ok(slugs.includes('s40g4'), 's40g4 must exist');
  assert.ok(!slugs.includes('s02g4_2'), 's02g4_2 must be gone');
});

test('every exhibit carries a status and the two done ones are live', () => {
  const exhibits = loadExhibits();
  assert.ok(exhibits.every((e) => typeof e.status === 'string'));
  const live = exhibits.filter((e) => e.status === 'live').map((e) => e.slug);
  // Inclusion, not equality: this set grows by one on every exhibit task.
  assert.ok(live.includes('s01g1'));
  assert.ok(live.includes('s01g4'));
});

test('validateExhibits rejects a slug that disagrees with section and group', () => {
  const { ok, errors } = validateExhibits([
    { section: 'S02', group: 4, slug: 's02g4_2', status: 'pending' },
  ]);
  assert.equal(ok, false);
  assert.ok(errors.some((e) => e.includes('s02g4_2')));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/exhibits.test.mjs`
Expected: FAIL — `Cannot find module '../lib/exhibits.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/lib/exhibits.mjs`:

```javascript
import { readFileSync } from 'node:fs';

export const SECTIONS = ['S01', 'S02', 'S03', 'S04', 'S05', 'S40'];
export const STATUSES = ['pending', 'live', 'external'];

export function loadExhibits(path = 'src/data/exhibits.json') {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function validateExhibits(exhibits) {
  const errors = [];
  const seen = new Set();

  for (const e of exhibits) {
    if (seen.has(e.slug)) errors.push(`duplicate slug: ${e.slug}`);
    seen.add(e.slug);

    const expected = `${String(e.section).toLowerCase()}g${e.group}`;
    if (e.slug !== expected) {
      errors.push(`slug ${e.slug} disagrees with section/group (expected ${expected})`);
    }
    if (!SECTIONS.includes(e.section)) errors.push(`unknown section on ${e.slug}: ${e.section}`);
    if (!STATUSES.includes(e.status)) errors.push(`bad status on ${e.slug}: ${e.status}`);
  }

  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Fix the data**

In `src/data/exhibits.json`:
1. Find the entry titled `[Group 4] FDE Exhibit` (repo `Michael-Maglente/-CSARCH2-Group-2`). Change `"slug": "s02g4_2"` to `"slug": "s40g4"`, `"section": "S02"` to `"section": "S40"`, and `"group": 4` stays `4`.
2. Add `"status": "pending"` to all 53 entries, then change `s01g1` and `s01g4` to `"status": "live"` — those two are already integrated.
3. Re-sort the array by section then group so `s40g4` sits between `s40g3` and `s40g5`.

- [ ] **Step 5: Add the test script and ignore the clone directory**

In `package.json`, add to `scripts`:

```json
"test": "node --test tools/test/*.mjs"
```

Append to `.gitignore`:

```
# Exhibit source clones
.integration-src/
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 4 tests.

- [ ] **Step 7: Verify the build is still green**

Run: `npm run build`
Expected: `[build] Complete!` with 9 pages.

- [ ] **Step 8: Commit**

```bash
git add tools/lib/exhibits.mjs tools/test/exhibits.test.mjs src/data/exhibits.json package.json .gitignore
git commit -m "feat: exhibit data contract with status field and s40g4 slug fix"
```

---

## Task 2: Gallery ordering

**Files:**
- Create: `tools/lib/gallery.mjs`
- Create: `tools/test/gallery.test.mjs`
- Create: `src/data/rankings.json`

**Interfaces:**
- Consumes: `loadExhibits` from Task 1.
- Produces: `buildGallery(exhibits: Exhibit[], rankings: string[], opts?: { topCount?: number }) => { top: Exhibit[], sections: Array<{ section: string, exhibits: Exhibit[] }> }` from `tools/lib/gallery.mjs`.

**Decision recorded:** an exhibit shown in the top row is **not** repeated in its section group — "the rest, grouped by section" is read literally. Flip by changing the `rest` filter if that turns out to read badly.

- [ ] **Step 1: Write the failing test**

Create `tools/test/gallery.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGallery } from '../lib/gallery.mjs';

const make = (slug, section, group, status = 'live') => ({
  slug, section, group, status, title: slug, authors: [], keywords: [],
});

test('top row follows the ranking order, not section order', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s04g2', 'S04', 2), make('s02g3', 'S02', 3)];
  const { top } = buildGallery(exhibits, ['s04g2', 's01g1'], { topCount: 2 });
  assert.deepEqual(top.map((e) => e.slug), ['s04g2', 's01g1']);
});

test('ranked exhibits are excluded from the section groups', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s01g2', 'S01', 2), make('s02g1', 'S02', 1)];
  const { sections } = buildGallery(exhibits, ['s01g1'], { topCount: 1 });
  const s01 = sections.find((s) => s.section === 'S01');
  assert.deepEqual(s01.exhibits.map((e) => e.slug), ['s01g2']);
});

test('pending exhibits never appear anywhere', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s01g2', 'S01', 2, 'pending')];
  const { top, sections } = buildGallery(exhibits, [], { topCount: 15 });
  const shown = [...top, ...sections.flatMap((s) => s.exhibits)].map((e) => e.slug);
  assert.deepEqual(shown, ['s01g1']);
});

test('with no rankings the top row falls back to section then group order', () => {
  const exhibits = [make('s02g1', 'S02', 1), make('s01g2', 'S01', 2), make('s01g1', 'S01', 1)];
  const { top } = buildGallery(exhibits, [], { topCount: 2 });
  assert.deepEqual(top.map((e) => e.slug), ['s01g1', 's01g2']);
});

test('sections come out in S01..S05 then S40 order', () => {
  const exhibits = [make('s40g1', 'S40', 1), make('s01g1', 'S01', 1), make('s05g1', 'S05', 1)];
  const { sections } = buildGallery(exhibits, [], { topCount: 0 });
  assert.deepEqual(sections.map((s) => s.section), ['S01', 'S05', 'S40']);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/gallery.test.mjs`
Expected: FAIL — `Cannot find module '../lib/gallery.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/lib/gallery.mjs`:

```javascript
export function buildGallery(exhibits, rankings = [], { topCount = 15 } = {}) {
  const live = exhibits.filter((e) => e.status === 'live');

  const inOrder = [...live].sort(
    (a, b) => a.section.localeCompare(b.section) || a.group - b.group,
  );

  const rank = new Map(rankings.map((slug, i) => [slug, i]));
  const ranked = inOrder
    .filter((e) => rank.has(e.slug))
    .sort((a, b) => rank.get(a.slug) - rank.get(b.slug));

  const top = (ranked.length > 0 ? ranked : inOrder).slice(0, topCount);
  const topSlugs = new Set(top.map((e) => e.slug));

  const sections = [];
  for (const e of inOrder) {
    if (topSlugs.has(e.slug)) continue;
    let group = sections.find((s) => s.section === e.section);
    if (!group) sections.push((group = { section: e.section, exhibits: [] }));
    group.exhibits.push(e);
  }

  return { top, sections };
}
```

- [ ] **Step 4: Create the rankings placeholder**

Create `src/data/rankings.json`. `ARCH MUSEUM RANKINGS.xlsx` has not been supplied, so ship an empty array — `buildGallery` then falls back to section/group order, and filling this in later is a pure data change:

```json
[]
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 9 tests.

- [ ] **Step 6: Commit**

```bash
git add tools/lib/gallery.mjs tools/test/gallery.test.mjs src/data/rankings.json
git commit -m "feat: gallery ordering with ranked top row and section groups"
```

---

## Task 3: Homepage renders the full gallery

**Files:**
- Modify: `src/layouts/HomepageLayout.astro`
- Modify: `src/styles/homepage.css`
- Create: `tools/test/homepage.test.mjs`

**Interfaces:**
- Consumes: `buildGallery` from Task 2, `ExhibitCard` from `src/components/ExhibitCard.astro`.

- [ ] **Step 1: Write the failing test**

This test builds the site and asserts against the emitted HTML. Create `tools/test/homepage.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadExhibits } from '../lib/exhibits.mjs';

const DIST = 'dist/index.html';

test('homepage was built', () => {
  assert.ok(existsSync(DIST), 'run `npm run build` before this suite');
});

test('homepage shows a card for every live exhibit and none for pending ones', () => {
  const html = readFileSync(DIST, 'utf8');
  // Derived from the data, so this test stays correct as exhibits go live.
  for (const e of loadExhibits()) {
    const card = new RegExp(`id="${e.slug}"`);
    if (e.status === 'live') assert.match(html, card, `${e.slug} is live but has no card`);
    else assert.doesNotMatch(html, card, `${e.slug} is ${e.status} but rendered a card`);
  }
});

test('homepage renders section headings for grouped exhibits', () => {
  const html = readFileSync(DIST, 'utf8');
  assert.match(html, /Top exhibits/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && node --test tools/test/homepage.test.mjs`
Expected: FAIL on the third assertion of test 2 — every exhibit currently renders because the layout slices the raw array and ignores `status`.

- [ ] **Step 3: Rewrite the layout's frontmatter**

In `src/layouts/HomepageLayout.astro`, replace the `top_exhibits` line with:

```javascript
import { buildGallery } from '../../tools/lib/gallery.mjs';
import exhibits from '../data/exhibits.json';
import rankings from '../data/rankings.json';

const SECTION_NAMES = {
  S01: 'Section S01', S02: 'Section S02', S03: 'Section S03',
  S04: 'Section S04', S05: 'Section S05', S40: 'Section S40',
};

const { top, sections } = buildGallery(exhibits, rankings);
```

- [ ] **Step 4: Rewrite the layout's `<main>`**

Replace the existing `<main class="judging">` block with:

```astro
<main class="judging">
    <div class="section__head">
        <h2 class="section__title">Top exhibits</h2>
    </div>
    <section class="section">
        {top.map((exhibit) => <ExhibitCard exhibit={exhibit} />)}
    </section>

    {sections.map((group) => (
        <>
            <div class="section__head">
                <h2 class="section__title">{SECTION_NAMES[group.section] ?? group.section}</h2>
            </div>
            <section class="section">
                {group.exhibits.map((exhibit) => <ExhibitCard exhibit={exhibit} />)}
            </section>
        </>
    ))}
</main>
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm run build && npm test`
Expected: PASS. Only `s01g1` and `s01g4` render, both in the top row, and no section groups appear yet because nothing else is live.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/HomepageLayout.astro src/styles/homepage.css tools/test/homepage.test.mjs
git commit -m "feat: homepage renders ranked top row and per-section groups"
```

---

## Task 4: Dependency union and build config

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`

**Interfaces:**
- Produces: a `node_modules` tree that satisfies every exhibit, and a Vite-level Tailwind v4 pipeline.

**Known conflicts, resolved here:**
- `lucide-react`: `s01g5` pins `^0.468.0`, three others use `^1.x`. Take `^1.25.0`; if `s01g5`'s icon imports break in Phase 2, fix the import names there.
- `react-leaflet@^5` (only `s02g6`) targets React 19. Under the React 18 baseline it is expected to fail; `s02g6` is tier C and pins `react-leaflet@^4` or goes static.
- `framer-motion`: `s01g5` uses `^11`, three others `^12`. Take `^12.42.2`.

- [ ] **Step 1: Write the union into `package.json`**

Replace **only** the `dependencies` and `devDependencies` blocks. Leave `scripts` untouched — Task 1 added `"test": "node --test tools/test/*.mjs"` there and the rest of the plan depends on it.

```json
  "dependencies": {
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/react": "^4.0.0",
    "@base-ui/react": "^1.6.0",
    "@fontsource-variable/jetbrains-mono": "^5.2.8",
    "@fontsource-variable/lora": "^5.2.8",
    "@fontsource-variable/montserrat": "^5.2.8",
    "@fontsource-variable/noto-sans": "^5.2.10",
    "@fontsource-variable/playfair-display": "^5.2.8",
    "@fontsource-variable/roboto-mono": "^5.2.9",
    "@fontsource-variable/space-grotesk": "^5.2.10",
    "@fontsource/archivo-black": "^5.2.8",
    "@fontsource/inter": "^5.1.1",
    "@fontsource/jetbrains-mono": "^5.3.0",
    "@fontsource/orbitron": "^5.2.8",
    "@fontsource/press-start-2p": "^5.2.7",
    "@fontsource/share-tech-mono": "^5.3.0",
    "@fontsource/space-grotesk": "^5.1.1",
    "@iconify-json/ic": "^1.2.4",
    "@photo-sphere-viewer/core": "^5.14.3",
    "@react-three/drei": "^9.122.0",
    "@react-three/fiber": "^8.18.0",
    "@tailwindcss/vite": "^4.3.3",
    "@tsparticles/react": "^4.3.2",
    "@tsparticles/slim": "^4.3.2",
    "animejs": "^4.5.0",
    "astro": "^5.0.0",
    "astro-icon": "^1.1.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.42.2",
    "gsap": "^3.15.0",
    "howler": "^2.2.4",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.25.0",
    "marked": "^18.0.4",
    "normalize.css": "^8.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^19.1.0",
    "react-leaflet": "^4.2.1",
    "react-parallax-tilt": "^1.7.333",
    "react-vertical-timeline-component": "^4.0.0",
    "tailwind-merge": "^3.6.0",
    "tailwindcss": "^4.3.3",
    "three": "^0.185.1",
    "three-stdlib": "^2.36.1",
    "tw-animate-css": "^1.4.0",
    "webcoreui": "^1.5.0",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@types/node": "^26.1.1",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.185.1",
    "sass-embedded": "^1.100.0",
    "typescript": "^5.9.3"
  }
```

- [ ] **Step 2: Add the Tailwind Vite plugin to `astro.config.mjs`**

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [mdx(), react(), icon()],
  site: 'https://jrgo7.github.io',
  base: 'virtual-exhibit-template',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Install**

Run: `npm install --no-audit --no-fund`
Expected: completes. If npm reports a peer-dependency error naming `react@19`, a dependency slipped past the React 18 constraint — find it and pin the React 18 compatible major rather than forcing the install.

- [ ] **Step 4: Verify build and tests**

Run: `npm run build && npm test`
Expected: `[build] Complete!` and all tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs
git commit -m "feat: union all exhibit dependencies and wire Tailwind v4"
```

---

## Task 5: Scoped Tailwind entry without preflight

**Files:**
- Create: `src/styles/tailwind-scoped.css`
- Create: `tools/test/tailwind-scope.test.mjs`

**Interfaces:**
- Produces: `src/styles/tailwind-scoped.css`, imported by each Tailwind exhibit instead of `@import "tailwindcss"`.

**Why:** Tailwind v4's `@import "tailwindcss"` pulls in preflight, a global element reset that would restyle every other exhibit and the homepage. Theme and utilities are safe to share; preflight is not.

- [ ] **Step 1: Write the failing test**

Create `tools/test/tailwind-scope.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the shared Tailwind entry imports theme and utilities but not preflight', () => {
  const css = readFileSync('src/styles/tailwind-scoped.css', 'utf8');
  assert.match(css, /tailwindcss\/theme\.css/);
  assert.match(css, /tailwindcss\/utilities\.css/);
  assert.doesNotMatch(css, /tailwindcss\/preflight\.css/);
  assert.doesNotMatch(css, /@import\s+["']tailwindcss["']\s*;/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/tailwind-scope.test.mjs`
Expected: FAIL — `ENOENT: no such file or directory, 'src/styles/tailwind-scoped.css'`.

- [ ] **Step 3: Write the file**

Create `src/styles/tailwind-scoped.css`:

```css
/* Shared Tailwind v4 entry for exhibits.
 *
 * Deliberately omits tailwindcss/preflight.css: preflight is a global element
 * reset and would leak out of the importing exhibit into every other page.
 * An exhibit that genuinely needs the reset re-adds it scoped under its own
 * wrapper element in src/styles/<slug>/base.css.
 */
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tailwind-scoped.css tools/test/tailwind-scope.test.mjs
git commit -m "feat: shared Tailwind v4 entry without global preflight"
```

---
## Task 6: Asset pruner

**Files:**
- Create: `tools/assets/prune.mjs`
- Create: `tools/test/prune.test.mjs`

**Interfaces:**
- Produces: `findOrphans(dir: string) => Array<{ path: string, bytes: number }>` and `TEMPLATE_LEFTOVERS: string[]` from `tools/assets/prune.mjs`. CLI: `node tools/assets/prune.mjs --dir <dir> [--apply]`.

**Why lossless first:** 224 MB of the 757 MB is unreferenced. Deleting it costs nothing and shrinks the work the lossy pass has to do.

**Hard constraint:** basename matching cannot see references built at runtime. These seven repos use `import.meta.glob` and must never be pruned automatically — `s03g2`, `s03g5`, `s03g7`, `s03g8`, `s04g1`, `s05g5`, `s40g5`. `findOrphans` reports; only `--apply` deletes, and for those seven the operator reviews the report by hand first. `s03g8`'s 18.8 MB of `Desk *.png` is a known false positive.

- [ ] **Step 1: Write the failing test**

Create `tools/test/prune.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findOrphans, TEMPLATE_LEFTOVERS } from '../assets/prune.mjs';

function fixture() {
  const dir = mkdtempSync(join(tmpdir(), 'prune-'));
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  writeFileSync(join(dir, 'src', 'assets', 'used.png'), 'x'.repeat(100));
  writeFileSync(join(dir, 'src', 'assets', 'orphan.png'), 'x'.repeat(200));
  writeFileSync(join(dir, 'src', 'assets', 'proposal.pdf'), 'x'.repeat(300));
  writeFileSync(
    join(dir, 'src', 'pages', 'exhibit.mdx'),
    'import img from "../assets/used.png"\n',
  );
  return dir;
}

test('an unreferenced image is reported as an orphan', () => {
  const orphans = findOrphans(fixture()).map((o) => o.path);
  assert.ok(orphans.some((p) => p.endsWith('orphan.png')));
});

test('a referenced image is never reported', () => {
  const orphans = findOrphans(fixture()).map((o) => o.path);
  assert.ok(!orphans.some((p) => p.endsWith('used.png')));
});

test('PDFs are always orphans regardless of references', () => {
  const orphans = findOrphans(fixture()).map((o) => o.path);
  assert.ok(orphans.some((p) => p.endsWith('proposal.pdf')));
});

test('orphans carry their byte size for reporting', () => {
  const orphan = findOrphans(fixture()).find((o) => o.path.endsWith('orphan.png'));
  assert.equal(orphan.bytes, 200);
});

test('public assets are matched against a separate code directory', () => {
  const dir = mkdtempSync(join(tmpdir(), 'prune-public-'));
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  mkdirSync(join(dir, 'public'), { recursive: true });
  writeFileSync(join(dir, 'public', 'used.svg'), 'x'.repeat(50));
  writeFileSync(join(dir, 'public', 'unused.svg'), 'x'.repeat(50));
  writeFileSync(join(dir, 'src', 'pages', 'p.mdx'), '<img src="/used.svg">');

  const orphans = findOrphans(join(dir, 'public'), { haystackDir: join(dir, 'src') })
    .map((o) => o.path);
  assert.ok(orphans.some((p) => p.endsWith('unused.svg')));
  assert.ok(!orphans.some((p) => p.endsWith('used.svg')), 'referenced public asset must survive');
});

test('the template leftover list covers the stock distro images', () => {
  assert.ok(TEMPLATE_LEFTOVERS.includes('Tux.png'));
  assert.ok(TEMPLATE_LEFTOVERS.includes('DistroQuiz.jsx'));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/prune.test.mjs`
Expected: FAIL — `Cannot find module '../assets/prune.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/assets/prune.mjs`:

```javascript
import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const MEDIA = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif',
  '.mp4', '.webm', '.mov', '.mp3', '.wav', '.ogg',
  '.glb', '.gltf', '.exr', '.hdr',
]);
const ALWAYS_DROP = new Set(['.pdf', '.docx', '.pptx']);
const CODE = new Set([
  '.astro', '.mdx', '.md', '.js', '.jsx', '.ts', '.tsx',
  '.json', '.css', '.scss', '.html', '.mjs', '.cjs',
]);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

export const GLOB_REPOS = ['s03g2', 's03g5', 's03g7', 's03g8', 's04g1', 's05g5', 's40g5'];

export const TEMPLATE_LEFTOVERS = [
  'linux.mdx', 'DistroQuiz.jsx', 'ImageGallery.jsx',
  'Tux.png', 'Ubuntu.png', 'Debian.png', 'Fedora.png', 'Mint.png',
  'Manjaro.png', 'Zorin.png', 'PopOS.png', 'MX-Linux.png',
  'CachyOS.png', 'Endeavour.png',
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// `haystackDir` is where references are searched for; it defaults to `dir`.
// They differ for public/, whose assets are referenced from src/ and which
// contains no code of its own — scanning it alone would flag every file.
export function findOrphans(dir, { haystackDir = dir } = {}) {
  const files = walk(dir);

  const haystack = walk(haystackDir)
    .filter((f) => CODE.has(extname(f).toLowerCase()))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  const orphans = [];
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (ALWAYS_DROP.has(ext)) {
      orphans.push({ path: file, bytes: statSync(file).size, reason: 'document' });
      continue;
    }
    if (!MEDIA.has(ext)) continue;

    const name = basename(file);
    const stem = name.slice(0, -ext.length);
    const referenced =
      haystack.includes(name) ||
      new RegExp(`${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\\s.)/]`).test(haystack);

    if (!referenced) orphans.push({ path: file, bytes: statSync(file).size, reason: 'unreferenced' });
  }
  return orphans;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf('--dir') + 1];
  const apply = args.includes('--apply');
  const orphans = findOrphans(dir);
  const total = orphans.reduce((n, o) => n + o.bytes, 0);

  for (const o of orphans) {
    console.log(`${(o.bytes / 1048576).toFixed(2).padStart(8)} MB  ${o.reason.padEnd(12)} ${o.path}`);
  }
  console.log(`\n${orphans.length} files, ${(total / 1048576).toFixed(1)} MB`);

  if (apply) {
    for (const o of orphans) unlinkSync(o.path);
    console.log('deleted.');
  } else {
    console.log('dry run — pass --apply to delete');
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/assets/prune.mjs tools/test/prune.test.mjs
git commit -m "feat: lossless asset pruner for unreferenced media"
```

---

## Task 7: Asset optimizer

**Files:**
- Create: `tools/assets/optimize.mjs`
- Create: `tools/test/optimize.test.mjs`

**Interfaces:**
- Produces: `planConversions(dir: string) => Array<{ from: string, to: string, kind: string }>` and `optimizeTree(dir: string, opts?: { apply?: boolean }) => Promise<Array<{ from, to, beforeBytes, afterBytes, kind }>>` from `tools/assets/optimize.mjs`. CLI: `node tools/assets/optimize.mjs --dir <dir> --report <file> [--apply]`.
- The returned `from`/`to` pairs are the extension-change map consumed by `rewriteReferences` in Task 8.

**Required binaries:** `ffmpeg`, `magick` (ImageMagick 7), `gifsicle`. Verify with `ffmpeg -version`, `magick -version`, `gifsicle --version` before running.

- [ ] **Step 1: Write the failing test**

Create `tools/test/optimize.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { planConversions } from '../assets/optimize.mjs';

function fixture(names) {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-'));
  mkdirSync(join(dir, 'assets'), { recursive: true });
  for (const n of names) writeFileSync(join(dir, 'assets', n), 'x');
  return dir;
}

test('PNG and JPG convert to webp', () => {
  const plan = planConversions(fixture(['a.png', 'b.jpg']));
  assert.deepEqual(plan.map((c) => c.kind).sort(), ['image', 'image']);
  assert.ok(plan.every((c) => c.to.endsWith('.webp')));
});

test('GIF converts to animated webp so <img> tags keep working', () => {
  const [conversion] = planConversions(fixture(['loop.gif']));
  assert.equal(conversion.kind, 'gif');
  assert.ok(conversion.to.endsWith('.webp'));
});

test('MP4 is re-encoded in place, keeping its extension', () => {
  const [conversion] = planConversions(fixture(['clip.mp4']));
  assert.equal(conversion.kind, 'video');
  assert.ok(conversion.to.endsWith('.mp4'));
});

test('GLB and EXR keep their extensions', () => {
  const plan = planConversions(fixture(['model.glb', 'sky.exr']));
  assert.ok(plan.every((c) => c.from === c.to));
});

test('already-optimal formats are skipped', () => {
  assert.deepEqual(planConversions(fixture(['icon.svg', 'photo.webp'])), []);
});

test('an oversized SVG is queued for embedded-raster re-encoding', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-svg-'));
  mkdirSync(join(dir, 'assets'), { recursive: true });
  writeFileSync(join(dir, 'assets', 'moon.svg'), 'x'.repeat(2 * 1024 * 1024));
  const [conversion] = planConversions(dir);
  assert.equal(conversion.kind, 'svg');
  assert.equal(conversion.from, conversion.to);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/optimize.test.mjs`
Expected: FAIL — `Cannot find module '../assets/optimize.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/assets/optimize.mjs`:

```javascript
import { readdirSync, statSync, renameSync, unlinkSync,
         readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

const MAX_IMAGE_DIM = 2560;
const WEBP_QUALITY = 82;
const VIDEO_CRF = 24;
const MAX_VIDEO_WIDTH = 1920;
const SVG_RASTER_THRESHOLD = 1024 * 1024;
const EMBEDDED_RASTER_MIN = 64 * 1024;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const swap = (file, ext) => file.slice(0, -extname(file).length) + ext;

export function planConversions(dir) {
  const plan = [];
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      plan.push({ from: file, to: swap(file, '.webp'), kind: 'image' });
    } else if (ext === '.gif') {
      plan.push({ from: file, to: swap(file, '.webp'), kind: 'gif' });
    } else if (ext === '.mp4' || ext === '.webm' || ext === '.mov') {
      plan.push({ from: file, to: swap(file, '.mp4'), kind: 'video' });
    } else if (ext === '.glb' || ext === '.gltf') {
      plan.push({ from: file, to: file, kind: 'model' });
    } else if (ext === '.exr' || ext === '.hdr') {
      plan.push({ from: file, to: file, kind: 'hdr' });
    } else if (ext === '.svg' && statSync(file).size > SVG_RASTER_THRESHOLD) {
      // Small SVGs are real vectors. Huge ones are bitmaps in an SVG wrapper.
      plan.push({ from: file, to: file, kind: 'svg' });
    }
  }
  return plan;
}

function convert({ from, to, kind }) {
  const tmp = `${to}.tmp${extname(to)}`;
  if (kind === 'image') {
    execFileSync('magick', [from, '-resize', `${MAX_IMAGE_DIM}x${MAX_IMAGE_DIM}>`,
      '-quality', String(WEBP_QUALITY), tmp]);
  } else if (kind === 'gif') {
    execFileSync('ffmpeg', ['-y', '-i', from, '-c:v', 'libwebp', '-lossless', '0',
      '-q:v', '75', '-loop', '0', '-an', '-fps_mode', 'passthrough', tmp]);
  } else if (kind === 'video') {
    execFileSync('ffmpeg', ['-y', '-i', from, '-c:v', 'libx264', '-crf', String(VIDEO_CRF),
      '-preset', 'slow', '-vf', `scale='min(${MAX_VIDEO_WIDTH},iw)':-2`,
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', tmp]);
  } else if (kind === 'model') {
    execFileSync('npx', ['--yes', '@gltf-transform/cli', 'optimize', from, tmp,
      '--texture-size', '1024', '--compress', 'draco']);
  } else if (kind === 'hdr') {
    execFileSync('magick', [from, '-resize', '2048x1024>', tmp]);
  } else if (kind === 'svg') {
    optimizeSvg(from, tmp);
  }
  return tmp;
}

// An SVG that is megabytes large is almost always a bitmap wrapped in vector
// markup. Re-encode the embedded rasters and leave the vector parts alone, so
// the file keeps its .svg extension and no reference has to change.
function optimizeSvg(from, tmp) {
  const svg = readFileSync(from, 'utf8');
  const out = svg.replace(
    /data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+)/g,
    (match, format, base64) => {
      const buffer = Buffer.from(base64.replace(/\s/g, ''), 'base64');
      if (buffer.length < EMBEDDED_RASTER_MIN) return match;
      const inFile = `${tmp}.in.${format}`;
      const outFile = `${tmp}.out.webp`;
      writeFileSync(inFile, buffer);
      execFileSync('magick', [inFile, '-resize', `${MAX_IMAGE_DIM}x${MAX_IMAGE_DIM}>`,
        '-quality', String(WEBP_QUALITY), outFile]);
      const encoded = readFileSync(outFile).toString('base64');
      unlinkSync(inFile);
      unlinkSync(outFile);
      return `data:image/webp;base64,${encoded}`;
    },
  );
  writeFileSync(tmp, out);
}

export async function optimizeTree(dir, { apply = false } = {}) {
  const results = [];
  for (const conversion of planConversions(dir)) {
    const beforeBytes = statSync(conversion.from).size;
    if (!apply) {
      results.push({ ...conversion, beforeBytes, afterBytes: null });
      continue;
    }
    let tmp;
    try {
      tmp = convert(conversion);
    } catch (error) {
      results.push({ ...conversion, beforeBytes, afterBytes: beforeBytes, failed: String(error.message).slice(0, 200) });
      continue;
    }
    const afterBytes = statSync(tmp).size;
    if (afterBytes >= beforeBytes) {
      // Conversion made it bigger. Keep the original untouched.
      unlinkSync(tmp);
      results.push({ ...conversion, to: conversion.from, beforeBytes, afterBytes: beforeBytes, skipped: 'no gain' });
      continue;
    }
    if (conversion.from !== conversion.to) unlinkSync(conversion.from);
    renameSync(tmp, conversion.to);
    results.push({ ...conversion, beforeBytes, afterBytes });
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf('--dir') + 1];
  const apply = args.includes('--apply');
  const results = await optimizeTree(dir, { apply });

  const before = results.reduce((n, r) => n + r.beforeBytes, 0);
  const after = results.reduce((n, r) => n + (r.afterBytes ?? r.beforeBytes), 0);
  for (const r of results) {
    const note = r.failed ? ` FAILED: ${r.failed}` : r.skipped ? ` (${r.skipped})` : '';
    console.log(`${r.kind.padEnd(6)} ${(r.beforeBytes / 1048576).toFixed(2).padStart(8)} -> ` +
      `${((r.afterBytes ?? r.beforeBytes) / 1048576).toFixed(2).padStart(8)} MB  ${r.to}${note}`);
  }
  console.log(`\n${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Sanity-check the converters against a real file**

Run against the heaviest single asset, in dry mode then for real, on a scratch copy:

```bash
cp ".integration-src/s03g4/src/assets/innovations-bg.png" /tmp/probe.png
node -e "import('./tools/assets/optimize.mjs').then(m=>m.optimizeTree('/tmp',{apply:true}))"
ls -la /tmp/probe.webp
```

Expected: the 37 MB PNG lands in the low single-digit MB. If the result looks visibly degraded when opened, raise `WEBP_QUALITY` and re-run before using the tool on real exhibits.

- [ ] **Step 6: Commit**

```bash
git add tools/assets/optimize.mjs tools/test/optimize.test.mjs
git commit -m "feat: media optimizer for images, gifs, video, models and HDR maps"
```

---
## Task 8: Reference rewriter

**Files:**
- Create: `tools/integrate/rewrite.mjs`
- Create: `tools/test/rewrite.test.mjs`

**Interfaces:**
- Produces: `remapSpecifier(spec, { fromDir, toDir, pathMap }) => string` and `rewriteFile(content, { fromDir, toDir, pathMap, slug, routes }) => string` from `tools/integrate/rewrite.mjs`.
- `pathMap` is a `Map` from old `src`-relative path to new `src`-relative path, e.g. `'components/Foo.jsx' -> 'components/s01g7/Foo.jsx'` and `'assets/pic.png' -> 'assets/s01g7/pic.webp'`. Task 7's results supply the extension half; Task 9 supplies the namespacing half.
- `routes` is the list of top-level route names the exhibit owned before the move, e.g. `['shared-bus-problem', 'arbitration-modes']`.

**Why resolve rather than string-substitute:** files move to different depths — an entry page goes to `src/pages/<slug>.mdx` (same depth) but a sub-page goes to `src/pages/<slug>/x.mdx` (one deeper), and every component gains a directory level. Rewriting `../` prefixes by hand gets this wrong. Resolving each specifier to a concrete target and re-deriving the relative path is correct at any depth.

- [ ] **Step 1: Write the failing test**

Create `tools/test/rewrite.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remapSpecifier, rewriteFile } from '../integrate/rewrite.mjs';

const pathMap = new Map([
  ['components/Foo.jsx', 'components/s01g7/Foo.jsx'],
  ['assets/pic.png', 'assets/s01g7/pic.webp'],
  ['styles/theme.css', 'styles/s01g7/theme.css'],
]);

test('an entry page keeps its depth and gains the namespace', () => {
  const out = remapSpecifier('../components/Foo.jsx', {
    fromDir: 'pages', toDir: 'pages', pathMap,
  });
  assert.equal(out, '../components/s01g7/Foo.jsx');
});

test('a sub-page one level deeper gets an extra ../', () => {
  const out = remapSpecifier('../components/Foo.jsx', {
    fromDir: 'pages', toDir: 'pages/s01g7', pathMap,
  });
  assert.equal(out, '../../components/s01g7/Foo.jsx');
});

test('a component gains a level when it moves into its namespace', () => {
  const out = remapSpecifier('../assets/pic.png', {
    fromDir: 'components', toDir: 'components/s01g7', pathMap,
  });
  assert.equal(out, '../../assets/s01g7/pic.webp');
});

test('an unmapped specifier is left alone', () => {
  const out = remapSpecifier('../lib/util.js', {
    fromDir: 'pages', toDir: 'pages', pathMap,
  });
  assert.equal(out, '../lib/util.js');
});

test('bare package imports are never touched', () => {
  const out = remapSpecifier('react', { fromDir: 'pages', toDir: 'pages/s01g7', pathMap });
  assert.equal(out, 'react');
});

test('rewriteFile updates import statements', () => {
  const src = 'import Foo from "../components/Foo.jsx";\nimport "../styles/theme.css";\n';
  const out = rewriteFile(src, { fromDir: 'pages', toDir: 'pages/s01g7', pathMap, slug: 's01g7', routes: [] });
  assert.match(out, /"\.\.\/\.\.\/components\/s01g7\/Foo\.jsx"/);
  assert.match(out, /"\.\.\/\.\.\/styles\/s01g7\/theme\.css"/);
});

test('base-relative internal links gain the slug', () => {
  const src = 'href={`${base}shared-bus-problem/`}';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['shared-bus-problem'],
  });
  assert.match(out, /\$\{base\}s04g4\/shared-bus-problem\//);
});

test('references to a public asset gain the slug in both link shapes', () => {
  const out = rewriteFile('<img src="/moon.svg"> and href={`${base}moon.svg`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9',
    routes: [], publicAssets: ['moon.svg'],
  });
  assert.match(out, /src="\/s03g9\/moon\.svg"/);
  assert.match(out, /\$\{base\}s03g9\/moon\.svg/);
});

test('a base-relative link to a route the exhibit does not own is untouched', () => {
  const src = 'href={`${base}`}';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['shared-bus-problem'],
  });
  assert.equal(out, 'href={`${base}`}');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/rewrite.test.mjs`
Expected: FAIL — `Cannot find module '../integrate/rewrite.mjs'`.

- [ ] **Step 3: Write the implementation**

Create `tools/integrate/rewrite.mjs`:

```javascript
import { posix } from 'node:path';

const { join, dirname, relative, normalize } = posix;

const SPECIFIER = /(["'`])(\.\.?\/[^"'`]+)\1/g;

export function remapSpecifier(spec, { fromDir, toDir, pathMap }) {
  if (!spec.startsWith('.')) return spec;

  const oldTarget = normalize(join(fromDir, spec));

  let newTarget = pathMap.get(oldTarget);
  if (!newTarget) {
    // Try extensionless imports: "../components/Foo" -> "components/Foo.jsx"
    for (const [from, to] of pathMap) {
      if (from.slice(0, from.lastIndexOf('.')) === oldTarget) {
        newTarget = to;
        break;
      }
    }
  }
  if (!newTarget) return spec;

  // Preserve an extensionless import style if that is how it was written.
  if (!spec.includes(posix.extname(oldTarget)) && posix.extname(oldTarget)) {
    newTarget = newTarget.slice(0, newTarget.lastIndexOf('.'));
  }

  let out = relative(toDir, newTarget);
  if (!out.startsWith('.')) out = `./${out}`;
  return out;
}

export function rewriteFile(
  content,
  { fromDir, toDir, pathMap, slug, routes = [], publicAssets = [] },
) {
  let out = content.replace(SPECIFIER, (match, quote, spec) => {
    const remapped = remapSpecifier(spec, { fromDir, toDir, pathMap });
    return `${quote}${remapped}${quote}`;
  });

  for (const route of routes) {
    // ${base}route/  ->  ${base}<slug>/route/
    const pattern = new RegExp(
      '(\\$\\{base[A-Za-z]*\\})(' + route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b',
      'g',
    );
    out = out.replace(pattern, `$1${slug}/$2`);
  }

  // Files served from public/ move to public/<slug>/, so both the base-relative
  // and the root-absolute reference shapes need the slug inserted.
  for (const asset of publicAssets) {
    const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp('(\\$\\{base[A-Za-z]*\\})(' + escaped + ')', 'g'),
      `$1${slug}/$2`,
    );
    out = out.replace(
      new RegExp('(["\'`])/(' + escaped + ')', 'g'),
      `$1/${slug}/$2`,
    );
  }

  return out;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add tools/integrate/rewrite.mjs tools/test/rewrite.test.mjs
git commit -m "feat: reference rewriter for namespaced imports and internal links"
```

---

## Task 9: Integration orchestrator, site verifier, and runbook

**Files:**
- Create: `tools/integrate/import-exhibit.mjs`
- Create: `tools/verify-site.mjs`
- Create: `tools/test/verify-site.test.mjs`
- Create: `docs/integration-runbook.md`

**Interfaces:**
- Consumes: `findOrphans` (Task 6), `optimizeTree` (Task 7), `rewriteFile` (Task 8), `loadExhibits` (Task 1).
- Produces: `verifySite(distDir: string, exhibits: Exhibit[]) => { ok: boolean, errors: string[] }` from `tools/verify-site.mjs`. CLI: `node tools/integrate/import-exhibit.mjs --slug <slug> --src <dir> --entry <file> [--subdir <dir>] [--apply]`.

- [ ] **Step 1: Write the failing test**

Create `tools/test/verify-site.test.mjs`:

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifySite } from '../verify-site.mjs';

function dist(slugs) {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const slug of slugs) {
    mkdirSync(join(dir, slug), { recursive: true });
    writeFileSync(join(dir, slug, 'index.html'), '<html></html>');
  }
  return dir;
}

test('a live exhibit with a built route passes', () => {
  const { ok, errors } = verifySite(dist(['s01g1']), [{ slug: 's01g1', status: 'live' }]);
  assert.deepEqual(errors, []);
  assert.ok(ok);
});

test('a live exhibit with no built route fails', () => {
  const { ok, errors } = verifySite(dist([]), [{ slug: 's01g1', status: 'live' }]);
  assert.equal(ok, false);
  assert.ok(errors[0].includes('s01g1'));
});

test('a pending exhibit is not required to have a route', () => {
  const { ok } = verifySite(dist([]), [{ slug: 's02g9', status: 'pending' }]);
  assert.ok(ok);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/test/verify-site.test.mjs`
Expected: FAIL — `Cannot find module '../verify-site.mjs'`.

- [ ] **Step 3: Write the verifier**

Create `tools/verify-site.mjs`:

```javascript
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadExhibits } from './lib/exhibits.mjs';

export function verifySite(distDir, exhibits) {
  const errors = [];
  for (const e of exhibits) {
    if (e.status !== 'live') continue;
    const route = join(distDir, e.slug, 'index.html');
    if (!existsSync(route)) errors.push(`live exhibit ${e.slug} has no built route at ${route}`);
  }
  return { ok: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const exhibits = loadExhibits();
  const { ok, errors } = verifySite('dist', exhibits);
  const live = exhibits.filter((e) => e.status === 'live').length;
  for (const error of errors) console.error(`FAIL ${error}`);
  console.log(`${live}/53 exhibits live, ${errors.length} problems`);
  process.exit(ok ? 0 : 1);
}
```

- [ ] **Step 4: Write the orchestrator**

Create `tools/integrate/import-exhibit.mjs`. It performs the mechanical half of an integration; the judgement half stays with the operator.

```javascript
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync,
         rmSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative, posix } from 'node:path';
import { findOrphans, TEMPLATE_LEFTOVERS } from '../assets/prune.mjs';
import { optimizeTree } from '../assets/optimize.mjs';
import { rewriteFile } from './rewrite.mjs';

const args = process.argv.slice(2);
const arg = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const slug = arg('slug');
const srcRepo = arg('src');
const entry = arg('entry');
const subdir = arg('subdir');
const apply = args.includes('--apply');

const SRC = 'src';
const stage = join('.integration-src', `${slug}-stage`);

// 1. Stage a copy so the clone stays pristine and re-runnable.
rmSync(stage, { recursive: true, force: true });
cpSync(join(srcRepo, 'src'), stage, { recursive: true });

// public/ is served verbatim and must move to public/<slug>/ or its assets
// are silently lost. 16 exhibits ship 113 MB there.
const stagePublic = join('.integration-src', `${slug}-stage-public`);
const hasPublic = existsSync(join(srcRepo, 'public'));
rmSync(stagePublic, { recursive: true, force: true });
if (hasPublic) cpSync(join(srcRepo, 'public'), stagePublic, { recursive: true });

// 2. Drop template leftovers.
for (const dir of ['pages', 'components', 'assets', 'layouts', 'styles']) {
  const d = join(stage, dir);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d)) {
    if (TEMPLATE_LEFTOVERS.includes(f)) rmSync(join(d, f), { recursive: true, force: true });
  }
}
rmSync(join(stage, 'pages', 'index.mdx'), { force: true });

// 3. Prune orphans (report only for the import.meta.glob repos).
const orphans = findOrphans(stage);
console.log(`orphans: ${orphans.length} files, ` +
  `${(orphans.reduce((n, o) => n + o.bytes, 0) / 1048576).toFixed(1)} MB`);
for (const o of orphans) console.log(`  ${o.reason.padEnd(12)} ${o.path}`);
if (apply) for (const o of orphans) rmSync(o.path, { force: true });

// 4. Optimize what remains, in src/assets and in public/.
if (hasPublic) {
  const publicOrphans = findOrphans(stagePublic, { haystackDir: stage });
  console.log(`public orphans: ${publicOrphans.length} files`);
  for (const o of publicOrphans) console.log(`  ${o.reason.padEnd(12)} ${o.path}`);
  if (apply) for (const o of publicOrphans) rmSync(o.path, { force: true });
}
const results = apply ? await optimizeTree(join(stage, 'assets'), { apply: true }) : [];
const publicResults = apply && hasPublic
  ? await optimizeTree(stagePublic, { apply: true })
  : [];
const all = [...results, ...publicResults];
const before = all.reduce((n, r) => n + r.beforeBytes, 0);
const after = all.reduce((n, r) => n + (r.afterBytes ?? r.beforeBytes), 0);
console.log(`assets: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

// 5. Build the old -> new path map.
const pathMap = new Map();
const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    e.isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};
for (const kind of ['components', 'assets', 'styles']) {
  for (const file of walk(join(stage, kind))) {
    const rel = relative(stage, file).split(/[\\/]/).join('/');
    const [top, ...rest] = rel.split('/');
    pathMap.set(rel, [top, slug, ...rest].join('/'));
  }
}
for (const r of results) {
  if (r.from === r.to) continue;
  const from = relative(stage, r.from).split(/[\\/]/).join('/');
  const to = relative(stage, r.to).split(/[\\/]/).join('/');
  const [top, ...rest] = to.split('/');
  pathMap.set(from, [top, slug, ...rest].join('/'));
}

// 6. Routes the exhibit used to own, for ${base} link rewriting.
const routes = readdirSync(join(stage, 'pages'))
  .filter((f) => /\.(mdx|astro|md)$/.test(f))
  .map((f) => f.replace(/\.(mdx|astro|md)$/, ''))
  .filter((r) => r !== 'index');
console.log(`routes to re-point: ${routes.join(', ') || '(none)'}`);

// Public asset names, for rewriting /foo.png and ${base}foo.png references.
const publicAssets = hasPublic
  ? walk(stagePublic).map((f) => relative(stagePublic, f).split(/[\\/]/).join('/'))
  : [];
console.log(`public assets to re-point: ${publicAssets.length}`);

console.log(`\nentry page: ${entry} -> src/pages/${slug}.mdx`);
if (subdir) console.log(`sub-pages : ${subdir}/ -> src/pages/${slug}/`);
if (hasPublic) console.log(`public    : -> public/${slug}/`);
console.log(`components: -> src/components/${slug}/`);
console.log(`assets    : -> src/assets/${slug}/`);
console.log(`styles    : -> src/styles/${slug}/`);
if (!apply) { console.log('\ndry run — pass --apply to write into src/'); process.exit(0); }

// 7. Copy into place, rewriting as we go.
const copyRewritten = (fromPath, toPath, fromDir, toDir) => {
  mkdirSync(join(SRC, toDir), { recursive: true });
  const isText = /\.(mdx|md|astro|js|jsx|ts|tsx|css|scss|json)$/.test(fromPath);
  if (!isText) { cpSync(fromPath, toPath); return; }
  const content = readFileSync(fromPath, 'utf8');
  writeFileSync(
    toPath,
    rewriteFile(content, { fromDir, toDir, pathMap, slug, routes, publicAssets }),
  );
};

for (const kind of ['components', 'assets', 'styles']) {
  for (const file of walk(join(stage, kind))) {
    const rel = relative(stage, file).split(/[\\/]/).join('/');
    const to = pathMap.get(rel);
    copyRewritten(file, join(SRC, to), posix.dirname(rel), posix.dirname(to));
  }
}

copyRewritten(join(stage, 'pages', entry), join(SRC, 'pages', `${slug}.mdx`), 'pages', 'pages');

if (subdir) {
  for (const file of walk(join(stage, 'pages', subdir))) {
    const rel = relative(join(stage, 'pages', subdir), file).split(/[\\/]/).join('/');
    copyRewritten(file, join(SRC, 'pages', slug, rel), `pages/${subdir}`, `pages/${slug}`);
  }
}

// 8. Move public/ into its namespace.
if (hasPublic) {
  mkdirSync(join('public', slug), { recursive: true });
  cpSync(stagePublic, join('public', slug), { recursive: true });
  console.log(`public/: ${publicAssets.length} files -> public/${slug}/`);
}

console.log('\ndone. Now: set the layout import, set status live, build, verify, commit.');
```

- [ ] **Step 5: Write the runbook**

Create `docs/integration-runbook.md`:

````markdown
# Per-exhibit integration runbook

Every exhibit task in the implementation plan runs these steps. The plan's
per-exhibit task records only what differs: entry page, sub-page directory,
layout handling, and any known trouble.

## 1. Clone

```bash
git clone --depth 1 [--branch <branch>] <repo>.git .integration-src/<slug>
```

## 2. Dry run

```bash
node tools/integrate/import-exhibit.mjs --slug <slug> --src .integration-src/<slug> \
  --entry <entry-file> [--subdir <subdir>]
```

Read the orphan list. For `s03g2`, `s03g5`, `s03g7`, `s03g8`, `s04g1`, `s05g5`,
`s40g5` the list is unreliable — those repos use `import.meta.glob`. Confirm each
candidate is genuinely unused before applying.

## 3. Apply

```bash
node tools/integrate/import-exhibit.mjs --slug <slug> --src .integration-src/<slug> \
  --entry <entry-file> [--subdir <subdir>] --apply
```

## 4. Fix the layout reference

Open `src/pages/<slug>.mdx` and set frontmatter `layout` to
`'../layouts/ExhibitLayout.astro'`. If the task says the exhibit has its own
layout, copy it to `src/components/<slug>/Layout.astro`, rewrite its imports the
same way, and point the frontmatter at that instead. Sub-pages in
`src/pages/<slug>/` use `'../../layouts/ExhibitLayout.astro'`.

## 5. Scope the styles

Move the exhibit's `global.css` to `src/styles/<slug>/base.css` and wrap its
rules so they cannot escape. For a Tailwind exhibit, replace
`@import "tailwindcss"` with `@import "../tailwind-scoped.css"` and namespace any
`@theme` tokens.

## 6. Go live

Set `"status": "live"` on the exhibit's entry in `src/data/exhibits.json`.

## 7. Verify

```bash
npm run build && npm test && node tools/verify-site.mjs
npm run preview   # then open http://localhost:4321/virtual-exhibit-template/<slug>
```

Compare against the exhibit's original deployment link from the spreadsheet.
Check that interactive components respond, that no other exhibit's styling
changed, and that the homepage still renders.

## 8. Commit

```bash
git add src/ public/
git commit -m "feat: <slug> integration"
```

Record the run's before/after asset totals in the ledger as you go; they are
collected into `docs/asset-optimization-report.md` in the final task.

## If it resists

After a reasonable attempt, fall back to static embed: build the exhibit in its
own clone, copy its `dist/` to `public/<slug>/`, set its `exhibits.json` status
to `external`, and note it in the task. Do not spend unbounded time on a single
exhibit.
````

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Verify the orchestrator dry-runs against a real repo**

```bash
git clone --depth 1 https://github.com/skyparado/virtual-exhibit-template.git .integration-src/s01g7
node tools/integrate/import-exhibit.mjs --slug s01g7 --src .integration-src/s01g7 \
  --entry S01_Group7_fullcapacity.mdx --subdir S01_Group7_fullcapacity
```

Expected: prints an orphan list including the proposal PDFs, the planned moves, and exits without touching `src/`.

- [ ] **Step 8: Commit**

```bash
git add tools/integrate/import-exhibit.mjs tools/verify-site.mjs tools/test/verify-site.test.mjs docs/integration-runbook.md
git commit -m "feat: integration orchestrator, site verifier, and runbook"
```

---
# Phase 1 — Tier A: drop-in exhibits (19)

These are Astro 5, stock layout and `global.css`, no Tailwind, with a clear entry page. They exercise the Phase 0 tooling on the easiest cases. **After the last one, stop for review before starting Phase 2.**

## Task 10: Integrate s01g7 — Full Capacity: The Evolution of Computer Data Storage

**Files:**
- Create: `src/pages/s01g7.mdx`, `src/pages/s01g7/`, `src/components/s01g7/`, `src/assets/s01g7/`, `src/styles/s01g7/`
- Modify: `src/data/exhibits.json` (set `s01g7` to `"status": "live"`)

**Source:** `https://github.com/skyparado/virtual-exhibit-template.git` · entry page `S01_Group7_fullcapacity.mdx` · sub-pages `S01_Group7_fullcapacity/` · 37 components · 42.5 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S01_Group7_ExhibitPageLayout.astro`, `S01_Group7_SiteLayout.astro` → `src/components/s01g7/`.
- **Expect ~13.5 MB of orphans** (proposal documents and stock template images).
- **Internal navigation:** 6 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s01g7/` after the rewrite.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/skyparado/virtual-exhibit-template.git .integration-src/s01g7
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g7 --src .integration-src/s01g7 \
  --entry "S01_Group7_fullcapacity.mdx" --subdir S01_Group7_fullcapacity
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g7 --src .integration-src/s01g7 \
  --entry "S01_Group7_fullcapacity.mdx" --subdir S01_Group7_fullcapacity --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g7` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g7` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g7` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g7 integration"
```

---

## Task 11: Integrate s01g8 — GPU Wars: Five Turning Points That Changed Computing

**Files:**
- Create: `src/pages/s01g8.mdx`, `src/pages/s01g8/`, `src/components/s01g8/`, `src/assets/s01g8/`, `src/styles/s01g8/`
- Modify: `src/data/exhibits.json` (set `s01g8` to `"status": "live"`)

**Source:** `https://github.com/K-K-R-C/CSARCH2-G8-GPU-WARS-FORKED-.git` · entry page `01-main.mdx` · sub-pages `SO1_Group8_subpages/` · 11 components · 9.9 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S01_Group8_GPUWarsLayout.astro` → `src/components/s01g8/`.
- **Expect ~2.6 MB of orphans** (proposal documents and stock template images).
- **Internal navigation:** 3 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s01g8/` after the rewrite.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/K-K-R-C/CSARCH2-G8-GPU-WARS-FORKED-.git .integration-src/s01g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g8 --src .integration-src/s01g8 \
  --entry "01-main.mdx" --subdir SO1_Group8_subpages
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g8 --src .integration-src/s01g8 \
  --entry "01-main.mdx" --subdir SO1_Group8_subpages --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g8 integration"
```

---

## Task 12: Integrate s02g2 — Made in Asia

**Files:**
- Create: `src/pages/s02g2.mdx`, `src/components/s02g2/`, `src/assets/s02g2/`, `src/styles/s02g2/`
- Modify: `src/data/exhibits.json` (set `s02g2` to `"status": "live"`)

**Source:** `https://github.com/justineaniko/csarch-virtual-exhibit.git` · entry page `made-in-asia.mdx` · 7 components · 5.9 MB

**Specifics for this exhibit:**

- **Expect ~1.4 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/justineaniko/csarch-virtual-exhibit.git .integration-src/s02g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g2 --src .integration-src/s02g2 \
  --entry "made-in-asia.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g2 --src .integration-src/s02g2 \
  --entry "made-in-asia.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g2 integration"
```

---

## Task 13: Integrate s03g4 — The Apollo Guidance Computer

**Files:**
- Create: `src/pages/s03g4.mdx`, `src/pages/s03g4/`, `src/components/s03g4/`, `src/assets/s03g4/`, `src/styles/s03g4/`
- Modify: `src/data/exhibits.json` (set `s03g4` to `"status": "live"`)

**Source:** `https://github.com/chiramisu/S03-CSARCH2-G4-AGC.git` · entry page `apollo-guidance-computer.mdx` · sub-pages `homepage/`, `innovations/`, `timeline/` · 8 components · 154.6 MB

**Specifics for this exhibit:**

- **Modified `global.css`** (17 lines differ) → `src/styles/s03g4/base.css`, scoped.
- **Expect ~3.4 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/chiramisu/S03-CSARCH2-G4-AGC.git .integration-src/s03g4
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir homepage
```

Then repeat for the other two sub-page directories:

```bash
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir innovations
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir timeline
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir homepage --apply
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir innovations --apply
node tools/integrate/import-exhibit.mjs --slug s03g4 --src .integration-src/s03g4 \
  --entry "apollo-guidance-computer.mdx" --subdir timeline --apply
```

The three sub-page directories land as `src/pages/s03g4/homepage/`,
`src/pages/s03g4/innovations/`, and `src/pages/s03g4/timeline/`.

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g4` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g4` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g4` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g4 integration"
```

---

## Task 14: Integrate s03g6 — Multicore Processors: Keeping It Cool

**Files:**
- Create: `src/pages/s03g6.mdx`, `src/components/s03g6/`, `src/assets/s03g6/`, `src/styles/s03g6/`
- Modify: `src/data/exhibits.json` (set `s03g6` to `"status": "live"`)

**Source:** `https://github.com/Kwimbowo/virtual-exhibit-67cores.git` · entry page `multicore-processors.mdx` · 14 components · 5.9 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Kwimbowo/virtual-exhibit-67cores.git .integration-src/s03g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g6 --src .integration-src/s03g6 \
  --entry "multicore-processors.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g6 --src .integration-src/s03g6 \
  --entry "multicore-processors.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g6 integration"
```

---

## Task 15: Integrate s03g8 — The Chiplet Revolution

**Files:**
- Create: `src/pages/s03g8.mdx`, `src/components/s03g8/`, `src/assets/s03g8/`, `src/styles/s03g8/`
- Modify: `src/data/exhibits.json` (set `s03g8` to `"status": "live"`)

**Source:** `https://github.com/Kemo1006/CSARCH2-Chiplet-Revolution.git` · entry page `chip-rev.mdx` · 8 components · 32.1 MB

**Specifics for this exhibit:**

- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Expect ~18.8 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Kemo1006/CSARCH2-Chiplet-Revolution.git .integration-src/s03g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g8 --src .integration-src/s03g8 \
  --entry "chip-rev.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g8 --src .integration-src/s03g8 \
  --entry "chip-rev.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g8 integration"
```

---

## Task 16: Integrate s04g2 — Virtual Memory: How It Works

**Files:**
- Create: `src/pages/s04g2.mdx`, `src/components/s04g2/`, `src/assets/s04g2/`, `src/styles/s04g2/`
- Modify: `src/data/exhibits.json` (set `s04g2` to `"status": "live"`)

**Source:** `https://github.com/Hase1202/virtual-exhibit-template.git` · entry page `virtual-memory.mdx` · 15 components · 2.7 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S04_Group2_ExhibitLayout.astro` → `src/components/s04g2/`.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Hase1202/virtual-exhibit-template.git .integration-src/s04g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g2 --src .integration-src/s04g2 \
  --entry "virtual-memory.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g2 --src .integration-src/s04g2 \
  --entry "virtual-memory.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g2 integration"
```

---

## Task 17: Integrate s04g3 — Journey of an Instruction: Microprogramming

**Files:**
- Create: `src/pages/s04g3.mdx`, `src/components/s04g3/`, `src/assets/s04g3/`, `src/styles/s04g3/`
- Modify: `src/data/exhibits.json` (set `s04g3` to `"status": "live"`)

**Source:** `https://github.com/beepatricio/CSARCH2_VirtualExhibit.git` · entry page `microprogramming.mdx` · 14 components · 3.7 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/beepatricio/CSARCH2_VirtualExhibit.git .integration-src/s04g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g3 --src .integration-src/s04g3 \
  --entry "microprogramming.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g3 --src .integration-src/s04g3 \
  --entry "microprogramming.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g3 integration"
```

---

## Task 18: Integrate s04g6 — Inside-RAM

**Files:**
- Create: `src/pages/s04g6.mdx`, `src/components/s04g6/`, `src/assets/s04g6/`, `src/styles/s04g6/`
- Modify: `src/data/exhibits.json` (set `s04g6` to `"status": "live"`)

**Source:** `https://github.com/dev-gabb-711/arch2-case-study-2.git` · entry page `S04-Group6-Inside-Ram.mdx` · 9 components · 41.4 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/dev-gabb-711/arch2-case-study-2.git .integration-src/s04g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g6 --src .integration-src/s04g6 \
  --entry "S04-Group6-Inside-Ram.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g6 --src .integration-src/s04g6 \
  --entry "S04-Group6-Inside-Ram.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g6 integration"
```

---

## Task 19: Integrate s04g7 — The Glass Canvas

**Files:**
- Create: `src/pages/s04g7.mdx`, `src/pages/s04g7/`, `src/components/s04g7/`, `src/assets/s04g7/`, `src/styles/s04g7/`
- Modify: `src/data/exhibits.json` (set `s04g7` to `"status": "live"`)

**Source:** `https://github.com/20-ash/CSARCH2-virtual-exhibit.git` · entry page `displays.mdx` · sub-pages `S04_Group7_model_pages/` · 14 components · 14.1 MB

**Specifics for this exhibit:**

- **Modified `global.css`** (13 lines differ) → `src/styles/s04g7/base.css`, scoped.
- **Expect ~4.1 MB of orphans** (proposal documents and stock template images).
- **Internal navigation:** 7 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s04g7/` after the rewrite.
- **Notable libraries:** `three`, `@react-three/fiber`, `@react-three/drei`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/20-ash/CSARCH2-virtual-exhibit.git .integration-src/s04g7
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g7 --src .integration-src/s04g7 \
  --entry "displays.mdx" --subdir S04_Group7_model_pages
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g7 --src .integration-src/s04g7 \
  --entry "displays.mdx" --subdir S04_Group7_model_pages --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g7` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g7` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g7` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g7 integration"
```

---

## Task 20: Integrate s04g9 — Flash Memory: How SSDs Store Data

**Files:**
- Create: `src/pages/s04g9.mdx`, `src/components/s04g9/`, `src/assets/s04g9/`, `src/styles/s04g9/`
- Modify: `src/data/exhibits.json` (set `s04g9` to `"status": "live"`)

**Source:** `https://github.com/pitowalosian/CSARCH2-ADEOS.git` · entry page `ADEOS_Group9_flash-memory.mdx` · 9 components · 48.4 MB

**Specifics for this exhibit:**

- **Expect ~4.8 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/pitowalosian/CSARCH2-ADEOS.git .integration-src/s04g9
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g9 --src .integration-src/s04g9 \
  --entry "ADEOS_Group9_flash-memory.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g9 --src .integration-src/s04g9 \
  --entry "ADEOS_Group9_flash-memory.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g9` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g9` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g9` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g9 integration"
```

---

## Task 21: Integrate s05g1 — Historical Cryptography: The Enigma Machine

**Files:**
- Create: `src/pages/s05g1.mdx`, `src/components/s05g1/`, `src/assets/s05g1/`, `src/styles/s05g1/`
- Modify: `src/data/exhibits.json` (set `s05g1` to `"status": "live"`)

**Source:** `https://github.com/shaocodes/virtual_exhibit_g1.git` · entry page `the_enigma.mdx` · 5 components · 4.5 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/shaocodes/virtual_exhibit_g1.git .integration-src/s05g1
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g1 --src .integration-src/s05g1 \
  --entry "the_enigma.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g1 --src .integration-src/s05g1 \
  --entry "the_enigma.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g1` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g1` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g1` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g1 integration"
```

---

## Task 22: Integrate s05g6 — History of ARM Architecture

**Files:**
- Create: `src/pages/s05g6.mdx`, `src/components/s05g6/`, `src/assets/s05g6/`, `src/styles/s05g6/`
- Modify: `src/data/exhibits.json` (set `s05g6` to `"status": "live"`)

**Source:** `https://github.com/miraiTee/ARCH2---VET-G6-S05-.git` · entry page `ARM-architecture.mdx` · 5 components · 7.5 MB

**Specifics for this exhibit:**

- **Expect ~1.4 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/miraiTee/ARCH2---VET-G6-S05-.git .integration-src/s05g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g6 --src .integration-src/s05g6 \
  --entry "ARM-architecture.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g6 --src .integration-src/s05g6 \
  --entry "ARM-architecture.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g6 integration"
```

---

## Task 23: Integrate s05g7 — History of Macintosh

**Files:**
- Create: `src/pages/s05g7.mdx`, `src/components/s05g7/`, `src/assets/s05g7/`, `src/styles/s05g7/`
- Modify: `src/data/exhibits.json` (set `s05g7` to `"status": "live"`)

**Source:** `https://github.com/Aidan-Papa/CSARCH2-Group-7.git` · entry page `macintosh.mdx` · 4 components · 9.3 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S05_Group7_ClassicOsLayout.astro` → `src/components/s05g7/`.
- **Expect ~2.3 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Aidan-Papa/CSARCH2-Group-7.git .integration-src/s05g7
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g7 --src .integration-src/s05g7 \
  --entry "macintosh.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g7 --src .integration-src/s05g7 \
  --entry "macintosh.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g7` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g7` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g7` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g7 integration"
```

---

## Task 24: Integrate s05g8 — Bytes of the Past

**Files:**
- Create: `src/pages/s05g8.mdx`, `src/components/s05g8/`, `src/assets/s05g8/`, `src/styles/s05g8/`
- Modify: `src/data/exhibits.json` (set `s05g8` to `"status": "live"`)

**Source:** `https://github.com/festivities/CSARCH2-S05-Y2526T3_virtual-exhibit.git` · entry page `storage-evolution.mdx` · 8 components · 39.4 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/festivities/CSARCH2-S05-Y2526T3_virtual-exhibit.git .integration-src/s05g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g8 --src .integration-src/s05g8 \
  --entry "storage-evolution.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g8 --src .integration-src/s05g8 \
  --entry "storage-evolution.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g8 integration"
```

---

## Task 25: Integrate s40g1 — Alice Through the Snooping Bus: A Wonderland of Cache Coherence

**Files:**
- Create: `src/pages/s40g1.mdx`, `src/components/s40g1/`, `src/assets/s40g1/`, `src/styles/s40g1/`
- Modify: `src/data/exhibits.json` (set `s40g1` to `"status": "live"`)

**Source:** `https://github.com/04leafcloverr/virtual-exhibit.git` · entry page `alice-cache-coherence.mdx` · 10 components · 26.4 MB

**Specifics for this exhibit:**

- **Notable libraries:** `zustand`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/04leafcloverr/virtual-exhibit.git .integration-src/s40g1
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g1 --src .integration-src/s40g1 \
  --entry "alice-cache-coherence.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g1 --src .integration-src/s40g1 \
  --entry "alice-cache-coherence.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g1` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g1` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g1` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g1 integration"
```

---

## Task 26: Integrate s40g3 — How Drawing Tablets Work

**Files:**
- Create: `src/pages/s40g3.mdx`, `src/components/s40g3/`, `src/assets/s40g3/`, `src/styles/s40g3/`
- Modify: `src/data/exhibits.json` (set `s40g3` to `"status": "live"`)

**Source:** `https://github.com/Enzo-user/virtual-exhibit-template.git` · entry page `drawing-tablet.mdx` · 4 components · 0.4 MB

**Specifics for this exhibit:**

- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Enzo-user/virtual-exhibit-template.git .integration-src/s40g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g3 --src .integration-src/s40g3 \
  --entry "drawing-tablet.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g3 --src .integration-src/s40g3 \
  --entry "drawing-tablet.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g3 integration"
```

---

## Task 27: Integrate s40g6 — Understanding USB-C

**Files:**
- Create: `src/pages/s40g6.mdx`, `src/components/s40g6/`, `src/assets/s40g6/`, `src/styles/s40g6/`
- Modify: `src/data/exhibits.json` (set `s40g6` to `"status": "live"`)

**Source:** `https://github.com/TheNinjaDude12/virtual-exhibit-template.git` · entry page `usb.mdx` · 10 components · 6.5 MB

**Specifics for this exhibit:**

- **Notable libraries:** `three`, `three-stdlib`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/TheNinjaDude12/virtual-exhibit-template.git .integration-src/s40g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g6 --src .integration-src/s40g6 \
  --entry "usb.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g6 --src .integration-src/s40g6 \
  --entry "usb.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g6 integration"
```

---

## Task 28: Integrate s40g8 — How SSDs Work

**Files:**
- Create: `src/pages/s40g8.mdx`, `src/components/s40g8/`, `src/assets/s40g8/`, `src/styles/s40g8/`
- Modify: `src/data/exhibits.json` (set `s40g8` to `"status": "live"`)

**Source:** `https://github.com/trem4ngo/virtual-exhibit-grp8.git` · entry page `ssd.mdx` · 3 components · 2.1 MB

**Specifics for this exhibit:**

- **Expect ~1.7 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/trem4ngo/virtual-exhibit-grp8.git .integration-src/s40g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g8 --src .integration-src/s40g8 \
  --entry "ssd.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g8 --src .integration-src/s40g8 \
  --entry "ssd.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g8 integration"
```

---

# Phase 2 — Tier B: adapt (16)

Stock layout and `global.css`, but each needs either a Tailwind rewiring or a fix for being authored against a different Astro major.

## Task 29: Integrate s01g2 — FreeBSD: Virtual Exhibit

**Files:**
- Create: `src/pages/s01g2.mdx`, `src/pages/s01g2/`, `src/components/s01g2/`, `src/assets/s01g2/`, `src/styles/s01g2/`
- Modify: `src/data/exhibits.json` (set `s01g2` to `"status": "live"`)

**Source:** `https://github.com/notgian/freebsd-virtual-exhibit.git` · entry page `freebsd.mdx` · sub-pages `freebsd/` · 16 components · 13.3 MB

**Specifics for this exhibit:**

- **Own layout(s):** `HistoryTimeline.astro`, `S01_Group2_FreeBSDLayout.astro` → `src/components/s01g2/`.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Internal navigation:** 9 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s01g2/` after the rewrite.
- **Notable libraries:** `three`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/notgian/freebsd-virtual-exhibit.git .integration-src/s01g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g2 --src .integration-src/s01g2 \
  --entry "freebsd.mdx" --subdir freebsd
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g2 --src .integration-src/s01g2 \
  --entry "freebsd.mdx" --subdir freebsd --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g2 integration"
```

---

## Task 30: Integrate s01g3 — Evolution of Wi-Fi

**Files:**
- Create: `src/pages/s01g3.mdx`, `src/components/s01g3/`, `src/assets/s01g3/`, `src/styles/s01g3/`
- Modify: `src/data/exhibits.json` (set `s01g3` to `"status": "live"`)

**Source:** `https://github.com/mykanadine/WifiGeneration.git` · entry page `wifi.mdx` · 10 components · 2.9 MB

**Specifics for this exhibit:**

- **Notable libraries:** `webcoreui`, `sass-embedded`, `react-vertical-timeline-component`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/mykanadine/WifiGeneration.git .integration-src/s01g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g3 --src .integration-src/s01g3 \
  --entry "wifi.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g3 --src .integration-src/s01g3 \
  --entry "wifi.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g3 integration"
```

---

## Task 31: Integrate s01g5 — Silicon Minds

**Files:**
- Create: `src/pages/s01g5.mdx`, `src/pages/s01g5/`, `src/components/s01g5/`, `src/assets/s01g5/`, `src/styles/s01g5/`
- Modify: `src/data/exhibits.json` (set `s01g5` to `"status": "live"`)

**Source:** `https://github.com/theoithinkk/virtual-exhibit-template.git` · entry page `silicon-minds.mdx` · sub-pages `silicon-minds/` · 7 components · 8.5 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S01_Group5_BaseLayout.astro` → `src/components/s01g5/`.
- **Tailwind v3 via `@astrojs/tailwind`.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens. **Migrate to v4**: replace `@tailwind base/components/utilities` with the shared entry, and move `tailwind.config.js` theme values into `@theme`.
- **Authored on Astro 4**, building under 5. Expect config-level breaks, not page-source breaks.
- **Internal navigation:** 5 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s01g5/` after the rewrite.
- **Notable libraries:** `framer-motion`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/theoithinkk/virtual-exhibit-template.git .integration-src/s01g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g5 --src .integration-src/s01g5 \
  --entry "silicon-minds.mdx" --subdir silicon-minds
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g5 --src .integration-src/s01g5 \
  --entry "silicon-minds.mdx" --subdir silicon-minds --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g5 integration"
```

---

## Task 32: Integrate s01g6 — The Evolution of Wifi

**Files:**
- Create: `src/pages/s01g6.mdx`, `src/components/s01g6/`, `src/assets/s01g6/`, `src/styles/s01g6/`
- Modify: `src/data/exhibits.json` (set `s01g6` to `"status": "live"`)

**Source:** `https://github.com/pring-nt/virtual-exhibit-wifi-evolution.git` · entry page `wifi-evolution.mdx` · 26 components · 4.8 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Notable libraries:** `embla-carousel-react`, `@base-ui/react`, `shadcn`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/pring-nt/virtual-exhibit-wifi-evolution.git .integration-src/s01g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g6 --src .integration-src/s01g6 \
  --entry "wifi-evolution.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g6 --src .integration-src/s01g6 \
  --entry "wifi-evolution.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g6 integration"
```

---

## Task 33: Integrate s01g9 — ARM vs x86: Interactive Architecture Explorer

**Files:**
- Create: `src/pages/s01g9.mdx`, `src/components/s01g9/`, `src/assets/s01g9/`, `src/styles/s01g9/`
- Modify: `src/data/exhibits.json` (set `s01g9` to `"status": "live"`)

**Source:** `https://github.com/zachhallare/virtual-exhibit-template.git` · entry page `arm_vs_x86.mdx` · 9 components · 9.0 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Notable libraries:** `framer-motion`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/zachhallare/virtual-exhibit-template.git .integration-src/s01g9
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g9 --src .integration-src/s01g9 \
  --entry "arm_vs_x86.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s01g9 --src .integration-src/s01g9 \
  --entry "arm_vs_x86.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s01g9` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s01g9` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s01g9` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s01g9 integration"
```

---

## Task 34: Integrate s02g3 — Evolution of Windows OS

**Files:**
- Create: `src/pages/s02g3.mdx`, `src/components/s02g3/`, `src/assets/s02g3/`, `src/styles/s02g3/`
- Modify: `src/data/exhibits.json` (set `s02g3` to `"status": "live"`)

**Source:** `https://github.com/pyxlaria/CSARCH2-Virtual-Exhibit-Group-3.git` · entry page `windows.mdx` · 6 components · 9.4 MB

**Specifics for this exhibit:**

- **Authored on Astro 4**, building under 5. Expect config-level breaks, not page-source breaks.
- **Expect ~5.1 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `howler`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/pyxlaria/CSARCH2-Virtual-Exhibit-Group-3.git .integration-src/s02g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g3 --src .integration-src/s02g3 \
  --entry "windows.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g3 --src .integration-src/s02g3 \
  --entry "windows.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g3 integration"
```

---

## Task 35: Integrate s03g1 — The Heartbleed Bug

**Files:**
- Create: `src/pages/s03g1.mdx`, `src/components/s03g1/`, `src/assets/s03g1/`, `src/styles/s03g1/`
- Modify: `src/data/exhibits.json` (set `s03g1` to `"status": "live"`)

**Source:** `https://github.com/2ru17/virtual-exhibit-proj-2026-g1.git` · entry page `heartbleed.mdx` · 0 components · 4.6 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Expect ~4.1 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `three`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/2ru17/virtual-exhibit-proj-2026-g1.git .integration-src/s03g1
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g1 --src .integration-src/s03g1 \
  --entry "heartbleed.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g1 --src .integration-src/s03g1 \
  --entry "heartbleed.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g1` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g1` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g1` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g1 integration"
```

---

## Task 36: Integrate s03g2 — FATAL CONVERS10N

**Files:**
- Create: `src/pages/s03g2.mdx`, `src/components/s03g2/`, `src/assets/s03g2/`, `src/styles/s03g2/`
- Modify: `src/data/exhibits.json` (set `s03g2` to `"status": "live"`)

**Source:** `https://github.com/DREV-c/G2-S03-virtual-exhibit.git` branch `integration/final` · entry page `ariane_5.mdx` · 25 components · 6.4 MB

**Specifics for this exhibit:**

- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Notable libraries:** `framer-motion`, `clsx`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 --branch integration/final https://github.com/DREV-c/G2-S03-virtual-exhibit.git .integration-src/s03g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g2 --src .integration-src/s03g2 \
  --entry "ariane_5.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g2 --src .integration-src/s03g2 \
  --entry "ariane_5.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g2 integration"
```

---

## Task 37: Integrate s03g3 — Memory Block Blast

**Files:**
- Create: `src/pages/s03g3.mdx`, `src/components/s03g3/`, `src/assets/s03g3/`, `src/styles/s03g3/`
- Modify: `src/data/exhibits.json` (set `s03g3` to `"status": "live"`)

**Source:** `https://github.com/rdgonzaga/memory-block-blast.git` · entry page `voyager.mdx` · 2 components · 1.2 MB

**Specifics for this exhibit:**

- **Tailwind v3 via `@astrojs/tailwind`.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens. **Migrate to v4**: replace `@tailwind base/components/utilities` with the shared entry, and move `tailwind.config.js` theme values into `@theme`.
- **Notable libraries:** `gsap`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/rdgonzaga/memory-block-blast.git .integration-src/s03g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g3 --src .integration-src/s03g3 \
  --entry "voyager.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g3 --src .integration-src/s03g3 \
  --entry "voyager.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g3 integration"
```

---

## Task 38: Integrate s03g5 — The Y2K & Y2K38 Bug

**Files:**
- Create: `src/pages/s03g5.mdx`, `src/pages/s03g5/`, `src/components/s03g5/`, `src/assets/s03g5/`, `src/styles/s03g5/`
- Modify: `src/data/exhibits.json` (set `s03g5` to `"status": "live"`)

**Source:** `https://github.com/mbchavez27/arch-virtual-exhibit.git` · entry page `y2k-38.mdx` · sub-pages `y2k-38/` · 10 components · 6.7 MB

**Specifics for this exhibit:**

- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Expect ~3.4 MB of orphans** (proposal documents and stock template images).
- **Internal navigation:** 4 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s03g5/` after the rewrite.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/mbchavez27/arch-virtual-exhibit.git .integration-src/s03g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g5 --src .integration-src/s03g5 \
  --entry "y2k-38.mdx" --subdir y2k-38
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g5 --src .integration-src/s03g5 \
  --entry "y2k-38.mdx" --subdir y2k-38 --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g5 integration"
```

---

## Task 39: Integrate s03g7 — Project Spectre

**Files:**
- Create: `src/pages/s03g7.mdx`, `src/components/s03g7/`, `src/assets/s03g7/`, `src/styles/s03g7/`
- Modify: `src/data/exhibits.json` (set `s03g7` to `"status": "live"`)

**Source:** `https://github.com/imnotneon-dev/CSARCH2-Virtual-Exhibit.git` · entry page `S03_Group7_spectre.mdx` · 9 components · 9.0 MB

**Specifics for this exhibit:**

- **Own layout(s):** `S03_Group7_SpectreLayout.astro` → `src/components/s03g7/`.
- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Expect ~6.8 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/imnotneon-dev/CSARCH2-Virtual-Exhibit.git .integration-src/s03g7
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g7 --src .integration-src/s03g7 \
  --entry "S03_Group7_spectre.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g7 --src .integration-src/s03g7 \
  --entry "S03_Group7_spectre.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g7` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g7` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g7` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g7 integration"
```

---

## Task 40: Integrate s04g8 — Inside a Digital Image: How Computers Store and Transform Visual Data

**Files:**
- Create: `src/pages/s04g8.mdx`, `src/components/s04g8/`, `src/assets/s04g8/`, `src/styles/s04g8/`
- Modify: `src/data/exhibits.json` (set `s04g8` to `"status": "live"`)

**Source:** `https://github.com/PrinceMPS/virtual-exhibit-template.git` · entry page `digital_image_processing.mdx` · 13 components · 4.7 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Notable libraries:** `framer-motion`, `react-dropzone`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/PrinceMPS/virtual-exhibit-template.git .integration-src/s04g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g8 --src .integration-src/s04g8 \
  --entry "digital_image_processing.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g8 --src .integration-src/s04g8 \
  --entry "digital_image_processing.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g8 integration"
```

---

## Task 41: Integrate s05g3 — The Internet's Journey

**Files:**
- Create: `src/pages/s05g3.mdx`, `src/components/s05g3/`, `src/assets/s05g3/`, `src/styles/s05g3/`
- Modify: `src/data/exhibits.json` (set `s05g3` to `"status": "live"`)

**Source:** `https://github.com/HungryDavid/virtual-exhibit-template.git` · entry page `The Internet’s birth – ARPANET to WWW.mdx` · 8 components · 10.4 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Expect ~4.9 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/HungryDavid/virtual-exhibit-template.git .integration-src/s05g3
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g3 --src .integration-src/s05g3 \
  --entry "The Internet’s birth – ARPANET to WWW.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g3 --src .integration-src/s05g3 \
  --entry "The Internet’s birth – ARPANET to WWW.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g3` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g3` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g3` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g3 integration"
```

---

## Task 42: Integrate s05g4 — Mga Nanguna: Filipino Pioneers Who Shaped the Digital World

**Files:**
- Create: `src/pages/s05g4.mdx`, `src/components/s05g4/`, `src/assets/s05g4/`, `src/styles/s05g4/`
- Modify: `src/data/exhibits.json` (set `s05g4` to `"status": "live"`)

**Source:** `https://github.com/Oldcow25/Group4_CSARCH2_Computer-Architecture-are-Forever.git` · entry page `pioneers.mdx` · 5 components · 4.8 MB

**Specifics for this exhibit:**

- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Oldcow25/Group4_CSARCH2_Computer-Architecture-are-Forever.git .integration-src/s05g4
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g4 --src .integration-src/s05g4 \
  --entry "pioneers.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g4 --src .integration-src/s05g4 \
  --entry "pioneers.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g4` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g4` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g4` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g4 integration"
```

---

## Task 43: Integrate s05g9 — Kumusta Mundo

**Files:**
- Create: `src/pages/s05g9.mdx`, `src/components/s05g9/`, `src/assets/s05g9/`, `src/styles/s05g9/`
- Modify: `src/data/exhibits.json` (set `s05g9` to `"status": "live"`)

**Source:** `https://github.com/tartar121/KumustaMundo.git` · entry page `kumusta-mundo.mdx` · 8 components · 34.5 MB

**Specifics for this exhibit:**

- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/tartar121/KumustaMundo.git .integration-src/s05g9
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g9 --src .integration-src/s05g9 \
  --entry "kumusta-mundo.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g9 --src .integration-src/s05g9 \
  --entry "kumusta-mundo.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g9` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g9` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g9` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g9 integration"
```

---

## Task 44: Integrate s40g5 — Cloud Storage Architecture

**Files:**
- Create: `src/pages/s40g5.mdx`, `src/components/s40g5/`, `src/assets/s40g5/`, `src/styles/s40g5/`
- Modify: `src/data/exhibits.json` (set `s40g5` to `"status": "live"`)

**Source:** `https://github.com/robnigel0313/CSARCH2-G5-S40-Virtual-Exhibit.git` · entry page `cloud-storage.mdx` · 2 components · 15.5 MB

**Specifics for this exhibit:**

- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/robnigel0313/CSARCH2-G5-S40-Virtual-Exhibit.git .integration-src/s40g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g5 --src .integration-src/s40g5 \
  --entry "cloud-storage.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g5 --src .integration-src/s40g5 \
  --entry "cloud-storage.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g5 integration"
```

---

# Phase 3 — Tier C: rework (15)

Each rewrote a protected file, squats on `index.*`, or uses routing the umbrella does not provide. These carry the highest chance of falling back to static embed.

## Task 45: Integrate s02g1 — From Mainframes to Microprocessors

**Files:**
- Create: `src/pages/s02g1.mdx`, `src/components/s02g1/`, `src/assets/s02g1/`, `src/styles/s02g1/`
- Modify: `src/data/exhibits.json` (set `s02g1` to `"status": "live"`)

**Source:** `https://github.com/seoyunnie/ARCH2-Mainframes-to-Microprocessors.git` · entry page `main-to-micro.mdx` · 4 components · 4.7 MB

**Specifics for this exhibit:**

- **Modified `global.css`** (239 lines differ) → `src/styles/s02g1/base.css`, scoped.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/seoyunnie/ARCH2-Mainframes-to-Microprocessors.git .integration-src/s02g1
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g1 --src .integration-src/s02g1 \
  --entry "main-to-micro.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g1 --src .integration-src/s02g1 \
  --entry "main-to-micro.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g1` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g1` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g1` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g1 integration"
```

---

## Task 46: Integrate s02g4 — The Evolution of Computer Graphics

**Files:**
- Create: `src/pages/s02g4.mdx`, `src/components/s02g4/`, `src/assets/s02g4/`, `src/styles/s02g4/`
- Modify: `src/data/exhibits.json` (set `s02g4` to `"status": "live"`)

**Source:** `https://github.com/kimsajaang/case-study-project-grp-4-csarch2.git` branch `deployment-v2` · entry page `exhibit.mdx` · 14 components · 0.5 MB

**Specifics for this exhibit:**

- **Sibling pages.** After the orchestrator runs, move `timeline.astro` into `src/pages/s02g4/` by hand and re-point their `${base}` links to `${base}s02g4/…`.
- **Own layout(s):** `TimelineLayout.astro` → `src/components/s02g4/`.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Authored on Astro 4**, building under 5. Expect config-level breaks, not page-source breaks.
- **Internal navigation:** 3 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s02g4/` after the rewrite.
- **Notable libraries:** `three`, `@react-three/fiber`, `@react-three/drei`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 --branch deployment-v2 https://github.com/kimsajaang/case-study-project-grp-4-csarch2.git .integration-src/s02g4
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g4 --src .integration-src/s02g4 \
  --entry "exhibit.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g4 --src .integration-src/s02g4 \
  --entry "exhibit.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g4` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g4` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g4` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g4 integration"
```

---

## Task 47: Integrate s02g5 — From Pixels to Polygons: A Silicon Quest Through Gaming

**Files:**
- Create: `src/pages/s02g5.mdx`, `src/pages/s02g5/`, `src/components/s02g5/`, `src/assets/s02g5/`, `src/styles/s02g5/`
- Modify: `src/data/exhibits.json` (set `s02g5` to `"status": "live"`)

**Source:** `https://github.com/margz05/CSARCH2-S02-Group5.git` · entry page `index.astro` · sub-pages `1970s/`, `1980s/`, `1990s/`, `2000s/`, `2010s/`, `2020s/` · 9 components · 0.3 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.astro`; it becomes `src/pages/s02g5.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Modified `ExhibitLayout.astro`** (173 lines differ). Copy the exhibit's version to `src/components/s02g5/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Modified `global.css`** (267 lines differ) → `src/styles/s02g5/base.css`, scoped.
- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.
- **Internal navigation:** 3 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s02g5/` after the rewrite.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/margz05/CSARCH2-S02-Group5.git .integration-src/s02g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g5 --src .integration-src/s02g5 \
  --entry "index.astro" --subdir 1970s
```

Repeat for each remaining decade:

```bash
for d in 1980s 1990s 2000s 2010s 2020s; do
  node tools/integrate/import-exhibit.mjs --slug s02g5 --src .integration-src/s02g5 \
    --entry "index.astro" --subdir "$d"
done
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g5 --src .integration-src/s02g5 \
  --entry "index.astro" --subdir 1970s --apply
for d in 1980s 1990s 2000s 2010s 2020s; do
  node tools/integrate/import-exhibit.mjs --slug s02g5 --src .integration-src/s02g5 \
    --entry "index.astro" --subdir "$d" --apply
done
```

Each decade lands as `src/pages/s02g5/<decade>/index.mdx`, so the routes become
`/s02g5/1970s` through `/s02g5/2020s`.

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g5 integration"
```

---

## Task 48: Integrate s02g6 — Evolution of Computing in the Philippines

**Files:**
- Create: `src/pages/s02g6.mdx`, `src/components/s02g6/`, `src/assets/s02g6/`, `src/styles/s02g6/`
- Modify: `src/data/exhibits.json` (set `s02g6` to `"status": "live"`)

**Source:** `https://github.com/gabe-0017/CSARCH2-Group-6.git` · entry page `index.astro` · 12 components · 0.2 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.astro`; it becomes `src/pages/s02g6.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Modified `global.css`** (287 lines differ) → `src/styles/s02g6/base.css`, scoped.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Notable libraries:** `leaflet`, `react-leaflet`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/gabe-0017/CSARCH2-Group-6.git .integration-src/s02g6
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g6 --src .integration-src/s02g6 \
  --entry "index.astro"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g6 --src .integration-src/s02g6 \
  --entry "index.astro" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g6` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g6` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g6` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g6 integration"
```

---

## Task 49: Integrate s02g8 — Historical Computing: Evolution of Human-Computer Interaction

**Files:**
- Create: `src/pages/s02g8.mdx`, `src/components/s02g8/`, `src/assets/s02g8/`, `src/styles/s02g8/`
- Modify: `src/data/exhibits.json` (set `s02g8` to `"status": "live"`)

**Source:** `https://github.com/rainahlga/CSARCH2-HCI-Virtual-Exhibit.git` · entry page `index.mdx` · 9 components · 108.2 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.mdx`; it becomes `src/pages/s02g8.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Expect ~104.1 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/rainahlga/CSARCH2-HCI-Virtual-Exhibit.git .integration-src/s02g8
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g8 --src .integration-src/s02g8 \
  --entry "index.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g8 --src .integration-src/s02g8 \
  --entry "index.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g8` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g8` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g8` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g8 integration"
```

---

## Task 50: Integrate s02g9 — CipherToSilicon

**Files:**
- Create: `src/pages/s02g9.mdx`, `src/components/s02g9/`, `src/assets/s02g9/`, `src/styles/s02g9/`
- Modify: `src/data/exhibits.json` (set `s02g9` to `"status": "live"`)

**Source:** `https://github.com/NathanJC2/CipherToSilicon.git` · entry page `index.astro` · 39 components · 33.1 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.astro`; it becomes `src/pages/s02g9.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Own layout(s):** `Layout.astro` → `src/components/s02g9/`.
- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Expect ~22.8 MB of orphans** (proposal documents and stock template images).
- **Internal navigation:** 4 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s02g9/` after the rewrite.
- **Notable libraries:** `@photo-sphere-viewer/core`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/NathanJC2/CipherToSilicon.git .integration-src/s02g9
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g9 --src .integration-src/s02g9 \
  --entry "index.astro"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s02g9 --src .integration-src/s02g9 \
  --entry "index.astro" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s02g9` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s02g9` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g9` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s02g9 integration"
```

---

## Task 51: Integrate s03g9 — GO or ABORT: Apollo 11 1202 Alarm

**Files:**
- Create: `src/pages/s03g9.mdx`, `src/components/s03g9/`, `src/assets/s03g9/`, `src/styles/s03g9/`
- Modify: `src/data/exhibits.json` (set `s03g9` to `"status": "live"`)

**Source:** `https://github.com/hsimingg/CSARCH2-G9-Exhibit.git` · entry page `index.astro` · 10 components · 57.4 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.astro`; it becomes `src/pages/s03g9.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Own layout(s):** `S03_Group9_Layout.astro` → `src/components/s03g9/`.
- **Modified `global.css`** (604 lines differ) → `src/styles/s03g9/base.css`, scoped.
- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/hsimingg/CSARCH2-G9-Exhibit.git .integration-src/s03g9
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g9 --src .integration-src/s03g9 \
  --entry "index.astro"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s03g9 --src .integration-src/s03g9 \
  --entry "index.astro" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s03g9` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s03g9` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s03g9` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s03g9 integration"
```

---

## Task 52: Integrate s04g1 — Inside the ALU

**Files:**
- Create: `src/pages/s04g1.mdx`, `src/pages/s04g1/`, `src/components/s04g1/`, `src/assets/s04g1/`, `src/styles/s04g1/`
- Modify: `src/data/exhibits.json` (set `s04g1` to `"status": "live"`)

**Source:** `https://github.com/CSARCH2-GROUP1/CSARCH2-Virtual-Exhibit-Group-1.git` · entry page `S04_Group1.mdx` · sub-pages `S04_Group1/` · 8 components · 0.4 MB

**Specifics for this exhibit:**

- **Modified `ExhibitLayout.astro`** (129 lines differ). Copy the exhibit's version to `src/components/s04g1/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Modified `global.css`** (263 lines differ) → `src/styles/s04g1/base.css`, scoped.
- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Internal navigation:** 4 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s04g1/` after the rewrite.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/CSARCH2-GROUP1/CSARCH2-Virtual-Exhibit-Group-1.git .integration-src/s04g1
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g1 --src .integration-src/s04g1 \
  --entry "S04_Group1.mdx" --subdir S04_Group1
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g1 --src .integration-src/s04g1 \
  --entry "S04_Group1.mdx" --subdir S04_Group1 --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g1` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g1` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g1` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g1 integration"
```

---

## Task 53: Integrate s04g4 — A Deep Dive Into the Bus Arbitration System

**Files:**
- Create: `src/pages/s04g4.mdx`, `src/components/s04g4/`, `src/assets/s04g4/`, `src/styles/s04g4/`
- Modify: `src/data/exhibits.json` (set `s04g4` to `"status": "live"`)

**Source:** `https://github.com/kekekoby/CSARCH2_S04_G4.git` · entry page `index.mdx` · 9 components · 4.2 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.mdx`; it becomes `src/pages/s04g4.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Sibling pages.** After the orchestrator runs, move `arbitration-modes.mdx`, `design-tradeoffs.mdx`, `references.mdx`, `shared-bus-problem.mdx`, `simulator.mdx` into `src/pages/s04g4/` by hand and re-point their `${base}` links to `${base}s04g4/…`.
- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.
- **Internal navigation:** 7 files reference `BASE_URL`. Confirm every in-exhibit link resolves under `/s04g4/` after the rewrite.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/kekekoby/CSARCH2_S04_G4.git .integration-src/s04g4
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g4 --src .integration-src/s04g4 \
  --entry "index.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g4 --src .integration-src/s04g4 \
  --entry "index.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g4` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g4` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g4` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g4 integration"
```

---

## Task 54: Integrate s04g5 — Ca-Ching! - The CPU Cache Visualizer

**Files:**
- Create: `src/pages/s04g5.mdx`, `src/components/s04g5/`, `src/assets/s04g5/`, `src/styles/s04g5/`
- Modify: `src/data/exhibits.json` (set `s04g5` to `"status": "live"`)

**Source:** `https://github.com/gbrlgrg/arch2-virtual-exhibit-group5.git` · entry page `cpu-cache-visualizer.mdx` · 22 components · 7.7 MB

**Specifics for this exhibit:**

- **Not a page.** Delete `cache-research-source.md` — it is research notes sitting in `pages/`, and Astro would route it.
- **Modified `ExhibitLayout.astro`** (1 lines differ). Copy the exhibit's version to `src/components/s04g5/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Own layout(s):** `S04_Group5_CachingVisualizer.astro` → `src/components/s04g5/`.
- **Modified `global.css`** (14 lines differ) → `src/styles/s04g5/base.css`, scoped.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Expect ~2.7 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `@tsparticles/react`, `@base-ui/react`, `react-parallax-tilt`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`, `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/gbrlgrg/arch2-virtual-exhibit-group5.git .integration-src/s04g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g5 --src .integration-src/s04g5 \
  --entry "cpu-cache-visualizer.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s04g5 --src .integration-src/s04g5 \
  --entry "cpu-cache-visualizer.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s04g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s04g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s04g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s04g5 integration"
```

---

## Task 55: Integrate s05g2 — HerStory

**Files:**
- Create: `src/pages/s05g2.mdx`, `src/components/s05g2/`, `src/assets/s05g2/`, `src/styles/s05g2/`
- Modify: `src/data/exhibits.json` (set `s05g2` to `"status": "live"`)

**Source:** `https://github.com/oresamu/CSARCH2_Case-Study.git` · entry page `herstory-woven-in-memory.mdx` · 4 components · 17.3 MB

**Specifics for this exhibit:**

- **Modified `ExhibitLayout.astro`** (6 lines differ). Copy the exhibit's version to `src/components/s05g2/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Modified `global.css`** (154 lines differ) → `src/styles/s05g2/base.css`, scoped.
- **Expect ~8.8 MB of orphans** (proposal documents and stock template images).
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/oresamu/CSARCH2_Case-Study.git .integration-src/s05g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g2 --src .integration-src/s05g2 \
  --entry "herstory-woven-in-memory.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g2 --src .integration-src/s05g2 \
  --entry "herstory-woven-in-memory.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g2 integration"
```

---

## Task 56: Integrate s05g5 — deep-dive-apollo

**Files:**
- Create: `src/pages/s05g5.mdx`, `src/components/s05g5/`, `src/assets/s05g5/`, `src/styles/s05g5/`
- Modify: `src/data/exhibits.json` (set `s05g5` to `"status": "live"`)

**Source:** `https://github.com/sauv1gnon/csarch2-virtual-exhibit.git` · entry page `deep-dive-apollo.mdx` · 9 components · 0.6 MB

**Specifics for this exhibit:**

- **Modified `ExhibitLayout.astro`** (18 lines differ). Copy the exhibit's version to `src/components/s05g5/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Authored on Astro 7**, building under 5. Expect config-level breaks, not page-source breaks.
- **Uses `import.meta.glob`.** The orphan report is unreliable here — verify every candidate by hand before applying, then re-run with `--apply`.
- **Notable libraries:** `animejs`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/sauv1gnon/csarch2-virtual-exhibit.git .integration-src/s05g5
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g5 --src .integration-src/s05g5 \
  --entry "deep-dive-apollo.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s05g5 --src .integration-src/s05g5 \
  --entry "deep-dive-apollo.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s05g5` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s05g5` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s05g5` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s05g5 integration"
```

---

## Task 57: Integrate s40g2 — CLOCKWORK: The Rhythm of the Processor

**Files:**
- Create: `src/pages/s40g2.mdx`, `src/components/s40g2/`, `src/assets/s40g2/`, `src/styles/s40g2/`
- Modify: `src/data/exhibits.json` (set `s40g2` to `"status": "live"`)

**Source:** `https://github.com/chewsdaycat/CSARCH2_GRP2.git` · entry page `CPU-Cycles.mdx` · 4 components · 0.6 MB

**Specifics for this exhibit:**

- **Modified `ExhibitLayout.astro`** (145 lines differ). Copy the exhibit's version to `src/components/s40g2/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Modified `global.css`** (531 lines differ) → `src/styles/s40g2/base.css`, scoped.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Authored on Astro 4**, building under 5. Expect config-level breaks, not page-source breaks.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/chewsdaycat/CSARCH2_GRP2.git .integration-src/s40g2
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g2 --src .integration-src/s40g2 \
  --entry "CPU-Cycles.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g2 --src .integration-src/s40g2 \
  --entry "CPU-Cycles.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g2` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g2` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g2` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g2 integration"
```

---

## Task 58: Integrate s40g4 — [Group 4] FDE Exhibit

**Files:**
- Create: `src/pages/s40g4.mdx`, `src/components/s40g4/`, `src/assets/s40g4/`, `src/styles/s40g4/`
- Modify: `src/data/exhibits.json` (set `s40g4` to `"status": "live"`)

**Source:** `https://github.com/Michael-Maglente/-CSARCH2-Group-2.git` · entry page `heartbeat-cpu.mdx` · 9 components · 8.4 MB

**Specifics for this exhibit:**

- **Modified `ExhibitLayout.astro`** (4 lines differ). Copy the exhibit's version to `src/components/s40g4/Layout.astro` and point its pages there. The shared layout stays untouched.
- **Notable libraries:** `marked`.

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/Michael-Maglente/-CSARCH2-Group-2.git .integration-src/s40g4
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g4 --src .integration-src/s40g4 \
  --entry "heartbeat-cpu.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g4 --src .integration-src/s40g4 \
  --entry "heartbeat-cpu.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g4` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g4` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g4` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g4 integration"
```

---

## Task 59: Integrate s40g7 — GPU Texture Filtering

**Files:**
- Create: `src/pages/s40g7.mdx`, `src/components/s40g7/`, `src/assets/s40g7/`, `src/styles/s40g7/`
- Modify: `src/data/exhibits.json` (set `s40g7` to `"status": "live"`)

**Source:** `https://github.com/cath-felix/CSARCH2-Case-Project.git` · entry page `index.mdx` · 4 components · 2.5 MB

**Specifics for this exhibit:**

- **Index-squatter.** The exhibit lives in `index.mdx`; it becomes `src/pages/s40g7.mdx`. If it is `.astro`, convert the frontmatter to MDX frontmatter and keep the markup as-is.
- **Own layout(s):** `BaseLayout.astro` → `src/components/s40g7/`.
- **Modified `global.css`** (1286 lines differ) → `src/styles/s40g7/base.css`, scoped.
- **Tailwind v4.** Replace its Tailwind entry with `@import "../tailwind-scoped.css";` and namespace any `@theme` tokens.
- **Authored on Astro 6**, building under 5. Expect config-level breaks, not page-source breaks.
- **Expect ~1.0 MB of orphans** (proposal documents and stock template images).

- [ ] **Step 1: Clone the source**

```bash
git clone --depth 1 https://github.com/cath-felix/CSARCH2-Case-Project.git .integration-src/s40g7
```

- [ ] **Step 2: Dry-run the import and read the orphan report**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g7 --src .integration-src/s40g7 \
  --entry "index.mdx"
```

Expected: an orphan list and the planned moves, with nothing written to `src/`. Confirm the orphan list contains no asset the exhibit actually uses.

- [ ] **Step 3: Apply the import**

```bash
node tools/integrate/import-exhibit.mjs --slug s40g7 --src .integration-src/s40g7 \
  --entry "index.mdx" --apply
```

- [ ] **Step 4: Apply this exhibit's specifics**

Work through the "Specifics" list above, then follow steps 4–6 of `docs/integration-runbook.md`: fix the layout reference, scope the styles, and set `s40g7` to `"status": "live"` in `src/data/exhibits.json`.

- [ ] **Step 5: Build, test, and verify**

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green, tests green, verifier reports `s40g7` live with 0 problems.

- [ ] **Step 6: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s40g7` and compare against the exhibit's original deployment. Interactive components must respond, and neither the homepage nor a neighbouring exhibit may have changed appearance.

- [ ] **Step 7: Commit**

```bash
git add src/ public/
git commit -m "feat: s40g7 integration"
```

---
# Phase 4 — Tier D: static embed (1)

## Task 60: Integrate s02g7 — History of the x86-64 NASM Assembly Language

**Files:**
- Create: `public/s02g7/` (the Next.js static export)
- Modify: `src/data/exhibits.json` (set `s02g7` to `"status": "external"`)
- Modify: `src/components/ExhibitCard.astro` (route `external` cards to `public/` output)

**Source:** `https://github.com/JoseBryanPerez/CSARCH2_Group_7.git` · the app lives in `x86-history/`, not at the repo root · Next.js 16, React 19, Blockly, `patch-package` postinstall.

**Why this one is different:** it is the only non-Astro exhibit. It is not source-merged. It is built in its own clone with its own dependency tree — including React 19, which the umbrella forbids — and only its static output is copied in. That keeps its React 19 requirement entirely outside the umbrella's `node_modules`.

- [ ] **Step 1: Clone and install**

```bash
git clone --depth 1 https://github.com/JoseBryanPerez/CSARCH2_Group_7.git .integration-src/s02g7
cd .integration-src/s02g7/x86-history && npm install --no-audit --no-fund
```

Expected: install runs the `patch-package` postinstall step. If it fails, the patches in `patches/` do not apply to the installed versions — pin the versions in that clone's `package.json` to the exact ones the patches target.

- [ ] **Step 2: Configure static export**

Edit `.integration-src/s02g7/x86-history/next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/virtual-exhibit-template/s02g7',
  images: { unoptimized: true },
};

export default nextConfig;
```

`output: 'export'` produces a static `out/` directory. `basePath` makes every internal link and asset resolve under the umbrella's route. `images.unoptimized` is required because `next/image`'s optimizer needs a server, which GitHub Pages does not provide.

- [ ] **Step 3: Build the export**

```bash
cd .integration-src/s02g7/x86-history && npm run build
```

Expected: an `out/` directory containing `index.html`. If the build fails on a server-only feature (route handlers, server actions, `dynamic = 'force-dynamic'`), that feature must be removed or the exhibit falls back to linking out to its existing deployment — record which was chosen.

- [ ] **Step 4: Copy the export into the umbrella**

```bash
rm -rf public/s02g7
cp -r .integration-src/s02g7/x86-history/out public/s02g7
```

- [ ] **Step 5: Make the gallery card link to it**

In `src/components/ExhibitCard.astro`, the card currently always links to `${baseUrl}/${slug}`. That is correct for `s02g7` too — the static export lands at exactly that route because `public/s02g7/index.html` is served there. Verify no change is needed; if `ExhibitCard` gains a branch, keep it to a single conditional on `status === 'external'`.

- [ ] **Step 6: Set status and verify**

Set `s02g7` to `"status": "external"` in `src/data/exhibits.json`, then:

```bash
npm run build && npm test && node tools/verify-site.mjs
```

Expected: build green. Note that `verifySite` only requires routes for `status: 'live'`; extend it to also accept `external` entries whose `public/<slug>/index.html` exists:

```javascript
if (e.status === 'external') {
  if (!existsSync(join(distDir, e.slug, 'index.html'))) {
    errors.push(`external exhibit ${e.slug} has no embedded output`);
  }
  continue;
}
```

Add a test for that branch in `tools/test/verify-site.test.mjs` before making the change.

- [ ] **Step 7: Check it in a browser**

```bash
npm run preview
```

Open `http://localhost:4321/virtual-exhibit-template/s02g7`. The Blockly editor must load and internal navigation must stay inside `/s02g7/`.

- [ ] **Step 8: Commit**

```bash
git add public/s02g7 src/data/exhibits.json tools/verify-site.mjs tools/test/verify-site.test.mjs
git commit -m "feat: s02g7 integration via Next.js static export"
```

---

# Phase 5 — Close out

## Task 61: Final verification and cleanup

**Files:**
- Delete: `src/pages/linux.mdx`, `src/components/DistroQuiz.jsx`, `src/components/ImageGallery.jsx`, `src/components/TextWithImage.astro`, `src/assets/*.png` (the stock distro images)
- Create: `docs/asset-optimization-report.md`
- Modify: `README.md`

- [ ] **Step 1: Write the failing test**

Add to `tools/test/exhibits.test.mjs`:

```javascript
test('all 53 exhibits are integrated', () => {
  const exhibits = loadExhibits();
  const pending = exhibits.filter((e) => e.status === 'pending').map((e) => e.slug);
  assert.deepEqual(pending, [], `still pending: ${pending.join(', ')}`);
});
```

- [ ] **Step 2: Run it to confirm it fails until every exhibit is live**

Run: `npm test`
Expected: FAIL listing any exhibit still `pending`. If it passes, every exhibit is integrated.

- [ ] **Step 3: Remove the template leftovers**

The umbrella's own demo content is no longer needed once real exhibits exist. Confirm nothing imports them first:

```bash
grep -rn "DistroQuiz\|ImageGallery\|linux" src/pages src/components src/layouts --include=*.astro --include=*.mdx --include=*.jsx | grep -v "/s[0-9]"
```

Expected: only `src/pages/index.mdx`'s `[Linux](linux)` link. Remove that link, then delete the files listed above.

- [ ] **Step 4: Measure the final payload**

```bash
du -sh src/assets public dist
node tools/verify-site.mjs
```

Expected: `dist` well under 1 GB, verifier reports 53/53 with 0 problems.

- [ ] **Step 5: Write the asset report**

Create `docs/asset-optimization-report.md` recording, per exhibit, the pre- and post-optimization byte totals from each `import-exhibit.mjs` run, plus every file the optimizer marked `failed` or `no gain`. This is the audit trail for the fidelity risk accepted in the spec.

- [ ] **Step 6: Update the README**

Add a section documenting the slug convention, `src/data/exhibits.json` as the gallery source of truth, and how to add or re-import an exhibit via the runbook.

- [ ] **Step 7: Final build and commit**

```bash
npm run build && npm test && node tools/verify-site.mjs
git add -A
git commit -m "chore: remove template leftovers and record final asset report"
```

---

## Deferred

- **`ARCH MUSEUM RANKINGS.xlsx` has not been supplied.** `src/data/rankings.json` ships empty and the top row falls back to section/group order. When the file arrives, convert its top 15 slugs into that array — a data change requiring no code edit and no rebuild of any exhibit.
