import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findOrphans, TEMPLATE_LEFTOVERS, GLOB_REPOS } from '../assets/prune.mjs';

const PRUNE_CLI = fileURLToPath(new URL('../assets/prune.mjs', import.meta.url));

// spawnSync (rather than execFileSync) is used for every CLI invocation below because
// the CLI now sets non-zero exit codes for a refused delete (2) and a partial delete
// failure (1) — execFileSync throws on non-zero exit, which would make those outcomes
// impossible to assert on directly. spawnSync never throws and exposes `.status` and
// `.stdout` on the same result object.
function runCli(args) {
  return spawnSync(process.execPath, [PRUNE_CLI, ...args], { encoding: 'utf8' });
}

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
  writeFileSync(join(dir, 'public', 'orphan.svg'), 'x'.repeat(50));
  writeFileSync(join(dir, 'src', 'pages', 'p.mdx'), '<img src="/used.svg">');

  const orphans = findOrphans(join(dir, 'public'), { haystackDir: join(dir, 'src') })
    .map((o) => o.path);
  assert.ok(orphans.some((p) => p.endsWith('orphan.svg')));
  assert.ok(!orphans.some((p) => p.endsWith('used.svg')), 'referenced public asset must survive');
});

test('the template leftover list covers the stock distro images', () => {
  assert.ok(TEMPLATE_LEFTOVERS.includes('Tux.png'));
  assert.ok(TEMPLATE_LEFTOVERS.includes('DistroQuiz.jsx'));
});

// --- CLI delete-path tests. These invoke the module as a child process, since
// its `import.meta.url === process.argv[1]` guard only fires the CLI body when
// run directly — importing the module in-process (as the tests above do) never
// touches disk.

function globFixture(...segments) {
  const parent = mkdtempSync(join(tmpdir(), 'prune-glob-'));
  const dir = join(parent, ...segments);
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  writeFileSync(join(dir, 'src', 'assets', 'orphan.png'), 'x'.repeat(100));
  return dir;
}

test('a dry run leaves every file on disk', () => {
  const dir = fixture();
  runCli(['--dir', dir]);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'used.png')));
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')));
  assert.ok(existsSync(join(dir, 'src', 'assets', 'proposal.pdf')));
});

test('--apply deletes exactly the reported set and nothing else', () => {
  const dir = fixture();
  runCli(['--dir', dir, '--apply']);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'used.png')), 'referenced file must survive');
  assert.ok(existsSync(join(dir, 'src', 'pages', 'exhibit.mdx')), 'code file must survive');
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'unreferenced image must be deleted');
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'proposal.pdf')), 'document must be deleted');
});

test('a path naming a glob-repo slug as a whole segment refuses to delete under --apply', () => {
  const dir = globFixture('s03g8');
  const result = runCli(['--dir', dir, '--apply']);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'glob-repo files must survive without --force-glob-repo');
  assert.match(result.stdout, /refusing to delete/);
  assert.match(result.stdout, /s03g8/);
  assert.match(result.stdout, /--force-glob-repo/);
});

test('the production staging shape "<slug>-stage" refuses to delete under --apply', () => {
  // This is the exact shape Task 9's orchestrator uses: join('.integration-src', `${slug}-stage`).
  // A whole-path-segment check never fires here since the segment is "s03g8-stage", not "s03g8".
  const dir = globFixture('s03g8-stage');
  const result = runCli(['--dir', dir, '--apply']);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'glob-repo files must survive without --force-glob-repo');
  assert.match(result.stdout, /refusing to delete/);
  assert.match(result.stdout, /s03g8/);
  assert.match(result.stdout, /--force-glob-repo/);
});

test('the production staging shape ".integration-src/<slug>-stage" refuses to delete under --apply', () => {
  const dir = globFixture('.integration-src', 's03g8-stage');
  const result = runCli(['--dir', dir, '--apply']);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'glob-repo files must survive without --force-glob-repo');
  assert.match(result.stdout, /refusing to delete/);
  assert.match(result.stdout, /s03g8/);
});

