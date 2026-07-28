/**
 * 발행일을 AdSense용으로 띄엄띄엄 재배치 (시리즈 순서 유지, 오늘 이전)
 * node scripts/redistribute-publish-dates.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-07-28";

/**
 * 콘텐츠 논리 순서 + 균일 3일 간격 (2026-05-02 ~ 2026-07-28)
 * 같은 날 0건, 최소 간격 3일, 최신 글은 오늘
 */
const SCHEDULE = [
  ["why-baker-certification", "2026-05-02", "post"],
  ["baker-cert-series-roadmap", "2026-05-05", "post"],
  ["baker-cert-8month-roadmap", "2026-05-08", "post"],
  ["baker-cert-practical-mistakes", "2026-05-11", "post"],
  ["baker-cert-written-tips", "2026-05-14", "post"],
  ["baker-cert-exam-day-pass", "2026-05-17", "post"],
  ["baker-cert-to-bread-rd", "2026-05-20", "post"],
  ["quit-job-weekly-routine", "2026-05-23", "column"],
  ["bread-rd-night-bread-v1", "2026-05-26", "post"],
  ["bread-rd-series-guide", "2026-05-29", "post"],
  ["bread-rd-night-bread-v2", "2026-06-01", "post"],
  ["bread-rd-night-bread-v3", "2026-06-04", "post"],
  ["bread-rd-night-bread-v4", "2026-06-07", "post"],
  ["bread-rd-night-bread-v5", "2026-06-10", "post"],
  ["bread-rd-night-bread-mid-review", "2026-06-13", "post"],
  ["month-after-pass-before-rd", "2026-06-16", "column"],
  ["bread-rd-night-bread-v6", "2026-06-19", "post"],
  ["bread-rd-night-bread-v7", "2026-06-22", "post"],
  ["bread-rd-night-bread-v8", "2026-06-25", "post"],
  ["bread-rd-night-bread-practical-guide", "2026-06-28", "post"],
  ["baker-cert-one-page-cheatsheet", "2026-07-01", "post"],
  ["sharing-failed-bread", "2026-07-04", "column"],
  ["bread-rd-night-bread-v9", "2026-07-07", "post"],
  ["lab-notes-to-blog", "2026-07-10", "column"],
  ["bread-rd-night-bread-v10", "2026-07-13", "post"],
  ["why-no-complete-recipe", "2026-07-16", "column"],
  ["bread-rd-night-bread-v11", "2026-07-19", "post"],
  ["home-oven-temperature-notes", "2026-07-22", "column"],
  ["bread-rd-night-bread-v12", "2026-07-25", "post"],
  ["bread-rd-night-bread-v13", "2026-07-28", "post"]
];

/** 정리·목차 글: 최신 일지 반영 시 updatedAt만 오늘 근처 */
const LIVING_DOCS = new Set([
  "bread-rd-series-guide",
  "bread-rd-night-bread-practical-guide",
  "baker-cert-series-roadmap"
]);

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}

function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function patchBodyDates(item, pub) {
  if (!item.sections) return;
  for (const s of item.sections) {
    if (!s.content) continue;
    // 발행 2026-06-29 / 발행일 2026-06-29
    s.content = s.content.replace(/발행\s*20\d{2}-\d{2}-\d{2}/g, `발행 ${pub}`);
    s.content = s.content.replace(/발행일\s*20\d{2}-\d{2}-\d{2}/g, `발행일 ${pub}`);
    // 수정 2026-07-09(13차… keep note but fix bare 수정 ISO if alone
    s.content = s.content.replace(
      /발행\s*2026-\d{2}-\d{2},\s*수정\s*2026-\d{2}-\d{2}/g,
      `발행 ${pub}, 수정 ${item.updatedAt || pub}`
    );
  }
}

const bySlug = Object.fromEntries(SCHEDULE.map(([slug, pub, kind]) => [slug, { pub, kind }]));

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

const scheduledPost = new Set(SCHEDULE.filter((x) => x[2] === "post").map((x) => x[0]));
const scheduledCol = new Set(SCHEDULE.filter((x) => x[2] === "column").map((x) => x[0]));

for (const p of posts) {
  if (!bySlug[p.slug]) {
    console.warn("unscheduled post", p.slug);
    continue;
  }
  const { pub } = bySlug[p.slug];
  const oldPub = p.publishedAt;
  p.publishedAt = pub;
  if (LIVING_DOCS.has(p.slug)) {
    // 살아 있는 정리 글: 발행은 시리즈 중간, 수정은 최신 반영일
    p.updatedAt = TODAY;
  } else {
    p.updatedAt = pub;
  }
  patchBodyDates(p, pub);
  console.log(`post ${p.slug}: ${oldPub} → ${pub} (upd ${p.updatedAt})`);
}

for (const c of columns) {
  if (!bySlug[c.slug]) {
    console.warn("unscheduled column", c.slug);
    continue;
  }
  const { pub } = bySlug[c.slug];
  const oldPub = c.publishedAt;
  c.publishedAt = pub;
  c.updatedAt = pub;
  patchBodyDates(c, pub);
  console.log(`col  ${c.slug}: ${oldPub} → ${pub}`);
}

// about timeline first publish
const aboutPath = path.join(ROOT, "about/index.html");
let about = fs.readFileSync(aboutPath, "utf8");
about = about.replace(
  /글 발행은 <strong>2026년 5월 26일<\/strong>부터 시작했으며/,
  `글 발행은 <strong>2026년 5월 2일</strong>부터 시작했으며`
);
about = about.replace(
  /<li><strong>2026년 5월 26일 ~<\/strong> — 블로그 기록 본격 발행<\/li>/,
  `<li><strong>2026년 5월 2일 ~</strong> — 블로그 기록 본격 발행</li>`
);
fs.writeFileSync(aboutPath, about);

// gaps check
const allDates = SCHEDULE.map((x) => x[1]).sort();
let minGap = Infinity;
for (let i = 1; i < allDates.length; i++) {
  if (allDates[i] === allDates[i - 1]) {
    console.error("DUP DATE", allDates[i]);
    process.exit(1);
  }
  const gap = (new Date(allDates[i]) - new Date(allDates[i - 1])) / 86400000;
  minGap = Math.min(minGap, gap);
  if (allDates[i] > TODAY) {
    console.error("FUTURE", allDates[i]);
    process.exit(1);
  }
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);

console.log("\n---");
console.log(`scheduled ${SCHEDULE.length} items, min gap ${minGap} day(s), range ${allDates[0]} ~ ${allDates[allDates.length - 1]}`);
console.log("✓ posts.js + columns.js + about timeline");
