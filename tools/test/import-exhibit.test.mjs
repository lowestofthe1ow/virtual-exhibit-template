import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../integrate/import-exhibit.mjs', import.meta.url));

// A minimal exhibit "clone": one entry page and one genuinely-unreferenced
// image, so findOrphans always reports exactly one orphan regardless of slug.
function fixtureRepo() {
  const dir = mkdtempSync(join(tmpdir(), 'import-exhibit-src-'));
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  writeFileSync(join(dir, 'src', 'pages', 'entry.mdx'), '# Entry\n');
  writeFileSync(join(dir, 'src', 'assets', 'orphan.png'), 'x'.repeat(64));
  return dir;
}

// The orchestrator writes into '.integration-src', 'src', and 'public'
// relative to process.cwd(), so each test gets its own scratch cwd — never
// the real repo — via spawnSync's `cwd` option.
function runCli(args, cwd) {
  return spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
}

test('a glob slug with --apply and no override refuses, exits 2, and leaves the staged orphan on disk', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  const result = runCli(
    ['--slug', 's03g8', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 2);
  assert.match(result.stdout, /refusing to delete or copy/);
  assert.match(result.stdout, /--force-glob-repo/);

  const orphanPath = join(cwd, '.integration-src', 's03g8-stage', 'assets', 'orphan.png');
  assert.ok(existsSync(orphanPath), 'the staged orphan must survive the refusal');
  assert.ok(
    !existsSync(join(cwd, 'src', 'pages', 's03g8.mdx')),
    'no copy into src/ should have happened before the refusal',
  );
});

test('the same glob slug with --force-glob-repo proceeds', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  const result = runCli(
    ['--slug', 's03g8', '--src', repo, '--entry', 'entry.mdx', '--apply', '--force-glob-repo'],
    cwd,
  );
  assert.equal(result.status, 0);

  const orphanPath = join(cwd, '.integration-src', 's03g8-stage', 'assets', 'orphan.png');
  assert.ok(!existsSync(orphanPath), 'the orphan should have been deleted once forced');
  assert.ok(existsSync(join(cwd, 'src', 'pages', 's03g8.mdx')), 'the entry page should have been copied');
});

test('a non-glob slug with --apply proceeds normally', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);

  const orphanPath = join(cwd, '.integration-src', 's01g1-stage', 'assets', 'orphan.png');
  assert.ok(!existsSync(orphanPath), 'a non-glob slug should delete its orphan as before');
  assert.ok(existsSync(join(cwd, 'src', 'pages', 's01g1.mdx')), 'the entry page should have been copied');
});

test('a dry run on a glob slug exits 0 and still prints its orphan report', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  const result = runCli(
    ['--slug', 's03g8', '--src', repo, '--entry', 'entry.mdx'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /orphans: 1 files/);
  assert.ok(!existsSync(join(cwd, 'src')), 'a dry run must never write into src/');
});

// A fixture whose src/ keeps a directory outside the three the orchestrator
// used to hardcode (components/assets/styles), mirroring real repos that use
// src/fonts/, a repo-named component tree, a store/, etc. A stylesheet
// references a file in that directory the same way real CSS does (a quoted
// relative url()), so a rewritten reference proves the extra directory made
// it into the path map, not just onto disk.
function fixtureRepoWithExtraDir() {
  const dir = mkdtempSync(join(tmpdir(), 'import-exhibit-src-'));
  mkdirSync(join(dir, 'src', 'pages'), { recursive: true });
  // optimizeTree (not under test here, and out of scope to change) assumes
  // src/assets/ exists; every fixture needs it present, even empty.
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  mkdirSync(join(dir, 'src', 'fonts'), { recursive: true });
  mkdirSync(join(dir, 'src', 'styles'), { recursive: true });
  writeFileSync(join(dir, 'src', 'pages', 'entry.mdx'), '# Entry\n');
  writeFileSync(join(dir, 'src', 'fonts', 'Test.ttf'), 'FONTDATA');
  writeFileSync(
    join(dir, 'src', 'styles', 'site.css'),
    "@font-face { font-family: 'Test'; src: url('../fonts/Test.ttf'); }\n",
  );
  return dir;
}

