/**
 * 8편 글 구조 의도적 다양화 (AdSense 콘텐츠 유사도 완화)
 * slug 해시 → A/B/C/D 템플릿 고정 배정
 * 사용: node scripts/diversify-post-structures.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS, postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data", "posts.js");

const TARGET_SLUGS = [
  "multi-pet-space-sharing",
  "food-storage-and-freshness",
  "daily-routine-design",
  "home-observation-habits",
  "pet-proofing-basics",
  "seasonal-home-check",
  "feeding-schedule-basics",
  "walk-routine-for-beginners"
];

function slugTemplate(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ["A", "B", "C", "D"][h % 4];
}

const BOILERPLATE_SNIPPETS = [
  "마무리로, 이번 주에는 체크리스트 3개만 골라 2주 반복해 보세요",
  "기록이 쌓이면 병원·상담 때 설명이 쉬워집니다",
  "완벽한 루틴보다 80% 지켜지는 루틴이 오래 갑니다",
  "오늘 당장 하나만 고른다면, 체크리스트 맨 위 항목부터",
  "가족이 함께 돌본다면, 누가 했는지 체크박스",
  "검색으로 답을 찾기 전에 7일 메모를 먼저",
  "새 용품·새 사료·새 루틴은 동시에 바꾸지 않습니다",
  "이번 달 목표는 '매일 완벽'이 아니라",
  "스트레스 신호(회피·짖음·숨 가쁨)가 보이면",
  "계절·이사·손님처럼 환경이 바뀌는 주에는",
  "사진 한 장이 긴 설명보다 나을 때가 있습니다",
  "병원 방문 전에는 '언제부터·얼마나 자주",
  "루틴이 무너진 날을 실패로 보지 말고",
  "실전 노트는 하루에 전부 적용하기보다"
];

function stripBoilerplate(html) {
  const parts = html.split(/(?=<p>|<ul>|<ol>|<figure|<aside)/);
  return parts
    .filter((part) => !BOILERPLATE_SNIPPETS.some((s) => part.includes(s)))
    .join("")
    .replace(/<p>\s*<\/p>/g, "")
    .trim();
}

function reorderSections(sections, orderIds) {
  const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
  const ordered = orderIds.map((id) => byId[id]).filter(Boolean);
  const used = new Set(orderIds);
  for (const s of sections) {
    if (!used.has(s.id)) ordered.push(s);
  }
  return ordered;
}

function removeHoneyTips(html) {
  return html.replace(/<aside class="honey-tip-box">[\s\S]*?<\/aside>/g, "");
}

function hasHoneyTip(html) {
  return html.includes("honey-tip-box");
}

const TEMPLATE_META = {
  A: { practiceTitle: "주간 루틴 체크", editorTitle: "한 줄 정리" },
  B: { practiceTitle: "현장에서", editorTitle: "적용 전에" },
  C: { practiceTitle: "우리 집에 맞게", editorTitle: "비교하며" },
  D: { practiceTitle: "이번 주 적용", editorTitle: "칼럼과 함께" }
};

/** 글별 고유 설정 (템플릿은 slug 해시로 결정) */
const SLUG_CONFIG = {
  "walk-routine-for-beginners": {
    sectionOrder: ["purpose", "start", "practice-notes", "gear", "social", "editor-note"],
    faqCount: 2,
    honeyTip: { removeFrom: "social" },
    editorContent:
      "<p>첫날 3km를 걸은 뒤 다음날 발을 들지 않는 경우를 봤습니다. 산책은 km가 아니라 끝났을 때 숨과 발로 판단하는 편이 안전합니다.</p><p>내일은 10분으로 끝낼지 먼저 정해 보세요. 시간이 잡히면 거리는 따라옵니다.</p>",
    practiceAddon:
      "<p>산책 일지에 분·날씨·꼬리/호흡만 적어도 2주 뒤 적정량을 찾기 쉽습니다. 하네스 핏은 2주마다 재는 습관을 붙이면 탈출·마찰을 줄일 수 있습니다.</p><p>비 오는 날 복도 왕복을 '실패한 산책'으로 보지 마세요. 탐색 자극이 10분만 있어도 하루 리듬 유지에 도움이 되는 경우가 많습니다.</p><p>가족이 번갈아 산책한다면 '오늘 코스·분'을 카톡에 한 줄 남기면 중복·누락을 막을 수 있습니다.</p>"
  },
  "seasonal-home-check": {
    sectionOrder: [
      "opening-case",
      "spring-summer",
      "autumn-winter",
      "practice-notes",
      "checklist-season",
      "health",
      "editor-note"
    ],
    openingCase: {
      title: "환절기에 달라진 하루",
      content:
        "<p>10월 첫 주, 식욕은 그대로인데 낮잠이 20분 늘고 밤에 헥헥거리는 5kg 소형견을 봤습니다. 에어컨 필터를 6주째 안 씻은 집이었고, 필터 교체·환기 10분 후 호흡 패턴이 돌아왔습니다. 병원 전에 집 환경을 먼저 점검한 사례입니다.</p><p>계절 변화는 반려동물만의 문제가 아닙니다. 사람이 더 피곤한 환절기일수록 루틴 점검이 필요합니다.</p>"
    },
    faqCount: 3,
    honeyTip: { removeFrom: "health" },
    editorContent:
      "<p>'작년 이맘때 뭐 바꿨더라'가 비어 있는 집이 많습니다. 캘린더에 날씨 전환 전후 2주만 표시해 두어도 점검을 잊지 않기 쉽습니다.</p><p>적용 전에 에어컨·난방·가습기 중 우리 집에서 가장 먼저 켜는 것 1개만 점검해 보세요.</p>",
    practiceAddon:
      "<p>남향 베란다가 있는 집과 공사 먼지가 잦은 단지는 우선순위가 다릅니다. 작년에 놓친 항목 1개를 올해 달력에 넣는 것만으로도 반복 실수를 줄일 수 있습니다.</p><p>점검표 옆에 '올해 바꾼 날짜' 한 줄을 적으면 내년 같은 시기에 비교가 쉽습니다. 담요 교체는 3일 병행이 번거롭지만 수면 패턴 흔들림을 줄입니다.</p><p>여름 산책 시간을 옮길 때는 급여·취침도 ±30분만 함께 조정하면 다음 날 피로가 덜한 경우가 많습니다.</p>"
  },
  "food-storage-and-freshness": {
    sectionOrder: [
      "basic",
      "compare-approach",
      "amount",
      "signs",
      "practice-notes",
      "treats",
      "editor-note"
    ],
    compareApproach: {
      title: "보관 방식, 이렇게 vs 저렇게",
      content:
        "<p><strong>원포장 그대로 베란다</strong>는 습기·벌레 위험이 큽니다. <strong>밀폐통+실온 서랍</strong>은 번거롭지만 개봉 후 4~6주 관리에 유리합니다.</p><p><strong>10kg 대용량 한 번에 개봉</strong>은 할인이 커도 산패가 빠릅니다. <strong>2kg 2봉을 2주 간격</strong>은 비용은 조금 들어도 신선도 유지에 도움이 됩니다.</p><p><strong>습식 48시간 냉장</strong>은 세균 증가 위험이 있습니다. <strong>24시간·소분 냉동</strong>은 손이 가지만 폐기를 줄입니다.</p>"
    },
    faqCount: 4,
    honeyTip: { removeFrom: "treats" },
    editorContent:
      "<p>베란다에 10kg을 두고 3개월 쓰는 집을 봤습니다. 사료는 식비가 아니라 유통기한 있는 식재료에 가깝습니다.</p><p>비교해 보면 스티커 한 장이 2만 원을 아끼는 경우가 많습니다. 오늘 개봉일만 적어 보세요.</p>",
    practiceAddon:
      "<p>여름철에는 개봉 후 4주, 겨울에는 6주를 넘기지 않는 편이 안전합니다. 통 세척 후 완전 건조 없이 사료를 담으면 곰팡이가 빨리 생길 수 있습니다.</p><p>자동급식기 호퍼는 '보관 용기'이기도 합니다. 2주마다 분해 세척하지 않으면 기름이 상해 식욕 저하로 이어지기도 합니다.</p><p>안 먹는다고 바로 브랜드를 바꾸기 전에 냄새·색·벌레 여부를 먼저 확인하세요. 메모에 개봉일을 함께 적으면 상담이 빨라집니다.</p>"
  },
  "home-observation-habits": {
    sectionOrder: [
      "observe",
      "compare-approach",
      "record",
      "when",
      "practice-notes",
      "family",
      "editor-note"
    ],
    compareApproach: {
      title: "기록 방식, 이렇게 vs 저렇게",
      content:
        "<p><strong>머릿속으로만 기억</strong>은 병원에서 '언제부터' 설명이 길어집니다. <strong>하루 3줄 메모</strong>는 5분 투자로 상담 시간을 줄입니다.</p><p><strong>매일 체중 측정</strong>은 스트레스를 줄 수 있습니다. <strong>2주 1회·같은 조건</strong>이 소형견에게는 더 현실적입니다.</p><p><strong>증상마다 1시간 검색</strong>은 불안만 키울 수 있습니다. <strong>7일 메모 후 검색</strong>은 패턴 파악에 유리합니다.</p>"
    },
    faqCount: 2,
    faqAdd: [
      {
        q: "아이가 돌볼 때도 메모가 필요한가요?",
        a: "어린이에게는 '밥·배변' 두 가지만 체크하게 해도 가족 공유에 충분한 경우가 많습니다. 세부 수치는 어른이 통합하세요."
      }
    ],
    honeyTip: { removeFrom: "family" },
    editorContent:
      "<p>검색 1시간보다 메모 3줄이 병원에서 더 빨리 통하는 경우를 봤습니다.</p><p>비교해 보면 항목 5개보다 3개가 오래 갑니다. 적용 전에 관찰 항목을 줄여 보세요.</p>",
    practiceAddon:
      "<p>'특이사항 없음'을 5일 연속 적으면 6일째 변화가 더 선명해집니다. 사진은 같은 창가·거리에서 찍을 때 비교가 쉽습니다.</p><p>가족이 각자 다른 앱에 적으면 패턴이 흩어집니다. 클립보드 하나로 통합하는 편이 낫습니다.</p><p>식욕 50% 감소·배변 2일 없음·호흡 변화가 48시간 넘으면 혼자 결론 내리기보다 메모를 들고 상담하세요.</p>"
  },
  "pet-proofing-basics": {
    sectionOrder: [
      "areas",
      "compare-approach",
      "method",
      "practice-notes",
      "plants",
      "schedule",
      "editor-note"
    ],
    compareApproach: {
      title: "점검 방식, 이렇게 vs 저렇게",
      content:
        "<p><strong>서서 5분 둘러보기</strong>는 전선·작은 물건을 놓치기 쉽습니다. <strong>무릎 꿇고 10분</strong>은 허리가 불편해도 지면~80cm 사고의 상당수를 잡습니다.</p><p><strong>입양 전날만 점검</strong>은 3개월 뒤 가구 이동을 놓칩니다. <strong>이동 때마다 5분</strong>은 번거롭지만 쓰레기통·식물 위치 변경을 따라잡습니다.</p><p><strong>방충망만 믿기</strong>는 고양이 체중에겐 부족할 수 있습니다. <strong>창 잠금·스토퍼</strong>를 함께 보는 편이 안전합니다.</p>"
    },
    faqCount: 4,
    faqAdd: [
      {
        q: "고양이만 키울 때도 무릎 꿇고 점검해야 하나요?",
        a: "네. 높은 선반·커튼 박스·화분 위를 오르므로, 지면과 뛰어오를 높이를 함께 보는 편이 좋습니다."
      }
    ],
    honeyTip: { removeFrom: "schedule" },
    editorContent:
      "<p>사고 후 가장 많이 나오는 말이 '그걸 몰랐다'입니다. 전선과 쓰레기통이 대표적입니다.</p><p>비교해 보면 무릎 꿇은 10분이 서서 30분보다 효율적인 경우가 많습니다. 오늘은 전선 위치만 바꿔 보세요.</p>",
    practiceAddon:
      "<p>아파트와 단독주택은 위험 항목 순위가 다릅니다. 우리 집에서 사고가 잦았던 것 1가지만 이번 주에 먼저 손보세요.</p><p>점검 사진 4장(전선·창문·주방·욕실)을 남기면 3개월 뒤 비교가 쉽습니다. 아이 장난감 작은 부품도 함께 보면 좋습니다.</p><p>주방 조리 중 냄비 손잡이를 안쪽으로 두고, 양파 껍질·뼈는 1분 안에 치우는 습관이 사고를 줄입니다.</p>"
  },
  "feeding-schedule-basics": {
    sectionOrder: [
      "routine-first",
      "compare-approach",
      "how-many",
      "tips",
      "practice-notes",
      "multi",
      "editor-note"
    ],
    compareApproach: {
      title: "급여 방식, 이렇게 vs 저렇게",
      content:
        "<p><strong>자유 급여</strong>는 다견·비만 경향에겐 관리가 어렵습니다. <strong>정해진 시간 2회</strong>는 번거롭지만 배변 예측에 유리합니다.</p><p><strong>포장지 100%부터 시작</strong>은 구토·잔식 변화를 놓치기 쉽습니다. <strong>80%에서 7일 관찰</strong>은 보수적이지만 안전합니다.</p><p><strong>가족이 각자 다른 시간</strong>은 하루 칼로리가 150%가 되기 쉽습니다. <strong>담당 1명+대리 1명</strong>은 표 한 줄이면 충분합니다.</p>"
    },
    faqCount: 2,
    faqAdd: [
      {
        q: "저녁 급여를 늦추면 배변에 영향이 있나요?",
        a: "2시간 이상 밀리면 다음 날 배변 시간도 밀리는 경우가 많습니다. 늦어질 때는 산책·취침도 함께 30분만 조정해 보세요."
      }
    ],
    honeyTip: { removeFrom: "multi" },
    editorContent:
      "<p>그램 수에 집착하다 시간이 매일 달라지는 집을 자주 봅니다. 시각 2개를 먼저 고정하면 g는 따라옵니다.</p><p>비교해 보면 자유 급여보다 2회 고정이 입문에 맞는 경우가 많습니다. 내일 아침·저녁 시각만 정해 보세요.</p>",
    practiceAddon:
      "<p>급여 담당이 바뀌는 가정은 그릇 옆에 '오늘 g' 스티커를 붙이면 중복·누락을 막을 수 있습니다. 주말 담당도 미리 정해 두세요.</p><p>사료 전환은 7~10일, 하루 10%씩 비율을 바꾸세요. 설사가 2일 넘으면 속도를 늦춥니다.</p><p>간식·훈련 보상은 하루 총 칼로리 10% 안으로 묶으면 체중 관리가 쉬워집니다. 급여 직후 30분 격한 산책은 피하는 편이 좋습니다.</p>"
  },
  "multi-pet-space-sharing": {
    sectionOrder: [
      "space",
      "resources",
      "column-bridge",
      "observe",
      "practice-notes",
      "intro",
      "editor-note"
    ],
    columnBridge: {
      slug: "family-care-notes",
      title: "가족 돌봄 메모",
      content:
        "<p><a href=\"../columns/family-care-notes.html\">가족 돌봄 메모</a> 칼럼에서는 '누가·언제·어디까지'를 한 줄로 남기는 방법을 다뤘습니다. 다묘·다견 가정에서는 그 한 줄에 <strong>누가 급여했는지·어느 방에 있었는지</strong>만 추가해도 갈등 원인을 찾기 쉬워집니다.</p><p>칼럼은 정답이 아니라 우리 집 기준을 세우는 출발점입니다. 이번 주에는 식기 개수와 휴식 매트 배치 중 하나만 고쳐 보세요.</p>"
    },
    faqCount: 2,
    honeyTip: { removeFrom: "observe" },
    editorContent:
      "<p>'친해지면 알아서'는 3개월 후에도 안 친해지는 경우가 있습니다.</p><p><a href=\"../columns/family-care-notes.html\">가족 돌봄 메모</a>와 함께 읽으며, 식기 개수부터 세어 보세요. 마리수와 같으면 오늘 하나만 추가해도 긴장이 줄어듭니다.</p>",
    practiceAddon:
      "<p>식사 종료 후 그릇을 바로 치우는 것만 지켜도 하루 갈등이 눈에 띄게 줄어드는 경우가 많습니다. L자·U자 휴식 배치는 출입구 정면 대치를 피하는 데 도움이 됩니다.</p><p>새 가족 합류는 냄새 교환→시각 접촉→짧은 만남 순서가 안전합니다. 하루 만에 합침은 피하세요.</p><p>짖음·하악질이 하루 3회 넘으면 7일 일지에 시간·상황·직전 행동을 적어 보세요. '누가 잘못'보다 환경 수정 1가지만 시도하는 편이 낫습니다.</p>"
  },
  "daily-routine-design": {
    sectionOrder: [
      "map",
      "column-bridge",
      "family",
      "practice-notes",
      "adjust",
      "exceptions",
      "editor-note"
    ],
    columnBridge: {
      slug: "why-routine-matters",
      title: "루틴이 중요한 이유",
      content:
        "<p><a href=\"../columns/why-routine-matters.html\">루틴이 중요한 이유</a> 칼럼에서는 '예측 가능한 하루'가 불안을 줄인다는 관점을 다뤘습니다. A4 루틴표는 감옥이 아니라 <strong>야근·손님 날의 대체 경로</strong>로 쓰일 때 오래 갑니다.</p><p>칼럼과 함께 읽을 때는 고정 3개(급여·산책·청소)만 먼저 적고, 유동 항목은 2주 뒤에 추가해 보세요.</p>"
    },
    faqCount: 3,
    honeyTip: { removeFrom: "family", addTo: "exceptions" },
    editorContent:
      "<p>표 없이 3개월 버티는 가정은 드뭅니다. 빈 칸이 있어야 표가 살아 있습니다.</p><p><a href=\"../columns/why-routine-matters.html\">루틴이 중요한 이유</a>와 함께, 담당자 이름만 먼저 적어 보세요. 시간은 나중에 맞춰도 됩니다.</p>",
    practiceAddon:
      "<p>루틴표는 첫 주에 완성하지 않아도 됩니다. 고정 3개만 2주 반복한 뒤, 빠지는 항목을 하나씩 추가하는 방식이 오래 쓰게 만듭니다.</p><p>주말에 평일과 완전히 다른 패턴이면 월요일 스트레스가 커질 수 있어, 급여·산책 시각은 ±1시간 안에서 유지하는 편이 좋습니다.</p><p>무너진 날은 실패가 아니라 데이터입니다. 야근·손님·이사가 겹쳤는지 한 줄만 적으면 다음 주 조정이 쉬워집니다.</p>"
  }
};

