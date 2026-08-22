import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteBaseRefs } from '../lib/base-path.mjs';

const opts = { from: 'virtual-exhibit-template', to: '' };

test('rewrites a bare root-relative reference', () => {
  const { text, changed } = rewriteBaseRefs("'/virtual-exhibit-template/s40g1/Teacup.webp'", opts);
  assert.equal(text, "'/s40g1/Teacup.webp'");
  assert.equal(changed, 1);
});

test('rewrites href and src attributes', () => {
  const src = '<a href="/virtual-exhibit-template/s01g8">x</a><img src="/virtual-exhibit-template/a.webp">';
  const { text, changed } = rewriteBaseRefs(src, opts);
  assert.equal(text, '<a href="/s01g8">x</a><img src="/a.webp">');
  assert.equal(changed, 2);
});

test('rewrites markdown link destinations', () => {
  const { text } = rewriteBaseRefs('[Main hall](/virtual-exhibit-template/s01g8)', opts);
  assert.equal(text, '[Main hall](/s01g8)');
});

test('rewrites css url()', () => {
  const { text } = rewriteBaseRefs("url('/virtual-exhibit-template/s03g2/fonts/DS-DIGI.TTF')", opts);
  assert.equal(text, "url('/s03g2/fonts/DS-DIGI.TTF')");
});

test('LEAVES external https URLs alone', () => {
  const src = '"https://dmdlsu.github.io/virtual-exhibit-template/journey-of-a-message"';
  const { text, changed } = rewriteBaseRefs(src, opts);
  assert.equal(text, src);
  assert.equal(changed, 0);
});

test('LEAVES the string alone when it is a hostname', () => {
  const src = '"https://virtual-exhibit-template.onrender.com/usb"';
  const { text, changed } = rewriteBaseRefs(src, opts);
  assert.equal(text, src);
  assert.equal(changed, 0);
});

test('LEAVES github repo URLs alone', () => {
  const src = '"https://github.com/DMDLSU/virtual-exhibit-template"';
  const { text, changed } = rewriteBaseRefs(src, opts);
  assert.equal(text, src);
  assert.equal(changed, 0);
});

test('handles a line carrying both an external URL and a real reference', () => {
  const src = 'see https://x.github.io/virtual-exhibit-template/ then load "/virtual-exhibit-template/a.webp"';
  const { text, changed } = rewriteBaseRefs(src, opts);
  assert.equal(text, 'see https://x.github.io/virtual-exhibit-template/ then load "/a.webp"');
  assert.equal(changed, 1);
});

test('rewrites to a non-root base', () => {
  const { text } = rewriteBaseRefs("'/virtual-exhibit-template/a.webp'", {
    from: 'virtual-exhibit-template', to: 'csarch2',
  });
  assert.equal(text, "'/csarch2/a.webp'");
});

test('is a no-op on source with no references', () => {
  const { text, changed } = rewriteBaseRefs('const x = 1;', opts);
  assert.equal(text, 'const x = 1;');
  assert.equal(changed, 0);
});
