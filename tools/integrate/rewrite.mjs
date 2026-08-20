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

  // Vite import suffixes ('?url', '?raw', '?w=400&format=webp', ...) are not
  // part of the filesystem path and are never keys in pathMap, so they must
  // be split off before the lookup (and before the extensionless-import
  // fallback below, which walks pathMap the same way) and re-attached
  // byte-for-byte to whatever path the lookup produces.
  const queryIndex = spec.indexOf('?');
  const suffix = queryIndex === -1 ? '' : spec.slice(queryIndex);
  const specPath = queryIndex === -1 ? spec : spec.slice(0, queryIndex);

  const oldTarget = normalize(join(fromDir, specPath));

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
  if (!specPath.includes(posix.extname(oldTarget)) && posix.extname(oldTarget)) {
    newTarget = newTarget.slice(0, newTarget.lastIndexOf('.'));
  }

  let out = relative(toDir, newTarget);
  if (!out.startsWith('.')) out = `./${out}`;
  return out + suffix;
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
  // and the root-absolute reference shapes need the slug inserted. The media
  // optimizer may ALSO have renamed the file on disk before this ever runs
  // (Clock.png -> Clock.webp, original deleted) — so the name to search for
  // in the source text (what the exhibit's own code still says) and the name
  // to write into the rewritten reference (what actually exists on disk) can
  // differ. publicAssets is therefore a mapping of original name -> final
  // name, not just a list: a Map is canonical; a plain array is also
  // accepted for backward compatibility and treated as an identity mapping
  // (every name maps to itself, i.e. "the optimizer left it alone"). Names
  // may include a subdirectory ("S04_Group3_images/grass-tile.png"), which
  // needs no special handling here since the forward slash is not a regex
  // metacharacter.
  const assetEntries = publicAssets instanceof Map
    ? publicAssets
    : publicAssets.map((name) => [name, name]);
  for (const [original, final] of assetEntries) {
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Same optional-slash blind spot as routes above: ${base}/logo.png and
    // ${base}logo.png both occur in the wild. Replaced via a function (not
    // a "$1$2..." template) so that a `final` name containing a literal
    // "$" can never be misread as a backreference.
    out = out.replace(
      new RegExp('(\\$\\{base[A-Za-z]*\\})(/?)(' + escaped + ')' + TRAILING_BOUNDARY, 'g'),
      (match, baseLit, slash) => `${baseLit}${slash}${slug}/${final}`,
    );
    // The root-absolute form ("/Clock.png") resolves at the browser root, so
    // it needs both the umbrella site's own base AND the slug spliced in:
    // "/Clock.png" -> "/virtual-exhibit-template/s40g1/Clock.webp". This is
    // unlike the ${base}-prefixed form just above, whose ${base} already
    // supplies the umbrella base at runtime - adding it there too would
    // double it, so only this root-absolute branch gets umbrellaBase.
    out = out.replace(
      new RegExp('(["\'`])/(' + escaped + ')' + TRAILING_BOUNDARY, 'g'),
      (match, quote) => `${quote}/${umbrellaBase}/${slug}/${final}`,
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
