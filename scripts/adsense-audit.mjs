/**
 * Google AdSense 승인 준비 검수 (영문 공식 가이드·커뮤니티 체크리스트 기반)
 * 사용: node scripts/adsense-audit.mjs [--cycle=N]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS, postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const cycle = Number(process.argv.find((a) => a.startsWith("--cycle="))?.split("=")[1] || 0);

const load = (f, v) =>
  Function(`return (${fs.readFileSync(path.join(ROOT, f), "utf8").replace(`window.${v} = `, "").replace(/;\s*$/, "")})`)();

const config = load("data/site.config.js", "SITE_CONFIG");
const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

const issues = [];
const warnings = [];
const passed = [];

function fail(msg) {
  issues.push(msg);
}
function warn(msg) {
  warnings.push(msg);
}
function ok(msg) {
  passed.push(msg);
}

function read(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}

function htmlHasAll(file, needles) {
  const html = read(file);
  return needles.every((n) => html.includes(n));
}

// --- 필수 페이지 (Google: About, Contact, Privacy) ---
const requiredPages = [
  { path: "about/index.html", label: "사이트 소개" },
  { path: "author/index.html", label: "운영자 소개" },
  { path: "contact/index.html", label: "문의" },
  { path: "privacy/index.html", label: "개인정보처리방침" },
  { path: "terms/index.html", label: "이용약관" },
  { path: "disclaimer/index.html", label: "면책고지" }
];

for (const p of requiredPages) {
  if (!fs.existsSync(path.join(ROOT, p.path))) fail(`필수 페이지 없음: ${p.label} (${p.path})`);
  else ok(`필수 페이지 존재: ${p.label}`);
}

// --- 연락처 노출 ---
if (!config.contactEmail || !config.contactEmail.includes("@")) fail("site.config: contactEmail 없음");
else ok("운영자 이메일 설정됨");

const contactHtml = read("contact/index.html");
if (!contactHtml.includes(config.contactEmail)) fail("contact 페이지에 이메일 미노출");
else ok("문의 페이지 이메일 노출");

// --- 개인정보·AdSense 정책 문구 ---
const privacy = read("privacy/index.html");
const privacyChecks = [
  ["Google AdSense", "AdSense 명시"],
  ["쿠키", "쿠키 안내"],
  ["policies.google.com/privacy", "Google 개인정보 링크"],
  ["policies.google.com/technologies/ads", "Google 광고 기술 링크"],
  ["adssettings.google.com", "광고 설정 옵트아웃 링크"],
  ["ads.txt", "ads.txt 안내"]
];
for (const [needle, label] of privacyChecks) {
  if (!privacy.includes(needle)) fail(`privacy: ${label} 누락`);
  else ok(`privacy: ${label}`);
}

// --- 쿠키 동의 (EEA/UK + Consent Mode) ---
if (!fs.existsSync(path.join(ROOT, "assets/js/consent.js"))) fail("consent.js 없음");
else ok("쿠키 동의 배너 스크립트");

if (!fs.existsSync(path.join(ROOT, "assets/js/consent-mode.js"))) fail("consent-mode.js 없음 (Consent Mode v2)");
else ok("Google Consent Mode v2 스크립트");

const consentJs = read("assets/js/consent.js");
if (!consentJs.includes("pethamkke_cookie_consent")) fail("consent.js: 저장 키 없음");
if (!consentJs.includes("거부")) fail("consent.js: 거부 버튼 없음");
if (!consentJs.includes("privacy")) warn("consent.js: 개인정보처리방침 링크 확인");

// --- ads.txt ---
const adsTxt = read("ads.txt");
if (!adsTxt.includes("google.com")) warn("ads.txt: google.com 항목 미활성(승인 후 pub ID 입력 필요)");
else ok("ads.txt google.com 항목");

// --- robots / sitemap ---
const robots = read("robots.txt");
const blocksEntireSite = robots.split("\n").some((line) => /^Disallow:\s*\/\s*$/.test(line.trim()));
if (blocksEntireSite) fail("robots.txt: 전체 차단");
if (!robots.includes("Sitemap:")) fail("robots.txt: Sitemap 없음");
else ok("robots.txt + sitemap");

if (!fs.existsSync(path.join(ROOT, "sitemap.xml"))) fail("sitemap.xml 없음");
else {
  const sm = read("sitemap.xml");
  for (const p of ["/privacy/", "/terms/", "/disclaimer/", "/about/", "/contact/"]) {
    if (!sm.includes(p)) warn(`sitemap.xml: ${p} 누락 가능`);
  }
  ok("sitemap.xml 존재");
}

// --- 내비게이션·푸터 정책 링크 ---
const layout = read("assets/js/layout.js");
for (const link of ["privacy/", "terms/", "disclaimer/", "about/", "contact/"]) {
  if (!layout.includes(link)) fail(`layout 푸터/내비: ${link} 누락`);
}
ok("푸터 정책·문의 링크");

// --- 콘텐츠 품질 (low-value content 방지) ---
const published = posts.filter((p) => p.status !== "draft");
if (published.length < 15) warn(`글 ${published.length}편 — AdSense는 15~25편 이상 권장`);
else ok(`글 ${published.length}편`);

let shortCount = 0;
let noFaq = 0;
for (const p of published) {
  if (postCharCount(p) < MIN_CHARS) shortCount++;
  if (!p.faq?.length) noFaq++;
}
if (shortCount) fail(`공백 미포함 ${MIN_CHARS}자 미달 글 ${shortCount}편`);
else ok(`전 글 ${MIN_CHARS}자 이상`);

if (noFaq) fail(`FAQ 없는 글 ${noFaq}편`);
else ok("전 글 FAQ 있음");

if (columns.length < 4) warn(`칼럼 ${columns.length}편 — 운영자 관점 콘텐츠 보강 권장`);
else ok(`칼럼 ${columns.length}편`);

// --- 운영자 신뢰(E-E-A-T) ---
if (!config.ownerName || !config.ownerBio) fail("운영자 이름/소개 없음");
if (!config.editorialPrinciples?.length) fail("편집 원칙 없음");
else ok("운영자·편집 원칙 설정");

const authorHtml = read("author/index.html");
if (!authorHtml.includes("author-experience") || !authorHtml.includes("author-expertise")) {
  warn("author 페이지: 경험/전문 분야 섹션 확인");
}

// --- consent-mode·adsense 스크립트 배포 ---
const samplePages = [
  "index.html",
  "privacy/index.html",
  "about/index.html",
  "contact/index.html",
  "posts/first-week-checklist.html",
  "columns/why-routine-matters.html"
];
let missingConsentMode = 0;
let missingAdsenseJs = 0;
for (const f of samplePages) {
  if (!fs.existsSync(path.join(ROOT, f))) continue;
  const html = read(f);
  if (!html.includes("consent-mode.js")) missingConsentMode++;
  if (!html.includes("adsense.js")) missingAdsenseJs++;
}
if (missingConsentMode) fail(`consent-mode.js 누락 페이지 ${missingConsentMode}/${samplePages.length}`);
else ok("주요 페이지 consent-mode.js head 삽입");

if (missingAdsenseJs) warn(`adsense.js 누락 샘플 ${missingAdsenseJs}개`);
else ok("주요 페이지 adsense.js 로드");

if (!layout.includes("footer-cookie-settings")) fail("푸터 쿠키 설정 버튼 없음");
else ok("푸터 쿠키 설정 재선택");

const terms = read("terms/index.html");
if (!terms.includes("쿠키") || !terms.includes("동의")) warn("terms: 쿠키·동의 조항 확인");
else ok("terms: 쿠키·동의 조항");

const about = read("about/index.html");
if (!about.includes("광고") || !about.includes("AdSense")) warn("about: 광고 정책 섹션 확인");
else ok("about: 광고·수익화 안내");

// --- adsense.js 준비 ---
if (!fs.existsSync(path.join(ROOT, "assets/js/adsense.js"))) warn("adsense.js 없음");
else ok("AdSense 로더 스크립트(승인 후 활성화)");

if (!config.adsensePublisherId && !config.adsenseEnabled) {
  warn("AdSense 미설정(정상) — 승인 후 site.config adsensePublisherId·adsenseEnabled 설정");
}

// --- head pagead: 소유권 확인(adsenseSiteVerification) 또는 승인 후(adsenseEnabled) ---
const ADSENSE_EXCLUDE_HEAD = new Set(["admin", "404.html", "sitemap", "privacy", "terms", "disclaimer", "contact"]);
const needsHeadPagead = Boolean(
  config.adsensePublisherId && (config.adsenseSiteVerification || config.adsenseEnabled)
);
let headPageadCount = 0;
let headPageadOnExcluded = 0;
function walkHtml(dir, files = []) {
  for (const name of fs.readdirSync(path.join(ROOT, dir))) {
    const p = path.join(ROOT, dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(path.relative(ROOT, p), files);
    else if (name.endsWith(".html")) files.push(path.relative(ROOT, p).replace(/\\/g, "/"));
  }
  return files;
}
for (const rel of walkHtml(".")) {
  const html = read(rel);
  if (!html.includes("pagead2.googlesyndication.com")) continue;
  headPageadCount++;
  const top = rel.split("/")[0];
  if (rel === "404.html" || ADSENSE_EXCLUDE_HEAD.has(top)) headPageadOnExcluded++;
}
if (headPageadOnExcluded) {
  fail(`정책 제외 페이지에 pagead ${headPageadOnExcluded}개 (404·privacy 등)`);
} else if (needsHeadPagead) {
  if (!read("index.html").includes("pagead2.googlesyndication.com")) {
    fail("index.html head에 AdSense 소유권 확인 스크립트 없음");
  } else if (!read("index.html").includes(config.adsensePublisherId)) {
    fail("index.html pagead client ID 불일치");
  } else {
    ok(`head pagead 소유권 확인 (${headPageadCount}개 페이지, client=${config.adsensePublisherId})`);
  }
} else if (headPageadCount) {
  fail(`head에 pagead 스크립트 ${headPageadCount}개 — 제거 필요 (node scripts/patch-adsense-head.mjs)`);
} else {
  ok("head pagead 없음 (adsense.js 동의 후 로드)");
}

if (config.adsenseEnabled && !config.adsensePublisherId) {
  fail("adsenseEnabled=true 인데 adsensePublisherId 없음");
}
if (!config.adsenseEnabled && config.adsensePublisherId) {
  ok("승인 대기: pub ID만 설정, adsenseEnabled=false");
}

// --- 정적 페이지 메타 ---
if (!read("about/index.html").includes('rel="canonical"')) warn("about: canonical 없음");
if (!read("index.html").includes('rel="canonical"')) fail("index: canonical 없음");

const report = {
  cycle,
  source: "Google AdSense Help 7299563, 9724, 48182, 23921 + GitHub Pages community",
  passed: passed.length,
  issues: issues.length,
  warnings: warnings.length,
  errors: issues,
  warns: warnings,
  checks: passed,
  ok: issues.length === 0
};

const out = path.join(ROOT, `adsense-audit${cycle ? `-cycle${cycle}` : ""}.json`);
fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(issues.length ? 1 : 0);