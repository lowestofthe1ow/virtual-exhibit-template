import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildGallery } from '../lib/gallery.mjs';
import { loadExhibits } from '../lib/exhibits.mjs';

const make = (slug, section, group, status = 'live') => ({
  slug, section, group, status, title: slug, authors: [], keywords: [],
});

test('top row follows the ranking order, not section order', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s04g2', 'S04', 2), make('s02g3', 'S02', 3)];
  const { top } = buildGallery(exhibits, ['s04g2', 's01g1'], { topCount: 2 });
  assert.deepEqual(top.map((e) => e.slug), ['s04g2', 's01g1']);
});

test('ranked exhibits are excluded from the section groups', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s01g2', 'S01', 2), make('s02g1', 'S02', 1)];
  const { sections } = buildGallery(exhibits, ['s01g1'], { topCount: 1 });
  const s01 = sections.find((s) => s.section === 'S01');
  assert.deepEqual(s01.exhibits.map((e) => e.slug), ['s01g2']);
});

test('pending exhibits never appear anywhere', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s01g2', 'S01', 2, 'pending')];
  const { top, sections } = buildGallery(exhibits, [], { topCount: 15 });
  const shown = [...top, ...sections.flatMap((s) => s.exhibits)].map((e) => e.slug);
  assert.deepEqual(shown, ['s01g1']);
});

test('external exhibits appear alongside live ones', () => {
  const exhibits = [make('s01g1', 'S01', 1), make('s02g7', 'S02', 7, 'external')];
  const { top, sections } = buildGallery(exhibits, [], { topCount: 15 });
  const shown = [...top, ...sections.flatMap((s) => s.exhibits)].map((e) => e.slug);
  assert.ok(shown.includes('s02g7'), `expected s02g7 to appear, got: ${shown.join(', ')}`);
});

test('with no rankings the top row falls back to section then group order', () => {
  const exhibits = [make('s02g1', 'S02', 1), make('s01g2', 'S01', 2), make('s01g1', 'S01', 1)];
  const { top } = buildGallery(exhibits, [], { topCount: 2 });
  assert.deepEqual(top.map((e) => e.slug), ['s01g1', 's01g2']);
});

test('sections come out in S01..S05 then S40 order', () => {
  const exhibits = [make('s40g1', 'S40', 1), make('s01g1', 'S01', 1), make('s05g1', 'S05', 1)];
  const { sections } = buildGallery(exhibits, [], { topCount: 0 });
  assert.deepEqual(sections.map((s) => s.section), ['S01', 'S05', 'S40']);
});

test('every slug in rankings.json exists in exhibits.json', () => {
  const rankings = JSON.parse(readFileSync('src/data/rankings.json', 'utf8'));
  const slugs = new Set(loadExhibits().map((e) => e.slug));
  for (const slug of rankings) {
    assert.ok(slugs.has(slug), `rankings.json contains unknown slug: ${slug}`);
  }
});
