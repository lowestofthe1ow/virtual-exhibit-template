import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the shared Tailwind entry imports theme and utilities but not preflight', () => {
  const css = readFileSync('src/styles/tailwind-scoped.css', 'utf8');
  assert.match(css, /tailwindcss\/theme\.css/);
  assert.match(css, /tailwindcss\/utilities\.css/);
  assert.doesNotMatch(css, /tailwindcss\/preflight\.css/);
  assert.doesNotMatch(css, /@import\s+["']tailwindcss["']\s*;/);
});
