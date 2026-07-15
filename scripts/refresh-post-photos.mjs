/**
 * 전체 글 사진 재다운로드 — Pexels ID 사이트 전역 중복 없이 배정
 * 사용: node scripts/refresh-post-photos.mjs [--force]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { photoCandidates, pexelsUrl } from "./photo-library.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const postsPath = path.join(ROOT, "data", "posts.js");
const photoDir = path.join(ROOT, "assets", "images", "photos");
const manifestPath = path.join(ROOT, "data", "photo-assignments.json");

const force = process.argv.includes("--force") || process.argv.includes("-f");

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

async function downloadPhoto(slug, sectionId, title, usedIds) {
  const dir = path.join(photoDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${sectionId}.jpg`;
  const filePath = path.join(dir, filename);

  if (!force && fs.existsSync(filePath) && fs.statSync(filePath).size >= 10000) {
    console.log(`  · ${slug}/${filename} (skip, use --force to replace)`);
    return { src: `../assets/images/photos/${slug}/${filename}`, photoId: null, scene: null };
  }

  const candidates = photoCandidates(slug, sectionId, title, usedIds);
  for (const { photoId, scene } of candidates) {
    const url = pexelsUrl(photoId);
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      console.warn(`  ! pexels:${photoId} ${res.status}, 다음 후보...`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) {
      console.warn(`  ! pexels:${photoId} too small, 다음 후보...`);
      continue;
    }
    fs.writeFileSync(filePath, buf);
    usedIds.add(photoId);
    console.log(
      `  ↓ ${slug}/${filename} (pexels:${photoId}, ${scene}, ${Math.round(buf.length / 1024)}KB)`
    );
    return { src: `../assets/images/photos/${slug}/${filename}`, photoId, scene };
  }

  throw new Error(`다운로드 가능한 Pexels ID 없음: ${slug}/${sectionId}`);
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

function shouldHaveImage(sec, index, total) {
  if (sec.id === "editor-note" || sec.id === "practice-notes") return false;
  // 글당 최소 1장: 첫 본문 섹션
  if (index === 0) return true;
  // 긴 글은 중간 섹션에 1장 추가
  if (total >= 8 && index === Math.floor(total / 2)) return true;
  return /intro|goal|series-purpose|childhood|exam-structure|failures|pass-moment|night-bread/.test(
    sec.id
  );
}

const posts = loadPosts();
const usedIds = new Set();
const manifest = {};

console.log(`Pexels 사진 재배정 (${force ? "강제 덮어쓰기" : "누락분만"})...`);

for (const post of posts) {
  const total = post.sections.length;
  manifest[post.slug] = {};
  let coverSet = false;

  for (const [index, sec] of post.sections.entries()) {
    sec.content = stripFigures(sec.content);
    if (!shouldHaveImage(sec, index, total)) continue;

    const { src, photoId, scene } = await downloadPhoto(post.slug, sec.id, sec.title, usedIds);
    const caption = `${sec.title}`;
    sec.content = insertFigure(sec.content, figureHtml(src, caption));
    manifest[post.slug][sec.id] = {
      photoId,
      scene,
      pexels: `https://www.pexels.com/photo/${photoId}/`
    };
    if (!coverSet) {
      post.coverImage = src;
      post.coverCaption = caption;
      coverSet = true;
    }
  }
  console.log(`✓ ${post.slug}${post.coverImage ? " (cover)" : ""}`);
}

fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
fs.writeFileSync(manifestPath, JSON.stringify({ updatedAt: new Date().toISOString(), usedCount: usedIds.size, assignments: manifest }, null, 2) + "\n");

console.log(`\n완료 — ${posts.length}개 글, ${usedIds.size}개 고유 Pexels ID 배정`);
console.log(`매니페스트: data/photo-assignments.json`);