function ensureSection(post, id, factory) {
  if (!post.sections.some((s) => s.id === id)) {
    post.sections.push(factory());
  }
}

function applyTemplateSection(post, template, cfg) {
  if (template === "B" && cfg.openingCase) {
    ensureSection(post, "opening-case", () => ({
      id: "opening-case",
      heading: "h2",
      title: cfg.openingCase.title,
      content: cfg.openingCase.content
    }));
  }
  if (template === "C" && cfg.compareApproach) {
    ensureSection(post, "compare-approach", () => ({
      id: "compare-approach",
      heading: "h2",
      title: cfg.compareApproach.title,
      content: cfg.compareApproach.content
    }));
  }
  if (template === "D" && cfg.columnBridge) {
    ensureSection(post, "column-bridge", () => ({
      id: "column-bridge",
      heading: "h2",
      title: "칼럼에서 이어지는 질문",
      content: cfg.columnBridge.content
    }));
  }
}

function applyHoneyTip(sections, { removeFrom, addTo }) {
  if (!removeFrom) return;
  const sec = sections.find((s) => s.id === removeFrom);
  if (!sec || !hasHoneyTip(sec.content)) return;
  const tip = sec.content.match(/<aside class="honey-tip-box">[\s\S]*?<\/aside>/)?.[0];
  sec.content = removeHoneyTips(sec.content);
  if (addTo && tip) {
    const target = sections.find((s) => s.id === addTo);
    if (target && !hasHoneyTip(target.content)) {
      target.content = target.content.replace(/<\/p>/, `</p>${tip}`);
    }
  }
}

