import { readdirSync, readFileSync, statSync, unlinkSync } from 'node:fs';
import { join, extname, basename, resolve, sep } from 'node:path';

const MEDIA = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.avif',
  '.mp4', '.webm', '.mov', '.mp3', '.wav', '.ogg',
  '.glb', '.gltf', '.exr', '.hdr',
]);
const ALWAYS_DROP = new Set(['.pdf', '.docx', '.pptx']);
const CODE = new Set([
  '.astro', '.mdx', '.md', '.js', '.jsx', '.ts', '.tsx',
  '.json', '.css', '.scss', '.html', '.mjs', '.cjs',
]);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

export const GLOB_REPOS = ['s03g2', 's03g5', 's03g7', 's03g8', 's04g1', 's05g5', 's40g5'];

export const TEMPLATE_LEFTOVERS = [
  'linux.mdx', 'DistroQuiz.jsx', 'ImageGallery.jsx',
  'Tux.png', 'Ubuntu.png', 'Debian.png', 'Fedora.png', 'Mint.png',
  'Manjaro.png', 'Zorin.png', 'PopOS.png', 'MX-Linux.png',
  'CachyOS.png', 'Endeavour.png',
];

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

// `haystackDir` is where references are searched for; it defaults to `dir`.
// They differ for public/, whose assets are referenced from src/ and which
// contains no code of its own — scanning it alone would flag every file.
export function findOrphans(dir, { haystackDir = dir } = {}) {
  const files = walk(dir);

  const haystack = walk(haystackDir)
    .filter((f) => CODE.has(extname(f).toLowerCase()))
    .map((f) => readFileSync(f, 'utf8'))
    .join('\n');

  const orphans = [];
  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (ALWAYS_DROP.has(ext)) {
      orphans.push({ path: file, bytes: statSync(file).size, reason: 'document' });
      continue;
    }
    if (!MEDIA.has(ext)) continue;

    const name = basename(file);
    const stem = name.slice(0, -ext.length);
    const referenced =
      haystack.includes(name) ||
      new RegExp(`${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\\s.)/]`).test(haystack);

    if (!referenced) orphans.push({ path: file, bytes: statSync(file).size, reason: 'unreferenced' });
  }
  return orphans;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const dir = args[args.indexOf('--dir') + 1];
  const apply = args.includes('--apply');
  const forceGlobRepo = args.includes('--force-glob-repo');
  const orphans = findOrphans(dir);
  const total = orphans.reduce((n, o) => n + o.bytes, 0);

  for (const o of orphans) {
    console.log(`${(o.bytes / 1048576).toFixed(2).padStart(8)} MB  ${o.reason.padEnd(12)} ${o.path}`);
  }
  console.log(`\n${orphans.length} files, ${(total / 1048576).toFixed(1)} MB`);

  // These repos build references at runtime via import.meta.glob, which basename
  // matching can't see — the report above cannot be trusted for them. Deletion is
  // refused unless an operator has reviewed it by hand and passes --force-glob-repo.
  const dirSegments = resolve(dir).split(sep);
  const globSlug = GLOB_REPOS.find((slug) => dirSegments.includes(slug));

  if (apply) {
    if (globSlug && !forceGlobRepo) {
      console.log(
        `\nrefusing to delete: '${dir}' is inside '${globSlug}', which uses import.meta.glob, ` +
        'so references built at runtime are invisible to this report and it cannot be trusted. ' +
        'Review the list above by hand, then re-run with --force-glob-repo to delete anyway.',
      );
    } else {
      let deleted = 0;
      let failed = 0;
      let reclaimed = 0;
      for (const o of orphans) {
        try {
          unlinkSync(o.path);
          deleted += 1;
          reclaimed += o.bytes;
          console.log(`deleted  ${o.path}`);
        } catch (err) {
          failed += 1;
          console.log(`failed   ${o.path}  (${err.message})`);
        }
      }
      console.log(`\n${deleted} deleted, ${failed} failed, ${(reclaimed / 1048576).toFixed(1)} MB reclaimed`);
    }
  } else {
    console.log('dry run — pass --apply to delete');
  }
}
