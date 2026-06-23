import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pickPhotoId, pexelsUrl } from "./photo-library.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const postsPath = path.join(root, "data", "posts.js");
const photoDir = path.join(root, "assets", "images", "photos");

const posts = eval(fs.readFileSync(postsPath, "utf8").replace("window.POSTS_DATA = ", ""));

async function downloadPhoto(slug, sectionId, title) {
  const photoId = pickPhotoId(slug, sectionId, title);
  const dir = path.join(photoDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${sectionId}.jpg`;
  const filePath = path.join(dir, filename);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).size < 10000) {
    const url = pexelsUrl(photoId);
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buf);
    console.log(`  ↓ ${slug}/${filename} (pexels:${photoId}, ${Math.round(buf.length / 1024)}KB)`);
  }

  return { src: `../assets/images/photos/${slug}/${filename}`, photoId };
}

function stripFigures(html) {
  return html.replace(/<figure class="article-figure">[\s\S]*?<\/figure>/g, "");
}

function figureHtml(src, caption) {
  const alt = caption.replace(/"/g, "'");
  return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" class="article-img" width="1200" height="675"><figcaption>${caption}<span class="photo-credit"> · Photo: Pexels</span></figcaption></figure>`;
}

function insertFigure(content, figure) {
  const firstClose = content.indexOf("</p>");
  if (firstClose === -1) return figure + content;
  return content.slice(0, firstClose + 4) + figure + content.slice(firstClose + 4);
}

console.log("Downloading Pexels photos...");
for (const post of posts) {
  const total = post.sections.length;
  const slots = new Set(
    [0, Math.floor(total / 2), total - 2].filter(
      (i) => i >= 0 && i < total && post.sections[i].id !== "editor-note"
    )
  );

  for (const [index, sec] of post.sections.entries()) {
    sec.content = stripFigures(sec.content);
    if (sec.id === "editor-note") continue;
    if (!slots.has(index) && !sec.id.includes("why") && !sec.id.includes("start")) continue;

    const { src } = await downloadPhoto(post.slug, sec.id, sec.title);
    const caption = `${sec.title} — ${post.title}`;
    sec.content = insertFigure(sec.content, figureHtml(src, caption));
  }
  post.updatedAt = "2026-06-22";
  console.log(`✓ ${post.slug}`);
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
console.log(`Done — ${posts.length} posts updated with Pexels photos.`);