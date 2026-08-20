# CSARCH2 Virtual Exhibit Guide
[![Node.js](https://img.shields.io/badge/Node.js%2026-6DA55F?logo=node.js&logoColor=white)](#) [![Astro](https://img.shields.io/badge/Astro%206-BC52EE?logo=astro&logoColor=fff)](#) [![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=fff)](#) [![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)


## Table of Contents

- [Setup Guide](#setup-guide)
  - [1. Template Overview](#1-template-overview)
  - [2. Getting Started](#2-getting-started)
  - [3. Project Structure](#3-project-structure)
  - [4. Adding Your Exhibit Page](#4-adding-your-exhibit-page)
  - [5. Adding Components](#5-adding-components)
- [Astro and MDX Guide](#astro-and-mdx-guide)
  - [6. What is Astro and MDX?](#6-what-is-astro-and-mdx)
  - [7. Writing an MDX File](#7-writing-an-mdx-file)
  - [8. Rendering Your MDX File](#8-rendering-your-mdx-file)
- [Merged Site Guide](#merged-site-guide)
  - [9. The Slug Convention](#9-the-slug-convention)
  - [10. The Gallery's Source of Truth](#10-the-gallerys-source-of-truth)
  - [11. Protected Shared Files](#11-protected-shared-files)
  - [12. Adding or Re-Importing an Exhibit](#12-adding-or-re-importing-an-exhibit)
  - [13. The s02g7 Exception](#13-the-s02g7-exception)

---

# Setup Guide

## 1. Template Overview

This document is a guide on how to set up the template and use MDX with Astro.

---

## 2. Getting Started
1. Fork the repository. In the top-right corner of the page, click the Fork button. Adjust your settings then create fork.

2. Clone your forked repository:
```
git clone https://github.com/jrgo7/your-forked-repository
```

3. Install the dependencies:
```
npm install
```

4. Run the dev server:
```
npm run dev
```

---

## 3. Project Structure

```
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
└── src/
    ├── components/
    │   ├── ReactComponent.jsx
    │   └── AstroComponent.astro
    ├── layouts/
    │   └── ExhibitLayout.astro
    └── pages/
        └── topic_name.mdx
```

| Path | Description |
|---|---|
| `src/pages/` | Place your `.mdx` files here. Astro creates automatic routing from filenames. |
| `src/components/` | Your custom React/Astro components. |
| `src/layouts/ExhibitLayout.astro` | Shared layout to be used. Don't restructure it. |
| `astro.config.mjs` | Already configured. Only modify if adding new integrations. |

---

## 4. Adding Your Exhibit Page

1. Create a `.mdx` file inside `src/pages/` named after your topic (e.g. `heartbleed-bug.mdx`).
2. Add [frontmatter](#frontmatter) at the top of the file.
3. Write your content in Markdown and import components as needed.

### Frontmatter

Add this at the very top of your `.mdx` file before any content:

```yaml
---
layout: ../layouts/ExhibitLayout.astro
title: "Your Title Here"
description: "A short description of your topic."
author: "Surname, Firstname; Surname2, Firstname2"
readingTime: "67 minutes"
---
```

The frontmatter block is not rendered as content. Astro reads it to know which layout to use and what to put in the page's metadata.



---

## 5. Adding Components

Astro components (`.astro`) are ideal for static content like section wrappers, info cards, and image galleries.

Create `src/components/InfoCard.astro`:
```astro
---
const { title, body } = Astro.props;
---

<div class="info-card">
  <h3>{title}</h3>
  <p>{body}</p>
</div>

<style>
  .info-card {
    border: 1px solid var(--border-color);
    padding: 1rem;
    border-radius: 8px;
  }
</style>
```

Then use it in your `.mdx`:
```mdx
import InfoCard from '../components/InfoCard.astro';

<InfoCard title="What is a buffer over-read?" body="It occurs when a program reads more data than was intended from a buffer." />
```

### 5.1 React Components

React components (`.jsx` or `.tsx`) are used for interactive elements like quizzes, simulations, and timelines. They run in the browser.

1. Create your component in `src/components/` with a default export:
```jsx
// src/components/MyComponent.jsx
export default function MyComponent() {
  return <div>Hello from React!</div>;
}
```

2. Import and use it in your `.mdx`:
```mdx
import MyComponent from '../components/MyComponent.jsx';

<MyComponent client:load />
```

> **Note on `client:` directives:** By default, Astro renders React components as static HTML. Add a `client:` directive to make them interactive in the browser.
>
> | Directive | When it hydrates |
> |---|---|
> | `client:load` | Immediately on page load |
> | `client:visible` | When the component scrolls into view |
> | `client:idle` | When the browser is idle |

---

# Astro and MDX Guide

## 6. What is Astro and MDX?

### Astro
- Astro is a modern web framework designed for building fast, content-focused websites.
- Astro defaults to zero client-side JavaScript, making pages render faster.
- Astro also supports multiple frameworks at once.
- For more information: https://docs.astro.build/en/getting-started/

### MDX
- MDX is a Markdown + JSX tool that lets you add interactive elements to your Markdown pages.
- You can import components, create charts and diagrams, and build interactive elements using Markdown.
- For more information: https://mdxjs.com/docs/

---

## 7. Writing an MDX File

Place your `.mdx` files inside `src/pages/`. Astro will handle routing automatically.

```
└── src/
    └── pages/
        └── topic_name.mdx  <--- your exhibit page
```

---

## 8. Rendering Your MDX File

Astro handles routing automatically once your `.mdx` file is in `src/pages/`.

1. Run the server:
```
npm run dev
```

2. Visit your page at `localhost:4321/virtual-exhibit-template/topic_name`.

---

# Merged Site Guide

Everything above describes the original single-exhibit contributor template.
This umbrella repository has since merged all 53 CSARCH2 section/group
exhibits into one Astro site, each on its own route, listed together on the
homepage gallery. This section documents that merged structure for whoever
maintains it next.

## 9. The Slug Convention

Every exhibit has a **slug** of the form `s<section>g<group>` — e.g. `s01g4`
is Section 01, Group 4; `s40g6` is Section 40, Group 6. The slug is the
single namespace an exhibit owns everywhere in the tree. A given exhibit may
own, depending on what it needs:

| Path | Purpose |
|---|---|
| `src/pages/<slug>.mdx` (or `.astro`) | The exhibit's entry page — its route is `/<slug>/`. |
| `src/pages/<slug>/` | The exhibit's sub-pages, if it has more than one (e.g. `src/pages/s01g8/03-before-gpus.mdx`). |
| `src/components/<slug>/` | The exhibit's own Astro/React/TSX components, including a custom `Layout.astro` if it needs one instead of the shared layout. |
| `src/assets/<slug>/` | The exhibit's build-time-imported images, models, and other media referenced from its components/pages. |
| `src/styles/<slug>/` | The exhibit's own stylesheets, imported only from its own pages/components. |
| `public/<slug>/` | The exhibit's runtime-fetched static assets (large media referenced by absolute URL rather than imported). |

Nothing outside an exhibit's own `<slug>/` namespace should ever reference
that exhibit's files, and an exhibit should never reach into another
exhibit's namespace or into the umbrella's own top-level files. This is what
lets 53 independently-authored codebases coexist in one `src/` tree without
naming collisions.

## 10. The Gallery's Source of Truth

`src/data/exhibits.json` is the single source of truth for the homepage
gallery. Each entry carries a `status` field:

- `"live"` — a source-merged Astro exhibit under its own `<slug>` namespace, built and routed by this site.
- `"external"` — not source-merged; served some other way (see [13](#13-the-s02g7-exception) for the one exhibit currently in this state).
- `"pending"` — not yet integrated. As of the last full merge, no exhibit carries this status; `tools/test/exhibits.test.mjs` asserts this stays true.

`src/data/rankings.json` is a flat array of up to 15 slugs, in order, that
drives the "Top exhibits" row at the top of the homepage. Editing it is a
pure data change — no code edit and no rebuild of any individual exhibit is
required, it just changes which cards render first.

## 11. Protected Shared Files

**Do not modify these — they are shared by every exhibit:**

- `src/layouts/ExhibitLayout.astro`
- `src/styles/global.css`
- `astro.config.mjs`
- `package.json`
- `src/styles/tailwind-scoped.css`

If an exhibit needs a layout that differs from `ExhibitLayout.astro` (extra
nav, different chrome, etc.), copy what it needs into its own
`src/components/<slug>/Layout.astro` and point that exhibit's page
frontmatter at the copy. The shared layout and global stylesheet stay
untouched for everyone else.

## 12. Adding or Re-Importing an Exhibit

Exhibits are brought in with the orchestrator at
`tools/integrate/import-exhibit.mjs`, driven by
[`docs/integration-runbook.md`](docs/integration-runbook.md). In short: clone
the source repo into the gitignored `.integration-src/`, dry-run the
orchestrator to see its orphan report and proposed changes, apply it once the
orphan list looks right, then fix the layout reference, place the styles, and
flip the exhibit's `status` to `"live"` in `exhibits.json`. The orchestrator
handles namespacing (renaming files/imports under `<slug>/`), reference
rewriting (base paths, routes, asset extensions after optimization), asset
pruning (deleting genuinely-unreferenced media), and asset optimization
(re-encoding images/video/models to shrink the payload) — see
`docs/asset-optimization-report.md` for what that pass actually did across
the corpus, including its known false-negative mode on orphan detection.
Read the runbook before re-running it; several corpus-specific gotchas
(`import.meta.glob` repos, hardcoded base paths, sub-page route flattening)
are documented there, not repeated here.

## 13. The s02g7 Exception

`s02g7` is the one exhibit that is **not** a source-merged Astro page. It was
authored in Next.js, and rather than port it to Astro/MDX, it was built with
`output: 'export'` and `basePath` set to resolve under this site's route,
then its static `out/` directory was committed wholesale as
`public/s02g7/`. It is served as a statically-embedded site-within-a-site
rather than participating in the Astro build, which is why `exhibits.json`
lists its `status` as `"external"` rather than `"live"`. This was the only
exhibit in the entire 53-exhibit corpus that needed this fallback — every
other exhibit, however unusual its own stack (Tailwind, `import.meta.glob`,
dynamic routes, content collections), was merged as real Astro source.
