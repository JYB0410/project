/**
 * 전체 글 사진 — Pexels · Unsplash · Burst · Flickr(CC) 혼합, 사이트 전역 중복 방지
 * 사용: node scripts/refresh-post-photos.mjs [--force] [--slug=name]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  photoCandidates,
  downloadUrl,
  creditLabel,
  sourcePageUrl,
  assetKey,
  FETCH_HEADERS
} from "./photo-library.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const postsPath = path.join(ROOT, "data", "posts.js");
const photoDir = path.join(ROOT, "assets", "images", "photos");
const manifestPath = path.join(ROOT, "data", "photo-assignments.json");

const force = process.argv.includes("--force") || process.argv.includes("-f");
const slugFilter = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

function loadPosts() {
  const code = fs.readFileSync(postsPath, "utf8");
  return Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();
}

async function downloadPhoto(slug, sectionId, title, usedKeys) {
  const dir = path.join(photoDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `${sectionId}.jpg`;
  const filePath = path.join(dir, filename);

  if (!force && fs.existsSync(filePath) && fs.statSync(filePath).size >= 10000) {
    console.log(`  · ${slug}/${filename} (skip, use --force to replace)`);
    return { src: `../assets/images/photos/${slug}/${filename}`, asset: null };
  }

  const candidates = photoCandidates(slug, sectionId, title, usedKeys);
  for (const asset of candidates) {
    const url = downloadUrl(asset);
    const res = await fetch(url, { redirect: "follow", headers: FETCH_HEADERS });
    if (!res.ok) {
      console.warn(`  ! ${asset.provider}:${asset.id} ${res.status}, 다음 후보...`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) {
      console.warn(`  ! ${asset.provider}:${asset.id} too small, 다음 후보...`);
      continue;
    }
    fs.writeFileSync(filePath, buf);
    usedKeys.add(assetKey(asset));
    console.log(
      `  ↓ ${slug}/${filename} (${asset.provider}:${asset.id}, ${asset.scene}, ${Math.round(buf.length / 1024)}KB)`
    );
    return { src: `../assets/images/photos/${slug}/${filename}`, asset };
  }

  throw new Error(`다운로드 가능한 사진 없음: ${slug}/${sectionId}`);
}

function stripFigures(html) {
  return html.replace(/<figure class="article-figure">[\s\S]*?<\/figure>/g, "");
}

function figureHtml(src, caption, asset) {
  const alt = caption.replace(/"/g, "'");
  const credit = asset ? creditLabel(asset) : "Stock";
  return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" class="article-img" width="1200" height="675"><figcaption>${caption}<span class="photo-credit"> · Photo: ${credit}</span></figcaption></figure>`;
}

function insertFigure(content, figure) {
  const firstClose = content.indexOf("</p>");
  if (firstClose === -1) return figure + content;
  return content.slice(0, firstClose + 4) + figure + content.slice(firstClose + 4);
}

function shouldHaveImage(sec, index, total) {
  if (sec.id === "editor-note" || sec.id === "practice-notes") return false;
  if (index === 0) return true;
  if (total >= 8 && index === Math.floor(total / 2)) return true;
  return /intro|goal|series-purpose|childhood|exam-structure|failures|pass-moment|night-bread|one-variable|storage|mid-review/.test(
    sec.id
  );
}

let posts = loadPosts();
if (slugFilter) posts = posts.filter((p) => p.slug === slugFilter);

const usedKeys = new Set();
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8")).assignments || {}
  : {};

console.log(`사진 재배정 — Pexels · Unsplash · Burst · Flickr (${force ? "강제" : "누락만"})...`);

for (const post of posts) {
  const total = post.sections.length;
  manifest[post.slug] = manifest[post.slug] || {};
  let coverSet = false;

  for (const [index, sec] of post.sections.entries()) {
    sec.content = stripFigures(sec.content);
    if (!shouldHaveImage(sec, index, total)) continue;

    const { src, asset } = await downloadPhoto(post.slug, sec.id, sec.title, usedKeys);
    const caption = `${sec.title}`;
    sec.content = insertFigure(sec.content, figureHtml(src, caption, asset));
    if (asset) {
      manifest[post.slug][sec.id] = {
        provider: asset.provider,
        id: asset.id,
        scene: asset.scene,
        source: sourcePageUrl(asset)
      };
    }
    if (!coverSet) {
      post.coverImage = src;
      post.coverCaption = caption;
      coverSet = true;
    }
  }
  console.log(`✓ ${post.slug}${post.coverImage ? " (cover)" : ""}`);
}

const allPosts = loadPosts();
if (slugFilter) {
  for (const p of allPosts) {
    if (p.slug === slugFilter) {
      const updated = posts.find((x) => x.slug === slugFilter);
      if (updated) Object.assign(p, updated);
    }
  }
  fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(allPosts, null, 2)};\n`, "utf8");
} else {
  fs.writeFileSync(postsPath, `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

fs.writeFileSync(
  manifestPath,
  JSON.stringify(
    {
      updatedAt: new Date().toISOString(),
      sources: ["pexels", "unsplash", "burst", "flickr"],
      usedCount: usedKeys.size,
      assignments: manifest
    },
    null,
    2
  ) + "\n"
);

console.log(`\n완료 — ${posts.length}개 글, ${usedKeys.size}개 고유 이미지 (4개 소스 혼합)`);