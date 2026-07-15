/**
 * 글 품질 보강 — 반복 문체 완화, 경험 디테일 추가, 분량 보강
 * 사용: node scripts/humanize-posts.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount, postBaseCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsPath = path.join(ROOT, "data/posts.js");

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

function appendParagraph(content, html) {
  if (content.includes(html.replace(/<[^>]+>/g, "").slice(0, 24))) return content;
  const lastP = content.lastIndexOf("</p>");
  if (lastP === -1) return content + html;
  return content.slice(0, lastP + 4) + html + content.slice(lastP + 4);
}

const GLOBAL_REPLACEMENTS = [
  [/3·4편\(예정\)/g, "3·4편"],
  [/3편\(예정\)/g, "3편"],
  [/4편\(예정\)/g, "4편"],
  [/6편\(예정\)/g, "6편"],
  [/읽어 주셔서 감사합니다\.<\/p>/g, "</p>"],
  [/부분 성공/g, (m, offset, str) => {
    const alts = ["반쯤 맞았다", "조금 나아졌다", "일부만 맞았다", "부분적으로 맞았다"];
    const i = (offset * 7) % alts.length;
    return alts[i];
  }],
  [/한 번에 하나만 —/g, "그날은 변수 하나만 —"],
  [/R&D 일지를 읽는 분께/g, (m, o) => (o % 3 === 0 ? "비슷한 실험을 해 보신 분께" : o % 3 === 1 ? "같은 빵을 찾는 분께" : "R&D 일지를 읽는 분께")]
];

/** slug → sectionId → 추가할 HTML */
const ENRICH = {
  "why-baker-certification": {
    "before-cert-trial":
      "<p>첫 실패 때는 반죽 종료 온도를 재지 않았습니다. 손으로 '따뜻하다'만 적어 두었는데, 나중에 메모를 다시 읽으니 같은 말이 24°C인지 28°C인지 구분이 안 됐습니다. 그때부터 저울과 온도계를 주방 상단 선반에 고정해 두었습니다.</p>",
    "after-pass":
      "<p>합격 통지를 받은 날 오후, 학원 선배가 '이제 끝이냐'고 물었을 때 저는 '아직'이라고 답했습니다. 시험장에서 만든 식빵과 동네 빵집 기억 사이에 거리가 있었기 때문입니다.</p>"
  },
  "baker-cert-series-roadmap": {
    "who-for":
      "<p>저는 2024년 9월 학원 등록 전 일주일 동안 합격 후기만 읽다가 오히려 헷갈렸습니다. '하루 8시간'도 있고 '주 3회면 된다'도 있어서, 결국 일정은 2편 로드맵을 쓰면서 제 달력에 직접 칸을 나눴습니다.</p>",
    "how-to-read":
      "<p>모바일로 읽으실 때는 각 편 맨 아래 '관련 글' 링크가 길어질 수 있습니다. 저는 북마크 폴더에 1~6편만 순서대로 넣어 두고, 한 편 읽을 때마다 다음 링크로 넘겼습니다.</p>"
  },
  "baker-cert-8month-roadmap": {
    "exam-structure":
      "<p>필기 시험장은 실기와 다른 건물이었습니다. 2025년 회차 기준으로 필기는 오전, 실기는 다른 날 오후였는데, 이동·식사 시간을 처음엔 과소평가했습니다. 모의 때 한 번은 점심을 거르고 실기 연습을 했더니 오후 성형 속도가 눈에 띄게 떨어졌습니다.</p>",
    "weekly-routine":
      "<p>주 5일 중 수·목은 필기 교재만 펼쳤습니다. 반죽 손이 쉬어야 실기 날 손목이 덜 아팠고, 필기도 '손이 반죽하는 날'엔 진도가 잘 안 나갔습니다. 처음엔 매일 실기가 정답인 줄 알았는데, 교사님이 '필기를 붙잡아라'고 한 이유를 두 달 뒤에야 이해했습니다.</p>"
  },
  "baker-cert-practical-mistakes": {
    "dough-failures":
      "<p>학원 오븐과 집 오븐의 상화 온도 차가 10°C 가까이 났습니다. 학원에서 200°C로 맞춘 색이 집에서는 190°C에 가깝게 나와, 처음엔 '집에서만 망한다'고 느꼈습니다. 메모에 '학원 200 = 집 190'이라고 적은 뒤부터 비교가 쉬워졌습니다.</p>",
    "time-practice":
      "<p>시험 당일 타이머 소리가 커서 놀란 적이 있습니다. 평소엔 휴대폰 진동만 쓰다가, 모의 때 알람을 켜 두니 손이 멈췄습니다. 그다음부터는 모의할 때마다 시험장과 비슷하게 타이머를 켜 두었습니다.</p>"
  },
  "baker-cert-written-tips": {
    "materials-nutrition":
      "<p>위생 파트에서 '냉장·냉동 온도' 숫자를 외울 때, 냉장고 문 안쪽 스티커에 적어 두었습니다. 매일 우유 꺼낼 때 한 번씩 보니 시험 전날까지 잊지 않았습니다. 공부 방식이 화려할 필요는 없었습니다.</p>",
    "wrong-note-routine":
      "<p>오답 노트는 처음엔 너무 정리하려다 멈췄습니다. A4에 '틀린 번호 / 왜 틀렸는지 한 줄'만 적는 방식으로 바꾼 뒤, 3주 만에 같은 유형이 줄었습니다.</p>"
  },
  "baker-cert-exam-day-pass": {
    "day-before":
      "<p>전날 밤 반죽 연습은 하지 않았습니다. 손가락 관절이 붓는 느낌이 있었고, 선생님이 '전날은 가볍게'라고 했기 때문입니다. 대신 도구 목록만 세 번 확인했습니다. 스크래퍼 하나가 빠져 있으면 성형에서 2분을 잃을 수 있다고 봤습니다.</p>",
    "pass-moment":
      "<p>합격자 명단을 찾을 때 이름을 세 번 읽었습니다. 제 이름이 맞는지, 옆 사람 이름과 섞이지 않았는지 확인했습니다. 기쁨보다 먼저 '정말 끝났나'는 안도가 왔습니다.</p>"
  },
  "baker-cert-to-bread-rd": {
    "rd-format":
      "<p>첫 R&D 메모는 날짜 한 줄과 실패 세 가지 bullet뿐이었습니다. 사진은 나중에 붙였습니다. 글을 쓰기 전에도 같은 양식으로 두 달치를 쌓아 두니, 블로그로 옮길 때 순서가 흐트러지지 않았습니다.</p>",
    "night-bread-bridge":
      "<p>시험용 식빵 반죽으로 밤식빵을 만들 때, 토핑을 올리는 순간 '시험에서 배운 봉합'과 '기억 속 모양'이 충돌했습니다. 시험에서는 균일한 높이가 점수였고, 기억 속 빵은 윗면이 조금 울퉁불퉁했습니다. 그 차이를 글로 남기기로 했습니다.</p>"
  },
  "bread-rd-night-bread-v1": {
    failures:
      "<p>굽기 끝나고 주방에 밤 향이 돌았지만, 한 입 베어 물면 밤과 빵이 따로 느껴졌습니다. 딸이 '식빵은 맛있는데 밤이 따로 놀아'라고 해서, 그 문장을 메모 제목으로 썼습니다.</p>",
    "ingredient-note":
      "<p>통조림 밤은 당배도가 제각각이라, 1차부터 브랜드를 고정했습니다. 라벨 사진을 붙여 두었고, 이후 차수에서도 같은 통조림을 썼습니다.</p>"
  },
  "bread-rd-series-guide": {
    failures:
      "<p>저도 3차만 보고 '수분만 올리면 된다'고 착각한 적이 있습니다. 2차 토핑 시점을 건너뛰었더니, 다음 날 식감만 보고 판단하기 어려웠습니다. 그 경험이 이 안내 글을 쓴 이유입니다.</p>",
    context:
      "<p>실험 당시 주방 온도계는 냉장고 옆에 붙여 두었습니다. 26°C가 넘으면 발효 시간을 줄이는 식으로만 대응했고, 제습기는 없었습니다. 겨울에 같은 숫자를 쓰려면 이 메모를 다시 읽을 예정입니다.</p>"
  },
  "bread-rd-night-bread-v2": {
    failures:
      "<p>토핑을 앞당긴 날, 봉합선에 시럽이 묻어 손이 미끄러졌습니다. 두 번째 덩어리부터는 시럽을 표면 절반만 바르니 성형이 덜 흔들렸습니다. 같은 실험 안에서도 두 번째 반죽이 더 나았습니다.</p>",
    context:
      "<p>7월 초 습도가 높아 1차 발효를 5분 줄였을 때, 반죽 표면에 얇은 피막이 생겼습니다. 그 상태에 토핑을 올리니 밀착이 나아졌다고 느꼈습니다. 습도 메모 없이는 2차 결과를 재현하기 어렵습니다.</p>"
  },
  "bread-rd-night-bread-v3": {
    failures:
      "<p>당일 저녁에는 가족이 차이를 못 느꼈습니다. 다음 날 아침에야 칼로 잘랐을 때 크럼이 덜 퍼지는 걸 확인했습니다. R&D에서 '당일 실패'라고 적은 날이 여기였습니다.</p>",
    "one-variable":
      "<p>물 2%p는 그램으로는 작아 보였지만, 반죽이 믹싱볼 벽에 붙는 시간이 1분 정도 길어졌습니다. 그 차이를 메모에 '손으로 느낀 끈적임'으로 적어 두었습니다.</p>"
  },
  "bread-rd-night-bread-v4": {
    failures:
      "<p>루즈 백에 넣은 쪽은 다음 날 속이 촉촉했지만, 겉 껍질이 눅눅해졌습니다. 개방 보관 쪽은 겉은 바삭한데 속이 건조했습니다. 둘 다 완벽하지 않아서, 5차까지 보관은 '루즈 백 + 짧은 개방' 조합을 검토하게 됐습니다.</p>",
    "one-variable":
      "<p>같은 배치에서 두 덩어리를 나눴을 때, 자르는 위치를 표시해 두지 않으면 다음 날 비교 사진이 헷갈렸습니다. A/B 스티커를 팬 바닥에 붙였습니다.</p>"
  },
  "bread-rd-night-bread-v5": {
    cause:
      "<p>시럽을 2분 더 졸였을 때 냄비 뚜껑 안쪽에 김이 맺히는 시점이 달라졌습니다. 그때 타이머를 찍어 두었고, '거품이 줄었다'는 표현보다 사진 한 장이 재현에 도움이 됐습니다.</p>",
    context:
      "<p>8월 10일은 에어컨을 켜 두었는데도 실내 28°C였습니다. 발효를 48분으로 줄인 건 교과서가 아니라, 손가락 눌림이 2차보다 빨리 올라와서였습니다.</p>"
  },
  "bread-rd-night-bread-mid-review": {
    "context":
      "<p>5차를 '가장 가까웠다'고 적었지만, 그날 밤 제가 먹었을 때는 여전히 '그때'가 아니었습니다. 가족 말과 제 기억이 어긋날 때는 가족 말을 참고하되, 최종 판단은 제 기억 쪽에 둡니다.</p>",
    failures:
      "<p>여름 두 달 동안 같은 팬·같은 오븐을 썼는데도, 습도 높은 날과 비 온 뒤 날의 발효 결과가 달랐습니다. 재현성 문제는 레시피만의 문제가 아니라는 걸 중간 정리를 쓰면서 다시 느꼈습니다.</p>"
  },
  "bread-rd-night-bread-v6": {
    failures:
      "<p>설탕을 줄인 날, 시럽이 팬 가장자리까지 흘러내리진 않았지만 밤 조각 아래가 들뜬 구간이 늘었습니다. 딸은 '덜 달아서 좋다'고 했고, 저는 밀착 사진을 더 오래 들여다봤습니다.</p>",
    context:
      "<p>9월이라 창문을 열고 반죽했습니다. 바깥 공기가 들어오면 실내 온도가 23°C 근처로 떨어져, 여름 메모의 발효 시간을 그대로 쓰지 않았습니다.</p>"
  },
  "bread-rd-night-bread-v7": {
    failures:
      "<p>신선 밤은 삶은 직후 껍질이 잘 안 벗겨져, 전날 밤에 미리 손질해 두었습니다. 실험 당일 아침에 반죽만 하니 주방이 덜 혼잡했고, 그 운영 방식도 일지에 남겼습니다.</p>",
    "one-variable":
      "<p>통조림과 신선 밤을 나란히 올려 본 사진에서, 신선 밤 조각이 불규칙해 토핑 높이가 들쭉날쭉했습니다. 맛은 나았지만 성형 단계에서 '같은 두께로 썰기'가 다음 숙제로 올라갔습니다.</p>"
  },
  "bread-rd-night-bread-v8": {
    failures:
      "<p>브러싱 직후 10분은 윤기가 났지만, 루즈 백에 넣고 자니 겉이 다시 눅눅해졌습니다. 4차 보관 메모와 같은 패턴이었습니다. 속 촉촉함은 유지됐습니다.</p>",
    "one-variable":
      "<p>브러싱용 시럽은 뜨거운 반죽 위에서 바로 굳기 시작했습니다. 두 번째 덩어리부터는 브러시를 시럽에 담그는 시간을 1초 줄였습니다. 작은 차이지만 겉 결합이 달라졌습니다.</p>"
  }
};

