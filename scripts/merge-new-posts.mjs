import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function loadPosts() {
  const code = fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8");
  const expr = code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

const newPosts = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data/posts-batch.json"), "utf8")
);

let posts = loadPosts();
for (const p of newPosts) {
  const n = postCharCount(p);
  if (n < 2000) {
    console.error(`${p.slug}: ${n} chars (FAIL)`);
    process.exit(1);
  }
  console.log(`${p.slug}: ${n} chars OK`);
  if (posts.some((x) => x.slug === p.slug)) {
    posts = posts.map((x) => (x.slug === p.slug ? p : x));
  } else {
    posts.push(p);
  }
}

// Update roadmap series-list markers
const roadmap = posts.find((p) => p.slug === "baker-cert-series-roadmap");
if (roadmap) {
  const links = [
    ["3", "baker-cert-practical-mistakes", "실기 — 처음 망한 것과 반복한 연습"],
    ["4", "baker-cert-written-tips", "필기 — 암기보다 실수하기 쉬운 포인트"],
    ["5", "baker-cert-exam-day-pass", "시험 당일과 합격 — 2025년 5월"],
    ["6", "baker-cert-to-bread-rd", "기능사 이후, 내가 빵을 연구하는 방식"]
  ];
  for (const [, slug, title] of links) {
    const re = new RegExp(
      `<li><strong>${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</strong> <em>\\(예정\\)</em>`,
      "g"
    );
    roadmap.sections = roadmap.sections.map((s) => {
      if (s.id !== "series-list") return s;
      return {
        ...s,
        content: s.content.replace(
          re,
          `<li><strong>${title}</strong> <em>(발행)</em> — <a href="${slug}.html">바로 읽기</a>`
        )
      };
    });
  }
  roadmap.relatedSlugs = [
    "why-baker-certification",
    "baker-cert-8month-roadmap",
    "baker-cert-practical-mistakes",
    "baker-cert-written-tips",
    "baker-cert-exam-day-pass",
    "baker-cert-to-bread-rd"
  ];
  roadmap.excerpt = roadmap.excerpt.replace(
    "1~2편 발행, 3~6편 순차 예정",
    "6편 모두 발행"
  );
  roadmap.summary = roadmap.summary.replace(
    "1~2편 발행, 3~6편 예정",
    "6편 모두 발행"
  );
  for (const s of roadmap.sections) {
    if (s.id === "practice-notes") {
      s.content = s.content
        .replace(/3~6편은 실기·필기·시험 당일·R&D 연결을 더 촘촘히 다룰 예정입니다\. 발행 간격은 일정에 맞춰 조금씩 두되, 내용이 준비된 뒤에만 올립니다\./, "3~6편은 실기·필기·시험 당일·R&D 연결을 모두 발행했습니다.")
        .replace(/3~6편은 준비되는 대로 같은 카테고리에 추가하며/, "3~6편은 같은 카테고리에 모두 올려 두었으며");
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        "3~6편은 준비되는 대로 같은 카테고리에 추가하며",
        "3~6편은 같은 카테고리에 모두 올려 두었으며"
      );
    }
  }
}

// Update cross-links on earlier posts
const p2 = posts.find((p) => p.slug === "baker-cert-8month-roadmap");
if (p2) {
  p2.relatedSlugs = [
    "why-baker-certification",
    "baker-cert-series-roadmap",
    "baker-cert-practical-mistakes"
  ];
  for (const s of p2.sections) {
    if (s.id === "for-readers" || s.id === "practice-notes" || s.id === "editor-note") {
      s.content = s.content
        .replace(/3편\(예정\)/g, "<a href=\"baker-cert-practical-mistakes.html\">3편</a>")
        .replace(/다음 편\(예정\)에서는 실기에서 처음 망한 포인트를 품목별로 풀어 쓰겠습니다/, "다음 편 <a href=\"baker-cert-practical-mistakes.html\">실기 — 처음 망한 것과 반복한 연습</a>에서 망한 포인트를 풀어 썼습니다")
        .replace(/3편\(예정\)에서 실기 망한 포인트를 품목별로 더 촘촘히 적겠습니다/, "<a href=\"baker-cert-practical-mistakes.html\">3편</a>에서 실기 망한 포인트를 더 촘촘히 적었습니다");
    }
  }
}
const p1 = posts.find((p) => p.slug === "why-baker-certification");
if (p1) {
  p1.relatedSlugs = [
    "baker-cert-series-roadmap",
    "baker-cert-8month-roadmap",
    "baker-cert-to-bread-rd"
  ];
}

const out = "window.POSTS_DATA = " + JSON.stringify(posts, null, 2) + ";\n";
fs.writeFileSync(path.join(ROOT, "data/posts.js"), out);
console.log("Merged", newPosts.length, "posts. Total:", posts.length);