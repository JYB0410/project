/**
 * 신규 2편: 제빵기능사 1 + 칼럼 1
 * node scripts/add-column-and-baker-cert-posts.mjs
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

const bakerPost = {
  slug: "baker-cert-mock-three-weeks",
  title: "실기 모의 3주 — 맛보다 제한 시간을 먼저 맞춘 기간",
  subtitle: "시험 6주 전, 주 1회 타이머 모의만 고정했던 이유",
  category: "baker-cert",
  author: "정지석",
  publishedAt: "2026-08-06",
  updatedAt: "2026-08-06",
  featured: true,
  status: "published",
  excerpt:
    "2025년 3월 말~4월, 시험 약 6주 전부터 실기 모의를 주 1회 타이머로 고정했습니다. 맛·모양보다 제한 시간 안에 끝내는 연습이 먼저였고, 그 3주 동안 맞춘 순서와 줄인 욕심을 정리합니다.",
  sections: [
    {
      id: "why-mock",
      heading: "h2",
      title: "모의를 '시험 직전 한 번'으로 두지 않은 이유",
      content: `<p>2025년 3월 말, 학원 강사님이 “이제 시간 재기 들어가자”고 말씀하셨을 때, 저는 아직 품목 완성도에 매달려 있었습니다. 반죽 종료 온도는 메모에 잡히기 시작했지만, <strong>시작부터 완성까지 한 번에 재 본 적</strong>이 거의 없었습니다.</p>
<p>시험 당일 한 번만 모의하겠다고 미루면, 실패해도 고칠 주가 없습니다. 그래서 저는 시험 약 6주 전부터 <strong>주 1회 모의</strong>를 고정 루틴으로 넣었습니다. 나머지 날은 약한 공정만 반복하고, 모의 날만 ‘시험처럼’ 돌렸습니다.</p>
<p>이 글은 최신 시험 시간표를 대신하지 않습니다. 2024~2025 제 경험 기준이며, 제한 시간·품목은 반드시 공식 공고를 확인하세요. 상세 실기 실수는 <a href="baker-cert-practical-mistakes.html">3편</a>, 당일 흐름은 <a href="baker-cert-exam-day-pass.html">5편</a>에 있습니다.</p>
<p>모의 첫 주는 제한 시간을 10분 이상 넘겼습니다. 두 번째 주에는 5분 안쪽, 세 번째 주에는 겨우 맞춰 끝났습니다. 점수가 아니라 <strong>끝난 시각</strong>이 목표가 되면서, 연습의 질문이 바뀌었습니다.</p>`
    },
    {
      id: "three-week-plan",
      heading: "h2",
      title: "3주 프레임 — 주마다 하나만 고쳤다",
      content: `<p>모의 3주를 한꺼번에 ‘완벽 모의’로 만들지 않았습니다. 주마다 고치는 포인트를 하나로 잡았습니다.</p>
<ul>
<li><strong>1주 차</strong> — 타이머만 켠다. 맛·모양 욕심 금지. 어디서 막히는지 한 줄 메모.</li>
<li><strong>2주 차</strong> — 성형·봉합·무게 확인 순서만 고정. 반죽 레시피는 바꾸지 않음.</li>
<li><strong>3주 차</strong> — 정리·세척·제출 준비까지 포함해 끝 시각을 맞춤.</li>
</ul>
<p>1주 차에서 가장 많이 막힌 구간은 <strong>성형 후 무게 재기와 판 배치</strong>였습니다. 반죽은 익숙한데, 저울에 올렸다 내리는 동선이 시험 루트에 없었습니다. 2주 차부터는 성형 직후 저울 → 판 → 2차 발효 자리를 한 줄로 적어 벽에 붙였습니다.</p>
<p>3주 차는 ‘굽기 끝’이 아니라 <strong>도구 정리·이름표·제출 동선</strong>까지 타이머 안에 넣었습니다. 학원 모의에서도 끝 5분이 비는 사람이 많았고, 저는 그 5분을 미리 빼 두는 편이 마음이 편했습니다.</p>
<p>월별 큰 그림은 <a href="baker-cert-8month-roadmap.html">8개월 로드맵</a>에, 한 장 요약은 <a href="baker-cert-one-page-cheatsheet.html">치트시트</a>에 있습니다. 이 글은 그중 ‘후반 6주’만 깊게 자른 기록입니다.</p>`
    },
    {
      id: "what-i-cut",
      heading: "h2",
      title: "모의 날 일부러 뺀 것",
      content: `<p>모의 날에는 새 품목·새 장식·새 레시피를 넣지 않았습니다. 한 번이라도 익숙한 루트만 돌렸습니다. 이유는 단순합니다. <strong>시간 연습에 변수 두 개를 넣으면</strong> 시간이 부족했는지, 손이 서툴렀는지 구분이 안 됩니다.</p>
<p>영상으로 본 ‘더 예쁜 성형’도 모의 주에는 금지했습니다. 평일 연습에서 한 번 시도해 보고, 모의에는 넣지 않았습니다. 합격 후 돌아보면, 그 금지 규칙이 가장 도움이 됐습니다.</p>
<p>모의 전날 6시간 연습도 하지 않았습니다. <a href="baker-cert-exam-day-pass.html">5편</a>에 적은 것처럼 손목이 다음 날로 넘어갑니다. 모의 전날은 도구 점검·준비물 사진 한 장·필기 오답 20문항 정도로 줄였습니다.</p>
<p>가족에게는 “오늘은 실험 빵이 아니라 시간 연습”이라고 미리 말했습니다. 시식 평가를 받지 않아, 피드백이 ‘맛’으로 흐르지 않게 했습니다. 실패 빵 나누기는 <a href="../columns/sharing-failed-bread.html">칼럼</a>에 따로 적었습니다.</p>`
    },
    {
      id: "timer-rules",
      heading: "h2",
      title: "타이머 규칙 네 가지",
      content: `<p>제가 모의에 쓴 타이머 규칙은 아래와 같습니다. 시험장 알람과 소리가 달라도, ‘중간에 멈추는 습관’을 줄이는 데 목적이 있었습니다.</p>
<ol>
<li><strong>시작 전 한 번만 맞춘다</strong> — 중간에 분을 늘리지 않는다.</li>
<li><strong>구간 알람 2개</strong> — 성형 시작 전, 굽기 넣기 전. 너무 많으면 손이 멈춘다.</li>
<li><strong>멈춘 구간을 적는다</strong> — “어디를 봤는지”가 아니라 “손이 몇 초 멈췄는지”.</li>
<li><strong>끝난 뒤 5분 메모</strong> — 초과 분, 약한 공정, 다음 주 하나만.</li>
</ol>
<p>휴대폰 진동만 쓰다가 학원 모의에서 큰 알람에 놀란 적이 있습니다. 그다음부터 집 모의도 소리 알람으로 바꿨습니다. 작은 차이 같아도, 시험장에서 손이 멈추는 순간을 줄였습니다.</p>
<p>집 오븐과 학원 오븐 시간 차이는 <a href="../columns/home-oven-temperature-notes.html">오븐 온도 칼럼</a>처럼 별도 메모로 뒀습니다. 모의의 목적은 오븐 보정 실험이 아니라 <strong>동선·순서</strong>였습니다.</p>`
    },
    {
      id: "scoreboard",
      heading: "h2",
      title: "3주 메모에 남긴 숫자 (제 기준)",
      content: `<p>모의 점수는 없었습니다. 대신 표 네 칸만 썼습니다.</p>
<ul>
<li>시작~끝 총 분 (제한 대비 초과/여유)</li>
<li>가장 느린 공정 한 줄</li>
<li>성형 후 무게 편차 (대략)</li>
<li>다음 주 고칠 것 하나만</li>
</ul>
<p>1주 차: 초과 약 12분, 느린 공정=성형 후 판 배치, 다음 주=저울 동선.</p>
<p>2주 차: 초과 약 4분, 느린 공정=2차 발효 중 정리 미루기, 다음 주=굽기 전 5분 정리 시작.</p>
<p>3주 차: 여유 약 2분, 느린 공정=세척, 다음 주=세척 도구 위치 고정.</p>
<p>숫자가 절대 기준은 아닙니다. 학원 품목·반죽량이 다르면 분도 달라집니다. 다만 <strong>주마다 초과 분이 줄어드는 방향</strong>만 보면, 모의가 의미가 있었는지 판단하기 쉬웠습니다.</p>
<p>필기 오답 루틴은 모의 주에도 끊지 않았습니다. 수·목 45분은 유지하고, 모의는 토 또는 학원 있는 날로 잡았습니다. 필기만 몰아 넣는 주는 피했습니다. 자세한 필기 습관은 <a href="baker-cert-written-tips.html">4편</a>에 있습니다.</p>`
    },
    {
      id: "common-traps",
      heading: "h2",
      title: "모의할 때 빠지기 쉬운 함정",
      content: `<p>첫 번째 함정은 <strong>모의 직후 새 레시피 검색</strong>입니다. 시간이 부족했을 때 “레시피가 문제”로 결론 내리기 쉽습니다. 저는 모의 날 저녁에는 검색을 닫고, 메모 네 칸만 채웠습니다.</p>
<p>두 번째는 <strong>매일 모의</strong>입니다. 손이 늘기 전에 피로가 먼저 왔습니다. 주 1회가 적당했고, 평일은 약한 공정 반복이 더 효율적이었습니다.</p>
<p>세 번째는 <strong>합격 직후처럼 예쁘게 찍기</strong>입니다. 모의 빵 사진에 시간을 쓰면 정리 시간이 밀립니다. 사진은 단면 한 장만, 그것도 시간이 남았을 때만 찍었습니다.</p>
<p>네 번째는 집 오븐 보정과 모의를 같은 날 섞는 것입니다. 보정 실험은 다른 날, 모의는 동선만. 이 구분이 나중에 밤식빵 R&amp;D의 “변수 하나” 규칙으로 이어졌습니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "지금 일정이 6주 안쪽인 분께",
      content: `<p>남은 기간이 6주보다 짧아도, “주 1회 타이머 모의” 자체는 가져갈 수 있습니다. 다만 새 품목을 늘리기보다 <strong>이미 익숙한 루트</strong>만 돌리세요.</p>
<p>학원 없이 준비 중이시면, 집에서도 타이머·저울·스크래퍼 위치를 시험처럼 고정해 보세요. 오븐 차이는 메모로 보완하고, 모의의 목표는 여전히 동선입니다.</p>
<p>손목이 아프면 모의 주를 미루는 편이 낫습니다. 무리한 하루가 다음 주 전체를 무너뜨린 적이 있습니다. 루틴 복구는 <a href="../columns/quit-job-weekly-routine.html">퇴사 후 루틴 칼럼</a>과 같은 크기(작게 재개)로 가져갔습니다.</p>
<p>다른 회차·학원 일정과 다르면 <a href="../contact/">문의</a>로 알려 주세요. 확인 후 이 글에 수정일을 남기겠습니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "실전 적용 노트",
      content: `<p>이번 주 할 일 한 줄: 달력에 <strong>모의 날 한 칸</strong>을 먼저 씁니다. 그날 전후로 새 품목을 넣지 않습니다.</p>
<p>모의 체크리스트(짧게): 타이머 소리 확인 / 도구 사진 한 장 / 성형→저울→판 순서 메모 / 끝 5분 정리 예약 / 끝난 뒤 네 칸 메모.</p>
<p>시리즈 안내는 <a href="baker-cert-series-roadmap.html">6편 목차</a>, 한 장 요약은 <a href="baker-cert-one-page-cheatsheet.html">치트시트</a>입니다. 이 글은 후반 실기 준비용 보충 편으로 읽으면 됩니다.</p>
<p>모의 3주가 끝난 뒤에도, 시험 직전 주에는 ‘새 변수’를 넣지 않았습니다. 마지막 주 모의는 시간을 맞추는 확인용이지, 실험용이 아니었습니다. 합격 당일 메모는 <a href="baker-cert-exam-day-pass.html">5편</a>에 이어집니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "정리하며",
      content: `<p>모의 3주는 맛을 완성하는 기간이 아니라, <strong>제한 시간 안에 익숙한 루트를 끝내는</strong> 기간이었습니다. 초과 분이 줄어들수록 시험 전 불안도 같이 줄었습니다.</p>
<p>환경·회차가 다르면 분과 순서가 달라질 수 있습니다. 가져가실 것은 숫자 복사가 아니라 “주 1회, 변수 최소, 끝 시각 기록” 습관입니다.</p>`
    }
  ],
  summary:
    "시험 약 6주 전 주 1회 실기 모의 3주 루틴. 주마다 고칠 점 하나, 모의 날 새 레시피 금지, 타이머 규칙과 초과 분 메모, 함정과 적용 방법을 정리했습니다.",
  commonMistakes: [
    "시험 직전 한 번만 모의하고 끝내기",
    "모의 날 새 품목·새 장식 넣기",
    "모의 전날 장시간 연습으로 손목 소모",
    "초과 분만 보고 레시피를 바로 바꾸기"
  ],
  checklist: [
    "달력에 모의 날 주 1회 표시",
    "타이머 소리·구간 알람 2개 설정",
    "성형→저울→판 순서 한 줄 메모",
    "모의 직후 네 칸 메모 (총 분·느린 공정·무게·다음 주 하나)"
  ],
  relatedSlugs: [
    "baker-cert-practical-mistakes",
    "baker-cert-exam-day-pass",
    "baker-cert-8month-roadmap",
    "baker-cert-one-page-cheatsheet"
  ],
  faq: [
    {
      q: "모의는 몇 주 전부터가 좋나요?",
      a: "저는 약 6주 전, 주 1회로 3주를 돌렸습니다. 기간이 짧아도 주 1회 원칙은 유지하는 편이 낫습니다."
    },
    {
      q: "집에서만 모의해도 되나요?",
      a: "됩니다. 오븐 차이는 메모로 두고, 모의 목표는 동선·시간입니다. 가능하면 학원 모의와 집 모의를 번갈아 보세요."
    },
    {
      q: "모의 빵 맛이 별로면 실패한 건가요?",
      a: "모의 주의 1차 목표는 끝 시각입니다. 맛은 평일 약한 공정 반복에서 보완하는 편이 원인 분리가 쉽습니다."
    }
  ]
};

const column = {
  slug: "tools-first-month-keep",
  title: "저울·온도계·타이머 — 학원 첫 달 장바구니에서 남긴 세 가지",
  subtitle: "공구 욕심을 줄이고, 기록에 쓰는 도구만 고른 기준",
  author: "정지석",
  publishedAt: "2026-08-11",
  updatedAt: "2026-08-11",
  status: "published",
  excerpt:
    "제빵기능사 학원 첫 달, 추천 목록을 따라 사다 보니 서랍이 찼습니다. 합격 후에도 매일 쓴 것은 저울·반죽 온도계·타이머 세 가지였습니다. 무엇을 남기고 무엇을 접었는지 기준을 적습니다.",
  perspective:
    "도구는 ‘있으면 좋을 것’이 아니라 ‘메모에 숫자가 남는 것’이어야 했습니다. 예쁜 스크래퍼보다, 같은 위치에서 같은 단위로 재는 습관이 더 오래 갔습니다.",
  sections: [
    {
      id: "cart-chaos",
      heading: "h2",
      title: "첫 달 장바구니가 과해진 이유",
      content: `<p>2024년 9월 학원 등록 직후, 추천 목록·커뮤니티·영상 하단 링크를 따라 장바구니를 채웠습니다. 스크래퍼 여러 개, 계량스푼 세트, 예쁜 발효 바구니, 오븐 온도계, 반죽 온도계, 저울 두 개… 결제는 빨랐고, 주방 서랍은 곧 닫히지 않았습니다.</p>
<p>문제는 도구가 늘수록 <strong>무엇을 기록할지</strong>가 흐려진 점이었습니다. 새 스크래퍼를 쓰는 날과 안 쓰는 날의 차이를 메모에 남기지 못했고, “장비가 부족해서”라는 문장만 늘었습니다.</p>
<p>한 달 뒤 정리할 때 기준을 바꿨습니다. <strong>메모 한 줄에 숫자를 남기는 도구</strong>만 남긴다. 그 기준에서 살아남은 것이 저울·반죽 온도계·타이머였습니다.</p>
<p>기능사 실기 메모 양식은 <a href="../posts/baker-cert-practical-mistakes.html">3편</a>에, 집 오븐 다이얼 대응은 <a href="home-oven-temperature-notes.html">오븐 칼럼</a>에 있습니다. 이 글은 ‘무엇을 사야 하나’가 아니라 ‘무엇을 매일 쓰게 됐나’에 가깝습니다.</p>`
    },
    {
      id: "scale",
      heading: "h2",
      title: "저울 — 계량만이 아니라 성형 후 확인",
      content: `<p>저울은 재료 계량용으로만 쓰면 절반만 쓰는 셈이었습니다. 실기에서 편차를 줄인 순간은 <strong>성형 직후 한 번 더</strong> 올렸을 때였습니다. 같은 반죽인데 470g·500g이 섞이면, 굽기 전에 이미 규격이 흔들립니다.</p>
<p>집 저울과 학원 저울 오차를 한 번 비교해 보세요. 5g 안쪽이면 습관으로 흡수되고, 그 이상이면 메모에 “집 저울 +3g”처럼 적어 두는 편이 낫습니다. 시험장 저울을 믿을 때도, 집 연습 기록이 같은 단위로 쌓여 있어야 손이 덜 흔들립니다.</p>
<p>배터리·영점 습관도 도구 성능만큼 중요했습니다. 영점을 안 맞춘 날 메모는 나중에  compar 가치가 없었습니다. 모의 전 체크에 ‘저울 영점’ 한 줄을 넣은 것은 <a href="../posts/baker-cert-mock-three-weeks.html">모의 3주</a> 글과 같은 시기의 습관입니다.</p>
<p>두 번째 저울을 샀다가 접은 이유는 단순합니다. 단위( g )와 위치가 달라 메모가 두 갈래가 됐습니다. 하나의 저울을 고정 자리에 두는 편이 기록에 유리했습니다.</p>`
    },
    {
      id: "thermo",
      heading: "h2",
      title: "반죽 온도계 — 손감만 믿던 달을 끝낸 도구",
      content: `<p>학원 초반 가장 값진 구매는 반죽 온도계였습니다. “따뜻하다”는 메모는 24°C와 28°C를 구분하지 못합니다. 겨울 물 온도·실내 온도·반죽 종료 온도를 한 줄에 적기 시작하면서, 같은 레시피의 다른 결과가 설명되기 시작했습니다.</p>
<p>오븐 온도계도 샀지만, 매일 쓰진 않았습니다. 집 오븐 보정은 주 1~2회면 충분했고, 반죽 온도는 <strong>반죽할 때마다</strong> 필요했습니다. 예산이 빠듯하면 반죽 온도계를 먼저, 오븐 온도계는 그다음이 제 순서였습니다.</p>
<p>온도계 끝 위치를 날마다 다르게 찌르면 숫자 비교가 어렵습니다. 저는 반죽 중앙 쪽으로 같은 깊이를 유지하려 했고, 메모에 “중심”이라고만 적어도 나중에 읽기가 수월했습니다.</p>
<p>합격 후 밤식빵 R&amp;D에서도 같은 온도계를 씁니다. 변수 하나를 바꿀 때 반죽 종료 온도가 빠지면, 실패 원인이 토핑인지 반죽인지 섞입니다. <a href="../posts/bread-rd-night-bread-practical-guide.html">실전 정리</a>의 메모 양식에도 온도 줄이 남아 있는 이유입니다.</p>`
    },
    {
      id: "timer",
      heading: "h2",
      title: "타이머 — 발효 분과 모의 끝 시각",
      content: `<p>타이머는 발효 “몇 분”을 재는 도구이기도 하고, 모의 날 <strong>끝 시각</strong>을 재는 도구이기도 합니다. 휴대폰만으로 충분했지만, 화면이 꺼지거나 알림이 무음이면 구간을 놓쳤습니다. 주방 전용 타이머 하나를 고정해 둔 뒤로는 손이 덜 멈추었습니다.</p>
<p>알람을 너무 많이 넣으면 오히려 집중이 깨집니다. 모의 때는 시작 한 번 + 구간 두 개 정도가 上限이었습니다. 평일 발효는 1차·2차 알람만.</p>
<p>퇴사 후 루틴이 무너진 날에도 타이머 45분(필기)만 지키면 최소한의 하루가 남았습니다. <a href="quit-job-weekly-routine.html">루틴 칼럼</a>의 ‘작게 재개’와 같은 크기입니다.</p>
<p>시험장 소리와 집 소리의 차이는 한 번 겪어 보는 편이 낫습니다. 모의 3주 동안 소리 알람으로 바꾼 이야기는 <a href="../posts/baker-cert-mock-three-weeks.html">모의 글</a>에 적어 두었습니다.</p>`
    },
    {
      id: "what-i-folded",
      heading: "h2",
      title: "접었거나 미룬 것",
      content: `<p>예쁜 발효 용기 여러 개, 계량스푼 풀세트, 장식용 도구는 서랍으로 내려갔습니다. 기능사 범위 안에서는 저울 g 단위가 더 중요했고, 스푼은 집에 있는 것만으로도 복습이 됐습니다.</p>
<p>스탠드 믹서는 당시 사지 않았습니다. 학원 환경과 손 반죽 감각을 맞추는 기간이 우선이었고, 예산도 나눠 쓰고 싶었습니다. 나중에 필요해지면 사도 늦지 않았습니다.</p>
<p>“공구가 없어서 망했다”는 문장이 메모에 세 번 이상 나오면, 그때만 구매를 다시 검토했습니다. 한 번 망한 날의 감정 구매는 대부분 서랍행이었습니다.</p>
<p>완성 그램 표를 사이트에 올리지 않는 이유(<a href="why-no-complete-recipe.html">칼럼</a>)와 비슷합니다. 도구 추천도 제 주방·제 회차 기준이라, 목록 복붙보다 <strong>기록에 남는 최소 세트</strong>를 권하는 쪽에 가깝습니다.</p>`
    },
    {
      id: "checklist-buy",
      heading: "h2",
      title: "사기 전에 물어본 세 질문",
      content: `<ol>
<li>이 도구 없이 메모에 남길 숫자가 사라지는가?</li>
<li>주 3회 이상 쓸 자리(고정 위치)가 있는가?</li>
<li>학원·집·시험장에서 같은 단위로 비교 가능한가?</li>
</ol>
<p>세 질문 중 두 개 이상 “아니오”면 그 달은 사지 않았습니다. 스크래퍼는 이미 학원 것이 있어 추가 구매 우선순위가 낮았고, 반죽 온도계는 세 질문 모두 “예”에 가까웠습니다.</p>
<p>중고·저가 제품이어도 됩니다. 중요한 것은 브랜드보다 <strong>같은 자리·같은 단위</strong>입니다. 오븐 온도계는 저가로 시작해도 대응표를 만들 수 있었습니다.</p>`
    },
    {
      id: "for-readers",
      heading: "h2",
      title: "지금 장바구니를 비우고 싶은 분께",
      content: `<p>이미 산 도구를 버릴 필요는 없습니다. 다만 이번 주 연습부터 <strong>저울·온도계·타이머 숫자만</strong> 메모에 남겨 보세요. 일주일 뒤 메모를 읽었을 때 비교가 되면, 그 세 가지는 역할을 한 것입니다.</p>
<p>기능사 준비 초반이라면 로드맵(<a href="../posts/baker-cert-8month-roadmap.html">2편</a>)과 함께, “도구 쇼핑 주”를 따로 두지 않는 편이 루틴 유지에 도움이 됐습니다. 쇼핑에 쓴 반나절이 반죽 1회를 밀어낸 적도 있습니다.</p>
<p>다른 환경에서 꼭 필요했던 도구가 있으면 <a href="../contact/">문의</a>로 알려 주세요. 공통으로 반복되면 이 칼럼에 수정일로 보완하겠습니다.</p>`
    },
    {
      id: "practice-notes",
      heading: "h2",
      title: "이번 주 적용하기",
      content: `<p>서랍에서 저울·반죽 온도계·타이머만 꺼내 고정 자리에 두세요. 나머지 도구는 한 주 동안 서랍 밖으로 나오지 않게 해 보세요.</p>
<p>다음 반죽 때 메모 한 줄 예시: 물 ○°C / 실내 ○°C / 반죽 종료 ○°C / 1차 ○분 / 성형 후 ○g / 굽기 ○분.</p>
<p>모의 날이 있다면 시작 전 저울 영점·타이머 소리만 확인하면 됩니다. 새 공구를 모의 날 개봉하지 마세요.</p>
<p>합격 후에도 같은 세 가지가 R&amp;D 일지 숫자 줄의 뼈대입니다. 도구를 늘리기 전에, 지금 세 가지로 한 달을 채워 보는 쪽을 권합니다.</p>`
    },
    {
      id: "editor-note",
      heading: "h2",
      title: "편집 메모",
      content: `<p>이 글은 특정 제품을 광고하지 않습니다. 모델명·링크 없이, 역할만 적었습니다. 주방·예산·학원 규칙이 다르면 최소 세트가 달라질 수 있습니다.</p>
<p>본문 글과 연결: 실기 메모 <a href="../posts/baker-cert-practical-mistakes.html">3편</a>, 모의 루틴 <a href="../posts/baker-cert-mock-three-weeks.html">모의 3주</a>, 오븐 대응 <a href="home-oven-temperature-notes.html">오븐 칼럼</a>.</p>`
    }
  ],
  summary:
    "학원 첫 달 과한 장바구니를 정리하며 남긴 저울·반죽 온도계·타이머. 메모에 숫자가 남는 기준으로 고른 이유, 접은 도구, 구매 전 세 질문, 적용 방법을 정리했습니다.",
  relatedSlugs: [
    "baker-cert-practical-mistakes",
    "baker-cert-mock-three-weeks",
    "baker-cert-8month-roadmap"
  ]
};

// Fix typo in scale section
column.sections[1].content = column.sections[1].content.replace(
  "나중에  compar 가치",
  "나중에 비교할 가치"
);

const posts = load("data/posts.js", "POSTS_DATA");
const columns = load("data/columns.js", "COLUMNS_DATA");

if (posts.some((p) => p.slug === bakerPost.slug)) {
  console.error("post already exists:", bakerPost.slug);
  process.exit(1);
}
if (columns.some((c) => c.slug === column.slug)) {
  console.error("column already exists:", column.slug);
  process.exit(1);
}

const bn = postCharCount(bakerPost);
const cn = postCharCount(column);
console.log(`baker chars (no space): ${bn}`);
console.log(`column chars (no space): ${cn}`);
if (bn < 2000 || cn < 2000) {
  console.error("under 2000 chars");
  process.exit(1);
}

// Cross-link from existing hub posts (light touch)
const cheatsheet = posts.find((p) => p.slug === "baker-cert-one-page-cheatsheet");
if (cheatsheet && !cheatsheet.relatedSlugs.includes(bakerPost.slug)) {
  cheatsheet.relatedSlugs = [...(cheatsheet.relatedSlugs || []).slice(0, 4), bakerPost.slug].slice(0, 5);
}
const practical = posts.find((p) => p.slug === "baker-cert-practical-mistakes");
if (practical && !practical.relatedSlugs.includes(bakerPost.slug)) {
  practical.relatedSlugs = [bakerPost.slug, ...(practical.relatedSlugs || [])].slice(0, 5);
}

posts.push(bakerPost);
columns.unshift(column); // newest column near top of data (list sort uses date)

save("data/posts.js", "POSTS_DATA", posts);
save("data/columns.js", "COLUMNS_DATA", columns);
console.log("✓ added", bakerPost.slug, "and", column.slug);
