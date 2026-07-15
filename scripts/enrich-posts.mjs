import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const postsPath = path.join(__dirname, "..", "data", "posts.js");
const postsCode = fs.readFileSync(postsPath, "utf8");
const posts = eval(postsCode.replace("window.POSTS_DATA = ", ""));

function figureImg(slug, sectionId, title, postTitle) {
  const src = `../assets/images/photos/${slug}/${sectionId}.jpg`;
  const caption = `${title} — ${postTitle}`;
  const alt = caption.replace(/"/g, "'");
  return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" class="article-img" width="1200" height="675"><figcaption>${caption}</figcaption></figure>`;
}

function stripFigures(html) {
  return html.replace(/<figure class="article-figure">[\s\S]*?<\/figure>/g, "");
}

function stripBoilerplate(content) {
  return content
    .replace(/<p>정지석이 상담할 때 자주 확인하는 질문은[\s\S]*?<\/p>/g, "")
    .replace(/<p>글을 읽으며 '우리 집은 어디까지 하고 있지\?'[\s\S]*?<\/p>/g, "")
    .replace(/<p>입양 준비는 하루 만에 끝나지 않습니다[\s\S]*?<\/p>/g, "")
    .replace(/<p>집에서 하는 5분 관리는[\s\S]*?<\/p>/g, "")
    .replace(/<p>서울·수도권 아파트는 환기[\s\S]*?<\/p>/g, "")
    .replace(/<p>사료 2~4만 원\/2kg[\s\S]*?<\/p>/g, "")
    .replace(/<p>산책 15분·실내 놀이 10분 뒤에는[\s\S]*?<\/p>/g, "")
    .replace(/<p>안전 점검은 한 번으로 끝나지 않습니다[\s\S]*?<\/p>/g, "")
    .replace(/<p>건강 관리는 '매일 완벽하게'[\s\S]*?<\/p>/g, "")
    .replace(/<p>조용히 같은 공간에 있는 10분도[\s\S]*?<\/p>/g, "")
    .replace(/<p>한국 아파트·원룸에서는 출퇴근[\s\S]*?<\/p>/g, "")
    .replace(/<p>아파트·원룸에서는 출퇴근[\s\S]*?<\/p>/g, "")
    .replace(/<p>사료·간식 변경은 7~10일에 걸쳐 천천히 하는 편이 소화 부담이 적습니다\. 하루 만에 전부 바꾸기보다, 기존과 새 제품을 비율로 섞어가며 관찰하는 방식이 안전합니다\.<\/p>/g, "");
}

function insertImage(content, post, section) {
  if (content.includes("article-figure")) return content;
  const img = figureImg(post.slug, section.id, section.title, post.title);
  const firstClose = content.indexOf("</p>");
  if (firstClose === -1) return img + content;
  return content.slice(0, firstClose + 4) + img + content.slice(firstClose + 4);
}

function enrichSection(post, section, index) {
  section.content = stripBoilerplate(stripFigures(section.content));

  const total = post.sections.length;
  const imageSlots = new Set(
    [0, Math.floor(total / 2), total - 2].filter((i) => i >= 0 && i < total && post.sections[i].id !== "editor-note")
  );
  if (imageSlots.has(index) || section.id.includes("why") || section.id.includes("start")) {
    section.content = insertImage(section.content, post, section);
  }
}

posts.forEach((post) => {
  post.sections.forEach((sec, i) => enrichSection(post, sec, i));
});

const out = `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`;
fs.writeFileSync(postsPath, out, "utf8");
console.log(`Enriched ${posts.length} posts (images only, no boilerplate).`);