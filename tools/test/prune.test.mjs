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
