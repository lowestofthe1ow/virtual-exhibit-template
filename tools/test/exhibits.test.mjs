import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadExhibits, validateExhibits } from '../lib/exhibits.mjs';

test('exhibits.json holds all 53 exhibits and validates', () => {
  const exhibits = loadExhibits();
  assert.equal(exhibits.length, 53);
  const { ok, errors } = validateExhibits(exhibits);
  assert.deepEqual(errors, []);
  assert.ok(ok);
});

test('the S40 G4 entry uses the s40g4 slug', () => {
  const slugs = loadExhibits().map((e) => e.slug);
  assert.ok(slugs.includes('s40g4'), 's40g4 must exist');
  assert.ok(!slugs.includes('s02g4_2'), 's02g4_2 must be gone');
});

test('every exhibit carries a status and the two done ones are live', () => {
  const exhibits = loadExhibits();
  assert.ok(exhibits.every((e) => typeof e.status === 'string'));
  const live = exhibits.filter((e) => e.status === 'live').map((e) => e.slug);
  // Inclusion, not equality: this set grows by one on every exhibit task.
  assert.ok(live.includes('s01g1'));
  assert.ok(live.includes('s01g4'));
});

test('all 53 exhibits are integrated', () => {
  const exhibits = loadExhibits();
  const pending = exhibits.filter((e) => e.status === 'pending').map((e) => e.slug);
  assert.deepEqual(pending, [], `still pending: ${pending.join(', ')}`);
});

test('validateExhibits rejects a slug that disagrees with section and group', () => {
  const { ok, errors } = validateExhibits([
    { section: 'S02', group: 4, slug: 's02g4_2', status: 'pending' },
  ]);
  assert.equal(ok, false);
  assert.ok(errors.some((e) => e.includes('s02g4_2')));
});
