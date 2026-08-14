/**
 * Low-value content 거절 대응 (벤치마크: consolidate hubs, unique value per page)
 * - 실전 정리 = 메인 가치 허브 강화
 * - 일지 = 실험 근거 역할로 축소·중복 문장 제거·실전 정리 연결
 * - 읽기 안내 = 허브 우선 동선
 * node scripts/consolidate-for-adsense-value.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");
const TODAY = "2026-08-14";

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

function roleBanner(text) {
  return `<aside class="role-banner" aria-label="이 글의 역할"><p><strong>이 글의 역할</strong> — ${text}</p><p class="role-banner-link"><a href="bread-rd-night-bread-practical-guide.html">바로 적용하려면 실전 정리</a>를 먼저 보세요. 이 일지는 그 판단의 <strong>실험 근거</strong>입니다.</p></aside>`;
}

/** 차수별 고유 역할 한 줄 (실전 정리 어느 칸의 근거인지) */
const ROLE = {
  "bread-rd-night-bread-v1": "실전 정리의 ‘변수는 하나만’ 원칙 — 첫 실패 목록의 근거",
  "bread-rd-night-bread-v2": "실전 정리 ① 토핑 시점(1차 발효 후)의 근거",
  "bread-rd-night-bread-v3": "실전 정리 ② 수분 +2%p · 다음 날 식감의 근거",
  "bread-rd-night-bread-v4": "실전 정리 ③ 루즈 백 보관의 근거",
  "bread-rd-night-bread-v5": "실전 정리 ④ 시럽 졸임 +2분의 근거",
  "bread-rd-night-bread-v6": "실전 정리 ⑤ 설탕 -10% 단맛 보정의 근거",
  "bread-rd-night-bread-v7": "실전 정리 ⑥ 신선 밤 재료의 근거",
  "bread-rd-night-bread-v8": "실전 정리 ⑦ 굽기 후 브러싱의 근거",
  "bread-rd-night-bread-v9": "실전 정리 겨울 표 — 저습 58분 후보의 근거",
  "bread-rd-night-bread-v10": "실전 정리 겨울 표 — 개방 0~30분 보관의 근거",
  "bread-rd-night-bread-v11": "실전 정리 겨울 표 — 58분은 저습 기준이라는 근거의 일부",
  "bread-rd-night-bread-v12": "실전 정리 겨울 표 — 고습 56분 1순위의 근거",
  "bread-rd-night-bread-v13": "실전 정리 겨울 표 — 고습 55분은 보조라는 근거의 일부",
  "bread-rd-night-bread-v14": "실전 정리 재료 — 중간 크기 우선 선별의 근거",
  "bread-rd-night-bread-v15": "실전 정리 재료 — 큰 밤 예외 배치의 근거"
};

const posts = loadPosts();

// ========== 1) PRACTICAL GUIDE = canonical hub ==========
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (!guide) throw new Error("practical guide missing");

guide.title = "밤식빵, 집에서 바로 쓸 실전 정리 (일지 대신 이 글부터)";
guide.subtitle = "15편 일지를 다 읽지 않아도 됩니다. 판단 기준·겨울 보정·재료 선별만 모았습니다.";
guide.excerpt =
  "밤식빵 R&D 일지가 길다면 이 글만 보세요. 토핑·수분·보관·시럽·재료·브러싱 일곱 가지 판단, 겨울 발효·개방 표, 신선 밤 크기 선별, 망하기 쉬운 점, 메모 양식을 한곳에 담았습니다. 완성 레시피·그램 표가 아닙니다.";
guide.updatedAt = TODAY;
guide.featured = true;
guide.summary =
  "일지 15편의 결론만 모은 실전 허브. 일곱 가지 판단, 고정값 초안, 겨울 보정(저습 58·고습 56·개방 0~30분), 중간 크기 밤 선별, 메모 양식. 상세 실험은 각 일지에 링크.";

