/**
 * 운영 지침 1~4순위: 미래 날짜, 주방 글 통합, redirect 표시
 * node scripts/apply-ops-consolidation.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TODAY = "2026-09-15";

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

const KITCHEN_SLUGS = [
  "kitchen-bench-timer-place",
  "heating-on-fermentation-home",
  "window-vs-inner-table",
  "fridge-side-no-proof",
  "wet-hands-scale-cloth",
  "home-oven-shelf-height",
  "cooling-rack-overnight",
  "flour-tin-monsoon",
  "family-kitchen-tape-zone",
  "night-bake-lamp",
  "microwave-away-from-dough",
  "outlet-timer-cord"
];

const HUB = "home-baking-space-setup";

const hub = {
  slug: HUB,
  title: "집에서 빵 만들 때 작업대·발효·굽기·식힘 공간 구성하는 방법",
  subtitle: "학원과 다른 집 주방에서, 자리를 옮기며 남긴 동선 기록",
  category: "home-kitchen-notes",
  author: "정지석",
  publishedAt: "2026-08-01",
  updatedAt: TODAY,
  featured: true,
  status: "published",
  excerpt:
    "집 식탁·창가·냉장고 옆·전자레인지 옆·난방·오븐 단·식힘 망·타이머 줄을 하나씩 옮기며 발효와 굽기가 달라진 점을 한 장에 모았습니다. 완성 레시피가 아닙니다.",
  coverImage: "../assets/images/illustrations/home-kitchen/kitchen-bench-timer-place.jpg",
  coverCaption: "집 주방 작업대와 타이머 자리",
  relatedSlugs: [
    "bread-rd-night-bread-practical-guide",
    "baker-cert-practical-mistakes",
    "exam-item-fermentation-poke-not-minutes"
  ],
  summary:
    "집 주방에서 작업대 높이, 발효 자리(창가·안쪽·냉장고·전자레인지·난방), 오븐 선반, 식힘, 타이머 줄, 가족 식탁 칸을 한 번에 보는 공간 가이드입니다.",
  sections: [
    {
      id: "why",
      heading: "h2",
      title: "왜 자리를 한 장에 모았나",
      content: `<p>집 주방에서 빵을 만들면 학원과 다른 점이 한두 개가 아닙니다. 식탁 높이, 창가 찬기, 냉장고 문, 난방, 작은 오븐 단까지 한꺼번에 겹칩니다. 자리를 글마다 잘게 나누면 읽을 이유가 줄어듭니다. 그래서 제가 실제로 옮긴 자리만 이 한 장에 모았습니다.</p>
<p>완성 그램 표는 없습니다. 시험장 규격을 집에서 흉내 내는 글도 아닙니다. 제 식탁·제 오븐 기준입니다.</p>`
    },
    {
      id: "bench",
      heading: "h2",
      title: "1. 작업대 높이",
      content: `<p>학원 작업대는 서서 반죽하기에 맞았고, 집에서는 식탁에 앉아 반죽했습니다. 같은 스크래퍼인데 어깨와 손목 각도가 달라 봉합이 헐거워진 날이 있었습니다. 도마를 겹쳐 높이를 조금 올린 뒤, 한 판이 한눈에 들어오기 시작했습니다.</p>
<p>가구를 새로 사지 않았습니다. 높이만 올리고 흔들리면 성형이 더 나빠서, 아래에 수건을 깔아 고정했습니다. 앉아서만 하면 시선이 반죽에 너무 가까워 봉합만 보고 전체를 놓친 적도 있습니다.</p>`
    },
    {
      id: "timer",
      heading: "h2",
      title: "2. 타이머 자리와 줄",
      content: `<p>집에서는 타이머를 냉장고 옆, 등 뒤에 두었습니다. 울리면 고개를 돌리다 손이 멈췄습니다. 벽 타일 정면으로 옮긴 뒤로는 발효 분을 놓치는 일이 줄었습니다. 휴대폰을 주머니에 넣은 날은 진동을 못 느낀 적이 있어, 주방 전용 타이머를 썼습니다.</p>
<p>정면으로 옮긴 뒤에는 줄이 반죽 볼 위를 지나갔습니다. 콘센트 쪽 벽에 줄을 고정하니 손이 덜 걸렸습니다. 줄이 짧으면 화면은 보이게, 줄만 옆으로 뺐습니다.</p>`
    },
    {
      id: "ferment-spots",
      heading: "h2",
      title: "3. 발효 자리 — 창가, 안쪽, 냉장고, 전자레인지",
      content: `<p>같은 주방이어도 창가와 안쪽은 달랐습니다. 2024년 12월, 같은 반죽을 나눠 두니 창가는 손가락이 잘 안 들어가고 안쪽은 이미 느슨했습니다. 난방을 켠 것은 같았습니다. 유리가 바깥 공기를 붙잡고 있었습니다. 메모에 ‘창가 / 안쪽 / 저녁’처럼 좌표를 넣기 시작했습니다.</p>
<p>냉장고 옆에 두면 문을 열 때마다 찬 공기가 스쳤습니다. 보일러를 켜도 그 옆은 회복이 느렸습니다. 바닥에 발효 금지 표시를 하고 안쪽 선반으로 옮겼습니다. 냉동실 쪽 벽은 냉장실 쪽보다 더 찼습니다.</p>
<p>전자레인지 옆은 반대입니다. 가족이 국을 데울 때마다 가까운 면만 따뜻해져 눌림이 면마다 달랐습니다. 저녁 시간대에는 그 옆을 비웠습니다. 한 주에 기계 옆을 두 곳 한꺼번에 옮기지 않았습니다.</p>`
    },
    {
      id: "heat",
      heading: "h2",
      title: "4. 난방이 발효에 미치는 영향",
      content: `<p>2024년 12월, 학실 실내는 반죽이 늦게 오르는 편이고 집은 난방을 켜 두었습니다. 1차 40분을 타이머대로 썼더니 표면이 이미 느슨했습니다. 배합을 바꾼 적이 없습니다. 방의 온기와, 그릇을 보일러 가까이 둔 자리였습니다.</p>
<p>메모에 ‘난방 ON / 그릇-보일러 가까움 / 눌림 중’처럼 적었습니다. 난방을 끈 낮과 켠 저녁을 같은 분으로 보지 않았습니다. 창문을 잠깐 연 날은 발효가 다시 느려져, 환기와 난방을 같은 분에 묶지 않았습니다.</p>
<p>1차 발효를 분이 아니라 눌림으로 보는 습관은 <a href="exam-item-fermentation-poke-not-minutes.html">식빵 1차 노트</a>와 같이 읽으면 됩니다. 시험장 온도는 집이 아닙니다.</p>`
    },
    {
      id: "scale-wet",
      heading: "h2",
      title: "5. 저울과 물기",
      content: `<p>집에서는 싱크대가 저울 바로 옆입니다. 물기가 남은 손으로 판을 누르면 숫자가 튀었습니다. 행주를 저울 오른쪽에 두면 물기가 옮았습니다. 싱크대 → 마른 천 → 저울 순으로 말리는 동선을 그었습니다. 영점은 매 배치 전입니다.</p>
<p>성형 직후 무게를 빼먹지 않는 습관은 <a href="exam-item-scale-after-shaping.html">성형 저울 노트</a>와 이어집니다. 학원 저울은 멀어 손이 저절로 말랐습니다. 집에서는 그 거리를 만들어야 했습니다.</p>`
    },
    {
      id: "oven",
      heading: "h2",
      title: "6. 오븐 선반과 문",
      content: `<p>집 오븐은 작아 위 단이 편했습니다. 학원 중간 높이와 달라, 겉 색만 빨리 나고 속은 덜한 날이 있었습니다. 다이얼만 의심하다 선반이 변수인 줄 알았습니다. ‘위 / 가운데 / 아래’만 적고, 가운데로 내린 주에는 다이얼을 안 바꿨습니다. 팬 두 장을 동시에 넣지 않았습니다.</p>
<p>단과자를 집에서 연습할 때는 색이 궁금해 문을 자주 열었습니다. 열수록 온도가 떨어졌습니다. 확인은 중반 한 번, 끝 근처 한 번으로 줄였습니다. 창으로 보는 것과 문을 여는 것을 나눴습니다. 오븐 다이얼 대응은 <a href="../columns/home-oven-temperature-notes.html">오븐 칼럼</a>에 있습니다.</p>`
    },
    {
      id: "cool-store",
      heading: "h2",
      title: "7. 식힘 망과 가루 통",
      content: `<p>밤식빵은 다음 날 식감이 기준입니다. 식힘 망을 밀폐 용기 옆에 두면 김이 남고, 창가에 두면 겉만 굳었습니다. 안쪽 선반에 사방이 뜨게 두었습니다. 선풍기를 직접 꽂지 않았습니다. 밀폐는 완전히 식은 뒤에만 했습니다.</p>
<p>2025년 7월 장마에 밀가루 통 뚜껑을 열어 두니 반죽 감이 축축했습니다. 물 온도 칸은 그대로였습니다. 계량할 때만 열고 끝나면 닫았습니다. 새 통을 사지 않았습니다.</p>
<p>다음 날 식감 기준은 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>를 먼저 보세요.</p>`
    },
    {
      id: "family-light",
      heading: "h2",
      title: "8. 가족 식탁 칸과 밤 조명",
      content: `<p>식탁 중앙에 반죽을 두면 저녁 준비와 섞여 타이머가 사라졌습니다. 끝쪽만 실험 칸으로 표시했습니다. 테이프가 보기 싫으면 도마 자리만 고정해도 됩니다. 혼자 쓰는 날에는 선을 걷었습니다.</p>
<p>퇴근 후 밤에만 구우면 노란 조명에서 겉색이 괜찮아 보였습니다. 아침 창가에서는 덜 익은 톤이었습니다. 전구를 바꾸지 않고, 색 판정만 아침으로 미뤘습니다. 타이머 자리와 조명 자리를 같은 날 바꾸지 않았습니다.</p>`
    },
    {
      id: "changed",
      heading: "h2",
      title: "9. 쓰면서 바꾼 배치",
      content: `<p>처음에는 식탁 중앙·창가·냉장고 옆·전자레인지 옆을 가리지 않았습니다. 지금은 안쪽 선반이 발효 기본이고, 타이머는 정면, 줄은 벽, 저울은 마른 손 다음에, 오븐은 가운데 단, 식힘은 안쪽 선반입니다.</p>
<p>한 주에 자리 변수를 두 개 이상 열지 않았습니다. 무엇이 효과인지 모르기 때문입니다. 학원 다음 날 집에서 풀코스로 자리를 실험하지 않았습니다.</p>`
    },
    {
      id: "starter",
      heading: "h2",
      title: "10. 처음 집에서 굽는다면",
      content: `<p>한 번에 다 바꾸지 마세요. 먼저 타이머가 보이는지, 발효 그릇이 냉장고·전자레인지 옆이 아닌지만 보세요. 그다음 작업대 높이와 오븐 단입니다.</p>
<p>시험 준비 중이라면 실기 실수(<a href="baker-cert-practical-mistakes.html">3편</a>)와 모의(<a href="baker-cert-mock-three-weeks.html">모의 3주</a>)를 이 글보다 먼저 읽어도 됩니다. 이 장은 집 공간만 다룹니다. 문의는 <a href="../contact/">연락</a>으로 받습니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>창가·냉장고 옆·전자레인지 옆·난방·작업대·타이머 줄·오븐 단·식힘 망을 따로 잘게 나누지 않고, 집에서 실제로 옮긴 자리만 한 장에 모았습니다. 시험장·학원 규격은 공고와 현장을 따릅니다.</p>`
    }
  ]
};

const posts = load("data/posts.js", "POSTS_DATA");

for (const p of posts) {
  if (p.publishedAt > TODAY) {
    console.log("future date → today", p.slug, p.publishedAt);
    p.publishedAt = TODAY;
    p.updatedAt = TODAY;
  }
}

const existingHub = posts.find((p) => p.slug === HUB);
if (existingHub) {
  Object.assign(existingHub, hub);
} else {
  posts.push(hub);
}

for (const p of posts) {
  if (KITCHEN_SLUGS.includes(p.slug)) {
    p.status = "redirect";
    p.redirectTo = HUB;
  }
}

for (const p of posts) {
  if (!p.relatedSlugs?.length) continue;
  p.relatedSlugs = [...new Set(p.relatedSlugs.map((s) => (KITCHEN_SLUGS.includes(s) ? HUB : s)))].filter(
    (s) => s !== p.slug
  );
}

save("data/posts.js", "POSTS_DATA", posts);
console.log("kitchen redirects", KITCHEN_SLUGS.length);
console.log("hub", HUB);
