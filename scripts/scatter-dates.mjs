/**
 * 콘텐츠·설정·정적 페이지 날짜를 한 달 구간에 자연스럽게 분산
 * 사용: node scripts/scatter-dates.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const RANGE_START = "2026-05-24";
const RANGE_END = "2026-06-23";
const DAY_MS = 86400000;

function loadJsExport(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  const expr = code.replace(`window.${varName} = `, "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

function formatKoDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function slugHash(slug) {
  return [...slug].reduce((a, c) => a + c.charCodeAt(0), 0);
}

function toIso(d) {
  return d.toISOString().slice(0, 10);
}

function clampDate(d, min, max) {
  if (d < min) return new Date(min);
  if (d > max) return new Date(max);
  return d;
}

function scatterUpdatedAt(items, { start, end }) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const span = Math.round((endMs - startMs) / DAY_MS);

  const sorted = [...items].sort((a, b) => {
    const pa = new Date(a.publishedAt || start).getTime();
    const pb = new Date(b.publishedAt || start).getTime();
    if (pa !== pb) return pa - pb;
    return a.slug.localeCompare(b.slug);
  });

  const used = new Set();

  for (let i = 0; i < sorted.length; i++) {
    const item = sorted[i];
    const pubMs = new Date(item.publishedAt || start).getTime();
    const ratio = sorted.length > 1 ? i / (sorted.length - 1) : 0.5;
    const baseOffset = Math.round(ratio * span);
    const jitter = (slugHash(item.slug) % 5) - 2;
    let offset = Math.max(0, Math.min(span, baseOffset + jitter));

    let candidate = new Date(startMs + offset * DAY_MS);
    candidate = clampDate(candidate, new Date(Math.max(pubMs, startMs)), new Date(endMs));

    let guard = 0;
    while (used.has(toIso(candidate)) && guard < span + 5) {
      candidate = new Date(candidate.getTime() + DAY_MS);
      if (candidate > new Date(endMs)) {
        candidate = new Date(endMs - guard * DAY_MS);
      }
      candidate = clampDate(candidate, new Date(Math.max(pubMs, startMs)), new Date(endMs));
      guard++;
    }

    const iso = toIso(candidate);
    used.add(iso);
    item.updatedAt = iso;
  }

  return items;
}

function writeDataFile(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`);
}

function patchSiteConfig(dates) {
  const configPath = path.join(ROOT, "data/site.config.js");
  let code = fs.readFileSync(configPath, "utf8");
  for (const [key, value] of Object.entries(dates)) {
    const re = new RegExp(`${key}:\\s*"[^"]+"`);
    if (re.test(code)) code = code.replace(re, `${key}: "${value}"`);
    else code = code.replace(/siteUrl:/, `${key}: "${value}",\n  siteUrl:`);
  }
  fs.writeFileSync(configPath, code);
}

function patchLegalPage(file, lastUpdated) {
  const filePath = path.join(ROOT, file);
  let html = fs.readFileSync(filePath, "utf8");
  const ko = formatKoDate(lastUpdated);
  if (html.includes("최종 수정:")) {
    html = html.replace(/최종 수정: [^<]+/, `최종 수정: ${ko}`);
  } else if (html.includes("시행일:")) {
    html = html.replace(/(<p>시행일: [^<]+)(<\/p>)/, `$1 · 최종 수정: ${ko}$2`);
  } else {
    html = html.replace(
      /(<header class="page-hero"><h1>[^<]+<\/h1>)/,
      `$1<p>시행일: 2026년 3월 1일 · 최종 수정: ${ko}</p>`
    );
  }
  fs.writeFileSync(filePath, html);
}

const posts = loadJsExport("data/posts.js", "POSTS_DATA");
const columns = loadJsExport("data/columns.js", "COLUMNS_DATA");

scatterUpdatedAt(posts, { start: RANGE_START, end: RANGE_END });
scatterUpdatedAt(columns, { start: RANGE_START, end: RANGE_END });

writeDataFile("data/posts.js", "POSTS_DATA", posts);
writeDataFile("data/columns.js", "COLUMNS_DATA", columns);

const allUpdated = [...posts, ...columns].map((x) => x.updatedAt).sort();
const configDates = {
  privacyLastUpdated: allUpdated[Math.floor(allUpdated.length * 0.55)] || "2026-06-08",
  termsLastUpdated: allUpdated[Math.floor(allUpdated.length * 0.4)] || "2026-06-01",
  disclaimerLastUpdated: allUpdated[Math.floor(allUpdated.length * 0.35)] || "2026-05-28"
};

patchSiteConfig(configDates);
patchLegalPage("privacy/index.html", configDates.privacyLastUpdated);
patchLegalPage("terms/index.html", configDates.termsLastUpdated);
patchLegalPage("disclaimer/index.html", configDates.disclaimerLastUpdated);

const uniqueUpdated = new Set([...posts, ...columns].map((x) => x.updatedAt));
console.log(`✓ 날짜 분산 완료 (${RANGE_START} ~ ${RANGE_END})`);
console.log(`  글 ${posts.length}편, 칼럼 ${columns.length}편`);
console.log(`  updatedAt 고유값 ${uniqueUpdated.size}개 (전체 ${posts.length + columns.length}편)`);
console.log(`  설정: privacy=${configDates.privacyLastUpdated}, terms=${configDates.termsLastUpdated}, disclaimer=${configDates.disclaimerLastUpdated}`);