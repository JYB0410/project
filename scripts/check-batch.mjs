import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posts = JSON.parse(fs.readFileSync(path.join(ROOT, "data/posts-batch.json"), "utf8"));
for (const p of posts) {
  console.log(p.slug, postCharCount(p));
}