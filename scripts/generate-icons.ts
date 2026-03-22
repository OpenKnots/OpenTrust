import sharp from "sharp";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SVG = readFileSync(join(ROOT, "app/icon.svg"));
const OUT = join(ROOT, "public/icons");

mkdirSync(OUT, { recursive: true });

const SIZES = [192, 512] as const;

async function main() {
  for (const size of SIZES) {
    await sharp(SVG).resize(size, size).png().toFile(join(OUT, `icon-${size}.png`));
    console.log(`  icon-${size}.png`);
  }

  const padding = Math.round(512 * 0.1);
  const inner = 512 - padding * 2;
  const maskableBg = Buffer.from(
    `<svg width="512" height="512"><rect width="512" height="512" rx="0" fill="#050816"/></svg>`
  );

  await sharp(maskableBg)
    .composite([{ input: await sharp(SVG).resize(inner, inner).png().toBuffer(), top: padding, left: padding }])
    .png()
    .toFile(join(OUT, "icon-maskable-512.png"));
  console.log("  icon-maskable-512.png");

  await sharp(SVG).resize(180, 180).png().toFile(join(OUT, "apple-touch-icon.png"));
  console.log("  apple-touch-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
