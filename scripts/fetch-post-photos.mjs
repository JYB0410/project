/** 단일 글 사진 다운로드: node scripts/fetch-post-photos.mjs <slug> [sectionId...] */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pickPhotoId, pexelsUrl } from "./photo-library.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const sections = process.argv.slice(3);
if (!slug || !sections.length) {
  console.error("Usage: node scripts/fetch-post-photos.mjs <slug> <sectionId>...");
  process.exit(1);
}

for (const id of sections) {
  const dir = path.join(ROOT, "assets/images/photos", slug);
  fs.mkdirSync(dir, { recursive: true });
  const fp = path.join(dir, `${id}.jpg`);
  const photoId = pickPhotoId(slug, id, id);
  const res = await fetch(pexelsUrl(photoId), { redirect: "follow" });
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(fp, buf);
  console.log(`✓ ${slug}/${id}.jpg (${Math.round(buf.length / 1024)}KB)`);
}