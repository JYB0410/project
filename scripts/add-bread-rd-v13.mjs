/**
 * 밤식빵 R&D 13차 추가 + 연관 글 링크 갱신
 * node scripts/add-bread-rd-v13.mjs
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

const slug = "bread-rd-night-bread-v13";

const v13 = {
  slug,
  title: "밤식빵 R&D 13차 — 습도 42%에서 발효 55분을 찍어 본 날",
  subtitle: "12차 56분 옆 점: 1분만 줄이면 눌림이 어떻게 되나",
  category: "bread-rd",
  author: "정지석",
  publishedAt: "2026-07-09",
  updatedAt: "2026-07-09",
  featured: false,
  status: "published",
  excerpt:
    "2026년 2월 23일, 12차와 같은 습도 42%대에서 1차 발효만 55분으로 줄였습니다. 56분보다 텐션이 조금 빡빡했고, 고습 보정 1순위는 여전히 56분 쪽에 가깝습니다.",
  sections: [
    {
      id: "goal",
      heading: "h2",
      title: "만들려던 빵 / 목표",
      content: `<p><a href="bread-rd-night-bread-v12.html">12차</a>에서 습도 42%·1차 발효 56분이 9차(35%·58분) 눌림에 가깝다고 적었습니다. 다만 11차 메모의 다른 후보인 <strong>55분</strong>은 아직 단일 배치로 확인하지 않았습니다.</p>${fig(slug, "goal", "만들려던 빵 / 목표")}<p>13차 목표는 레시피·보관·재료를 그대로 두고, <strong>고습 날 발효 분만 55분</strong>으로 한 점 더 찍는 것이었습니다. 56이 맞는지, 55가 더 나은지, 아니면 둘 다 쓸 수 있는 구간인지 구분하려는 날입니다.</p><p>2026년 2월 23일 실험입니다. 실내 19°C, 습도 <strong>42%</strong>(시작) → 42%(종료). 난방 ON. 반죽·시럽·신선 밤·브러싱·바로 루즈 백은 12차와 동일. 바꾼 것은 1차 발효 타이머 <strong>55분</strong>뿐입니다.</p><p>12차와 같은 주 습한 날씨 패턴이었습니다. 습도가 41~43% 사이를 오가면 분 비교가 흐려지므로, 시작·종료 습도를 두 번 읽고 42%로 맞춰진 날만 본굽에 넣었습니다.</p><p>겨울 시리즈를 한 줄로 다시 적으면, 9=저습 58, 10=보관 개방, 11=고습 58 재현, 12=고습 56, 13=고습 55입니다. 순서를 건너뛰면 숫자만 남고 맥락이 사라집니다.</p>`
    },
    {
      id: "failures",
      heading: "h2",
      title: "실패 1~3 — 눈에 보인 현상",
      content: `<ol><li><strong>발효 텐션</strong> — 55분 종료 시 손가락 눌림이 12차 56분보다 빡빡. 9차 사진 대비로는 '조금 부족' 쪽</li><li><strong>다음 날 겉·속</strong> — 바로 백 기준으로 겉 건조는 양호. 속은 12차보다 약간 촘촘한 느낌</li><li><strong>향·밀착</strong> — 유지. 분을 1분 줄였다고 토핑이 뜨거나 향이 죽진 않음</li></ol><p>가족은 '어제(12차 메모)랑 비슷한데, 속이 조금 더 단단하다'고 했습니다. 제 기준으로 <strong>13차는 부분 확인</strong> — 55분은 고습에서 <strong>가능은 하나 1순위는 아님</strong>. 56분이 눌림·기공 균일 면에서 더 가깝습니다.</p>${fig(slug, "failures", "실패 1~3 — 눈에 보인 현상")}<p>당일 오븐 색은 12차와 구분하기 어려웠습니다. 차이는 성형 직전 반죽 텐션과, 다음 날 단면에서 기공이 조금 더 촘촘한 쪽에서 보였습니다.</p><p>과발효 시큼함·상단 무너짐은 없었습니다. 11차 58분이 '여유', 12차 56분이 '맞음', 13차 55분이 '살짝 부족'으로 읽히는 날이었습니다.</p><p>다음 날 아침 단면 사진을 12차와 나란히 두었습니다. 기공 들쭉날쭉함은 비슷했고, 전체 부피감은 12차가 한 뼘 더 여유 있어 보였습니다.</p>`
    },
    {
      id: "cause",
      heading: "h2",
      title: "원인 추정 (추정 vs 확인)",
      content: `<p><strong>고습 42% + 55분 &lt; 56분 눌림</strong> — 부분 확인. 같은 습도대·같은 고정값에서 분 1분 차이만 봄.</p><p><strong>12차 56분 1순위</strong> — 재확인에 가깝. 55는 짧은 날·시간 부족 시 후보, 표의 기본값은 56을 유지.</p><p><strong>보관·브러싱</strong> — 10~12차 유지. 분 단축만으로 겉 건조가 다시 커지진 않음.</p><p>겨울 고습 보정 초안을 이렇게 좁힙니다. 19°C·습도 40% 이상 → <strong>56분 1순위</strong>, 55분은 여유 없을 때·눌림이 이미 충분할 때만. 둘 다 타이머 복사 금지, 손가락 눌림 우선.</p><p>1분 차이가 작아 보이지만, 고습에서 발효 속도가 빠른 날에는 그 1분이 텐션 구간을 넘어갑니다. 그래서 12·13차를 같은 습도대에서 연속으로 찍은 의미가 있습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "바꾼 변수 하나",
      content: `<p>고정: 12차와 동일(9차 조합 + 바로 루즈 백 + 습도 40%대). 바꾼 것: 1차 발효 <strong>56분 → 55분</strong>.</p>${fig(slug, "one-variable", "바꾼 변수 하나")}<p>반죽 종료 24°C, 굽기 200/190°C 32분, 브러싱 2분 이내 한 겹. 실험일 2026-02-23, 발행 2026-07-09.</p><p>발효 중 50·53·55분에 눌림을 확인했습니다. 50분은 부족, 53분은 거의, 55분에서도 12차 56분 메모의 '딱 맞음'에는 조금 못 미쳤습니다. 그래도 타이머는 55분 고정으로 성형에 들어갔습니다 — 중간에서 1분을 더하면 12차와 변수가 섞입니다.</p><p>습도계 시작·종료 모두 42%. 12차(42→41)와 거의 같은 환경입니다.</p>`
    },
    {
      id: "next",
      heading: "h2",
      title: "다음 시도 계획",
      content: `<ul><li>고습 보정 표를 실전 정리에 56분 1순위·55분 보조로 반영</li><li>신선 밤 크기 선별 루틴</li><li>바로 백 입구 헐거움 미세 조정</li></ul><p>13차로 고습 분 구간(55~56) 비교는 일단 닫습니다. 다음 변수는 재료·보관 미세 쪽으로 옮깁니다.</p>${fig(slug, "next", "다음 시도 계획")}<p>저습 58분(9차)과 고습 56분(12차) 조합이 겨울 기본 줄이 됩니다.</p>`
    },
    {
      id: "context",
      heading: "h2",
      title: "왜 55분을 꼭 찍었나",
      content: `<p>12차만 있으면 '56이 정답'처럼 읽히기 쉽습니다. 11차 메모에 55~56이 같이 적혀 있었기 때문에, <strong>아래 점(55)을 한 번 찍어</strong> 위(56)를 확정하는 편이 정직합니다.</p><p>같은 습도에서 연속 배치를 하지 않으면, 날마다 1%p 습도 흔들림이 분 차이를 가립니다. 13차는 그 흔들림을 줄이려고 12차와 비슷한 날을 골랐습니다.</p><p>9~13차는 겨울 시리즈로 묶입니다. 발효 분 이야기는 여기서 한 사이클을 닫고, 재료·보관 디테일로 넘어갑니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "같은 빵을 찾는 분께",
      content: `<p>고습 날 55분·56분 중 어떤 쪽이 눌림에 맞았는지 <a href="../contact/">문의</a>로 알려 주세요. 제 13차는 42%·55분이 살짝 부족했습니다.</p><p>1분 차이에 집착하기보다, 50·53·55(또는 56)에 손가락을 대 보세요. 타이머는 참고값입니다.</p><p>처음이면 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>와 9·12차를 먼저 보시고, 13차는 '55는 보조' 확인 일지로 읽으면 됩니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>실험 당일 메모: 2026-02-23, 난방 ON, 습도 42%→42%, 1차 55분(50·53·55 눌림), 바로 루즈 백. 다음 날 겉·속 한 줄 + 12차 사진 나란히.</p><p>고습 메모 양식: 온도 / 습도 / 분 / 눌림 한 줄 / 12·13차 중 어느 쪽에 가깝나. 다섯 칸이면 비교가 됩니다.</p><p>시간이 없어 55분으로 끊을 때는, 성형 전 눌림이 '아직 팽팽'이면 1분만 더 두는 쪽을 남겼습니다. 그날은 실험 규칙을 위해 55분 고정을 지켰습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>13차는 <strong>습도 42%·1차 발효 55분</strong>을 확인한 날이었습니다. 눌림·속 균일은 12차 56분보다 살짝 부족했고, 고습 보정 1순위는 <strong>56분</strong>을 유지합니다. 55분은 보조 후보입니다.</p><p>겨울 초안: 저습 35% 전후 58분(9차), 고습 40%+ 56분(12차), 55분(13차)은 여유 없을 때만. <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>에 반영합니다.</p><p>다음 후보는 밤 선별·백 입구 미세 조정입니다.</p>`
    }
  ],
  summary:
    "12차 옆 점. 습도 42%·1차 발효 55분. 56분보다 텐션이 빡빡하고 속은 약간 촘촘. 고습 1순위는 56분, 55분은 보조 후보.",
  commonMistakes: [
    "55·56을 습도 메모 없이 섞어 쓰기",
    "1분 차이를 무시하고 타이머만 복사하기",
    "13차만 보고 12차 56분을 폐기하기",
    "중간 눌림 없이 55분 고정만 고집하기"
  ],
  checklist: [
    "습도 40%+ 확인",
    "1차 55분 + 50·53 중간 눌림",
    "12차 56분 메모와 나란히 비교",
    "바로 루즈 백"
  ],
  relatedSlugs: [
    "bread-rd-night-bread-v12",
    "bread-rd-night-bread-v11",
    "bread-rd-night-bread-practical-guide",
    "bread-rd-series-guide"
  ],
  faq: [
    {
      q: "13차 결과로 56분을 버리나요?",
      a: "아닙니다. 고습 1순위는 12차 56분입니다. 55분은 가능하지만 눌림이 살짝 부족한 보조 후보입니다."
    },
    {
      q: "저습에서도 55분을 쓰나요?",
      a: "아닙니다. 저습(35% 전후) 후보는 9차 58분입니다. 습도 칸을 먼저 적으세요."
    }
  ],
  coverImage: `../assets/images/photos/${slug}/goal.jpg`,
  coverCaption: "만들려던 빵 / 목표"
};

const n = postCharCount(v13);
if (n < 2000) {
  console.error(`FAIL char count ${n}`);
  process.exit(1);
}
console.log(`✓ ${slug}: ${n} chars`);

const posts = loadPosts();
if (posts.some((p) => p.slug === slug)) {
  posts[posts.findIndex((p) => p.slug === slug)] = v13;
  console.log("✓ replaced existing v13");
} else {
  posts.push(v13);
  console.log("✓ appended v13");
}

const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.excerpt =
    "밤식빵 R&D 1~13차·실전 정리·중간 정리를 어떤 순서로 읽으면 좋은지 안내합니다. 일지와 가져갈 수 있는 정리 글을 구분합니다.";
  series.summary =
    "밤식빵 R&D 일지·실전 정리·13차까지 읽는 순서를 안내합니다. 실험일과 발행일 구분, 일지 vs 정리 글 역할을 설명합니다.";
  series.updatedAt = "2026-07-09";
  for (const s of series.sections) {
    if (s.id === "one-variable" && !s.content.includes("v13")) {
      s.content = s.content.replace(
        `<li><a href="bread-rd-night-bread-v12.html">12차</a> — 습도 42%·발효 56분 보정</li></ol>`,
        `<li><a href="bread-rd-night-bread-v12.html">12차</a> — 습도 42%·발효 56분 보정</li><li><a href="bread-rd-night-bread-v13.html">13차</a> — 습도 42%·발효 55분 확인</li></ol>`
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        /이후 후보: 55분 확인, 밤 선별 루틴\./,
        `<a href="bread-rd-night-bread-v13.html">13차 55분</a>까지 발행. 이후 후보: 밤 선별 루틴, 백 입구 미세 조정.`
      );
    }
  }
  series.relatedSlugs = [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v13",
    "baker-cert-to-bread-rd"
  ];
  console.log("✓ series guide");
}

const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.updatedAt = "2026-07-09";
  for (const s of guide.sections) {
    if (s.id === "fixed-draft" && !s.content.includes("v13")) {
      s.content = s.content.replace(
        /56분 후보\(<a href="bread-rd-night-bread-v12.html">12차<\/a> 확인, 55분은 미실시\)/,
        `56분 1순위(<a href="bread-rd-night-bread-v12.html">12차</a>), 55분 보조(<a href="bread-rd-night-bread-v13.html">13차</a>·살짝 부족)`
      );
      s.content = s.content.replace(
        /56분 후보\(<a href="bread-rd-night-bread-v12.html">12차<\/a>\)/,
        `56분 1순위(<a href="bread-rd-night-bread-v12.html">12차</a>), 55분 보조(<a href="bread-rd-night-bread-v13.html">13차</a>)`
      );
    }
    if (s.id === "when-read-logs" && !s.content.includes("v13")) {
      s.content = s.content.replace(
        /겨울·습도 메모 → <a href="bread-rd-night-bread-v9.html">9<\/a>·<a href="bread-rd-night-bread-v11.html">11<\/a>·<a href="bread-rd-night-bread-v12.html">12차<\/a>\./,
        `겨울·습도 메모 → <a href="bread-rd-night-bread-v9.html">9</a>·<a href="bread-rd-night-bread-v11.html">11</a>·<a href="bread-rd-night-bread-v12.html">12</a>·<a href="bread-rd-night-bread-v13.html">13차</a>.`
      );
    }
    if (s.id === "editor-note" && !s.content.includes("v13")) {
      s.content +=
        `<p><a href="bread-rd-night-bread-v13.html">13차</a>에서 고습 55분을 확인했습니다. 1순위는 56분, 55분은 보조로 정리합니다.</p>`;
    }
    if (s.id === "practice-notes" && !s.content.includes("13차")) {
      s.content = s.content.replace(
        /수정 2026-07-05\(12차 56분\)|수정 2026-07-22/,
        `수정 2026-07-09(13차 55분)`
      );
    }
  }
  if (!guide.relatedSlugs.includes(slug)) {
    guide.relatedSlugs = [...guide.relatedSlugs.filter((x) => x !== "bread-rd-night-bread-v12"), "bread-rd-night-bread-v12", slug].slice(0, 5);
  }
  console.log("✓ practical guide");
}

const v12 = posts.find((p) => p.slug === "bread-rd-night-bread-v12");
if (v12) {
  for (const s of v12.sections) {
    if (s.id === "next") {
      s.content = s.content
        .replace(
          /<li>습도 42%대 <strong>55분<\/strong> 단일 배치 — 56분과 차이 확인<\/li>/,
          `<li><a href="bread-rd-night-bread-v13.html">13차</a> 발행: 습도 42%대 <strong>55분</strong> 확인 (56이 1순위)</li>`
        )
        .replace(
          /실전 정리 겨울 보정 줄에 '습도 40%\+ → 56분 후보'를 반영합니다\./,
          `실전 정리에 고습 56분 1순위·55분 보조를 반영했습니다. 상세는 <a href="bread-rd-night-bread-v13.html">13차</a>.`
        );
    }
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        /다음 후보는 55분 확인, 밤 선별, 백 입구 미세 조정입니다\./,
        `55분 확인은 <a href="bread-rd-night-bread-v13.html">13차</a>에서 이었고, 밤 선별·백 입구는 이후로 남겼습니다.`
      );
    }
  }
  if (!v12.relatedSlugs.includes(slug)) {
    v12.relatedSlugs = [slug, ...v12.relatedSlugs].slice(0, 4);
  }
  console.log("✓ v12 links");
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log("✓ wrote data/posts.js");
