import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(
  "C:/Users/hopet/.grok/sessions/C%3A%5CUsers%5Chopet/019eee0a-3d03-7172-aa33-6e328db96537/images"
);

function load(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  return Function(`return (${code.replace(`window.${varName} = `, "").replace(/;\s*$/, "")})`)();
}
function save(file, varName, data) {
  fs.writeFileSync(path.join(ROOT, file), `window.${varName} = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function cp(num, destRel) {
  const dest = path.join(ROOT, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(SRC, `${num}.jpg`), dest);
}

const copies = [
  [41, "assets/images/photos/baker-cert-series-roadmap/series-purpose.jpg"],
  [41, "assets/images/photos/baker-cert-practical-mistakes/intro.jpg"],
  [41, "assets/images/photos/baker-cert-practical-mistakes/dough-failures.jpg"],
  [42, "assets/images/photos/baker-cert-practical-mistakes/fermentation-failures.jpg"],
  [43, "assets/images/photos/baker-cert-practical-mistakes/shaping-failures.jpg"],
  [43, "assets/images/photos/baker-cert-to-bread-rd/tools-and-log.jpg"],
  [44, "assets/images/photos/baker-cert-practical-mistakes/baking-failures.jpg"],
  [45, "assets/images/illustrations/exam-items/exam-item-sweet-roll-approach.jpg"],
  [46, "assets/images/photos/baker-cert-practical-mistakes/time-practice.jpg"],
  [46, "assets/images/illustrations/home-kitchen/kitchen-bench-timer-place.jpg"],
  [47, "assets/images/photos/why-baker-certification/childhood-bread.jpg"],
  [47, "assets/images/photos/bread-rd-night-bread-practical-guide/goal.jpg"],
  [47, "assets/images/photos/baker-cert-to-bread-rd/intro.jpg"],
  [47, "assets/images/photos/baker-cert-to-bread-rd/night-bread-bridge.jpg"],
  [48, "assets/images/photos/why-baker-certification/after-pass.jpg"],
  [48, "assets/images/photos/baker-cert-exam-day-pass/pass-moment.jpg"],
  [48, "assets/images/photos/baker-cert-one-page-cheatsheet/goal.jpg"],
  [48, "assets/images/illustrations/exam-items/exam-item-white-bread-fail-points.jpg"],
  [49, "assets/images/illustrations/rd/pan-liner-vs-bare.jpg"],
  [50, "assets/images/illustrations/home-kitchen/cooling-rack-overnight.jpg"],
  [51, "assets/images/photos/baker-cert-written-tips/materials-nutrition.jpg"],
  [51, "assets/images/illustrations/home-kitchen/flour-tin-monsoon.jpg"],
  [52, "assets/images/photos/baker-cert-8month-roadmap/exam-structure.jpg"],
  [52, "assets/images/photos/baker-cert-written-tips/intro.jpg"],
  [52, "assets/images/photos/baker-cert-exam-day-pass/intro.jpg"],
  [52, "assets/images/photos/baker-cert-one-page-cheatsheet/exam-structure.jpg"],
  [52, "assets/images/photos/baker-cert-one-page-cheatsheet/exam-day.jpg"],
  [52, "assets/images/illustrations/baker/written-exam-desk.jpg"],
  [53, "assets/images/illustrations/rd-diaries/bread-rd-night-bread-v4.jpg"],
  [54, "assets/images/illustrations/home-kitchen/heating-on-fermentation-home.jpg"],
  [55, "assets/images/illustrations/rd-diaries/bread-rd-night-bread-v8.jpg"],
  [56, "assets/images/illustrations/rd-diaries/bread-rd-night-bread-v1.jpg"],
  [42, "assets/images/illustrations/exam-items/exam-item-fermentation-poke-not-minutes.jpg"],
  [42, "assets/images/illustrations/exam-items/second-proof-poke.jpg"],
  [43, "assets/images/illustrations/exam-items/exam-item-scale-after-shaping.jpg"],
  [44, "assets/images/illustrations/exam-items/oven-door-peek.jpg"],
  [44, "assets/images/illustrations/home-kitchen/home-oven-shelf-height.jpg"],
  [46, "assets/images/illustrations/baker/baker-cert-mock-three-weeks.jpg"],
  [46, "assets/images/illustrations/home-kitchen/outlet-timer-cord.jpg"],
  [41, "assets/images/illustrations/baker/wrist-pause-at-bench.jpg"],
  [48, "assets/images/illustrations/rd/slice-warm-vs-morning.jpg"],
  [47, "assets/images/illustrations/rd-diaries/bread-rd-series-guide.jpg"],
  [47, "assets/images/illustrations/rd-diaries/bread-rd-night-bread-mid-review.jpg"],
  [56, "assets/images/photos/baker-cert-8month-roadmap/if-again.jpg"],
  [50, "assets/images/photos/baker-cert-exam-day-pass/after-pass-immediate.jpg"],
  [54, "assets/images/illustrations/home-kitchen/window-vs-inner-table.jpg"],
  [51, "assets/images/illustrations/home-kitchen/fridge-side-no-proof.jpg"],
  [43, "assets/images/illustrations/home-kitchen/wet-hands-scale-cloth.jpg"],
  [54, "assets/images/illustrations/home-kitchen/microwave-away-from-dough.jpg"],
  [46, "assets/images/illustrations/home-kitchen/night-bake-lamp.jpg"],
  [48, "assets/images/illustrations/home-kitchen/family-kitchen-tape-zone.jpg"]
];

const diaryMap = {
  "bread-rd-night-bread-v1": 56,
  "bread-rd-night-bread-v2": 41,
  "bread-rd-night-bread-v3": 42,
  "bread-rd-night-bread-v4": 53,
  "bread-rd-night-bread-v5": 55,
  "bread-rd-night-bread-v6": 48,
  "bread-rd-night-bread-v7": 47,
  "bread-rd-night-bread-v8": 55,
  "bread-rd-night-bread-v9": 54,
  "bread-rd-night-bread-v10": 50,
  "bread-rd-night-bread-v11": 44,
  "bread-rd-night-bread-v12": 49,
  "bread-rd-night-bread-v13": 51,
  "bread-rd-night-bread-v14": 43,
  "bread-rd-night-bread-v15": 46
};

for (const [slug, num] of Object.entries(diaryMap)) {
  copies.push([num, `assets/images/illustrations/rd-diaries/${slug}.jpg`]);
}

let n = 0;
for (const [num, dest] of copies) {
  cp(num, dest);
  n++;
}
console.log("copied", n);

const posts = load("data/posts.js", "POSTS_DATA");
for (const p of posts) {
  if (p.coverImage && p.coverImage.endsWith(".svg")) {
    const jpg = p.coverImage.replace(/\.svg$/, ".jpg");
    const abs = path.join(ROOT, jpg.replace(/^\.\.\//, ""));
    if (fs.existsSync(abs)) p.coverImage = jpg;
  }
}
save("data/posts.js", "POSTS_DATA", posts);
console.log("cover svg→jpg where file exists");
