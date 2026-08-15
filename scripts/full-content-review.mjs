/**
 * 전 글 본문 품질 스캔 (심사관 관점 체크리스트)
 * node scripts/full-content-review.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}

const plain = (html) =>
  (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");
const slugs = new Set(posts.map((p) => p.slug));

const BAD_META = /애드센스|AdSense 심사|검색 품질|승인 통과|저품질|트래픽 조작|키워드 밀도/i;
const RECIPE_DUMP = /재료\s*[:：].{0,40}\d+\s*g|밀가루\s*\d{2,4}\s*g|이스트\s*\d+\s*g|물\s*\d{2,4}\s*g/i;
const MEDICAL = /치료|처방|완치|다이어트 효과 보장|수익 보장|투자/;
const GENERIC = /많은 사람들이|일반적으로 알려져|필수적으로 알아야|이번 포스팅에서는|오늘은 .+에 대해 알아/i;

const report = { posts: [], columns: [], summary: { fail: 0, warn: 0, ok: 0 } };

function reviewItem(item, kind) {
  const issues = [];
  const warns = [];
  const allHtml = (item.sections || []).map((s) => s.content || "").join("\n");
  const allPlain = plain(allHtml);
  const n = postCharCount(item);
  const secs = item.sections || [];

  if (n < 2000) issues.push(`chars ${n} < 2000`);
  if (!item.excerpt?.trim()) issues.push("no excerpt");
  if (!item.summary?.trim()) issues.push("no summary");
  if (BAD_META.test(allPlain) || BAD_META.test(item.excerpt || "") || BAD_META.test(item.summary || "")) {
    issues.push("meta/adsense language in reader content");
  }
  if (RECIPE_DUMP.test(allPlain)) warns.push("possible gram recipe dump");
  if (MEDICAL.test(allPlain)) warns.push("medical/guarantee-ish wording");
  if (GENERIC.test(allPlain)) warns.push("generic blog opener tone");

  // empty / very short sections
  for (const s of secs) {
    const pc = plain(s.content).replace(/\s/g, "").length;
    if (pc < 40) issues.push(`thin section ${s.id}:${pc}`);
  }

  // internal .html links
  const linkRe = /href="(?:\.\.\/posts\/)?([a-z0-9-]+)\.html"/g;
  let m;
  while ((m = linkRe.exec(allHtml))) {
    if (!slugs.has(m[1]) && !m[1].startsWith("http")) {
      // columns link to posts with ../posts/
      if (!slugs.has(m[1])) warns.push(`link target? ${m[1]}`);
    }
  }
  // columns paths
  const colLink = /href="(?:\.\.\/)?columns\/([a-z0-9-]+)\.html"/g;
  const colSlugs = new Set(columns.map((c) => c.slug));
  while ((m = colLink.exec(allHtml))) {
    if (!colSlugs.has(m[1])) issues.push(`broken column link ${m[1]}`);
  }

  // diary-specific
  if (/night-bread-v\d+|mid-review/.test(item.slug || "")) {
    if (/photos\/bread-rd-night-bread/.test(allHtml)) issues.push("diary still has stock photo path");
    if (!allHtml.includes("practical-guide")) issues.push("diary missing guide link");
    if (!allHtml.includes("role-banner") && item.slug !== "bread-rd-night-bread-mid-review") {
      // mid-review has role-banner too
      if (!allHtml.includes("이 글의 역할")) warns.push("diary missing role banner");
    }
  }

  // related
  for (const r of item.relatedSlugs || []) {
    if (!slugs.has(r)) issues.push(`bad related ${r}`);
  }

  // sentence repetition: same 40-char window twice
  const sentences = allPlain.split(/[.。!?]\s+/).filter((s) => s.length > 35);
  const seen = new Map();
  for (const s of sentences) {
    const key = s.slice(0, 48);
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  const dups = [...seen.entries()].filter(([, c]) => c >= 2).slice(0, 3);
  if (dups.length) warns.push(`repeated sentences ~${dups.length}`);

  // experience markers
  const hasYear = /2024|2025|2026/.test(allPlain);
  const hasI = /저는|제가|제가 |제가|제 기준|직접/.test(allPlain);
  if (!hasYear) warns.push("no year anchor");
  if (!hasI) warns.push("weak first-person");

  // stock figure count
  const figs = (allHtml.match(/article-figure/g) || []).length;
  const stockPhotos = (allHtml.match(/photos\/[^"']+\.jpg/g) || []).length;

  const row = {
    kind,
    slug: item.slug,
    category: item.category || "column",
    chars: n,
    sections: secs.length,
    figures: figs,
    stockJpg: stockPhotos,
    issues,
    warns,
    score: issues.length ? "FAIL" : warns.length ? "WARN" : "OK"
  };
  if (issues.length) report.summary.fail++;
  else if (warns.length) report.summary.warn++;
  else report.summary.ok++;
  return row;
}

for (const p of posts) report.posts.push(reviewItem(p, "post"));
for (const c of columns) report.columns.push(reviewItem(c, "column"));

// cross-site gaps
const gaps = [];
const allText = posts.map((p) => JSON.stringify(p)).join("\n");
if (!allText.includes("exam-item-white-bread") && posts.some((p) => p.slug?.includes("exam-item"))) {
  // check why baker links to exam items
}
const why = posts.find((p) => p.slug === "why-baker-certification");
if (why && !JSON.stringify(why).includes("exam-item")) {
  gaps.push("why-baker-certification: no link to exam-item-notes");
}
const series = posts.find((p) => p.slug === "baker-cert-series-roadmap");
if (series && !JSON.stringify(series).includes("exam-item")) {
  gaps.push("baker-cert-series-roadmap: no link to exam-item-notes");
}
const cheatsheet = posts.find((p) => p.slug === "baker-cert-one-page-cheatsheet");
if (cheatsheet && !JSON.stringify(cheatsheet).includes("exam-item")) {
  gaps.push("cheatsheet: no exam-item link");
}

const cfg = fs.readFileSync(path.join(ROOT, "data/site.config.js"), "utf8");
if (cfg.includes("실패 사진") && cfg.includes("스톡 사진으로 실험을 가장")) {
  gaps.push("site.config: ownerExpertise still says 실패 사진 vs stock policy");
}

report.siteGaps = gaps;
report.fails = [...report.posts, ...report.columns].filter((r) => r.score === "FAIL");
report.warns = [...report.posts, ...report.columns].filter((r) => r.score === "WARN");

fs.writeFileSync(path.join(ROOT, "full-content-review-report.json"), JSON.stringify(report, null, 2));
console.log("=== SUMMARY ===");
console.log(report.summary);
console.log("siteGaps:", gaps);
console.log("\n=== FAIL ===");
for (const r of report.fails) console.log(r.slug, r.issues.join("; "));
console.log("\n=== WARN (sample) ===");
for (const r of report.warns.slice(0, 25)) console.log(r.slug, r.warns.join("; "));
console.log("\n→ full-content-review-report.json");