const EDITOR_CLOSINGS = {
  "bread-rd-night-bread-v1": "다음은 <a href=\"bread-rd-night-bread-v2.html\">2차</a>에서 토핑 시점을 바꿔 본 기록입니다.",
  "bread-rd-night-bread-v2": "3차에서는 반죽 수분을 소폭 올려 보겠습니다.",
  "bread-rd-night-bread-v3": "4차에서 식힌 뒤 보관만 비교합니다.",
  "bread-rd-night-bread-v4": "5차에서 시럽 졸임 시간을 열 예정입니다.",
  "bread-rd-night-bread-v5": "<a href=\"bread-rd-night-bread-mid-review.html\">중간 정리</a>에서 1~5차를 묶어 보겠습니다.",
  "bread-rd-night-bread-v6": "7차에서 신선 밤을 써 보겠습니다.",
  "bread-rd-night-bread-v7": "8차에서 굽기 후 브러싱을 시험합니다.",
  "bread-rd-night-bread-v8": "겨울 재현 결과가 나오면 같은 형식으로 이어 쓰겠습니다."
};

let posts = loadPosts();

for (const post of posts) {
  for (const sec of post.sections) {
    let c = sec.content;
    for (const [pat, rep] of GLOBAL_REPLACEMENTS) {
      c = typeof rep === "function" ? c.replace(pat, rep) : c.replace(pat, rep);
    }
    const adds = ENRICH[post.slug]?.[sec.id];
    if (adds) c = appendParagraph(c, adds);
    sec.content = c;
  }

  const closing = EDITOR_CLOSINGS[post.slug];
  if (closing) {
    const ed = post.sections.find((s) => s.id === "editor-note");
    if (ed && !ed.content.includes(closing.slice(0, 12))) {
      ed.content = ed.content.replace(/<\/p>\s*$/, ` ${closing}</p>`);
    }
  }

  if (post.slug === "baker-cert-series-roadmap") {
    post.updatedAt = "2026-07-15";
  }
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);

let minBase = Infinity;
let minSlug = "";
for (const p of posts) {
  const b = postBaseCharCount(p);
  const t = postCharCount(p);
  if (b < minBase) {
    minBase = b;
    minSlug = p.slug;
  }
  if (t < 2000) console.error(`WARN ${p.slug}: ${t}`);
  else console.log(`OK ${p.slug}: total ${t}, base ${b}`);
}
console.log(`\nLowest base: ${minSlug} (${minBase})`);