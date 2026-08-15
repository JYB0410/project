/**
 * 기능사 품목 접근 노트 카테고리 + 글 2편
 * 발행: 2026-08-02, 2026-08-08
 * node scripts/add-exam-item-notes.mjs
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
  const hue2 = (hue + 48) % 360;
  const id = slug.replace(/[^a-z0-9-]/gi, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue},36%,95%)"/>
      <stop offset="100%" stop-color="hsl(${hue2},40%,84%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g-${id})"/>
  <rect x="72" y="88" width="1056" height="500" rx="28" fill="#fff" opacity="0.93"/>
  <rect x="120" y="160" width="14" height="200" rx="7" fill="hsl(${hue},50%,45%)"/>
  <text x="170" y="220" font-family="system-ui,sans-serif" font-size="40" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="170" y="280" font-family="system-ui,sans-serif" font-size="24" fill="#555">${escapeXml(sub)}</text>
  <text x="170" y="360" font-family="system-ui,sans-serif" font-size="20" fill="#777">완성 그램 레시피 없음 · 실패 지점·변수 순서</text>
  <rect x="170" y="400" width="420" height="12" rx="6" fill="hsl(${hue},35%,82%)"/>
  <rect x="170" y="432" width="320" height="12" rx="6" fill="hsl(${hue},28%,88%)"/>
</svg>`;
}

const post1 = {
  slug: "exam-item-white-bread-fail-points",
  title: "식빵 실기 — 집에서 먼저 무너지는 세 지점",
  subtitle: "완성 그램 표 없이, 발효·성형·굽기만 순서대로",
  category: "exam-item-notes",
  author: "정지석",
  publishedAt: "2026-08-02",
  updatedAt: "2026-08-02",
  featured: false,
  status: "published",
  excerpt:
    "제빵기능사 실기에서 식빵을 준비할 때, 저는 레시피를 늘리기보다 집에서 먼저 무너지던 세 지점(반죽 종료·1차 발효 판단·성형 후 무게)을 고쳤습니다. 2024~2025 제 경험 기준이며 완성 그램 표는 없습니다.",
  sections: [
    {
      id: "what-this-is",
      heading: "h2",
      title: "이 글이 레시피가 아닌 이유",
      content: `<p>이 글은 <strong>식빵 완성 레시피</strong>가 아닙니다. 재료 그램·공식 배합표를 그대로 옮기지 않습니다. 학원·시험장·집 오븐이 다르면 같은 숫자도 다른 빵이 되기 때문입니다. 같은 이유로 이 사이트는 <a href="../columns/why-no-complete-recipe.html">완성 레시피를 올리지 않는 칼럼</a>을 따로 두었습니다.</p>
<p>대신 2024년 10월~2025년 4월, 식빵 계열 연습을 반복하며 <strong>집에서 먼저 무너지던 지점</strong>만 남깁니다. 시험 품목명·배점은 해마다 바뀔 수 있으니 공식 공고를 확인하세요. 저는 2024~2025 회차 기준으로 기록합니다.</p>
<p>공정 전반 실수는 <a href="baker-cert-practical-mistakes.html">실기 실수 3편</a>, 시간 연습은 <a href="baker-cert-mock-three-weeks.html">모의 3주</a>와 함께 읽으면 됩니다. 이 글은 그중 <strong>식빵 한 품목</strong>만 깊게 자른 접근 노트입니다.</p>
<p>목표 문장 한 줄: 레시피를 늘리기 전에, <strong>같은 반죽으로 세 번 무너진 이유를 메모로 남긴다</strong>.</p>
<p>학원에서 받은 배합표를 집으로 가져와 그대로 따라 했을 때, 가장 먼저 어긋난 것은 재료가 아니라 <strong>환경 메모의 부재</strong>였습니다. 이 글은 그 공백을 메우기 위한 식빵 전용 체크리스트에 가깝습니다.</p>`
    },
    {
      id: "why-white-bread",
      heading: "h2",
      title: "왜 식빵부터 적나",
      content: `<p>식빵은 기능사 실기에서 ‘기본’처럼 느껴지지만, 저에게는 <strong>가장 오래 손이 간 품목</strong>이었습니다. 겉보기엔 단순한 직사각인데, 반죽 종료·발효·성형 무게·굽기 색이 동시에 어긋나면 한 번에 무너집니다.</p>
<p>단과자·장식 빵은 ‘눈에 보이는 실패’가 빨리 옵니다. 식빵은 썰어 보기 전까지 속 조직이 감춰져, 초반에는 “대충 됐다”고 착각하기 쉬웠습니다. 그래서 접근 노트 첫 편을 식빵으로 잡았습니다.</p>
<p>밤식빵 R&amp;D(<a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>)와 식빵 실기는 목표가 다릅니다. 실기는 <strong>제한 시간·규격·반복 안정</strong>, R&amp;D는 기억의 식감입니다. 이 글은 실기 쪽만 다룹니다.</p>
<p>8개월 로드맵(<a href="baker-cert-8month-roadmap.html">2편</a>) 중반에 식빵 반복이 들어가 있다면, 이 노트를 그 주간의 ‘무엇을 고칠지’ 목록으로 쓰면 됩니다. 품목을 늘리기 전에 식빵 세 지점이 안정되는지가 더 중요했습니다.</p>`
    },
    {
      id: "fail-three",
      heading: "h2",
      title: "집에서 먼저 무너지던 세 지점",
      content: `<p>제가 메모에 가장 많이 적은 실패는 아래 셋이었습니다. 품목 레시피를 바꾼 날이 아니라, <strong>같은 학원 루트를 집에서 재현</strong>할 때 터진 것들입니다.</p>
<ol>
<li><strong>반죽 종료 온도를 안 재고 손감만 믿음</strong> — 계량은 맞는데 날이 바뀌면 반죽 상태가 달라짐. 물·실내·종료 온도를 한 줄에 적은 뒤부터 두 번째 배치 수정이 빨라졌습니다.</li>
<li><strong>1차 발효를 ‘분’으로만 끝냄</strong> — 레시피 40분을 그대로 쓰면 겨울·봄이 완전히 달랐습니다. 손가락 눌림·표면 텐션을 같이 보기 시작한 뒤 과·저발효가 줄었습니다.</li>
<li><strong>성형 후 무게 확인을 빼먹음</strong> — 한 덩어리는 규격 근처, 다음은 크게 벗어나 굽기 전에 이미 감점 구간. 성형 직후 저울 한 번이 재작업 시간보다 짧았습니다.</li>
</ol>
<p>세 지점은 <a href="baker-cert-practical-mistakes.html">3편</a>과 겹칩니다. 여기서는 식빵 연습 날에만 쓰던 <strong>체크 순서</strong>로 다시 묶습니다.</p>
<p>굽기(예열·색)도 중요했지만, 초반 식빵 실패의 70%는 위 셋에서 이미 결정되어 있었습니다. 오븐 보정은 <a href="../columns/home-oven-temperature-notes.html">오븐 칼럼</a>을 참고하고, 이 글에서는 반죽·발효·성형에 집중합니다.</p>`
    },
    {
      id: "order",
      heading: "h2",
      title: "변수는 하나만 — 식빵 연습 순서",
      content: `<p>한 주에 반죽·발효·성형을 동시에 고치면, 무엇이 효과였는지 모릅니다. 저는 식빵 주간을 이렇게 나눴습니다.</p>
<ul>
<li><strong>1주</strong> — 반죽 종료 온도 메모만 고정. 발효·성형은 학원에서 하던 그대로.</li>
<li><strong>2주</strong> — 1차 발효 판단(분+눌림)만 손댐. 반죽 종료 습관은 유지.</li>
<li><strong>3주</strong> — 성형 후 무게·봉합만 손댐.</li>
<li><strong>4주 이후</strong> — 주 1회 타이머 모의(<a href="baker-cert-mock-three-weeks.html">모의 3주</a>)에 식빵 루트 포함.</li>
</ul>
<p>학원 없는 날은 집 오븐 색이 달라도, 위 순서의 1~3주는 <strong>동선 연습</strong>으로 가치가 있었습니다. “집 식빵을 학원처럼 예쁘게”가 아니라 “시험 날 손이 멈추지 않게”가 목표였습니다.</p>
<p>물 온도를 바꾸는 실험과 발효 분을 바꾸는 실험을 같은 날 하지 마세요. 식빵은 실패 원인이 겹치기 쉽습니다.</p>`
    },
    {
      id: "memo",
      heading: "h2",
      title: "식빵 연습 메모 양식 (복사용)",
      content: `<p>A4 한 줄 버전입니다. 그램 전체 레시피가 아니라 <strong>비교 가능한 숫자</strong>만 남깁니다.</p>
<ul>
<li>날짜 / 장소(학원·집) / 품목: 식빵</li>
<li>물 ○°C · 실내 ○°C · 반죽 종료 ○°C</li>
<li>1차 ○분 · 눌림(약/중/강) · 표면(팽팽/느슨)</li>
<li>성형 후 무게 (덩어리별) · 봉합 한 줄</li>
<li>굽기 다이얼·예열·색·분 (집이면 상화 메모 가능 시)</li>
<li>망한 점 한 줄 · 다음엔 변수 하나만</li>
</ul>
<p>사진을 넣을 거면 단면 한 장만, 그것도 실제 그 날 구운 것만. 스톡 사진으로 식빵을 대체하지 않습니다. (R&amp;D 일지와 같은 원칙입니다.)</p>
<p>모의 날에는 위 메모에 <strong>시작~끝 총 분</strong>만 추가하면 됩니다.</p>`
    },
    {
      id: "common-traps",
      heading: "h2",
      title: "식빵 연습에서 빠지기 쉬운 함정",
      content: `<p>첫 번째: 유튜브 식빵 레시피를 시험 루트에 섞기. 손이 늘기 전에 배합이 바뀌면 원인이 안 보입니다.</p>
<p>두 번째: 성형만 예쁘게 반복하고 발효 판단을 미루기. 예쁜 빵틀 모양이 속 조직을 보장하지 않습니다.</p>
<p>세 번째: 시험 2주 전 새 식빵 변형(토핑·추가 공정) 도전. 모의 주에는 익숙한 루트만.</p>
<p>네 번째: 집 오븐 색이 안 나온다고 반죽을 계속 바꾸기. 먼저 다이얼·예열 대응표(<a href="../columns/home-oven-temperature-notes.html">오븐 칼럼</a>)를 쌓는 편이 빠릅니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "지금 식빵이 막힌 분께",
      content: `<p>이번 주 목표가 “완벽한 식빵”이면 범위를 줄이세요. <strong>세 지점 중 하나</strong>만 고르고, 같은 반죽으로 두 번만 반복해도 메모가 쌓입니다.</p>
<p>학원 루트와 집 루트가 다르면, 재료 표를 맞추기보다 <strong>공정 기록 형식</strong>을 맞추는 쪽이 재현에 유리했습니다.</p>
<p>다른 회차·학원 품목과 다르면 <a href="../contact/">문의</a>로 알려 주세요. 확인 후 수정일을 남기겠습니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>오늘 할 일: 메모 양식 한 장을 인쇄하거나 메모장에 붙여 두기. 다음 식빵 연습 때 세 지점 중 <strong>하나만</strong> 의식적으로 체크.</p>
<p>시리즈 맥락: <a href="baker-cert-series-roadmap.html">6편 목차</a> · <a href="baker-cert-8month-roadmap.html">로드맵</a> · <a href="baker-cert-one-page-cheatsheet.html">한 장 요약</a>.</p>
<p>같은 카테고리의 다음 글은 단과자빵 계열 접근 노트입니다. 식빵과 달리 ‘보이는 실패’가 빠른 품목을 다룹니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>식빵 실기 접근의 핵심은 레시피 수집이 아니라, <strong>반죽 종료·발효 판단·성형 무게</strong>를 같은 형식으로 남기는 일이었습니다. 그램 표를 사이트에 올리지 않는 이유는, 그 표가 당신의 오븐을 대신하지 못하기 때문입니다.</p>
<p>이 글은 품목 접근 노트 1편입니다. 합격 보장이 아니며, 최신 요강은 공식 자료를 따르세요.</p>`
    }
  ],
  summary:
    "제빵기능사 식빵 연습에서 집에서 먼저 무너지던 세 지점(반죽 종료 온도·1차 발효 판단·성형 후 무게)과 주차별 변수 하나 순서, 메모 양식, 함정을 정리했습니다. 완성 그램 레시피는 없습니다.",
  commonMistakes: [
    "식빵 레시피를 여러 개 섞어 원인 추적 불가",
    "발효를 분만 보고 끝냄",
    "성형 후 무게 확인 생략",
    "모의 주에 새 식빵 변형 추가"
  ],
  checklist: [
    "물·실내·반죽 종료 온도 한 줄 적기",
    "1차 발효: 분 + 눌림 + 표면",
    "성형 직후 저울",
    "다음 연습 변수 하나만 고르기"
  ],
  relatedSlugs: [
    "baker-cert-practical-mistakes",
    "baker-cert-mock-three-weeks",
    "baker-cert-8month-roadmap",
    "exam-item-sweet-roll-approach"
  ],
  faq: [
    {
      q: "식빵 재료 그램을 알려 주실 수 있나요?",
      a: "올리지 않습니다. 학원·집·시험장 기준이 달라 오해를 부릅니다. 대신 실패 지점과 메모 형식을 가져가 주세요."
    },
    {
      q: "집에서만 연습해도 식빵 실기에 도움이 되나요?",
      a: "동선·온도·무게 습관에는 도움이 됩니다. 오븐 색·시간은 학원·시험장과 다를 수 있어 메모로 구분하세요."
    }
  ]
};

const post2 = {
  slug: "exam-item-sweet-roll-approach",
  title: "단과자빵 계열 — 성형·굽기만 먼저 보는 접근 순서",
  subtitle: "장식에 손대기 전, 손 속도·색·동선을 고정하기",
  category: "exam-item-notes",
  author: "정지석",
  publishedAt: "2026-08-08",
  updatedAt: "2026-08-08",
  featured: false,
  status: "published",
  excerpt:
    "제빵기능사 실기의 단과자빵·소보로 등 ‘손이 많이 가는’ 계열을 준비할 때, 저는 레시피보다 성형 속도·굽기 색·마무리 동선을 먼저 고정했습니다. 완성 그램 표 없이 접근 순서만 정리합니다.",
  sections: [
    {
      id: "what-this-is",
      heading: "h2",
      title: "단과자빵 ‘계열’로 묶는 이유",
      content: `<p>시험 품목명은 해마다·회차마다 달라질 수 있습니다. 이 글에서 <strong>단과자빵 계열</strong>이란, 식빵처럼 큰 한 덩어리가 아니라 <strong>개수·성형·표면 처리</strong>가 시간을 잡아먹는 실기 빵을 말합니다. 소보로·단과자·비슷한 손 작업 빵이 여기에 가깝습니다.</p>
<p>완성 레시피·토핑 그램표는 올리지 않습니다. <a href="../columns/why-no-complete-recipe.html">레시피 정책</a>과 같습니다. 대신 2024~2025 준비 과정에서 제가 시간을 잃었던 순서와, 나중에 고친 <strong>접근 순서</strong>만 남깁니다.</p>
<p>식빵 쪽 세 지점은 <a href="exam-item-white-bread-fail-points.html">식빵 접근 노트</a>에 있습니다. 이 글은 그와 다른 축—<strong>손이 느려지는 구간</strong>—을 다룹니다.</p>
<p>공식 품목 목록은 반드시 최신 공고를 보세요. 이 글은 특정 연도 시험 문제를 복원하지 않습니다.</p>`
    },
    {
      id: "why-hard",
      heading: "h2",
      title: "식빵과 다른 난이도",
      content: `<p>식빵은 실패가 속에 숨습니다. 단과자 계열은 실패가 <strong>겉에 바로</strong> 보입니다. 그래서 초반에 장식·토핑에 집착하기 쉽고, 정작 시험에서는 성형 개수를 못 맞추거나 굽기 색이 들쭉날쭉해 시간을 잃었습니다.</p>
<p>저는 한동안 “예쁜 소보로 사진”을 따라 하다 주간 연습이 세 번 무너졌습니다. 강사 피드백은 단순했습니다. <strong>먼저 같은 크기로 N개를 시간 안에</strong>, 그다음 표면.</p>
<p>모의 주(<a href="baker-cert-mock-three-weeks.html">모의 3주</a>)에 단과자 계열을 넣으면, 타이머는 장식이 아니라 <strong>분할·성형·판 배치</strong>에서 먼저 울립니다. 그 순서를 인정하는 것이 접근의 시작이었습니다.</p>
<p>식빵 접근 노트와 쌍으로 읽으면, “큰 한 덩어리”와 “여러 개 손 작업”의 실패 축이 구분됩니다. 둘 다 레시피가 아니라 <strong>손의 순서</strong> 이야기입니다.</p>`
    },
    {
      id: "three-layers",
      heading: "h2",
      title: "세 층으로 나누기 — 장식은 마지막",
      content: `<p>연습을 세 층으로 나눴습니다. 한 층이 안정되기 전에 다음 층으로 가지 않습니다.</p>
<ol>
<li><strong>1층: 분할·성형·무게</strong> — 개수와 크기 편차. 저울·눈대중 중 시험장에서 가능한 방법만.</li>
<li><strong>2층: 굽기 색·시간</strong> — 집/학원 오븐 차이. 다이얼·선반 위치 메모. 레시피 변경 금지.</li>
<li><strong>3층: 표면·토핑·마무리</strong> — 시간이 남거나, 1·2층이 주 3회 이상 안정된 뒤에만.</li>
</ol>
<p>초반 두 달은 3층을 거의 하지 않았습니다. “못생겨도 시간 안에 같은 크기”가 목표였고, 그게 시험 직전 멘탈에 더 도움이 됐습니다.</p>
<p>도구 최소 세트(저울·온도계·타이머)는 <a href="../columns/tools-first-month-keep.html">도구 칼럼</a>과 같습니다. 단과자용 예쁜 도구를 더 사기 전에 1층을 먼저 보세요.</p>
<p>1층이 흔들리면 2층에서 색을 맞춰도 개수 부족으로 모의가 끝납니다. 반대로 1층만 완벽하고 2층을 안 보면, 시험장 오븐 첫 5분(<a href="baker-cert-exam-day-pass.html">5편</a>)에 당황합니다. 층은 순서가 있고, 동시에 열지 않는 것이 핵심입니다.</p>`
    },
    {
      id: "time-sinks",
      heading: "h2",
      title: "시간을 잃던 구간 (제 메모)",
      content: `<p>실제 모의 메모에 반복해 적은 구간입니다.</p>
<ul>
<li><strong>분할 후 재배치</strong> — 크기가 안 맞아 다시 뭉침. → 성형 직후 무게 습관을 식빵과 공유.</li>
<li><strong>토핑 준비 타이밍</strong> — 반죽 발효 중에 안 해 두고 성형 후 허둥지둥. → 발효 중 미장 동선을 타이머 앞에 적기.</li>
<li><strong>굽기 중 문 여닫기</strong> — 색 확인이 잦아 온도 하락. → 확인 시점 1~2회만 메모에 고정.</li>
<li><strong>마무리 정리</strong> — 빵은 끝났는데 도구·이름이 남음. → 모의 때 끝 5분을 비워 두기.</li>
</ul>
<p>식빵 노트와 겹치는 무게 습관은 의도적입니다. 품목이 달라도 <strong>손의 체크리스트</strong>는 같게 가져가는 편이 실기 당일 실수를 줄였습니다.</p>
<p>한 가지 더: “한 개만 더 예쁘게” 고치다 전체를 놓치는 패턴입니다. 모의에서는 평균을 올리고, 예쁨은 평일 1층 연습에서만 욕심냈습니다.</p>`
    },
    {
      id: "weekly",
      heading: "h2",
      title: "주간 연습 프레임 (레시피 없이)",
      content: `<p>단과자 계열 주간 예시입니다. 재료 표는 학원 루트를 따르고, 여기에는 순서만 적습니다.</p>
<ul>
<li><strong>월·수</strong> — 1층만. 분할·성형·무게. 굽기는 하더라도 색 평가 최소.</li>
<li><strong>금</strong> — 2층. 같은 성형으로 굽기 색만 비교. 다이얼·선반 메모.</li>
<li><strong>토 (모의 주)</strong> — 시간 재기. 3층은 “해도 감점 없는 최소”만.</li>
</ul>
<p>주 5일 풀코스는 <a href="../columns/quit-job-weekly-routine.html">루틴 칼럼</a>처럼 무너지기 쉽습니다. 단과자는 손이 더 피곤해서, 최소 단위가 더 중요했습니다.</p>
<p>필기 병행은 <a href="baker-cert-written-tips.html">4편</a>처럼 수·목 짧은 슬롯을 유지했습니다. 손이 바쁜 주에도 이론을 완전히 끊지 않기.</p>
<p>손목이 아픈 날에는 3층을 접고 1층 분할만 하거나, 아예 필기 45분으로 대체했습니다. 무리한 하루가 다음 주 모의를 망친 적이 있습니다.</p>`
    },
    {
      id: "memo",
      heading: "h2",
      title: "단과자 계열 메모 칸",
      content: `<p>식빵 메모에 칸 네 개만 추가하면 됩니다.</p>
<ul>
<li>목표 개수 / 실제 개수</li>
<li>개당 무게 편차 (대략)</li>
<li>표면 작업에 쓴 분 (있으면)</li>
<li>굽기 중 문 연 횟수</li>
</ul>
<p>실패 한 줄 예시: “토핑 준비 0분 → 성형 후 8분 허비”. 다음 주 변수는 “발효 중 토핑 준비” 하나만.</p>
<p>사진이 필요하면 같은 각도 전체 1장. 스톡 이미지로 대체하지 않습니다.</p>
<p>모의 날에는 시작 시각·끝 시각·초과 분을 식빵 모의와 같은 네 칸 형식으로 적습니다. 품목이 달라도 기록 형식이 같으면 주간 리뷰가 빨라집니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "장식부터 연습 중인 분께",
      content: `<p>지금 연습 영상의 90%가 토핑이라면, 한 주는 일부러 표면 없이 1층만 해 보세요. 지루하지만 시험 시계는 그쪽을 먼저 봅니다.</p>
<p>식빵이 아직 불안정하면 <a href="exam-item-white-bread-fail-points.html">식빵 노트</a>를 먼저, 단과자는 그다음이 안전합니다. 동시에 두 품목의 3층을 열지 마세요.</p>
<p>환경이 다르면 <a href="../contact/">문의</a>로 알려 주세요. 학원 없이 준비 중이어도 1층(개수·무게·시간)은 집 주방에서 연습할 수 있습니다. 색은 학원·시험장 오븐 메모로 보완하세요.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>이번 주: 단과자 계열 연습 일지에 “층(1/2/3)” 표시를 남기기. 3층 날짜가 연속 3회면 과한 것입니다.</p>
<p>연결 글: <a href="baker-cert-practical-mistakes.html">실기 실수</a> · <a href="baker-cert-mock-three-weeks.html">모의 3주</a> · <a href="exam-item-white-bread-fail-points.html">식빵 접근</a>.</p>
<p>로드맵 중반 이후(<a href="baker-cert-8month-roadmap.html">8개월</a>)에 이 노트를 끼워 넣으면, 품목 수를 늘리기 전에 손 속도를 점검하는 체크포인트가 됩니다.</p>
<p>시험 당일 체크리스트(<a href="baker-cert-one-page-cheatsheet.html">한 장 요약</a>)에 “단과자: 1층 우선” 한 줄을 추가해 두면, 당일 욕심을 줄이는 데 도움이 됐습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>단과자빵 계열은 예쁨이 아니라 <strong>같은 크기·시간·색</strong>이 먼저였습니다. 장식은 그 위의 층입니다. 이 글도 그램 레시피가 아니라 접근 순서만 담았습니다.</p>
<p>품목 접근 노트 2편입니다. 시험 요강은 공식 자료를 따르세요. 식빵 노트와 함께 두면, 실기 손이 ‘큰 빵’과 ‘여러 개 빵’ 두 모드로 정리됩니다.</p>`
    }
  ],
  summary:
    "기능사 실기 단과자빵·소보로 등 손이 많이 가는 계열을 1층(분할·성형)·2층(굽기 색)·3층(표면)으로 나누고, 시간 손실 구간·주간 프레임·메모 칸을 정리했습니다. 완성 레시피는 없습니다.",
  commonMistakes: [
    "장식·토핑부터 연습해 손 속도가 안 늘기",
    "개수·무게 편차 없이 예쁘기만 추구",
    "굽기 중 문을 자주 열어 색·온도 흔들림",
    "식빵과 단과자 3층을 같은 주에 동시 진행"
  ],
  checklist: [
    "이번 연습 층(1/2/3) 표시",
    "목표 개수 vs 실제 개수 기록",
    "표면 작업 분은 1·2층 안정 후",
    "모의 날 끝 5분 정리 확보"
  ],
  relatedSlugs: [
    "exam-item-white-bread-fail-points",
    "baker-cert-practical-mistakes",
    "baker-cert-mock-three-weeks",
    "baker-cert-exam-day-pass"
  ],
  faq: [
    {
      q: "소보로 토핑 비율을 알려 주세요.",
      a: "올리지 않습니다. 학원 배합과 집 밀가루가 다르면 그대로 옮기기 어렵습니다. 먼저 성형 개수·시간부터 맞춰 보세요."
    },
    {
      q: "식빵과 단과자를 같은 날 연습해도 되나요?",
      a: "가능하지만 초반에는 비추천입니다. 손 피로와 변수 혼선이 큽니다. 하루 한 품목의 한 층만 권합니다."
    }
  ]
};

const categories = load("data/categories.js", "CATEGORIES_DATA");
if (!categories.some((c) => c.slug === "exam-item-notes")) {
  categories.push({
    slug: "exam-item-notes",
    name: "기능사 품목 접근 노트",
    description:
      "완성 그램 레시피가 아닙니다. 식빵·단과자 등 실기 품목별로 집에서 무너지는 지점과 변수 순서만 정리합니다. 최신 시험 품목은 공식 공고를 확인하세요.",
    icon: "notes",
    order: 3
  });
  categories.sort((a, b) => a.order - b.order);
  save("data/categories.js", "CATEGORIES_DATA", categories);
  console.log("✓ category exam-item-notes");
}

const posts = load("data/posts.js", "POSTS_DATA");
for (const p of [post1, post2]) {
  if (posts.some((x) => x.slug === p.slug)) {
    console.error("exists", p.slug);
    process.exit(1);
  }
  const n = postCharCount(p);
  console.log(p.slug, "chars", n);
  if (n < 2000) {
    console.error("under 2000", p.slug, n);
    process.exit(1);
  }
}

const illDir = path.join(ROOT, "assets/images/illustrations/exam-items");
fs.mkdirSync(illDir, { recursive: true });
for (const p of [post1, post2]) {
  const svg = `${p.slug}.svg`;
  fs.writeFileSync(
    path.join(illDir, svg),
    makeSvg(p.slug, p.title.slice(0, 28), p.subtitle.slice(0, 40)),
    "utf8"
  );
  p.coverImage = `../assets/images/illustrations/exam-items/${svg}`;
  p.coverCaption = "품목 접근 노트 일러스트 (레시피·사진 아님)";
}

// cross-link from practical mistakes
const practical = posts.find((x) => x.slug === "baker-cert-practical-mistakes");
if (practical) {
  const add = ["exam-item-white-bread-fail-points", "exam-item-sweet-roll-approach"];
  practical.relatedSlugs = [...new Set([...(practical.relatedSlugs || []), ...add])].slice(0, 6);
}

posts.push(post1, post2);
save("data/posts.js", "POSTS_DATA", posts);
console.log("✓ added 2 exam-item-notes posts");