// rebuild key sections with consolidation language
const goalSec = guide.sections.find((s) => s.id === "goal");
if (goalSec) {
  goalSec.title = "일지 15편 대신, 이 글이 하는 일";
  goalSec.content = `
<aside class="value-box" aria-label="이 글에서 가져갈 점"><p><strong>이 글에서 가져갈 점</strong> — 집에서 바로 쓸 <strong>판단 순서와 숫자 후보</strong>입니다. 일지 전체를 읽지 않아도 시작할 수 있습니다. 그램 완성 레시피는 없습니다.</p></aside>
<p>이 사이트의 밤식빵 글은 두 종류입니다.</p>
<ul>
<li><strong>실전 정리(이 글)</strong> — 가져갈 기준. 우선 읽기.</li>
<li><strong>R&amp;D 일지 1~15차</strong> — 변수 하나를 바꾼 <strong>실험 근거</strong>. 필요할 때만 열어보기.</li>
</ul>
<p>일지를 처음부터 따라가면 ‘그래서 뭘 하면 되지?’가 늦게 잡힙니다. 그래서 원칙·고정값 초안·겨울 보정·재료 선별·메모 양식만 한 편에 모았습니다. 각 숫자의 근거가 궁금할 때만 해당 차수 일지로 내려가면 됩니다.</p>
<figure class="article-figure"><img src="../assets/images/photos/bread-rd-night-bread-practical-guide/goal.jpg" alt="일지 대신 실전 정리부터" loading="lazy" class="article-img" width="1200" height="675"><figcaption>일지 대신 실전 정리부터</figcaption></figure>
<p>실험 기간은 2025년 6월~2026년 초, 블로그 발행은 2026년입니다. <strong>실험일과 발행일을 구분</strong>해 두었으니, 여름 숫자를 겨울에 복사하지 마세요.</p>
<p>전체 목차는 <a href="bread-rd-series-guide.html">읽기 순서 안내</a>에 있습니다. 시간이 없으면 <strong>이 글 → 관심 일지 1~2편</strong>이면 충분합니다.</p>`;
}

const seven = guide.sections.find((s) => s.id === "takeaway-seven");
if (seven) {
  seven.title = "바로 쓸 일곱 가지 판단 (일지 결론만)";
  // ensure material lines from 14/15 if partial
  if (!seven.content.includes("v14")) {
    seven.content = seven.content.replace(
      /7차<\/a>\)\. 크기 편차/,
      `7차</a>). 크기는 중간 우선(<a href="bread-rd-night-bread-v14.html">14차</a>). 크기 편차`
    );
  }
}

const winter = guide.sections.find((s) => s.id === "winter-quick");
if (winter) {
  winter.title = "겨울·난방 — 일지 9~13차를 표로 합친 것";
  winter.content = `
<aside class="value-box"><p><strong>이 표만 메모해도 됩니다.</strong> 상세 실험은 괄호 안 일지에 있습니다. 숫자는 제 주방 기준이며 <strong>손가락 눌림이 타이머보다 우선</strong>입니다.</p></aside>
<table class="data-table">
<thead><tr><th>조건</th><th>후보</th><th>근거 일지</th></tr></thead>
<tbody>
<tr><td>실내 약 19°C, 습도 약 35%</td><td>1차 발효 <strong>58분</strong> 후보</td><td><a href="bread-rd-night-bread-v9.html">9차</a></td></tr>
<tr><td>습도 약 40% 이상</td><td>1차 발효 <strong>56분</strong> 1순위, 55분 보조</td><td><a href="bread-rd-night-bread-v12.html">12</a>·<a href="bread-rd-night-bread-v13.html">13차</a> (<a href="bread-rd-night-bread-v11.html">11차</a>에서 58분 여유 확인)</td></tr>
<tr><td>식힌 뒤 보관</td><td>개방 <strong>0~30분</strong> 후 루즈 백 (40분+는 겉 건조↑)</td><td><a href="bread-rd-night-bread-v10.html">10차</a></td></tr>
<tr><td>신선 밤</td><td><strong>중간 크기</strong> 우선, 한 팬에 섞지 않기</td><td><a href="bread-rd-night-bread-v14.html">14차</a></td></tr>
<tr><td>큰 밤을 쓸 때</td><td>간격 넓히고 올린 직후 손끝 1회만</td><td><a href="bread-rd-night-bread-v15.html">15차</a></td></tr>
</tbody>
</table>
<p>여름·가을 일지(1~8차) 숫자를 겨울에 그대로 쓰지 마세요. 온도·습도를 먼저 적고 분을 맞춥니다.</p>`;
}

