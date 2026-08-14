/**
 * AdSense "가치 낮은 콘텐츠" 거절 대응:
 * - R&D 일지 동일 뼈대(제목) 완화
 * - 글마다 독자 가져갈 점(value-box) 추가
 * - 실전 정리·홈 CTA 강화
 * node scripts/adsense-low-value-recovery.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

/** 차수별 고유 소제목 + 독자 한 줄 가치 */
const RD_META = {
  "bread-rd-night-bread-v1": {
    value: "첫 실험에서 확인한 것: 시럽 농도만 바꿔도 실패 목록이 생기고, 다음 변수는 '하나만' 열어야 한다.",
    titles: {
      goal: "첫 밤식빵 실험에서 맞추려던 것",
      failures: "그날 바로 눈에 들어온 실패 세 가지",
      cause: "실패를 원인으로 옮길 때 구분한 것",
      "one-variable": "그날 유일하게 건드린 조건",
      next: "2차로 넘긴 변수",
      context: "왜 기능사 직후 첫 변수로 시럽이었나",
      "for-readers": "같은 출발선에 있는 분께",
      "practice-notes": "메모에 남긴 숫자",
      "editor-note": "1차를 닫으며"
    }
  },
  "bread-rd-night-bread-v2": {
    value: "가져갈 점: 토핑은 성형 직후보다 1차 발효 후·성형 직전에 올리는 편이 밀착에 유리했다.",
    titles: {
      goal: "토핑 시점을 바꾸려 한 이유",
      failures: "시점을 바꾼 뒤 달라진 현상",
      cause: "밀착이 나아진 쪽으로 읽은 이유",
      "one-variable": "올린 타이밍만 이동",
      next: "수분 쪽으로 넘긴 과제",
      context: "1차 실패 목록에서 고른 두 번째 변수",
      "for-readers": "토핑이 흘러내리는 분께",
      "practice-notes": "당일 메모 양식",
      "editor-note": "2차를 닫으며"
    }
  },
  "bread-rd-night-bread-v3": {
    value: "가져갈 점: 수분 +2%p는 당일보다 다음 날 촉촉함에서 차이가 났다. 당일 맛만 보지 말 것.",
    titles: {
      goal: "수분만 올린 날의 목표",
      failures: "당일과 다음 날, 어디가 달랐나",
      cause: "수분 효과가 늦게 보인 이유",
      "one-variable": "+2%p만 적용",
      next: "보관 비교로 넘긴 이유",
      context: "토핑 다음으로 수분을 고른 맥락",
      "for-readers": "다음 날 건조가 고민인 분께",
      "practice-notes": "수분 메모 한 줄",
      "editor-note": "3차를 닫으며"
    }
  },
  "bread-rd-night-bread-v4": {
    value: "가져갈 점: 식힌 뒤 루즈 백 보관이 실온 개방보다 다음 날 속 촉촉함에 유리했다(겉 눅눅함 트레이드오프).",
    titles: {
      goal: "식힌 뒤 보관만 비교한 날",
      failures: "개방 vs 루즈 백에서 본 차이",
      cause: "보관이 식감을 가르는 지점",
      "one-variable": "보관 방식 하나만",
      next: "시럽 졸임으로 넘긴 과제",
      context: "수분 실험 다음에 보관을 연 이유",
      "for-readers": "다음 날 식감이 중요한 분께",
      "practice-notes": "보관 메모 칸",
      "editor-note": "4차를 닫으며"
    }
  },
  "bread-rd-night-bread-v5": {
    value: "가져갈 점: 시럽 졸임 +2분이 흘러내림·밀착에 도움이 됐지만 단맛도 같이 올라갔다.",
    titles: {
      goal: "졸임 시간을 늘린 날의 목표",
      failures: "밀착과 단맛이 동시에 움직인 결과",
      cause: "졸임이 표면 결합에 준 영향",
      "one-variable": "졸임 +2분만",
      next: "단맛 보정으로 넘긴 과제",
      context: "2·3·4차 위에 올린 다섯 번째 변수",
      "for-readers": "토핑이 흐르는 분께",
      "practice-notes": "졸임 타이머 메모",
      "editor-note": "5차를 닫으며"
    }
  },
  "bread-rd-night-bread-v6": {
    value: "가져갈 점: 단맛 보정은 졸임을 줄이기보다 설탕 총량 -10%가 축을 맞추기 쉬웠다.",
    titles: {
      goal: "단맛을 되돌리려 한 날",
      failures: "설탕을 줄인 뒤 남은 것·잃은 것",
      cause: "단맛과 밀착의 트레이드오프",
      "one-variable": "설탕 -10%만",
      next: "재료(신선 밤)로 넘긴 과제",
      context: "5차 단맛 문제를 숫자로 줄인 이유",
      "for-readers": "너무 달다는 반응이 있는 분께",
      "practice-notes": "설탕 보정 메모",
      "editor-note": "6차를 닫으며"
    }
  },
  "bread-rd-night-bread-v7": {
    value: "가져갈 점: 통조림보다 신선 밤이 향·고소함에 유리했다. 다만 크기 편차는 별도 변수로 남았다.",
    titles: {
      goal: "통조림 대신 신선 밤을 쓴 날",
      failures: "향은 나아지고 크기는 흔들린 결과",
      cause: "재료 교체가 가져온 이득과 대가",
      "one-variable": "밤 재료만 교체",
      next: "브러싱·크기 선별로 넘긴 과제",
      context: "가을 시즌에 재료를 연 이유",
      "for-readers": "재료를 바꿀 때",
      "practice-notes": "손질·삶기 메모",
      "editor-note": "7차를 닫으며"
    }
  },
  "bread-rd-night-bread-v8": {
    value: "가져갈 점: 굽기 직후 물 희석 시럽을 얇게 브러싱하면 윤기·밀착 보정에 도움이 됐다(설탕 추가 금지).",
    titles: {
      goal: "오븐 밖 변수 — 브러싱을 연 날",
      failures: "윤기·밀착과 다음 날 겉의 변화",
      cause: "뜨거운 표면 코팅이 하는 일",
      "one-variable": "굽기 직후 한 겹만",
      next: "겨울 재현으로 넘긴 과제",
      context: "6차 밀착을 졸임 없이 보완한 이유",
      "for-readers": "겉 결합이 약한 분께",
      "practice-notes": "브러싱 타이밍 메모",
      "editor-note": "8차를 닫으며"
    }
  },
  "bread-rd-night-bread-v9": {
    value: "가져갈 점: 여름 발효 분을 겨울에 복사하지 말 것. 난방 19°C·습도 35% 전후에서 1차 발효 58분 후보(눌림 우선).",
    titles: {
      goal: "8차 고정값을 겨울 실내에서 다시 굽다",
      failures: "속은 비슷하고 겉 건조만 남은 결과",
      cause: "발효 분 보정이 맞았는지",
      "one-variable": "1차 발효만 58분",
      next: "보관·습도로 넘긴 겨울 과제",
      context: "왜 겨울 재현을 따로 열었나",
      "for-readers": "난방 켜고 굽는 분께",
      "practice-notes": "겨울 메모 칸",
      "editor-note": "9차를 닫으며"
    }
  },
  "bread-rd-night-bread-v10": {
    value: "가져갈 점: 겨울에는 식힌 뒤 루즈 백 전 개방을 0~30분으로 줄이는 편이 겉 건조에 유리했다(바로 백은 눅눅함 소폭).",
    titles: {
      goal: "겨울 보관, 개방 시간을 줄인 날",
      failures: "0분 vs 30분 개방의 다음 날 차이",
      cause: "개방이 건조를 키운 경로",
      "one-variable": "백 전 개방 분만 비교",
      next: "습도 40%+ 재현으로",
      context: "9차 겉 건조를 보관으로 본 이유",
      "for-readers": "난방 건조가 심한 분께",
      "practice-notes": "개방 분 메모",
      "editor-note": "10차를 닫으며"
    }
  },
  "bread-rd-night-bread-v11": {
    value: "가져갈 점: 58분은 저습(35%대) 기준이다. 습도 40%+에서는 같은 분이 여유 있어 눌림이 더 빨랐다.",
    titles: {
      goal: "습도 42% 날, 58분을 그대로 밀어 본 날",
      failures: "같은 분, 다른 눌림",
      cause: "습도가 발효 속도에 준 영향",
      "one-variable": "환경(습도)만 다른 재현",
      next: "56·55분 후보로",
      context: "숫자를 맹신하지 않기 위한 재현",
      "for-readers": "습도계를 쓰는 분께",
      "practice-notes": "습도 두 번 읽기",
      "editor-note": "11차를 닫으며"
    }
  },
  "bread-rd-night-bread-v12": {
    value: "가져갈 점: 습도 42%대 고습 보정 1순위는 1차 발효 56분(손가락 눌림 우선).",
    titles: {
      goal: "고습에서 56분으로 맞춘 날",
      failures: "58분 대비 텐션이 돌아온 결과",
      cause: "2분 단축이 눌림에 준 영향",
      "one-variable": "58→56분만",
      next: "55분 확인으로",
      context: "11차 후보를 한 점 찍은 이유",
      "for-readers": "고습 날 분을 줄일 때",
      "practice-notes": "중간 눌림 체크",
      "editor-note": "12차를 닫으며"
    }
  },
  "bread-rd-night-bread-v13": {
    value: "가져갈 점: 고습 55분은 가능하나 살짝 부족. 1순위는 56분, 55분은 보조 후보.",
    titles: {
      goal: "56분 옆 점 — 55분을 찍어 본 날",
      failures: "55분이 빡빡했던 지점",
      cause: "1분 차이가 텐션을 가른 이유",
      "one-variable": "56→55분만",
      next: "재료 챕터로",
      context: "아래 점을 찍어 위를 확정한 이유",
      "for-readers": "분 단위로 맞출 때",
      "practice-notes": "고습 분 구간 메모",
      "editor-note": "13차를 닫으며"
    }
  },
  "bread-rd-night-bread-v14": {
    value: "가져갈 점: 신선 밤은 중간 크기(장경 약 2~2.5cm) 우선. 한 팬에 크기를 섞지 말 것.",
    titles: {
      goal: "밤 크기를 나눠 올린 날",
      failures: "큰·중간·작은 밤의 다른 결과",
      cause: "크기가 밀착·존재감을 가른 이유",
      "one-variable": "크기 등급만 분리",
      next: "큰 밤 배치 예외로",
      context: "겨울 다음에 재료를 연 이유",
      "for-readers": "시장에서 밤 고를 때",
      "practice-notes": "선별 루틴 초안",
      "editor-note": "14차를 닫으며"
    }
  },
  "bread-rd-night-bread-v15": {
    value: "가져갈 점: 큰 밤은 간격 넓히고 올린 직후 손끝으로 한 번만 가볍게. 본굽 1순위는 여전히 중간 크기.",
    titles: {
      goal: "큰 밤만 간격·압착을 바꾼 날",
      failures: "들뜸이 준 자리, 중간 대조",
      cause: "간격과 가벼운 압착의 역할",
      "one-variable": "배치·1회 압착만",
      next: "보관 미세로 남긴 과제",
      context: "중간 1순위를 유지한 채 예외만 본 이유",
      "for-readers": "큰 밤을 쓰고 싶은 분께",
      "practice-notes": "큰 밤 예외 루틴",
      "editor-note": "15차를 닫으며"
    }
  }
};

