/**
 * 운영자 칼럼 2편 추가
 * 사용: node scripts/add-columns-batch-2.mjs
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

const NEW_COLUMNS = [
  {
    slug: "month-after-pass-before-rd",
    title: "합격 후 한 달 — R&D를 바로 시작하지 않은 이유",
    subtitle: "손을 식히지 않으면서도 실험을 서두르지 않기",
    author: "정지석",
    publishedAt: "2026-07-11",
    updatedAt: "2026-07-11",
    status: "published",
    excerpt:
      "2025년 5월 제빵기능사 합격 직후, 밤식빵 R&D를 바로 시작하지 않았습니다. 학원 품목만 가볍게 반복하고 메모 습관을 유지한 한 달이 있었고, 그 이유와 그때 쓴 기준을 적습니다.",
    perspective:
      "합격하면 곧바로 '내 빵'을 만들어야 한다고 느끼기 쉽습니다. 저도 첫 주에 새 변수를 여러 개 넣다 손이 꼬였고, 그때 '시험 반죽과 연구 반죽을 같은 날에 섞지 말자'고 정했습니다.",
    sections: [
      {
        id: "first-week",
        heading: "h2",
        title: "합격 직후 첫 주",
        content:
          '<p><a href="../posts/baker-cert-exam-day-pass.html">시험 당일</a> 메모를 집에 가져와 붙여 두었습니다. 필기·실기 시간, 손목 컨디션, 시험장 오븐 첫 5분이 적혀 있었고, 그걸 읽는 동안 새 레시피를 검색하지 않기로 했습니다.</p><p>대신 학원에서 익숙해진 품목 하나만 집에서 다시 구웠습니다. 변수는 바꾸지 않았고, 목표는 "집 오븐에서 같은 손감이 나오는가"였습니다. 결과는 완벽하지 않았지만, <strong>시험 손이 식기 전에 환경만 바꿔 본 날</strong>이었습니다.</p><p>가족에게는 "이번 달은 연습 빵"이라고 먼저 말했습니다. <a href="sharing-failed-bread.html">실패 빵을 나누는 방식</a> 칼럼에서 쓴 약속과 같은 톤이었고, R&D 본격 시작 전에 기대치를 맞춰 두려 했습니다.</p>'
      },
      {
        id: "why-wait",
        heading: "h2",
        title: "R&D를 한 달 미룬 이유",
        content:
          '<p>밤식빵 R&D는 어릴 적 맛을 따라가는 일입니다. 합격 직후 의욕이 최고일 때 변수를 여러 개 넣으면, 무엇이 시험 손에 도움이 됐는지 구분이 어렵습니다. 저는 <strong>한 달 동안 시험 품목만</strong> 굽고, 메모 형식만 R&D용으로 바꿨습니다.</p><p><a href="../posts/baker-cert-to-bread-rd.html">기능사에서 R&D로</a> 글에 적은 것처럼, 합격이 끝이 아니라 다음 단계의 입구였습니다. 다만 입구에서 바로 달리면 숨이 차서, 걷기 속도로 한 달을 보냈습니다.</p><p>독학 준비자에게는 학원이 없어서 이 간격이 더 짧아질 수 있습니다. 그때도 "변수 1개" 규칙만 지키면, 한 달이 아니라 2주만 비워도 비슷한 효과가 있었습니다.</p>'
      },
      {
        id: "what-kept",
        heading: "h2",
        title: "그 한 달에 유지한 것",
        content:
          '<p>주 3회 반죽, 실기한 날 메모 한 줄, 일요일 10분 점검 — <a href="quit-job-weekly-routine.html">루틴 칼럼</a>의 최소 3개와 같았습니다. 달라진 것은 품목이 시험 범위로 고정됐다는 점뿐입니다.</p><p>메모 칸은 기능사 때 쓰던 형식(날짜·품목·온도·발효·무게·굽기·망한 점)을 그대로 두고, 맨 위에 "집 오븐 상화 온도" 한 줄만 추가했습니다. 이 줄이 나중에 <a href="../posts/bread-rd-night-bread-v1.html">1차 R&D</a>로 이어졌습니다.</p><p>필기 복습은 주 1회로 줄였습니다. 합격 직후 필기를 이어가는 분도 계시지만, 저는 실기 손이 끊기는 쪽이 더 위험하다고 봤습니다.</p>'
      },
      {
        id: "what-not",
        heading: "h2",
        title: "그 한 달에 하지 않은 것",
        content:
          '<p>통조림 밤·시럽 비율·토핑 시점은 건드리지 않았습니다. "추억의 밤식빵"은 아직 목표만 있었고, 숫자가 없었습니다. 검색으로 레시피를 모으는 것도 보류했습니다 — <a href="why-no-complete-recipe.html">완성 레시피를 올리지 않는 이유</a>와 같은 맥락으로, 남의 그램을 붙이면 변수가 섞이기 쉽습니다.</p><p>블로그 발행도 하지 않았습니다. 2026년 5월 26일 첫 발행 전까지, 합격 후 약 1년은 오프라인 메모만 쌓였습니다. 지금 글로 읽는 6편 시리즈는 그 뒤에 정리한 것입니다.</p>'
      },
      {
        id: "bridge-to-rd",
        heading: "h2",
        title: "R&D 시작 신호",
        content:
          '<p>한 달 뒤, 집 오븐에서 시험 품목이 <strong>세 번 연속</strong> 비슷한 시간·색으로 나왔을 때 R&D 메모장을 새로 팠습니다. 첫 줄은 "목표: 어릴 적 밤식빵에 가깝게"였고, 변수는 통조림 밤 브랜드 하나만 적었습니다. 그게 <a href="../posts/bread-rd-night-bread-v1.html">1차</a>의 시작입니다.</p><p><a href="../posts/bread-rd-series-guide.html">R&D 안내</a>에 적은 메모 4칸(목표·실패·원인·변수)도 그때 고정했습니다. 합격 후 한 달이 없었다면 형식을 정하는 데 더 걸렸을 것 같습니다.</p>'
      },
      {
        id: "family-talk",
        heading: "h2",
        title: "가족에게 미리 말해 둔 것",
        content:
          '<p>합격 직후 가족은 "이제 맛있는 빵"을 기대하기 쉽습니다. 저는 식탁에 붙인 종이에 "5월~6월: 시험 품목만, 변수 없음"이라고 적어 두었습니다. 말로만 하면 깜빡할 때가 있고, 제 마음도 페이스가 빨라지는 날이 있었습니다.</p><p>시식 분량은 한 조각으로 제한했습니다. 맛 평가보다 "색·시간이 지난주와 비슷한가"만 물었습니다. R&D 본격 시작 전에 이 습관을 먼저 잡아 두면, <a href="sharing-failed-bread.html">실패 빵 칼럼</a>의 약속으로 자연스럽게 넘어갑니다.</p>'
      },
      {
        id: "for-readers",
        heading: "h2",
        title: "지금 준비 중이거나 막 합격하신 분께",
        content:
          '<p>바로 "나만의 빵"으로 가도 됩니다. 다만 손이 식거나 변수가 한꺼번에 늘면 일지가 읽기 어려워집니다. 2~4주만 시험 품목·익숙한 반죽으로 손을 유지하고, 메모 형식만 연습해 보세요.</p><p><a href="../posts/baker-cert-one-page-cheatsheet.html">한 장 요약</a>의 "합격 후" 블록과 이 칼럼을 같이 보면, 시험 직후 할 일·하지 않을 일이 구분됩니다.</p><p>학원을 그만둔 뒤 집만 쓰게 되면 손이 급격히 식을 수 있습니다. 그때는 품목 수를 늘리지 말고, 등록했던 학원 품목 중 <strong>가장 익숙한 하나</strong>만 집에서 반복하는 편이 낫습니다.</p>'
      },
      {
        id: "editor-note",
        heading: "h2",
        title: "편집 메모",
        content:
          '<p>이 칼럼은 합격 후 오프라인 메모를 2026년에 글로 옮기면서 쓴 것입니다. 날짜는 대략 2025년 5~6월 경험을 기준으로 하며, 개인 일정에 따라 한 달이 3주·6주가 될 수 있습니다. 중요한 것은 기간보다 <strong>변수를 한꺼번에 넣지 않는 것</strong>입니다.</p><p>10차 R&D 이후에도 "합격 직후 한 달" 원칙을 R&D 시즌에 다시 썼습니다. 실험을 못 한 주에도 메모 형식만 유지하면, 손이 완전히 끊기지 않았습니다.</p>'
      },
      {
        id: "related-posts",
        heading: "h2",
        title: "본문 글과 연결",
        content:
          '<p>시험 당일 기록은 <a href="../posts/baker-cert-exam-day-pass.html">5편</a>, 기능사에서 R&D로 넘어가는 관점은 <a href="../posts/baker-cert-to-bread-rd.html">6편</a>에 있습니다. R&D 시작 후 흐름은 <a href="../posts/bread-rd-series-guide.html">R&D 안내</a>를 이어서 읽으면 됩니다.</p>'
      },
      {
        id: "practice-notes",
        heading: "h2",
        title: "이번 주 적용하기",
        content:
          '<p>합격·종료 직후라면 이번 주 목표를 "새 레시피 1개"가 아니라 "익숙한 반죽 1배치 + 메모 7줄"로 잡아 보세요. 변수는 넣지 않아도 됩니다. 메모 형식이 잡히면 다음 주부터 변수 1개를 넣기 쉬워집니다.</p><p>메모 맨 위에 집 오븐 다이얼·실제 상화 온도 한 줄을 고정해 두세요. 나중에 R&D·실전 정리로 넘어갈 때 가장 먼저 쓰는 숫자입니다.</p><p>한 주에 두 품목을 번갈아 굽지 말고, 한 품목만 반복하면 손이 더 빨리 안정됩니다.</p>'
      }
    ],
    summary:
      "합격 직후 한 달 동안 R&D를 미루고 시험 품목·메모 습관만 유지한 이유, 그때 지킨 것과 하지 않은 것, R&D를 시작한 신호를 정리했습니다.",
    relatedSlugs: ["baker-cert-exam-day-pass", "baker-cert-to-bread-rd", "bread-rd-series-guide"]
  },
  {
    slug: "home-oven-temperature-notes",
    title: "집 오븐 온도를 믿지 않기로 한 이유",
    subtitle: "다이얼·상화·시간을 따로 적는 습관",
    author: "정지석",
    publishedAt: "2026-07-14",
    updatedAt: "2026-07-14",
    status: "published",
    excerpt:
      "기능사 학원 오븐과 집 오븐은 같은 200°C라도 결과가 달랐습니다. 다이얼 숫자를 믿지 않고 상화 온도·예열 시간·굽기 중 문 열림을 메모에 남기기로 한 이유와, R&D에서도 이어 쓰는 방법을 정리합니다.",
    perspective:
      "오븐 제조사 설명서에는 200°C라고 적혀 있습니다. 하지만 제빵은 '라벨 온도'보다 '그날 그 오븐에서 실제로 일어난 일'을 맞추는 일에 가깝습니다. 그래서 온도계를 샀다가도, 결국 메모가 더 오래 갔습니다.",
    sections: [
      {
        id: "classroom-gap",
        heading: "h2",
        title: "학원에서 처음 깨달은 차이",
        content:
          '<p><a href="../posts/baker-cert-practical-mistakes.html">실기 실수</a> 글에 적었듯, 학원 오븐 200°C에서 맞춘 굽기 시간을 집에 그대로 쓰면 색이 들쭉날쭉했습니다. 처음엔 "집에서만 손이 떨린다"고 생각했는데, 오븐 온도계를 들여놓고 보니 <strong>예열 직후 상화가 다르게 오르는</strong> 패턴이 보였습니다.</p><p>메모에 "학원 200 = 집 다이얼 190, 상화 185 전후"처럼 적기 시작한 뒤부터 집 연습이 시험 연습으로 느껴졌습니다. 숫자가 정답이 아니라 <strong>쌍으로 기억할 대응표</strong>에 가까웠습니다.</p><p>같은 날 같은 다이얼인데도 반죽 넣는 위치(상·중·하단)에 따라 색이 달라졌습니다. 그래서 메모에 랙 위치를 네 번째 줄로 추가했습니다.</p>'
      },
      {
        id: "log-example",
        heading: "h2",
        title: "메모 예시 한 줄",
        content:
          '<p>실제 메모 형태는 이렇게 짧습니다. "다이얼 190 / 상화 183 / 하단 랙 / 예열 22분 / 굽기 14분 / 문 12분에 3초". 길게 쓰지 않아도, 다음 번에 비교할 때 충분했습니다.</p><p>기능사 메모 양식(<a href="../posts/baker-cert-practical-mistakes.html">3편</a>)에 이 네 줄을 붙이면, 집·학원·시험장을 같은 표로 관리할 수 있습니다.</p>'
      },
      {
        id: "three-lines",
        heading: "h2",
        title: "메모에 고정한 세 줄",
        content:
          '<p>실기·R&D 공통으로 굽기 전에 아래 세 줄을 적습니다.</p><ul><li><strong>다이얼</strong> — 오븐에 맞춘 표시값</li><li><strong>상화</strong> — 예열 끝난 뒤 측정(가능할 때)</li><li><strong>문</strong> — 굽기 중 스팀·문 열림 여부</li></ul><p>상화를 매번 재지 못하는 날도 있습니다. 그때는 "상화 생략, 다이얼만"이라고 적어 두면, 나중에 같은 다이얼인데 결과가 다를 때 원인 추적이 쉬워집니다.</p><p><a href="../posts/bread-rd-night-bread-v8.html">8차</a>·<a href="../posts/bread-rd-night-bread-v9.html">9차</a>처럼 발효만 바꾼 날에도 이 세 줄은 그대로 두었습니다. 온도 줄이 비어 있으면 "발효 때문인지 오븐 때문인지"가 섞입니다.</p>'
      },
      {
        id: "preheat-habit",
        heading: "h2",
        title: "예열을 시간으로만 보지 않기",
        content:
          '<p>시험장에서는 "예열 20분"이 익숙했습니다. 집 오븐은 전기·가스·컨벡션에 따라 도달 속도가 달랐습니다. 저는 예열 시작 시각과 반죽 넣는 시각을 적고, 상화가 목표에 닿았는지 체크했습니다.</p><p>겨울 난방을 켠 날은 주방 주변 온도가 올라가 예열이 빨라지기도 했습니다. <a href="../posts/bread-rd-night-bread-v9.html">9차</a> 메모에도 "난방 직후 오븐 주변 온도 상승"을 한 줄 넣었습니다. 발효만 58분으로 바꿨다고 해도, 예열 줄이 없으면 재현이 어렵습니다.</p>'
      },
      {
        id: "rd-carryover",
        heading: "h2",
        title: "R&D에서도 같은 방식",
        content:
          '<p>밤식빵 R&D는 토핑·시럽·보관 변수가 많아 보이지만, 굽기 줄이 비어 있으면 비교가 무너집니다. <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>의 고정값 초안에도 "집 오븐 상화 실제 온도를 메모에 적는다"는 문장을 넣었습니다.</p><p>사진만으로는 색이 비슷해 보여도, 같은 다이얼에서 2분 차이면 겉 건조가 달라질 수 있습니다. 그래서 일지에는 단면 사진과 함께 <strong>굽기 분·다이얼·상화</strong>를 붙입니다.</p>'
      },
      {
        id: "mistakes",
        heading: "h2",
        title: "흔한 오해",
        content:
          '<p>"오븐이 나빠서"만으로 끝내기 쉽습니다. 저도 1차 R&D 전까지 그렇게 말했습니다. 메모를 쌓고 나니, 같은 오븐에서도 예열 충분·반죽 위치·습도에 따라 결과가 달라졌습니다. 오븐은 변수 중 하나이고, <strong>기록이 없으면 변수로도 쓸 수 없습니다</strong>.</p><p>새 오븐을 샀을 때도 다이얼을 옮기지 말고, 첫 달은 대응표만 만드는 것을 권합니다. 레시피의 200°C를 바꾸기 전에, "이 오븐에서 200°C에 해당하는 다이얼"을 찾는 쪽이 빠릅니다.</p><p>컨벡션·일반 오븐을 바꿀 때도 같은 원칙입니다. 기능 이름이 바뀌어도 메모 형식은 같게 유지합니다.</p>'
      },
      {
        id: "tools",
        heading: "h2",
        title: "도구에 대해",
        content:
          '<p>저는 저가 오븐 온도계를 썼습니다. 비싼 장비가 없어도 "다이얼 vs 결과" 대응표는 만들 수 있습니다. 중요한 것은 매번 같은 위치(오븐 중앙·상단 등)에서 재는 습관입니다.</p><p>기능사 실기에서는 시험장 오븐에 맞추는 시간이 더 길었습니다. 당일 <a href="../posts/baker-cert-exam-day-pass.html">5편</a>에 적은 "첫 5분이 방향을 정했다"도, 결국 그 오븐의 예열·상화를 읽는 일이었습니다.</p>'
      },
      {
        id: "steam-door",
        heading: "h2",
        title: "스팀과 문 열림",
        content:
          '<p>시험장 오븐은 스팀·환기 방식이 집과 다릅니다. 집에서 굽기 중 문을 열어 색을 보면 온도가 떨어지고, 안 열면 겉색을 놓치기도 합니다. 메모 "문" 줄에는 "10분에 5초 확인"처럼 <strong>행동</strong>을 적습니다.</p><p><a href="../posts/bread-rd-night-bread-v6.html">6차</a> 시럽 실험 때도 굽기 줄은 그대로 두고 표면 처리만 바꿨습니다. 굽기 줄이 없었다면 시럽 때문인지 문 열림 때문인지 나누기 어려웠을 것입니다.</p>'
      },
      {
        id: "editor-note",
        heading: "h2",
        title: "편집 메모",
        content:
          '<p>상화 온도는 날마다 달라질 수 있습니다. 이 칼럼의 숫자를 그대로 복사하지 말고, "다이얼·상화·시간을 쌍으로 적는다"는 습관만 가져가시면 됩니다. <a href="why-no-complete-recipe.html">완성 레시피를 올리지 않는 이유</a>와 같은 맥락입니다.</p><p>실전 정리나 10차 이후 고정값이 바뀌면, 이 칼럼도 수정일과 함께 고칩니다. 오븐을 교체하면 대응표를 처음부터 다시 쌓는 것이 맞습니다.</p>'
      },
      {
        id: "related-posts",
        heading: "h2",
        title: "본문 글과 연결",
        content:
          '<p>실기에서 망한 포인트는 <a href="../posts/baker-cert-practical-mistakes.html">3편</a>, 겨울 재현은 <a href="../posts/bread-rd-night-bread-v9.html">9차 일지</a>, 집에서 쓸 판단 기준은 <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>를 참고하세요.</p>'
      },
      {
        id: "practice-notes",
        heading: "h2",
        title: "이번 주 적용하기",
        content:
          '<p>다음에 굽기 전 메모에 다이얼·상화(또는 생략 표시)·예열 시작 시각 세 가지만 적어 보세요. 변수는 반죽·토핑을 바꾸지 않아도 됩니다. 두 번만 반복해도 "이 오븐에서의 200°C" 감이 잡힙니다.</p><p>기능사 준비 중이시면 학원에서 적은 굽기 시간 옆에 "학원 상화" 한 칸을 추가해 보세요. 집 연습 때 가장 먼저 비교할 숫자가 됩니다.</p><p>랙 위치까지 적으면, "왜 오늘만 탔지"를 찾을 때 시간만큼 유용합니다.</p>'
      }
    ],
    summary:
      "학원·집 오븐 차이를 다이얼·상화·예열·랙 위치 메모로 맞추는 습관, R&D에서도 굽기 줄을 비우지 않는 이유, 흔한 오해와 적용 방법을 정리했습니다.",
    relatedSlugs: [
      "baker-cert-practical-mistakes",
      "bread-rd-night-bread-v9",
      "bread-rd-night-bread-practical-guide"
    ]
  }
];

let added = 0;
for (const col of NEW_COLUMNS) {
  if (columns.some((c) => c.slug === col.slug)) {
    console.log(`skip (exists): ${col.slug}`);
    continue;
  }
  const n = columnCharCount(col);
  if (n < MIN_CHARS) {
    console.error(`FAIL ${col.slug}: ${n} (need ${MIN_CHARS})`);
    process.exit(1);
  }
  columns.push(col);
  added++;
  console.log(`OK ${col.slug}: ${n}`);
}

if (added) {
  columns.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
  fs.writeFileSync(columnsPath, `window.COLUMNS_DATA = ${JSON.stringify(columns, null, 2)};\n`);
}
console.log(`total columns: ${columns.length}`);