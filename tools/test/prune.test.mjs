import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findOrphans, TEMPLATE_LEFTOVERS } from '../assets/prune.mjs';

const PRUNE_CLI = fileURLToPath(new URL('../assets/prune.mjs', import.meta.url));

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

function globFixture(slug) {
  const parent = mkdtempSync(join(tmpdir(), 'prune-glob-'));
  const dir = join(parent, slug);
  mkdirSync(join(dir, 'src', 'assets'), { recursive: true });
  writeFileSync(join(dir, 'src', 'assets', 'orphan.png'), 'x'.repeat(100));
  return dir;
}

test('a dry run leaves every file on disk', () => {
  const dir = fixture();
  execFileSync(process.execPath, [PRUNE_CLI, '--dir', dir], { encoding: 'utf8' });
  assert.ok(existsSync(join(dir, 'src', 'assets', 'used.png')));
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')));
  assert.ok(existsSync(join(dir, 'src', 'assets', 'proposal.pdf')));
});

test('--apply deletes exactly the reported set and nothing else', () => {
  const dir = fixture();
  execFileSync(process.execPath, [PRUNE_CLI, '--dir', dir, '--apply'], { encoding: 'utf8' });
  assert.ok(existsSync(join(dir, 'src', 'assets', 'used.png')), 'referenced file must survive');
  assert.ok(existsSync(join(dir, 'src', 'pages', 'exhibit.mdx')), 'code file must survive');
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'unreferenced image must be deleted');
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'proposal.pdf')), 'document must be deleted');
});

test('a path naming a glob-repo slug refuses to delete under --apply', () => {
  const dir = globFixture('s03g8');
  const output = execFileSync(process.execPath, [PRUNE_CLI, '--dir', dir, '--apply'], { encoding: 'utf8' });
  assert.ok(existsSync(join(dir, 'src', 'assets', 'orphan.png')), 'glob-repo files must survive without --force-glob-repo');
  assert.match(output, /refusing to delete/);
  assert.match(output, /s03g8/);
  assert.match(output, /--force-glob-repo/);
});

test('--force-glob-repo overrides the refusal and deletes', () => {
  const dir = globFixture('s03g8');
  execFileSync(process.execPath, [PRUNE_CLI, '--dir', dir, '--apply', '--force-glob-repo'], { encoding: 'utf8' });
  assert.ok(!existsSync(join(dir, 'src', 'assets', 'orphan.png')), '--force-glob-repo must allow deletion');
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
    const output = execFileSync(process.execPath, [PRUNE_CLI, '--dir', dir, '--apply'], { encoding: 'utf8' });
    assert.ok(!existsSync(join(dir, 'src', 'assets', 'ok.png')), 'the deletable orphan must still be removed');
    assert.ok(existsSync(join(dir, 'src', 'locked', 'stuck.png')), 'the undeletable orphan must remain');
    assert.match(output, /1 deleted, 1 failed/);
  } finally {
    chmodSync(join(dir, 'src', 'locked'), 0o755);
  }
});
