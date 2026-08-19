import { readdirSync, statSync, renameSync, unlinkSync,
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

function walk(dir, out = []) {
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

function convert({ from, to, kind }) {
  const tmp = `${to}.tmp${extname(to)}`;
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
function optimizeSvg(from, tmp) {
  const svg = readFileSync(from, 'utf8');
  const out = svg.replace(
    /data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=\s]+)/g,
    (match, format, base64) => {
      const buffer = Buffer.from(base64.replace(/\s/g, ''), 'base64');
      if (buffer.length < EMBEDDED_RASTER_MIN) return match;
      const inFile = `${tmp}.in.${format}`;
      const outFile = `${tmp}.out.webp`;
      writeFileSync(inFile, buffer);
      execFileSync('magick', [inFile, '-resize', `${MAX_IMAGE_DIM}x${MAX_IMAGE_DIM}>`,
        '-quality', String(WEBP_QUALITY), outFile]);
      const encoded = readFileSync(outFile).toString('base64');
      unlinkSync(inFile);
      unlinkSync(outFile);
      return `data:image/webp;base64,${encoded}`;
    },
  );
  writeFileSync(tmp, out);
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
      results.push({ ...conversion, beforeBytes, afterBytes: beforeBytes, failed: String(error.message).slice(0, 200) });
      continue;
    }
    const afterBytes = statSync(tmp).size;
    if (afterBytes >= beforeBytes) {
      // Conversion made it bigger. Keep the original untouched.
      unlinkSync(tmp);
      results.push({ ...conversion, to: conversion.from, beforeBytes, afterBytes: beforeBytes, skipped: 'no gain' });
      continue;
    }
    if (conversion.from !== conversion.to) unlinkSync(conversion.from);
    renameSync(tmp, conversion.to);
    results.push({ ...conversion, beforeBytes, afterBytes });
  }
  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf('--dir') + 1];
  const apply = args.includes('--apply');
  const results = await optimizeTree(dir, { apply });

  const before = results.reduce((n, r) => n + r.beforeBytes, 0);
  const after = results.reduce((n, r) => n + (r.afterBytes ?? r.beforeBytes), 0);
  for (const r of results) {
    const note = r.failed ? ` FAILED: ${r.failed}` : r.skipped ? ` (${r.skipped})` : '';
    console.log(`${r.kind.padEnd(6)} ${(r.beforeBytes / 1048576).toFixed(2).padStart(8)} -> ` +
      `${((r.afterBytes ?? r.beforeBytes) / 1048576).toFixed(2).padStart(8)} MB  ${r.to}${note}`);
  }
  console.log(`\n${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
}
