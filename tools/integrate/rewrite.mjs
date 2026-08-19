import { posix } from 'node:path';

const { join, dirname, relative, normalize } = posix;

const SPECIFIER = /(["'`])(\.\.?\/[^"'`]+)\1/g;

// A route or public-asset name must be followed by a quote/backtick, a path
// separator, a query/fragment marker, or the end of the string — never by a
// hyphen, letter, digit, or dot. Without this, 'references' would splice into
// 'references-appendix' and 'simulator' into 'simulator2'.
const TRAILING_BOUNDARY = '(?=[`\'"/#?]|$)';

// The umbrella site's own base (astro.config.mjs's `base:`). Fixed for this
// project, so a constant is simpler than threading a config read through
// every call site; rewriteFile still takes it as an overridable option below
// rather than baking the literal into the regex, so a caller can pass a
// different value instead of forking this file if that ever stops being true.
const UMBRELLA_BASE = 'virtual-exhibit-template';

// A source repo's own astro.config `base:` shows up in the wild as
// '/CSARCH2-Group-6/', 'virtual-exhibit-template', '/', or '' — leading and
// trailing slashes are noise, and a bare '/' or empty string both mean "this
// repo never set its own base" rather than naming a real path segment.
export function normalizeBase(base) {
  if (!base) return '';
  return base.replace(/^\/+/, '').replace(/\/+$/, '');
}

export function remapSpecifier(spec, { fromDir, toDir, pathMap }) {
  if (!spec.startsWith('.')) return spec;

  const oldTarget = normalize(join(fromDir, spec));

  let newTarget = pathMap.get(oldTarget);
  if (!newTarget) {
    // Try extensionless imports: "../components/Foo" -> "components/Foo.jsx"
    for (const [from, to] of pathMap) {
      if (from.slice(0, from.lastIndexOf('.')) === oldTarget) {
        newTarget = to;
        break;
      }
    }
  }
  if (!newTarget) return spec;

  // Preserve an extensionless import style if that is how it was written.
  if (!spec.includes(posix.extname(oldTarget)) && posix.extname(oldTarget)) {
    newTarget = newTarget.slice(0, newTarget.lastIndexOf('.'));
  }

  let out = relative(toDir, newTarget);
  if (!out.startsWith('.')) out = `./${out}`;
  return out;
}

export function rewriteFile(
  content,
  {
    fromDir, toDir, pathMap, slug, routes = [], publicAssets = [],
    sourceBase = '', umbrellaBase = UMBRELLA_BASE,
  },
) {
  let out = content.replace(SPECIFIER, (match, quote, spec) => {
    const remapped = remapSpecifier(spec, { fromDir, toDir, pathMap });
    return `${quote}${remapped}${quote}`;
  });

  for (const route of routes) {
    // ${base}route/  ->  ${base}<slug>/route/
    // ${base}/route/ -> ${base}/<slug>/route/
    // Student code writes both shapes (with and without a single separating
    // slash between the base template literal and the route name); the
    // optional slash is captured and echoed back unchanged so the slug is
    // spliced in without altering whichever shape the source used.
    const pattern = new RegExp(
      '(\\$\\{base[A-Za-z]*\\})(/?)(' + route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')' + TRAILING_BOUNDARY,
      'g',
    );
    out = out.replace(pattern, `$1$2${slug}/$3`);
  }

  // Files served from public/ move to public/<slug>/, so both the base-relative
  // and the root-absolute reference shapes need the slug inserted.
  for (const asset of publicAssets) {
    const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Same optional-slash blind spot as routes above: ${base}/logo.png and
    // ${base}logo.png both occur in the wild.
    out = out.replace(
      new RegExp('(\\$\\{base[A-Za-z]*\\})(/?)(' + escaped + ')' + TRAILING_BOUNDARY, 'g'),
      `$1$2${slug}/$3`,
    );
    out = out.replace(
      new RegExp('(["\'`])/(' + escaped + ')' + TRAILING_BOUNDARY, 'g'),
      `$1/${slug}/$2`,
    );
  }

  // Some repos hardcoded their OWN astro.config base into src/ instead of
  // using ${base} or a relative path — a route like
  // "/CSARCH2-G8-GPU-WARS-FORKED-/01-main" or a public asset like
  // "/CSARCH2-G9-Exhibit/astronauts.png". Both routes and public assets end
  // up living under the umbrella's base plus this exhibit's slug once
  // merged, so both are fixed by the same substitution: swap the leading
  // "/<sourceBase>/" for "/<umbrellaBase>/<slug>/" and leave the rest of the
  // path (and the rest of the string) untouched.
  //
  // Runs last, after the ${base}-prefixed template-literal passes above,
  // because it targets a structurally different, disjoint shape: those
  // passes only ever touch a literal "${base...}" prefix, while this one
  // only touches a literal quote immediately followed by "/<sourceBase>/".
  // Neither pass's output can ever contain the other's trigger text, so
  // ordering can't cause a reference to be rewritten twice — this is simply
  // the last independent pass, standing in for the fact that, unlike routes/
  // publicAssets, it does not need a per-name loop.
  const normalizedSourceBase = normalizeBase(sourceBase);
  if (normalizedSourceBase) {
    const escapedBase = normalizedSourceBase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out.replace(
      new RegExp('(["\'`])/' + escapedBase + '/', 'g'),
      `$1/${umbrellaBase}/${slug}/`,
    );
  }

  return out;
}
