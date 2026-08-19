import { readFileSync } from 'node:fs';

export const SECTIONS = ['S01', 'S02', 'S03', 'S04', 'S05', 'S40'];
export const STATUSES = ['pending', 'live', 'external'];

export function loadExhibits(path = 'src/data/exhibits.json') {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function validateExhibits(exhibits) {
  const errors = [];
  const seen = new Set();

  for (const e of exhibits) {
    if (seen.has(e.slug)) errors.push(`duplicate slug: ${e.slug}`);
    seen.add(e.slug);

    const expected = `${String(e.section).toLowerCase()}g${e.group}`;
    if (e.slug !== expected) {
      errors.push(`slug ${e.slug} disagrees with section/group (expected ${expected})`);
    }
    if (!SECTIONS.includes(e.section)) errors.push(`unknown section on ${e.slug}: ${e.section}`);
    if (!STATUSES.includes(e.status)) errors.push(`bad status on ${e.slug}: ${e.status}`);
  }

  return { ok: errors.length === 0, errors };
}
