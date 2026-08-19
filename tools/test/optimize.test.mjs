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

// --- Fix round 1 additions: output validation, promotion ordering, report format ---

import { existsSync, statSync } from 'node:fs';
import { validateOutput, promote, formatReport } from '../assets/optimize.mjs';

test('validateOutput rejects a zero-byte output for every kind', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-validate-'));
  for (const kind of ['image', 'gif', 'hdr', 'video', 'model', 'svg']) {
    const path = join(dir, `empty-${kind}`);
    writeFileSync(path, '');
    const result = validateOutput(kind, path);
    assert.equal(result.valid, false, `${kind} should be rejected`);
    assert.equal(typeof result.reason, 'string');
  }
});

test('validateOutput accepts a model output with GLB magic and rejects one without it', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-validate-model-'));
  const good = join(dir, 'good.glb');
  const bad = join(dir, 'bad.glb');
  writeFileSync(good, Buffer.concat([Buffer.from('glTF'), Buffer.alloc(20)]));
  writeFileSync(bad, 'not-a-real-glb-and-not-json-either');
  assert.equal(validateOutput('model', good).valid, true);
  assert.equal(validateOutput('model', bad).valid, false);
});

test('validateOutput accepts an svg output containing a root element and rejects one without', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-validate-svg-'));
  const good = join(dir, 'good.svg');
  const bad = join(dir, 'bad.svg');
  writeFileSync(good, '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  writeFileSync(bad, 'this is not svg markup');
  assert.equal(validateOutput('svg', good).valid, true);
  assert.equal(validateOutput('svg', bad).valid, false);
});

test('promote records a rejected output as failed, not a success, and leaves the original untouched', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-promote-'));
  const from = join(dir, 'model.glb');
  const to = join(dir, 'model.glb');
  const tmp = join(dir, 'model.glb.tmp.glb');
  writeFileSync(from, 'original-bytes-that-must-survive');
  writeFileSync(tmp, 'not-a-real-glb'); // no glTF magic, not JSON -> invalid output

  const conversion = { from, to, kind: 'model' };
  const result = promote(conversion, { tmp, beforeBytes: statSync(from).size });

  assert.equal(typeof result.failed, 'string');
  assert.equal(result.skipped, undefined);
  assert.equal(existsSync(from), true, 'the original must survive a rejected output');
  assert.equal(existsSync(tmp), false, 'the invalid temp file must be cleaned up');
});

test('promote renames the temp file into place before unlinking the original; a rename failure leaves the source intact', () => {
  const dir = mkdtempSync(join(tmpdir(), 'optimize-promote-order-'));
  const from = join(dir, 'model.glb');
  const to = join(dir, 'scene.glb');
  const tmp = join(dir, 'scene.glb.tmp.glb');
  writeFileSync(from, 'x'.repeat(1000));
  writeFileSync(tmp, Buffer.concat([Buffer.from('glTF'), Buffer.alloc(10)])); // valid, smaller than beforeBytes

  const conversion = { from, to, kind: 'model' };
  const failingRename = () => { throw new Error('ENOSPC: no space left on device'); };
  const result = promote(conversion, {
    tmp,
    beforeBytes: statSync(from).size,
    ops: { renameSync: failingRename },
  });

  assert.equal(typeof result.failed, 'string');
  assert.equal(existsSync(from), true, 'the original must survive a failed rename');
  assert.equal(existsSync(to), false, 'the destination must not exist when the rename failed');
});

test('formatReport renders a stable, greppable markdown table with an outcome per row', () => {
  const results = [
    { kind: 'image', from: '/a.png', to: '/a.webp', beforeBytes: 100, afterBytes: 50 },
    { kind: 'gif', from: '/b.gif', to: '/b.gif', beforeBytes: 100, afterBytes: 100, skipped: 'no gain' },
    { kind: 'video', from: '/c.mp4', to: '/c.mp4', beforeBytes: 100, afterBytes: 100, failed: 'ffprobe reported no streams' },
    { kind: 'model', from: '/d.glb', to: '/d.glb', beforeBytes: 100, afterBytes: null },
  ];
  const report = formatReport(results);
  assert.ok(report.startsWith('| kind | from | to | beforeBytes | afterBytes | outcome |'));
  assert.ok(report.includes('| image | /a.png | /a.webp | 100 | 50 | converted |'));
  assert.ok(report.includes('skipped: no gain'));
  assert.ok(report.includes('failed: ffprobe reported no streams'));
  assert.ok(report.includes('planned'));
});
