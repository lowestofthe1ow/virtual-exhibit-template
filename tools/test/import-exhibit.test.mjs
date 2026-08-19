import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
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
