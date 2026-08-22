/**
 * 품목 접근 노트: 1차 발효 — 분이 아니라 눌림
 * 발행 2026-08-22
 * node scripts/add-exam-item-fermentation-poke.mjs
 */
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

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function makeSvg(slug, label, sub) {
  const hue = hashHue(slug);
  const hue2 = (hue + 48) % 360;
  const id = slug.replace(/[^a-z0-9-]/gi, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="${escapeXml(label)}">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue},36%,95%)"/>
      <stop offset="100%" stop-color="hsl(${hue2},40%,84%)"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g-${id})"/>
  <rect x="72" y="88" width="1056" height="500" rx="28" fill="#fff" opacity="0.93"/>
  <rect x="120" y="160" width="14" height="200" rx="7" fill="hsl(${hue},50%,45%)"/>
  <text x="170" y="220" font-family="system-ui,sans-serif" font-size="40" font-weight="700" fill="#1d1d1f">${escapeXml(label)}</text>
  <text x="170" y="280" font-family="system-ui,sans-serif" font-size="24" fill="#555">${escapeXml(sub)}</text>
  <text x="170" y="360" font-family="system-ui,sans-serif" font-size="20" fill="#777">완성 그램 레시피 없음 · 실패 지점·변수 순서</text>
  <rect x="170" y="400" width="420" height="12" rx="6" fill="hsl(${hue},35%,82%)"/>
  <rect x="170" y="432" width="320" height="12" rx="6" fill="hsl(${hue},28%,88%)"/>
</svg>`;
}

const post = {
  slug: "exam-item-fermentation-poke-not-minutes",
  title: "1차 발효 — 레시피 분을 버리고 눌림을 본 날",
  subtitle: "40분을 그대로 쓰다 겨울과 봄이 갈라졌을 때",
  category: "exam-item-notes",
  author: "정지석",
  publishedAt: "2026-08-22",
  updatedAt: "2026-08-22",
  featured: false,
  status: "published",
  excerpt:
    "기능사 실기에서 1차 발효를 레시피 40분으로만 끝냈더니, 같은 반죽이 겨울과 봄에 다르게 나왔습니다. 그다음부터 손가락 눌림과 표면을 분에 붙여 적었습니다. 완성 그램 표는 없습니다.",
  sections: [
    {
      id: "the-split",
      heading: "h2",
      title: "같은 40분이 겨울과 봄에 달랐다",
      content: `<p>2024년 11월, 학원에서 받아 적은 1차 발효는 40분이었습니다. 저는 타이머만 맞춰 두고 성형에 들어갔습니다. 반죽은 덜 부풀었고, 구운 속은 촘촘했습니다.</p>
<p>2025년 3월에는 같은 40분을 썼습니다. 이번엔 표면이 일찍 느슨해졌고, 성형 전에 기포가 무너진 날이 있었습니다. 배합을 바꾼 적이 없습니다. 바뀐 건 실내 온도와, 제가 분을 절대값으로 믿은 습관이었습니다.</p>
<p>식빵 접근 노트(<a href="exam-item-white-bread-fail-points.html">세 지점</a>)에 적어 둔 두 번째 실패가 이 글의 본편입니다. 실기 전반은 <a href="baker-cert-practical-mistakes.html">3편</a>에 있고, 여기서는 <strong>1차 발효 판단만</strong> 자릅니다.</p>
<p>완성 레시피·공식 분은 올리지 않습니다. 학원 요강과 시험장 온도가 해마다 달라질 수 있으니, 최신 공고는 따로 확인하세요. 강사님이 “분보다 반죽을 보라”고 하신 뒤에도, 저는 한동안 타이머만 봤습니다. 기록이 세 칸이 되고 나서야 그 말이 메모가 됐습니다.</p>`
    },
    {
      id: "what-i-wrote",
      heading: "h2",
      title: "메모에 붙인 세 칸",
      content: `<p>타이머를 버린 것은 아닙니다. 분에 칸 두 개를 붙였습니다.</p>
