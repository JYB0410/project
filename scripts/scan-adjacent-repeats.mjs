import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const code = fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8");
const posts = Function(`return (${code.replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`)();

function plain(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function overlap(a, b) {
  if (!a || !b || a.length < 25 || b.length < 25) return 0;
  if (a.includes(b) || b.includes(a)) return 0.95;
  const wa = new Set(a.split(" ").filter((w) => w.length > 1));
  const wb = new Set(b.split(" ").filter((w) => w.length > 1));
  if (!wa.size) return 0;
  let s = 0;
  for (const w of wa) if (wb.has(w)) s++;
  return s / wa.size;
}

for (const post of posts) {
  for (const sec of post.sections || []) {
    const paras = [...(sec.content || "").matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));
    for (let i = 0; i < paras.length; i++) {
      const sentences = paras[i].split(/(?<=[.!?])\s+/).filter((s) => s.length > 15);
      for (let j = 1; j < sentences.length; j++) {
        if (overlap(sentences[j - 1], sentences[j]) >= 0.72) {
          console.log(`SENT ${post.slug}/${sec.id}: "${sentences[j - 1].slice(0, 40)}..." ~ "${sentences[j].slice(0, 40)}..."`);
        }
      }
      if (i > 0 && overlap(paras[i - 1], paras[i]) >= 0.72) {
        console.log(`PARA ${post.slug}/${sec.id}#${i}: ${paras[i - 1].slice(0, 50)}... || ${paras[i].slice(0, 50)}...`);
      }
    }
  }
}