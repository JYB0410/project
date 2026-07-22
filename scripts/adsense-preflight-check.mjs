/**
 * AdSense 프리플라이트: 내부 링크·sitemap·필수 페이지 최종 점검
 * 사용: node scripts/adsense-preflight-check.mjs
 * 종료 코드: 문제 있으면 1
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const warnings = [];
const ok = [];

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const config = load("data/site.config.js", "SITE_CONFIG");
const posts = load("data/posts.js", "POSTS_DATA").filter((p) => p.status !== "draft");
const columns = load("data/columns.js", "COLUMNS_DATA").filter((c) => c.status !== "draft");
const postSlugs = new Set(posts.map((p) => p.slug));
const colSlugs = new Set(columns.map((c) => c.slug));

// --- sitemap ---
const sitemapPath = path.join(ROOT, "sitemap.xml");
if (!exists("sitemap.xml")) {
  issues.push("sitemap.xml 없음");
} else {
  const sm = fs.readFileSync(sitemapPath, "utf8");
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok.push(`sitemap.xml URL ${locs.length}개`);

  for (const p of posts) {
    const needle = `/posts/${p.slug}.html`;
    if (!sm.includes(needle)) issues.push(`sitemap 누락 post: ${p.slug}`);
  }
  for (const c of columns) {
    const needle = `/columns/${c.slug}.html`;
    if (!sm.includes(needle)) issues.push(`sitemap 누락 column: ${c.slug}`);
  }
  for (const page of ["about/", "author/", "contact/", "privacy/", "terms/", "disclaimer/", "categories/", "columns/"]) {
    if (!sm.includes(`/${page}`) && !sm.includes(`/${page.replace(/\/$/, "")}`)) {
      // flexible
      if (!locs.some((u) => u.includes(page.replace(/\/$/, "")))) {
        warnings.push(`sitemap에 정책/목록 페이지 확인 권장: ${page}`);
      }
    }
  }
  if (!sm.includes(config.siteUrl || "bcstarts.org")) {
    warnings.push("sitemap base URL이 site.config.siteUrl과 다를 수 있음");
  }
}

// --- prerender HTML exists ---
for (const p of posts) {
  const rel = `posts/${p.slug}.html`;
  if (!exists(rel)) issues.push(`프리렌더 HTML 없음: ${rel}`);
}
for (const c of columns) {
  const rel = `columns/${c.slug}.html`;
  if (!exists(rel)) issues.push(`프리렌더 HTML 없음: ${rel}`);
}
if (!issues.some((i) => i.includes("프리렌더"))) ok.push(`프리렌더 post ${posts.length} + column ${columns.length}`);

// --- relatedSlugs integrity ---
let brokenRelated = 0;
for (const p of posts) {
  for (const rel of p.relatedSlugs || []) {
    if (!postSlugs.has(rel)) {
      issues.push(`${p.slug}: relatedSlugs 없음 → ${rel}`);
      brokenRelated++;
    }
  }
}
for (const c of columns) {
  for (const rel of c.relatedSlugs || []) {
    if (!postSlugs.has(rel) && !colSlugs.has(rel)) {
      // columns may link to posts only
      if (!postSlugs.has(rel)) {
        warnings.push(`${c.slug}: relatedSlugs 확인 → ${rel}`);
      }
    }
  }
}
if (!brokenRelated) ok.push("posts relatedSlugs 유효");

// --- internal hrefs in section HTML ---
const hrefRe = /href="([^"#?]+)(?:[?#][^"]*)?"/g;
function checkHtmlLinks(label, html, baseDir) {
  let m;
  const re = new RegExp(hrefRe.source, "g");
  while ((m = re.exec(html))) {
    let href = m[1];
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("//")) continue;
    // normalize
    let target;
    if (href.startsWith("../")) {
      target = path.normalize(path.join(baseDir, href)).replace(/\\/g, "/");
      // strip leading drive or absolute root relative to ROOT
      const relFromRoot = path.relative(ROOT, path.resolve(ROOT, baseDir, href)).replace(/\\/g, "/");
      target = relFromRoot;
    } else if (href.startsWith("/")) {
      target = href.replace(/^\//, "");
    } else {
      target = path.posix.join(baseDir, href);
    }
    // directory links → index.html
    if (target.endsWith("/")) target += "index.html";
    if (!target.includes(".") && !target.endsWith("index.html")) {
      // bare path like about/ already handled
    }
    if (target.startsWith("..")) continue;
    if (!exists(target) && !exists(target.replace(/^\.\//, ""))) {
      // try without posts/ prefix confusion
      const alt = target.replace(/^posts\//, "posts/");
      if (!exists(alt)) {
        issues.push(`${label}: 깨진 링크 → ${href} (resolve: ${target})`);
      }
    }
  }
}

for (const p of posts) {
  const html = (p.sections || []).map((s) => s.content || "").join("\n");
  checkHtmlLinks(`post:${p.slug}`, html, "posts");
}
for (const c of columns) {
  const html = (c.sections || []).map((s) => s.content || "").join("\n");
  checkHtmlLinks(`column:${c.slug}`, html, "columns");
}

// sample prerendered files
for (const sample of ["index.html", "about/index.html", "author/index.html", "posts/bread-rd-night-bread-practical-guide.html"]) {
  if (!exists(sample)) {
    issues.push(`파일 없음: ${sample}`);
    continue;
  }
  const html = fs.readFileSync(path.join(ROOT, sample), "utf8");
  checkHtmlLinks(sample, html, path.dirname(sample) === "." ? "" : path.dirname(sample).replace(/\\/g, "/"));
}
ok.push("내부 링크 스캔 완료");

// --- E-E-A-T static signals ---
const about = fs.readFileSync(path.join(ROOT, "about/index.html"), "utf8");
const author = fs.readFileSync(path.join(ROOT, "author/index.html"), "utf8");
if (!about.includes("누가 쓰나") && !about.includes("경험 근거")) {
  warnings.push("about: E-E-A-T 섹션 문구 확인");
} else ok.push("about: E-E-A-T 섹션 있음");
if (!author.includes("Experience") && !author.includes("경험")) {
  warnings.push("author: 경험 섹션 확인");
} else ok.push("author: 경험 섹션 있음");
if (!config.ownerExperience || config.ownerExperience.length < 80) {
  warnings.push("site.config ownerExperience 짧음");
} else ok.push("site.config ownerExperience 보강됨");

// --- adsense core ---
for (const f of ["ads.txt", "privacy/index.html", "contact/index.html"]) {
  if (!exists(f)) issues.push(`필수 파일 없음: ${f}`);
}
if (exists("ads.txt") && !fs.readFileSync(path.join(ROOT, "ads.txt"), "utf8").includes("google.com")) {
  issues.push("ads.txt에 google.com 없음");
} else if (exists("ads.txt")) ok.push("ads.txt google.com");

// --- diversify markers on 3 posts ---
const diversifySlugs = [
  "why-baker-certification",
  "bread-rd-series-guide",
  "bread-rd-night-bread-practical-guide"
];
for (const slug of diversifySlugs) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) {
    issues.push(`대표 글 없음: ${slug}`);
    continue;
  }
  const joined = (p.sections || []).map((s) => s.title + s.content).join(" ");
  if (!joined.includes("section-lead") && slug !== "why-baker-certification") {
    // after diversify script should have section-lead
  }
  if (joined.includes("section-lead") || (p.sections[0] && p.sections[0].title && p.sections[0].title.length > 5)) {
    ok.push(`대표 글 존재: ${slug}`);
  }
}

// report
console.log("=== PASS ===");
ok.forEach((m) => console.log(" ✓", m));
if (warnings.length) {
  console.log("\n=== WARN ===");
  warnings.forEach((m) => console.log(" !", m));
}
if (issues.length) {
  console.log("\n=== FAIL ===");
  issues.forEach((m) => console.log(" ×", m));
}

const summary = {
  ok: issues.length === 0,
  passed: ok.length,
  warnings: warnings.length,
  issues: issues.length,
  errors: issues,
  warns: warnings
};
fs.writeFileSync(path.join(ROOT, "adsense-preflight-report.json"), JSON.stringify(summary, null, 2));
console.log("\n→ adsense-preflight-report.json");
console.log(summary.ok ? "\nPREFLIGHT OK" : "\nPREFLIGHT FAILED");
process.exit(summary.ok ? 0 : 1);