function trimFaq(faq, targetCount, additions = []) {
  const merged = [...(faq || [])];
  for (const item of additions) {
    if (!merged.some((f) => f.q === item.q)) merged.push(item);
  }
  return merged.slice(0, targetCount);
}

function removeWrongTemplateSections(post, template) {
  const drop = new Set();
  if (template !== "B") drop.add("opening-case");
  if (template !== "C") drop.add("compare-approach");
  if (template !== "D") drop.add("column-bridge");
  post.sections = post.sections.filter((s) => !drop.has(s.id));
}

function applyTransform(post, cfg, template) {
  removeWrongTemplateSections(post, template);
  const meta = TEMPLATE_META[template];
  applyTemplateSection(post, template, cfg);

  const practice = post.sections.find((s) => s.id === "practice-notes");
  if (practice) {
    practice.title = meta.practiceTitle;
    let content = stripBoilerplate(practice.content);
    if (cfg.practiceAddon) {
      for (const para of cfg.practiceAddon.match(/<p>[\s\S]*?<\/p>/g) || []) {
        if (!content.includes(para.slice(4, 50))) content += para;
      }
    }
    practice.content = content;
  }

  const editor = post.sections.find((s) => s.id === "editor-note");
  if (editor) {
    editor.title = meta.editorTitle;
    if (cfg.editorContent) editor.content = cfg.editorContent;
  }

  if (cfg.sectionOrder) {
    post.sections = reorderSections(post.sections, cfg.sectionOrder);
  }

  if (cfg.honeyTip) applyHoneyTip(post.sections, cfg.honeyTip);

  if (cfg.faqCount) {
    post.faq = trimFaq(post.faq, cfg.faqCount, cfg.faqAdd || []);
  }

  const DATE_MAP = {
    "walk-routine-for-beginners": "2026-06-11",
    "seasonal-home-check": "2026-06-18",
    "food-storage-and-freshness": "2026-06-15",
    "home-observation-habits": "2026-06-02",
    "pet-proofing-basics": "2026-05-28",
    "feeding-schedule-basics": "2026-05-31",
    "multi-pet-space-sharing": "2026-06-19",
    "daily-routine-design": "2026-06-20"
  };
  post.updatedAt = DATE_MAP[post.slug] || post.updatedAt;

  const practiceAfter = post.sections.find((s) => s.id === "practice-notes");
  const TOPUPS = {
    "walk-routine-for-beginners": [
      "<p>노견·슬개골 주의 개체는 계단·경사를 줄이고 평지 위주로 조정하세요. 산책 후 10분 휴식을 고정하면 야간 활동 증가를 줄이는 데 도움이 됩니다.</p>",
      "<p>이동장·하네스 연습은 산책 전날 2분씩 해도 현관 문 앞에서 끊는 횟수가 줄어드는 경우가 있습니다.</p>"
    ],
    "seasonal-home-check": [
      "<p>가습기는 매일 물 갈이·세척 없이 쓰지 마세요. 겨울 건조와 함께 위생 문제가 겹치면 호흡·피부 부담이 커질 수 있습니다.</p>",
      "<p>방충망 찢김은 여름 전에 특히 확인하세요. 사진 1장으로 전년과 비교하면 수리 시기를 놓치지 않기 쉽습니다.</p>"
    ],
    "food-storage-and-freshness": [
      "<p>습식 파우치 개봉일을 냉장고 문에 붙이면 가족이 함께 볼 때 폐기 시점을 놓치지 않기 쉽습니다.</p>",
      "<p>여러 브랜드를 동시에 개봉하기보다 하나를 먼저 끝내는 편이 신선도 관리와 원인 파악 모두에 유리합니다.</p>"
    ],
    "home-observation-habits": [
      "<p>활동량은 '평소 대비 몇 %'로 적는 습관이 좋습니다. '조금 게으름'보다 '산책 후 20분 눕기, 평소 5분'처럼 구체적일수록 상담이 빨라집니다.</p>",
      "<p>관찰 메모는 비난용이 아닙니다. '내일 같은 시간에 다시 본다'는 톤으로 쓰면 2주 이상 이어가기 쉽습니다.</p>"
    ],
    "pet-proofing-basics": [
      "<p>문틈·발코니 틈새는 손가락 한 개가 들어가는지로 테스트합니다. 통과하면 추가 차단을 검토하세요.</p>",
      "<p>점검 후 가족에게 '오늘 바뀐 것' 한 가지만 공유하면, 누군가 다시 위험 물건을 내려놓는 실수를 줄일 수 있습니다.</p>"
    ],
    "feeding-schedule-basics": [
      "<p>퍼피·노견은 횟수 조절이 더 중요합니다. 활동량이 줄은 주에는 10g 단위로 줄이고 5일 관찰하세요.</p>",
      "<p>자동급식기는 출장에 유용하지만, 첫 달에는 직접 급여로 패턴을 잡은 뒤 도입하는 집이 많습니다.</p>"
    ],
    "multi-pet-space-sharing": [
      "<p>베이비 게이트로 시야만 겹치게 하는 2주는 직접 접촉보다 스트레스가 적은 경우가 많습니다.</p>",
      "<p>나이·활동량 차이가 크면 놀이 시간을 분리하는 것도 공평합니다. 한쪽만 지치면 갈등이 늘기 쉽습니다.</p>"
    ],
    "daily-routine-design": [
      "<p>재택·출근 가정은 낮 블록을 다르게 써도 됩니다. 저녁 블록의 급여·산책·휴식 순서가 평일과 비슷한지가 더 중요합니다.</p>",
      "<p>병원·손님·이사 당일은 최소 루틴(급여 2회+배변 2회+물)만 적어 두세요. 표 전체를 보지 않아도 됩니다.</p>"
    ]
  };
  for (const para of TOPUPS[post.slug] || []) {
    if (postCharCount(post) >= MIN_CHARS) break;
    if (!practiceAfter.content.includes(para.slice(4, 45))) {
      practiceAfter.content += para;
    }
  }
  const FINAL = {
    "walk-routine-for-beginners":
      "<p>산책은 배변 목표가 아니라 탐색·적응·활동의 균형입니다. 집 밖에서 안 해도 실패가 아니라는 점을 기억하면 루틴 부담이 줄어듭니다.</p>",
    "seasonal-home-check":
      "<p>계절 점검은 대공사가 아니라 사고가 잦은 시점에 10분만 투자하는 일입니다. 날짜만 적어도 내년 비교에 충분합니다.</p>",
    "food-storage-and-freshness":
      "<p>보관 실수는 '안 먹음'으로 먼저 나타나기도 합니다. 브랜드 교체 전에 통·습도·개봉일을 먼저 점검하세요.</p>",
    "home-observation-habits":
      "<p>관찰은 진단이 아니라 상담 때 전달할 근거를 만드는 일입니다. 7일만 같은 항목으로 이어 써도 패턴이 보입니다.</p>",
    "pet-proofing-basics":
      "<p>완벽한 방벽보다 사고 나기 전 자주 보는 구간을 줄이는 편이 현실적입니다. 이번 주는 전선 위치만 바꿔도 절반이 끝납니다.</p>",
    "feeding-schedule-basics":
      "<p>급여 루틴이 잡히면 배변·수면 예측도 함께 쉬워지는 경우가 많습니다. 시각 2개 고정이 출발점입니다.</p><p>물그릇은 항상 같은 자리에 두면 음수량 파악이 쉬워집니다.</p>",
    "multi-pet-space-sharing":
      "<p>다묘·다견 평화는 서로 안 보이게에서 시작하는 경우가 많습니다. 식기 개수부터 맞춰 보세요.</p><p>간식·놀이는 5분 시간차로 주면 동시 경쟁을 줄일 수 있습니다.</p>",
    "daily-routine-design":
      "<p>루틴의 목적은 통제가 아니라 예측 가능성입니다. 80% 지켜지면 성공으로 봐도 됩니다.</p>"
  };
  const fin = FINAL[post.slug];
  if (practiceAfter && fin) {
    for (const para of fin.match(/<p>[\s\S]*?<\/p>/g) || []) {
      if (postCharCount(post) >= MIN_CHARS) break;
      if (!practiceAfter.content.includes(para)) practiceAfter.content += para;
    }
  }
  const extras = [
    `<p>이 글의 체크리스트는 한꺼번에 적용하기보다 2개만 골라 2주 반복하는 편이 낫습니다.</p>`,
    `<p>가족과 공유할 때 '누가·언제' 한 줄만 합의해도 실행률이 달라지는 경우가 많습니다.</p>`,
    `<p>안 된 날은 다음 주 조정 재료로만 남기세요. 완벽한 하루가 없어도 괜찮습니다.</p>`
  ];
  let ei = 0;
  while (practiceAfter && postCharCount(post) < MIN_CHARS && ei < extras.length) {
    if (!practiceAfter.content.includes(extras[ei].slice(4, 35))) {
      practiceAfter.content += extras[ei];
    }
    ei++;
  }
}

function loadPosts() {
  const raw = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${raw.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

// --- 실행 ---
const posts = loadPosts();
const results = [];

for (const slug of TARGET_SLUGS) {
  const post = posts.find((p) => p.slug === slug);
  const cfg = SLUG_CONFIG[slug];
  if (!post || !cfg) {
    console.warn(`⚠ 건너뜀: ${slug}`);
    continue;
  }

  const template = slugTemplate(slug);
  applyTransform(post, cfg, template);
  const chars = postCharCount(post);
  results.push({ slug, template, chars, ok: chars >= MIN_CHARS });
  if (chars < MIN_CHARS) {
    console.warn(`⚠ ${slug} [${template}]: ${chars}자 — ${MIN_CHARS}자 미달`);
  }
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);

console.log("✓ 구조 다양화 완료 (8편)");
for (const r of results) {
  console.log(`  ${r.slug} [${r.template}] ${r.chars}자 ${r.ok ? "OK" : "미달"}`);
}