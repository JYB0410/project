import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posts = Function(
  `return (${fs
    .readFileSync(path.join(ROOT, "data/posts.js"), "utf8")
    .replace("window.POSTS_DATA = ", "")
    .replace(/;\s*$/, "")})`
)();
const postFiles = new Set(posts.map((p) => `${p.slug}.html`));

let code = fs.readFileSync(path.join(ROOT, "data/columns.js"), "utf8");
let n = 0;

// JSON-escaped: href=\"slug.html\"
code = code.replace(/href=\\"([a-z0-9-]+\.html)\\"/g, (full, file) => {
  if (!postFiles.has(file)) return full;
  n++;
  return `href=\\"../posts/${file}\\"`;
});

fs.writeFileSync(path.join(ROOT, "data/columns.js"), code);
console.log(`fixed ${n} column→post links`);