function valueBox(text) {
  return `<aside class="value-box" aria-label="이 글에서 가져갈 점"><p><strong>이 글에서 가져갈 점</strong> — ${text}</p></aside>`;
}

const posts = loadPosts();
let touched = 0;

for (const post of posts) {
  const meta = RD_META[post.slug];
  if (!meta || !post.sections) continue;

  for (const sec of post.sections) {
    if (meta.titles[sec.id]) sec.title = meta.titles[sec.id];
  }

  // prepend value box to first section if missing
  const first = post.sections[0];
  if (first && !first.content.includes("value-box")) {
    first.content = valueBox(meta.value) + first.content;
  }

  // diversify: move practice-notes before editor-note is already fine;
  // for even/odd: swap for-readers and practice-notes order on odd versions
  const m = post.slug.match(/v(\d+)$/);
  if (m && Number(m[1]) % 2 === 1) {
    const iFr = post.sections.findIndex((s) => s.id === "for-readers");
    const iPr = post.sections.findIndex((s) => s.id === "practice-notes");
    if (iFr >= 0 && iPr >= 0 && iFr < iPr) {
      const tmp = post.sections[iFr];
      post.sections[iFr] = post.sections[iPr];
      post.sections[iPr] = tmp;
    }
  }

  post.updatedAt = "2026-08-12";
  touched++;
  console.log("✓ diversified", post.slug);
}

