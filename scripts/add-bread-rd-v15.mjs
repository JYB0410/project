/**
 * 밤식빵 R&D 15차 — 큰 밤 배치·간격 미세 조정
 * node scripts/add-bread-rd-v15.mjs
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

const slug = "bread-rd-night-bread-v15";

const v15 = {
  slug,
  title: "밤식빵 R&D 15차 — 큰 밤을 간격 넓혀 올린 날",
  subtitle: "14차 중간 1순위 유지, 큰 밤만 배치·간격 변수",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-03",
  featured: false,
  status: "published",
  excerpt:
    "2025년 11월 2일, 14차에서 들뜸 리스크가 있던 큰 밤만 골라 간격을 넓히고 가볍게 눌러 올렸습니다. 밀착은 나아졌고 한 입 덩어리감은 유지됐으나, 본굽 1순위는 여전히 중간 크기입니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v14.html">14차</a>에서 신선 밤 <strong>중간 크기</strong>를 1순위로 잡았습니다. 큰 밤은 향·덩어리감은 좋지만 가장자리 들뜸·갈라짐이 남았습니다. '큰 밤은 버리나?'가 아니라, <strong>쓸 때 어떻게 올리면 덜 실패하나</strong>를 볼 차례였습니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>15차 목표는 반죽·시럽·발효·브러싱·보관을 고정한 채, <strong>큰 밤의 배치 간격과 가벼운 압착</strong>만 바꾸는 것입니다. 중간 크기 팬은 대조군으로 한 판 더 구워 나란히 비교했습니다.</p><p>2025년 11월 2일 실험입니다. 가을 끝 신선 밤, 실내 19°C 전후. 큰 밤(장경 약 3cm 이상)만 손질해 팬 A에 <strong>간격 넓게 + 올리자마자 손끝으로 한 번 가볍게 누름</strong>, 팬 B(중간 크기)는 14차와 동일하게 올렸습니다.</p><p>14차에서 '한 팬에 크기 섞지 않기'를 지켰으므로, 15차도 큰 밤 단일 등급만 사용했습니다. 발효 숫자는 겨울 58·56분을 쓰지 않고 당일 눌림 기준으로 맞췄습니다 — 재료·배치 변수만 열려야 합니다.</p><p>사진용·손님용으로 큰 밤을 쓰고 싶을 때 참고할 메모를 남기려 한 날입니다. 본굽 기본은 중간이 맞다는 전제는 유지합니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>큰 밤 + 넓은 간격·가벼운 압착</strong> — 14차 큰 밤 팬보다 들뜸·떨어지는 조각이 줄음. 다만 가장자리 한두 개는 여전히 약함</li><li><strong>중간 크기 대조</strong> — 14차와 같이 밀착·한 입 균형이 가장 안정</li><li><strong>향·덩어리감</strong> — 큰 밤 팬이 한 입에서 더 분명. 가족은 '특별할 때 이 쪽'이라고 함</li></ol><p>제 기준으로 <strong>15차는 부분 성공</strong> — 큰 밤을 <strong>시험·특별 배치</strong>로 쓸 수 있는 조건을 찾았고, 본굽 1순위는 여전히 중간입니다.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 브러싱 윤기는 두 팬 비슷했습니다. 차이는 토핑 클로즈업에서 큰 밤 가장자리 결합, 다음 날 자를 때 떨어지는지 여부에서 보였습니다.</p><p>14차 큰 밤 팬 메모의 '칼질 때 밤이 떨어짐'이 15차 A에서는 한 조각으로 줄었습니다. 완전 해결은 아니지만, 간격·압착이 무의미하지는 않았습니다.</p><p>너무 세게 누르면 밤이 으깨지거나 반죽에 파묻혀 형태가 망가졌습니다. '한 번 가볍게'만 허용한 이유입니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>간격 ↑ → 들뜸·간섭 ↓</strong> — 부분 확인. 큰 밤끼리 붙어 있으면 팽창 시 가장자리가 뜨기 쉬웠음.</p><p><strong>가벼운 압착 → 초기 밀착</strong> — 부분 확인. 시럽만 바르고 올려 두면 접촉면이 부족할 수 있음.</p><p><strong>중간 크기 1순위 유지</strong> — 재확인. 배치를 고쳐도 중간 팬이 실패 목록이 가장 짧음.</p><p>7차 신선 밤의 향, 14차 선별, 15차 큰 밤 배치가 한 줄로 이어집니다. 재료 챕터는 '무엇을 고르고, 고른 것을 어떻게 올리는가'입니다.</p><p>압착을 세게 하면 형태가 깨지므로, 변수는 '세게'가 아니라 '올리는 즉시 한 번'으로 제한했습니다. 2차 발효 직전 압착 실험은 아직 열지 않았습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: 14차 중간 크기 루틴 + 7·8차 고정값. 팬 A만 변경: <strong>큰 밤 + 간격 넓게(조각 사이 여유) + 올린 직후 손끝 1회 가볍게 누름</strong>. 팬 B: 중간 크기 14차와 동일.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>반죽·굽기 200/190°C 32분·브러싱·루즈 백 동일. 실험일 2025-11-02, 발행 2026-08-03.</p><p>간격은 '겹치지 않고, 손가락 한 칸 정도 비움' 정도로 메모했습니다. 자 단위까지는 재지 않았습니다 — 현장 재현을 위해 손 감각 기준을 남겼습니다.</p><p>한 팬에 큰·중간을 섞지 않았습니다. 섞으면 14차 교훈이 무너집니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>실전 정리에 '중간 1순위 / 큰 밤은 간격·가벼운 압착' 한 줄 반영</li><li>바로 백 입구 헐거움(10차 잔여) 후보</li><li>2차 발효 직전 토핑 압착은 아직 보류</li></ul><p>15차로 큰 밤을 버릴 필요는 없다는 쪽입니다. 다만 매일 본굽 기본은 중간이 맞습니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>재료 챕터는 여기서 한 사이클을 닫고, 보관 미세나 다음 시즌 밤으로 넘어갈 수 있습니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 중간을 버린 실험이 아닌가",
      content: `<p>15차는 중간 크기를 폐기하려는 실험이 아닙니다. 14차 1순위를 고정한 채, <strong>예외 처리(큰 밤)</strong>만 본 날입니다.</p><p>실험은 2025년 11월, 발행은 2026년 8월입니다. 가을 밤 시즌에 다시 읽을 일지입니다.</p><p>사진만 보면 큰 밤 팬이 더 화려합니다. 그래서 가족 시식·다음 날 칼질 메모를 같이 남기지 않으면, 판단이 사진 쪽으로 기울기 쉽습니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>큰 밤을 쓸 때 간격을 어떻게 두시는지 <a href="../contact/">문의</a>로 알려 주세요. 제 15차는 '손가락 한 칸 + 가벼운 1회 압착'이었습니다.</p><p>본굽 기본은 <a href="bread-rd-night-bread-v14.html">14차</a> 중간 크기를 권합니다. 큰 밤은 손님상·사진용 예외로 두면 실패가 줄었습니다.</p><p>처음이면 <a href="bread-rd-night-bread-v7.html">7차</a>·14차·실전 정리를 먼저 보시고, 15차는 큰 밤 예외 처리 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2025-11-02, 큰 밤만 A / 중간 B, A는 간격 넓게+가벼운 압착 1회, 8차 브러싱, 루즈 백. 다음 날 들뜸·칼질·한 입.</p><p>루틴 한 줄: 본굽=중간 / 큰 밤=간격+살살 누름 / 세게 누르지 않기.</p><p>큰 밤 개수를 줄이면 간격 확보가 쉬웠습니다. 같은 팬에 가득 채우면 14차 실패가 다시 나왔습니다.</p><p>손끝이 아닌 주걱으로 누르면 힘이 세져 으깨지기 쉬워, 당일은 손끝만 썼습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>15차는 <strong>큰 밤의 배치 간격·가벼운 압착</strong>만 본 날이었습니다. 들뜸은 14차 큰 밤 팬보다 줄었고, 한 입 덩어리감은 유지됐습니다. 본굽 1순위는 여전히 <strong>중간 크기</strong>입니다.</p><p>재료 챕터: 7차 신선 밤 → 14차 선별 → 15차 큰 밤 예외 처리. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 한 줄 반영합니다.</p><p>다음 후보는 백 입구 헐거움 등 보관 미세입니다.</p>`
    }
  ],
  summary:
    "14차 중간 1순위 유지. 큰 밤만 간격 넓히고 올린 직후 가볍게 1회 눌러 들뜸을 줄임. 특별 배치용으로 가능, 본굽 기본은 중간 크기.",
  commonMistakes: [
    "큰 밤을 가득 채워 간격을 없애기",
    "세게 눌러 밤을 으깨기",
    "큰 밤 성공을 보고 중간 1순위를 폐기하기",
    "크기 선별 없이 배치만 만지기"
  ],
  checklist: [
    "중간 크기 대조 팬 준비",
    "큰 밤은 간격 확보",
    "올린 직후 손끝 1회만",
    "다음 날 들뜸·칼질 확인"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v14",
    "bread-rd-night-bread-v7",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "15차 이후 본굽도 큰 밤으로 바꾸나요?",
      a: "아닙니다. 본굽 1순위는 14차 중간 크기입니다. 큰 밤은 간격·가벼운 압착을 쓸 때 예외 배치입니다."
    },
    {
      q: "압착을 얼마나 세게 하나요?",
      a: "손끝으로 한 번 가볍게만 했습니다. 세게 누르면 형태가 깨지거나 반죽에 파묻혔습니다."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v15);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  posts[posts.findIndex((p) => p.slug === slug)] = v15;
} else {
  posts.push(v15);
}

const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~15차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·15차까지 읽는 순서를 안내합니다.";
  series.updatedAt = "2026-08-03";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v15")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v14.html">14차</a> — 신선 밤 크기 선별</li></ol>`,
        `<li><a href="bread-rd-night-bread-v14.html">14차</a> — 신선 밤 크기 선별</li><li><a href="bread-rd-night-bread-v15.html">15차</a> — 큰 밤 간격·가벼운 압착</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        /이후 후보: 큰 밤 배치 미세 조정, 백 입구 헐거움\./,
        `<a href="bread-rd-night-bread-v15.html">15차 큰 밤 배치</a>까지 발행. 이후 후보: 백 입구 헐거움.`
      );
    }
  }
  series.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v15",
    "baker-cert-to-bread-rd"
  ];
  console.log("✓ series");
}

const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-08-03";
  for (const s of guide.sections) {
    if (s.id === "takeaway-seven" && !s.content.includes("v15")) {
      s.content = s.content.replace(
        /(한 팬에 섞지 않기\(<a href="bread-rd-night-bread-v14.html">14차<\/a>\))/,
        `$1. 큰 밤은 간격 넓히고 가볍게 1회만 누르기(<a href="bread-rd-night-bread-v15.html">15차</a>)`
      );
    }
    if (s.id === "fixed-draft" && !s.content.includes("v15")) {
      s.content = s.content.replace(
        /(한 팬에 크기 섞지 않기\(<a href="bread-rd-night-bread-v14.html">14차<\/a>\))<\/li>/,
        `$1. 큰 밤 예외 시 간격·가벼운 압착(<a href="bread-rd-night-bread-v15.html">15차</a>)</li>`
      );
    }
    if (s.id === "when-read-logs" && !s.content.includes("v15")) {
      s.content = s.content.replace(
        /크기 선별은 <a href="bread-rd-night-bread-v14.html">14차<\/a><\/li>/,
        `크기 선별은 <a href="bread-rd-night-bread-v14.html">14차</a>, 큰 밤 배치는 <a href="bread-rd-night-bread-v15.html">15차</a></li>`
      );
    }
    if (s.id === "editor-note" && !s.content.includes("v15")) {
      s.content +=
        `<p><a href="bread-rd-night-bread-v15.html">15차</a>에서 큰 밤 간격·가벼운 압착 예외 처리를 반영했습니다. 본굽 1순위는 중간 크기입니다.</p>`;
    }
    if (s.id === "practice-notes" && !s.content.includes("15차")) {
      s.content = s.content.replace(
        /수정 2026-07-31\(14차 밤 선별\)/,
        `수정 2026-08-03(15차 큰 밤 배치)`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [
      ...guide.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v14"),
      "bread-rd-night-bread-v14",
      slug
    ].slice(0, 5);
  }
  console.log("✓ guide");
}

const v14 = posts.find((p) => p.slug === "bread-rd-night-bread-v14");
if (v14) {
  for (const s of v14.sections) {
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /<li>큰 밤 전용 — 압착·배치 간격만 미세 조정 후보<\/li>/,
          `<li><a href="bread-rd-night-bread-v15.html">15차</a> 발행: 큰 밤 간격·가벼운 압착</li>`
        )
        .replace(
          /다음 후보는 큰 밤 배치 미세 조정, 백 입구 헐거움입니다\./,
          `큰 밤 배치는 <a href="bread-rd-night-bread-v15.html">15차</a>에서 이었고, 백 입구는 이후로 남겼습니다.`
        );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /다음 후보는 큰 밤 배치 미세 조정, 백 입구 헐거움입니다\./,
        `큰 밤 배치는 <a href="bread-rd-night-bread-v15.html">15차</a>에서 이었고, 백 입구 헐거움은 이후로 남겼습니다.`
      );
    }
  }
  if (!v14.relatedSlugs.includes(slug)) {
    v14.relatedSlugs = [slug, ...v14.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v14");
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log("✓ wrote posts.js");
