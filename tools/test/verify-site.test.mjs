import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifySite } from '../verify-site.mjs';

function dist(slugs) {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const slug of slugs) {
    mkdirSync(join(dir, slug), { recursive: true });
    writeFileSync(join(dir, slug, 'index.html'), '<html></html>');
  }
  return dir;
}

test('a live exhibit with a built route passes', () => {
  const { ok, errors } = verifySite(dist(['s01g1']), [{ slug: 's01g1', status: 'live' }]);
  assert.deepEqual(errors, []);
  assert.ok(ok);
});

test('a live exhibit with no built route fails', () => {
  const { ok, errors } = verifySite(dist([]), [{ slug: 's01g1', status: 'live' }]);
  assert.equal(ok, false);
  assert.ok(errors[0].includes('s01g1'));
});

test('a pending exhibit is not required to have a route', () => {
  const { ok } = verifySite(dist([]), [{ slug: 's02g9', status: 'pending' }]);
  assert.ok(ok);
});

test('an external exhibit with embedded output passes', () => {
  const { ok, errors } = verifySite(dist(['s02g7']), [{ slug: 's02g7', status: 'external' }]);
  assert.deepEqual(errors, []);
  assert.ok(ok);
});

test('an external exhibit with no embedded output fails', () => {
  const { ok, errors } = verifySite(dist([]), [{ slug: 's02g7', status: 'external' }]);
  assert.equal(ok, false);
  assert.ok(errors[0].includes('s02g7'));
});
