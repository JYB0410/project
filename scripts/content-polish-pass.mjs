/**
 * 사진 제외 본문 검수 후 보완 패스
 * - 실전 정리 HTML/내용 정리
 * - 짧은 칼럼 2000자+ 보강
 * - 일지 역할 문구 중복 정리
 * node scripts/content-polish-pass.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-08-14";

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

// ----- practical guide polish -----
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
guide.updatedAt = TODAY;

// fix broken nested </p></p> in fixed-draft
const fd = guide.sections.find((s) => s.id === "fixed-draft");
if (fd) {
  fd.content = fd.content.replace(/<\/p>\s*<\/p>/g, "</p>");
  // ensure winter bullet not inside broken p
  if (!fd.content.includes("56분 1순위") && fd.content.includes("58분")) {
    // already has winter in nested p - clean structure
  }
}

// strengthen material line in seven + add winter pointer after seven list
const seven = guide.sections.find((s) => s.id === "takeaway-seven");
if (seven && !seven.content.includes("15차")) {
  seven.content = seven.content.replace(
    /크기는 중간 우선\(<a href="bread-rd-night-bread-v14.html">14차<\/a>\)\. 크기 편차·손질 시간은 변수\./,
    `크기는 중간 우선(<a href="bread-rd-night-bread-v14.html">14차</a>). 큰 밤은 간격·가벼운 압착(<a href="bread-rd-night-bread-v15.html">15차</a>). 한 팬에 크기를 섞지 말 것.`
  );
}
if (seven && !seven.content.includes("겨울 보정은")) {
  seven.content +=
    `<p><strong>겨울 보정은 위 일곱 가지 밖 표</strong>로 모았습니다. 난방·습도·개방 분은 <a href="#winter-quick">겨울·난방 표</a>를 보세요. 일지 9~13차를 처음부터 읽을 필요는 없습니다.</p>`;
}

// mistakes: add winter/material items if missing
const mistakes = guide.sections.find((s) => s.id === "mistakes-home");
if (mistakes && !mistakes.content.includes("여름 발효")) {
  mistakes.content = mistakes.content.replace(
    /<\/ul>/,
    `<li><strong>여름 발효 분을 겨울에 그대로 쓰기</strong> — 습도·난방 메모 없이 58·55분을 복사</li>
<li><strong>밤 크기를 한 팬에 섞기</strong> — 14차에서 들쭉날쭉의 원인. 중간만 본굽에 쓰기</li>
<li><strong>일지 15편을 순서대로 다 읽어야 한다고 생각하기</strong> — 이 글 + 막히는 항목 일지 1~2편이면 시작 가능</li>
</ul>`
  );
}

// practice-notes on guide: concrete this-week actions
const gPr = guide.sections.find((s) => s.id === "practice-notes");
if (gPr) {
  gPr.content = `
<aside class="value-box"><p><strong>이번 주 한 가지만</strong> — 일곱 가지를 한꺼번에 적용하지 마세요.</p></aside>
<p>처음이면 <strong>2차 토핑 시점</strong>과 <strong>4차 보관(루즈 백)</strong>만 맞춰 보세요. 반죽·시럽은 쓰던 식빵 기준을 유지해도 됩니다. 다음 날 아침 한 줄 메모를 추가하세요.</p>
<p>겨울이면 일곱 가지 전체가 아니라 <strong>겨울 표</strong>의 온도·습도·발효 분·개방 분만 먼저 적으세요. 숫자가 아니라 눌림이 우선입니다.</p>
<p>이미 여러 차를 따라 했다면, 고정값 초안에서 <strong>하나만 빼고</strong> 다시 구워 보세요. 빠진 항목이 필요한지 확인하는 방법입니다.</p>
<p>재료 시즌(가을)이면 <a href="bread-rd-night-bread-v14.html">14차</a> 중간 크기 선별만 추가해 보세요.</p>
<p>발행 ${guide.publishedAt}, 수정 ${TODAY} (허브 재편·1~15차 반영).</p>`;
}

console.log("✓ practical guide polished");

// ----- R&D: remove double banners / redundant "가져갈 점" after role -----
for (const post of posts) {
  if (!/bread-rd-night-bread-v\d+$/.test(post.slug)) continue;
  const first = post.sections[0];
  if (!first) continue;
  // if both role-banner and value-box, keep both but ensure value doesn't repeat role
  let c = first.content;
  // collapse multiple consecutive asides of same class
  c = c.replace(/(<aside class="role-banner"[\s\S]*?<\/aside>)\s*\1/gi, "$1");
  c = c.replace(/(<aside class="value-box"[\s\S]*?<\/aside>)\s*\1/gi, "$1");
  first.content = c;
  post.updatedAt = TODAY;
}
console.log("✓ R&D banner cleanup");

// ----- expand short columns -----
const colBoost = {
  "home-oven-temperature-notes": {
    id: "editor-note",
    append: `<p>집 오븐 메모를 남길 때 저는 ‘라벨 200°C = 실제 상화 ○○°C / 예열 ○분 / 문 연 횟수’를 한 줄에 묶습니다. 같은 레시피를 학원과 집에서 비교할 때, 이 한 줄이 없으면 실패 원인을 반죽으로만 돌리기 쉽습니다. 밤식빵 R&D에서도 굽기 라벨은 1차부터 유지하되, <strong>실제 색·시간은 집 기준으로 보정</strong>한다는 전제를 두고 있습니다. 오븐을 바꾸면 대응표를 처음부터 다시 쌓는 것이 맞습니다.</p>`
  },
  "month-after-pass-before-rd": {
    id: "editor-note",
    append: `<p>합격 직후 바로 R&D를 열지 않은 달은 ‘게으름’이 아니라 <strong>시험 반죽과 연구 반죽을 섞지 않기 위한 간격</strong>이었습니다. 학원 품목만 가볍게 반복하며 메모 네 칸 습관을 유지한 뒤, 밤식빵 변수를 열었습니다. 지금 사이트의 일지 형식(목표·실패·원인·변수 하나)은 그 한 달에 굳어진 것입니다. 합격 직후 바로 대량 실험을 시작하면 기록이 흐려진다는 경험도 같이 남깁니다.</p>`
  },
  "why-no-complete-recipe": {
    id: "editor-note",
    append: `<p>완성 그램 표를 올리지 않는 이유는 정보가 없어서가 아니라, <strong>제 환경 숫자를 그대로 옮기면 어긋날 수 있다</strong>는 판단 때문입니다. 대신 일지에서 검증된 순서·고정값 초안·망하기 쉬운 점을 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>에 모았습니다. 독자가 가져갈 것은 레시피 복제가 아니라, 집 오븐에서 한 변수씩 확인하는 방법입니다. 확정 레시피를 올릴 수 있는 단계가 오면 ‘제 환경 기준’을 분명히 적고 올리겠습니다.</p>`
  }
};

for (const [slug, boost] of Object.entries(colBoost)) {
  const col = columns.find((c) => c.slug === slug);
  if (!col) continue;
  const sec = col.sections.find((s) => s.id === boost.id) || col.sections[col.sections.length - 1];
  if (!sec.content.includes(boost.append.slice(20, 50))) {
    sec.content += boost.append;
  }
  col.updatedAt = TODAY;
  const n = postCharCount(col);
  console.log(`✓ column ${slug}: ${n} chars`);
}

// ----- mid-review role clarity -----
const mid = posts.find((p) => p.slug === "bread-rd-night-bread-mid-review");
if (mid) {
  mid.updatedAt = TODAY;
  const first = mid.sections[0];
  if (first && !first.content.includes("1~5차 합산") && !first.content.includes("실전 정리가 최신")) {
    // already may have role banner
  }
  if (first && !first.content.includes("실전 정리가 최신") && !first.content.includes("8차 이후·겨울")) {
    first.content =
      `<aside class="role-banner"><p><strong>이 글의 역할</strong> — 1~5차 합산 중간 정리입니다. <strong>8차 이후·겨울·재료 결론은 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>가 최신</strong>입니다.</p></aside>` +
      first.content.replace(/<aside class="role-banner"[\s\S]*?<\/aside>/, "");
  }
}

// series excerpt sync
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.updatedAt = TODAY;
  series.excerpt =
    "일지가 많다면 실전 정리부터 보세요. 이 글은 실험 결과가 아니라, 짧게/깊게 읽는 경로만 안내합니다.";
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);

// final counts
console.log("\n--- final char counts ---");
for (const p of posts.filter((x) => x.slug.includes("practical") || x.slug.includes("series"))) {
  console.log(p.slug, postCharCount(p));
}
for (const c of columns) {
  console.log(c.slug, postCharCount(c));
}
console.log("done");
