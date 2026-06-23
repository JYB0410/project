import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS, postCharCount } from "./content-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const posts = Function(
  `return (${fs.readFileSync(path.join(ROOT, "data/posts.js"), "utf8").replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const counts = posts.map((p) => ({ slug: p.slug, chars: postCharCount(p) })).sort((a, b) => a.chars - b.chars);
const under = counts.filter((c) => c.chars < MIN_CHARS);
console.log(JSON.stringify({ min: counts[0], max: counts.at(-1), avg: Math.round(counts.reduce((s, c) => s + c.chars, 0) / counts.length), underCount: under.length, under }, null, 2));