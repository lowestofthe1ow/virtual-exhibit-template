import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync,
         rmSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, relative, posix } from 'node:path';
import { findOrphans, TEMPLATE_LEFTOVERS, GLOB_REPOS } from '../assets/prune.mjs';
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
const forceGlobRepo = args.includes('--force-glob-repo');

// findOrphans's basename/stem scan can't see references an import.meta.glob
// call builds at runtime, so its report for these seven repos warrants a
// human look before anything is deleted — the same reasoning that makes
// prune.mjs's own CLI refuse under this condition. That refusal lives only
// in prune.mjs's CLI block, not in the exported findOrphans function this
// orchestrator calls as a library, so the guard has to be repeated here.
// Matched on the --slug argument (not the resolved path) because the slug
// is already passed explicitly on this CLI.
const refuseGlobRepo = apply && GLOB_REPOS.includes(slug) && !forceGlobRepo;

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
if (apply && !refuseGlobRepo) for (const o of orphans) rmSync(o.path, { force: true });

// 4. Optimize what remains, in src/assets and in public/.
let publicOrphans = [];
if (hasPublic) {
  publicOrphans = findOrphans(stagePublic, { haystackDir: stage });
  console.log(`public orphans: ${publicOrphans.length} files`);
  for (const o of publicOrphans) console.log(`  ${o.reason.padEnd(12)} ${o.path}`);
  if (apply && !refuseGlobRepo) for (const o of publicOrphans) rmSync(o.path, { force: true });
}

// Refuse before any deletion, optimization, or copy has run (all of the
// above was read-only reporting plus staging into the disposable
// .integration-src/ copy) so a re-run after manual review starts clean
// instead of resuming a half-applied import.
if (refuseGlobRepo) {
  console.log(
    `\nrefusing to delete or copy: '${slug}' uses import.meta.glob, so references built at ` +
    'runtime are invisible to the orphan report above and it cannot be trusted automatically. ' +
    'Review the list by hand, then re-run with --force-glob-repo to proceed.',
  );
  process.exitCode = 2;
  process.exit(2);
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

// Every top-level src/ directory except pages/ and layouts/ gets namespaced
// the same way components/, assets/ and styles/ always have. Repos are free
// to keep code or assets anywhere else under src/ — a fonts/ directory, a
// zustand store/, or (for at least one repo) the exhibit's entire component
// tree under its own directory name — and skipping those directories would
// silently drop them from the site while the build stayed green. Computed
// from the staged tree (post-prune) rather than hardcoded, so nothing new
// needs to be taught to this script by name.
const NAMESPACED_KINDS = readdirSync(stage, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== 'pages' && e.name !== 'layouts')
  .map((e) => e.name)
  .sort();

// Files sitting directly at the root of src/ (e.g. content.config.ts) are not
// namespaced into a per-exhibit directory: unlike components/assets/styles/
// etc. they are not referenced by relative import from the exhibit's own
// code, they define project-wide Astro configuration (e.g. content
// collections) that Astro only reads from src/'s root, and more than one
// repo ships one. Blindly copying or merging one over the umbrella site's
// own src/content.config.ts (or over another already-integrated exhibit's)
// risks silently breaking every exhibit, not just this one — the opposite of
// "fail loudly". They are left in place in the stage for a human to
// reconcile by hand; flagged here so that review can't be skipped silently.
const rootFiles = readdirSync(stage, { withFileTypes: true })
  .filter((e) => e.isFile())
  .map((e) => e.name)
  .sort();
if (rootFiles.length) {
  console.log(
    `\nWARNING: ${rootFiles.length} loose file(s) at the root of src/ were NOT imported: ` +
    `${rootFiles.join(', ')}`,
  );
  console.log(
    '  These likely define project-wide Astro config (e.g. content collections) and must be ' +
    `reconciled by hand against the umbrella src/. They remain at ${stage}/ for review.`,
  );
}

for (const kind of NAMESPACED_KINDS) {
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
for (const kind of NAMESPACED_KINDS) {
  console.log(`${kind.padEnd(10)}: -> src/${kind}/${slug}/`);
}
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

for (const kind of NAMESPACED_KINDS) {
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