// Strengthen practical guide opening value
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  guide.title = "밤식빵 R&D — 집에서 바로 쓸 실전 정리 (1~15차 반영)";
  guide.excerpt =
    "일지 15편을 다 읽지 않아도 됩니다. 토핑·수분·보관·시럽·재료·브러싱·겨울 보정·밤 선별까지, 집 오븐에서 쓸 판단 기준만 한곳에 모았습니다. 완성 레시피가 아닙니다.";
  guide.updatedAt = "2026-08-12";
  const goal = guide.sections.find((s) => s.id === "goal");
  if (goal && !goal.content.includes("value-box")) {
    goal.content =
      valueBox(
        "이 글만으로 시작할 수 있습니다. 그램 표 대신 '무엇을 어떤 순서로 검증할지'와 겨울·재료 보정 한 줄을 가져가세요."
      ) + goal.content;
  }
  // winter quick table section if missing
  if (!guide.sections.some((s) => s.id === "winter-quick")) {
    const idx = guide.sections.findIndex((s) => s.id === "fixed-draft");
    const winter = {
      id: "winter-quick",
      heading: "h2",
      title: "겨울·난방 실내 — 빠른 보정 표",
      content: `<p>일지를 다시 펼치기 전, 아래만 메모에 옮겨도 됩니다. 숫자는 제 환경 기준이며 <strong>손가락 눌림이 우선</strong>입니다.</p><ul><li><strong>저습(약 35%)</strong> 1차 발효 후보 <strong>58분</strong> — <a href="bread-rd-night-bread-v9.html">9차</a></li><li><strong>고습(약 40%+)</strong> 1차 발효 후보 <strong>56분</strong>(55분은 보조) — <a href="bread-rd-night-bread-v12.html">12</a>·<a href="bread-rd-night-bread-v13.html">13차</a></li><li><strong>보관</strong> 식힌 뒤 개방 <strong>0~30분</strong> 후 루즈 백 — <a href="bread-rd-night-bread-v10.html">10차</a></li><li><strong>재료</strong> 신선 밤 <strong>중간 크기</strong>, 큰 밤은 간격·가벼운 압착 — <a href="bread-rd-night-bread-v14.html">14</a>·<a href="bread-rd-night-bread-v15.html">15차</a></li></ul><p>여름 일지 숫자를 겨울에 그대로 복사하지 마세요. 온도·습도를 먼저 적고 분을 맞춥니다.</p>`
    };
    if (idx >= 0) guide.sections.splice(idx + 1, 0, winter);
    else guide.sections.push(winter);
  }
  console.log("✓ practical guide strengthened");
}

