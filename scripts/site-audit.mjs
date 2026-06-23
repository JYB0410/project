/**
 * 사이트 종합 검수: 콘텐츠·날짜·HTML·sitemap·구조
 * 사용: node scripts/site-audit.mjs [--cycle N]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS, postCharCount } from "./content-char-count.mjs";
import { columnCharCount } from "./column-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cycle = Number(process.argv.find((a) => a.startsWith("--cycle="))?.split("=")[1] || 0);

const load = (f, v) =>
  Function(`return (${fs.readFileSync(path.join(ROOT, f), "utf8").replace(`window.${v} = `, "").replace(/;\s*$/, "")})`)();

const config = load("data/site.config.js", "SITE_CONFIG");
const categories = load("data/categories.js", "CATEGORIES_DATA");
const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

const issues = [];
const warnings = [];

function issue(msg, fixable = true) {
  issues.push({ level: "error", msg, fixable });
}
function warn(msg) {
  warnings.push({ level: "warn", msg });
}

const editorDup = "글을 읽으며 '우리 집은 어디까지 하고 있지?'";

// --- 콘텐츠 분량·FAQ ---
for (const p of posts) {
  const chars = postCharCount(p);
  if (chars < MIN_CHARS) issue(`글 ${p.slug}: ${chars}자 (목표 ${MIN_CHARS}자 미달)`);
  if (!p.faq?.length) issue(`글 ${p.slug}: FAQ 없음`);
  const all = p.sections.map((s) => s.content).join("");
  if (all.includes(editorDup)) warn(`글 ${p.slug}: 동일 편집자 문구 반복`);
}

for (const c of columns) {
  const chars = columnCharCount(c);
  if (chars < MIN_CHARS) issue(`칼럼 ${c.slug}: ${chars}자 (목표 ${MIN_CHARS}자 미달)`);
}

// --- 날짜 분산 ---
const allItems = [...posts, ...columns];
const updatedCounts = {};
for (const item of allItems) {
  updatedCounts[item.updatedAt] = (updatedCounts[item.updatedAt] || 0) + 1;
  if (item.publishedAt && item.updatedAt < item.publishedAt) {
    issue(`날짜 역전 ${item.slug}: publishedAt ${item.publishedAt} > updatedAt ${item.updatedAt}`);
  }
}
const massDate = Object.entries(updatedCounts).find(([, n]) => n > 5);
if (massDate) issue(`updatedAt 집중: ${massDate[0]}에 ${massDate[1]}편 (${massDate[1]}편 이상 동일)`);

const june23Count = allItems.filter((x) => x.updatedAt === "2026-06-23").length;
if (june23Count > allItems.length * 0.5) {
  issue(`updatedAt 2026-06-23 집중: ${june23Count}/${allItems.length}편`);
}

// --- HTML 프리렌더 ---
for (const p of posts) {
  const htmlPath = path.join(ROOT, "posts", `${p.slug}.html`);
  if (!fs.existsSync(htmlPath)) issue(`HTML 없음: posts/${p.slug}.html`);
  else {
    const html = fs.readFileSync(htmlPath, "utf8");
    if (!html.includes(`datetime="${p.updatedAt}"`)) {
      issue(`HTML 날짜 불일치: posts/${p.slug}.html (기대 ${p.updatedAt})`);
    }
    if (!html.includes('data-prerendered="true"')) warn(`프리렌더 플래그 없음: ${p.slug}`);
  }
}

for (const c of columns) {
  const htmlPath = path.join(ROOT, "columns", `${c.slug}.html`);
  if (!fs.existsSync(htmlPath)) issue(`HTML 없음: columns/${c.slug}.html`);
  else {
    const html = fs.readFileSync(htmlPath, "utf8");
    if (!html.includes(`datetime="${c.updatedAt}"`)) {
      issue(`HTML 날짜 불일치: columns/${c.slug}.html (기대 ${c.updatedAt})`);
    }
  }
}

// --- 이미지 ---
const imgRefs = new Set();
for (const p of posts) {
  const matches = p.sections.join(" ").match(/photos\/[^"']+\.jpg/g) || [];
  matches.forEach((m) => imgRefs.add(m.replace("photos/", "assets/images/photos/")));
}
const missingImages = [...imgRefs].filter((r) => !fs.existsSync(path.join(ROOT, r)));
if (missingImages.length) issue(`누락 이미지 ${missingImages.length}개: ${missingImages.slice(0, 3).join(", ")}...`);

// --- sitemap ---
if (fs.existsSync(path.join(ROOT, "sitemap.xml"))) {
  const sitemap = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
  for (const p of posts) {
    const loc = `/posts/${p.slug}.html`;
    if (!sitemap.includes(loc)) issue(`sitemap 누락: ${loc}`);
    else if (!sitemap.includes(`<lastmod>${p.updatedAt}</lastmod>`) && !sitemap.includes(`${loc}</loc><lastmod>${p.updatedAt}`)) {
      const snippet = sitemap.match(new RegExp(`${loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?<lastmod>([^<]+)</lastmod>`));
      if (snippet && snippet[1] !== p.updatedAt) {
        issue(`sitemap lastmod 불일치 ${p.slug}: ${snippet[1]} ≠ ${p.updatedAt}`);
      }
    }
  }
  if (config.privacyLastUpdated && !sitemap.includes(config.privacyLastUpdated)) {
    warn(`sitemap privacy lastmod가 config.privacyLastUpdated(${config.privacyLastUpdated})와 다를 수 있음`);
  }
} else {
  issue("sitemap.xml 없음 — build-site.mjs 실행 필요");
}

// --- 구조·설정 ---
if (!config.siteUrl) issue("site.config: siteUrl 없음");
if (!config.privacyLastUpdated) warn("site.config: privacyLastUpdated 없음");

const privacyHtml = fs.readFileSync(path.join(ROOT, "privacy/index.html"), "utf8");
if (config.privacyLastUpdated && !privacyHtml.includes(config.privacyLastUpdated.replace(/-/g, "년 ").replace(/년 (\d+)$/, "월 $1일").slice(0, 4))) {
  // ko format check - simpler: check iso substring in file after format
  const koMonth = new Date(config.privacyLastUpdated).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  if (!privacyHtml.includes(koMonth)) warn(`privacy/index.html 최종 수정일이 config(${config.privacyLastUpdated})와 불일치`);
}

for (const cat of categories) {
  const count = posts.filter((p) => p.category === cat.slug && p.status !== "draft").length;
  if (count === 0) warn(`카테고리 ${cat.slug}: 글 0편`);
}

// --- FAQ HTML 반영 ---
for (const p of posts) {
  if (!p.faq?.length) continue;
  const htmlPath = path.join(ROOT, "posts", `${p.slug}.html`);
  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, "utf8");
  if (!html.includes("faq-section")) issue(`HTML FAQ 섹션 없음: ${p.slug}`);
  else if (!html.includes(p.faq[0].q.slice(0, 12))) issue(`HTML FAQ 내용 불일치: ${p.slug}`);
}

// --- 정적 법적 페이지 날짜 ---
function koDate(iso) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}
for (const [file, key] of [
  ["privacy/index.html", "privacyLastUpdated"],
  ["terms/index.html", "termsLastUpdated"],
  ["disclaimer/index.html", "disclaimerLastUpdated"]
]) {
  const iso = config[key] || config.privacyLastUpdated;
  if (!iso) continue;
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  if (!html.includes(koDate(iso))) issue(`${file} 최종 수정일이 config.${key}(${iso})와 불일치`);
}

// --- 목록 정렬 (구조) ---
const mainJs = fs.readFileSync(path.join(ROOT, "assets/js/main.js"), "utf8");
if (mainJs.includes("getColumns().slice(0, 3)") && !mainJs.includes(".sort(")) {
  issue("홈 칼럼 미리보기: updatedAt 정렬 없음");
}
const pagesJs = fs.readFileSync(path.join(ROOT, "assets/js/pages.js"), "utf8");
if (pagesJs.includes("getPostsByCategory(cat.slug)") && !pagesJs.includes("getPostsByCategory(cat.slug).sort")) {
  issue("카테고리 글 목록: updatedAt 정렬 없음");
}

// --- 디자인·구성 기본 ---
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
for (const id of ["hero-title", "latest-posts", "featured-posts", "column-preview", "category-grid", "principles-list"]) {
  if (!indexHtml.includes(`id="${id}"`)) issue(`index.html 필수 섹션 누락: #${id}`);
}
if (!fs.existsSync(path.join(ROOT, "assets/css/main.css"))) issue("main.css 없음");

// --- AdSense 준비 ---
if (!fs.existsSync(path.join(ROOT, "assets/js/consent-mode.js"))) issue("consent-mode.js 없음");
if (!fs.existsSync(path.join(ROOT, "assets/js/adsense.js"))) warn("adsense.js 없음");
const privacyForAds = fs.readFileSync(path.join(ROOT, "privacy/index.html"), "utf8");
if (!privacyForAds.includes("Google AdSense")) issue("privacy: AdSense 언급 없음");
if (!privacyForAds.includes("adssettings.google.com")) warn("privacy: Google 광고 설정 링크 없음");
if (!fs.readFileSync(path.join(ROOT, "assets/js/layout.js"), "utf8").includes("footer-cookie-settings")) {
  warn("푸터 쿠키 설정 버튼 없음");
}

// --- 관련 글·메타 무결성 ---
const postSlugs = new Set(posts.map((p) => p.slug));
for (const p of posts) {
  if (!p.excerpt?.trim()) issue(`글 ${p.slug}: excerpt 없음`);
  if (!p.summary?.trim()) issue(`글 ${p.slug}: summary 없음`);
  for (const rel of p.relatedSlugs || []) {
    if (!postSlugs.has(rel)) issue(`글 ${p.slug}: 관련 글 slug 없음 → ${rel}`);
  }
  const htmlPath = path.join(ROOT, "posts", `${p.slug}.html`);
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");
    if (!html.includes("article-main")) issue(`HTML 구조 누락 article-main: ${p.slug}`);
    if (!html.includes('application/ld+json')) warn(`JSON-LD 없음(클라이언트 렌더): ${p.slug}`);
    if (p.title && !html.includes(p.title.slice(0, 10))) issue(`HTML 제목 불일치: ${p.slug}`);
  }
}

for (const c of columns) {
  if (!c.excerpt?.trim()) issue(`칼럼 ${c.slug}: excerpt 없음`);
  const htmlPath = path.join(ROOT, "columns", `${c.slug}.html`);
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, "utf8");
    if (!html.includes("article-main")) issue(`칼럼 HTML 구조 누락: ${c.slug}`);
  }
}

// --- 날짜 분산 품질 ---
const maxSameDay = Math.max(...Object.values(updatedCounts));
if (maxSameDay > 3) warn(`같은 updatedAt 최대 ${maxSameDay}편 — 더 분산 가능`);

const report = {
  cycle,
  posts: posts.length,
  columns: columns.length,
  uniqueUpdatedDates: Object.keys(updatedCounts).length,
  june23Count,
  issues: issues.length,
  warnings: warnings.length,
  errors: issues.map((i) => i.msg),
  warns: warnings.map((w) => w.msg),
  ok: issues.length === 0
};

const outPath = path.join(ROOT, `audit-report${cycle ? `-cycle${cycle}` : ""}.json`);
fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
process.exit(issues.length ? 1 : 0);