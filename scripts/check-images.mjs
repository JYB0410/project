import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isValidImageBuffer } from "./photo-library.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8");
const posts = Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();

const issues = [];
for (const p of posts) {
  for (const s of p.sections) {
    const figures = [...s.content.matchAll(/src="([^"]+)"/g)];
    for (const [, src] of figures) {
      const fp = path.join(ROOT, src.replace(/^\.\.\//, ""));
      if (!fs.existsSync(fp)) {
        issues.push({ slug: p.slug, sec: s.id, fp, reason: "missing" });
        continue;
      }
      const buf = fs.readFileSync(fp);
      if (!isValidImageBuffer(buf)) {
        issues.push({ slug: p.slug, sec: s.id, fp, reason: "invalid", size: buf.length });
      }
    }
  }
}

for (const i of issues) {
  console.log(i.reason, i.size ?? "", i.slug, i.sec, path.basename(i.fp));
}
console.log("\ntotal:", issues.length);