test('--force-glob-repo overrides the refusal for the "<slug>-stage" shape and deletes', () => {
  const dir = globFixture('s03g8-stage');
  runCli(['--dir', dir, '--apply', '--force-glob-repo']);
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), '--force-glob-repo must allow deletion');
});

test('a path naming no glob-repo slug still deletes normally under --apply', () => {
  const dir = globFixture('ordinary-exhibit-stage');
  const result = runCli(['--dir', dir, '--apply']);
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'unrelated exhibits must still be pruned');
  assert.doesNotMatch(result.stdout, /refusing to delete/);
});

test('the guard fires for all seven glob-repo slugs at the production "<slug>-stage" shape', () => {
  assert.deepEqual(
    GLOB_REPOS,
    ['s03g2', 's03g5', 's03g7', 's03g8', 's04g1', 's05g5', 's40g5'],
    'this test enumerates GLOB_REPOS directly, so it stays in sync if the list changes',
  );
  for (const slug of GLOB_REPOS) {
    const dir = globFixture(`${slug}-stage`);
    const result = runCli(['--dir', dir, '--apply']);
    assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), `${slug} files must survive without --force-glob-repo`);
    assert.match(result.stdout, /refusing to delete/, `${slug} must trigger the refusal`);
  }
});

test('a delete failure on one file does not prevent the others from being attempted', () => {
  const dir = mkdtempSync(join(tmpdir(), 'prune-fail-'));
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  mkdirSync(join(dir, 'src', 'locked'), { recursive: true });
  writeFileSync(join(dir, 'src', 'assets', 'ok.png'), 'x'.repeat(100));
  writeFileSync(join(dir, 'src', 'locked', 'stuck.png'), 'x'.repeat(100));
  // Removing write permission on the containing directory makes unlink() of the
  // file inside it fail with EACCES, regardless of the file's own permissions.
  chmodSync(join(dir, 'src', 'locked'), 0o555);

  try {
    const result = runCli(['--dir', dir, '--apply']);
    assert.ok(!existsSync(join(dir, 'src', 'assets', 'ok.png')), 'the deletable orphan must still be removed');
    assert.ok(existsSync(join(dir, 'src', 'locked', 'stuck.png')), 'the undeletable orphan must remain');
    assert.match(result.stdout, /1 deleted, 1 failed/);
  } finally {
    chmodSync(join(dir, 'src', 'locked'), 0o755);
  }
});

// --- CLI exit codes. A caller (Task 9's orchestrator) shelling out to this script
// must be able to distinguish "refused" (2), "partial failure" (1), and "succeeded
// or nothing to do" (0) by exit status alone, without parsing stdout.

test('a refused --apply on a glob-repo path exits 2 and leaves files intact', () => {
  const dir = globFixture('s03g8-stage');
  const result = runCli(['--dir', dir, '--apply']);
  assert.equal(result.status, 2);
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'refused delete must leave files in place');
});

test('a successful --apply on a non-glob path exits 0', () => {
  const dir = fixture();
  const result = runCli(['--dir', dir, '--apply']);
  assert.equal(result.status, 0);
});

test('a dry run exits 0', () => {
  const dir = fixture();
  const result = runCli(['--dir', dir]);
  assert.equal(result.status, 0);
});

test('--force-glob-repo on a glob-repo path exits 0 and deletes', () => {
  const dir = globFixture('s03g8-stage');
  const result = runCli(['--dir', dir, '--apply', '--force-glob-repo']);
  assert.equal(result.status, 0);
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), '--force-glob-repo must allow deletion');
});

test('a run where one delete fails exits 1', () => {
  const dir = mkdtempSync(join(tmpdir(), 'prune-fail-exit-'));
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  mkdirSync(join(dir, 'src', 'locked'), { recursive: true });
  writeFileSync(join(dir, 'src', 'assets', 'ok.png'), 'x'.repeat(100));
  writeFileSync(join(dir, 'src', 'locked', 'stuck.png'), 'x'.repeat(100));
  chmodSync(join(dir, 'src', 'locked'), 0o555);

  try {
    const result = runCli(['--dir', dir, '--apply']);
    assert.equal(result.status, 1);
  } finally {
    chmodSync(join(dir, 'src', 'locked'), 0o755);
  }
});
