/**
 * 중복 제거 후 2000자 미달 칼럼에 고유 문단 보강 (보일러플레이트 없음)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { columnCharCount } from "./column-char-count.mjs";
import { MIN_CHARS } from "./content-char-count.mjs";
import { dedupeParagraphs } from "./dedupe-content.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const colsPath = path.join(ROOT, "data/columns.js");

const code = fs.readFileSync(colsPath, "utf8");
const columns = Function(`return (${code.replace("window.COLUMNS_DATA = ", "").replace(/;\s*$/, "")})`)();

const PATCHES = {
  "lab-notes-to-blog": {
    "two-dates": "<p>발행 지연 중에도 실험 메모는 계속 쌓였습니다. 5차를 구운 날 메모는 5차 글이 나가기 전에 이미 완성돼 있었고, 발행은 6차 글 뒤에 올렸습니다. 순서가 뒤섞여도 실험일이 맞으면 독자 입장에서 혼란이 적습니다.</p>",
    "four-fields": "<p>초안 파일명은 실험일-변수 한 줄로 짓습니다. 예: 2025-07-05-topping-v1.txt. 발행 slug는 나중에 정합니다. 실험 순서가 이름에 남으면 제목을 고민하는 시간이 줄어듭니다.</p><p>섹션 id는 메모 4칸과 1:1로 맞췄습니다. goal, failures, cause, one-variable처럼 고정하면 8차를 쓸 때도 1차와 같은 뼈대를 복사해 시작할 수 있습니다.</p><p>차수 사이 링크는 '이전 글'보다 '같은 변수를 다른 날에' 연결합니다. 3차 수분 실험 후 4차 보관으로 넘어갈 때, 3차 하단에 '다음: 보관만 바꿈' 한 줄만 적어도 독자가 흐름을 따라가기 쉽습니다.</p>",
    "imperfect-publish": "<p>발행 전 주에 사진을 붙일 때도 메모 4칸 순서는 바꾸지 않았습니다. 사진이 늦어도 글 뼈대는 실험 당일에 완성돼 있어야, 두 달 뒤에도 '무엇을 바꿨는지'를 잃지 않습니다.</p><p>기능사 시리즈도 같은 방식입니다. 시험 당일 메모를 먼저 두고, 합격 후에야 문장을 다듬어 발행했습니다. R&D 일지와 다른 점은 실험일과 발행일 간격이 더 길다는 것뿐입니다.</p>",
    "revision": "<p>독자가 오래된 일지를 읽을 때 혼동하지 않도록, 수정이 큰 편은 상단에 '이 글은 ○차 실험 기준' 한 줄을 넣습니다. 숫자만 바뀐 경우에는 updatedAt만 갱신하고 본문은 그대로 두는 편입니다.</p>"
  },
  "sharing-failed-bread": {
    "feedback-log": "<p>9차 겨울 재현 때도 가족 시식은 속 식감 위주였습니다. 겉 건조는 제 메모에만 남기고, 질문은 '맛있어?' 대신 '속이 더 빵빵해?'로 바꿨습니다. 실험 목적이 겉 처리가 아니었기 때문입니다.</p>"
  },
  "quit-job-weekly-routine": {
    "intro": "<p>의욕이 클수록 표를 크게 짜기 쉽습니다. 저는 오히려 표를 줄일 때 루틴이 오래 갔습니다.</p>",
    "minimum-three": "<p>학원 개강 전에는 실기 장소가 없어 필기 비중을 올렸습니다. 반죽 없는 주에도 '필기 45분 + 도구 손익 10분'만 넣어 손을 완전히 끊지 않았습니다. 개강 후 첫 주는 반죽 1배치만 고정하고 품목 수는 늘리지 않았습니다.</p>",
    "broken-day": "<p>주간 점검은 일요일 저녁 10분이었습니다. 지난주 무너진 날 메모를 세 줄 읽고, 다음 주 '반드시 3개'에서 하나만 바꿉니다. 표 전체를 다시 그리지 않는 것이 이 칼럼의 핵심입니다.</p><p>가족 일정이 반복되면 그 요일을 '필기 전용'으로 바꿨습니다. 실기를 다른 요일로 옮기되, 주 3회 반죽 횟수는 유지하려 했습니다. 횟수보다 손이 끊기지 않는 것이 우선이었습니다.</p>",
    "restart": "<p>합격 직후에도 같은 규칙을 썼습니다. R&D를 시작할 때 주 5회 실험 표를 짜지 않고, 주 3회 반죽 + 메모 한 줄만 고정했습니다. 기능사 때 지켜진 최소 단위가 빵 연구에도 그대로 이어졌습니다.</p>"
  }
};

for (const col of columns) {
  const patches = PATCHES[col.slug];
  if (!patches) continue;
  for (const sec of col.sections) {
    const extra = patches[sec.id];
    if (!extra) continue;
    const key = extra.replace(/<[^>]+>/g, "").slice(0, 28);
    if (!sec.content.includes(key)) {
      sec.content = dedupeParagraphs(sec.content + extra);
    }
  }
}

let ok = true;
for (const col of columns) {
  const n = columnCharCount(col);
  console.log(`${col.slug}: ${n}`);
  if (n < MIN_CHARS) {
    console.error(`  FAIL (${MIN_CHARS - n}자 부족)`);
    ok = false;
  }
}

fs.writeFileSync(colsPath, `window.COLUMNS_DATA = ${JSON.stringify(columns, null, 2)};\n`);
process.exit(ok ? 0 : 1);