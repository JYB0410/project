/**
 * 독자용 품질 정리: 주방 노트 채움 문단 제거, 중복 p 축소
 * node scripts/clean-reader-quality.mjs
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
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function isJunkParagraph(inner) {
  const t = inner.replace(/<[^>]+>/g, "").trim();
  if (!t) return true;
  if (/kitchen-fill/.test(inner)) return true;
  if (/그날의 변수로 남겼습니다/.test(t)) return true;
  if (/보충 \d+번째 줄/.test(t)) return true;
  if (/읽은 주에는 반죽 배합/.test(t)) return true;
  if (/의 숫자는 제 집 기준입니다/.test(t)) return true;
  if (/모의 날에 새로 실험하지 않았습니다/.test(t) && /편\./.test(t)) return true;
  if (/칼럼의 오븐·도구와 역할을 나눕니다/.test(t) && /편\./.test(t)) return true;
  if (/다음에 기능사 본편으로 돌아가면/.test(t)) return true;
  if (/관련 오류 제보는 연락 페이지/.test(t) && /편\./.test(t)) return true;
  if (/사진으로 증명하지 않습니다/.test(t) && /편\./.test(t)) return true;
  if (/가져갈 것은 그램이 아니라/.test(t) && /편\./.test(t)) return true;
  if (/학원 다음 날 집에서 반복하지/.test(t) && /편\./.test(t)) return true;
  if (/공식 공고가 다르면 공고가 이깁니다/.test(t)) return true;
  if (/기록은 2024~2026년 제 주방/.test(t) && /편\./.test(t)) return true;
  if (/한 장 요약으로 줄이면/.test(t) && /편\./.test(t)) return true;
  if (/밤에 다시 실험하지 않았습니다/.test(t) && /편\./.test(t)) return true;
  if (/밤식빵 차수 일지를 섞어 쓰지/.test(t) && /편\./.test(t)) return true;
  if (/스톡 빵 사진으로 자리를 가장/.test(t) && /편\./.test(t)) return true;
  if (/공유할 때는 집 구조가 다르다고/.test(t) && /편\./.test(t)) return true;
  if (/수정이 있으면 수정일을 남깁니다/.test(t) && /편\./.test(t)) return true;
  if (/10편 구성의 한 칸입니다/.test(t)) return true;
  if (/필기 슬롯과 같은 날 길게/.test(t) && /편\./.test(t)) return true;
  if (/을 읽은 주에는/.test(t) && /편\./.test(t)) return true;
  if (/작업대 쪽에서 .+가 동선에 걸리적/.test(t)) return true;
  if (/난방 켠 방에서 .+가 동선에 걸리적/.test(t)) return true;
  return false;
}

function cleanHtml(html) {
  if (!html) return html;
  const cut = html.split("<!--kitchen-fill-->")[0];
  const parts = cut.split(/(<p\b[^>]*>[\s\S]*?<\/p>)/g);
  const kept = [];
  const seen = new Set();
  for (const part of parts) {
    if (!part) continue;
    const m = part.match(/^<p\b[^>]*>([\s\S]*)<\/p>$/);
    if (!m) {
      kept.push(part);
      continue;
    }
    if (isJunkParagraph(m[1])) continue;
    const key = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, "").slice(0, 80);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    kept.push(part);
  }
  return kept.join("").replace(/(<p>\s*<\/p>)+/g, "");
}

function dedupeRdSection(html) {
  if (!html) return html;
  const parts = html.split(/(<p\b[^>]*>[\s\S]*?<\/p>)/g);
  const seen = new Set();
  const kept = [];
  for (const part of parts) {
    if (!part) continue;
    const m = part.match(/^<p\b[^>]*>([\s\S]*)<\/p>$/);
    if (!m) {
      kept.push(part);
      continue;
    }
    const key = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, "");
    if (key.length > 40 && seen.has(key)) continue;
    if (key.length > 40) seen.add(key);
    kept.push(part);
  }
  return kept.join("");
}

const posts = load("data/posts.js", "POSTS_DATA");
let kitchenN = 0;
let rdN = 0;
for (const p of posts) {
  if (p.category === "home-kitchen-notes") {
    for (const s of p.sections || []) {
      const before = s.content;
      s.content = cleanHtml(s.content);
      if (s.content !== before) kitchenN++;
    }
  }
  if (p.category === "bread-rd") {
    for (const s of p.sections || []) {
      const before = s.content;
      s.content = dedupeRdSection(s.content);
      if (s.content !== before) rdN++;
    }
  }
}
save("data/posts.js", "POSTS_DATA", posts);
const PHOTO_OLD =
  "이 일지는 실험 당일 메모를 글로 옮긴 기록입니다. 스톡·복제 이미지로 실험 사진을 가장하지 않으며, 표지 일러스트만 구분용으로 둡니다.";
const PHOTO_NEW =
  "이 일지는 실험 당일 메모를 글로 옮긴 기록입니다. 표지는 구분용 일러스트이고, 실험 장면 실사는 올리지 않았습니다.";

for (const p of posts) {
  for (const s of p.sections || []) {
    if (s.content) {
      s.content = s.content
        .replaceAll(PHOTO_OLD, PHOTO_NEW)
        .replaceAll("스톡 사진으로 식빵을 대체하지 않습니다.", "사진은 실제 그날 구운 것만 올립니다.")
        .replaceAll("스톡 사진으로 창가 발효를 가장하지 않습니다.", "창가 장면은 글로만 남깁니다.")
        .replaceAll("스톡 단면 사진으로 가장하지 않습니다.", "단면 실사는 올리지 않았습니다.");
    }
  }
}
const naturalClose = {
  "window-vs-inner-table":
    "<p>창가 그릇은 겨울 아침에 겉이 찼고, 안쪽 선반은 보일러 바람이 닿았습니다. 같은 주방을 한 칸으로 적던 습관을 그제야 버렸습니다.</p>",
  "fridge-side-no-proof":
    "<p>문을 열 때마다 찬 공기가 스치는 자리는, 난방을 켜도 회복이 느렸습니다. 그 옆을 발효에서 지운 것이 이 편의 전부입니다.</p>",
  "wet-hands-scale-cloth":
    "<p>싱크대 물기가 저울 판으로 옮으면 숫자는 신뢰를 잃습니다. 마른 손, 마른 천, 저울 순서가 잡히자 편차가 줄었습니다.</p>",
  "home-oven-shelf-height":
    "<p>작은 오븐의 윗단은 겉색만 재촉했습니다. 가운데 단으로 내리자 다이얼을 건드리지 않고도 속이 따라왔습니다.</p>",
  "cooling-rack-overnight":
    "<p>다음 날 식감은 밀폐 전에 어디서 식혔느냐에서 갈렸습니다. 뚜껑 옆은 습했고 유리 옆은 겉만 굳었습니다.</p>",
  "flour-tin-monsoon":
    "<p>장마철에 뚜껑을 열어 두면 가루가 먼저 습기를 먹습니다. 물 온도 칸이 멀쩡해도 반죽 감은 달라집니다.</p>",
  "family-kitchen-tape-zone":
    "<p>식탁 중앙은 저녁 접시와 반죽 그릇이 싸웁니다. 끝쪽 한 줄을 실험 칸으로 표시하자 타이머가 사라지는 일이 줄었습니다.</p>",
  "night-bake-lamp":
    "<p>노란 전구 아래서는 겉색이 괜찮아 보였습니다. 아침 창가에서 다시 보니 덜 익은 톤이었습니다. 색 판정은 아침으로 미뤘습니다.</p>"
};
for (const p of posts) {
  const close = naturalClose[p.slug];
  if (!close) continue;
  const last = p.sections[p.sections.length - 1];
  if (last && !last.content.includes(close.slice(12, 28))) last.content += close;
}
save("data/posts.js", "POSTS_DATA", posts);

console.log("kitchen sections cleaned", kitchenN);
console.log("rd sections deduped", rdN);
for (const p of posts.filter((x) => x.category === "home-kitchen-notes")) {
  console.log(postCharCount(p), p.slug);
}

if (fs.existsSync(path.join(ROOT, "data/home-kitchen-8.json"))) {
  const arr = JSON.parse(fs.readFileSync(path.join(ROOT, "data/home-kitchen-8.json"), "utf8"));
  for (const p of arr) {
    for (const s of p.sections || []) s.content = cleanHtml(s.content);
  }
  fs.writeFileSync(path.join(ROOT, "data/home-kitchen-8.json"), JSON.stringify(arr, null, 2) + "\n");
}
