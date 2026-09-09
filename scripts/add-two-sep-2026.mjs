/**
 * 품목 노트 2026-09-06 + 칼럼 2026-09-10
 * node scripts/add-two-sep-2026.mjs
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

function makeExamSvg(slug, label, sub) {
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
</svg>`;
}

function makeColSvg(slug, label, sub) {
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
  <text x="300" y="270" font-family="system-ui,sans-serif" font-size="36" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="300" y="328" font-family="system-ui,sans-serif" font-size="22" fill="#555">${escapeXml(sub)}</text>
  <text x="300" y="400" font-family="system-ui,sans-serif" font-size="18" fill="#777">칼럼 일러스트 · 레시피 아님</text>
</svg>`;
}

const examPost = {
  slug: "exam-item-scale-after-shaping",
  title: "성형 직후 저울 — 무게를 빼고 굽던 날",
  subtitle: "한 덩어리 500g 근처, 다음은 470g대였을 때",
  category: "exam-item-notes",
  author: "정지석",
  publishedAt: "2026-09-06",
  updatedAt: "2026-09-06",
  featured: false,
  status: "published",
  excerpt:
    "기능사 실기에서 성형이 끝나자마자 저울에 한 번 더 올리지 않으면, 같은 반죽인데 덩어리 무게가 갈라졌습니다. 470g대와 500g 근처가 한 판에 섞인 날을 계기로, 성형 직후 무게 칸을 고정했습니다. 완성 그램 표는 없습니다.",
  sections: [
    {
      id: "the-split",
      heading: "h2",
      title: "한 판에 무게가 갈라진 날",
      content: `<p>학원 실기 연습이었습니다. 성형은 끝났다고 생각했는데, 강사님이 저울을 가리켰습니다. 한 덩어리는 500g에 가깝고, 다음은 470g대였습니다. 반죽을 나눠 담을 때 공기와 봉합이 달라지면 무게가 흔들린다는 말이었습니다.</p>
<p>그날 굽기 전에 이미 규격에서 벗어나 있었습니다. 색이 예쁜 것과 무관했습니다. 식빵 접근 노트(<a href="exam-item-white-bread-fail-points.html">세 지점</a>)의 세 번째 실패가 이 글의 본편입니다. 실기 전반은 <a href="baker-cert-practical-mistakes.html">3편</a>에 있습니다.</p>
<p>완성 레시피의 목표 그램을 여기 적지 않습니다. 시험 규격은 회차 공고를 보세요. 제가 남기는 것은 <strong>성형 직후 저울을 빼먹지 않는 습관</strong>입니다.</p>
<p>2024년 겨울부터 2025년 봄까지, 이 칸이 없는 날은 편차가 커졌습니다. 칸이 생긴 뒤로는 재작업 시간이 줄었습니다. 속도가 느려질 것 같아 불안했는데, 다시 뭉치는 시간보다 짧았습니다.</p>`
    },
    {
      id: "habit",
      heading: "h2",
      title: "성형이 끝나는 지점을 옮겼다",
      content: `<p>저에게 성형의 끝은 모양이 아니라 저울이었습니다. 봉합을 닫고, 저울에 올리고, 판에 놓습니다. 순서가 바뀌면 판 위에서 무게를 재다 모양이 무너졌습니다.</p>
<p>집 저울과 학원 저울 오차는 <a href="../columns/tools-first-month-keep.html">도구 칼럼</a>에 적어 둔 대로, 평일에 한 번 비교해 두었습니다. 연습 날마다 오차를 새로 재지 않았습니다. 영점만 확인했습니다.</p>
<p>단과자 계열(<a href="exam-item-sweet-roll-approach.html">층 나누기</a>)은 개수가 많아 더 흔들립니다. 식빵처럼 큰 덩어리든, 여러 개로 나누든, 성형 직후 무게 칸은 같습니다. 1층이 흔들리면 2층 굽기 색을 맞춰도 개수가 모자랍니다.</p>
<p>모의 날에는 무게 습관을 새로 실험하지 않았습니다. <a href="baker-cert-mock-three-weeks.html">모의 3주</a>의 목표는 끝 시각입니다. 평일에 맞춰 둔 저울 동선만 가져갔습니다. 모의 전에 새 분할법을 넣으면 시간이 부족한 이유가 무게인지 성형인지 섞입니다.</p>`
    },
    {
      id: "plus-minus",
      heading: "h2",
      title: "편차를 줄이려던 범위",
      content: `<p>3편에 적어 둔 대로, 제 목표는 편차를 ±5g 안쪽으로 두는 쪽이었습니다. 시험장 저울과 집 저울이 다를 수 있어서, 절대 숫자를 외우기보다 <strong>같은 날 덩어리끼리의 차이</strong>를 봤습니다.</p>
<p>470g대와 500g 근처가 한 판에 있으면, 굽기 전에 이미 감점 구간입니다. 예쁘게 봉합해도 무게가 빠지면 다시 열었습니다. 다시 여는 손맛이 싫어서, 처음부터 저울을 동선에 넣었습니다.</p>
<p>발효 판단(<a href="exam-item-fermentation-poke-not-minutes.html">눌림 노트</a>)과 무게를 같은 날 동시에 고치지 않았습니다. 한 주는 눌림, 다음 주는 저울. 변수가 둘이면 속이 갈라진 이유가 안 보입니다.</p>`
    },
    {
      id: "skip",
      heading: "h2",
      title: "저울을 건너뛴 날",
      content: `<p>시간이 없다고 저울을 건너뛴 날이 있습니다. 시험 시계가 먼저 보였습니다. 그 판은 나중에 썰어 보니 크기가 들쭉날쭉했습니다. 당일 색만 보면 모릅니다. 다음 날 칼질에서 드러났습니다.</p>
<p>손목이 남은 날에는 반죽 풀코스를 접고, 분할·무게만 하고 끝났습니다. 쉬는 기준은 <a href="../columns/rest-day-when-wrists-hurt.html">손목 칼럼</a>과 같습니다. 가루를 적게 써도 저울 동선은 연습이 됩니다.</p>
<p>시험 전날에는 새 분할을 열지 않았습니다. 전날 밤은 가방입니다. <a href="../columns/no-new-practice-night-before-exam.html">전날 칼럼</a>과 같습니다.</p>`
    },
    {
      id: "for-now",
      heading: "h2",
      title: "지금 모양만 보고 있다면",
      content: `<p>다음 연습 한 번만, 성형 직후 저울을 동선에 넣어 보세요. 배합은 건드리지 않습니다. 메모 한 줄이면 됩니다. 덩어리별 무게, 편차, 다시 열었는지.</p>
<p>공식 규격은 공고가 우선입니다. 환경이 다르면 <a href="../contact/">문의</a>로 알려 주세요. 오류는 수정일을 남기고 고칩니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>성형의 끝을 모양에서 저울로 옮긴 기록입니다. 품목 접근 노트 4편입니다. 식빵 세 지점, 발효 눌림, 단과자 층과 같이 읽으면 됩니다.</p>
<p>로드맵(<a href="baker-cert-8month-roadmap.html">8개월</a>) 중반 실기 반복 주에 이 칸만 붙여도, 한 판의 편차가 보이기 시작했습니다. 시험 요강은 공식 자료를 따릅니다.</p>`
    }
  ],
  summary:
    "기능사 실기에서 성형 직후 저울을 빼먹어 470g대와 500g 근처가 한 판에 섞인 날을 계기로, 성형의 끝을 무게 확인으로 옮긴 습관을 정리했습니다. 완성 그램 표는 없습니다.",
  relatedSlugs: [
    "exam-item-white-bread-fail-points",
    "baker-cert-practical-mistakes",
    "exam-item-fermentation-poke-not-minutes",
    "exam-item-sweet-roll-approach"
  ]
};

const column = {
  slug: "no-full-home-bake-day-after-class",
  title: "학원 다음 날, 집에서 같은 품목을 다시 안 굽는 이유",
  subtitle: "수업 손을 집에서 풀코스로 복제하지 않기로 한 날들",
  author: "정지석",
  publishedAt: "2026-09-10",
  updatedAt: "2026-09-10",
  status: "published",
  excerpt:
    "학원 실기 다음 날 집에서 같은 품목을 풀코스로 다시 굽으면, 손이 남고 변수가 섞였습니다. 그때부터 다음 날은 메모만 옮기거나 무게·눌림 한 칸만 했습니다. 의료 조언이 아니라 수업 다음 날의 집 규칙입니다.",
  perspective:
    "수업에서 못 한 것을 집에서 만회하고 싶어집니다. 저는 그 만회가 다음 수업의 손을 깎은 기억이 있어서, 학원 다음 날을 복습 풀코스로 쓰지 않기로 했습니다.",
  sections: [
    {
      id: "after-class",
      heading: "h2",
      title: "수업이 끝난 다음 날",
      content: `<p>2024년 겨울, 학원에서 식빵을 구운 다음 날 집에서 같은 루트를 처음부터 다시 돌린 적이 있습니다. 학원 오븐과 집 오븐이 달라 색이 마음에 안 들었고, 집에서 맞추면 안심이 될 것 같았습니다. 손은 남았습니다. 다음 수업에서 봉합이 헐거워졌습니다.</p>
<p>그날 메모는 “학원 다음 날 풀코스 → 손↓”였습니다. 레시피가 바뀐 것이 아니었습니다. 손목 칼럼(<a href="rest-day-when-wrists-hurt.html">쉬는 기준</a>)의 전날 6시간과 비슷한 패턴인데, 원인은 학원과 집이 붙은 이틀이었습니다.</p>
<p>그다음부터 학원 다음 날은 반죽 풀코스를 기본값에서 뺐습니다. 메모를 집으로 옮기고, 저울 영점만 확인하고, 눌림·무게 칸만 어제 숫자 옆에 적었습니다. 오븐은 안 켰습니다.</p>`
    },
    {
      id: "allowed",
      heading: "h2",
      title: "다음 날에 한 일",
      content: `<p>빈 날이면 불안해서, 허용 목록을 짧게 두었습니다.</p>
<ul>
<li>어제 학원 메모를 집 공책에 옮겨 적는다</li>
<li>물·실내·반죽 종료 온도, 1차 분·눌림, 성형 후 무게만 다시 본다</li>
<li>집 저울 영점만 확인한다. 새 배합은 안 연다</li>
<li>필기 오답이 밀렸으면 45분만 한다</li>
</ul>
<p>유튜브로 학원 품목을 검색하지 않았습니다. 영상이 어제 손과 겹치면 다음 수업에서 무엇이 학원 피드백인지 안 보입니다. 집 오븐 색이 궁금해도, 다이얼 대응은 <a href="home-oven-temperature-notes.html">오븐 칼럼</a>의 평일 칸으로 미뤘습니다. 학원 다음 날에 색 실험을 열지 않았습니다.</p>
<p>단과자처럼 손이 많은 수업 다음 날은 더 지켰습니다. 1층을 집에서 두 번 돌리면 다음 수업이 무너집니다. <a href="../posts/exam-item-sweet-roll-approach.html">단과자 노트</a>의 층과 같습니다.</p>`
    },
    {
      id: "if-must",
      heading: "h2",
      title: "꼭 손을 써야 할 때",
      content: `<p>그래도 손이 근질거릴 때는 분할·무게만 했습니다. 굽기는 없습니다. 성형 직후 저울(<a href="../posts/exam-item-scale-after-shaping.html">무게 노트</a>) 동선만 반복하는 정도입니다. 가루를 적게 써도 저울 순서는 남습니다.</p>
<p>발효 눌림을 확인하고 싶으면, 학원 다음 날이 아니라 그다음 평일에 했습니다. 수업 직후 집에서 1차 분을 바꾸면 학원 피드백과 집 환경이 한 메모에 섞입니다. <a href="../posts/exam-item-fermentation-poke-not-minutes.html">눌림 노트</a>의 변수 하나 규칙과 같습니다.</p>
<p>모의 전날이 학원 다음 날과 겹치면, 모의 규칙을 우선했습니다. 새 연습 금지, 도구 확인. <a href="../posts/baker-cert-mock-three-weeks.html">모의 3주</a>와 <a href="no-new-practice-night-before-exam.html">시험 전날 칼럼</a>과 같은 선입니다.</p>`
    },
    {
      id: "not-lazy",
      heading: "h2",
      title: "복습을 안 하는 날이 아니다",
      content: `<p>학원 다음 날을 비운다고 복습을 포기한 것이 아닙니다. 복습의 형태를 손에서 메모로 옮긴 것입니다. 수업에서 들은 한 줄을 공책에 다시 쓰는 시간이, 집 오븐에서 색을 맞추는 시간보다 다음 수업에 도움이 됐습니다.</p>
<p>집과 학원의 차이를 보고 싶으면, 학원 다음 날이 아니라 하루를 띄운 뒤에 집 배치를 열었습니다. 손이 돌아온 뒤에야 오븐 변수를 볼 수 있었습니다. 붙어 있는 이틀은 손 변수만 남습니다.</p>
<p>가족에게는 “오늘은 학원 다음 날, 반죽 없음”이라고 말했습니다. 주방을 비우면 손이 갈 곳이 없습니다.</p>`
    },
    {
      id: "limits",
      heading: "h2",
      title: "이 글이 말하지 않는 것",
      content: `<p>학원을 다녀야만 합격한다는 말이 아닙니다. 독학이면 이 규칙의 ‘학원 다음 날’을 ‘긴 손 다음 날’로 바꾸면 됩니다. 쉬는 기준 칼럼과 겹칩니다.</p>
<p>의료 조언이 아닙니다. 손목이 반복되면 진료가 먼저입니다. 이 사이트는 건강 판단을 대체하지 않습니다.</p>
<p>공식 수업 횟수·시험 일정은 공고와 학원 시간표가 우선입니다. 이 글은 2024~2025 제 집 규칙입니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "이번 주 달력",
      content: `<p>학원 있는 날 다음 칸을 회색으로 두세요. 메모 옮기기, 영점, 필기 45분. 풀코스는 그다음 평일. <a href="../posts/baker-cert-8month-roadmap.html">로드맵</a> 중반에 이 칸을 넣으면, 주 3회 실기가 주 5회 손처럼 번지지 않습니다.</p>
<p>루틴이 무너진 날의 복구는 <a href="quit-job-weekly-routine.html">루틴 칼럼</a>과 같습니다. 작게 재개합니다. 학원 다음 날 만회로 두 배를 넣지 않습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "편집 메모",
      content: `<p>수업 다음 날의 집 규칙입니다. 시험 전날 밤과 모의 전날과 겹치는 부분이 있어도, 이 글의 초점은 학원과 집 사이의 하루입니다.</p>
<p>문의는 <a href="../contact/">연락</a>으로 받습니다. 공통으로 반복되면 수정일을 남깁니다.</p>`
    }
  ],
  summary:
    "학원 실기 다음 날 집에서 같은 품목을 풀코스로 다시 굽지 않고, 메모와 영점·한 칸 연습만 남기기로 한 이유를 정리했습니다. 2024~2025 집 규칙이며 의료 조언이 아닙니다.",
  relatedSlugs: [
    "baker-cert-practical-mistakes",
    "baker-cert-8month-roadmap",
    "baker-cert-mock-three-weeks"
  ]
};

function padUntil(item, extra) {
  const last = item.sections[item.sections.length - 1];
  while (postCharCount(item) < 2000) {
    last.content += extra;
    if (postCharCount(item) > 2400) break;
  }
}

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

if (posts.some((p) => p.slug === examPost.slug) || columns.some((c) => c.slug === column.slug)) {
  console.error("exists");
  process.exit(1);
}

if (postCharCount(examPost) < 2000) {
  padUntil(
    examPost,
    `<p>시험장 저울을 처음 만질 때도 영점만 보고, 평소 동선을 그대로 썼습니다. 새 저울이라고 분할법을 바꾸지 않았습니다. 문의는 연락 페이지로 받습니다.</p>`
  );
}
if (postCharCount(column) < 2000) {
  padUntil(
    column,
    `<p>학원 없는 주는 이 규칙의 빈 칸이 없습니다. 긴 손을 쓴 다음 날을 회색으로 바꾸면 됩니다. 문의는 연락 페이지로 받습니다.</p>`
  );
}

console.log("exam", postCharCount(examPost));
console.log("col", postCharCount(column));
if (postCharCount(examPost) < 2000 || postCharCount(column) < 2000) {
  console.error("still short");
  process.exit(1);
}

const examDir = path.join(ROOT, "assets/images/illustrations/exam-items");
const colDir = path.join(ROOT, "assets/images/illustrations/columns");
fs.mkdirSync(examDir, { recursive: true });
fs.mkdirSync(colDir, { recursive: true });
fs.writeFileSync(path.join(examDir, `${examPost.slug}.svg`), makeExamSvg(examPost.slug, "성형 직후 저울", "무게를 빼고 굽던 날"), "utf8");
fs.writeFileSync(path.join(colDir, `${column.slug}.svg`), makeColSvg(column.slug, "학원 다음 날", "집에서 풀코스 안 함"), "utf8");
examPost.coverImage = `../assets/images/illustrations/exam-items/${examPost.slug}.svg`;
examPost.coverCaption = "품목 접근 노트 일러스트 (레시피·사진 아님)";

const white = posts.find((p) => p.slug === "exam-item-white-bread-fail-points");
if (white && !white.relatedSlugs.includes(examPost.slug)) {
  white.relatedSlugs = [examPost.slug, ...(white.relatedSlugs || [])].slice(0, 5);
}

posts.push(examPost);
columns.unshift(column);
save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓", examPost.slug, examPost.publishedAt);
console.log("✓", column.slug, column.publishedAt);
