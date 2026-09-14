import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const incoming = JSON.parse(fs.readFileSync(path.join(ROOT, "data/home-kitchen-8.json"), "utf8"));
const posts = load("data/posts.js", "POSTS_DATA");
const cats = load("data/categories.js", "CATEGORIES_DATA");

const cat = cats.find((c) => c.slug === "home-kitchen-notes");
if (cat) {
  cat.description =
    "집 오븐·작업대·난방·창가·식힘처럼 손이 머무는 공간을 10편으로 적습니다. 완성 레시피가 아닙니다. 1·2편(작업대·난방)부터 읽고, 오븐·도구 칼럼과 함께 보면 됩니다.";
}

const p1 = posts.find((p) => p.slug === "kitchen-bench-timer-place");
const p2 = posts.find((p) => p.slug === "heating-on-fermentation-home");
if (p1 && !p1.title.startsWith("1편")) p1.title = `1편. ${p1.title}`;
if (p2 && !p2.title.startsWith("2편")) p2.title = `2편. ${p2.title}`;

for (const raw of incoming) {
  const n = postCharCount(raw);
  if (n < 2000) {
    console.error("short", raw.slug, n);
    process.exit(1);
  }
  const idx = posts.findIndex((p) => p.slug === raw.slug);
  if (idx >= 0) {
    posts[idx] = raw;
    console.log("replace", raw.slug, n);
    continue;
  }
  console.log("add", raw.slug, n);
  posts.push(raw);
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/categories.js", "CATEGORIES_DATA", cats);
console.log("kitchen total", posts.filter((p) => p.category === "home-kitchen-notes").length);
