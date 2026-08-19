import { readdirSync, statSync, renameSync, unlinkSync, existsSync,
         readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execFileSync } from 'node:child_process';

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

const MAX_IMAGE_DIM = 2560;
const WEBP_QUALITY = 82;
const VIDEO_CRF = 24;
const MAX_VIDEO_WIDTH = 1920;
const SVG_RASTER_THRESHOLD = 1024 * 1024;
const EMBEDDED_RASTER_MIN = 64 * 1024;

// Shared cap for every failure/skip reason string, so the two call sites
// that used to truncate independently (150 vs 200 chars) cannot drift.
export const FAILURE_REASON_MAX = 200;

function walk(dir, out = []) {
  // Many exhibit repos ship with no src/assets/ directory at all. Treat a
  // missing directory as an empty tree rather than letting readdirSync
  // throw ENOENT — an existing-but-empty directory already returns []
  // from readdirSync on its own, so this only changes the missing case.
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

const swap = (file, ext) => file.slice(0, -extname(file).length) + ext;

export function planConversions(dir) {
  const plan = [];
  for (const file of walk(dir)) {
    const ext = extname(file).toLowerCase();
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      plan.push({ from: file, to: swap(file, '.webp'), kind: 'image' });
    } else if (ext === '.gif') {
      plan.push({ from: file, to: swap(file, '.webp'), kind: 'gif' });
    } else if (ext === '.mp4' || ext === '.webm' || ext === '.mov') {
      plan.push({ from: file, to: swap(file, '.mp4'), kind: 'video' });
    } else if (ext === '.glb' || ext === '.gltf') {
      plan.push({ from: file, to: file, kind: 'model' });
    } else if (ext === '.exr' || ext === '.hdr') {
      plan.push({ from: file, to: file, kind: 'hdr' });
    } else if (ext === '.svg' && statSync(file).size > SVG_RASTER_THRESHOLD) {
      // Small SVGs are real vectors. Huge ones are bitmaps in an SVG wrapper.
      plan.push({ from: file, to: file, kind: 'svg' });
    }
  }
  return plan;
}

// Every convert() branch derives its temp path from `to` the same way, and
// the failure-cleanup path (optimizeTree's catch block) needs to know that
// same path even when convert() threw before returning it. Keep it in one
// place so both sides always agree.
const tmpPathFor = ({ to }) => `${to}.tmp${extname(to)}`;

// Best-effort delete: used for temp-file cleanup on failure paths, where a
// missing file or a permissions hiccup must never mask the real error that
// triggered the cleanup.
function safeUnlink(unlink, path) {
  try {
    if (existsSync(path)) unlink(path);
  } catch {
    // deliberately swallowed — cleanup must never throw over the original error
  }
}

// Every failure/skip reason ends up as a Markdown table cell in
// formatReport(). Raw encoder stderr (execFileSync's thrown .message) can
// contain newlines, tabs, and literal pipe characters, any of which breaks
// a hand-built Markdown table: a newline splits the row across lines, and a
// pipe adds a phantom column. Route every reason through this single
// chokepoint — called both where reasons are constructed AND, as the final
// guarantee, inside formatReport itself — so no path can reach a table cell
// unsanitized, no matter where the string originated.
export function sanitizeReason(reason) {
  return String(reason)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '&#124;')
    .slice(0, FAILURE_REASON_MAX);
}

function convert(conversion) {
  const { from, kind } = conversion;
  const tmp = tmpPathFor(conversion);
  if (kind === 'image') {
    execFileSync('magick', [from, '-resize', `${MAX_IMAGE_DIM}x${MAX_IMAGE_DIM}>`,
      '-quality', String(WEBP_QUALITY), tmp]);
  } else if (kind === 'gif') {
    execFileSync('ffmpeg', ['-y', '-i', from, '-c:v', 'libwebp', '-lossless', '0',
      '-q:v', '75', '-loop', '0', '-an', '-fps_mode', 'passthrough', tmp]);
  } else if (kind === 'video') {
    execFileSync('ffmpeg', ['-y', '-i', from, '-c:v', 'libx264', '-crf', String(VIDEO_CRF),
      '-preset', 'slow', '-vf', `scale='min(${MAX_VIDEO_WIDTH},iw)':-2`,
      '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', tmp]);
  } else if (kind === 'model') {
    execFileSync('npx', ['--yes', '@gltf-transform/cli', 'optimize', from, tmp,
      '--texture-size', '1024', '--compress', 'draco']);
  } else if (kind === 'hdr') {
    execFileSync('magick', [from, '-resize', '2048x1024>', tmp]);
  } else if (kind === 'svg') {
    optimizeSvg(from, tmp);
  }
  return tmp;
}