// decision section — when to open logs
if (!guide.sections.some((s) => s.id === "decision-tree")) {
  const whenIdx = guide.sections.findIndex((s) => s.id === "when-read-logs");
  const decision = {
    id: "decision-tree",
    heading: "h2",
    title: "일지는 언제 열까 — 의사결정 한 장",
    content: `
<p>구글·독자 모두 “비슷한 글이 많은 사이트”보다 <strong>한 허브 + 필요한 근거</strong>를 선호합니다. 아래만 따라도 됩니다.</p>
<ol>
<li><strong>지금 바로 구울 계획</strong> → 이 글(실전 정리)만. 일곱 가지 + 겨울 표 + 메모 양식.</li>
<li><strong>토핑이 흐른다</strong> → <a href="bread-rd-night-bread-v2.html">2차</a>, <a href="bread-rd-night-bread-v5.html">5차</a> 근거만.</li>
<li><strong>다음 날 건조</strong> → <a href="bread-rd-night-bread-v3.html">3차</a>, <a href="bread-rd-night-bread-v4.html">4차</a>, 겨울이면 위 표.</li>
<li><strong>단맛이 과하다</strong> → <a href="bread-rd-night-bread-v6.html">6차</a>.</li>
<li><strong>재료·밤 크기</strong> → <a href="bread-rd-night-bread-v7.html">7차</a>, <a href="bread-rd-night-bread-v14.html">14차</a>, <a href="bread-rd-night-bread-v15.html">15차</a>.</li>
<li><strong>전체 흐름이 궁금</strong> → <a href="bread-rd-series-guide.html">읽기 안내</a> (실험 결과 글 아님).</li>
</ol>
<p>1~15차를 순서대로 전부 읽지 않아도 이 사이트 가치를 가져갈 수 있게 설계했습니다.</p>`
  };
  if (whenIdx >= 0) guide.sections.splice(whenIdx, 0, decision);
  else guide.sections.push(decision);
}

const whenRead = guide.sections.find((s) => s.id === "when-read-logs");
if (whenRead) {
  whenRead.title = "일지 URL을 눌러야 할 때만";
  whenRead.content = `
<p>정리 글만으로 시작 가능합니다. 아래는 “왜 그 숫자인가”가 궁금할 때만 여세요. 비슷한 설명이 일지마다 반복되지 않도록, <strong>상세는 일지·요약은 이 글</strong>로 나눴습니다.</p>
<ul>
<li>토핑 흘림 → <a href="bread-rd-night-bread-v2.html">2차</a>, <a href="bread-rd-night-bread-v5.html">5차</a></li>
<li>다음 날 건조 → <a href="bread-rd-night-bread-v3.html">3차</a>, <a href="bread-rd-night-bread-v4.html">4차</a>, 겨울 표</li>
<li>단맛·밀착 → <a href="bread-rd-night-bread-v6.html">6차</a>, <a href="bread-rd-night-bread-v8.html">8차</a></li>
<li>재료·크기 → <a href="bread-rd-night-bread-v7.html">7</a>·<a href="bread-rd-night-bread-v14.html">14</a>·<a href="bread-rd-night-bread-v15.html">15차</a></li>
<li>겨울 분·습도 → <a href="bread-rd-night-bread-v9.html">9</a>~<a href="bread-rd-night-bread-v13.html">13차</a> (표가 우선)</li>
</ul>`;
}

