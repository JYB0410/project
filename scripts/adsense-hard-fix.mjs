/**
 * AdSense 심사 대응 하드 픽스 (이미지 복제·템플릿·홈 동선·featured)
 * node scripts/adsense-hard-fix.mjs
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}

function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function isRdDiary(p) {
  return (
    p.articleChrome === "diary" ||
    /bread-rd-night-bread-v\d+$/.test(p.slug) ||
    p.slug === "bread-rd-night-bread-mid-review"
  );
}

function stripFigures(html) {
  if (!html) return html;
  return html
    .replace(/<figure class="article-figure">[\s\S]*?<\/figure>/gi, "")
    .replace(/<figure class="article-cover">[\s\S]*?<\/figure>/gi, "");
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** 실험 메모용 추상 일러스트 — 스톡 빵 사진 대체 (차수마다 고유) */
function makeDiarySvg(slug, label, sub) {
  const hue = hashHue(slug);
  const hue2 = (hue + 40) % 360;
  const id = slug.replace(/[^a-z0-9-]/gi, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue},38%,94%)"/>
      <stop offset="100%" stop-color="hsl(${hue2},42%,86%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g-${id})"/>
  <rect x="80" y="90" width="1040" height="495" rx="28" fill="#fff" opacity="0.92"/>
  <circle cx="220" cy="280" r="70" fill="hsl(${hue},55%,48%)" opacity="0.9"/>
  <text x="220" y="292" text-anchor="middle" font-family="system-ui,sans-serif" font-size="36" font-weight="700" fill="#fff">MEMO</text>
  <text x="340" y="250" font-family="system-ui,sans-serif" font-size="42" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="340" y="310" font-family="system-ui,sans-serif" font-size="26" fill="#555">${escapeXml(sub)}</text>
  <text x="340" y="380" font-family="system-ui,sans-serif" font-size="20" fill="#777">실험 메모 일러스트 · 스톡 사진 미사용</text>
  <rect x="340" y="420" width="480" height="12" rx="6" fill="hsl(${hue},40%,80%)"/>
  <rect x="340" y="450" width="360" height="12" rx="6" fill="hsl(${hue},30%,88%)"/>
  <rect x="340" y="480" width="400" height="12" rx="6" fill="hsl(${hue},30%,88%)"/>
</svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const PHOTO_NOTE =
  '<aside class="honey-tip-box"><strong>사진 안내</strong> 이 일지는 실험 당일 메모를 글로 옮긴 기록입니다. 스톡·복제 이미지로 실험 사진을 가장하지 않으며, 표지 일러스트만 구분용으로 둡니다. 적용 기준은 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 우선하세요.</aside>';

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

const coverDir = path.join(ROOT, "assets/images/illustrations/rd-diaries");
fs.mkdirSync(coverDir, { recursive: true });

let stripped = 0;
let covers = 0;

for (const p of posts) {
  if (!isRdDiary(p)) continue;

  for (const sec of p.sections || []) {
    const before = sec.content || "";
    let after = stripFigures(before);
    if (after !== before) stripped++;

    // 목표 섹션 상단에 사진 정책 1회
    if (sec.id === "goal" || sec.id === "intro") {
      if (!after.includes("스톡·복제 이미지") && !after.includes("사진 안내")) {
        // role-banner / value-box 뒤에 삽입
        if (after.includes("</aside>")) {
          const idx = after.lastIndexOf("</aside>");
          // insert after first value-box or role-banner block end — after first aside cluster
          const m = after.match(/^(?:[\s\S]*?<\/aside>){1,3}/);
          if (m) {
            after = m[0] + PHOTO_NOTE + after.slice(m[0].length);
          } else {
            after = PHOTO_NOTE + after;
          }
        } else {
          after = PHOTO_NOTE + after;
        }
      }
    }
    sec.content = after;
  }

  const label = (p.title || p.slug).replace(/^밤식빵 R&D /, "").slice(0, 40);
  const sub = (p.subtitle || "실험 일지").slice(0, 50);
  const svgName = `${p.slug}.svg`;
  fs.writeFileSync(path.join(coverDir, svgName), makeDiarySvg(p.slug, label, sub), "utf8");
  p.coverImage = `../assets/images/illustrations/rd-diaries/${svgName}`;
  p.coverCaption = "실험 메모 구분용 일러스트 (사진 아님)";
  p.articleChrome = "diary";
  p.featured = false;
  covers++;
}

// featured: 가치 높은 허브만
const FEATURED = new Set([
  "bread-rd-night-bread-practical-guide",
  "baker-cert-series-roadmap",
  "baker-cert-mock-three-weeks",
  "why-baker-certification",
  "baker-cert-8month-roadmap"
]);
for (const p of posts) {
  p.featured = FEATURED.has(p.slug);
}

// 실전 정리: 허브 강조 문장 보강 (메타 광고 언어 없이)
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.featured = true;
  const goal = guide.sections.find((s) => s.id === "goal");
  if (goal && !goal.content.includes("일지는 실험 근거")) {
    // already has good content
  }
  // strip any leftover stock if same as diaries — keep unique guide images
  guide.coverImage =
    guide.coverImage || "../assets/images/photos/bread-rd-night-bread-practical-guide/goal.jpg";
}

// series guide: 허브 우선 문구 유지, 중복 스톡 figure 제거(전부 제거 후 텍스트만)
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  for (const sec of series.sections || []) {
    sec.content = stripFigures(sec.content || "");
  }
  // unique svg cover
  const svgName = "bread-rd-series-guide.svg";
  fs.writeFileSync(
    path.join(coverDir, svgName),
    makeDiarySvg("bread-rd-series-guide", "R&D 읽기 순서", "실전 정리 먼저"),
    "utf8"
  );
  series.coverImage = `../assets/images/illustrations/rd-diaries/${svgName}`;
  series.coverCaption = "읽기 안내 일러스트";
}

