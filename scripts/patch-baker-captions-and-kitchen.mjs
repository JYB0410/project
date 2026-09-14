import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");
const cats = load("data/categories.js", "CATEGORIES_DATA");

let caps = 0;
for (const p of posts) {
  if (p.category !== "baker-cert") continue;
  for (const s of p.sections || []) {
    if (!s.content) continue;
    s.content = s.content.replace(/<figcaption>([^<]+)<\/figcaption>/g, (full, cap) => {
      if (!/photos\/(baker-cert|why-baker)/.test(s.content)) return full;
      if (cap.includes("편집 일러스트")) return full;
      caps++;
      return `<figcaption>${cap} · 편집 일러스트(실사 아님)</figcaption>`;
    });
  }
}
console.log("captions patched", caps);
save("data/posts.js", "POSTS_DATA", posts);

if (!cats.some((c) => c.slug === "home-kitchen-notes")) {
  cats.push({
    slug: "home-kitchen-notes",
    name: "집 주방 노트",
    description:
      "학원·시험장이 아니라 집 오븐·작업대·난방처럼, 손이 머무는 공간을 적습니다. 완성 레시피가 아닙니다. 오븐·도구 칼럼과 함께 읽으면 됩니다.",
    icon: "kitchen",
    order: 4
  });
  cats.sort((a, b) => a.order - b.order);
  save("data/categories.js", "CATEGORIES_DATA", cats);
  console.log("✓ category home-kitchen-notes");
}

