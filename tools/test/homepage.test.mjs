import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { loadExhibits } from '../lib/exhibits.mjs';

const DIST = 'dist/index.html';

// Inputs the homepage is built from. If any of these are newer than the
// built dist/index.html, the build is stale and the assertions below would
// be checking old HTML against current data.
const INPUTS = [
  'src/data/exhibits.json',
  'src/data/rankings.json',
  'src/layouts/HomepageLayout.astro',
];

// Computed once: either null (dist is present and fresh) or a single
// actionable message naming the fix. Every data-dependent test consults
// this first so a missing/stale build fails clearly instead of throwing
// ENOENT or reporting a misleading data mismatch.
const staleness = (() => {
  if (!existsSync(DIST)) {
    return `${DIST} is missing — run \`npm run build\` before \`npm test\``;
  }
  const distMtime = statSync(DIST).mtimeMs;
  for (const input of INPUTS) {
    if (existsSync(input) && statSync(input).mtimeMs > distMtime) {
      return `${DIST} is stale (${input} is newer) — run \`npm run build\` before \`npm test\``;
    }
  }
  return null;
})();

function assertFresh() {
  assert.equal(staleness, null, staleness ?? undefined);
}

test('homepage was built and is up to date', () => {
  assertFresh();
});

test('homepage shows a card for every live exhibit and none for pending ones', () => {
  assertFresh();
  const html = readFileSync(DIST, 'utf8');
  // Derived from the data, so this test stays correct as exhibits go live.
  for (const e of loadExhibits()) {
    const card = new RegExp(`id="${e.slug}"`);
    if (e.status === 'live') assert.match(html, card, `${e.slug} is live but has no card`);
    else assert.doesNotMatch(html, card, `${e.slug} is ${e.status} but rendered a card`);
  }
});

test('homepage renders section headings for grouped exhibits', () => {
  assertFresh();
  const html = readFileSync(DIST, 'utf8');
  assert.match(html, /Top exhibits/);
});
