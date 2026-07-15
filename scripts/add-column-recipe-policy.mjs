/**
 * 칼럼 4편 — 완성 레시피를 올리지 않는 이유
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { columnCharCount } from "./column-char-count.mjs";
import { MIN_CHARS } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const columnsPath = path.join(ROOT, "data/columns.js");

const columns = Function(
  `return (${fs.readFileSync(columnsPath, "utf8").replace("window.COLUMNS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const NEW_COL = {
  slug: "why-no-complete-recipe",
  title: "완성 레시피를 올리지 않는 이유",
  subtitle: "그램 표 대신 판단 기준을 쓰는 편집 원칙",
  author: "정지석",
  publishedAt: "2026-07-08",
  updatedAt: "2026-07-08",
  status: "published",
  excerpt:
    "밤식빵 R&D와 기능사 글에서 완성 레시피·그램 표를 의도적으로 넣지 않습니다. 제 오븐·반죽량 기준을 그대로 옮기면 어긋날 수 있어서이며, 대신 일지에서 검증된 순서와 판단 기준을 남기기 위함입니다.",
  perspective:
    "레시피 한 장이 없으면 아쉽다고 느끼는 분도 있습니다. 저도 처음엔 '그램만 주면 되지 않나'라고 생각했지만, 집 오븐으로 옮기면서 숫자만으로는 부족하다는 걸 반복해서 겪었습니다.",
  sections: [
    {
      id: "reader-question",
      heading: "h2",
      title: "자주 받는 질문",
      content:
        '<p>문의·댓글에서 가장 많이 오는 말이 "그램 표·완성 레시피는 언제 올리나요?"입니다. <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>를 올린 뒤에도 같은 질문이 이어졌고, 그게 이상하지 않다고 봅니다.</p><p>이 칼럼은 변명이 아니라 <strong>편집 원칙</strong>을 설명합니다. 레시피를 안 올린다는 뜻이 정보를 숨긴다는 뜻은 아닙니다.</p><p>기능사 시험용 레시피는 학원·교재에 있었지만, 집에서 "추억의 밤식빵"으로 옮기는 일은 별개였습니다. 후자는 아직 실험 중이라 확정 표가 없습니다.</p>'
    },
    {
      id: "oven-gap",
      heading: "h2",
      title: "같은 숫자, 다른 결과",
      content:
        '<p>기능사 학원 오븐과 집 오븐은 같은 200°C라도 색·시간이 달랐습니다. <a href="../posts/baker-cert-practical-mistakes.html">실기 실수</a> 글에 적었듯, 메모에 "학원 200 = 집 190"이라고 적기 전까지는 집에서만 망한다고 느꼈습니다.</p><p>밤식빵 R&D도 마찬가지입니다. 반죽량·팬 크기·밀가루 브랜드가 다르면 수분 +2%p의 의미가 달라집니다. 제 그램을 그대로 복사하면 <strong>변수는 맞는데 결과만 어긋나는</strong> 상황이 납니다.</p>'
    },
    {
      id: "what-instead",
      heading: "h2",
      title: "대신 무엇을 주나",
      content:
        '<p>일지에서는 <strong>바꾼 변수 하나</strong>, 실패 세 가지, 다음 날 기록을 남깁니다. <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>에서는 7가지 원칙·고정값 초안·메모 양식을 모았습니다. "이 순서로 하나씩 맞춰 보세요"가 레시피 한 장을 대신하는 역할입니다.</p><p>기능사 쪽도 <a href="../posts/baker-cert-one-page-cheatsheet.html">한 장 요약</a>으로 시험 구조·루틴·당일 체크리스트를 줍니다. 합격 보장 레시피가 아니라, 제가 걸었던 순서입니다.</p>'
    },
    {
      id: "when-grams",
      heading: "h2",
      title: "그램을 적는 경우",
      content:
        '<p>그램을 전혀 안 쓰는 것은 아닙니다. 일지 본문에 "8차 55분 → 9차 58분"처럼 <strong>비교에 필요한 숫자</strong>는 남깁니다. 다만 "누구나 그대로 따라 하면 같은 빵"이라고 말할 수 있는 확정 레시피 표는 아직 없습니다.</p><p>10차 이후 보관·습도 변수가 정리되면, 실전 정리의 고정값 초안을 다시 검토할 예정입니다. 그때도 "제 환경 기준"임을 분명히 적을 것입니다.</p><p>기능사 준비 때도 교재 그램을 그대로 외우기보다, 학원·집 오븐 차이를 메모에 붙이는 편이 합격에 가까웠습니다. 블로그도 같은 방식입니다.</p>'
    },
    {
      id: "reader-path",
      heading: "h2",
      title: "레시피를 원할 때 읽는 순서",
      content:
        '<p>완성 레시피를 찾으신다면 다른 블로그·도서가 더 적합할 수 있습니다. 이 사이트는 <strong>제 실험 순서</strong>를 따라가고 싶은 분께 맞춰져 있습니다. <a href="../posts/bread-rd-series-guide.html">R&D 안내</a> → <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a> → 필요한 차수 일지 순으로 읽으면 판단 기준을 먼저 잡을 수 있습니다.</p><p>기능사는 <a href="../posts/baker-cert-series-roadmap.html">시리즈 안내</a> 또는 <a href="../posts/baker-cert-one-page-cheatsheet.html">한 장 요약</a>부터 시작하시면 됩니다.</p>'
    },
    {
      id: "photos",
      heading: "h2",
      title: "사진에 대해",
      content:
        '<p>글 속 빵 사진은 비교용으로 직접 구운 것을 우선합니다. 섹션 분위기용 이미지는 Pexels·Unsplash·Flickr(CC)를 쓰며, 캡션에 출처를 표시합니다. 레시피가 없다고 해서 실험을 하지 않는다는 뜻은 아닙니다.</p><p>앞으로 단면·토핑·다음 날 비교 사진 비중을 늘리려 합니다. 숫자 없이도 "이 정도 눌림·이 정도 색"을 보여 주는 편이 재현에 도움이 된다고 봅니다.</p><p>직접 구운 빵 사진은 일지 메모와 같은 날짜로 묶어 둡니다. 스톡 이미지와 혼동되지 않게, 본문에서 실험일을 먼저 적는 이유도 같습니다.</p>'
    },
    {
      id: "editor-closing",
      heading: "h2",
      title: "정리하며",
      content:
        '<p>완성 레시피를 원하시는 분께는 아쉬움을 남길 수 있습니다. 다만 이 사이트의 약속은 <strong>제가 실제로 바꿔 본 순서</strong>를 남기는 것입니다. 그램 표는 그 순서가 여러 환경에서 반복될 때 비로소 의미가 생긴다고 봅니다.</p><p>그 전까지는 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>의 7가지·메모 양식·고정값 초안을 시작점으로 쓰시면 됩니다.</p><p>편집 원칙이 바뀌면 이 칼럼도 수정일과 함께 고칩니다. 확정 레시피를 올릴 수 있는 단계가 오면, 그때는 "제 환경 기준"임을 분명히 적고 올리겠습니다.</p>'
    },
    {
      id: "related-posts",
      heading: "h2",
      title: "본문 글과 연결",
      content:
        '<p>밤식빵 판단 기준은 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>, 일지 순서는 <a href="../posts/bread-rd-series-guide.html">R&D 안내</a>를 참고하세요. 메모를 글로 옮기는 방법은 <a href="lab-notes-to-blog.html">이전 칼럼</a>에 있습니다.</p>'
    },
    {
      id: "mistakes",
      heading: "h2",
      title: "레시피만 찾을 때 놓치기 쉬운 것",
      content:
        '<p>그램 표만 있으면 발효·실내 온도·습도는 여전히 변수입니다. <a href="../posts/bread-rd-night-bread-v9.html">9차</a>처럼 같은 고정값도 겨울에 발효 분을 바꿔야 했습니다. 레시피 한 장으로는 이 차이가 안 보입니다.</p><p>보관도 마찬가지입니다. <a href="../posts/bread-rd-night-bread-v4.html">4차</a>에서 루즈 백과 개방 보관의 차이는 당일이 아니라 다음 날에야 드러났습니다. 표에 "보관 12시간"만 적어도, 루즈 백인지 접시인지에 따라 결과가 달라집니다.</p>'
    },
    {
      id: "feedback",
      heading: "h2",
      title: "문의로 알려 주시면 반영하는 것",
      content:
        '<p>다른 오븐·다른 밀가루로 같은 원칙을 시도해 보신 결과는 <a href="../contact/">문의</a>로 알려 주시면, 일지·정리 글의 FAQ나 주의 문구에 반영하겠습니다. "제 환경에서는 +2%p가 과했다" 같은 말도 기록 가치가 있습니다.</p><p>완성 레시피 요청도 받지만, 확인된 범위를 넘는 그램 표는 올리지 않습니다. 대신 어떤 변수부터 맞췄는지 순서를 같이 정리해 드리는 편이 이 사이트의 역할에 가깝습니다.</p>'
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "이번 주 적용하기",
      content:
        '<p>지금 쓰는 식빵 레시피가 있다면, 그램을 바꾸지 말고 <strong>한 가지 변수만</strong> 바꿔 보세요. 온도·발효·보관 중 하나만. 다음 날 아침 한 줄 메모를 추가하면 이 블로그 일지와 같은 형식이 됩니다.</p><p>메모 네 칸(목표·실패·원인·변수)을 채워 보세요. 한 달 뒤 그대로 글 초안이 됩니다. <a href="lab-notes-to-blog.html">실험 메모를 글로 옮기는 법</a> 칼럼과 함께 보면 발행일·실험일 구분도 잡히습니다.</p><p>변수 하나만 바꾸는 습관이 쌓이면, 나중에 그램을 조정할 때도 무엇이 효과인지 구분하기 쉬워집니다.</p>'
    }
  ],
  summary:
    "완성 레시피·그램 표 대신 판단 기준·순서·메모 양식을 제공하는 편집 원칙과, 그렇게 하는 이유(오븐·재료 차이)를 정리했습니다.",
  relatedSlugs: [
    "bread-rd-night-bread-practical-guide",
    "bread-rd-series-guide",
    "baker-cert-one-page-cheatsheet"
  ]
};

if (!columns.some((c) => c.slug === NEW_COL.slug)) {
  columns.push(NEW_COL);
  columns.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

const n = columnCharCount(NEW_COL);
if (n < MIN_CHARS) {
  console.error(`FAIL ${NEW_COL.slug}: ${n} (need ${MIN_CHARS})`);
  process.exit(1);
}

fs.writeFileSync(columnsPath, `window.COLUMNS_DATA = ${JSON.stringify(columns, null, 2)};\n`);
console.log(`OK column ${NEW_COL.slug}: ${n}, total ${columns.length}`);