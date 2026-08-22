# Task 2 Report: The Link Checker

## What Was Implemented

Created a Node-based link checker that verifies all internal `href` and `src` attributes in built HTML files resolve to files that actually exist. The tool addresses the NUL-byte limitation of shell-based checkers (like grep) that would silently skip files containing NUL bytes.

**Files Created:**
- `tools/check-links.mjs` — The link checker module with CLI entry point
- `tools/test/check-links.test.mjs` — Comprehensive test suite

**Key Implementation Details:**
- Exports `checkLinks(distDir: string) => {ok: boolean, errors: string[]}`
- Recursively walks all HTML files in a distribution directory
- Extracts all `href` and `src` attributes using regex
- Filters for internal URLs (root-absolute, not protocol-relative)
- Strips query strings and fragments before resolution
- Tests both file existence and directory+index.html patterns
- CLI entry point follows verify-site.mjs conventions

## Testing and Results

### RED Phase (Test Failure)
```bash
$ node --test tools/test/check-links.test.mjs
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '../check-links.mjs'
```
Expected failure: module did not exist yet.

### GREEN Phase (All Tests Pass)
```bash
$ node --test tools/test/check-links.test.mjs
✔ a page linking to an existing file passes
✔ a page linking to a missing file fails
✔ a missing image is reported
✔ external, anchor, mailto and data URLs are ignored
✔ a directory link resolves to its index.html
✔ query strings and fragments are stripped before resolving
✔ a file containing NUL bytes is still scanned

✓ tests 7
✓ pass 7
✓ fail 0
```

### Full Test Suite
```bash
$ npm test
✓ tests 141
✓ pass 141
✓ fail 0
```
All 141 tests pass (134 existing from Task 1 + 7 new).

## Test Case Coverage

The 7 unit tests verify:

