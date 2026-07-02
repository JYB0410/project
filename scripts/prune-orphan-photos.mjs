/** posts.js에 없는 사진 파일 삭제 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posts = Function(
  `return (${fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8").replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const referenced = new Set();
for (const post of posts) {
  for (const sec of post.sections) {
    const matches = sec.content?.match(/photos\/[^"']+\.jpg/g) || [];
    for (const m of matches) referenced.add(m.replace(/^photos\//, ""));
  }
}

let removed = 0;
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".jpg")) {
      const rel = path.relative(path.join(ROOT, "assets/images/photos"), full).replace(/\\/g, "/");
      if (!referenced.has(rel)) {
        fs.unlinkSync(full);
        removed++;
        console.log(`  삭제: ${rel.replace(/\\/g, "/")}`);
      }
    }
  }
}

walk(path.join(ROOT, "assets/images/photos"));
console.log(`\n고아 사진 ${removed}개 삭제 (참조 ${referenced.size}개 유지)`);