<ul>
<li><strong>분</strong> — 타이머가 가리킨 값</li>
<li><strong>눌림</strong> — 손가락을 넣었다 뺐을 때 약 / 중 / 강</li>
<li><strong>표면</strong> — 팽팽 / 느슨</li>
</ul>
<p>학원에서 배운 기준은 눌림과 부피였습니다. 저는 표면 텐션을 세 번째 칸에 넣었습니다. 팽팽하기만 하고 안 늘어나면 덜 발효 쪽으로, 너무 느슨하면 과발효 쪽으로 읽었습니다.</p>
<p>겨울 메모 한 줄 예: “1차 48분 · 눌림 약 · 표면 팽팽”. 봄 메모 한 줄 예: “1차 36분 · 눌림 중 · 표면 느슨 직전”. 숫자가 정답이 아닙니다. 같은 날 두 번째 반죽을 고칠 때 비교가 되는 값이었습니다.</p>
<p>눌림을 ‘중’으로만 적으면 나중에 기억이 흐려졌습니다. 손가락이 들어간 깊이, 다시 올라오는 속도까지 세 글자면 충분했습니다. 사진이 없어도 다음 주 내가 읽었습니다.</p>`
    },
    {
      id: "one-variable",
      heading: "h2",
      title: "그 주에는 발효만 만졌다",
      content: `<p>반죽 종료 온도와 발효 분을 같은 날 바꾸면, 속이 촘촘한 이유가 안 보였습니다. 한 주는 종료 온도 메모만 고정하고, 다음 주에 눌림 칸만 열었습니다. 식빵 노트 주간 순서와 같습니다.</p>
<p>집과 학원의 실내 온도가 달랐습니다. 학원 40분이 집에서 통하지 않은 날이 많아서, 장소 칸을 메모 맨 앞에 두었습니다. 오븐 다이얼은 이 글에서 다루지 않습니다. 굽기는 <a href="../columns/home-oven-temperature-notes.html">오븐 칼럼</a> 쪽입니다.</p>
<p>모의 날에는 발효 판단을 새로 실험하지 않았습니다. <a href="baker-cert-mock-three-weeks.html">모의 3주</a>는 동선과 끝 시각이 목표라, 평일에 맞춰 둔 눌림 습관만 가져갔습니다. 모의 전에 새 발효 분을 넣으면 시간이 부족한 이유가 발효인지 성형인지 섞입니다.</p>
<p>단과자 계열(<a href="exam-item-sweet-roll-approach.html">층 나누기</a>)은 개수·성형이 먼저고, 식빵·식빵에 가까운 큰 반죽은 1차 발효가 속을 가릅니다. 품목이 달라도 분 칸만 덜렁 두면 같은 실수를 합니다.</p>`
    },
    {
      id: "night-bread-aside",
      heading: "h2",
      title: "밤식빵 일지와 다른 점",
      content: `<p>합격 뒤 R&amp;D에서는 겨울 난방에 1차 58분 같은 숫자를 실험 근거로 남겼습니다. 그건 <a href="bread-rd-night-bread-practical-guide.html">실전 정리</a>와 9차 일지 역할입니다. 이 글의 40분·48분·36분은 기능사 연습 때의 제 타이머입니다. 두 숫자를 섞어 쓰지 마세요.</p>
<p>실기는 제한 시간 안에 규격을 맞추는 일입니다. R&amp;D는 기억의 식감입니다. 발효를 본다는 습관만 같고, 목표 분이 다릅니다. 실전 정리의 겨울 표를 기능사 연습 메모에 복사하지 마세요. 계절 실험과 시험 루트는 날짜부터 다릅니다.</p>`
    },
    {
      id: "misses",
      heading: "h2",
      title: "분을 절대값으로 둘 때 생긴 일",
      content: `<p>타이머가 울리자마자 성형에 들어가면, 덜 발효인 줄 알고도 손을 멈추지 못했습니다. 시험 시계가 먼저 보였습니다.</p>
<p>반대로 눌림이 이미 중인데 분이 안 찼다고 기다린 날도 있습니다. 표면이 처진 뒤에야 과발효를 인정했습니다. 그때 배운 순서는 간단합니다. 분이 울려도 눌림이 약하면 조금 더 두고, 분이 남았어도 표면이 처지면 성형으로 갑니다.</p>
<p>유튜브 영상 분과 학원 분을 같은 칸에 적지 않았습니다. 영상이 겹치면 원인이 안 보입니다. 집 난방을 켠 날은 오븐 칼럼에 적듯 주변 온도가 올라 발효가 빨라지기도 했습니다. 그날은 분보다 눌림을 더 자주 봤습니다.</p>
<p>2025년 4월 모의 한 번은 40분에 맞춰 성형했다가 속이 덜 익은 느낌이 났습니다. 실제로는 굽기 시간도 겹쳤을 수 있습니다. 그래서 발효 메모와 굽기 메모를 한 장에 나란히 두되, 고치는 변수는 하나였습니다.</p>`
    },
    {
      id: "second-proof",
      heading: "h2",
      title: "2차는 이 글에서 깊게 안 판다",
      content: `<p>2차 발효도 분이 어긋나면 모양이 퍼집니다. 다만 초반 실패의 대부분은 1차에서 이미 정해졌습니다. 1차가 덜 된 반죽을 2차에서 만회하려고 분을 늘리면, 성형 무게까지 흔들렸습니다.</p>
