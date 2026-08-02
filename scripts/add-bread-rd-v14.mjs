/**
 * 밤식빵 R&D 14차 — 신선 밤 크기 선별
 * node scripts/add-bread-rd-v14.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

function fig(slug, id, alt) {
  return `<figure class="article-figure"><img src="../assets/images/photos/${slug}/${id}.jpg" alt="${alt}" loading="lazy" class="article-img" width="1200" height="675"><figcaption>${alt}</figcaption></figure>`;
}

const slug = "bread-rd-night-bread-v14";

const v14 = {
  slug,
  title: "밤식빵 R&D 14차 — 신선 밤 크기를 골라 올린 날",
  subtitle: "7차 신선 밤 고정, 큰·중간·작은 밤만 비교",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-07-31",
  updatedAt: "2026-07-31",
  featured: false,
  status: "published",
  excerpt:
    "2025년 10월 29일, 7차와 같은 신선 밤·8차 브러싱 조건에서 밤 크기만 나눠 올렸습니다. 중간 크기가 밀착·식감 균형에 가장 가깝고, 큰 밤은 덩어리감이 세지만 가장자리가 들뜨기 쉬웠습니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v7.html">7차</a>에서 통조림 대신 신선 밤을 쓰며 향은 나아졌지만, <strong>크기 편차로 덩어리감이 들쭉날쭉</strong>했습니다. 9~13차는 겨울 발효·보관을 다뤘고, 재료 쪽 남은 과제는 그대로였습니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>14차 목표는 반죽·시럽·발효·브러싱·보관을 건드리지 않고, <strong>신선 밤 크기 선별만</strong> 보는 것입니다. '아무 밤이나 올리면 결과가 흔들린다'는 말을 숫자·사진으로 남기려 했습니다.</p><p>2025년 10월 29일 실험입니다. 가을 신선 밤 시즌, 실내 20°C 전후. 7차와 같이 직접 삶아 껍질을 벗긴 밤을 쓰고, 크기를 <strong>큰(장경 약 3cm 이상) / 중간(약 2~2.5cm) / 작은(약 1.5cm 이하)</strong> 세 무리로 나눴습니다. 같은 반죽을 세 팬으로 나눠 크기만 다르게 올렸습니다.</p><p>굽기·브러싱·루즈 백 보관은 8차 이후 고정값을 따랐습니다. 발효는 당일 가을 환경에서 손가락 눌림 기준으로 맞췄고, 겨울 58·56분 숫자는 쓰지 않았습니다 — 재료 변수만 열려야 비교가 됩니다.</p><p>겨울 시리즈(9~13)를 닫은 뒤 재료 챕터를 연 이유는, 발효·보관을 고정해 둔 상태에서야 밤 크기 효과가 보이기 때문입니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>큰 밤</strong> — 한 입 덩어리감·향은 가장 강함. 다만 가장자리가 빵에서 들뜨거나, 굽기 중 표면이 갈라지는 조각이 있음</li><li><strong>중간 밤</strong> — 밀착·식감·향 균형이 가장 무난. 가족 반응도 '제일 익숙하다'</li><li><strong>작은 밤</strong> — 밀착은 잘 되지만 한 입에 밤 느낌이 약함. '식빵에 점만 찍힌' 인상에 가까움</li></ol><p>제 기준으로 <strong>14차는 부분 성공</strong> — 선별 루틴의 1순위는 <strong>중간 크기</strong>로 잡았습니다. 큰 밤은 '특별 배치'용, 작은 밤은 모아서 한쪽 모서리만 쓸 때만.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 윤기·브러싱 효과는 세 팬 모두 비슷했습니다. 차이는 토핑 클로즈업과 다음 날 한 입 평가에서 분명했습니다.</p><p>큰 밤 팬은 사진상으로는 가장 '밤식빵다워' 보였지만, 식탁에서 자를 때 밤이 떨어지는 조각이 두 개 있었습니다. 중간 밤은 칼이 빵과 밤을 같이 지나갔습니다.</p><p>작은 밤은 실패 목록에 '향 부족'보다 '존재감 부족'으로 적었습니다. 망한 것은 아니지만, 기억 속 밤식빵의 한 입과는 거리가 있었습니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>크기 ↑ → 덩어리감·향 ↑, 밀착 리스크 ↑</strong> — 부분 확인. 같은 반죽·같은 시럽에서 크기만 달랐음.</p><p><strong>중간 크기 균형</strong> — 부분 확인. 7차의 '들쭉날쭉'은 크기를 섞어 올린 영향이 컸을 가능성.</p><p><strong>작은 밤 밀착</strong> — 추정 재현. 표면 접촉 면적 대비 질량이 작아 결합이 쉬운 쪽.</p><p>7차에서 신선 밤의 향 이득을 확인했다면, 14차는 그 이득을 <strong>안정적으로 가져가는 선별</strong>을 본 날입니다. 통조림으로 돌아가진 않았습니다.</p><p>밤을 삶는 시간도 크기에 따라 달라질 수 있어, 중간 무리만 모으면 손질 일정도 맞추기 쉬웠습니다. 큰 밤은 속까지 익히는 데 분이 더 필요했습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: 7차 신선 밤 손질 + 6·8차 시럽·브러싱 + 4차 루즈 백. 바꾼 것: <strong>토핑 밤의 크기 등급</strong> — 큰 / 중간 / 작은 단일 등급씩 올린 세 팬.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>반죽·발효·굽기(200/190°C 32분)는 동일. 실험일 2025-10-29, 발행 2026-07-31.</p><p>크기는 자를 자로 장경만 대략 쟀습니다. 완벽한 구가 아니라 타원형 밤이 많아, '장경 기준 구간'으로만 나눴습니다. 저울 그램보다 눈·자 구간이 현장에서는 빨랐습니다.</p><p>한 팬에 크기를 섞지 않은 것이 핵심입니다. 섞으면 7차처럼 다시 '들쭉날쭉'으로 돌아갑니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>중간 크기만 쓰는 선별 루틴을 실전 정리 재료 줄에 반영</li><li>큰 밤 전용 — 압착·배치 간격만 미세 조정 후보</li><li>바로 백 입구 헐거움(10차 잔여) 후보</li></ul><p>14차로 '아무 밤이나'는 접었습니다. 시장·마트에서 고를 때도 중간 구간을 먼저 담습니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>겨울 고정값(9~13)과 재료 선별(14)을 같이 쓰면, 계절과 토핑이 덜 싸웁니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 겨울 다음에 재료를 열었나",
      content: `<p>9~13차는 발효 분·습도·보관이었습니다. 그 위에서 밤 크기까지 바꾸면 원인이 섞입니다. 그래서 겨울 보정을 메모에 고정한 뒤, 재료만 열었습니다.</p><p>실험은 2025년 가을, 발행은 2026년 7월입니다. 실험일·발행일을 구분해 두었으니, 가을 밤 시즌에 이 일지를 다시 읽으면 됩니다.</p><p>7차만 읽고 '신선 밤이면 된다'고 끝내지 않기를 바랍니다. 14차는 그 다음 문장입니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>신선 밤 크기를 어떻게 고르시는지 <a href="../contact/">문의</a>로 알려 주세요. 제 14차는 장경 2~2.5cm 전후 중간이 1순위였습니다.</p><p>큰 밤만 고집하면 사진은 화려해도 밀착이 흔들릴 수 있습니다. 작은 밤만 쓰면 한 입 존재감이 약합니다.</p><p>처음이면 <a href="bread-rd-night-bread-v7.html">7차</a>와 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 먼저 보시고, 14차는 재료 선별 보강 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2025-10-29, 신선 밤 삶기, 크기 3등급 분리, 팬별 단일 등급, 8차 브러싱, 루즈 백. 다음 날 한 입·밀착 한 줄.</p><p>선별 루틴 초안: (1) 삶기 전 장경으로 세 무더기 (2) 중간만 본굽 토핑 (3) 큰 것은 간격 넓게 시험 배치 (4) 작은 것은 가장자리·연습용.</p><p>자를 가방에 넣어 두었습니다. 시장에서 눈대중만 하면 다음 배치에서 다시 섞입니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>14차는 <strong>신선 밤 크기 선별</strong>을 변수로 연 날이었습니다. 중간 크기가 밀착·식감·향 균형 1순위이고, 큰 밤은 들뜸 리스크, 작은 밤은 존재감 부족이었습니다.</p><p>7차의 향 이득을 유지하면서 들쭉날쭉을 줄이려면, 크기를 섞지 말고 중간을 고르는 쪽이 맞았습니다. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a> 재료 줄에 반영합니다.</p><p>다음 후보는 큰 밤 배치 미세 조정, 백 입구 헐거움입니다.</p>`
    }
  ],
  summary:
    "7차 신선 밤 조건에서 크기만 큰·중간·작은으로 분리. 중간(장경 약 2~2.5cm)이 밀착·식감 균형 1순위. 큰 밤은 덩어리감↑·들뜸 리스크, 작은 밤은 존재감 부족.",
  commonMistakes: [
    "크기를 한 팬에 섞어 올리고 7차처럼 들쭉날쭉을 반복하기",
    "사진용 큰 밤만 고집해 밀착을 놓치기",
    "작은 밤만 써서 '밤식빵' 한 입 존재감을 잃기",
    "발효·보관과 재료 크기를 같은 날 동시에 바꾸기"
  ],
  checklist: [
    "신선 밤 삶기·손질",
    "장경 기준 큰/중간/작은 분리",
    "본굽은 중간 단일 등급",
    "다음 날 한 입·밀착 기록"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v7",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v13",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "14차에서 반죽이나 발효도 바꿨나요?",
      a: "아닙니다. 7·8차 쪽 고정값 위에서 토핑 밤 크기 등급만 나눴습니다."
    },
    {
      q: "큰 밤은 쓰면 안 되나요?",
      a: "써도 됩니다. 다만 들뜸·갈라짐 리스크가 있어 간격을 넓히거나 시험 배치로 두는 편이 안전했습니다. 1순위는 중간 크기입니다."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v14);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  posts[posts.findIndex((p) => p.slug === slug)] = v14;
} else {
  posts.push(v14);
}
console.log("✓ v14 in posts array");

const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~14차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·14차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  series.updatedAt = "2026-07-31";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v14")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v13.html">13차</a> — 습도 42%·발효 55분 확인</li></ol>`,
        `<li><a href="bread-rd-night-bread-v13.html">13차</a> — 습도 42%·발효 55분 확인</li><li><a href="bread-rd-night-bread-v14.html">14차</a> — 신선 밤 크기 선별</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        /이후 후보: 밤 선별 루틴, 백 입구 미세 조정\./,
        `<a href="bread-rd-night-bread-v14.html">14차 밤 선별</a>까지 발행. 이후 후보: 큰 밤 배치 미세 조정, 백 입구 헐거움.`
      );
    }
  }
  series.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v14",
    "baker-cert-to-bread-rd"
  ];
  console.log("✓ series guide");
}

const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-07-31";
  for (const s of guide.sections) {
    if (s.id === "takeaway-seven" && !s.content.includes("v14")) {
      s.content = s.content.replace(
        /(<li><strong>재료<\/strong>[^<]*<a href="bread-rd-night-bread-v7.html">7차<\/a>[^<]*)(<\/li>)/,
        `$1. 크기는 중간(장경 약 2~2.5cm) 우선·한 팬에 섞지 않기(<a href="bread-rd-night-bread-v14.html">14차</a>)$2`
      );
    }
    if (s.id === "fixed-draft" && !s.content.includes("v14")) {
      s.content = s.content.replace(
        /<li><strong>토핑<\/strong>: 1차 발효 후, 성형 직전\. 통조림 또는 손질한 신선 밤<\/li>/,
        `<li><strong>토핑</strong>: 1차 발효 후, 성형 직전. 통조림 또는 손질한 신선 밤 — <strong>중간 크기 우선</strong>, 한 팬에 크기 섞지 않기(<a href="bread-rd-night-bread-v14.html">14차</a>)</li>`
      );
    }
    if (s.id === "when-read-logs" && !s.content.includes("v14")) {
      s.content = s.content.replace(
        /<li>재료를 바꿀 때 → <a href="bread-rd-night-bread-v7.html">7차<\/a><\/li>/,
        `<li>재료를 바꿀 때 → <a href="bread-rd-night-bread-v7.html">7차</a>, 크기 선별은 <a href="bread-rd-night-bread-v14.html">14차</a></li>`
      );
    }
    if (s.id === "editor-note" && !s.content.includes("v14")) {
      s.content +=
        `<p><a href="bread-rd-night-bread-v14.html">14차</a>에서 신선 밤 중간 크기 우선 선별을 반영했습니다.</p>`;
    }
    if (s.id === "practice-notes" && !s.content.includes("14차")) {
      s.content = s.content.replace(
        /수정 2026-07-09\(13차 55분\)|수정 2026-07-28/,
        `수정 2026-07-31(14차 밤 선별)`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [...guide.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v13"), "bread-rd-night-bread-v13", slug].slice(0, 5);
  }
  console.log("✓ practical guide");
}

const v13 = posts.find((p) => p.slug === "bread-rd-night-bread-v13");
if (v13) {
  for (const s of v13.sections) {
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /<li>신선 밤 크기 선별 루틴<\/li>/,
          `<li><a href="bread-rd-night-bread-v14.html">14차</a> 발행: 신선 밤 크기 선별</li>`
        )
        .replace(
          /다음 변수는 재료·보관 미세 쪽으로 옮깁니다\./,
          `재료 선별은 <a href="bread-rd-night-bread-v14.html">14차</a>에서 이었고, 보관 미세는 이후로 남겼습니다.`
        );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /다음 후보는 밤 선별·백 입구 미세 조정입니다\./,
        `밤 선별은 <a href="bread-rd-night-bread-v14.html">14차</a>에서 이었고, 백 입구 미세 조정은 이후로 남겼습니다.`
      );
    }
  }
  if (!v13.relatedSlugs.includes(slug)) {
    v13.relatedSlugs = [slug, ...v13.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v13 links");
}

const v7 = posts.find((p) => p.slug === "bread-rd-night-bread-v7");
if (v7 && !v7.relatedSlugs.includes(slug)) {
  v7.relatedSlugs = [slug, ...v7.relatedSlugs].slice(0, 4);
  console.log("✓ v7 related");
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log("✓ wrote data/posts.js");
