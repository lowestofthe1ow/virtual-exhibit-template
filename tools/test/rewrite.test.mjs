import { test } from 'node:test';
import assert from 'node:assert/strict';
import { remapSpecifier, rewriteFile } from '../integrate/rewrite.mjs';

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
