import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";
import { columnCharCount } from "./column-char-count.mjs";
import { MIN_CHARS } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadPosts() {
  const code = fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

function loadColumns() {
  const code = fs.readFileSync(path.join(ROOT, "data/columns.js"), "utf8");
  return Function(`return (${code.replace("window.COLUMNS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

let posts = loadPosts();
let columns = loadColumns();

const postBatch = JSON.parse(fs.readFileSync(path.join(ROOT, "data/posts-value-batch.json"), "utf8"));
for (const p of postBatch) {
  const n = postCharCount(p);
  if (n < MIN_CHARS) {
    console.error(`FAIL post ${p.slug}: ${n}`);
    process.exit(1);
  }
  console.log(`OK post ${p.slug}: ${n}`);
  if (posts.some((x) => x.slug === p.slug)) posts = posts.map((x) => (x.slug === p.slug ? p : x));
  else posts.push(p);
}

const colBatch = JSON.parse(fs.readFileSync(path.join(ROOT, "data/columns-batch.json"), "utf8"));
for (const c of colBatch) {
  const n = columnCharCount(c);
  if (n < MIN_CHARS) {
    console.error(`FAIL column ${c.slug}: ${n}`);
    process.exit(1);
  }
  console.log(`OK column ${c.slug}: ${n}`);
  if (columns.some((x) => x.slug === c.slug)) columns = columns.map((x) => (x.slug === c.slug ? c : x));
  else columns.push(c);
}

// R&D 안내 — 실전 정리·9차 링크
const rdGuide = posts.find((p) => p.slug === "bread-rd-series-guide");
if (rdGuide) {
  rdGuide.excerpt =
    "밤식빵 R&D 1~9차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  rdGuide.summary =
    "밤식빵 R&D 일지·실전 정리·9차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  rdGuide.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v9",
    "baker-cert-to-bread-rd"
  ];
  for (const s of rdGuide.sections) {
    if (s.id === "one-variable") {
      if (!s.content.includes("bread-rd-night-bread-practical-guide")) {
        s.content = s.content.replace(
          "</ol><p>시간이 부족하면",
          "<li><a href=\"bread-rd-night-bread-practical-guide.html\">실전 정리</a> — 1~8차에서 집에 쓸 수 있는 7가지 (일지 전에 읽어도 됨)</li><li><a href=\"bread-rd-night-bread-v9.html\">9차</a> — 겨울 재현</li></ol><p>시간이 부족하면"
        );
      }
      if (!s.content.includes("실전 정리")) {
        s.content = s.content.replace(
          "<li><a href=\"bread-rd-night-bread-v8.html\">8차</a>",
          "<li><a href=\"bread-rd-night-bread-practical-guide.html\">실전 정리</a> — 1~8차 원칙·고정값</li><li><a href=\"bread-rd-night-bread-v8.html\">8차</a>"
        );
      }
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        "이후에는 겨울 재현·밤 선별·보관 비교 등이 후보로 남아 있으며",
        "<a href=\"bread-rd-night-bread-v9.html\">9차 겨울 재현</a>과 <a href=\"bread-rd-night-bread-practical-guide.html\">실전 정리</a>를 발행했습니다. 이후에는 밤 선별·보관 비교 등이 후보로 남아 있으며"
      );
    }
    if (s.id === "goal") {
      s.content = s.content.replace(
        "일지 한 편마다",
        "일지와 <a href=\"bread-rd-night-bread-practical-guide.html\">실전 정리</a>는 역할이 다릅니다. 일지 한 편마다"
      );
    }
  }
}

// 기능사 목차 — 한 장 요약 링크
const roadmap = posts.find((p) => p.slug === "baker-cert-series-roadmap");
if (roadmap) {
  roadmap.relatedSlugs = [
    "baker-cert-one-page-cheatsheet",
    "why-baker-certification",
    "baker-cert-8month-roadmap",
    "baker-cert-to-bread-rd"
  ];
  for (const s of roadmap.sections) {
    if (s.id === "how-to-read") {
      s.content = s.content.replace(
        "<p><strong>일정이 급한 분</strong>",
        "<p><strong>한눈에만 보기</strong>: <a href=\"baker-cert-one-page-cheatsheet.html\">제빵기능사 한 장 요약</a></p><p><strong>일정이 급한 분</strong>"
      );
    }
  }
}

// v8 editor — 실전 정리 링크
const v8 = posts.find((p) => p.slug === "bread-rd-night-bread-v8");
if (v8) {
  v8.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v9",
    "bread-rd-night-bread-v7"
  ];
}

posts.sort((a, b) => {
  const da = new Date(a.publishedAt).getTime();
  const db = new Date(b.publishedAt).getTime();
  if (da !== db) return da - db;
  return a.slug.localeCompare(b.slug);
});

columns.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

fs.writeFileSync(path.join(ROOT, "data/posts.js"), `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);
fs.writeFileSync(path.join(ROOT, "data/columns.js"), `window.COLUMNS_DATA = ${JSON.stringify(columns, null, 2)};\n`);
console.log("Merged posts:", posts.length, "columns:", columns.length);