// Series guide value box
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  series.updatedAt = "2026-08-12";
  const goal = series.sections.find((s) => s.id === "goal");
  if (goal && !goal.content.includes("value-box")) {
    goal.content =
      valueBox(
        "시간이 없으면 실전 정리 → 관심 변수 일지 1~2편만. 전부 읽을 필요는 없습니다."
      ) + goal.content;
  }
  console.log("✓ series guide");
}

// why-baker value
const why = posts.find((p) => p.slug === "why-baker-certification");
if (why) {
  why.updatedAt = "2026-08-12";
  const first = why.sections[0];
  if (first && !first.content.includes("value-box")) {
    first.content =
      valueBox(
        "기능사 도전 동기와 '왜 레시피가 아니라 기본기·변수 기록인가'를 짧게 알 수 있는 글입니다."
      ) + first.content;
  }
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log(`✓ touched ${touched} R&D diaries + hubs`);

// Home hero CTAs → practical guide first
const indexPath = path.join(ROOT, "index.html");
let index = fs.readFileSync(indexPath, "utf8");
if (!index.includes("bread-rd-night-bread-practical-guide.html")) {
  index = index.replace(
    `<a href="about/" class="btn btn-primary">소개 읽기</a>
            <a href="categories/" class="btn btn-secondary">가이드 보기</a>`,
    `<a href="posts/bread-rd-night-bread-practical-guide.html" class="btn btn-primary">실전 정리부터</a>
            <a href="categories/" class="btn btn-secondary">전체 가이드</a>
            <a href="about/" class="btn btn-secondary">소개</a>`
  );
} else {
  index = index.replace(
    /hero-actions">[\s\S]*?<\/div>\s*<\/div>\s*<div class="hero-visual"/,
    `hero-actions">
            <a href="posts/bread-rd-night-bread-practical-guide.html" class="btn btn-primary">실전 정리부터</a>
            <a href="categories/" class="btn btn-secondary">전체 가이드</a>
            <a href="about/" class="btn btn-secondary">소개</a>
          </div>
        </div>
        <div class="hero-visual"`
  );
}
// hero card value
index = index.replace(
  `<h2>이 블로그에서 다루는 것</h2>
          <ul>
            <li>제빵기능사 준비·시험 경험 (2024.9 ~ 2025.5)</li>
            <li>합격 이후 빵 연구·실패·노하우</li>
            <li>추억의 밤식빵에 가깝게 가는 과정</li>
            <li>직접 만든 빵을 중심으로 한 기록</li>
          </ul>`,
  `<h2>여기서 가져갈 수 있는 것</h2>
          <ul>
            <li>기능사 준비·시험 경험 (2024.9~2025.5 합격)</li>
            <li>집 오븐 기준 변수 하나·실패 기록 방법</li>
            <li>밤식빵 실전 판단 기준 (레시피 표 아님)</li>
            <li>겨울 발효·보관·재료 선별 메모</li>
          </ul>
          <p style="margin:0.75rem 0 0;font-size:0.9rem"><a href="posts/bread-rd-night-bread-practical-guide.html" class="text-link">실전 정리 바로 읽기 →</a></p>`
);
fs.writeFileSync(indexPath, index);
console.log("✓ index hero CTAs");

// CSS value-box
const cssPath = path.join(ROOT, "assets/css/main.css");
let css = fs.readFileSync(cssPath, "utf8");
if (!css.includes(".value-box")) {
  css += `
/* Reader value callout — AdSense helpful-content signal */
.value-box {
  background: rgba(154, 91, 46, 0.08);
  border-left: 4px solid var(--color-main);
  border-radius: var(--radius-sm);
  padding: 0.9rem 1.1rem;
  margin: 0 0 1.25rem;
}
.value-box p { margin: 0; font-size: 0.95rem; line-height: 1.55; color: var(--color-text); }
.value-box strong { color: var(--color-main); }
`;
  fs.writeFileSync(cssPath, css);
  console.log("✓ value-box CSS");
}

console.log("\nDone. Run: node scripts/build-site.mjs");
