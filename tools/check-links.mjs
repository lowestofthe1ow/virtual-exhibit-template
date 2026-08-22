import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Every internal href/src in the built site must resolve to a file that exists.
//
// Deliberately written in Node rather than shell: dist/s03g8/index.html
// contains NUL bytes, and grep classifies such a file as binary and skips it
// without saying so — which would make this check report a false pass.

const ATTR = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

function isInternal(url) {
  if (!url.startsWith('/')) return false;
  return !url.startsWith('//');
}

export function checkLinks(distDir) {
  const errors = [];

  for (const file of walk(distDir)) {
    const html = readFileSync(file, 'utf8');
    for (const [, raw] of html.matchAll(ATTR)) {
      if (!isInternal(raw)) continue;

      const clean = raw.split('#')[0].split('?')[0];
      if (!clean || clean === '/') continue;

      const target = join(distDir, clean);
      const ok =
        (existsSync(target) && statSync(target).isFile()) ||
        existsSync(join(target, 'index.html'));

      if (!ok) errors.push(`${file}: dead link ${raw}`);
    }
  }

  return { ok: errors.length === 0, errors };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { ok, errors } = checkLinks('dist');
  for (const e of errors) console.error(`FAIL ${e}`);
  console.log(`${errors.length} dead links`);
  process.exit(ok ? 0 : 1);
}