const editor = guide.sections.find((s) => s.id === "editor-note");
if (editor) {
  editor.content = `
<p>이 글은 일지를 대체하는 <strong>독자용 허브</strong>입니다. 차수가 늘면 표와 일곱 가지만 고치고, 실험 서사는 각 일지에 남깁니다. 비슷한 설명을 15번 반복하지 않으려는 편집입니다.</p>
<p>겨울·재료 결론을 여기로 모았습니다. 오류·보완은 <a href="../contact/">문의</a>로 받습니다. 본문이 바뀌면 수정일을 갱신합니다.</p>`;
}

console.log("✓ practical guide hub rebuilt");

// ========== 2) SERIES GUIDE — hub first ==========
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.updatedAt = TODAY;
  series.title = "빵 R&D 일지 읽는 법 — 실전 정리 먼저";
  series.subtitle = "15편을 다 읽지 않는 읽기 순서";
  series.excerpt =
    "밤식빵 일지가 많다면 실전 정리부터 보세요. 이 글은 실험 결과가 아니라, 언제 어떤 일지만 열면 되는지 안내합니다.";
  const goal = series.sections.find((s) => s.id === "goal");
  if (goal) {
    goal.title = "대부분 사람은 실전 정리만 보면 됩니다";
    goal.content = `
<aside class="value-box"><p><strong>이 글에서 가져갈 점</strong> — 읽기 순서입니다. 새 실험 결과가 아닙니다. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a> → 관심 일지 1~2편.</p></aside>
<p>R&amp;D 카테고리에 일지가 쌓이면, 처음부터 읽으려다 지치기 쉽습니다. 이 사이트는 의도적으로 <strong>허브(실전 정리)</strong>와 <strong>근거(일지)</strong>를 나눴습니다.</p>
<figure class="article-figure"><img src="../assets/images/photos/bread-rd-series-guide/goal.jpg" alt="실전 정리 먼저" loading="lazy" class="article-img" width="1200" height="675"><figcaption>실전 정리 먼저</figcaption></figure>
<p>일지 한 편은 변수 하나의 실험 로그입니다. 여러 편을 한꺼번에 읽으면 ‘무엇을 시도했나’는 보이지만 ‘지금 뭘 하면 되나’는 늦습니다. 그래서 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 결론을 모았습니다.</p>
<p>실험일과 발행일은 본문에 구분해 두었습니다. 기능사 동기 글은 <a href="../posts/why-baker-certification.html">제빵기능사를 선택한 이유</a>에 있습니다.</p>`;
  }
  const one = series.sections.find((s) => s.id === "one-variable");
  if (one) {
    one.title = "권장 경로 (짧게 / 깊게)";
    // prepend short path
    if (!one.content.includes("짧게 가는 경로")) {
      one.content =
        `<p><strong>짧게 가는 경로</strong></p><ol><li><a href="bread-rd-night-bread-practical-guide.html">실전 정리</a></li><li>막히는 항목만 해당 일지 1편</li></ol><p><strong>깊게 가는 경로</strong> — 아래 전체 순서(연구 기록용).</p>` +
        one.content;
    }
  }
  console.log("✓ series guide hub-first");
}

// ========== 3) R&D diaries — role + trim boilerplate ==========
function stripDuplicateValuePrefix(html) {
  return html
    .replace(/이 글에서 가져갈 점<\/strong> — 가져갈 점:\s*/g, "이 글에서 가져갈 점</strong> — ")
    .replace(/role-banner[\s\S]*?<\/aside>/i, ""); // remove old if re-run partial
}

