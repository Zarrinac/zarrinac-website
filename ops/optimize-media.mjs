// Optimize the local media source folder before `ops/upload-media.ps1` syncs it.
//
// WHY: source images here are far larger than they are ever displayed (multi-MB,
// 3840px+). next/image already re-encodes to AVIF/WebP when serving, so the main
// lever is DIMENSIONS — capping the source width feeds fewer pixels into the
// optimizer, shrinking every generated variant and improving LCP/CWV.
//
// SAFETY: format and filename are preserved (reference-safe — no code/DB/content
// references change). Dry-run by default (no writes); pass --apply to overwrite.
// Pass --backup to keep each original as <name>.orig before overwriting.
//
// Usage (from repo root):
//   node ops/optimize-media.mjs                 # dry run (default media path)
//   node ops/optimize-media.mjs --apply         # write changes in place
//   node ops/optimize-media.mjs --apply --backup
//   node ops/optimize-media.mjs "D:\\path\\to\\media" --max-width 1920 --jpg-quality 78
//
// Flags: --apply  --backup  --max-width <px=2048>  --jpg-quality <1-100=80>
//        --webp-quality <=80>  --min-kb <only touch files above this=150>

import sharp from 'sharp';
import { readdir, stat, rename, copyFile, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const val = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const positional = args.find(
  (a) => !a.startsWith('--') && args[args.indexOf(a) - 1]?.startsWith('--') === false,
);

const MEDIA_DIR =
  positional && !positional.startsWith('--')
    ? positional
    : 'C:\\Users\\r.saberifard\\Documents\\IT-Hisense\\HIsense-Website\\media';
const APPLY = flag('--apply');
const BACKUP = flag('--backup');
const MAX_WIDTH = Number(val('--max-width', 2048));
const JPG_Q = Number(val('--jpg-quality', 80));
const WEBP_Q = Number(val('--webp-quality', 80));
const MIN_BYTES = Number(val('--min-kb', 150)) * 1024;
const MIN_SAVING = 0.05; // skip if it would save < 5%

const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (exts.has(extname(entry.name).toLowerCase())) yield full;
  }
}

async function reencode(file, origBytes) {
  const img = sharp(file, { failOn: 'none' });
  const meta = await img.metadata();
  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  const ext = extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPG_Q, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: WEBP_Q });
  }
  const buf = await pipeline.toBuffer();
  return {
    buf,
    width: meta.width,
    newWidth: Math.min(meta.width ?? 0, MAX_WIDTH),
    saved: origBytes - buf.length,
  };
}

let count = 0;
let touched = 0;
let totalOld = 0;
let totalNew = 0;

for await (const file of walk(MEDIA_DIR)) {
  const { size } = await stat(file);
  totalOld += size;
  if (size < MIN_BYTES) {
    totalNew += size;
    continue;
  }
  count += 1;
  try {
    const { buf, width, newWidth, saved } = await reencode(file, size);
    if (saved > 0 && saved / size >= MIN_SAVING) {
      touched += 1;
      totalNew += buf.length;
      const rel = file.replace(MEDIA_DIR, '');
      const resized = width !== newWidth ? `${width}->${newWidth}px ` : '';
      console.log(
        `${APPLY ? 'WRITE' : 'would'}  ${(size / 1024).toFixed(0).padStart(5)}KB -> ${(
          buf.length / 1024
        )
          .toFixed(0)
          .padStart(5)}KB  (-${((saved / size) * 100).toFixed(0)}%)  ${resized}${rel}`,
      );
      if (APPLY) {
        if (BACKUP) await copyFile(file, `${file}.orig`);
        const tmp = `${file}.tmp`;
        try {
          await sharp(buf).toFile(tmp);
          await rename(tmp, file);
        } catch (e) {
          await unlink(tmp).catch(() => {}); // don't leave a stray .tmp behind on failure
          throw e;
        }
      }
    } else {
      totalNew += size;
    }
  } catch (err) {
    totalNew += size;
    console.warn(`SKIP (error) ${file}: ${err.message}`);
  }
}

console.log('\n──────── summary ────────');
console.log(`scanned (> ${MIN_BYTES / 1024}KB): ${count} files`);
console.log(`${APPLY ? 'optimized' : 'would optimize'}: ${touched} files`);
console.log(
  `total media: ${(totalOld / 1024 / 1024).toFixed(1)}MB -> ${(totalNew / 1024 / 1024).toFixed(1)}MB ` +
    `(-${(((totalOld - totalNew) / totalOld) * 100).toFixed(0)}%, saves ${((totalOld - totalNew) / 1024 / 1024).toFixed(1)}MB)`,
);
if (!APPLY)
  console.log('\nDry run — no files changed. Re-run with --apply (optionally --backup) to write.');
