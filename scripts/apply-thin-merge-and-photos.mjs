/**
 * 얇은 URL 통합 + published 이미지 고유 파일 배치
 * node scripts/apply-thin-merge-and-photos.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-09-15";
const IMG_SRC = path.join(
  "C:/Users/hopet/.grok/sessions/C%3A%5CUsers%5Chopet/019eee0a-3d03-7172-aa33-6e328db96537/images"
);

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const MERGES = {
  "baker-cert-written-exam-desk": "baker-cert-written-tips",
  "baker-cert-wrist-pause-at-bench": "baker-cert-practical-mistakes",
  "exam-item-oven-door-peek": "exam-item-sweet-roll-approach",
  "exam-item-second-proof-wait": "exam-item-fermentation-poke-not-minutes",
  "bread-rd-pan-liner-vs-bare": "bread-rd-night-bread-practical-guide",
  "bread-rd-slice-warm-vs-morning": "bread-rd-night-bread-practical-guide"
};

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");
const bySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

function rewriteHtml(html) {
  if (!html) return html;
  let out = html;
  for (const [from, to] of Object.entries(MERGES)) {
    out = out.replaceAll(`${from}.html`, `${to}.html`);
  }
  return out;
}

function rewriteItem(item) {
  for (const sec of item.sections || []) sec.content = rewriteHtml(sec.content);
  if (item.relatedSlugs) {
    item.relatedSlugs = [...new Set(item.relatedSlugs.map((s) => MERGES[s] || s))].filter(
      (s) => s !== item.slug
    );
  }
}

const written = bySlug["baker-cert-written-tips"];
const examDay = written.sections.find((s) => s.id === "exam-day-written");
if (examDay && !examDay.content.includes("연필 두 자루")) {
  examDay.content +=
    "<p>당일 책상에는 연필 두 자루와 물만 올렸습니다. 오답 카드는 가방에 두었습니다. 학원 모의에서 한 자루가 부러진 적이 있어 두 자루를 챙겼고, 심은 미리 깎았습니다. 물은 뚜껑만 느슨하게 했습니다. 시작 전에 오답 카드를 다시 보지 않았습니다. 공식 준비물은 그해 공고가 우선입니다.</p>";
  written.updatedAt = TODAY;
}

const mistakes = bySlug["baker-cert-practical-mistakes"];
const shaping = mistakes.sections.find((s) => s.id === "shaping-failures");
if (shaping && !shaping.content.includes("작업대 왼쪽 수건")) {
  shaping.content +=
    "<p>2025년 4월 모의에서 성형이 세 개를 넘기자 손목이 먼저 말했습니다. 반죽을 덮고 작업대 왼쪽 수건을 집는 30초를 제한 시간 안에 넣었습니다. 타이머는 끄지 않았습니다. 의료·재활 조언이 아니라 그날 손 기록입니다. 하루를 비우는 이야기는 <a href=\"../columns/rest-day-when-wrists-hurt.html\">손목 칼럼</a>에 있고, 이 문장은 같은 날 작업대 위의 타이밍입니다.</p>";
  mistakes.updatedAt = TODAY;
}

const sweet = bySlug["exam-item-sweet-roll-approach"];
if (!sweet.sections.some((s) => s.id === "oven-door")) {
  const idx = sweet.sections.findIndex((s) => s.id === "time-sinks");
  sweet.sections.splice(idx + 1, 0, {
    id: "oven-door",
    heading: "h2",
    title: "굽기 중 문을 자주 열던 버릇",
    content:
      "<p>집 오븐 문이 가벼워, 색을 보겠다고 자주 열었습니다. 학원 오븐은 묵직해 자주 못 열었습니다. 열수록 온도가 떨어지고 색이 더 들쭉날쭉했습니다.</p><p>메모에 확인을 두 칸만 적었습니다. 중반은 팽창, 끝 근처에서만 색. 창으로 보는 것과 문을 여는 것을 나눴습니다. 모의 날에는 문 여는 실험을 새로 하지 않았습니다. 선반 단을 고친 주에는 문 횟수를 건드리지 않았습니다.</p>"
  });
  sweet.updatedAt = TODAY;
}

const poke = bySlug["exam-item-fermentation-poke-not-minutes"];
const second = poke.sections.find((s) => s.id === "second-proof");
if (second && !second.content.includes("2025년 3월")) {
  second.title = "2차 — 분이 남았는데 표면이 처지던 날";
  second.content +=
    "<p>2025년 3월, 식빵 2차를 분에 맞춰 기다리다 타이머가 울리기 전에 표면이 처진 날이 있었습니다. 1차는 볼 안에서 눌림을 보고, 2차는 판 위에서 옆이 퍼지는지만 가볍게 봤습니다. 손가락을 깊게 넣지 않았습니다. 퍼진 느낌이 있으면 분을 기다리지 않았습니다. 2차 판단을 고친 주에는 1차 분을 건드리지 않았습니다.</p>";
  poke.updatedAt = TODAY;
}

const guide = bySlug["bread-rd-night-bread-practical-guide"];
if (!guide.sections.some((s) => s.id === "eval-pan")) {
  const idx = guide.sections.findIndex((s) => s.id === "mistakes-home");
  guide.sections.splice(idx + 1, 0, {
    id: "eval-pan",
    heading: "h2",
    title: "평가 시각과 팬 표면 — 변수 하나",
    content:
      "<p>당일 따뜻한 빵을 자르면 속이 칼에 밀려 뭉개졌고, 기공이 실제보다 작게 보였습니다. 같은 덩어리의 다른 쪽을 다음 날 아침에 자르니 결이 보였습니다. 레시피가 바뀐 것이 아니라 자른 시각이 바뀐 것입니다. 평가용 한 조각만 아침으로 남겼습니다.</p><p>같은 반죽을 유산지 팬과 맨 팬에 나눠 넣은 날도 있습니다. 단 높이와 다이얼은 같게 했습니다. 유산지 쪽은 떨어지기 쉽고 옆 색이 연했습니다. 맨 팬은 색이 진하고 붙는 면이 있었습니다. 어느 쪽이 기억의 빵에 가까운지는 다음 날 식감과 같이 봤습니다. 당일 뜨거운 빵으로 고르지 않았습니다. 단면 시각과 팬 표면을 같은 주에 겹치지 않았습니다. 밤식빵 16차가 아닙니다.</p>"
  });
  guide.updatedAt = TODAY;
  if (!guide.excerpt.includes("평가 시각")) {
    guide.excerpt += " 평가 시각(따뜻할 때와 아침)과 유산지 유무도 한 줄로 붙였습니다.";
  }
}

for (const p of posts) rewriteItem(p);
for (const c of columns) rewriteItem(c);

for (const [from, to] of Object.entries(MERGES)) {
  const p = bySlug[from];
  p.status = "redirect";
  p.redirectTo = to;
  p.featured = false;
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("merged", Object.keys(MERGES).length, "→ redirects");

function collectDests(item) {
  const set = new Set();
  if (item.coverImage) {
    set.add(item.coverImage.replace(/^\.\.\//, "").replace(/^\//, ""));
  }
  for (const sec of item.sections || []) {
    const re = /(?:src|content)="([^"]+\.(?:jpg|jpeg|png|webp))"/gi;
    let m;
    while ((m = re.exec(sec.content || ""))) {
      set.add(m[1].replace(/^\.\.\//, "").replace(/^\//, ""));
    }
  }
  return set;
}

const published = posts.filter((p) => p.status === "published");
const destSet = new Set();
for (const p of published) for (const d of collectDests(p)) destSet.add(d);
for (const c of columns) {
  if (c.status === "draft") continue;
  for (const d of collectDests(c)) destSet.add(d);
}

const preferred = [
  ["assets/images/illustrations/exam-items/exam-item-fermentation-poke-not-minutes.jpg", 57],
  ["assets/images/illustrations/exam-items/exam-item-sweet-roll-approach.jpg", 61],
  ["assets/images/illustrations/exam-items/exam-item-scale-after-shaping.jpg", 60],
  ["assets/images/illustrations/exam-items/exam-item-white-bread-fail-points.jpg", 63],
  ["assets/images/illustrations/home-kitchen/kitchen-bench-timer-place.jpg", 70],
  ["assets/images/photos/bread-rd-night-bread-practical-guide/goal.jpg", 64],
  ["assets/images/illustrations/baker/baker-cert-mock-three-weeks.jpg", 76],
  ["assets/images/photos/baker-cert-written-tips/intro.jpg", 72],
  ["assets/images/photos/baker-cert-practical-mistakes/intro.jpg", 71],
  ["assets/images/photos/baker-cert-practical-mistakes/shaping-failures.jpg", 77],
  ["assets/images/photos/baker-cert-practical-mistakes/baking-failures.jpg", 75],
  ["assets/images/photos/baker-cert-practical-mistakes/fermentation-failures.jpg", 59],
  ["assets/images/photos/baker-cert-practical-mistakes/dough-failures.jpg", 69],
  ["assets/images/photos/baker-cert-practical-mistakes/time-practice.jpg", 62],
  ["assets/images/photos/baker-cert-exam-day-pass/intro.jpg", 78],
  ["assets/images/photos/why-baker-certification/childhood-bread.jpg", 48],
  ["assets/images/photos/baker-cert-series-roadmap/series-purpose.jpg", 52],
  ["assets/images/photos/baker-cert-8month-roadmap/exam-structure.jpg", 51],
  ["assets/images/photos/baker-cert-to-bread-rd/intro.jpg", 47],
  ["assets/images/photos/baker-cert-one-page-cheatsheet/goal.jpg", 53],
  ["assets/images/illustrations/rd-diaries/bread-rd-series-guide.jpg", 54],
  ["assets/images/illustrations/rd-diaries/bread-rd-night-bread-mid-review.jpg", 55],
  ["assets/images/illustrations/rd-diaries/bread-rd-night-bread-v8.jpg", 67],
  ["assets/images/illustrations/rd-diaries/bread-rd-night-bread-v4.jpg", 66],
  ["assets/images/illustrations/rd-diaries/bread-rd-night-bread-v1.jpg", 58],
  ["assets/images/photos/bread-rd-night-bread-practical-guide/memo-template.jpg", 65]
];

function srcPath(n) {
  return path.join(IMG_SRC, `${n}.jpg`);
}

const available = [];
for (let n = 79; n >= 31; n--) {
  if (fs.existsSync(srcPath(n))) available.push(n);
}

function writeUniqueJpeg(srcFile, destRel, tag) {
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const buf = fs.readFileSync(srcFile);
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    const comment = Buffer.from(tag, "utf8");
    const len = comment.length + 2;
    const marker = Buffer.alloc(4 + comment.length);
    marker[0] = 0xff;
    marker[1] = 0xfe;
    marker.writeUInt16BE(len, 2);
    comment.copy(marker, 4);
    fs.writeFileSync(dest, Buffer.concat([buf.subarray(0, 2), marker, buf.subarray(2)]));
  } else {
    fs.copyFileSync(srcFile, dest);
  }
}

const usedNums = new Set();
const assigned = new Map();

for (const [dest, num] of preferred) {
  if (!destSet.has(dest)) continue;
  if (!fs.existsSync(srcPath(num))) continue;
  if (usedNums.has(num)) continue;
  writeUniqueJpeg(srcPath(num), dest, dest);
  usedNums.add(num);
  assigned.set(dest, num);
}

const leftoverDests = [...destSet].filter((d) => !assigned.has(d)).sort();
const leftoverNums = available.filter((n) => !usedNums.has(n));

for (const dest of leftoverDests) {
  let num = leftoverNums.shift();
  if (num == null) {
    num = available[(assigned.size + leftoverDests.indexOf(dest)) % available.length];
  }
  writeUniqueJpeg(srcPath(num), dest, dest);
  usedNums.add(num);
  assigned.set(dest, num);
}

const hashes = new Map();
let dupes = 0;
for (const dest of destSet) {
  const abs = path.join(ROOT, dest);
  if (!fs.existsSync(abs)) continue;
  const h = crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex").slice(0, 12);
  if (hashes.has(h)) dupes++;
  else hashes.set(h, dest);
}

console.log("published image dests", destSet.size);
console.log("unique hashes", hashes.size, "dupes", dupes);
console.log("mapped unique gens", usedNums.size);