// baker-cert series roadmap: 동일 해시 이미지 2장 → figure 제거(중복 스톡)
const roadmap = posts.find((p) => p.slug === "baker-cert-series-roadmap");
if (roadmap) {
  for (const sec of roadmap.sections || []) {
    if (sec.id === "how-to-read" || sec.id === "series-purpose") {
      sec.content = stripFigures(sec.content || "");
    }
  }
}

// 기능사 글 중 cover 없는 mock: 고유 일러스트
const mock = posts.find((p) => p.slug === "baker-cert-mock-three-weeks");
if (mock && !mock.coverImage?.includes("illustrations")) {
  const svgName = "baker-cert-mock-three-weeks.svg";
  const dir = path.join(ROOT, "assets/images/illustrations/baker");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, svgName),
    makeDiarySvg("baker-cert-mock-three-weeks", "실기 모의 3주", "제한 시간 먼저"),
    "utf8"
  );
  mock.coverImage = `../assets/images/illustrations/baker/${svgName}`;
  mock.coverCaption = "모의 루틴 안내 일러스트";
}

// categories 설명: 허브 우선
const catPath = path.join(ROOT, "data/categories.js");
let catText = fs.readFileSync(catPath, "utf8");
catText = catText.replace(
  /description:\s*\n?\s*"기능사 합격 이후[\s\S]*?대표 주제입니다\."/,
  `description:
      "먼저 읽을 글: 밤식빵 실전 정리(허브). 1~15차 일지는 변수 실험 근거이며, 완성 레시피가 아닙니다."`
);
// try simpler replace
const cats = load("data/categories.js", "CATEGORIES_DATA");
for (const c of cats) {
  if (c.slug === "bread-rd") {
    c.description =
      "먼저 읽을 글: 밤식빵 실전 정리(허브). 차수 일지는 변수 하나 실험 근거이며 완성 레시피가 아닙니다. 스톡 사진으로 실험을 가장하지 않습니다.";
  }
  if (c.slug === "baker-cert") {
    c.description =
      "2024년 9월 퇴사~2025년 5월 합격 경험. 로드맵·실기·필기·시험 당일·모의 3주 등 준비에 바로 쓰는 기록을 모았습니다.";
  }
}
save("data/categories.js", "CATEGORIES_DATA", cats);

// 홈 hero 카피 보강 (site.config)
const cfgPath = path.join(ROOT, "data/site.config.js");
let cfg = fs.readFileSync(cfgPath, "utf8");
if (!cfg.includes("실전 정리 허브")) {
  cfg = cfg.replace(
    /sitePurpose:\s*\n?\s*"[^"]*"/,
    `sitePurpose:
    "퇴사 후 빵 터졌음!은 제빵기능사 합격 경험과 빵 R&D를 기록합니다. 독자는 실전 정리 허브와 기능사 시리즈를 먼저 읽고, 일지는 실험 근거로만 열어보면 됩니다. 완성 그램 레시피·스톡 사진 위장 실험은 올리지 않습니다."`
  );
  // fallback if multiline different
}
// write purpose more reliably via eval load - site.config is not pure JSON
// manual: read SITE_CONFIG object is harder. Use replace on known string.
if (cfg.includes("퇴사 후 빵 터졌음!은 2024년 9월")) {
  cfg = cfg.replace(
    /sitePurpose:\s*"[^"]*"/s,
    `sitePurpose: "퇴사 후 빵 터졌음!은 제빵기능사 합격 경험과 빵 R&D를 기록합니다. 실전 정리 허브·기능사 시리즈를 먼저 읽고, 일지는 실험 근거로만 참고하세요. 완성 그램 표와 스톡 사진 위장 실험은 올리지 않습니다."`
  );
}
fs.writeFileSync(cfgPath, cfg);

save("data/posts.js", "POSTS_DATA", posts);

// photo integrity report
const photoRoot = path.join(ROOT, "assets/images/photos");
function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) a.push(p);
  }
  return a;
}
const files = walk(photoRoot);
const byHash = new Map();
for (const f of files) {
  // only count files still referenced in posts
  const h = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}

// referenced paths in posts after strip
const refSet = new Set();
for (const p of posts) {
  if (p.coverImage) refSet.add(p.coverImage.replace(/^\.\.\//, ""));
  for (const s of p.sections || []) {
    const ms = s.content?.match(/assets\/images\/[^"']+/g) || [];
    for (const m of ms) refSet.add(m.replace(/^\.\.\//, ""));
  }
}

let activeDupes = 0;
for (const [, list] of byHash) {
  if (list.length < 2) continue;
  const refs = list.filter((f) => {
    const rel = f.replace(/\\/g, "/").split("assets/images/")[1];
    return rel && [...refSet].some((r) => r.includes(rel) || r.endsWith(path.basename(f)));
  });
  // simpler: check if any of duplicate group still in post content
  const stillUsed = list.filter((f) => {
    const needle = f.replace(/\\/g, "/").split("photos/")[1];
    if (!needle) return false;
    return posts.some((p) =>
      (p.sections || []).some((s) => s.content?.includes(needle.replace(/\\/g, "/")))
    );
  });
  if (stillUsed.length > 1) activeDupes++;
}

console.log(`✓ diary figures stripped sections: ${stripped}`);
console.log(`✓ diary abstract covers: ${covers}`);
console.log(`✓ featured hubs: ${[...FEATURED].join(", ")}`);
console.log(`✓ active photo dupe groups still in content: ${activeDupes}`);
console.log("✓ data written");
