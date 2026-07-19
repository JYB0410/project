/**
 * 밤식빵 R&D 11차 추가 + 연관 글 링크 갱신
 * node scripts/add-bread-rd-v11.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  const expr = code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

function fig(slug, id, alt) {
  return `<figure class="article-figure"><img src="../assets/images/photos/${slug}/${id}.jpg" alt="${alt}" loading="lazy" class="article-img" width="1200" height="675"><figcaption>${alt}</figcaption></figure>`;
}

const slug = "bread-rd-night-bread-v11";

const v11 = {
  slug,
  title: "밤식빵 R&D 11차 — 습도 40% 넘는 날, 58분을 다시 굽다",
  subtitle: "9·10차 고정값 유지, 환경만 습도 42%로 재현",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-07-02",
  updatedAt: "2026-07-02",
  featured: false,
  status: "published",
  excerpt:
    "2026년 2월 9일, 9차·10차에서 맞춘 겨울 조합을 습도 42%인 날에 그대로 재현했습니다. 58분은 저습도(35%) 기준에 가깝고, 이날은 손가락 눌림이 조금 빨랐습니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v9.html">9차</a>에서 1차 발효 58분, <a href="bread-rd-night-bread-v10.html">10차</a>에서 식힌 뒤 바로 루즈 백을 겨울 기본으로 잡았습니다. 다만 두 실험 모두 습도가 <strong>35~36%</strong>대였고, '습도 40% 이상인 날에도 58분이 맞는지'는 따로 열어 두지 않았습니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>11차 목표는 반죽·시럽·밤·브러싱·보관 분(0분)을 건드리지 않고, <strong>실내 습도만 다른 날</strong>에 같은 58분을 재현하는 것이었습니다. 레시피를 바꾸는 날이 아니라, 9차 숫자가 환경 메모 없이 복사되면 안 된다는 걸 확인하는 날입니다.</p><p>2026년 2월 9일 실험입니다. 난방은 켜 두었지만 눈이 녹는 날이라 주방 습도계가 <strong>42%</strong>까지 올라갔습니다. 실내 온도는 19°C로 9·10차와 같았습니다. 1차 발효는 타이머 58분으로 시작하되, 손가락 눌림을 중간에 확인하기로 했습니다.</p><p>보관은 10차 A안 — 식힌 직후 바로 루즈 백. 개방 분을 다시 늘리지 않았습니다. 변수가 습도로 보이려면 보관은 고정해야 했습니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>발효 속도</strong> — 58분 종료 시점 손가락 눌림이 9차보다 느슨. 약 55~56분쯤이 9차와 비슷한 텐션이었을 가능성</li><li><strong>겉·속 (다음 날)</strong> — 10차 바로 백과 비슷. 겉 건조는 9차(40분 개방)보다 양호</li><li><strong>향·밀착</strong> — 8·9차 수준 유지. 습도만 바꿨다고 토핑이 무너지진 않음</li></ol><p>가족은 '어제(10차)랑 비슷하다'고 했습니다. 제 기준으로 <strong>11차는 부분 확인</strong> — 겨울 조합은 유지 가능하지만, <strong>58분은 습도 35%대 기준 숫자</strong>이지 모든 겨울 날의 정답이 아닙니다.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 오븐 색·윤기는 9차와 구분하기 어려웠습니다. 차이는 발효 중·직후 반죽 텐션에서 먼저 보였고, 다음 날 식감 차이는 10차와의 비교에서 작았습니다.</p><p>58분을 끝까지 밀어 구운 이유는 '숫자를 한 번 더 검증'하기 위해서였습니다. 중간에 55분으로 잘랐다면 9차와 다른 변수가 섞입니다. 다음 날 메모에 '다음엔 42%면 55~56분 후보'를 적어 두었습니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>습도 ↑ → 같은 분에서 발효가 더 진행</strong> — 부분 확인. 온도 19°C 동일, 습도만 35→42%. 눌림 테스트가 9차보다 이르게 느슨해짐.</p><p><strong>바로 백 보관</strong> — 10차 재현. 겉 건조는 9차 대비 양호, 소폭 눅눅함은 허용 범위.</p><p><strong>58분 = 겨울 고정값</strong> — 기각에 가깝. 정확히는 <strong>19°C·습도 35% 전후에서의 기준 분</strong>. 습도가 오르면 분을 줄이거나, 분을 유지하되 손가락 눌림을 우선.</p><p>9차에서 '환경마다 58분이 정답이 아닐 수 있다'고 FAQ에 적어 둔 문장을, 11차가 숫자로 받쳐 줍니다. 타이머만 복사하지 말라는 실전 정리 주의와 같습니다.</p><p>눈이 녹는 날·빨래 건조 직후·주방 창을 잠깐 연 날처럼 습도만 튀는 경우가 있어, 메모 칸에 습도를 빼먹으면 58분 재현이 어긋납니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: 9차 반죽·시럽·밤·브러싱·58분 타이머 시작 + 10차 바로 루즈 백. 달라진 것: <strong>실내 습도 42%</strong>(9·10차는 35~36%). 의도적으로 레시피 숫자를 바꾸지 않았습니다.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>'환경'을 변수로 세는 날이었습니다. 오븐·밀가루·밤 배치가 같아야 습도 효과만 보입니다. 반죽 위치는 9·10차와 같이 식탁~오븐 3m, 난방 바람 직사 회피.</p><p>반죽 종료 24°C, 굽기 200/190°C 32분. 실험일 2026-02-09, 발행 2026-07-02.</p><p>습도계는 발효 시작 직전과 종료 직후 두 번 읽었습니다. 42% → 41%로 거의 유지됐습니다. 한 번만 재면 '그날 분위기'로 착각하기 쉽습니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>습도 42%대에서 1차 발효 <strong>55~56분</strong> 단일 배치 확인</li><li>신선 밤 크기 선별 루틴 (겨울 밖 재료 변수)</li><li>바로 백 입구 헐거움 미세 조정 (10차 눅눅함 잔여)</li></ul><p>11차로 '58분을 맹신하지 말 것'은 확인했습니다. 다음 구움은 분을 줄이되, 습도·온도 메모를 같은 줄에 남깁니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>실전 정리 FAQ·고정값 줄에 '습도 40% 이상이면 분 단축 후보' 한 줄을 반영할 예정입니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 분을 미리 줄이지 않았나",
      content: `<p>습도가 높은 날 처음부터 55분으로 가면, 9차 58분과의 비교가 흐려집니다. 11차는 <strong>같은 타이머를 한 번 더 밀어</strong> 환경 차이만 보이게 하려는 목적이었습니다.</p><p>과발효가 심했다면 중간에 잘랐겠지만, 당일 기준으로는 '조금 더 느슨한 9차' 수준이었습니다. 그래서 굽기까지 진행하고, 다음 후보로 분 단축을 남겼습니다.</p><p>9·10·11차는 겨울 시리즈로 묶입니다. 9=발효 분, 10=보관 개방, 11=습도 재현. 세 편이 있어야 '겨울 고정값'이 표가 아니라 조건 묶음이 됩니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>겨울에 타이머만 58분으로 맞추셨다면, 그날 습도를 같이 적어 보셨는지 <a href="../contact/">문의</a>로 알려 주세요. 제 11차는 42%에서 58분이 조금 여유 있었습니다.</p><p>난방 온도만 같고 습도가 다르면 결과가 갈립니다. 온도계만 보고 분을 고정하지 마세요.</p><p>처음이면 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a> → <a href="bread-rd-night-bread-v9.html">9차</a> → <a href="bread-rd-night-bread-v10.html">10차</a> 순으로 보시고, 11차는 '숫자 복사 금지' 보강 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2026-02-09, 난방 ON, 습도 42%→41%, 1차 58분(눌림은 9차보다 느슨), 바로 루즈 백. 다음 날 겉·속 한 줄.</p><p>겨울 메모에 '습도' 칸을 발효 분 바로 옆에 두었습니다. 온도만 적던 9차 초안보다 비교가 빨랐습니다.</p><p>타이머와 손가락 눌림이 어긋나면 <strong>눌림을 우선</strong>하고, 타이머 숫자는 '그날 환경에서의 참고값'으로만 남깁니다. 11차 결론을 한 줄로 쓰면 이 문장입니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>11차는 <strong>9·10차 겨울 조합을 습도 42% 날에 재현</strong>한 기록이었습니다. 겉·속은 10차와 비슷했고, 발효는 같은 58분에서 9차보다 조금 더 진행된 느낌이었습니다.</p><p>58분은 폐기하지 않습니다. 다만 <strong>19°C·저습도(35% 전후) 기준</strong>으로 두고, 습도가 오르면 분 단축 또는 눌림 우선으로 보정합니다. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 한 줄 반영합니다.</p><p>다음 후보는 42%대에서 55~56분 확인, 밤 선별 루틴입니다.</p>`
    }
  ],
  summary:
    "9·10차 고정값 유지, 습도 42% 날에 1차 발효 58분 재현. 눌림이 9차(35%)보다 느슨해 58분은 저습도 기준임을 확인. 보관은 바로 백, 겉·속은 10차와 유사.",
  commonMistakes: [
    "습도 메모 없이 58분을 모든 겨울 날에 복사하기",
    "온도만 같고 습도가 다른데 같은 분으로 단정하기",
    "재현 실험에서 보관·발효를 동시에 바꾸기",
    "타이머만 보고 손가락 눌림을 생략하기"
  ],
  checklist: [
    "9·10차 고정값 재확인",
    "발효 전·후 습도 두 번 기록",
    "58분이어도 중간 눌림 확인",
    "보관은 바로 백 유지"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v9",
    "bread-rd-night-bread-v10",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "11차에서 발효 분을 바꿨나요?",
      a: "타이머는 9차와 같이 58분으로 맞췄습니다. 다만 습도 42%에서는 눌림이 더 빨랐고, 다음 후보로 55~56분을 남겼습니다."
    },
    {
      q: "습도 40% 넘으면 몇 분이 정답인가요?",
      a: "제 환경에서는 아직 단일 확정값이 없습니다. 42% 하루 기준 55~56분 후보이고, 손가락 눌림을 우선하세요."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v11);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  posts[posts.findIndex((p) => p.slug === slug)] = v11;
  console.log("✓ replaced existing v11");
} else {
  posts.push(v11);
  console.log("✓ appended v11");
}

const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~11차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·11차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  series.updatedAt = "2026-07-02";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v11")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v10.html">10차</a> — 겨울 보관, 개방 0분 vs 30분</li></ol>`,
        `<li><a href="bread-rd-night-bread-v10.html">10차</a> — 겨울 보관, 개방 0분 vs 30분</li><li><a href="bread-rd-night-bread-v11.html">11차</a> — 습도 40%+ 날 58분 재현</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        /이후 후보: 습도 40% 이상 날 9차 재현, 밤 선별 루틴\./,
        `<a href="bread-rd-night-bread-v11.html">11차 습도 재현</a>까지 발행. 이후 후보: 42%대 55~56분 확인, 밤 선별 루틴.`
      );
    }
  }
  if (!series.relatedSlugs.includes(slug)) {
    series.relatedSlugs = [
      "bread-rd-night-bread-practical-guide",
      "bread-rd-night-bread-v1",
      "bread-rd-night-bread-v11",
      "baker-cert-to-bread-rd"
    ];
  }
  console.log("✓ series guide");
}

const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-07-02";
  for (const s of guide.sections) {
    if (s.id === "fixed-draft" && !s.content.includes("11차")) {
      s.content = s.content.replace(
        /<p><strong>겨울 보정\(9차\)<\/strong>: 난방 실내 19°C·습도 35% 전후에서 1차 발효 <strong>58분<\/strong>\(8차 여름 55분 대비 \+3분\)\. 손가락 눌림 기준은 8차와 동일하게 맞춤\.<\/p>/,
        `<p><strong>겨울 보정(9차)</strong>: 난방 실내 19°C·습도 35% 전후에서 1차 발효 <strong>58분</strong>(8차 여름 55분 대비 +3분). 손가락 눌림 기준은 8차와 동일하게 맞춤. <strong>습도 40% 이상</strong>이면 같은 58분이 여유 있을 수 있음(<a href="bread-rd-night-bread-v11.html">11차</a>) — 타이머보다 눌림 우선, 55~56분 후보.</p>`
      );
    }
    if (s.id === "when-read-logs" && !s.content.includes("v11")) {
      s.content = s.content.replace(
        /전체 맥락은/,
        `겨울·습도 메모 → <a href="bread-rd-night-bread-v9.html">9</a>·<a href="bread-rd-night-bread-v11.html">11차</a>. 전체 맥락은`
      );
    }
    if (s.id === "editor-note" && !s.content.includes("v11")) {
      s.content +=
        `<p><a href="bread-rd-night-bread-v11.html">11차</a>에서 습도 42% 날 58분 재현 결과를 반영했습니다. 저습도 기준 분과 고습도 보정을 구분해 두었습니다.</p>`;
    }
    if (s.id === "practice-notes" && !s.content.includes("v11")) {
      s.content = s.content.replace(
        /수정 2026-06-29\(10차 보관\)/,
        `수정 2026-07-02(11차 습도)`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [...guide.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v10"), "bread-rd-night-bread-v10", slug].slice(0, 5);
  }
  console.log("✓ practical guide");
}

const v10 = posts.find((p) => p.slug === "bread-rd-night-bread-v10");
if (v10) {
  for (const s of v10.sections) {
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /<li>습도 40% 이상인 날 9차 발효 58분 재현 \(개방은 0~30분으로 고정\)<\/li>/,
          `<li><a href="bread-rd-night-bread-v11.html">11차</a> 발행: 습도 40% 이상 날 58분 재현 (개방 0분 고정)</li>`
        )
        .replace(
          /실전 정리 고정값의 보관 줄에 <strong>겨울: 식힌 뒤 개방 0~30분<\/strong> 메모를 반영할 예정입니다\./,
          `실전 정리에 겨울 개방 0~30분·습도 보정 메모를 반영했습니다. 습도 재현은 <a href="bread-rd-night-bread-v11.html">11차</a>에서 이어갔습니다.`
        );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /다음 후보는 습도 40% 이상 날의 58분 재현과, 바로 백 눅눅함의 미세 조정입니다\./,
        `습도 재현은 <a href="bread-rd-night-bread-v11.html">11차</a>에서 이었고, 바로 백 눅눅함 미세 조정은 이후로 남겼습니다.`
      );
    }
  }
  if (!v10.relatedSlugs.includes(slug)) {
    v10.relatedSlugs = [slug, ...v10.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v10 links");
}

fs.writeFileSync(
  postsPath,
  `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`,
  "utf8"
);
console.log("✓ wrote data/posts.js");
