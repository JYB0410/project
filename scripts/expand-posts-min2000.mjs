/**
 * 전체 글 본문을 공백 미포함 2000자 이상으로 확장
 * 사용: node scripts/expand-posts-min2000.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PRACTICE_SECTIONS } from "./expand-content-2000.mjs";
import {
  PRACTICE_TOPUPS,
  PRACTICE_CLOSERS,
  PRACTICE_FINAL_PAD,
  DEFAULT_FINAL_PAD
} from "./expand-content-topup.mjs";
import {
  MIN_CHARS,
  charCountNoSpace,
  postCharCount,
  postBaseCharCount
} from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data", "posts.js");

const posts = Function(
  `return (${fs.readFileSync(postsPath, "utf8").replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const EXTRA_PADS = [
  "<p>마무리로, 이번 주에는 체크리스트 3개만 골라 2주 반복해 보세요. 작은 성공이 쌓이면 나머지는 자연스럽게 늘어납니다.</p>",
  "<p>기록이 쌓이면 병원·상담 때 설명이 쉬워집니다. 한 줄 메모라도 같은 항목으로 이어 쓰는 것이 핵심입니다.</p>",
  "<p>완벽한 루틴보다 80% 지켜지는 루틴이 오래 갑니다. 안 된 날은 원인 한 줄만 적고 다음 주에 조정하세요.</p>",
  "<p>오늘 당장 하나만 고른다면, 체크리스트 맨 위 항목부터 시작해 보세요. 나머지는 다음 주로 미뤄도 괜찮습니다.</p>",
  "<p>가족이 함께 돌본다면, 누가 했는지 체크박스 한 칸만 추가해도 누락·중복이 줄어듭니다.</p>",
  "<p>검색으로 답을 찾기 전에 7일 메모를 먼저 정리해 보세요. 증상 설명이 훨씬 빨라지는 경우가 많습니다.</p>",
  "<p>새 용품·새 사료·새 루틴은 동시에 바꾸지 않습니다. 한 가지만 바꾸고 5일 관찰하는 편이 안전합니다.</p>",
  "<p>이번 달 목표는 '매일 완벽'이 아니라 '이번 주 3회 성공'입니다. 0회에서 1회로 바뀌는 것만으로도 충분한 진전입니다.</p>",
  "<p>스트레스 신호(회피·짖음·숨 가쁨)가 보이면 시간을 반으로 줄이세요. 짧게 자주 성공하는 쪽이 학습에 유리합니다.</p>",
  "<p>계절·이사·손님처럼 환경이 바뀌는 주에는 루틴을 단순화하세요. 필수 3개만 지키고 나머지는 다음 주로 미뤄도 됩니다.</p>",
  "<p>사진 한 장이 긴 설명보다 나을 때가 있습니다. 같은 조명·각도로 남기면 변화 비교가 쉬워집니다.</p>",
  "<p>병원 방문 전에는 '언제부터·얼마나 자주·무엇이 함께 변했는지' 3가지만 정리해도 상담이 수월해집니다.</p>",
  "<p>루틴이 무너진 날을 실패로 보지 말고, 겹친 일정(야근·손님·이사)을 한 줄로 적어 두세요. 다음 주 조정 근거가 됩니다.</p>",
  "<p>반려동물이 편안해 보이는 시간대를 메모하면, 그루밍·발 닦기·약 급여 같은 '싫어하는 일'을 그때로 옮기기 쉽습니다.</p>",
  "<p>가족 그룹 채팅에 '오늘 특이사항' 한 줄만 공유해도, 각자 다른 앱에 적는 것보다 패턴 파악이 빨라집니다.</p>",
  "<p>주말에 평일 루틴을 완전히 바꾸기보다, 급여·산책 시각만 ±1시간 유지하는 편이 월요일 적응에 도움이 됩니다.</p>",
  "<p>용품·사료 리뷰를 더 보기 전에, 지금 쓰는 것으로 2주 더 버텨 보세요. 불편이 없으면 교체 우선순위를 낮출 수 있습니다.</p>",
  "<p>아이에게는 '5분 역할'만 맡기고, 급여량·약·병원은 어른이 담당하는 편이 안전합니다. 짧은 성공 경험이 자신감으로 이어집니다.</p>",
  "<p>실내·실외 활동 비율을 주 단위로 적으면, 산책이 부족한 주인지 놀이가 과한 주인지 조절하기 쉽습니다.</p>",
  "<p>불안·흥분이 보이면 자극을 줄이는 것이 먼저입니다. 거리 두기·소음 줄이기·시간 단축 후에 다시 시도하세요.</p>"
];

const BOILERPLATE_PAD_RE = /<p>실천 노트 보충 \d+: [\s\S]*?<\/p>/g;

let inserted = 0;
let skipped = 0;

for (const post of posts) {
  const base = PRACTICE_SECTIONS[post.slug];
  if (!base) {
    console.warn(`⚠ 콘텐츠 없음: ${post.slug}`);
    continue;
  }

  let content = (base + (PRACTICE_TOPUPS[post.slug] || "") + (PRACTICE_CLOSERS[post.slug] || "")).replace(
    BOILERPLATE_PAD_RE,
    ""
  );
  const existing = post.sections.find((s) => s.id === "practice-notes");
  const baseChars = postBaseCharCount(post);

  const finalPad = PRACTICE_FINAL_PAD[post.slug] || DEFAULT_FINAL_PAD;
  if (baseChars + charCountNoSpace(content) < MIN_CHARS && !content.includes(finalPad)) {
    content += finalPad;
  }

  let guard = 0;
  while (baseChars + charCountNoSpace(content) < MIN_CHARS && guard < EXTRA_PADS.length) {
    const pad = EXTRA_PADS[guard];
    if (!content.includes(pad)) content += pad;
    guard++;
  }

  const projected = baseChars + charCountNoSpace(content);
  const hasBoilerplate = existing && BOILERPLATE_PAD_RE.test(existing.content);
  if (existing && existing.content === content && projected >= MIN_CHARS && !hasBoilerplate) {
    skipped++;
    continue;
  }

  post.sections = post.sections.filter((s) => s.id !== "practice-notes");

  const editorIdx = post.sections.findIndex((s) => s.id === "editor-note");
  const section = {
    id: "practice-notes",
    heading: "h2",
    title: "실전 적용 노트",
    content
  };

  if (editorIdx === -1) post.sections.push(section);
  else post.sections.splice(editorIdx, 0, section);

  if (postCharCount(post) < MIN_CHARS) {
    console.warn(`⚠ ${post.slug}: ${postCharCount(post)}자 (목표 ${MIN_CHARS}자 미달, 공백 미포함)`);
  } else {
    inserted++;
  }

}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);

const counts = posts.map((p) => ({ slug: p.slug, chars: postCharCount(p) }));
const under = counts.filter((c) => c.chars < MIN_CHARS);
console.log(`✓ 실전 적용 노트 반영: ${inserted}편, 스킵 ${skipped}편 (공백 미포함 기준)`);
console.log(`  평균 ${Math.round(counts.reduce((s, c) => s + c.chars, 0) / counts.length)}자, 최소 ${Math.min(...counts.map((c) => c.chars))}자`);
if (under.length) console.log(`  미달 ${under.length}편:`, under.map((u) => `${u.slug}(${u.chars})`).join(", "));