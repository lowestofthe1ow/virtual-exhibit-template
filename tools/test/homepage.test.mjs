import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadExhibits } from '../lib/exhibits.mjs';

const DIST = 'dist/index.html';

test('homepage was built', () => {
  assert.ok(existsSync(DIST), 'run `npm run build` before this suite');
});

test('homepage shows a card for every live exhibit and none for pending ones', () => {
  const html = readFileSync(DIST, 'utf8');
  // Derived from the data, so this test stays correct as exhibits go live.
  for (const e of loadExhibits()) {
    const card = new RegExp(`id="${e.slug}"`);
    if (e.status === 'live') assert.match(html, card, `${e.slug} is live but has no card`);
    else assert.doesNotMatch(html, card, `${e.slug} is ${e.status} but rendered a card`);
  }
});

test('homepage renders section headings for grouped exhibits', () => {
  const html = readFileSync(DIST, 'utf8');
  assert.match(html, /Top exhibits/);
});