<p>1차 세 칸이 두 주 정도 나란히 읽히기 시작한 뒤에, 2차 분을 메모에 한 줄 추가했습니다. 순서를 뒤집지 않았습니다. 시험장에서 2차 자리를 옮기다 모양이 무너진 적은 <a href="baker-cert-practical-mistakes.html">3편</a> 성형 쪽에 있습니다. 발효 판단과 자리를 한날에 같이 고치지 마세요.</p>`
    },
    {
      id: "for-now",
      heading: "h2",
      title: "지금 타이머만 보고 있다면",
      content: `<p>다음 연습 한 번만, 분에 눌림·표면을 붙여 보세요. 반죽 배합은 건드리지 않습니다.</p>
<p>손목이 남은 날에는 반죽을 접고 어제 메모만 읽었습니다. 쉬는 기준은 <a href="../columns/rest-day-when-wrists-hurt.html">손목 칼럼</a>에 있습니다.</p>
<p>환경이 다르면 <a href="../contact/">문의</a>로 알려 주세요. 공식 품목·시간은 공고가 우선입니다. 난방을 켠 집과 안 켠 학원을 같은 40분으로 묶지 않는 것이, 이 글에서 가져갈 습관입니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>2024년 겨울과 2025년 봄, 같은 40분이 다른 빵을 만들었습니다. 그다음 메모는 분이 아니라 눌림이 주석이었습니다. 한 줄이면 됩니다. 길게 쓸 필요는 없습니다. 다음 배치가 읽으면 충분합니다. 시험 요강은 공식 자료를 따릅니다. 문의는 연락 페이지로 받습니다. 오류는 수정일을 남기고 고칩니다.</p>
<p>품목 접근 노트 3편입니다. 식빵 세 지점, 단과자 층과 같이 읽으면 됩니다. 로드맵(<a href="baker-cert-8month-roadmap.html">8개월</a>) 중반 실기 반복 주에 이 세 칸만 붙여도, 계절이 바뀌는 달력과 연습 기록이 맞물리기 시작했습니다.</p>`
    }
  ],
  summary:
    "기능사 1차 발효를 레시피 40분으로만 끝내지 않고, 분·눌림·표면 세 칸으로 적게 된 이유를 정리했습니다. 겨울·봄 연습 메모 기준이며 완성 그램 표는 없습니다.",
  relatedSlugs: [
    "exam-item-white-bread-fail-points",
    "baker-cert-practical-mistakes",
    "baker-cert-mock-three-weeks",
    "exam-item-sweet-roll-approach"
  ]
};

const posts = load("data/posts.js", "POSTS_DATA");
if (posts.some((p) => p.slug === post.slug)) {
  console.error("exists");
  process.exit(1);
}

const n = postCharCount(post);
console.log("chars", n);
if (n < 2000) {
  console.error("under 2000");
  process.exit(1);
}

const dir = path.join(ROOT, "assets/images/illustrations/exam-items");
fs.mkdirSync(dir, { recursive: true });
const svg = `${post.slug}.svg`;
fs.writeFileSync(
  path.join(dir, svg),
  makeSvg(post.slug, "1차 발효", "분이 아니라 눌림"),
  "utf8"
);
post.coverImage = `../assets/images/illustrations/exam-items/${svg}`;
post.coverCaption = "품목 접근 노트 일러스트 (레시피·사진 아님)";

const white = posts.find((p) => p.slug === "exam-item-white-bread-fail-points");
if (white && !white.relatedSlugs.includes(post.slug)) {
  white.relatedSlugs = [post.slug, ...(white.relatedSlugs || [])].slice(0, 5);
}

posts.push(post);
save("data/posts.js", "POSTS_DATA", posts);
console.log("✓", post.slug, post.publishedAt);
