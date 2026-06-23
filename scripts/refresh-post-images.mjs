import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeIllustration } from "./generate-illustrations.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsPath = path.join(__dirname, "..", "data", "posts.js");
const posts = eval(fs.readFileSync(postsPath, "utf8").replace("window.POSTS_DATA = ", ""));

function stripFigures(html) {
  return html.replace(/<figure class="article-figure">[\s\S]*?<\/figure>/g, "");
}

function figureHtml(src, caption) {
  const alt = caption.replace(/"/g, "'");
  return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" class="article-img"><figcaption>${caption}</figcaption></figure>`;
}

function insertFigure(content, figure) {
  const firstClose = content.indexOf("</p>");
  if (firstClose === -1) return figure + content;
  return content.slice(0, firstClose + 4) + figure + content.slice(firstClose + 4);
}

for (const post of posts) {
  const total = post.sections.length;
  const slots = new Set(
    [0, Math.floor(total / 2), total - 2].filter(
      (i) => i >= 0 && i < total && post.sections[i].id !== "editor-note"
    )
  );

  post.sections.forEach((sec, index) => {
    sec.content = stripFigures(sec.content);
    if (sec.id === "editor-note") return;
    if (!slots.has(index) && !sec.id.includes("why") && !sec.id.includes("start")) return;

    const { src } = writeIllustration(post.slug, sec.id, sec.title);
    const caption = `${sec.title} — ${post.title}`;
    sec.content = insertFigure(sec.content, figureHtml(src, caption));
  });
  post.updatedAt = "2026-06-22";
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log(`Refreshed images in ${posts.length} posts with unique per-section illustrations.`);