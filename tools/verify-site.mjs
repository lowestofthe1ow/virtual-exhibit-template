import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { loadExhibits } from './lib/exhibits.mjs';

export function verifySite(distDir, exhibits) {
  const errors = [];
  for (const e of exhibits) {
    if (e.status !== 'live') continue;
    const route = join(distDir, e.slug, 'index.html');
    if (!existsSync(route)) errors.push(`live exhibit ${e.slug} has no built route at ${route}`);
  }
  return { ok: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const exhibits = loadExhibits();
  const { ok, errors } = verifySite('dist', exhibits);
  const live = exhibits.filter((e) => e.status === 'live').length;
  for (const error of errors) console.error(`FAIL ${error}`);
  console.log(`${live}/53 exhibits live, ${errors.length} problems`);
  process.exit(ok ? 0 : 1);
}
