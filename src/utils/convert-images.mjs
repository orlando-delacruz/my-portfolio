import sharp from "sharp";
import { readdirSync } from "fs";
import { join, extname, basename } from "path";

const ASSETS_DIR = "src/assets/images";

const imageFiles = readdirSync(ASSETS_DIR).filter((file) =>
  [".png", ".jpg", ".jpeg"].includes(extname(file).toLowerCase()),
);

for (const file of imageFiles) {
  const input = join(ASSETS_DIR, file);
  const output = join(ASSETS_DIR, `${basename(file, extname(file))}.webp`);

  await sharp(input).webp({ quality: 85 }).toFile(output);

  console.log(`✅ ${input} → ${output}`);
}

console.log(`\n🎉 Done! Converted ${imageFiles.length} images.`);
