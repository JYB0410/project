/**
 * Claude/Grok AdSense-signal fixes:
 * 1) Remove body meta ("애드센스·검색 품질")
 * 2) Reset bulk updatedAt 2026-08-14 (diaries → publishedAt; hubs keep natural dates)
 * 3) Unify blog launch wording to 2026-05-02
 *
 * node scripts/fix-reviewer-signals.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BULK_DAY = "2026-08-14";

/** Hubs that legitimately keep a later updatedAt (not bulk recovery day). */
const HUB_UPDATED = {
  "bread-rd-night-bread-practical-guide": "2026-06-28",
  "bread-rd-series-guide": "2026-05-29",
  "baker-cert-series-roadmap": "2026-07-28",
  "why-baker-certification": "2026-05-02",
  "baker-cert-to-bread-rd": "2026-05-20"
};

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}

function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function scrubHtml(html) {
  if (!html) return html;
  let s = html;

  // Meta AdSense / search-quality language in reader content
  s = s.replace(
    /<p>애드센스·검색 품질 관점에서도[^<]*<\/p>/g,
    "<p>비슷한 설명을 여러 번 늘리기보다, 겨울·재료 결론을 이 한 장에 모았습니다.</p>"
  );
  s = s.replace(/애드센스·검색 품질 관점에서도\s*/g, "");
  s = s.replace(/애드센스[·\s]*검색\s*품질[^。.\n<]{0,80}/g, "");
  s = s.replace(/검색 품질 관점에서[^。.\n<]{0,80}/g, "");

  // Blog launch date: About uses 2026-05-02 (allow HTML tags between tokens)
  s = s.replace(
    /2026년 5월 26일(<\/strong>)?부터 본격 발행/g,
    "2026년 5월 2일$1부터 본격 발행"
  );
  s = s.replace(/블로그 기록은 2026년 5월 26일부터 발행했지만/g, "블로그 기록은 2026년 5월 2일부터 발행했지만");
  s = s.replace(
    /2026년 5월 26일 첫 발행 전까지/g,
    "2026년 5월 2일 첫 발행 전까지"
  );
  s = s.replace(/2026년 5월 26일부터/g, "2026년 5월 2일부터");
  s = s.replace(/<strong>2026년 5월 26일<\/strong>/g, "<strong>2026년 5월 2일</strong>");

  // Don't leave bulk recovery date in body
  s = s.replace(/발행 2026-06-28, 수정 2026-08-14 \(허브 재편·1~15차 반영\)\./g, "발행 2026-06-28.");
  s = s.replace(/,\s*수정 2026-08-14/g, "");
  s = s.replace(/수정 2026-08-14/g, "");

  return s;
}

function scrubItem(item) {
  if (item.summary) item.summary = scrubHtml(item.summary);
  if (item.excerpt) item.excerpt = scrubHtml(item.excerpt);
  if (item.perspective) item.perspective = scrubHtml(item.perspective);
  for (const sec of item.sections || []) {
    if (sec.content) sec.content = scrubHtml(sec.content);
  }
  for (const f of item.faq || []) {
    if (f.q) f.q = scrubHtml(f.q);
    if (f.a) f.a = scrubHtml(f.a);
  }
  for (const key of ["commonMistakes", "checklist"]) {
    if (Array.isArray(item[key])) {
      item[key] = item[key].map((x) => scrubHtml(x));
    }
  }
}

function fixUpdatedAt(item) {
  if (item.updatedAt !== BULK_DAY) return false;
  if (HUB_UPDATED[item.slug]) {
    item.updatedAt = HUB_UPDATED[item.slug];
  } else {
    item.updatedAt = item.publishedAt;
  }
  return true;
}

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

let scrubCount = 0;
let dateCount = 0;

for (const p of posts) {
  const before = JSON.stringify(p);
  scrubItem(p);
  if (JSON.stringify(p) !== before) scrubCount++;
  if (fixUpdatedAt(p)) dateCount++;
}

for (const c of columns) {
  const before = JSON.stringify(c);
  scrubItem(c);
  if (JSON.stringify(c) !== before) scrubCount++;
  if (fixUpdatedAt(c)) dateCount++;
}

// Practical guide editor-note: ensure clean final copy
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  const editor = guide.sections.find((s) => s.id === "editor-note");
  if (editor) {
    editor.content = `
<p>이 글은 일지를 대체하는 <strong>독자용 허브</strong>입니다. 차수가 늘면 표와 일곱 가지만 고치고, 실험 서사는 각 일지에 남깁니다. 비슷한 설명을 15번 반복하지 않으려는 편집입니다.</p>
<p>겨울·재료 결론을 여기로 모았습니다. 오류·보완은 <a href="../contact/">문의</a>로 받습니다. 본문이 바뀌면 수정일을 갱신합니다.</p>`;
  }
  guide.updatedAt = HUB_UPDATED["bread-rd-night-bread-practical-guide"];
}

// R&D experiment diaries: drop template chrome fields (build also skips them)
const diaryRe = /bread-rd-night-bread-v\d+|bread-rd-night-bread-mid-review/;
let slimmed = 0;
for (const p of posts) {
  if (!diaryRe.test(p.slug)) continue;
  if (p.commonMistakes?.length || p.checklist?.length || p.faq?.length) {
    p.commonMistakes = [];
    p.checklist = [];
    p.faq = [];
    slimmed++;
  }
  p.articleChrome = "diary";
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);

console.log(`✓ scrubbed items: ${scrubCount}`);
console.log(`✓ updatedAt reset from ${BULK_DAY}: ${dateCount}`);
console.log(`✓ diary chrome fields cleared: ${slimmed}`);
console.log("✓ data/posts.js, data/columns.js written");
