/**
 * 독창성·독자 도움·차별점을 허브 글에 명시적으로 추가
 * (전 글 전수 개편 아님 — 진입 경로 중심)
 * node scripts/add-differentiators.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-08-14";

function load(file, v) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${v} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, v, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${v} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const posts = load("data/posts.js", "POSTS_DATA");

const DIFF_HTML = `
<aside class="diff-box" aria-label="이 사이트가 다른 점">
<p><strong>레시피 블로그와 다른 점 (짧게)</strong></p>
<ul>
<li><strong>완성 그램 표를 주지 않습니다.</strong> 제 오븐·반죽량 숫자를 그대로 옮기면 어긋날 수 있어서, 대신 <em>무엇을 어떤 순서로 검증할지</em>를 남깁니다.</li>
<li><strong>변수는 한 번에 하나만</strong> 바꿉니다. 기능사 실기 때 익힌 습관이고, 실패 원인을 추적할 수 있게 하려는 방식입니다.</li>
<li><strong>실패 1~3가지를 본문에 먼저</strong> 적습니다. 성공 후기만 모은 글이 아닙니다.</li>
<li><strong>추정과 확인을 구분</strong>합니다. 아직 모르는 것은 ‘추정’으로 남기고, 다음 실험에서만 ‘확인’으로 올립니다.</li>
<li><strong>다음 날 아침 식감</strong>까지 기준으로 삼습니다. 당일 맛만으로 끝내지 않습니다.</li>
<li><strong>실험일(구운 날)과 발행일(올린 날)을 구분</strong>합니다. 여름 숫자를 겨울에 복사하지 말라는 주의가 그래서 있습니다.</li>
<li><strong>퇴사 → 기능사 합격(2025.5) → 밤식빵 R&amp;D</strong>로 이어진 <em>한 사람의 연속 기록</em>입니다. 여러 소스 요약이 아닙니다.</li>
</ul>
</aside>`;

// ----- 1) practical guide: insert differentiators after goal -----
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
guide.updatedAt = TODAY;
if (!guide.sections.some((s) => s.id === "why-different")) {
  const idx = guide.sections.findIndex((s) => s.id === "goal");
  guide.sections.splice(idx + 1, 0, {
    id: "why-different",
    heading: "h2",
    title: "이 글·이 사이트가 레시피 사이트와 다른 점",
    content: `
${DIFF_HTML}
<p>그래서 이 정리 글에도 <strong>그램 완성표 대신 판단 기준</strong>만 있습니다. ‘복사해서 성공’이 아니라, 집 오븐에서 <strong>한 가지만 바꿔 확인</strong>하는 데 쓰라고 쓴 글입니다.</p>
<p>더 자세한 동기와 방식은 <a href="baker-cert-to-bread-rd.html">기능사 이후 R&amp;D 방식</a>, <a href="../columns/why-no-complete-recipe.html">완성 레시피를 올리지 않는 이유</a>에 있습니다.</p>`
  });
  console.log("✓ guide: why-different");
} else {
  console.log("· guide already has why-different");
}

// strengthen for-readers with unique help
const gFr = guide.sections.find((s) => s.id === "for-readers");
if (gFr && !gFr.content.includes("이 블로그만의")) {
  gFr.content =
    `<p><strong>이 블로그만의 쓸모</strong>는 ‘완벽한 밤식빵 레시피’가 아니라, <strong>망한 이유를 한 줄로 남기고 다음 변수를 고르는 습관</strong>입니다. 오븐·밀가루·밤 브랜드가 달라도 그 습관은 가져갈 수 있습니다.</p>` +
    gFr.content;
}

// ----- 2) baker-cert-to-bread-rd: differentiator section -----
const toRd = posts.find((p) => p.slug === "baker-cert-to-bread-rd");
if (toRd && !toRd.sections.some((s) => s.id === "why-different")) {
  toRd.updatedAt = TODAY;
  const after = toRd.sections.findIndex((s) => s.id === "rd-format");
  toRd.sections.splice(after + 1, 0, {
    id: "why-different",
    heading: "h2",
    title: "일반 베이킹 후기와 다른, 이 블로그의 R&D 방식",
    content: `
<aside class="value-box"><p><strong>차별점 한 줄</strong> — 합격 후기를 모아 쓴 글이 아니라, <strong>제가 망한 현상 → 추정/확인 → 변수 하나</strong>를 고정 포맷으로 쌓는 실험 일지입니다.</p></aside>
${DIFF_HTML}
<p>기능사 시리즈 6편은 ‘시험까지’, 이 편 이후 밤식빵 일지는 ‘합격 후에도 아직 부족한 빵’을 다룹니다. 그 연결이 이 사이트의 중심 스토리입니다.</p>`
  });
  console.log("✓ baker-cert-to-bread-rd: why-different");
}

// ----- 3) why-baker: short differentiator near end principles -----
const why = posts.find((p) => p.slug === "why-baker-certification");
if (why && !why.sections.some((s) => s.id === "why-this-blog")) {
  why.updatedAt = TODAY;
  const practiceIdx = why.sections.findIndex((s) => s.id === "practice-notes" || s.id === "editor-note");
  const insertAt = practiceIdx >= 0 ? practiceIdx : why.sections.length;
  why.sections.splice(insertAt, 0, {
    id: "why-this-blog",
    heading: "h2",
    title: "그래서 이 블로그에 남기는 것",
    content: `
<aside class="value-box"><p><strong>독창성</strong> — 남의 합격 비법 요약이 아니라, <strong>2024.9 퇴사 → 2025.5 기능사 → 밤식빵을 다시 만드는 실패 기록</strong>입니다.</p></aside>
<p>시중 레시피 글과 달리, 여기서는 ‘이 그램으로 하면 됩니다’보다 <strong>그날 무엇을 바꿨고 무엇이 남았는지</strong>를 적습니다. 독자에게 도움이 되는 지점은 두 가지입니다.</p>
<ul>
<li>기능사 준비 중: 제가 실제로 망한 구간(온도·발효·오븐 차이)을 참고</li>
<li>합격 후·홈베이킹: 변수 하나·다음 날 식감·추정/확인 구분으로 자기 실험을 설계</li>
</ul>
<p>바로 구울 판단 기준만 필요하면 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>로 가면 됩니다.</p>`
  });
  console.log("✓ why-baker: why-this-blog");
}

// ----- 4) series guide short differentiator -----
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series && !series.sections.some((s) => s.id === "why-different")) {
  series.updatedAt = TODAY;
  series.sections.splice(1, 0, {
    id: "why-different",
    heading: "h2",
    title: "이 시리즈만의 읽기 가치",
    content: `
<aside class="value-box"><p><strong>도움 되는 점</strong> — 레시피를 모은 목록이 아니라, <strong>실패가 쌓이는 순서</strong>를 보여 줍니다. 같은 실패를 두 번 하지 않게 하려는 읽기 안내입니다.</p></aside>
<p>일반적인 ‘베스트 레시피 모음’과 달리, 여기 일지는 <strong>한 번에 변수 하나</strong>만 바꿉니다. 그래서 글 수가 많아 보여도, 독자가 가져갈 것은 글 15개가 아니라 <a href="bread-rd-night-bread-practical-guide.html">실전 정리 한 편 + 막히는 항목 일지 1~2편</a>입니다.</p>
<p>실험일·발행일을 구분해 둔 것도 차별점입니다. ‘올해 올린 글 = 올해 구운 빵’이 아닙니다.</p>`
  });
  console.log("✓ series: why-different");
}

// ----- 5) sample diaries v1, v8, v12 — one unique "only here" note if missing -----
const diaryExtra = {
  "bread-rd-night-bread-v1":
    `<p class="uniq-note"><strong>이 실험만의 포인트</strong> — 기능사 반죽을 그대로 쓴 첫 밤식빵이라, ‘시험 합격 = 그 빵 완성’이 아님을 숫자로 확인한 날입니다.</p>`,
  "bread-rd-night-bread-v8":
    `<p class="uniq-note"><strong>이 실험만의 포인트</strong> — 오븐 안 레시피가 아니라 <em>꺼낸 직후 2분</em>이라는 오븐 밖 변수만 열었습니다. 집에서 바로 시도하기 쉬운 보정입니다.</p>`,
  "bread-rd-night-bread-v12":
    `<p class="uniq-note"><strong>이 실험만의 포인트</strong> — ‘겨울이면 무조건 58분’이 아니라, <em>습도 42%에서 56분</em>이라는 제 환경 후보를 남긴 날입니다. 타이머 복사가 아니라 눌림 우선입니다.</p>`
};

for (const [slug, html] of Object.entries(diaryExtra)) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) continue;
  const goal = p.sections.find((s) => s.id === "goal");
  if (goal && !goal.content.includes("uniq-note")) {
    // insert after value-box / role-banner
    if (goal.content.includes("</aside>")) {
      goal.content = goal.content.replace(
        /(<\/aside>)(\s*)(?!<p class="uniq-note")/,
        `$1$2${html}`
      );
      // if multiple asides, only first replacement - ok
      if (!goal.content.includes("uniq-note")) {
        goal.content = html + goal.content;
      }
    } else {
      goal.content = html + goal.content;
    }
    p.updatedAt = TODAY;
    console.log("✓ uniq-note", slug);
  }
}

// fix double uniq if regex weird - ensure only one
for (const slug of Object.keys(diaryExtra)) {
  const p = posts.find((x) => x.slug === slug);
  const goal = p.sections.find((s) => s.id === "goal");
  const matches = goal.content.match(/uniq-note/g) || [];
  if (matches.length > 1) {
    // keep first only - crude
    let seen = 0;
    goal.content = goal.content.replace(/<p class="uniq-note">[\s\S]*?<\/p>/g, (m) => {
      seen++;
      return seen === 1 ? m : "";
    });
  }
}

save("data/posts.js", "POSTS_DATA", posts);

// ----- about page -----
const aboutPath = path.join(ROOT, "about/index.html");
let about = fs.readFileSync(aboutPath, "utf8");
if (!about.includes("남들과 다른 기록 방식")) {
  about = about.replace(
    `<h2>글에서 다루는 것 / 다루지 않는 것</h2>`,
    `<h2>남들과 다른 기록 방식</h2>
      <p>검색하면 나오는 일반적인 베이킹 글·합격 후기 모음과 역할을 나눕니다. 이 블로그만의 차이는 아래입니다.</p>
      <ul>
        <li><strong>완성 레시피 복제 금지에 가깝습니다.</strong> 그램 표를 약속하기보다, 제가 바꾼 변수와 실패를 남깁니다. (<a href="../columns/why-no-complete-recipe.html">왜 그런지</a>)</li>
        <li><strong>변수는 한 번에 하나.</strong> 여러 조건을 동시에 바꾸면 원인을 모릅니다. 기능사 연습 때와 같은 원칙입니다.</li>
        <li><strong>실패를 본문 앞에 둡니다.</strong> 성공한 날만 골라 쓰지 않습니다.</li>
        <li><strong>추정 / 확인을 섞지 않습니다.</strong> 아직 모르는 것은 추정으로 표시합니다.</li>
        <li><strong>다음 날 아침 식감</strong>까지 봅니다. 당일 시식만으로 끝내지 않습니다.</li>
        <li><strong>실험일과 발행일을 구분</strong>합니다. 계절이 바뀌면 같은 숫자도 어긋납니다.</li>
        <li><strong>한 사람의 연속 기록</strong>입니다. 2024.9 퇴사 → 2025.5 기능사 → 밤식빵 R&amp;D로 이어집니다.</li>
      </ul>
      <p>독자에게 바로 도움이 되는 입구는 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>입니다. 일지 전체를 읽지 않아도 판단 기준을 가져갈 수 있게 모았습니다.</p>

      <h2>글에서 다루는 것 / 다루지 않는 것</h2>`
  );
  fs.writeFileSync(aboutPath, about);
  console.log("✓ about differentiators");
}

// ----- author page -----
const authorPath = path.join(ROOT, "author/index.html");
let author = fs.readFileSync(authorPath, "utf8");
if (!author.includes("이 기록이 다른 이유")) {
  author = author.replace(
    `<h2>기록 방식</h2>`,
    `<h2>이 기록이 다른 이유</h2>
      <p>저는 유명 레시피를 요약하는 큐레이터가 아니라, <strong>집 주방에서 변수 하나를 바꿔 가며 밤식빵에 가까워지려는 사람</strong>입니다. 글의 근거는 검색 상위 글이 아니라 제 반죽 메모·실패 목록·다음 날 식감입니다.</p>
      <p>독자가 가져갈 수 있는 것은 ‘제 그램표’가 아니라, <strong>실패를 기록하고 다음 변수를 고르는 방법</strong>입니다. 입구는 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>를 권합니다.</p>

      <h2>기록 방식</h2>`
  );
  fs.writeFileSync(authorPath, author);
  console.log("✓ author differentiators");
}

// ----- index hero card -----
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("레시피 복제가 아닙니다")) {
  index = index.replace(
    `<h2>여기서 가져갈 수 있는 것</h2>
          <ul>
            <li>기능사 준비·시험 경험 (2024.9~2025.5 합격)</li>
            <li>집 오븐 기준 변수 하나·실패 기록 방법</li>
            <li>밤식빵 실전 판단 기준 (레시피 표 아님)</li>
            <li>겨울 발효·보관·재료 선별 메모</li>
          </ul>
          <p style="margin:0.75rem 0 0;font-size:0.9rem"><a href="posts/bread-rd-night-bread-practical-guide.html" class="text-link">실전 정리 바로 읽기 →</a></p>`,
    `<h2>여기서 가져갈 수 있는 것</h2>
          <ul>
            <li>기능사 준비·시험 경험 (2024.9~2025.5 합격)</li>
            <li>변수 하나·실패 3·추정/확인 — 기록 방법</li>
            <li>밤식빵 판단 기준 (완성 그램표 아님)</li>
            <li>겨울 보정·밤 크기 선별 메모</li>
          </ul>
          <p style="margin:0.65rem 0 0;font-size:0.88rem;color:var(--color-muted)"><strong>레시피 복제가 아닙니다.</strong> 직접 망한 날과 바꾼 변수만 남깁니다.</p>
          <p style="margin:0.5rem 0 0;font-size:0.9rem"><a href="posts/bread-rd-night-bread-practical-guide.html" class="text-link">실전 정리 바로 읽기 →</a></p>`
  );
  fs.writeFileSync(indexPath, index);
  console.log("✓ index differentiator line");
}

// CSS
const cssPath = path.join(ROOT, "assets/css/main.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".diff-box")) {
  css += `
.diff-box {
  background: rgba(154, 91, 46, 0.06);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem 1.15rem 0.85rem;
  margin: 0 0 1.35rem;
}
.diff-box > p { margin: 0 0 0.65rem; }
.diff-box ul { margin: 0; padding-left: 1.15rem; }
.diff-box li { margin-bottom: 0.45rem; font-size: 0.93rem; line-height: 1.55; color: var(--color-muted); }
.diff-box li strong { color: var(--color-text); }
.uniq-note {
  background: rgba(232, 184, 109, 0.15);
  border-radius: var(--radius-sm);
  padding: 0.65rem 0.9rem;
  margin: 0 0 1rem;
  font-size: 0.92rem;
  line-height: 1.55;
}
`;
  fs.writeFileSync(cssPath, css);
  console.log("✓ CSS diff-box / uniq-note");
}

console.log("done");
