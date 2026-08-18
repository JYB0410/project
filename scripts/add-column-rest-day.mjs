/**
 * 칼럼 1편: 손목이 남을 때 반죽을 쉬는 기준
 * 발행 2026-08-18
 * node scripts/add-column-rest-day.mjs
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
  <text x="210" y="310" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" fill="#fff" font-weight="700">REST</text>
  <text x="300" y="270" font-family="system-ui,sans-serif" font-size="38" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="300" y="328" font-family="system-ui,sans-serif" font-size="22" fill="#555">${escapeXml(sub)}</text>
  <text x="300" y="400" font-family="system-ui,sans-serif" font-size="18" fill="#777">칼럼 일러스트 · 의료 조언 아님</text>
</svg>`;
}

const col = {
  slug: "rest-day-when-wrists-hurt",
  title: "손목이 남을 때 반죽을 쉬는 기준",
  subtitle: "하루를 비우는 것이 게으름이 아니라던 날들",
  author: "정지석",
  publishedAt: "2026-08-18",
  updatedAt: "2026-08-18",
  status: "published",
  excerpt:
    "제빵기능사 준비 중반, 전날 연습을 늘린 다음 날 성형 속도가 떨어졌습니다. 그때부터 손목·어깨가 남으면 반죽을 접고 필기나 메모만 하는 날을 따로 두었습니다. 의료 조언이 아니라, 제가 쓰던 쉬는 기준입니다.",
  perspective:
    "연습량을 늘리면 실력이 는다고 믿기 쉽습니다. 저는 그 반대인 날을 몇 번 겪고 나서야, ‘오늘 반죽 없음’을 계획에 넣는 편이 시험 전까지 손을 유지하는 방법이라는 걸 알았습니다.",
  sections: [
    {
      id: "the-day",
      heading: "h2",
      title: "전날 6시간 뒤에 손이 멈춘 날",
      content: `<p>2025년 4월, 시험이 가까워지자 하루 연습을 늘렸습니다. 학원 수업 뒤에 집에서도 반죽을 이어 갔고, 그날은 대략 여섯 시간 가까이 손을 썼습니다. 다음 날 아침, 성형할 때 손목이 먼저 말을 듣지 않았습니다. 속도가 눈에 띄게 느려졌고, 봉합이 헐거워지는 실수가 반복됐습니다.</p>
<p>그날 메모 한 줄은 이랬습니다. “어제 양↑ → 오늘 손↓”. 레시피가 바뀐 것이 아니었습니다. <strong>전날 분량이 다음 날 손을 깎았다</strong>는 기록만 남았습니다. 그다음부터는 시험 직전 주에 장시간 몰아치기를 하지 않기로 했습니다.</p>
<p>실기 실수 글(<a href="../posts/baker-cert-practical-mistakes.html">3편</a>)과 모의 3주(<a href="../posts/baker-cert-mock-three-weeks.html">모의</a>)에도 같은 경험이 짧게 들어 있습니다. 이 칼럼은 그 한 줄을 쉬는 기준으로 풀어 쓴 글입니다.</p>
<p>이 글은 의료·재활 조언이 아닙니다. 통증·저림이 심하거나 오래가면 전문가의 판단을 따르는 것이 맞습니다. 저는 집에서 쓰던 <strong>연습량 조절 메모</strong>만 남깁니다. 2024년 가을 초반에는 이 메모가 없어서, 아픈 날에도 같은 양을 반복했습니다. 기록이 생긴 뒤로는 같은 실수를 한 번 덜 했습니다.</p>`
    },
    {
      id: "signals",
      heading: "h2",
      title: "반죽을 접던 신호 세 가지",
      content: `<p>완벽한 체크리스트는 아니었습니다. 다만 아래 셋 중 둘이 겹치면 그날 반죽은 접었습니다.</p>
<ol>
<li><strong>전날 손이 길었다</strong> — 학원+집 연속, 또는 모의 다음 날.</li>
<li><strong>오늘 아침에 손목·어깨가 무겁다</strong> — 스트레칭으로 바로 안 풀리는 무게.</li>
<li><strong>성형 속도가 평소보다 느리다</strong> — 같은 품목인데 봉합·무게 확인이 밀림.</li>
</ol>
<p>셋이 동시에 오면 거의 무조건 쉬었습니다. 하나만이면 반죽 1배치만 하거나, 굽기 없이 분할·무게만 하고 끝냈습니다. <a href="quit-job-weekly-routine.html">루틴 칼럼</a>의 ‘작게 재개’와 같은 크기입니다.</p>
<p>식빵·단과자처럼 손이 많이 가는 날은 신호가 더 빨리 왔습니다. 품목 접근 노트(<a href="../posts/exam-item-white-bread-fail-points.html">식빵</a>·<a href="../posts/exam-item-sweet-roll-approach.html">단과자 계열</a>)에서 말한 1층을 무리해서 두 번 돌리면, 다음 날 모의가 무너지는 패턴이 있었습니다.</p>
<p>시험 한 달 전에도 같은 신호를 썼습니다. ‘남은 날이 적다’는 이유로 신호를 무시하면, 그다음 모의에서 시간을 더 잃었습니다. 급할수록 전날 양을 지키는 편이 제게는 빨랐습니다.</p>`
    },
    {
      id: "instead",
      heading: "h2",
      title: "쉰 날에도 하던 것",
      content: `<p>반죽을 접는다고 하루를 통째로 버리지는 않았습니다. 대신 손이 덜 가는 일로 바꿨습니다.</p>
<ul>
<li><strong>필기 45분</strong> — 틀린 유형만. <a href="../posts/baker-cert-written-tips.html">4편</a>과 같은 슬롯.</li>
<li><strong>도구·타이머 점검</strong> — 저울 영점, 타이머 소리. <a href="tools-first-month-keep.html">도구 칼럼</a>.</li>
<li><strong>어제 메모 다시 읽기</strong> — 다음 변수 하나만 고르기. 새 레시피 검색은 하지 않음.</li>
<li><strong>공고·일정 확인</strong> — 접수·시험일만. 유튜브 장시간 시청은 금지.</li>
</ul>
<p>이 네 가지면 ‘오늘은 연습 실패’가 아니라 ‘오늘은 손 휴식 + 머리 정리’로 기록됐습니다. 퇴사 후 루틴이 무너진 날과 같은 복구 방식입니다.</p>
<p>합격 이후 R&amp;D에서도 같은 규칙을 썼습니다. 실험 변수를 열고 싶은 날에도 손목이 남으면, 굽지 않고 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a> 표만 고치거나 메모 양식만 적었습니다. 변수를 하루 미루는 것이 일지 번호를 건너뛰는 것보다 나았습니다.</p>
<p>필기만 하는 날에도 타이머는 켰습니다. 45분이 끝나면 자리에서 일어나는 것이 규칙이었습니다. 쉬는 날을 ‘영상 두 시간’으로 채우면 손도 머리도 쉬지 못했습니다.</p>`
    },
    {
      id: "not-lazy",
      heading: "h2",
      title: "쉬는 날을 죄책감으로 쓰지 않기",
      content: `<p>처음에는 쉬는 날을 달력에 쓰기가 부끄러웠습니다. ‘남들은 매일 굽는데’라는 비교가 먼저 왔습니다. 그런데 손을 밀어붙인 주의 모의 성적이, 하루를 비운 다음 주의 모의보다 나빴습니다. 제 기준으로는 <strong>쉬는 날이 있는 주가 더 안정적</strong>이었습니다.</p>
<p>가족에게는 “오늘은 반죽 없음”이라고 미리 말했습니다. 실패 빵을 나누는 날과 반대로, 기대치를 낮추는 말이었습니다. <a href="sharing-failed-bread.html">실패 빵 칼럼</a>과 같은 약속 톤입니다.</p>
<p>달력에 ‘반죽 없음’을 빨간 표시가 아니라 회색 칸으로 두었습니다. 취소가 아니라 <strong>계획된 빈 칸</strong>이었습니다. 시험 6주 전 모의 주에는 모의 전날을 일부러 이 칸으로 비웠습니다. 전날을 비운 모의가, 전날까지 굽고 들어간 모의보다 손이 덜 떨렸습니다.</p>
<p>주변에서 “하루만 더 하면 된다”고 할 때가 있었습니다. 그 말을 따르면 다음 날 메모에 같은 문장이 또 생겼습니다. 그래서 쉬는 기준을 글로 정해 두고, 당일 감정으로 바꾸지 않으려 했습니다.</p>`
    },
    {
      id: "limits",
      heading: "h2",
      title: "이 글이 말하지 않는 것",
      content: `<p>특정 스트레칭·보조제·치료를 권하지 않습니다. 통증의 원인 진단도 하지 않습니다. 제가 할 수 있는 말은 “전날 양을 줄이고, 다음 날 손을 다시 재본다” 정도입니다.</p>
<p>손목이 반복해서 남으면 연습 계획을 바꾸기 전에, 필요한 경우 진료를 받는 편이 맞습니다. 이 사이트는 식품·건강 판단을 대체하지 않습니다. 면책 고지와 같은 범위입니다.</p>
<p>학원 강사님께서 자세·작업대를 봐 주신 적은 있습니다. 그건 제 환경의 피드백이지, 일반 처방이 아닙니다. 작업대 높이·반죽 위치가 달라지면 제 신호도 달라질 수 있습니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "이번 주 적용하기",
      content: `<p>이번 주 달력에 <strong>반죽 없음 하루</strong>를 먼저 쓰세요. 전날 손이 길었거나 모의 다음 날이면 그날이 후보입니다.</p>
<p>쉰 날 할 일 세 줄: 필기 45분 / 어제 메모 다시 읽기 / 다음 변수 하나만 적기. 새 레시피 검색은 넣지 않습니다.</p>
<p>기능사 준비 중이면 <a href="../posts/baker-cert-8month-roadmap.html">8개월 로드맵</a>의 후반 주에 이 칸을 끼워 보세요. R&amp;D 중이라면 실험 일정을 하루 미루는 것과 같습니다. 한 장 요약(<a href="../posts/baker-cert-one-page-cheatsheet.html">치트시트</a>) 당일 항목에도 ‘전날 장시간 연습 금지’를 적어 두면 시험 주에 도움이 됐습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "편집 메모",
      content: `<p>2025년 4월 전후 제 메모와, 그 이후에도 같은 규칙을 쓴 경험을 바탕으로 했습니다. 사람·주방·작업량이 다르면 신호도 다릅니다.</p>
<p>연결: <a href="../posts/baker-cert-mock-three-weeks.html">모의 3주</a>, <a href="quit-job-weekly-routine.html">루틴 칼럼</a>, <a href="../posts/baker-cert-practical-mistakes.html">실기 실수</a>. 문의는 <a href="../contact/">연락</a>으로 받습니다. 다른 환경에서 쉬는 기준이 있으면 알려 주세요. 공통으로 반복되면 수정일과 함께 이 칼럼을 보완합니다.</p>`
    }
  ],
  summary:
    "기능사 준비 중반, 전날 장시간 연습 다음 날 손이 느려진 경험을 계기로 손목·어깨가 남으면 반죽을 접고 필기·메모만 하던 기준을 정리했습니다. 의료 조언이 아니라 연습량 조절 기록입니다.",
  relatedSlugs: [
    "baker-cert-mock-three-weeks",
    "baker-cert-practical-mistakes",
    "baker-cert-8month-roadmap"
  ]
};

const columns = load("data/columns.js", "COLUMNS_DATA");
if (columns.some((c) => c.slug === col.slug)) {
  console.error("exists", col.slug);
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
const svg = `${col.slug}.svg`;
fs.writeFileSync(
  path.join(dir, svg),
  makeSvg(col.slug, "손목이 남을 때", "반죽을 쉬는 기준"),
  "utf8"
);

columns.unshift(col);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓ added", col.slug, col.publishedAt);
