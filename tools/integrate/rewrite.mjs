import { posix } from 'node:path';

const { join, dirname, relative, normalize } = posix;

const SPECIFIER = /(["'`])(\.\.?\/[^"'`]+)\1/g;

// A route or public-asset name must be followed by a quote/backtick, a path
// separator, a query/fragment marker, or the end of the string — never by a
// hyphen, letter, digit, or dot. Without this, 'references' would splice into
// 'references-appendix' and 'simulator' into 'simulator2'.
const TRAILING_BOUNDARY = '(?=[`\'"/#?]|$)';

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
  { fromDir, toDir, pathMap, slug, routes = [], publicAssets = [] },
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

  return out;
}
