/**
 * Generates the responsive portrait set for the home page about section.
 *
 * WHY THIS EXISTS: astro.config.mjs uses `passthroughImageService()`, so
 * Astro does no resizing or format conversion at build time. Every image it
 * emits is the byte-identical source file. A 1254x1254 2.2MB PNG shipped that
 * way would be the heaviest asset on the site by an order of magnitude, and a
 * phone would download all of it to paint a 300px-wide portrait.
 *
 * Rather than switch the global image service (which would change build
 * behaviour for every image on the site in service of one photo), this script
 * pre-generates the variants and the section renders a plain <picture> with a
 * hand-written srcset. That keeps the optimisation local to the one asset that
 * needs it.
 *
 * Run after replacing the source portrait:
 *   npm run portrait
 *
 * The source lives under src/ rather than public/ on purpose: everything in
 * public/ is copied verbatim into dist/, so a 2.2MB original sitting there
 * would ship on every deploy without a single page referencing it.
 *
 * The master is WebP at quality 92 rather than the original PNG: every
 * delivered variant is itself lossy and downscaled, so a q92 master produces
 * output within 1% of the PNG (verified) at a tenth of the repository weight.
 *
 * Outputs to src/assets/images/portrait/ so the files are content-hashed and
 * long-cached by Astro's bundler rather than served unhashed from public/.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = path.join(root, "src/assets/images/portrait/source/me.webp");
const OUT_DIR = path.join(root, "src/assets/images/portrait");

/**
 * Rendered widths. The portrait paints at roughly 300px on a phone and 380px
 * in the desktop two-column layout, so 640 covers a 2x phone and 760 covers a
 * 2x desktop. 320 serves 1x small phones. Nothing above 760 would ever be
 * chosen by the sizes attribute, so generating more would be dead weight.
 */
const WIDTHS = [320, 480, 640, 760];

/**
 * 4/5 portrait, matching the hero photo's ratio so the two figures on the
 * home page share one shape. The source is square, so cropping to 4/5 removes
 * height; `position: top` keeps the face and biases the loss to the chest.
 */
const RATIO = 4 / 5;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const input = await readFile(SOURCE);
  const meta = await sharp(input).metadata();
  console.log(`source: ${meta.width}x${meta.height} ${meta.format} ${(input.length / 1024 / 1024).toFixed(2)}MB`);

  const results = [];

  for (const width of WIDTHS) {
    const height = Math.round(width / RATIO);

    // AVIF and WebP both ship: AVIF is roughly 30% smaller at equal quality,
    // and WebP is the fallback for the browsers that lack AVIF decoding.
    for (const format of ["avif", "webp"]) {
      const pipeline = sharp(input)
        .resize(width, height, { fit: "cover", position: "top" })
        .toFormat(format, format === "avif" ? { quality: 62, effort: 6 } : { quality: 78 });

      const buffer = await pipeline.toBuffer();
      const file = path.join(OUT_DIR, `me-${width}.${format}`);
      await writeFile(file, buffer);
      results.push({ file: path.relative(root, file), kb: buffer.length / 1024 });
    }
  }

  for (const r of results.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(`${r.file.padEnd(46)} ${r.kb.toFixed(1)}KB`);
  }

  const total = results.reduce((sum, r) => sum + r.kb, 0);
  console.log(`\n${results.length} files, ${total.toFixed(1)}KB total`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
