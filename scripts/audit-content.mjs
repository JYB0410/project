import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS, postCharCount } from "./content-char-count.mjs";
import { columnCharCount } from "./column-char-count.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const load = (f, v) => Function(`return (${fs.readFileSync(path.join(ROOT, f), "utf8").replace(`window.${v} = `, "").replace(/;\s*$/, "")})`)();

const posts = load("data/posts.js", "POSTS_DATA");
const cols = load("data/columns.js", "COLUMNS_DATA");
const MIN = Number(process.env.MIN_CHARS || MIN_CHARS);
const editorDup = "글을 읽으며 '우리 집은 어디까지 하고 있지?'";
const aptPhrase = "한국 아파트·원룸에서는";

const report = {
  posts: posts.length,
  columns: cols.length,
  editorNoteIdentical: 0,
  aptParagraphTotal: 0,
  shortPosts: [],
  shortColumns: [],
  noFaq: [],
  charCounts: [],
  columnCharCounts: []
};

for (const p of posts) {
  const all = p.sections.map((s) => s.content).join("");
  if (all.includes(editorDup)) report.editorNoteIdentical++;
  report.aptParagraphTotal += (all.match(new RegExp(aptPhrase, "g")) || []).length;
  const chars = postCharCount(p);
  report.charCounts.push({ slug: p.slug, chars });
  if (chars < MIN) report.shortPosts.push({ slug: p.slug, chars, gap: MIN - chars });
  if (!p.faq?.length) report.noFaq.push(p.slug);
}

report.charCounts.sort((a, b) => a.chars - b.chars);
report.avgChars = Math.round(report.charCounts.reduce((s, x) => s + x.chars, 0) / report.charCounts.length);
report.minChars = report.charCounts[0];
report.maxChars = report.charCounts[report.charCounts.length - 1];

for (const c of cols) {
  const chars = columnCharCount(c);
  report.columnCharCounts.push({ slug: c.slug, chars });
  if (chars < MIN) report.shortColumns.push({ slug: c.slug, chars, gap: MIN - chars });
}
report.columnCharCounts.sort((a, b) => a.chars - b.chars);
report.avgColumnChars = Math.round(
  report.columnCharCounts.reduce((s, x) => s + x.chars, 0) / report.columnCharCounts.length
);
report.minColumnChars = report.columnCharCounts[0];
report.maxColumnChars = report.columnCharCounts[report.columnCharCounts.length - 1];

// missing photos referenced in HTML
const imgRefs = new Set();
for (const p of posts) {
  const matches = p.sections.join(" ").match(/photos\/[^"']+\.jpg/g) || [];
  matches.forEach((m) => imgRefs.add(m.replace("photos/", "assets/images/photos/")));
}
const missing = [...imgRefs].filter((r) => !fs.existsSync(path.join(ROOT, r)));

console.log(JSON.stringify({ ...report, missingImages: missing }, null, 2));