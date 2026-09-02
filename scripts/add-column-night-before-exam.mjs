/**
 * 칼럼: 시험 전날 새 연습을 안 하기로 한 이유
 * 발행 2026-09-02
 * node scripts/add-column-night-before-exam.mjs
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

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeSvg(slug, label, sub) {
  const hue = hashHue(slug);
  const id = slug.replace(/[^a-z0-9-]/gi, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue},32%,96%)"/>
      <stop offset="100%" stop-color="hsl(${(hue + 36) % 360},38%,86%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g-${id})"/>
  <rect x="80" y="96" width="1040" height="484" rx="28" fill="#fff" opacity="0.94"/>
  <circle cx="210" cy="300" r="56" fill="hsl(${hue},48%,46%)"/>
  <text x="210" y="310" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" fill="#fff" font-weight="700">EVE</text>
  <text x="300" y="270" font-family="system-ui,sans-serif" font-size="36" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="300" y="328" font-family="system-ui,sans-serif" font-size="22" fill="#555">${escapeXml(sub)}</text>
  <text x="300" y="400" font-family="system-ui,sans-serif" font-size="18" fill="#777">칼럼 일러스트 · 레시피 아님</text>
</svg>`;
}

const col = {
  slug: "no-new-practice-night-before-exam",
  title: "시험 전날, 새 연습을 안 하기로 한 이유",
  subtitle: "도구만 만지고 반죽은 접은 밤",
  author: "정지석",
  publishedAt: "2026-09-02",
  updatedAt: "2026-09-02",
  status: "published",
  excerpt:
    "2025년 5월 실기 전날, 새 품목·새 레시피를 열지 않았습니다. 도구 사진 한 장과 필기 오답만 보고 손을 쉬겼습니다. 당일 글이 아니라, 전날 밤에 무엇을 안 했는지를 적습니다.",
  perspective:
    "시험이 가까울수록 한 번 더 굽고 싶어집니다. 저는 그 한 번이 다음 날 손을 흔든 기억이 있어서, 전날은 익숙한 루트조차 짧게만 두거나 아예 접었습니다.",
  sections: [
    {
      id: "the-night",
      heading: "h2",
      title: "전날 밤에 안 연 것들",
      content: `<p>2025년 5월, 실기 전날 저녁이었습니다. 유튜브에 시험 품목 영상이 떠 있었고, 손으로 한 번 더 확인하면 마음이 놓일 것 같았습니다. 열지 않았습니다. 새 토핑, 새 성형, 학원에서 안 하던 장식은 그날 금지였습니다.</p>
<p>대신 가방을 열고 스크래퍼·저울·타이머만 꺼냈습니다. 사진을 한 장 찍었습니다. 필기 오답 카드 스무 장만 읽었습니다. 반죽은 안 했습니다. 당일 흐름은 <a href="../posts/baker-cert-exam-day-pass.html">5편</a>에 있고, 이 칼럼은 그 전날만 다룹니다.</p>
<p>한 장 요약(<a href="../posts/baker-cert-one-page-cheatsheet.html">치트시트</a>)에 적어 둔 “전날: 도구 사진 한 장, 반죽 연습은 가볍게 또는 생략”이 그날의 실행이었습니다. 가볍게라도 반죽을 할까 망설이다, 손목 칼럼(<a href="rest-day-when-wrists-hurt.html">쉬는 기준</a>)을 떠올리고 접었습니다.</p>
<p>가방을 다시 열어 저울 단위가 g인지 확인했습니다. 학원 저울과 집 저울 오차는 평일에 이미 적어 두었습니다. 전날 밤에 오차를 새로 재지 않았습니다. 새 숫자를 만들 밤이 아니었습니다. 메모장은 덮었습니다. 읽을 글은 이미 충분했습니다. 그다음 일은 잠이었습니다. 알람은 평소보다 조금 이르게 맞춰 두었습니다. 아침을 서두르지 않으려고 알람을 일찍 맞췄습니다.</p>`
    },
    {
      id: "why-not",
      heading: "h2",
      title: "전날 굽기가 남긴 기억",
      content: `<p>모의 전날에 새 성형을 넣었던 적이 있습니다. 2025년 4월이었습니다. 영상에서 본 봉합이 예뻐 보여서 평소 루트에 얹었습니다. 시간은 늘었고, 다음 날 모의에서 손이 그 봉합을 찾다 멈췄습니다. <a href="../posts/baker-cert-mock-three-weeks.html">모의 3주</a>에 적어 둔 “모의 날 새 레시피 금지”와 같은 실수입니다. 시험 전날은 모의보다 더 지켜야 한다고 봤습니다.</p>
<p>전날 장시간 연습이 다음 날 성형 속도를 깎은 기록은 이미 있습니다. 시험 전날은 그 패턴을 한 번 더 허용할 자리가 없습니다. 남은 날이 하루라서 더 굽는 선택이, 제게는 반대로 갔습니다.</p>
<p>새 연습이 아니라도, 평소 식빵 루트를 전날 풀코스로 도는 것도 접었습니다. 익숙한 손이라도 여섯 시간이면 다음 날 손목이 남습니다. 전날은 손이 아니라 가방이 일이었습니다. 식빵 세 지점(<a href="../posts/exam-item-white-bread-fail-points.html">접근 노트</a>)을 전날 밤에 다시 실험하고 싶지 않았습니다. 실험은 평일 몫입니다.</p>`
    },
    {
      id: "allowed",
      heading: "h2",
      title: "전날에 한 일",
      content: `<p>금지 목록만 있으면 빈 밤이 불안했습니다. 허용 목록을 짧게 적었습니다.</p>
<ul>
<li>도구를 꺼내 영점·배터리·타이머 소리를 확인한다</li>
<li>준비물 사진을 한 장 찍고 가방에 넣는다</li>
<li>필기 오답만 스무 장, 타이머 45분을 넘기지 않는다</li>
<li>이동 시간과 식사 자리를 한 번 본다 (필기·실기 장소가 다를 때)</li>
</ul>
<p>유튜브는 닫았습니다. 커뮤니티 합격 후기도 안 읽었습니다. 전날 밤에 읽은 후기가 당일 루트를 흔든 적이 있어서입니다. 식빵 접근 노트나 단과자 층을 복습하고 싶으면, 시험 전날이 아니라 평일 메모로 돌렸습니다.</p>
<p>가족에게는 “내일 시험, 오늘 반죽 없음”이라고 말했습니다. 실패 빵을 나누는 날과 같은 톤으로, 주방을 비웠습니다. 주방이 비면 손이 갈 곳이 없습니다. 그게 전날 밤의 설계였습니다.</p>
<p>이동 시간은 전날 지도만 봤습니다. 실제로 오가는 연습은 모의 주에 이미 했습니다. 시험 전날 밤에 길을 새로 외우면 잠이 늦어집니다. 잠은 당일 손과 붙어 있습니다.</p>`
    },
    {
      id: "if-hands-itch",
      heading: "h2",
      title: "손이 근질거릴 때",
      content: `<p>그래도 손이 근질거렸습니다. 그때 한 일은 공기 반죽 5분이었습니다. 가루 없이 손만 움직여 스크래퍼 위치를 확인하는 정도입니다. 5편에 적어 둔 당일 아침 습관과 비슷하고, 전날 밤에도 그 선에서 끊었습니다. 반죽 온도를 재지 않았고, 오븐도 안 켰습니다.</p>
<p>가루를 저울에 올리는 순간부터는 이미 연습입니다. 전날 규칙의 경계는 거기였습니다. 경계가 흐려지면 한 배치가 시작됩니다. 오븐 예열 버튼을 누르는 것도 같은 선입니다. 예열을 켜면 굽기까지 가게 됩니다.</p>
<p>필기 전날이 실기 전날과 다를 수는 있습니다. 제 회차는 날짜가 갈라져 있어서, 필기 전날은 오답만, 실기 전날은 도구와 손을 쉬기는 쪽으로 나눴습니다. 같은 날 필기·실기인 공고면 허용 목록을 더 짧게 잡으면 됩니다.</p>`
    },
    {
      id: "not-superstition",
      heading: "h2",
      title: "미신이 아니라 전날 기록",
      content: `<p>전날을 비운다고 합격이 보장되지 않습니다. 저는 그 밤에 새 변수를 안 넣어서, 당일 손이 평소 메모와 같았습니다. 그게 전부입니다.</p>
<p>사람마다 전날 한 배치가 마음이 놓일 수 있습니다. 그럴 때는 평소 루트만, 시간 제한을 걸고, 새 영상은 닫는 쪽이 제 타협안이었습니다. 전날 전용 레시피를 만들지 마세요. 시험장에 그 레시피가 없습니다.</p>
<p>공식 시험 시간과 품목은 공고가 우선입니다. 이 글은 2025년 5월 제 전날 메모입니다. 발효 분을 전날 밤에 다시 맞추려 하지 않았습니다. 눌림 습관은 <a href="../posts/exam-item-fermentation-poke-not-minutes.html">1차 발효 노트</a>에 있고, 전날 일은 가방입니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "시험이 가까운 주",
      content: `<p>달력에 시험 전날을 회색으로 칠해 두세요. 반죽 없음, 도구 사진, 오답 스무 장. <a href="../posts/baker-cert-8month-roadmap.html">로드맵</a> 마지막 주와 모의 전날을 같은 규칙으로 맞춰 두면, 시험 전날이 갑자기 낯설지 않습니다.</p>
<p>지금 일정이 아직 멀면 이 글을 북마크만 해 두세요. 전날 규칙을 두 달 전부터 매일 쓰면 연습량이 줄어듭니다. 쓸 때는 시험 주입니다. 모의 전날을 미리 한 번 비워 보면, 시험 전날이 연습이 됩니다. 모의 전날에 새 성형을 넣은 실수는 시험 전날에 반복하지 않았습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "편집 메모",
      content: `<p>당일 준비물·오븐 첫 5분은 5편을 보세요. 전날 장시간 연습과 손목은 쉬는 기준 칼럼을 보세요. 이 글은 그 사이, 시험 전날 밤에 무엇을 안 했는지만 적습니다. 새 레시피를 전날 밤에 검색하지 않은 이유도 같습니다. 검색은 변수를 늘립니다. 전날 밤의 일은 줄이는 쪽입니다.</p>
<p>문의는 <a href="../contact/">연락</a>으로 받습니다. 환경이 다르면 전날 한 배치가 맞을 수도 있습니다. 공통으로 반복되면 수정일을 남깁니다. 단과자 층(<a href="../posts/exam-item-sweet-roll-approach.html">접근 노트</a>)을 전날 밤에 3층까지 열고 싶지 않았습니다. 장식은 평일 몫입니다.</p>`
    }
  ],
  summary:
    "2025년 5월 실기 전날, 새 품목과 풀코스 반죽을 접고 도구 확인·오답 스무 장만 한 이유를 정리했습니다. 합격 보장이 아니라 전날 손을 흔들지 않으려던 기록입니다.",
  relatedSlugs: [
    "baker-cert-exam-day-pass",
    "baker-cert-mock-three-weeks",
    "baker-cert-one-page-cheatsheet"
  ]
};

const columns = load("data/columns.js", "COLUMNS_DATA");
if (columns.some((c) => c.slug === col.slug)) {
  console.error("exists");
  process.exit(1);
}

const n = postCharCount(col);
console.log("chars", n);
if (n < 2000) {
  console.error("under 2000");
  process.exit(1);
}

const dir = path.join(ROOT, "assets/images/illustrations/columns");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  path.join(dir, `${col.slug}.svg`),
  makeSvg(col.slug, "시험 전날", "새 연습을 안 한 밤"),
  "utf8"
);

columns.unshift(col);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓", col.slug, col.publishedAt);
