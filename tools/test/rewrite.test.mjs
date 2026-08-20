import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remapSpecifier, rewriteFile, normalizeBase } from '../integrate/rewrite.mjs';

const pathMap = new Map([
  ['components/Foo.jsx', 'components/s01g7/Foo.jsx'],
  ['assets/pic.png', 'assets/s01g7/pic.webp'],
  ['styles/theme.css', 'styles/s01g7/theme.css'],
]);

test('an entry page keeps its depth and gains the namespace', () => {
  const out = remapSpecifier('../components/Foo.jsx', {
    fromDir: 'pages', toDir: 'pages', pathMap,
  });
  assert.equal(out, '../components/s01g7/Foo.jsx');
});

test('a sub-page one level deeper gets an extra ../', () => {
  const out = remapSpecifier('../components/Foo.jsx', {
    fromDir: 'pages', toDir: 'pages/s01g7', pathMap,
  });
  assert.equal(out, '../../components/s01g7/Foo.jsx');
});

test('a component gains a level when it moves into its namespace', () => {
  const out = remapSpecifier('../assets/pic.png', {
    fromDir: 'components', toDir: 'components/s01g7', pathMap,
  });
  assert.equal(out, '../../assets/s01g7/pic.webp');
});

test('an unmapped specifier is left alone', () => {
  const out = remapSpecifier('../lib/util.js', {
    fromDir: 'pages', toDir: 'pages', pathMap,
  });
  assert.equal(out, '../lib/util.js');
});

test('bare package imports are never touched', () => {
  const out = remapSpecifier('react', { fromDir: 'pages', toDir: 'pages/s01g7', pathMap });
  assert.equal(out, 'react');
});

// --- Vite import-suffix handling (defect 1) ---

test('a query-suffixed specifier is remapped and keeps its suffix, even across an extension change', () => {
  const suffixMap = new Map([['assets/pattern.png', 'assets/s05g8/pattern.webp']]);
  const out = remapSpecifier('../assets/pattern.png?url', {
    fromDir: 'pages', toDir: 'pages', pathMap: suffixMap,
  });
  assert.equal(out, '../assets/s05g8/pattern.webp?url');
});

test('a multi-parameter query suffix is preserved byte-for-byte', () => {
  const suffixMap = new Map([['assets/pattern.png', 'assets/s05g8/pattern.webp']]);
  const out = remapSpecifier('../assets/pattern.png?w=400&format=webp', {
    fromDir: 'pages', toDir: 'pages', pathMap: suffixMap,
  });
  assert.equal(out, '../assets/s05g8/pattern.webp?w=400&format=webp');
});

test('a specifier with no suffix behaves exactly as it did before suffix handling was added', () => {
  const out = remapSpecifier('../assets/pic.png', {
    fromDir: 'pages', toDir: 'pages', pathMap,
  });
  assert.equal(out, '../assets/s01g7/pic.webp');
});

test('rewriteFile updates import statements', () => {
  const src = 'import Foo from "../components/Foo.jsx";\nimport "../styles/theme.css";\n';
  const out = rewriteFile(src, { fromDir: 'pages', toDir: 'pages/s01g7', pathMap, slug: 's01g7', routes: [] });
  assert.match(out, /"\.\.\/\.\.\/components\/s01g7\/Foo\.jsx"/);
  assert.match(out, /"\.\.\/\.\.\/styles\/s01g7\/theme\.css"/);
});

test('base-relative internal links gain the slug', () => {
  const src = 'href={`${base}shared-bus-problem/`}';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['shared-bus-problem'],
  });
  assert.match(out, /\$\{base\}s04g4\/shared-bus-problem\//);
});

test('references to a public asset gain the slug in both link shapes', () => {
  const out = rewriteFile('<img src="/moon.svg"> and href={`${base}moon.svg`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9',
    routes: [], publicAssets: ['moon.svg'],
  });
  assert.match(out, /src="\/s03g9\/moon\.svg"/);
  assert.match(out, /\$\{base\}s03g9\/moon\.svg/);
});

test('a base-relative link to a route the exhibit does not own is untouched', () => {
  const src = 'href={`${base}`}';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['shared-bus-problem'],
  });
  assert.equal(out, 'href={`${base}`}');
});

test('a route that is a hyphen-prefix of another route is not spliced', () => {
  const out = rewriteFile('href={`${base}references-appendix/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['references'],
  });
  assert.equal(out, 'href={`${base}references-appendix/`}');
});

test('the exact route is still rewritten when a longer route shares its prefix', () => {
  const out = rewriteFile('href={`${base}references/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['references'],
  });
  assert.match(out, /\$\{base\}s04g4\/references\//);
});

