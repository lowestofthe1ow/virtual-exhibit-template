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
