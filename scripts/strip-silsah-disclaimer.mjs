import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function cleanCaption(s) {
  if (!s) return s;
  return s
    .replace(/\s*[·(]\s*편집 일러스트\s*\(?실사 아님\)?/g, "")
    .replace(/\s*\(실사 아님\)/g, "")
    .replace(/집 주방 노트 편집 일러스트/g, "")
    .replace(/^편집 일러스트$/, "")
    .trim();
}

function cleanHtml(html) {
  if (!html) return html;
  let h = html;
  h = h.replace(/\s*[·]\s*편집 일러스트\s*\(?실사 아님\)?/g, "");
  h = h.replace(/\s*\(실사 아님\)/g, "");
  h = h.replace(/<p>[^<]*편집 일러스트는 실사가 아닙니다\.?\s*[^<]*<\/p>/g, (m) => {
    const rest = m
      .replace(/편집 일러스트는 실사가 아닙니다\.?\s*/, "")
      .replace(/<p>\s*/, "<p>")
      .replace(/\s*<\/p>/, "</p>");
    if (/<p>\s*<\/p>/.test(rest) || rest === "<p></p>") return "";
    return rest;
  });
  h = h.replace(/그림은 편집 일러스트입니다\.?\s*/g, "");
  h = h.replace(/실사는 없습니다\.?\s*/g, "");
  h = h.replace(/일러스트는 램프만 보여 줍니다\.?\s*/g, "");
  h = h.replace(/실험 장면은 실사처럼 꾸미지 않습니다\.?\s*/g, "");
  h = h.replace(/촬영분이 있으면 그때 올립니다\.?\s*/g, "");
  h = h.replace(/\(\s*\)/g, "");
  h = h.replace(/<p>\s*<\/p>/g, "");
  return h;
}

function walkItem(item) {
  if (item.coverCaption) {
    const c = cleanCaption(item.coverCaption);
    item.coverCaption = c || item.title || "";
  }
  for (const s of item.sections || []) {
    if (s.content) s.content = cleanHtml(s.content);
  }
}

const posts = load("data/posts.js", "POSTS_DATA");
const cols = load("data/columns.js", "COLUMNS_DATA");
posts.forEach(walkItem);
cols.forEach(walkItem);
save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", cols);

const PHOTO_OLD =
  "이 일지는 실험 당일 메모를 글로 옮긴 기록입니다. 표지는 구분용 일러스트이고, 실험 장면 실사는 올리지 않았습니다.";
const PHOTO_NEW = "이 일지는 실험 당일 메모를 글로 옮긴 기록입니다. 적용 기준은";

for (const p of posts) {
  for (const s of p.sections || []) {
    if (s.content) s.content = s.content.split(PHOTO_OLD).join("이 일지는 실험 당일 메모를 글로 옮긴 기록입니다.");
  }
}
save("data/posts.js", "POSTS_DATA", posts);

function walkJson(file) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    for (const f of fs.readdirSync(p).filter((x) => x.endsWith(".json"))) walkJson(path.join(file, f));
    return;
  }
  const data = JSON.parse(fs.readFileSync(p, "utf8"));
  const arr = Array.isArray(data) ? data : [data];
  arr.forEach(walkItem);
  fs.writeFileSync(p, JSON.stringify(Array.isArray(data) ? arr : arr[0], null, 2) + "\n");
}
walkJson("data/home-kitchen-8.json");
walkJson("data/new-posts");

const cats = load("data/categories.js", "CATEGORIES_DATA");
for (const c of cats) {
  if (c.description) {
    c.description = c.description
      .replace(/표지는 구분용 일러스트입니다\.?\s*/, "")
      .replace(/스톡 사진으로 실험을 가장하지 않습니다\.?\s*/, "");
  }
}
save("data/categories.js", "CATEGORIES_DATA", cats);

console.log("stripped silsa disclaimers");
console.log(
  "remain",
  (JSON.stringify(posts) + JSON.stringify(cols)).match(/실사 아님|실사가 아닙니다|실사는 없/g) || []
);