let diaryN = 0;
for (const post of posts) {
  if (!ROLE[post.slug] || !post.sections) continue;
  diaryN++;

  // Ensure role banner at very start of first section
  const first = post.sections[0];
  let c = first.content || "";
  c = c.replace(/<aside class="role-banner"[\s\S]*?<\/aside>/gi, "");
  if (!c.includes("role-banner")) {
    first.content = roleBanner(ROLE[post.slug]) + c;
  } else {
    first.content = c;
  }

  // Slim practice-notes: keep only experiment-specific if too long restating guide
  const pr = post.sections.find((s) => s.id === "practice-notes");
  if (pr) {
    const plain = pr.content.replace(/<[^>]+>/g, " ");
    if (plain.length > 400) {
      // keep first 2 paragraphs worth + link to guide
      const paras = [...pr.content.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[0]);
      const keep = paras.slice(0, 2).join("");
      pr.content =
        keep +
        `<p>고정값·일곱 가지 판단·겨울 표는 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 모아 두었습니다. 이 칸에는 <strong>당일 실험 메모만</strong> 남깁니다.</p>`;
      pr.title = pr.title.includes("메모") ? pr.title : "당일 실험 메모만";
    }
  }

  // Slim editor-note: point to guide, keep 1-2 unique closing sentences
  const ed = post.sections.find((s) => s.id === "editor-note");
  if (ed) {
    const paras = [...ed.content.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => m[1]);
    const firstP = paras[0] ? `<p>${paras[0]}</p>` : "";
    ed.content =
      firstP +
      `<p>적용 숫자와 표는 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 보세요. 이 일지는 그 표의 <strong>실험 근거</strong>로만 남깁니다.</p>`;
  }

  // Shorten for-readers slightly if it only promotes reading whole series
  const fr = post.sections.find((s) => s.id === "for-readers");
  if (fr && fr.content.includes("실전 정리") === false) {
    fr.content +=
      `<p>바로 적용할 기준은 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 있습니다.</p>`;
  }

  post.updatedAt = TODAY;
}
console.log(`✓ ${diaryN} diaries: role banner + slim boilerplate`);

// mid-review pointer
const mid = posts.find((p) => p.slug === "bread-rd-night-bread-mid-review");
if (mid) {
  mid.updatedAt = TODAY;
  const g = mid.sections[0];
  if (g && !g.content.includes("role-banner") && !g.content.includes("1~5차 합산")) {
    g.content =
      `<aside class="role-banner"><p><strong>이 글의 역할</strong> — 1~5차 합산 중간 정리입니다. 8차 이후·겨울·재료는 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>가 최신입니다.</p></aside>` +
      g.content;
  }
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");

// CSS for role-banner + data-table
const cssPath = path.join(ROOT, "assets/css/main.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".role-banner")) {
  css += `
.role-banner {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.85rem 1.1rem;
  margin: 0 0 1.25rem;
  font-size: 0.92rem;
}
.role-banner p { margin: 0 0 0.4rem; }
.role-banner p:last-child { margin: 0; }
.role-banner-link { color: var(--color-muted); font-size: 0.88rem; }
.data-table {
  width: 100%; border-collapse: collapse; margin: 1rem 0 1.25rem;
  font-size: 0.9rem;
}
.data-table th, .data-table td {
  border: 1px solid var(--color-border); padding: 0.55rem 0.65rem; text-align: left; vertical-align: top;
}
.data-table th { background: rgba(154, 91, 46, 0.08); font-weight: 600; }
`;
  fs.writeFileSync(cssPath, css);
  console.log("✓ CSS role-banner + data-table");
}

// index hero already may have practical CTA from previous script
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("실전 정리부터")) {
  index = index.replace(
    /<div class="hero-actions">[\s\S]*?<\/div>/,
    `<div class="hero-actions">
            <a href="posts/bread-rd-night-bread-practical-guide.html" class="btn btn-primary">실전 정리부터</a>
            <a href="categories/" class="btn btn-secondary">전체 가이드</a>
            <a href="about/" class="btn btn-secondary">소개</a>
          </div>`
  );
  fs.writeFileSync(indexPath, index);
  console.log("✓ index CTA");
}

console.log("\nDone. Build next.");
