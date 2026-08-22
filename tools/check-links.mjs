import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Every internal href/src in the built site must resolve to a file that exists.
//
// Deliberately written in Node rather than shell: dist/s03g8/index.html
// contains NUL bytes, and grep classifies such a file as binary and skips it
// without saying so - which would make this check report a false pass.

const ATTR = /(?<![\w.\-])(?:href|src)\s*=\s*["']([^"']+)["']/gi;

function walk(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const p = join(dir, e.name);
      return e.isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
    });
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

// A "//X" reference is protocol-relative: the browser resolves X as a HOST,
// not as a path on this site. That is legitimate for a real external host
// ("//cdn.example.com/x"), and is exactly the defect this project shipped when
// `base: '/'` turned `${BASE_URL}/s03g3` into "//s03g3" - which a browser turns
// into https://s03g3/, a DNS lookup for a machine named s03g3. The two are told
// apart by whether the authority looks like a hostname at all: a real host has a
// dot (or is "localhost"), a slug does not.
//
// This check previously skipped EVERY "//" reference, which is why it reported
// "0 dead links" across 552 broken ones.
function classify(url) {
  if (!url.startsWith('/')) return 'external';
  if (!url.startsWith('//')) return 'internal';

  // Strip an optional port ("//localhost:4321") before judging the authority,
  // or a bare-hostname host with a port would be misread as a site path.
  const host = url.slice(2).split(/[/?#]/)[0].split(':')[0];
  if (host.includes('.') || host === 'localhost') return 'external';
  return 'protocol-relative';
}

// The <script> element's own src is a real link and must be checked; its BODY
// is JavaScript, where a "/x.webp" string literal is not necessarily a URL the
// page loads. So the opening tag is harvested first and only then is the whole
// element removed - stripping the element including its opening tag (as this
// did) fed zero of the build's 119 internal <script src> references to the
// attribute scan.
//
// A literal </script> ends the element even inside a JS string — that is real
// HTML parsing, not a regex limitation, which is why authors must escape it as
// <\/script>. Matching the browser here is deliberate.
const SCRIPT_EL = /<script([^>]*)>[\s\S]*?(?:<\/script>|$)/gi;
const STYLE_EL = /<style[^>]*>[\s\S]*?(?:<\/style>|$)/gi;

function collectRefs(html) {
  const refs = [];

  const stripped = html.replace(SCRIPT_EL, (_match, openingTag) => {
    for (const [, raw] of openingTag.matchAll(ATTR)) refs.push(raw);
    return '';
  });

  for (const [, raw] of stripped.replace(STYLE_EL, '').matchAll(ATTR)) refs.push(raw);
  return refs;
}

export function checkLinks(distDir) {
  if (!existsSync(distDir)) {
    return { ok: false, errors: [`${distDir}: no such directory`] };
  }

  const errors = [];

  for (const file of walk(distDir)) {
    const html = readFileSync(file, 'utf8');

    for (const raw of collectRefs(html)) {
      const kind = classify(raw);
      if (kind === 'external') continue;
      if (kind === 'protocol-relative') {
        errors.push(
          `${file}: protocol-relative URL ${raw} - a browser resolves ` +
            `"${raw.slice(2).split(/[/?#]/)[0]}" as a HOST, not as a path on this site`,
        );
        continue;
      }

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