1. **Happy path**: Valid file links resolve correctly
2. **Dead links**: Missing files are reported with proper error messages
3. **Image resources**: Dead image src attributes are caught
4. **URL filtering**: External URLs (https://), anchors (#), mailto:, and data: URIs are ignored
5. **Directory resolution**: Directory links without trailing slash resolve to index.html
6. **Query/Fragment stripping**: Query strings (?v=2) and fragments (#intro) are stripped before resolution
7. **NUL byte handling**: Files containing NUL bytes (the core reason for Node over shell) are still scanned

## Files Changed

- **Created**: `tools/check-links.mjs` (52 lines)
- **Created**: `tools/test/check-links.test.mjs` (69 lines)

## Commit

```
c28993c feat: add Node link checker for built output

Written in Node rather than shell on purpose: dist/s03g8/index.html
contains NUL bytes, which grep treats as binary and skips silently.
```

## Self-Review Findings

### Completeness ✓
- All 7 test cases from the brief are present
- Implementation matches the brief exactly
- CLI entry point implemented with proper exit codes (0 for success, 1 for failures)
- Both interface exports (checkLinks function and CLI) are present

### Code Quality ✓
- Clear, concise code with appropriate variable names
- Comments explain the purpose and design rationale
- Follows project conventions: plain ESM, .mjs files, node:fs/node:path imports
- No unnecessary abstractions or complexity
- Proper use of `statSync(...).isFile()` to distinguish files from directories

### Discipline ✓
- Only the required functionality was implemented (no overbuilding)
- No external dependencies added
- No modifications to existing code (only new files created)
- Implementation exactly matches the brief specification

### Testing ✓
- All 7 new tests pass
- No regressions in existing tests (141/141 pass)
- Tests are well-structured with the fixture builder pattern
- Edge cases handled: NUL bytes, query strings, fragments, protocol-relative URLs

## Concerns

None. The implementation is complete, tested, and ready for use by Tasks 5 and 7.

## Notes

The checker correctly implements the deliberately two-branch resolution rule:
- A path resolves if it is an existing *file* (using `statSync(...).isFile()`)
- OR if appending `index.html` to it yields an existing file

This allows both `/s01g8` and `/s01g8/` to correctly resolve to `dist/s01g8/index.html`.

As noted in the brief, this checker only sees URLs in the built HTML. It cannot detect URLs built at runtime via JavaScript concatenation (e.g., the s02g9 `assetPath()` bug). That class of bug is addressed by Task 4 Step 3 via source code inspection.

---

## Fix Round 1: Reviewer Findings

### Issue 1: Missing distDir throws instead of returning {ok, errors}

**Problem:** The original `walk()` function called `readdirSync` without error handling. When `distDir` did not exist, the checker threw an `ENOENT` error instead of returning `{ok: false, errors: [...]}`.

**Solution:** 
- Added a try-catch in `walk()` that catches `ENOENT` and returns an empty array
- Added an explicit check at the start of `checkLinks()` to detect missing directories and return `{ok: false, errors: ['<distDir>: no such directory']}`
- Preserved existing behavior: an empty but existing directory still returns `{ok: true, errors: []}`

### Issue 2: Regex matches href/src inside `<script>` blocks

**Problem:** The regex `/(?:href|src)\s*=\s*["']([^"']+)["']/gi` matched `href`/`src` anywhere in the file, including inside inline script blocks. For example, `const jordanHubbardSrc = "/virtual-exhibit-template/_astro/jordan-hubbard.C6V_4bVC.webp"` would match and be checked as a link.

**Solution (two changes):**
1. Strip all `<script>…</script>` and `<style>…</style>` blocks before scanning:
   ```javascript
   html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
   html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
   ```

2. Update the regex with a negative lookbehind to exclude attribute matches that are part of identifiers or property access:
   ```javascript
   const ATTR = /(?<![\w.\-])(?:href|src)\s*=\s*["']([^"']+)["']/gi;
   ```

Together, these prevent both `const src = "..."` inside scripts and `el.href = "..."` in code from being checked. The trade-off: `data-src` attributes are now skipped (because `-` is excluded by the lookbehind), but a missed attribute is always safer than a false positive that would block Task 5's gate.

### Test Additions

Added 5 new test cases to `tools/test/check-links.test.mjs`:

1. **Missing distDir test**: Verifies `checkLinks('/tmp/definitely-does-not-exist-xyz-123')` returns `{ok: false, errors: [...]}` without throwing
2. **Empty distDir test**: Confirms an existing but empty directory returns `{ok: true, errors: []}`
3. **Script heroSrc test**: A `<script>` block containing `const heroSrc = "/does/not/exist.webp"` does NOT generate a false dead link
4. **Script src test**: A `<script>` block containing `let src = "/also/missing.webp"` does NOT generate a false dead link
5. **Mixed content test**: A page with both a real `<a href="/real/">` AND a script block still correctly reports the real dead link (and only that one)

### Test Results

```bash
$ node --test tools/test/check-links.test.mjs
✔ a page linking to an existing file passes
✔ a page linking to a missing file fails
✔ a missing image is reported
✔ external, anchor, mailto and data URLs are ignored
✔ a directory link resolves to its index.html
✔ query strings and fragments are stripped before resolving
✔ a file containing NUL bytes is still scanned
✔ a missing distDir returns {ok: false} with an error and does not throw
✔ an existing but empty distDir returns {ok: true, errors: []}
✔ a page whose inline <script> contains `const heroSrc = "/does/not/exist.webp"` reports NO dead link
✔ a page whose inline <script> contains `let src = "/also/missing.webp"` reports NO dead link
✔ a page with <a href="/real/"> AND a script block still catches the real dead link

✓ tests 12
✓ pass 12
✓ fail 0
```

Full suite: **146/146 tests pass** (141 original + 5 new from this fix).

### Commit

```
5c87b16 fix: handle missing distDir and strip script/style blocks from link scanning

- Catch ENOENT when distDir does not exist and return {ok: false, errors}
- Add lookbehind to regex to avoid matching href/src in JS identifiers
- Strip <script> and <style> blocks before scanning for href/src attributes
- Add 5 test cases covering these edge cases
```

### Files Changed

- **Modified**: `tools/check-links.mjs` (added 16 lines, regex update, error handling, script/style stripping)
- **Modified**: `tools/test/check-links.test.mjs` (added 5 new test cases)
