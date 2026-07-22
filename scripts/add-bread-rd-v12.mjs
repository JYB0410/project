/**
 * 밤식빵 R&D 12차 추가 + 연관 글 링크 갱신
 * node scripts/add-bread-rd-v12.mjs
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

const slug = "bread-rd-night-bread-v12";

const v12 = {
  slug,
  title: "밤식빵 R&D 12차 — 습도 42%에서 발효 56분으로 맞춘 날",
  subtitle: "11차 후보 확인: 타이머 56분, 손가락 눌림 우선",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-07-05",
  updatedAt: "2026-07-05",
  featured: false,
  status: "published",
  excerpt:
    "2026년 2월 16일, 11차와 비슷한 습도 42% 날에 1차 발효만 56분으로 줄였습니다. 9차(35%·58분)와 비슷한 눌림이 나왔고, 다음 날 겉·속은 10·11차와 유사했습니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v11.html">11차</a>에서 습도 42%·1차 발효 58분을 그대로 밀어 보니, 손가락 눌림이 9차(35%·58분)보다 느슨했습니다. 메모에 <strong>55~56분 후보</strong>를 남겼고, 12차는 그 숫자를 단일 배치로 확인하는 날입니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>목표는 레시피·보관·재료를 건드리지 않고, <strong>습도 40%대에서 발효 분만 56분</strong>으로 맞추는 것이었습니다. 11차가 '58분을 맹신하지 말 것'이라면, 12차는 '그럼 몇 분이 눌림에 가깝나'를 한 점 찍는 일지입니다.</p><p>2026년 2월 16일 실험입니다. 실내 19°C, 습도 <strong>42%</strong>(시작) → 41%(종료). 난방 ON. 반죽·시럽·신선 밤·브러싱·바로 루즈 백은 11차와 동일. 바꾼 것은 1차 발효 타이머 <strong>56분</strong>뿐입니다.</p><p>55분과 56분 사이는 소량 시험 없이 본굽 한 번으로 갔습니다. 같은 날 두 분을 넣으면 오븐 문이 열리고 비교가 흐려집니다. 11차 메모의 중간값 56분을 골랐습니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>발효 텐션</strong> — 56분 종료 시 손가락 눌림이 9차 사진과 가장 가깝. 11차 58분보다 팽팽</li><li><strong>다음 날 겉·속</strong> — 10·11차 바로 백과 유사. 겉 건조 심하지 않음, 속 촉촉함 유지</li><li><strong>향·밀착</strong> — 8~11차 수준. 분을 줄였다고 토핑이 뜨거나 향이 죽진 않음</li></ol><p>가족은 '지난번(11차)보다 속이 더 고르다'고 했습니다. 제 기준으로 <strong>12차는 부분 성공</strong> — 습도 42%대 보정 분으로 56분을 1차 확정 후보에 올렸습니다. 55분 단일 확인은 아직 안 했습니다.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 오븐 색은 11차와 비슷했습니다. 차이는 성형 직전 반죽 텐션과, 다음 날 단면을 나란히 둘 때 기공 균일감에서 조금 보였습니다.</p><p>과발효 느낌(상단이 무너지거나 시큼함)은 없었습니다. 11차 58분이 '조금 여유'였다면, 12차 56분은 '9차와 비슷한 지점'에 가깝습니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>습도 42% + 56분 ≈ 습도 35% + 58분 눌림</strong> — 부분 확인. 온도 동일, 습도·분만 다른 두 날(9·12차)을 사진으로 비교.</p><p><strong>11차 58분 여유</strong> — 재확인. 같은 습도대에서 2분을 줄이니 텐션이 되돌아옴.</p><p><strong>보관·브러싱</strong> — 10·11차 유지. 분 보정만으로 겉 건조가 다시 커지진 않음.</p><p>겨울 고정값을 표로 쓰면 이렇게 됩니다. 19°C·습도 35% 전후 → 58분 후보 / 19°C·습도 40% 이상 → 56분 후보(눌림 우선). 둘 다 타이머 복사가 아니라 <strong>환경 메모 + 눌림</strong>이 전제입니다.</p><p>55분을 안 찍은 이유는 12차 목표가 '11차 후보 한 점 확인'이었기 때문입니다. 55분은 다음 후보로 남깁니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: 11차와 동일(9차 조합 + 바로 루즈 백 + 습도 40%대 날). 바꾼 것: 1차 발효 <strong>58분 → 56분</strong>.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>반죽 종료 24°C, 굽기 200/190°C 32분, 브러싱 2분 이내 한 겹. 실험일 2026-02-16, 발행 2026-07-05.</p><p>발효 중 50분·53분·56분에 가볍게 눌림만 확인했습니다. 50분은 아직 부족, 53분은 거의, 56분에서 9차 기준에 가깝다고 판단하고 성형에 들어갔습니다.</p><p>습도계는 시작·종료 두 번. 42%→41%. 11차와 같은 날씨 패턴(눈이 녹은 뒤 습한 날)이었습니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>습도 42%대 <strong>55분</strong> 단일 배치 — 56분과 차이 확인</li><li>신선 밤 크기 선별 루틴</li><li>바로 백 입구 헐거움 미세 조정</li></ul><p>12차로 고습도 보정의 1차 숫자는 잡았습니다. 55분이 더 나을지는 아직 모릅니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>실전 정리 겨울 보정 줄에 '습도 40%+ → 56분 후보'를 반영합니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 55분이 아니라 56분이었나",
      content: `<p>11차 메모는 '55~56분'이었습니다. 가운데를 찍지 않고 56분을 고른 이유는, 58에서 2분만 줄여도 효과가 보이는지 먼저 보고 싶었기 때문입니다. 한 번에 3분을 줄이면 '과보정'인지 구분이 어렵습니다.</p><p>9·10·11·12차는 겨울 시리즈입니다. 9=저습 58분, 10=보관 개방, 11=고습 58분 재현, 12=고습 56분 보정. 네 편이 있어야 표 한 줄이 나옵니다.</p><p>같은 습도라도 날마다 1%p는 흔들립니다. 그래서 분 숫자보다 <strong>50·53·56분 눌림 체크</strong>를 습관으로 남겼습니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>습도 40% 넘는 날 발효 분을 어떻게 줄이셨는지 <a href="../contact/">문의</a>로 알려 주세요. 제 12차는 42%·56분 한 점입니다.</p><p>56분을 복사하지 말고, 온도·습도를 적은 뒤 손가락 눌림으로 맞추세요. 11차 FAQ와 같은 말입니다.</p><p>처음이면 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>와 9~11차를 먼저 보시고, 12차는 고습 보정 확인 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2026-02-16, 난방 ON, 습도 42%→41%, 1차 56분(50·53·56 눌림), 바로 루즈 백. 다음 날 겉·속 한 줄.</p><p>고습 날 메모 양식: 온도 / 습도 시작·끝 / 분 / 눌림 한 줄. 네 칸이면 9·11·12차 비교가 됩니다.</p><p>타이머를 56분에 맞춰 두되, 53분에 한 번 보고 부족하면 1~2분 더하는 식으로 쓰면 재현이 쉽습니다. 저는 56분 고정으로 갔지만, 다음엔 그 중간 체크를 더 짧게 적을 예정입니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>12차는 <strong>습도 42%에서 1차 발효 56분</strong>을 확인한 날이었습니다. 눌림은 9차(35%·58분)에 가깝고, 겉·속은 10·11차와 유사했습니다.</p><p>겨울 보정 초안: 저습(35% 전후) 58분 후보, 고습(40% 이상) 56분 후보 — 둘 다 손가락 눌림 우선. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 반영합니다.</p><p>다음 후보는 55분 확인, 밤 선별, 백 입구 미세 조정입니다.</p>`
    }
  ],
  summary:
    "11차 후보를 실행. 습도 42%·1차 발효 56분. 눌림은 9차(35%·58분)에 가깝고 다음 날 겉·속은 10·11차와 유사. 고습 보정 분 1차 확정 후보.",
  commonMistakes: [
    "11차 58분과 12차 56분을 습도 메모 없이 섞어 쓰기",
    "55·56·58을 한꺼번에 바꿔 원인 구분 못 하기",
    "고습 날에도 여름 55분만 고집하기",
    "중간 눌림 없이 타이머만 보고 성형하기"
  ],
  checklist: [
    "습도 40%+ 확인",
    "1차 발효 56분 + 중간 눌림",
    "9·11차 고정값 유지",
    "바로 루즈 백"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v11",
    "bread-rd-night-bread-v9",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "12차에서 58분은 버렸나요?",
      a: "아닙니다. 저습도(35% 전후) 기준으로 남깁니다. 고습(40%+)에서는 56분 후보를 씁니다."
    },
    {
      q: "55분은 왜 안 했나요?",
      a: "11차 메모의 56분을 먼저 한 점 확인했습니다. 55분은 다음 후보입니다."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v12);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  posts[posts.findIndex((p) => p.slug === slug)] = v12;
  console.log("✓ replaced existing v12");
} else {
  posts.push(v12);
  console.log("✓ appended v12");
}

const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~12차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·12차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  series.updatedAt = "2026-07-05";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v12")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v11.html">11차</a> — 습도 40%+ 날 58분 재현</li></ol>`,
        `<li><a href="bread-rd-night-bread-v11.html">11차</a> — 습도 40%+ 날 58분 재현</li><li><a href="bread-rd-night-bread-v12.html">12차</a> — 습도 42%·발효 56분 보정</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        /이후 후보: 42%대 55~56분 확인, 밤 선별 루틴\./,
        `<a href="bread-rd-night-bread-v12.html">12차 56분 보정</a>까지 발행. 이후 후보: 55분 확인, 밤 선별 루틴.`
      );
    }
  }
  series.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v12",
    "baker-cert-to-bread-rd"
  ];
  console.log("✓ series guide");
}

const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-07-05";
  for (const s of guide.sections) {
    if (s.id === "fixed-draft") {
      s.content = s.content.replace(
        /55~56분 후보/,
        `56분 후보(<a href="bread-rd-night-bread-v12.html">12차</a> 확인, 55분은 미실시)`
      );
      if (!s.content.includes("v12") && s.content.includes("11차")) {
        s.content = s.content.replace(
          /55~56분 후보\.|55~56분 후보/,
          `56분 후보(<a href="bread-rd-night-bread-v12.html">12차</a>)`
        );
      }
    }
    if (s.id === "when-read-logs" && !s.content.includes("v12")) {
      s.content = s.content.replace(
        /겨울·습도 메모 → <a href="bread-rd-night-bread-v9.html">9<\/a>·<a href="bread-rd-night-bread-v11.html">11차<\/a>\./,
        `겨울·습도 메모 → <a href="bread-rd-night-bread-v9.html">9</a>·<a href="bread-rd-night-bread-v11.html">11</a>·<a href="bread-rd-night-bread-v12.html">12차</a>.`
      );
    }
    if (s.id === "editor-note" && !s.content.includes("v12")) {
      s.content +=
        `<p><a href="bread-rd-night-bread-v12.html">12차</a>에서 습도 42%·56분을 확인했습니다. 고습 보정 분을 55~56 후보에서 56분 1차 확정 후보로 좁혔습니다.</p>`;
    }
    if (s.id === "practice-notes" && !s.content.includes("12차")) {
      s.content = s.content.replace(
        /수정 2026-07-02\(11차 습도\)/,
        `수정 2026-07-05(12차 56분)`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [...guide.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v11"), "bread-rd-night-bread-v11", slug].slice(0, 5);
  }
  console.log("✓ practical guide");
}

const v11 = posts.find((p) => p.slug === "bread-rd-night-bread-v11");
if (v11) {
  for (const s of v11.sections) {
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /<li>습도 42%대에서 1차 발효 <strong>55~56분<\/strong> 단일 배치 확인<\/li>/,
          `<li><a href="bread-rd-night-bread-v12.html">12차</a> 발행: 습도 42%대 1차 발효 <strong>56분</strong> 확인 (55분은 이후 후보)</li>`
        )
        .replace(
          /실전 정리 FAQ·고정값 줄에 '습도 40% 이상이면 분 단축 후보' 한 줄을 반영할 예정입니다\./,
          `실전 정리에 고습 56분 후보를 반영했습니다. 상세는 <a href="bread-rd-night-bread-v12.html">12차</a>.`
        );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /다음 후보는 42%대에서 55~56분 확인, 밤 선별 루틴입니다\./,
        `56분 확인은 <a href="bread-rd-night-bread-v12.html">12차</a>에서 이었고, 55분·밤 선별은 이후로 남겼습니다.`
      );
    }
  }
  if (!v11.relatedSlugs.includes(slug)) {
    v11.relatedSlugs = [slug, ...v11.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v11 links");
}

fs.writeFileSync(
  postsPath,
  `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`,
  "utf8"
);
console.log("✓ wrote data/posts.js");