// An SVG that is megabytes large is almost always a bitmap wrapped in vector
// markup. Re-encode the embedded rasters and leave the vector parts alone, so
// the file keeps its .svg extension and no reference has to change.
//
// Read/write as latin1 rather than utf8: latin1 round-trips every byte
// exactly (utf8 would silently replace invalid sequences with U+FFFD), and
// the base64 payloads this function manipulates are pure ASCII, so the
// regex work is unaffected either way.
function optimizeSvg(from, tmp) {
  const svg = readFileSync(from, 'latin1');
  const out = svg.replace(
    /data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+)/g,
    (match, format, base64) => {
      const buffer = Buffer.from(base64.replace(/\s/g, ''), 'base64');
      if (buffer.length < EMBEDDED_RASTER_MIN) return match;
      const inFile = `${tmp}.in.${format}`;
      const outFile = `${tmp}.out.webp`;
      try {
        writeFileSync(inFile, buffer);
        execFileSync('magick', [inFile, '-resize', `${MAX_IMAGE_DIM}x${MAX_IMAGE_DIM}>`,
          '-quality', String(WEBP_QUALITY), outFile]);
        const encoded = readFileSync(outFile).toString('base64');
        return `data:image/webp;base64,${encoded}`;
      } finally {
        // Runs whether magick succeeded or threw, so a failed re-encode of
        // one embedded raster never leaks its extracted input/output files.
        safeUnlink(unlinkSync, inFile);
        safeUnlink(unlinkSync, outFile);
      }
    },
  );
  writeFileSync(tmp, out, 'latin1');
}

// Gate before promoting a conversion's output over the original. An encoder
// that exits 0 while writing a zero-byte or truncated file must never be
// trusted just because the process succeeded — decode it back and confirm
// it is real content for its kind.
export function validateOutput(kind, path) {
  let size;
  try {
    size = statSync(path).size;
  } catch {
    return { valid: false, reason: sanitizeReason('output file is missing') };
  }
  if (size === 0) return { valid: false, reason: sanitizeReason('output file is empty') };

  if (kind === 'image' || kind === 'gif' || kind === 'hdr') {
    let out;
    try {
      out = execFileSync('magick', ['identify', path]).toString();
    } catch (error) {
      return { valid: false, reason: sanitizeReason(`magick identify failed: ${error.message}`) };
    }
    if (!/\d+x\d+/.test(out)) {
      return { valid: false, reason: sanitizeReason('magick identify reported no dimensions') };
    }
  } else if (kind === 'video') {
    let out;
    try {
      out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type', path]).toString();
    } catch (error) {
      return { valid: false, reason: sanitizeReason(`ffprobe failed: ${error.message}`) };
    }
    if (!/codec_type=/.test(out)) {
      return { valid: false, reason: sanitizeReason('ffprobe reported no streams') };
    }
  } else if (kind === 'model') {
    const head = readFileSync(path).subarray(0, 4).toString('ascii');
    if (head !== 'glTF') {
      try {
        JSON.parse(readFileSync(path, 'utf8'));
      } catch {
        return { valid: false, reason: sanitizeReason('model output is neither GLB magic nor valid JSON') };
      }
    }
  } else if (kind === 'svg') {
    const content = readFileSync(path, 'latin1');
    if (!content.includes('<svg')) {
      return { valid: false, reason: sanitizeReason('svg output missing <svg root element') };
    }
  }
  return { valid: true };
}

