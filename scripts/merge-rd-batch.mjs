import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadPosts() {
  const code = fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

const batchFiles = ["posts-rd-batch.json", "posts-rd-batch-2.json"];
let posts = loadPosts();

for (const file of batchFiles) {
  const batchPath = path.join(ROOT, "data", file);
  if (!fs.existsSync(batchPath)) continue;
  const batch = JSON.parse(fs.readFileSync(batchPath, "utf8"));
  for (const p of batch) {
    const n = postCharCount(p);
    if (n < 2000) {
      console.error(`FAIL ${p.slug}: ${n}`);
      process.exit(1);
    }
    console.log(`OK ${p.slug}: ${n}`);
    if (posts.some((x) => x.slug === p.slug)) {
      posts = posts.map((x) => (x.slug === p.slug ? p : x));
    } else {
      posts.push(p);
    }
  }
}

// v1 에디터 노트 → 2차 링크
const v1 = posts.find((p) => p.slug === "bread-rd-night-bread-v1");
if (v1) {
  for (const s of v1.sections) {
    if (s.id === "editor-note") {
      s.content = s.content
        .replace("2차 일지는 토핑 시점 변경 결과를 담아 발행할 예정입니다", "2차 일지는 <a href=\"bread-rd-night-bread-v2.html\">토핑 시점을 앞당긴 날</a>에서 확인할 수 있습니다")
        .replace("이후 시도도 같은 형식으로 차곡차곡 쌓습니다", "이후 시도는 <a href=\"bread-rd-series-guide.html\">R&D 일지 안내</a>에서 순서대로 이어집니다");
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        "6편 <a href=\"baker-cert-to-bread-rd.html\">R&D 방식</a>대로 일지를 이어갑니다",
        "6편 <a href=\"baker-cert-to-bread-rd.html\">R&D 방식</a>대로 일지를 이어갑니다. 전체 순서는 <a href=\"bread-rd-series-guide.html\">R&D 일지 안내</a>를 참고하세요"
      );
    }
  }
  v1.relatedSlugs = ["bread-rd-night-bread-v2", "bread-rd-series-guide", "baker-cert-to-bread-rd"];
}

const rdGuide = posts.find((p) => p.slug === "bread-rd-series-guide");
if (rdGuide) {
  rdGuide.relatedSlugs = [
    "bread-rd-night-bread-v1",
    "bread-rd-night-bread-v8",
    "bread-rd-night-bread-mid-review",
    "baker-cert-to-bread-rd"
  ];
  for (const s of rdGuide.sections) {
    if (s.id === "one-variable") {
      s.content = s.content.replace(
        "<li><a href=\"bread-rd-night-bread-mid-review.html\">중간 정리</a> — 1~5차 합산 판단</li></ol>",
        "<li><a href=\"bread-rd-night-bread-mid-review.html\">중간 정리</a> — 1~5차 합산 판단</li><li><a href=\"bread-rd-night-bread-v6.html\">6차</a> — 시럽 설탕 -10%</li><li><a href=\"bread-rd-night-bread-v7.html\">7차</a> — 신선 밤 재료</li><li><a href=\"bread-rd-night-bread-v8.html\">8차</a> — 굽기 후 시럽 브러싱</li></ol>"
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        "중간 정리 이후에도 프로젝트는 계속됩니다. 6차 이후 후보로는 <strong>신선 밤 시즌 재료</strong>, <strong>2차 발효 직전 토핑 압착</strong>, <strong>굽기 후 시럽 브러싱</strong> 등이 메모에 남아 있습니다. 확정 전까지는 일지 형식을 유지합니다.",
        "1~5차 중간 정리 이후 <a href=\"bread-rd-night-bread-v6.html\">6~8차</a>가 이어졌습니다. 6차 설탕 보정, 7차 신선 밤, 8차 굽기 후 브러싱까지 발행했습니다. 이후에는 겨울 재현·밤 선별·보관 비교 등이 후보로 남아 있으며, 일지 형식은 그대로 유지합니다."
      );
    }
  }
  rdGuide.excerpt =
    "밤식빵 R&D 일지 1~8차와 중간 정리 글을 어떤 순서로 읽으면 좋은지 안내합니다. 기능사 시리즈에서 넘어온 분, 중간부터 들어온 분 모두를 위한 읽기 가이드입니다.";
  rdGuide.summary =
    "밤식빵 R&D 1~8차와 중간 정리를 읽는 권장 순서를 정리했습니다. 동기·R&D 전환·차수별 변수·실험일과 발행일 구분을 안내합니다.";
}

const midReview = posts.find((p) => p.slug === "bread-rd-night-bread-mid-review");
if (midReview) {
  for (const s of midReview.sections) {
    if (s.id === "editor-note") {
      s.content = s.content.replace(
        "6차 일지는 그때 다시 올리겠습니다",
        "6차 이후 <a href=\"bread-rd-night-bread-v6.html\">6~8차</a> 일지가 이어졌습니다"
      );
    }
    if (s.id === "next") {
      s.content = s.content.replace(
        "6차 일정은 정해 두지 않았습니다. 변수가 하나 정해지면 그때 실험하고, 결과가 모이면 같은 형식으로 일지를 올립니다.",
        "6차는 <a href=\"bread-rd-night-bread-v6.html\">설탕 보정</a>으로 이어졌고, 7·8차에서 재료·브러싱까지 발행했습니다. 이후 변수는 <a href=\"bread-rd-series-guide.html\">읽기 안내</a>의 후보 목록을 참고하세요."
      );
    }
  }
  midReview.relatedSlugs = [
    "bread-rd-night-bread-v5",
    "bread-rd-night-bread-v6",
    "bread-rd-series-guide",
    "baker-cert-to-bread-rd",
    "why-baker-certification"
  ];
}

const v5 = posts.find((p) => p.slug === "bread-rd-night-bread-v5");
if (v5) {
  for (const s of v5.sections) {
    if (s.id === "next") {
      s.content = s.content.replace(
        "중간 정리 글에서 1~5차 합산 판단",
        "<a href=\"bread-rd-night-bread-mid-review.html\">중간 정리</a>에서 1~5차 합산 판단"
      );
    }
  }
  v5.relatedSlugs = [
    "bread-rd-night-bread-v4",
    "bread-rd-night-bread-mid-review",
    "bread-rd-night-bread-v6",
    "bread-rd-night-bread-v2"
  ];
}

const cert6 = posts.find((p) => p.slug === "baker-cert-to-bread-rd");
if (cert6) {
  cert6.relatedSlugs = [
    "bread-rd-series-guide",
    "bread-rd-night-bread-v1",
    "why-baker-certification"
  ];
  for (const s of cert6.sections) {
    if (s.id === "night-bread-bridge") {
      s.content = s.content.replace(
        "첫 R&D 글은 <a href=\"bread-rd-night-bread-v1.html\">밤식빵 1차 시도</a>에서 이어집니다",
        "R&D 일지는 <a href=\"bread-rd-series-guide.html\">밤식빵 프로젝트 안내</a>에서 순서대로 읽을 수 있고, <a href=\"bread-rd-night-bread-v1.html\">1차 시도</a>부터 시작합니다"
      );
    }
  }
}

posts.sort((a, b) => {
  const da = new Date(a.publishedAt).getTime();
  const db = new Date(b.publishedAt).getTime();
  if (da !== db) return da - db;
  return a.slug.localeCompare(b.slug);
});

fs.writeFileSync(path.join(ROOT, "data/posts.js"), `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);
console.log("Merged. Total posts:", posts.length);