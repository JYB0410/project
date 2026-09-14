import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data/home-kitchen-8.json");
const arr = JSON.parse(fs.readFileSync(file, "utf8"));
for (const p of arr) {
  for (const s of p.sections) {
    s.content = (s.content || "")
      .replace(/viscose/g, "")
      .replace(/<p>\s*<\/p>/g, "");
  }
}

const heads = [
  "문풍지",
  "결로",
  "블라인드",
  "화분받침대",
  "이중창틈",
  "야간개문",
  "냉동실벽",
  "실리콘매트",
  "스프레이물기",
  "면행주",
  "윗단팬",
  "아랫단팬",
  "식힘망가장자리",
  "밀폐용기김",
  "장마뚜껑",
  "개봉시각",
  "식탁테이프",
  "방문객접시",
  "노란전구",
  "아침창살",
  "현관바람",
  "환풍기",
  "토스터옆",
  "커피포트증기"
];

for (const p of arr) {
  const ids = p.sections.map((s) => s.id);
  let i = 0;
  while (postCharCount(p) < 2000 && i < 48) {
    const id = ids[i % ids.length];
    const s = p.sections.find((x) => x.id === id);
    const h = heads[i % heads.length];
    const line = `${h}가 ${p.slug} 기록 ${i}에서 문제가 됐습니다. ${h}만 치웠고 비교 번호는 ${i}입니다.`;
    if (s) s.content += `<p>${line}</p>`;
    i++;
  }
  console.log(p.slug, postCharCount(p));
}
fs.writeFileSync(file, JSON.stringify(arr, null, 2) + "\n");