test('a directory other than components/assets/styles/pages/layouts is namespaced', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepoWithExtraDir();
  const result = runCli(
    ['--slug', 's99g9', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /fonts\s*: -> src\/fonts\/s99g9\//);
  assert.ok(
    existsSync(join(cwd, 'src', 'fonts', 's99g9', 'Test.ttf')),
    'the extra directory should have been namespaced and copied, not skipped',
  );
});

test('a stylesheet reference into that directory is rewritten to the namespaced path', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepoWithExtraDir();
  const result = runCli(
    ['--slug', 's99g9', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  const css = readFileSync(join(cwd, 'src', 'styles', 's99g9', 'site.css'), 'utf8');
  assert.match(css, /url\('\.\.\/\.\.\/fonts\/s99g9\/Test\.ttf'\)/);
});

test('a source repo\'s own astro.config base is read, normalized, and used to rewrite hardcoded references', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  writeFileSync(
    join(repo, 'astro.config.mjs'),
    "import { defineConfig } from 'astro/config';\n" +
    "export default defineConfig({ base: '/CSARCH2-G9-Exhibit/' });\n",
  );
  writeFileSync(
    join(repo, 'src', 'pages', 'entry.mdx'),
    '# Entry\n\n<img src="/CSARCH2-G9-Exhibit/astronauts.png" />\n',
  );
  const result = runCli(
    ['--slug', 's03g9', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /source base: CSARCH2-G9-Exhibit/);
  const page = readFileSync(join(cwd, 'src', 'pages', 's03g9.mdx'), 'utf8');
  assert.match(page, /src="\/virtual-exhibit-template\/s03g9\/astronauts\.png"/);
});

test('a source repo with no base (or the default "/") in its astro.config gets no rewriting and no crash', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  writeFileSync(
    join(repo, 'astro.config.mjs'),
    "import { defineConfig } from 'astro/config';\nexport default defineConfig({});\n",
  );
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /source base: \(none/);
});

test('a loose file at the root of src/ is left in the stage and flagged, not silently dropped', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  const repo = fixtureRepo();
  writeFileSync(join(repo, 'src', 'content.config.ts'), 'export const collections = {};\n');
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /WARNING.*content\.config\.ts/s);
  assert.ok(
    existsSync(join(cwd, '.integration-src', 's01g1-stage', 'content.config.ts')),
    'the loose file should remain in the stage for manual review',
  );
  assert.ok(
    !existsSync(join(cwd, 'src', 'content.config.ts')),
    'the loose file must not be copied verbatim into the shared src/ root',
  );
});

// A staged styles/global.css is byte-identical to this repo's own
// src/styles/global.css unless the exhibit genuinely modified it. Since it is
// not a media file, prune.mjs never flags it as an orphan, so the orchestrator
// must decide for itself whether to drop it. `cwd/src/styles/global.css`
// stands in for "the umbrella's own copy" the same way the real CLI compares
// against the umbrella repo it runs from.
function withUmbrellaGlobalCss(cwd, content) {
  mkdirSync(join(cwd, 'src', 'styles'), { recursive: true });
  writeFileSync(join(cwd, 'src', 'styles', 'global.css'), content);
}

function fixtureRepoWithGlobalCss(content) {
  const dir = fixtureRepo();
  mkdirSync(join(dir, 'src', 'styles'), { recursive: true });
  writeFileSync(join(dir, 'src', 'styles', 'global.css'), content);
  return dir;
}

const REFERENCE_GLOBAL_CSS = '/* global.css */\nbody { margin: 0; }\n';

test('a staged global.css byte-identical to the umbrella copy is dropped', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  withUmbrellaGlobalCss(cwd, REFERENCE_GLOBAL_CSS);
  const repo = fixtureRepoWithGlobalCss(REFERENCE_GLOBAL_CSS);
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /styles\/global\.css: identical to the umbrella copy, dropped/);
  assert.ok(
    !existsSync(join(cwd, 'src', 'styles', 's01g1', 'global.css')),
    'a byte-identical global.css must not be copied into the exhibit namespace',
  );
});

test('a staged global.css that differs from the umbrella copy is kept', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  withUmbrellaGlobalCss(cwd, REFERENCE_GLOBAL_CSS);
  const repo = fixtureRepoWithGlobalCss('/* global.css */\nbody { margin: 0; padding: 4px; }\n');
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /styles\/global\.css: differs from the umbrella copy, kept/);
  assert.ok(
    existsSync(join(cwd, 'src', 'styles', 's01g1', 'global.css')),
    'a genuinely customized global.css must survive for the runbook\'s style-scoping step',
  );
});

test('a staged global.css that differs from the umbrella copy only by CRLF line endings is treated as identical and dropped', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'import-exhibit-cwd-'));
  withUmbrellaGlobalCss(cwd, REFERENCE_GLOBAL_CSS);
  const repo = fixtureRepoWithGlobalCss(REFERENCE_GLOBAL_CSS.replace(/\n/g, '\r\n'));
  const result = runCli(
    ['--slug', 's01g1', '--src', repo, '--entry', 'entry.mdx', '--apply'],
    cwd,
  );
  assert.equal(result.status, 0);
  assert.match(result.stdout, /styles\/global\.css: identical to the umbrella copy, dropped/);
  assert.ok(
    !existsSync(join(cwd, 'src', 'styles', 's01g1', 'global.css')),
    'a CRLF-only difference must still be treated as identical',
  );
});
