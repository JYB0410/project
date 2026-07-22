/**
 * 대표 글 3편: 소제목·도입 첫 문단을 템플릿과 다르게 다듬음
 * node scripts/adsense-preflight-diversify.mjs
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

const posts = loadPosts();
const today = "2026-07-22";

function patchSection(post, sectionId, { title, openPrefix }) {
  const sec = post.sections.find((s) => s.id === sectionId);
  if (!sec) {
    console.warn("missing section", post.slug, sectionId);
    return;
  }
  if (title) sec.title = title;
  if (openPrefix && !sec.content.includes("section-lead")) {
    sec.content = `<p class="section-lead">${openPrefix}</p>${sec.content}`;
  }
}

// 1) 동기 글 — 기능사 진입
const why = posts.find((p) => p.slug === "why-baker-certification");
if (why) {
  patchSection(why, "childhood-bread", {
    title: "어릴 적 빵집의 밤식빵이 아직 남은 이유",
    openPrefix: "이 글은 레시피가 아니라, 제가 기능사에 도전하게 된 배경을 짧게 남긴 기록입니다."
  });
  patchSection(why, "quit-day", {
    title: "퇴사 저녁, 결심이 구체화된 순간"
  });
  patchSection(why, "before-cert-trial", {
    title: "학원 전에 집에서 먼저 망한 것들"
  });
  why.updatedAt = today;
  why.subtitle = "추억의 맛에서 기능사 도전까지 — 경험 기록";
  console.log("✓ why-baker-certification");
}

// 2) 읽기 안내 — 구조 글
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
if (series) {
  patchSection(series, "goal", {
    title: "어디부터 읽으면 비교가 되나",
    openPrefix: "실험 결과를 새로 적는 글이 아닙니다. 밤식빵 일지를 어떤 순서로 펼치면 변수가 섞이지 않는지 안내합니다."
  });
  patchSection(series, "failures", {
    title: "순서 없이 읽으면 생기는 세 가지 오해"
  });
  patchSection(series, "cause", {
    title: "일지가 소설이 아닌 이유"
  });
  series.updatedAt = today;
  series.subtitle = "일지·실전 정리·중간 정리를 헷갈리지 않게 읽는 법";
  console.log("✓ bread-rd-series-guide");
}

// 3) 실전 정리 — 가져갈 글
const guide = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
if (guide) {
  patchSection(guide, "goal", {
    title: "일지를 다 읽기 전에 가져갈 것",
    openPrefix: "1~8차 일지를 처음부터 따라가기 어렵다면, 이 정리부터 보셔도 됩니다. 그램 표 대신 판단 기준만 모았습니다."
  });
  patchSection(guide, "takeaway-seven", {
    title: "집 오븐에서 검증된 일곱 가지 판단"
  });
  patchSection(guide, "fixed-draft", {
    title: "고정값 초안 — 복사 금지, 메모용"
  });
  guide.updatedAt = today;
  guide.subtitle = "레시피가 아니라 원칙·고정값 초안·집에서 망하기 쉬운 점";
  console.log("✓ bread-rd-night-bread-practical-guide");
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log("✓ wrote posts.js");
