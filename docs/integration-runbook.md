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