// Decide what to do with a conversion's temp output and carry it out:
// validate it, discard it if it didn't shrink the file, or promote it over
// the original. `ops` lets tests inject a failing renameSync/unlinkSync
// without touching a real filesystem beyond the fixtures they create.
//
// Promotion order matters: the temp file is renamed into place FIRST, and
// the original is only unlinked after that rename has actually succeeded.
// If rename() throws (ENOSPC, a permissions race, a concurrently removed
// directory), the original must still be there afterward.
export function promote(conversion, { tmp, beforeBytes, ops } = {}) {
  const rename = ops?.renameSync ?? renameSync;
  const unlink = ops?.unlinkSync ?? unlinkSync;
  const stat = ops?.statSync ?? statSync;

  let afterBytes;
  try {
    afterBytes = stat(tmp).size;
  } catch (error) {
    safeUnlink(unlink, tmp);
    return { ...conversion, beforeBytes, afterBytes: beforeBytes, failed: sanitizeReason(`output missing: ${error.message}`) };
  }

  const validation = validateOutput(conversion.kind, tmp);
  if (!validation.valid) {
    safeUnlink(unlink, tmp);
    return { ...conversion, beforeBytes, afterBytes: beforeBytes, failed: sanitizeReason(`invalid output: ${validation.reason}`) };
  }

  if (afterBytes >= beforeBytes) {
    // Conversion made it bigger (or same size). Keep the original untouched.
    safeUnlink(unlink, tmp);
    return { ...conversion, to: conversion.from, beforeBytes, afterBytes: beforeBytes, skipped: 'no gain' };
  }

  try {
    rename(tmp, conversion.to);
  } catch (error) {
    safeUnlink(unlink, tmp);
    return { ...conversion, beforeBytes, afterBytes: beforeBytes, failed: sanitizeReason(`rename failed: ${error.message}`) };
  }

  // Rename succeeded — conversion.to now holds the new file. Only now is it
  // safe to remove the original, and only when it's a different path (when
  // from === to, the rename already replaced the original file in place).
  if (conversion.from !== conversion.to) {
    safeUnlink(unlink, conversion.from);
  }

  return { ...conversion, beforeBytes, afterBytes };
}

export async function optimizeTree(dir, { apply = false } = {}) {
  const results = [];
  for (const conversion of planConversions(dir)) {
    const beforeBytes = statSync(conversion.from).size;
    if (!apply) {
      results.push({ ...conversion, beforeBytes, afterBytes: null });
      continue;
    }
    let tmp;
    try {
      tmp = convert(conversion);
    } catch (error) {
      // convert() may have written a partial file at its intended temp path
      // before throwing; that path is deterministic from the conversion, so
      // it can be cleaned up even though convert() never returned it.
      safeUnlink(unlinkSync, tmpPathFor(conversion));
      results.push({ ...conversion, beforeBytes, afterBytes: beforeBytes, failed: sanitizeReason(error.message) });
      continue;
    }
    results.push(promote(conversion, { tmp, beforeBytes }));
  }
  return results;
}

// Markdown table, one row per file. Kept greppable and stable — Task 61
// collects these into docs/asset-optimization-report.md — rather than
// optimized for prose readability.
//
// r.failed / r.skipped are sanitized again here even though every internal
// call site already sanitizes at construction time: this function is the
// last thing that runs before a reason becomes a table cell, and it is
// exported and callable with any result object (tests, or Task 61 itself),
// so it is the one place that must guarantee the invariant on its own.
export function formatReport(results) {
  const header = '| kind | from | to | beforeBytes | afterBytes | outcome |\n' +
    '| --- | --- | --- | --- | --- | --- |';
  const rows = results.map((r) => {
    const failed = r.failed != null ? sanitizeReason(r.failed) : null;
    const skipped = r.skipped != null ? sanitizeReason(r.skipped) : null;
    const outcome = failed
      ? `failed: ${failed}`
      : skipped
        ? `skipped: ${skipped}`
        : r.afterBytes == null
          ? 'planned'
          : 'converted';
    return `| ${r.kind} | ${r.from} | ${r.to} | ${r.beforeBytes} | ${r.afterBytes ?? ''} | ${outcome} |`;
  });
  return [header, ...rows, ''].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf('--dir') + 1];
  const apply = args.includes('--apply');
  const reportIdx = args.indexOf('--report');
  const reportPath = reportIdx >= 0 ? args[reportIdx + 1] : null;
  const results = await optimizeTree(dir, { apply });

  const before = results.reduce((n, r) => n + r.beforeBytes, 0);
  const after = results.reduce((n, r) => n + (r.afterBytes ?? r.beforeBytes), 0);
  for (const r of results) {
    const note = r.failed ? ` FAILED: ${r.failed}` : r.skipped ? ` (${r.skipped})` : '';
    console.log(`${r.kind.padEnd(6)} ${(r.beforeBytes / 1048576).toFixed(2).padStart(8)} -> ` +
      `${((r.afterBytes ?? r.beforeBytes) / 1048576).toFixed(2).padStart(8)} MB  ${r.to}${note}`);
  }
  console.log(`\n${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

  if (reportPath) {
    writeFileSync(reportPath, formatReport(results));
    console.log(`\nReport written to ${reportPath}`);
  }
}
