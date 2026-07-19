/**
 * 밤식빵 R&D 10차 추가 + 연관 글 링크 갱신
 * node scripts/add-bread-rd-v10.mjs
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

const slug = "bread-rd-night-bread-v10";

const v10 = {
  slug,
  title: "밤식빵 R&D 10차 — 겨울 보관, 식힌 뒤 개방 시간을 줄인 날",
  subtitle: "9차 58분 고정, 보관 전 개방 0분 vs 30분만 비교",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-06-29",
  updatedAt: "2026-06-29",
  featured: false,
  status: "published",
  excerpt:
    "2026년 1월 26일, 9차와 같은 겨울 난방 실내·1차 발효 58분 위에서 보관 전 개방 시간만 비교했습니다. 바로 루즈 백이 겉 건조를 가장 줄였고, 30분 개방은 그 중간이었습니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v9.html">9차</a>에서 속 식감은 8차와 비슷해졌지만, 난방 건조로 <strong>겉 껍질이 조금 더 딱딱</strong>했습니다. 원인 후보로 '식힌 뒤 백에 넣기 전 개방 시간'이 남았고, 그날은 40분 개방 후 루즈 백이었습니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>10차 목표는 레시피를 건드리지 않고, <strong>겨울 한정 보관 전 개방</strong>만 보는 것이었습니다. 9차 다음 시도에 적어 둔 '30분 개방 vs 바로 루즈 백'을 같은 반죽에서 나란히 비교했습니다.</p><p>2026년 1월 26일 실험입니다. 실내 19°C(난방), 습도 36% 전후 — 9차(35%)와 거의 같은 환경. 1차 발효 <strong>58분</strong>, 브러싱·신선 밤·시럽·반죽은 9차와 동일. 바꾼 것은 식힌 뒤 <strong>백에 넣기 전 개방 분</strong>뿐입니다.</p><p>같은 날 반죽을 둘로 나눠 작은 팬 두 개를 썼습니다. A는 식힌 직후 바로 루즈 백, B는 식힌 뒤 랙에서 <strong>30분</strong> 개방 후 루즈 백. 오븐 문을 두 번 열지 않도록 구이는 한 배치로 맞췄습니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>겉 건조 (다음 날)</strong> — A(바로 백)가 가장 부드러움. B(30분)는 A보다 약간 딱딱. 9차(40분 개방) 메모보다 B가 덜 건조</li><li><strong>속 촉촉함</strong> — A·B 모두 9차와 비슷. 루즈 백 효과는 유지</li><li><strong>겉 눅눅함</strong> — A에서만 소폭. 4차·8차에서 보던 트레이드오프가 겨울에도 재현</li></ol><p>가족은 A를 '어제보다 껍질이 덜 딱딱하다'고 했고, B는 '어제랑 비슷'에 가깝다고 했습니다. 제 기준으로 <strong>10차는 부분 성공</strong> — 겉 건조를 줄이는 방향은 확인했고, 바로 백의 소폭 눅눅함은 남았습니다.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 윤기·향·밀착은 A·B 모두 9차와 구분하기 어려웠습니다. 차이는 거의 다음 날 아침에만 보였습니다. 보관 변수는 또 한 번 '당일 맛만 보면 안 된다'는 4차 교훈을 반복했습니다.</p><p>A 껍질을 손가락으로 눌렀을 때 9차보다 소리가 덜 딱딱했고, B는 9차와 A의 중간이었습니다. 단면 기공은 둘 다 비슷했습니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>개방 시간 ↓ → 겉 건조 ↓</strong> — 부분 확인. 같은 날·같은 반죽에서 0분·30분만 달랐고, 다음 날 껍질 딱딱함이 순서대로 줄었습니다 (0 &lt; 30 &lt; 9차 40분 메모).</p><p><strong>바로 백 → 겉 눅눅함 소폭</strong> — 추정 재현. 여름 4차·8차와 같은 방향. 난방 건조 환경에서도 '개방을 줄이면 건조는 줄고 눅눅함은 늘 수 있다'.</p><p><strong>속 촉촉함</strong> — 3·4·8·9차 조합이 유지. 10차 단독 효과가 아님.</p><p>9차에서 '보관 전 1시간 개방은 건조 가속'이라고 추정만 남겼는데, 10차는 그 추정의 반대 방향(개방 단축)을 숫자로 확인한 날입니다. 습도 40% 이상 날은 아직 따로 열지 않았습니다.</p><p>두 팬을 같은 배치로 구웠기 때문에 오븐 위치 차이는 메모에 남겼습니다. A를 위 선반, B를 아래 선반에 두었고, 색 차이는 거의 없었습니다. 위치 변수를 완전히 제거하진 못했지만, 다음 날 껍질 차이는 보관 쪽 설명이 더 맞았습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: <a href="bread-rd-night-bread-v9.html">9차</a> 전체(8차 고정값 + 겨울 1차 발효 58분 + 브러싱·신선 밤). 바꾼 것: <strong>식힌 뒤 루즈 백 전 개방 시간</strong> — A 0분(바로 백) / B 30분.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>9차는 식힌 뒤 약 40분 개방이었습니다. 10차는 그 40분을 기준으로 0분·30분 두 점만 찍었습니다. 발효·굽기·브러싱은 손대지 않았습니다.</p><p>반죽 종료 24°C, 굽기 200/190°C 32분, 실내 19°C·습도 36%. 실험일 2026-01-26, 발행 2026-06-29.</p><p>식힘은 둘 다 랙 위 동일 위치. 타이머는 주방 타이머로 통일했습니다. B만 30분 알람을 켜 두고, A는 식힘 확인 직후 바로 백에 넣었습니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>습도 40% 이상인 날 9차 발효 58분 재현 (개방은 0~30분으로 고정)</li><li>바로 백의 소폭 눅눅함 — 백 입구 헐거움 정도만 미세 조정 후보</li><li>신선 밤 크기 선별 루틴 (겨울 밖 변수)</li></ul><p>10차로 겨울 겉 건조의 1차 대응은 '개방을 줄이기'로 잡았습니다. 습도가 올라간 날에도 같은 0분이 최적인지는 따로 확인이 필요합니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>실전 정리 고정값의 보관 줄에 <strong>겨울: 식힌 뒤 개방 0~30분</strong> 메모를 반영할 예정입니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 발효를 다시 건드리지 않았나",
      content: `<p>9차에서 이미 1차 발효 58분을 맞춰 두었습니다. 10차에서 발효와 보관을 동시에 바꾸면, 겉 건조가 줄어도 원인이 섞입니다. 그래서 <strong>보관 전 개방만</strong> 열었습니다.</p><p><a href="bread-rd-night-bread-v4.html">4차</a>가 여름 보관을 열었다면, 10차는 그 위에 겨울 조건을 얹은 비교입니다. 루즈 백 자체는 유지하고, '백에 넣기 전 몇 분을 공기에 둘지'만 봤습니다.</p><p>같은 날 두 팬을 쓴 이유는 A/B를 다른 날로 나누면 습도·난방 사이클이 어긋날 수 있어서입니다. 겨울 실험에서는 하루 차이도 환경 메모가 달라집니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>겨울에 식힌 뒤 바로 백을 쓰시는지, 일부러 열어 두시는지 <a href="../contact/">문의</a>로 알려 주세요. 제 결과는 19°C·습도 36%·루즈 백 기준입니다.</p><p>여름에 바로 백이 눅눅했다면, 겨울에는 오히려 개방을 줄이는 쪽이 맞을 수 있습니다. 계절마다 최적 개방 분이 같다고 가정하지 마세요.</p><p>처음이면 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>와 <a href="bread-rd-night-bread-v9.html">9차</a>를 먼저 보시고, 10차는 보관 줄만 보완하는 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2026-01-26, 난방 ON, 습도 36%, 1차 발효 58분, A 0분 백 / B 30분 백. 다음 날 겉·속 한 줄 + 사진.</p><p>겨울 메모 칸에 '개방 분'을 새로 적었습니다. 9차까지는 발효 분이 메인이었고, 10차부터는 보관 전 개방이 같은 줄에 올라갑니다.</p><p>A·B를 같은 날 비교할 때는 팬 위치·식힘 위치까지 적어 두세요. 보관만 바꿨다고 말해도 오븐 자리가 다르면 논쟁이 생깁니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>10차는 <strong>9차 겨울 고정값 위에서 보관 전 개방만</strong> 줄인 날이었습니다. 바로 루즈 백이 겉 건조를 가장 줄였고, 30분은 그 사이, 9차의 40분 개방 메모보다 덜 건조한 쪽이 유리했습니다.</p><p>속 촉촉함은 유지됐고, 바로 백의 소폭 눅눅함은 트레이드오프로 남았습니다. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a> 보관 줄에 겨울 개방 0~30분 메모를 반영합니다.</p><p>다음 후보는 습도 40% 이상 날의 58분 재현과, 바로 백 눅눅함의 미세 조정입니다. 일지 형식은 그대로 둡니다.</p>`
    }
  ],
  summary:
    "9차 조건 유지, 식힌 뒤 루즈 백 전 개방만 0분 vs 30분 비교. 바로 백이 겉 건조를 가장 줄였고 30분은 중간. 속 촉촉함 유지, 바로 백 소폭 눅눅함은 트레이드오프.",
  commonMistakes: [
    "발효와 보관을 같은 날 동시에 바꿔 원인 구분 못 하기",
    "당일 윤기만 보고 보관 효과를 판단하기",
    "여름 개방 시간을 겨울에 그대로 쓰기",
    "9차 40분 개방 메모를 고정값으로 오해하기"
  ],
  checklist: [
    "9차 고정값·58분 발효 재확인",
    "개방 분 0 / 30만 바꾸고 기록",
    "다음 날 겉·속 각각 메모",
    "습도·난방 ON 칸 채우기"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v9",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v4",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "10차에서 발효 시간도 바꿨나요?",
      a: "아닙니다. 9차와 같이 1차 발효 58분이고, 식힌 뒤 백 전 개방 시간만 비교했습니다."
    },
    {
      q: "겨울에는 무조건 바로 백이 맞나요?",
      a: "제 환경(19°C·습도 36%) 기준입니다. 바로 백은 겉 건조는 줄이지만 눅눅함이 소폭 늘 수 있어, 30분도 중간값으로 남겼습니다."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v10);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  const i = posts.findIndex((p) => p.slug === slug);
  posts[i] = v10;
  console.log("✓ replaced existing v10");
} else {
  posts.push(v10);
  console.log("✓ appended v10");
}

// series guide
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~10차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·10차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  series.updatedAt = "2026-06-29";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v10")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v9.html">9차</a> — 겨울 재현</li></ol>`,
        `<li><a href="bread-rd-night-bread-v9.html">9차</a> — 겨울 재현·발효 58분</li><li><a href="bread-rd-night-bread-v10.html">10차</a> — 겨울 보관, 개방 0분 vs 30분</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /이후에는 밤 선별·보관 비교 등이 후보로 남아 있으며, 일지 형식은 그대로 유지합니다\./,
          `<a href="bread-rd-night-bread-v10.html">10차 겨울 보관</a>까지 발행했습니다. 이후 후보: 습도 40% 이상 날 9차 재현, 밤 선별 루틴. 일지 형식은 그대로 유지합니다.`
        )
        .replace(
          /<a href="bread-rd-night-bread-v9.html">9차 겨울 재현<\/a>과 <a href="bread-rd-night-bread-practical-guide.html">실전 정리<\/a>를 발행했습니다\. 이후에는/,
          `<a href="bread-rd-night-bread-v9.html">9차 겨울 재현</a>·<a href="bread-rd-night-bread-v10.html">10차 보관</a>과 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 발행했습니다. 이후에는`
        );
    }
  }
  if (!series.relatedSlugs.includes(slug)) {
    series.relatedSlugs = [...series.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v9"), "bread-rd-night-bread-v9", slug].slice(0, 4);
  }
  console.log("✓ series guide");
}

// practical guide
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-06-29";
  for (const s of guide.sections) {
    if (s.id === "fixed-draft" && !s.content.includes("10차")) {
      s.content = s.content.replace(
        /<li><strong>보관<\/strong>: 완전 식힌 뒤 루즈 백, 실온 12시간 내외<\/li>/,
        `<li><strong>보관</strong>: 완전 식힌 뒤 루즈 백, 실온 12시간 내외. <strong>겨울</strong>에는 식힌 뒤 개방 0~30분(<a href="bread-rd-night-bread-v10.html">10차</a>) — 40분 이상은 겉 건조가 커질 수 있음</li>`
      );
    }
    if (s.id === "when-read-logs" && !s.content.includes("v10")) {
      s.content = s.content.replace(
        /<li>식은 뒤 건조할 때 → <a href="bread-rd-night-bread-v3.html">3차<\/a>, <a href="bread-rd-night-bread-v4.html">4차<\/a><\/li>/,
        `<li>식은 뒤 건조할 때 → <a href="bread-rd-night-bread-v3.html">3차</a>, <a href="bread-rd-night-bread-v4.html">4차</a>, 겨울이면 <a href="bread-rd-night-bread-v10.html">10차</a></li>`
      );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /10차에서 겉 건조가 줄면 그 결과도 같이 반영하겠습니다\./,
        `<a href="bread-rd-night-bread-v10.html">10차</a>에서 개방 0~30분이 겉 건조를 줄이는 방향을 확인했고, 고정값 보관 줄에 반영했습니다.`
      );
    }
    if (s.id === "practice-notes" && !s.content.includes("v10")) {
      s.content = s.content.replace(
        /발행 2026-06-23\. 실험 근거 2025-06~11 <a href="bread-rd-night-bread-v1.html">1~8차<\/a>\./,
        `발행 2026-06-23, 수정 2026-06-29(10차 보관). 실험 근거 2025-06~11 1~8차 + 2026-01 <a href="bread-rd-night-bread-v9.html">9</a>·<a href="bread-rd-night-bread-v10.html">10차</a>.`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [...guide.relatedSlugs, slug].slice(0, 5);
  }
  console.log("✓ practical guide");
}

// v9 next → link to published v10
const v9 = posts.find((p) => p.slug === "bread-rd-night-bread-v9");
if (v9) {
  for (const s of v9.sections) {
    if (s.id === "next") {
      s.content = s.content.replace(
        /<li>10차 후보: 겨울 한정 <strong>보관 전 30분 개방<\/strong> vs 바로 루즈 백<\/li>/,
        `<li><a href="bread-rd-night-bread-v10.html">10차</a> 발행: 겨울 한정 <strong>보관 전 30분 개방</strong> vs 바로 루즈 백</li>`
      );
    }
  }
  if (!v9.relatedSlugs.includes(slug)) {
    v9.relatedSlugs = [slug, ...v9.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v9 links");
}

fs.writeFileSync(
  postsPath,
  `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`,
  "utf8"
);
console.log("✓ wrote data/posts.js");
