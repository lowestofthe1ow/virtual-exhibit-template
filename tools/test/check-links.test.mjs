import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { checkLinks } from '../check-links.mjs';

function dist(files) {
  const dir = mkdtempSync(join(tmpdir(), 'dist-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = join(dir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, body);
  }
  return dir;
}

test('a page linking to an existing file passes', () => {
  const d = dist({
    'index.html': '<a href="/s01g8/">go</a>',
    's01g8/index.html': '<html></html>',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test('a page linking to a missing file fails', () => {
  const d = dist({ 'index.html': '<a href="/s01g8/">go</a>' });
  const { ok, errors } = checkLinks(d);
  assert.equal(ok, false);
  assert.ok(errors[0].includes('/s01g8/'));
});

test('a missing image is reported', () => {
  const d = dist({ 'index.html': '<img src="/a/missing.webp">' });
  assert.equal(checkLinks(d).ok, false);
});

test('external, anchor, mailto and data URLs are ignored', () => {
  const d = dist({
    'index.html':
      '<a href="https://example.com/x">a</a><a href="#top">b</a>' +
      '<a href="mailto:x@y.z">c</a><img src="data:image/png;base64,AAAA">',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test('a directory link resolves to its index.html', () => {
  const d = dist({
    'index.html': '<a href="/s01g8">go</a>',
    's01g8/index.html': '<html></html>',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test('query strings and fragments are stripped before resolving', () => {
  const d = dist({
    'index.html': '<img src="/a.webp?v=2"><a href="/s01g8/#intro">x</a>',
    'a.webp': 'x',
    's01g8/index.html': '<html></html>',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test('a file containing NUL bytes is still scanned', () => {
  const d = dist({
    'index.html': `<span>${String.fromCharCode(0)}</span><a href="/gone/">x</a>`,
  });
  assert.equal(checkLinks(d).ok, false);
});

test('a missing distDir returns {ok: false} with an error and does not throw', () => {
  const { ok, errors } = checkLinks('/tmp/definitely-does-not-exist-xyz-123');
  assert.equal(ok, false);
  assert.ok(errors[0].includes('no such directory'));
});

test('an existing but empty distDir returns {ok: true, errors: []}', () => {
  const d = mkdtempSync(join(tmpdir(), 'empty-dist-'));
  const { ok, errors } = checkLinks(d);
  assert.equal(ok, true);
  assert.deepEqual(errors, []);
});

test("a page whose inline <script> contains `const heroSrc = \"/does/not/exist.webp\"` reports NO dead link", () => {
  const d = dist({
    'index.html': '<script>const heroSrc = "/does/not/exist.webp";</script>',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test("a page whose inline <script> contains `let src = \"/also/missing.webp\"` reports NO dead link", () => {
  const d = dist({
    'index.html': '<script>let src = "/also/missing.webp";</script>',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});

test('a page with <a href="/real/"> AND a script block still catches the real dead link', () => {
  const d = dist({
    'index.html':
      '<script>const src = "/does/not/exist.webp";</script>' +
      '<a href="/real/">link</a>',
  });
  const { ok, errors } = checkLinks(d);
  assert.equal(ok, false);
  assert.ok(errors[0].includes('/real/'));
  assert.equal(errors.length, 1);
});

test('a page containing an unclosed <script> tag with a link-like string reports no dead link', () => {
  const d = dist({
    'index.html': '<script>let src = "/nope.webp";',
  });
  assert.deepEqual(checkLinks(d).errors, []);
});
