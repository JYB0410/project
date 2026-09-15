import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(ROOT, "data/new-posts");
function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const incoming = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));

const posts = load("data/posts.js", "POSTS_DATA");
for (const raw of incoming) {
  const n = postCharCount(raw);
  console.log(raw.slug, n, raw.category, raw.publishedAt);
  const idx = posts.findIndex((p) => p.slug === raw.slug);
  if (idx >= 0) {
    posts[idx] = raw;
    console.log("replace", raw.slug);
    continue;
  }
  const min = raw.category === "home-kitchen-notes" ? 280 : 1100;
  if (n < min) {
    console.error("short", raw.slug, n, "need", min);
    process.exit(1);
  }
  posts.push(raw);
}
save("data/posts.js", "POSTS_DATA", posts);
console.log("total", posts.length);