test('a route that is a digit-prefix of another route is not spliced', () => {
  const out = rewriteFile('href={`${base}simulator2/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's01g1', routes: ['simulator'],
  });
  assert.equal(out, 'href={`${base}simulator2/`}');
});

test('a public asset name that is a prefix of another filename is not spliced', () => {
  const out = rewriteFile('<img src="/logo.png.bak">', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', routes: [], publicAssets: ['logo.png'],
  });
  assert.equal(out, '<img src="/logo.png.bak">');
});

test('the exact public asset is still rewritten when a longer filename shares its prefix', () => {
  const out = rewriteFile('<img src="/logo.png">', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', routes: [], publicAssets: ['logo.png'],
  });
  assert.match(out, /src="\/s03g9\/logo\.png"/);
});

test('a route reference with no trailing slash before the closing backtick still rewrites', () => {
  const out = rewriteFile('href={`${base}silicon-minds`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's01g5', routes: ['silicon-minds'],
  });
  assert.match(out, /\$\{base\}s01g5\/silicon-minds`/);
});

test('a slash-separated base link is rewritten and keeps its leading slash', () => {
  const out = rewriteFile('href={`${baseUrl}/S01_Group7_fullcapacity/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's01g7', routes: ['S01_Group7_fullcapacity'],
  });
  assert.match(out, /\$\{baseUrl\}\/s01g7\/S01_Group7_fullcapacity\//);
});

test('a no-separator base link is rewritten and gains no slash', () => {
  const out = rewriteFile('href={`${base}shared-bus-problem/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['shared-bus-problem'],
  });
  assert.match(out, /\$\{base\}s04g4\/shared-bus-problem\//);
  assert.doesNotMatch(out, /\$\{base\}\/s04g4/);
});

test('the boundary still holds for the slash-separated form: a hyphen-prefix route is not spliced', () => {
  const out = rewriteFile('href={`${base}/references-appendix/`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's04g4', routes: ['references'],
  });
  assert.equal(out, 'href={`${base}/references-appendix/`}');
});

test('a slash-separated public asset reference is rewritten and keeps its leading slash', () => {
  const out = rewriteFile('href={`${base}/moon.svg`}', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', routes: [], publicAssets: ['moon.svg'],
  });
  assert.match(out, /\$\{base\}\/s03g9\/moon\.svg/);
});

// --- source-repo's-own-base rewriting (correction 1) ---

test('a hardcoded reference to the source repo\'s own base gains the umbrella base and slug', () => {
  const out = rewriteFile('<img src="/CSARCH2-G9-Exhibit/astronauts.png">', {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', sourceBase: 'CSARCH2-G9-Exhibit',
  });
  assert.equal(out, '<img src="/virtual-exhibit-template/s03g9/astronauts.png">');
});

test('the same rewrite applies inside a CSS url() reference', () => {
  const out = rewriteFile("@font-face { src: url('/CSARCH2-G9-Exhibit/astronauts.png'); }", {
    fromDir: 'styles', toDir: 'styles', pathMap, slug: 's03g9', sourceBase: 'CSARCH2-G9-Exhibit',
  });
  assert.match(out, /url\('\/virtual-exhibit-template\/s03g9\/astronauts\.png'\)/);
});

test('a reference to a different repo\'s base is left untouched', () => {
  const src = '<img src="/CSARCH2-G8-GPU-WARS-FORKED-/01-main.png">';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', sourceBase: 'CSARCH2-G9-Exhibit',
  });
  assert.equal(out, src);
});

test('an empty sourceBase causes no rewriting', () => {
  const src = '<img src="/CSARCH2-G9-Exhibit/astronauts.png">';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', sourceBase: '',
  });
  assert.equal(out, src);
});

test('a bare-slash sourceBase causes no rewriting', () => {
  const src = '<img src="/CSARCH2-G9-Exhibit/astronauts.png">';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', sourceBase: '/',
  });
  assert.equal(out, src);
});

test('a sourceBase that is only a hyphen-prefix of the actual base is not spliced', () => {
  const src = '<img src="/CSARCH2-G9-Exhibit/x.png">';
  const out = rewriteFile(src, {
    fromDir: 'pages', toDir: 'pages', pathMap, slug: 's03g9', sourceBase: 'CSARCH2-G9',
  });
  assert.equal(out, src);
});

test('normalizeBase strips leading and trailing slashes and treats "/" and "" as no base', () => {
  assert.equal(normalizeBase('/CSARCH2-Group-6/'), 'CSARCH2-Group-6');
  assert.equal(normalizeBase('virtual-exhibit-template'), 'virtual-exhibit-template');
  assert.equal(normalizeBase('/'), '');
  assert.equal(normalizeBase(''), '');
  assert.equal(normalizeBase(undefined), '');
});