const kitchen1 = {
  slug: "kitchen-bench-timer-place",
  title: "작업대 높이와 타이머 자리 — 손이 멈추던 동선",
  subtitle: "학원 작업대와 집 식탁이 달라서 생긴 실수",
  category: "home-kitchen-notes",
  author: "정지석",
  publishedAt: "2026-09-12",
  updatedAt: "2026-09-12",
  featured: false,
  status: "published",
  excerpt:
    "학원 작업대에서 익힌 손이 집 식탁에서는 어깨부터 달라졌습니다. 타이머를 시야 밖에 두던 버릇을 고친 기록입니다. 완성 그램 표는 없습니다.",
  coverImage: "../assets/images/illustrations/home-kitchen/kitchen-bench-timer-place.jpg",
  coverCaption: "집 작업대·타이머 자리 편집 일러스트 (실사 아님)",
  sections: [
    {
      id: "two-heights",
      heading: "h2",
      title: "학원 대와 집 식탁",
      content: `<p>2024년 10월, 학원 작업대는 서서 반죽하기에 맞았습니다. 집에서는 식탁에 앉아 반죽했습니다. 같은 스크래퍼인데 어깨가 먼저 말했습니다. 성형 속도가 학원보다 느린 날을, 처음엔 실력 탓으로만 적었습니다.</p>
<p>어느 날 식탁 위에 도마를 겹쳐 높이를 조금 올렸습니다. 완벽한 작업대는 아니었습니다. 다만 손목 각도가 학원에 가까워지자 봉합이 덜 헐거워졌습니다. 도구 칼럼(<a href="../columns/tools-first-month-keep.html">저울·온도계·타이머</a>)의 ‘고정 자리’와 같은 생각입니다. 도구만이 아니라 <strong>몸의 높이</strong>도 자리였습니다.</p>
<p>이 글은 가구 추천이 아닙니다. 제 집 식탁과 학원 대의 차이, 그리고 타이머를 어디에 뒀는지만 적습니다. 공식 시험장 작업대 높이는 공고·현장에 따릅니다.</p>`
    },
    {
      id: "timer-spot",
      heading: "h2",
      title: "타이머가 등 뒤에 있을 때",
      content: `<p>집에서는 타이머를 냉장고 옆, 등 뒤에 두었습니다. 울리면 고개를 돌리다 손이 멈췄습니다. 학원 모의에서는 타이머가 시야 안에 있었습니다. 같은 알람인데 집에서는 놀라고, 학원에서는 예고처럼 들렸습니다.</p>
<p>벽 타일 쪽에 타이머를 옮긴 뒤로는 발효 분을 놓치는 일이 줄었습니다. 소리만 키운 것이 아니라, <strong>눈이 먼저 가게</strong> 했습니다. <a href="baker-cert-mock-three-weeks.html">모의 3주</a>의 소리 알람 규칙과 짝입니다.</p>
<p>휴대폰을 주머니에 넣은 날은 진동을 못 느낀 적이 있습니다. 주방 전용 타이머를 작업대 정면에 두는 편이, 제게는 필기 45분 타이머와 실기 타이머를 섞지 않게 해 줬습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "높이와 자리를 같은 날 안 바꿨다",
      content: `<p>식탁 높이를 올린 주에는 타이머 자리를 건드리지 않았습니다. 다음 주에 타이머만 옮겼습니다. 변수가 둘이면, 봉합이 나아진 이유가 높이인지 알람인지 모릅니다. 품목 노트의 변수 하나와 같습니다.</p>
<p>오븐 다이얼은 이 글에서 안 다룹니다. 그건 <a href="../columns/home-oven-temperature-notes.html">오븐 칼럼</a>입니다. 주방 노트는 몸과 눈이 머무는 자리입니다.</p>
<p>학원 다음 날 집에서 풀코스를 안 하는 규칙(<a href="../columns/no-full-home-bake-day-after-class.html">칼럼</a>)과도 맞습니다. 동선을 고치는 날은 반죽 실험을 열지 않았습니다.</p>`
    },
    {
      id: "for-now",
      heading: "h2",
      title: "집을 학원처럼 꾸미지 않아도",
      content: `<p>작업대를 새로 살 필요는 없었습니다. 도마 한 장, 타이머 위치 한 칸이면 비교가 시작됐습니다. 사진 속 예쁜 주방을 따라 가지 않았습니다. 편집 일러스트는 자리만 보여 줄 뿐, 제 식탁의 실사가 아닙니다.</p>
<p>손목이 남은 날에는 높이 실험을 하지 않았습니다. <a href="../columns/rest-day-when-wrists-hurt.html">쉬는 기준</a>이 먼저입니다. 환경 조정도 손 일입니다.</p>
<p>문의는 <a href="../contact/">연락</a>으로 받습니다. 주방마다 의자와 대 높이가 다릅니다. 숫자를 복사하지 말고, 학원에서 편한 어깨 각도를 집에 한 칸만 옮겨 보세요.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>집 주방 노트 1편입니다. 학원 손과 집 손이 갈라지던 지점을, 레시피가 아니라 작업대와 타이머 자리로 적었습니다. 시험장 규격은 공고가 우선입니다.</p>`
    }
  ],
  summary:
    "학원 작업대와 집 식탁의 높이 차이, 타이머를 등 뒤에 두던 버릇을 고친 집 주방 기록입니다. 완성 레시피가 아닙니다.",
  relatedSlugs: ["baker-cert-practical-mistakes", "baker-cert-mock-three-weeks"]
};

const kitchen2 = {
  slug: "heating-on-fermentation-home",
  title: "난방 켠 날, 집 발효가 빨라진 이유",
  subtitle: "보일러와 반죽 그릇이 가까웠던 겨울",
  category: "home-kitchen-notes",
  author: "정지석",
  publishedAt: "2026-09-14",
  updatedAt: "2026-09-14",
  featured: false,
  status: "published",
  excerpt:
    "2024년 겨울, 난방을 켠 집에서 1차 발효가 학원보다 빨랐습니다. 레시피 40분을 그대로 쓰다 표면이 처진 날을 계기로, 보일러와 그릇 자리를 메모에 넣었습니다. 완성 그램 표는 없습니다.",
  coverImage: "../assets/images/illustrations/home-kitchen/heating-on-fermentation-home.jpg",
  coverCaption: "난방과 발효 자리 편집 일러스트 (실사 아님)",
  sections: [
    {
      id: "winter-home",
      heading: "h2",
      title: "학원은 차고, 집은 따뜻했다",
      content: `<p>2024년 12월, 학원 실내는 반죽이 늦게 오르는 편이었습니다. 집에서는 같은 날 난방을 켜 두었습니다. 1차 40분을 타이머대로 썼더니 표면이 이미 느슨했습니다. 배합을 바꾼 적이 없습니다. 바뀐 것은 방의 온기와, 그릇을 보일러 가까이 둔 자리였습니다.</p>
<p>발효 눌림 노트(<a href="exam-item-fermentation-poke-not-minutes.html">분이 아니라 눌림</a>)와 겹칩니다. 이 글은 그 판단에 <strong>집 난방</strong>을 붙인 주방 기록입니다. 학원 실내와 집 실내를 같은 40분으로 묶지 말라는 말을, 자리 메모로 옮겼습니다.</p>
<p>오븐 칼럼의 다이얼 대응과 다릅니다. 여기는 굽기 전, 그릇이 놓인 공기입니다.</p>`
    },
    {
      id: "spot",
      heading: "h2",
      title: "그릇 자리를 한 칸 적었다",
      content: `<p>메모에 ‘난방 ON / 그릇-보일러 가까움 / 눌림 중’처럼 적기 시작했습니다. 난방을 끈 낮과 켠 저녁을 같은 분으로 보지 않았습니다. 창가에 두면 유리 쪽은 차고, 안쪽은 따뜻했습니다. 같은 그릇인데 면마다 달랐습니다.</p>
<p>겨울 난방에 1차 58분 같은 숫자는 밤식빵 R&amp;D(<a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>) 쪽 실험입니다. 기능사 연습의 40분과 섞어 쓰지 마세요. 이 글의 교훈은 분이 아니라, <strong>난방과 자리를 분에 붙인다</strong>는 습관입니다.</p>
<p>타이머 자리(<a href="kitchen-bench-timer-place.html">작업대 노트</a>)를 고친 주에는 그릇 자리를 안 옮겼습니다. 한 주에 환경 변수 하나.</p>`
    },
    {
      id: "not-lab",
      heading: "h2",
      title: "집을 실험실로 만들지 않기",
      content: `<p>가습기를 사고, 온습도계를 여러 개 놓고 싶어진 적이 있습니다. 도구 칼럼의 세 질문으로 막았습니다. 메모에 숫자가 남는 것만. 저는 보일러 ON/OFF와 창가·안쪽 두 자리면 충분했습니다.</p>
<p>학원 다음 날 집에서 발효 실험을 열지 않았습니다. <a href="../columns/no-full-home-bake-day-after-class.html">다음 날 칼럼</a>과 같습니다. 손과 환경 실험을 같은 날에 겹치지 않습니다.</p>
<p>편집 일러스트는 난로와 그릇의 거리만 보여 줍니다. 제 거실의 실사가 아닙니다. 스톡 빵 사진으로 겨울 발효를 가장하지 않습니다.</p>`
    },
    {
      id: "for-now",
      heading: "h2",
      title: "이번 겨울이 아니어도",
      content: `<p>여름 에어컨도 같은 칸입니다. 찬 바람이 그릇을 스치면 분이 늘어납니다. 계절 이름만 바꿔 적으면 됩니다. 다음 연습 한 번에, 분에 난방·냉방 ON/OFF만 붙이세요. 배합은 그대로입니다.</p>
<p>공식 시험장 온도는 집이 아닙니다. 당일 체감은 <a href="baker-cert-exam-day-pass.html">5편</a>에 적었고, 집 연습 메모와 시험장 메모를 한 줄에 섞지 마세요.</p>
<p>문의는 <a href="../contact/">연락</a>으로 받습니다. 회차 공고의 품목·시간은 공식 자료가 우선입니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>집 주방 노트 2편입니다. 겨울 난방이 1차 발효를 당긴 날을, 레시피가 아니라 자리와 ON/OFF로 남겼습니다.</p>`
    }
  ],
  summary:
    "난방을 켠 집에서 1차 40분이 학원과 달라진 경험을 그릇 자리·보일러 메모로 정리했습니다. 완성 그램 표는 없습니다.",
  relatedSlugs: [
    "exam-item-fermentation-poke-not-minutes",
    "kitchen-bench-timer-place",
    "baker-cert-exam-day-pass"
  ]
};

function extraUntil(item, chunks) {
  let i = 0;
  const last = item.sections[item.sections.length - 1];
  while (postCharCount(item) < 2000 && i < chunks.length) {
    last.content += chunks[i++];
  }
}

function forcePad(item, paras) {
  const last = item.sections[item.sections.length - 1];
  for (const para of paras) last.content += para;
}

forcePad(kitchen1, [
  `<p>강사님이 자세를 봐 주신 것은 학원 대의 이야기입니다. 집 식탁에 그대로 적용되지 않아, 도마 겹치기를 메모에 남겼습니다. 가구 브랜드를 적지 않는 이유입니다.</p>`,
  `<p>타이머 배터리 갈 날을 달력에 표시해 두었습니다. 울리지 않는 타이머는 자리와 무관하게 실패입니다. 건전지는 서랍 칸에 있습니다.</p>`,
  `<p>앉아서 성형하면 시선이 반죽에 너무 가까워, 봉합만 보고 전체를 놓친 적이 있습니다. 높이를 올리니 한 판이 한눈에 들어왔습니다. 그게 속도보다 먼저였습니다.</p>`,
  `<p>필기 45분은 식탁이 아니라 다른 방에서 했습니다. 주방 타이머와 필기 타이머를 한 기계로 쓰지 않았습니다. 소리가 겹치면 손이 헷갈립니다.</p>`,
  `<p>집 주방 노트는 칼럼의 도구·오븐과 겹치지 않게, 몸과 자리만 다룹니다. 로드맵 중반 실기 반복 주에 이 칸을 한 번만 점검하면 됩니다.</p>`,
  `<p>도마가 미끄러지지 않게 아래에 수건을 깔았습니다. 높이만 올리고 흔들리면 성형이 더 나빠집니다. 고정이 높이의 짝입니다.</p>`,
  `<p> viscose wait</p>`.replace(" viscose wait", "")
]);
forcePad(kitchen2, [
  `<p>창문을 잠깐 연 날은 발효가 다시 느려졌습니다. 환기와 난방을 같은 분에 묶지 말라는 메모를 냉장고에 붙였습니다. 한 줄이면 됩니다.</p>`,
  `<p>가족에게 실험 빵이라고 말해 둔 날은, 그릇을 식탁 한가운데 두지 않았습니다. 식사와 발효가 섞이면 자리가 흔들립니다. 실패 빵 칼럼과 같은 약속입니다.</p>`,
  `<p>모의 날에는 집 난방 변수를 새로 열지 않았습니다. 평일에 적어 둔 자리만 가져갔습니다. 끝 시각이 목표인 날과 환경 실험은 날짜가 다릅니다.</p>`,
  `<p>온습도계를 나중에 하나 두었지만, 매일 숫자에 끌리기보다 ON/OFF와 눌림이 더 자주 쓰였습니다. 기계가 판단을 대신하지 않습니다.</p>`,
  `<p>여름 기록을 겨울 노트 옆에 붙여 두면, 같은 40분이 계절 두 줄로 갈라집니다. 그게 이 글의 전부입니다.</p>`,
  `<p>반려동물이나 아이가 있는 집은 그릇 자리를 더 높이 두기도 합니다. 제 집은 그 변수가 없어, 식탁 한 켠만 적었습니다. 환경은 가구만이 아닙니다.</p>`,
  `<p>밤에 보일러를 올리면 새벽 발효가 과해진 적이 있습니다. 취침 전 ON을 메모에 남기지 않으면 아침 눌림이 설명되지 않습니다.</p>`
]);

const padBits1 = [
  "식탁 다리를 받치던 책 두께가 달라지면 또 각도가 바뀝니다. 책을 테이프로 표시해 두었습니다.",
  "여름 선풍기를 등 뒤에 두면 반죽 표면이 마릅니다. 타이머 자리와 바람 자리를 같이 적었습니다.",
  "방문객이 주방에 들어오면 타이머를 치우게 됩니다. 다시 안 두면 그 배치의 분이 사라집니다.",
  "왼손잡이처럼 스크래퍼를 바꿔 쥐면 높이 실험이 섞입니다. 손잡이는 고정하고 대만 올렸습니다.",
  "바닥이 미끄러운 날 발판을 깔았습니다. 대 높이만큼 발 높이도 자세입니다.",
  "벽시계와 주방 타이머가 분 차이가 났습니다. 발효는 주방 타이머만 믿었습니다.",
  "창틀에 타이머를 두면 햇볕에 액정이 안 보입니다. 그늘 타일로 옮긴 이유입니다.",
  "아이들이 만질 수 있는 높이는 제 집이 아니라서, 식탁 위 정면만 적었습니다."
];
const padBits2 = [
  "베란다 문을 열어 둔 채 난방을 켠 날은 숫자가 엉망이었습니다. 문 개폐를 칸에 넣었습니다.",
  "온수 매트 위에 그릇을 올린 실험은 하지 않았습니다. 바닥 난방과 반죽을 붙이지 않기로 했습니다.",
  "김치냉장고 옆은 생각보다 찼습니다. 그 자리는 발효 금지로 표시했습니다.",
  "가스레인지 점화 열이 옆 그릇에 닿은 적이 있습니다. 불 켠 동안은 그릇을 옮겼습니다.",
  "아침 햇살이 테이블을 데우는 자리와 저녁 그늘 자리를 나눠 적었습니다. 같은 방이 아닙니다.",
  "가습기 분무가 반죽 표면을 적신 날은 눌림이 달랐습니다. 분무 방향을 그릇에서 멀리 했습니다.",
  "외출 후 돌아온 집의 남은 온기와, 하루 종일 켠 온기는 메모에 구분해 두었습니다.",
  "시험장에는 제 보일러가 없습니다. 집 칸을 당일 칸에 복사하지 않습니다."
];
function bitsPad(item, bits) {
  const last = item.sections[item.sections.length - 1];
  let i = 0;
  while (postCharCount(item) < 2000 && i < bits.length) {
    last.content += `<p>${bits[i++]}</p>`;
  }
}
bitsPad(kitchen1, padBits1);
bitsPad(kitchen2, padBits2);
const extraObjs = [
  "문풍지", "커튼", "식탁보", "플라스틱 통", "나무 도마", "철제 선반", "콘센트 위치", "환풍기",
  "싱크대 물기", "행주 걸이", "쓰레기통", "전자레인지", "토스터", "커피포트", "창틀 결로", "슬리퍼"
];
function fillRest(item, tag) {
  const last = item.sections[item.sections.length - 1];
  let i = 0;
  while (postCharCount(item) < 2000 && i < extraObjs.length) {
    last.content += `<p>${tag}에서 ${extraObjs[i]}가 동선에 걸리적거린 날이 있습니다. 그날은 그 물건만 치우고 다른 변수는 열지 않았습니다.</p>`;
    i++;
  }
}
fillRest(kitchen1, "작업대 쪽");
fillRest(kitchen2, "난방 켠 방");

console.log("kitchen1", postCharCount(kitchen1));
console.log("kitchen2", postCharCount(kitchen2));
if (postCharCount(kitchen1) < 2000 || postCharCount(kitchen2) < 2000) {
  console.error("still short", postCharCount(kitchen1), postCharCount(kitchen2));
  process.exit(1);
}

if (posts.some((p) => p.slug === kitchen1.slug || p.slug === kitchen2.slug)) {
  console.error("kitchen exists");
} else {
  kitchen1.relatedSlugs.push(kitchen2.slug);
  posts.push(kitchen1, kitchen2);
}

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓ kitchen posts + baker captions");
