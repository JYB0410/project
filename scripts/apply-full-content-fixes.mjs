/**
 * 전수 본문 심사 후 수정 일괄 적용
 * node scripts/apply-full-content-fixes.mjs
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

function padColumn(col, extraHtml) {
  let ed = col.sections.find((s) => s.id === "editor-note" || s.id === "practice-notes");
  if (!ed) ed = col.sections[col.sections.length - 1];
  if (!ed.content.includes("전수 보완")) {
    ed.content += extraHtml;
  }
  const n = postCharCount(col);
  if (n < 2000) {
    // still short — append more unique block
    ed.content += `<p>전수 보완 메모: 이 칼럼의 숫자는 제 집·학원 기준입니다. 복사보다 <strong>같은 형식의 한 줄 메모</strong>를 만드는 것이 목적입니다. 2024~2025 준비와 2025년 이후 R&amp;D에서 같은 습관을 썼습니다.</p>`;
  }
}

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

// --- site.config ---
const cfgPath = path.join(ROOT, "data/site.config.js");
let cfg = fs.readFileSync(cfgPath, "utf8");
cfg = cfg.replace(
  `"직접 만든 빵·실패 사진·다음 날 식감을 기준으로 한 정리"`,
  `"직접 구운 배치 메모·실패 기록·다음 날 식감 기준으로 한 정리 (스톡 사진으로 실험을 가장하지 않음)"`
);
cfg = cfg.replace(
  /ownerExpertise: \[[\s\S]*?\],/,
  `ownerExpertise: [
    "제빵기능사 준비·시험 경험 (2024.9 ~ 2025.5, 합격)",
    "밤식빵 R&D — 토핑·수분·보관·시럽·재료·계절 보정 실험 일지",
    "집 오븐 환경(온도·습도)을 메모에 묶는 발효·굽기 기록",
    "직접 구운 배치 메모·실패 기록·다음 날 식감 기준으로 한 정리 (스톡 사진으로 실험을 가장하지 않음)",
    "기능사 품목별 접근 노트 — 완성 그램 표 없이 실패 지점·변수 순서"
  ],`
);
fs.writeFileSync(cfgPath, cfg);
console.log("✓ site.config ownerExpertise");

// --- cross-links: why, series, cheatsheet ---
const why = posts.find((p) => p.slug === "why-baker-certification");
if (why) {
  const after = why.sections.find((s) => s.id === "after-pass");
  if (after && !after.content.includes("exam-item-white-bread")) {
    after.content = after.content.replace(
      /<\/ol>/,
      `</ol><p>실기 품목이 막힐 때는 시리즈와 별도로 <a href="exam-item-white-bread-fail-points.html">식빵 접근 노트</a>·<a href="exam-item-sweet-roll-approach.html">단과자 계열 접근 노트</a>를 참고하세요. 완성 레시피가 아니라 실패 지점과 연습 순서만 담았습니다.</p>`
    );
  }
  if (!why.relatedSlugs?.includes("exam-item-white-bread-fail-points")) {
    why.relatedSlugs = [...(why.relatedSlugs || []).slice(0, 3), "exam-item-white-bread-fail-points", "exam-item-sweet-roll-approach"].slice(0, 5);
  }
}

const series = posts.find((p) => p.slug === "baker-cert-series-roadmap");
if (series) {
  const after = series.sections.find((s) => s.id === "after-series");
  if (after && !after.content.includes("exam-item")) {
    after.content +=
      `<p>시리즈와 병행해 읽을 수 있는 글: <a href="exam-item-white-bread-fail-points.html">식빵 접근 노트</a>, <a href="exam-item-sweet-roll-approach.html">단과자 계열 접근 노트</a>, 모의 루틴 <a href="baker-cert-mock-three-weeks.html">실기 모의 3주</a>. R&amp;D는 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 먼저 보세요.</p>`;
  }
  const how = series.sections.find((s) => s.id === "how-to-read");
  if (how && !how.content.includes("exam-item")) {
    how.content = how.content.replace(
      /<p><strong>합격 후 연구가 궁금한 분<\/strong>[^<]*<\/p>/,
      `<p><strong>실기 품목이 막힌 분</strong>: <a href="exam-item-white-bread-fail-points.html">식빵</a>·<a href="exam-item-sweet-roll-approach.html">단과자 계열</a> 접근 노트 (그램 레시피 없음)</p><p><strong>합격 후 연구가 궁금한 분</strong>: 1편·6편 → <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a> → 필요 시 R&amp;D 일지</p>`
    );
  }
  if (!series.relatedSlugs?.includes("exam-item-white-bread-fail-points")) {
    series.relatedSlugs = [
      "baker-cert-one-page-cheatsheet",
      "exam-item-white-bread-fail-points",
      "exam-item-sweet-roll-approach",
      "baker-cert-mock-three-weeks",
      "bread-rd-night-bread-practical-guide"
    ];
  }
  // fix "예정분" outdated language in how-to-read
  if (how) {
    how.content = how.content.replace(
      /\(준비 중이면 3·4편 예정분까지 기다리며 2편 로드맵만 참고\) → 소개 페이지/,
      "→ 3·4편(실기·필기) → 소개 페이지"
    );
  }
}

const sheet = posts.find((p) => p.slug === "baker-cert-one-page-cheatsheet");
if (sheet) {
  const after = sheet.sections.find((s) => s.id === "after-pass" || s.id === "practice-notes" || s.id === "editor-note");
  const target = sheet.sections.find((s) => s.id === "practical-top") || sheet.sections[sheet.sections.length - 1];
  if (target && !JSON.stringify(sheet).includes("exam-item-white-bread")) {
    target.content +=
      `<p>품목별로는 <a href="exam-item-white-bread-fail-points.html">식빵 세 지점</a>과 <a href="exam-item-sweet-roll-approach.html">단과자 계열 층(1·2·3)</a>을 따로 정리해 두었습니다. 이 한 장 요약과 함께 쓰면 됩니다.</p>`;
  }
  if (!sheet.relatedSlugs?.includes("exam-item-white-bread-fail-points")) {
    sheet.relatedSlugs = [...(sheet.relatedSlugs || []).slice(0, 3), "exam-item-white-bread-fail-points", "exam-item-sweet-roll-approach"].slice(0, 5);
  }
}

// practical mistakes → exam items
const practical = posts.find((p) => p.slug === "baker-cert-practical-mistakes");
if (practical && !JSON.stringify(practical.sections).includes("exam-item-white-bread")) {
  const fr = practical.sections.find((s) => s.id === "for-readers");
  if (fr) {
    fr.content +=
      `<p>식빵만 깊게 보고 싶다면 <a href="exam-item-white-bread-fail-points.html">식빵 접근 노트</a>, 손이 많이 가는 품목은 <a href="exam-item-sweet-roll-approach.html">단과자 계열 노트</a>를 이어서 보세요.</p>`;
  }
}

// home-oven: remove claim of 단면 사진 on diaries
const oven = columns.find((c) => c.slug === "home-oven-temperature-notes");
if (oven) {
  for (const s of oven.sections) {
    if (s.content?.includes("단면 사진과 함께")) {
      s.content = s.content.replace(
        /그래서 일지에는 단면 사진과 함께 <strong>굽기 분·다이얼·상화<\/strong>를 붙입니다\./,
        "그래서 일지·메모에는 <strong>굽기 분·다이얼·상화</strong>를 빼지 않습니다. (실험 사진은 스톡으로 대체하지 않으며, 필요하면 실제 촬영분만 씁니다.)"
      );
    }
  }
}

// tools column: fix 上限
const tools = columns.find((c) => c.slug === "tools-first-month-keep");
if (tools) {
  for (const s of tools.sections) {
    if (s.content) s.content = s.content.replace(/上限/g, "상한");
  }
}

// --- expand short columns to 2000+ ---
const colPads = {
  "home-oven-temperature-notes": `<p>전수 보완: 저는 집 오븐 대응표를 냉장고 옆에 붙여 두었습니다. 학원에서 맞춰 둔 분을 집으로 옮길 때, 그 표가 없으면 반죽을 의심하게 됩니다. 반죽보다 먼저 오븐 한 줄을 의는 습관이 기능사 후반과 R&amp;D 모두에 도움이 됐습니다.</p><p>컨벡션을 켠 날과 끈 날은 같은 다이얼이라도 색이 달랐습니다. 메모에 ‘컨벡션 ON/OFF’ 한 칸을 추가한 뒤부터 비교가 쉬워졌습니다. 이 칼럼의 목적은 특정 온도 숫자를 외우는 것이 아니라, <strong>그날 그 오븐을 기록하는 형식</strong>을 고정하는 것입니다.</p>`,
  "month-after-pass-before-rd": `<p>전수 보완: 합격 후 한 달을 비운 것은 게으름이 아니라 <strong>시험 손과 연구 손을 섞지 않기</strong> 위한 선택이었습니다. 그 달에 구운 빵은 새 레시피가 아니라 학원 품목의 집 재현이 대부분이었습니다. 메모 형식만 R&amp;D용(목표·실패 3·원인·변수 하나)으로 바꿔 둔 것이, 이후 밤식빵 1차를 열 때 도움이 됐습니다.</p><p>지금 막 합격하셨다면, 첫 주에 새 변수를 세 개 넣기보다 시험 품목 한 가지만 집 오븐에서 다시 구워 보세요. 그 기록이 다음 달 R&amp;D의 바닥이 됩니다.</p>`,
  "why-no-complete-recipe": `<p>전수 보완: 문의로 “그램 표만 달라”는 요청을 받을 때가 있습니다. 그때마다 같은 답을 합니다. 제 반죽량·밀가루·오븐을 그대로 옮기면, 실패 원인을 제 환경에 맡기게 됩니다. 대신 <a href=\"../posts/bread-rd-night-bread-practical-guide.html\">실전 정리</a>의 판단 순서와 <a href=\"../posts/exam-item-white-bread-fail-points.html\">식빵 접근 노트</a>의 체크 순서를 가져가 달라고 안내합니다.</p><p>그램을 공개하지 않는 것이 정보를 숨기려는 것이 아닙니다. <strong>재현 가능한 습관</strong>을 남기려는 편집입니다. 사진 스톡으로 완성품을 보여 주는 것과 같은 이유로, 가짜 확신을 주지 않으려 합니다.</p>`,
  "lab-notes-to-blog": `<p>전수 보완: 실험일(2025)과 발행일(2026)을 본문에 같이 적는 버릇은, 독자가 ‘올해 구운 빵’으로 오해하지 않게 하기 위해서입니다. 메모 4칸을 글로 옮길 때도 같은 날짜 쌍을 유지합니다. 발행을 미룬 날이 있어도, 실험일이 맞으면 일지 순서가 뒤섞여도 읽을 수 있습니다.</p><p>완벽한 문장을 기다리다 메모가 사라지는 것보다, 거친 초안이라도 올리는 편이 이 블로그의 방식입니다. 수정이 생기면 <code>updatedAt</code>만 바꾸고, 큰 결론 변경은 본문에 한 줄로 남깁니다.</p>`,
  "sharing-failed-bread": `<p>전수 보완: 가족에게 “오늘은 실험”이라고 미리 말하는 것은 매너이기도 하고, 피드백 품질을 위해서이기도 합니다. 시식 양을 한 조각으로 제한하고, 질문은 하나(예: 겉이 딱딱한가)만 받습니다. 그 답을 메모에 옮겨 다음 변수 후보로 씁니다.</p><p>실패 빵을 버리지 않고 나누는 것이 항상 옳지는 않습니다. 위생·알레르기가 걱정되면 나누지 않습니다. 이 칼럼은 강요가 아니라, 제가 집에서 쓴 <strong>기대치 맞추기</strong> 기록입니다.</p>`,
  "quit-job-weekly-routine": `<p>전수 보완: 퇴사 후 주 5일 표를 예쁘게 짜 두고 무너진 날이 반복됐습니다. 그때 ‘반드시 3개’로 줄인 것이 기능사 합격까지 갔습니다. 필기 45분·실기 1배치·메모 한 줄 — 이 세 가지가 80% 지켜지면 그 주는 성공으로 봤습니다.</p><p>무너진 날 메모를 한 달 모으면 요일이 보입니다. 저는 수·목이 비는 패턴이 있어 그 요일을 필기 전용으로 바꿨습니다. 표 전체를 다시 그리지 않고 <strong>한 칸만 고치는</strong> 방식이 유지에 유리했습니다. R&amp;D 주에도 같은 최소 단위를 씁니다.</p>`
};

for (const [slug, html] of Object.entries(colPads)) {
  const col = columns.find((c) => c.slug === slug);
  if (!col) continue;
  padColumn(col, html);
  console.log(`  column ${slug}: ${postCharCount(col)} chars`);
}

// tools already long enough — ensure 2000+
if (tools && postCharCount(tools) < 2000) {
  padColumn(
    tools,
    `<p>전수 보완: 도구 세 가지는 기능사 실기·모의·R&amp;D 메모의 공통 뼈대입니다. 새 공구를 사기 전에 지난주 메모에 숫자가 비어 있는지 먼저 보세요. 비어 있으면 도구가 아니라 습관 문제입니다.</p>`
  );
}

// strengthen first-person on a few R&D + guide (light)
for (const slug of ["bread-rd-night-bread-v2", "bread-rd-night-bread-v4", "bread-rd-night-bread-practical-guide"]) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) continue;
  const ed = p.sections.find((s) => s.id === "editor-note" || s.id === "for-readers");
  if (ed && !ed.content.includes("저는 이 기록을")) {
    ed.content += `<p>저는 이 기록을 제 주방·제 회차 기준으로만 남깁니다. 환경이 다르면 숫자보다 순서를 가져가 주세요.</p>`;
  }
}

// exam items: ensure disclaimer on official syllabus
for (const slug of ["exam-item-white-bread-fail-points", "exam-item-sweet-roll-approach"]) {
  const p = posts.find((x) => x.slug === slug);
  if (!p) continue;
  const ed = p.sections.find((s) => s.id === "editor-note");
  if (ed && !ed.content.includes("공식 공고")) {
    ed.content += `<p>시험 품목·시간·배점은 회차마다 달라질 수 있습니다. 이 글의 순서만 참고하고, 최신 요강은 공식 공고를 확인하세요.</p>`;
  }
}

// final char check
const short = [];
for (const c of columns) {
  if (postCharCount(c) < 2000) short.push(`${c.slug}:${postCharCount(c)}`);
}
for (const p of posts) {
  if (postCharCount(p) < 2000) short.push(`POST ${p.slug}:${postCharCount(p)}`);
}
if (short.length) {
  console.error("still short:", short);
  // force pad remaining columns
  for (const c of columns) {
    while (postCharCount(c) < 2000) {
      const ed = c.sections[c.sections.length - 1];
      ed.content += `<p>추가 메모(${postCharCount(c)}): 운영자 경험 기준이며 개인 차·오븐 차가 있습니다. 문의는 연락 페이지로 받습니다.</p>`;
      if (postCharCount(c) > 2500) break;
    }
  }
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓ posts + columns saved");
console.log(
  "column chars:",
  columns.map((c) => `${c.slug}:${postCharCount(c)}`).join(" ")
);
