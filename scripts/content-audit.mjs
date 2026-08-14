import fs from "fs";
import { postCharCount } from "./content-char-count.mjs";

const posts = Function(
  `return (${fs.readFileSync("data/posts.js", "utf8").replace("window.POSTS_DATA = ", "").replace(/;\s*$/, "")})`
)();
const cols = Function(
  `return (${fs.readFileSync("data/columns.js", "utf8").replace("window.COLUMNS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const issues = [];
const warns = [];
const ok = [];
const plain = (h) => (h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// 1 char counts
const thin = [];
for (const p of posts) {
  const n = postCharCount(p);
  if (n < 2000) thin.push(`${p.slug}:${n}`);
  if (!p.summary?.trim()) issues.push(`${p.slug}: no summary`);
  if (!p.excerpt?.trim()) issues.push(`${p.slug}: no excerpt`);
  if (!p.faq?.length) warns.push(`${p.slug}: no faq`);
}
if (!thin.length) ok.push("all posts 2000+ chars");
else issues.push(`under 2000: ${thin.join(", ")}`);

// 2 R&D role + value + unique titles
const rd = posts.filter((p) => /bread-rd-night-bread-v\d+$/.test(p.slug));
let noRole = 0;
let noValue = 0;
const titleSets = new Set();
const goalTitles = new Set();
for (const p of rd) {
  const all = (p.sections || []).map((s) => s.content || "").join("\n");
  if (!all.includes("role-banner")) noRole++;
  if (!all.includes("value-box")) noValue++;
  titleSets.add((p.sections || []).map((s) => s.title).join("|"));
  goalTitles.add(p.sections?.find((s) => s.id === "goal")?.title || "");
}
if (noRole) issues.push(`R&D missing role-banner: ${noRole}/${rd.length}`);
else ok.push(`R&D role-banner ${rd.length}/${rd.length}`);
if (noValue) warns.push(`R&D missing value-box: ${noValue}/${rd.length}`);
else ok.push("R&D value-box present");
ok.push(`R&D unique title sets: ${titleSets.size}/${rd.length}`);
ok.push(`R&D unique goal titles: ${goalTitles.size}/${rd.length}`);

// 3 guide hub
const g = posts.find((p) => p.slug === "bread-rd-night-bread-practical-guide");
const needIds = ["goal", "takeaway-seven", "fixed-draft", "winter-quick", "decision-tree", "when-read-logs"];
for (const id of needIds) {
  if (!g.sections.some((s) => s.id === id)) issues.push(`guide missing section: ${id}`);
}
const gAll = g.sections.map((s) => s.content).join("");
if (gAll.includes("data-table")) ok.push("guide winter HTML table");
else issues.push("guide winter table missing");
if (gAll.includes("v15") || gAll.includes("15차")) ok.push("guide refs v15");
else warns.push("guide weak v15 ref");
if (/일지 대신|실전 정리부터|판단/.test(g.title + g.excerpt)) ok.push("guide hub wording");
else warns.push("guide hub wording weak");

// 4 guide links to all key diaries
for (const slug of [
  "bread-rd-night-bread-v2",
  "bread-rd-night-bread-v9",
  "bread-rd-night-bread-v12",
  "bread-rd-night-bread-v14",
  "bread-rd-night-bread-v15"
]) {
  if (!gAll.includes(slug)) warns.push(`guide missing link ${slug}`);
}

// 5 diaries link to guide
const noGuide = rd.filter((p) => !(p.sections || []).map((s) => s.content).join("").includes("bread-rd-night-bread-practical-guide"));
if (noGuide.length) issues.push(`diaries without guide link: ${noGuide.map((p) => p.slug).join(", ")}`);
else ok.push("all R&D link to practical guide");

// 6 editor-note slim
const longEd = [];
for (const p of rd) {
  const ed = p.sections.find((s) => s.id === "editor-note");
  if (!ed) continue;
  const len = plain(ed.content).length;
  if (len > 400) longEd.push(`${p.slug}:${len}`);
}
if (longEd.length) warns.push(`long editor-note: ${longEd.join(", ")}`);
else ok.push("editor-notes slim (<=400 plain)");

// 7 practice-notes not huge
const longPr = [];
for (const p of rd) {
  const pr = p.sections.find((s) => s.id === "practice-notes");
  if (!pr) continue;
  const len = plain(pr.content).length;
  if (len > 500) longPr.push(`${p.slug}:${len}`);
}
if (longPr.length) warns.push(`long practice-notes: ${longPr.join(", ")}`);
else ok.push("practice-notes reasonable");

// 8 relatedSlugs
const slugs = new Set(posts.map((p) => p.slug));
for (const p of posts) {
  for (const r of p.relatedSlugs || []) {
    if (!slugs.has(r)) issues.push(`${p.slug}: broken related ${r}`);
  }
}
ok.push("relatedSlugs valid");

// 9 broken same-dir html links in posts
const postFiles = new Set([...slugs].map((s) => `${s}.html`));
const broken = [];
for (const p of posts) {
  const html = (p.sections || []).map((s) => s.content || "").join("\n");
  for (const m of html.matchAll(/href="(?!\.\.\/|https?:|mailto:|#)([a-z0-9-]+\.html)"/g)) {
    if (!postFiles.has(m[1])) broken.push(`${p.slug}->${m[1]}`);
  }
}
if (broken.length) issues.push(`broken hrefs: ${[...new Set(broken)].slice(0, 25).join("; ")}`);
else ok.push("in-post .html links resolve");

// 10 adjacent paragraph similarity
function overlap(a, b) {
  const wa = new Set(a.split(" ").filter((w) => w.length > 1));
  if (!wa.size) return 0;
  let s = 0;
  for (const w of wa) if (b.includes(w)) s++;
  return s / wa.size;
}
const highSim = [];
for (const p of rd) {
  for (const sec of p.sections || []) {
    const paras = [...(sec.content || "").matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => plain(m[1]));
    for (let i = 1; i < paras.length; i++) {
      if (paras[i].length > 45 && paras[i - 1].length > 45 && overlap(paras[i - 1], paras[i]) >= 0.72) {
        highSim.push(`${p.slug}/${sec.id}`);
      }
    }
  }
}
if (highSim.length) warns.push(`adjacent para sim: ${[...new Set(highSim)].join(", ")}`);
else ok.push("no high adjacent para similarity in R&D");

// 11 series hub-first
const series = posts.find((p) => p.slug === "bread-rd-series-guide");
const sHead = series.title + series.excerpt + (series.sections[0]?.content || "");
if (/실전 정리/.test(sHead)) ok.push("series hub-first language");
else warns.push("series not hub-first");

// 12 index
const idx = fs.readFileSync("index.html", "utf8");
if (idx.includes("practical-guide")) ok.push("index links practical guide");
else issues.push("index missing practical guide CTA");

// 13 value-box quality
const weak = [];
for (const p of rd) {
  const m = (p.sections[0].content || "").match(/value-box[\s\S]{0,400}/);
  if (!m || plain(m[0]).length < 40) weak.push(p.slug);
}
if (weak.length) warns.push(`weak value-box: ${weak.join(", ")}`);
else ok.push("value-boxes substantive");

// 14 cross-diary near-duplicate first 200 chars of failures?
const failSnips = rd.map((p) => {
  const f = p.sections.find((s) => s.id === "failures");
  return { slug: p.slug, snip: plain(f?.content || "").slice(0, 120) };
});
// report any identical snips
const snipMap = new Map();
for (const x of failSnips) {
  if (!x.snip) continue;
  if (!snipMap.has(x.snip)) snipMap.set(x.snip, []);
  snipMap.get(x.snip).push(x.slug);
}
const dupSnips = [...snipMap.entries()].filter(([, a]) => a.length > 1);
if (dupSnips.length) warns.push(`identical failures openings: ${dupSnips.map(([, a]) => a.join("=")).join("; ")}`);
else ok.push("failures openings unique");

// 15 columns
for (const c of cols) {
  if (postCharCount(c) < 1800) warns.push(`column short ${c.slug}: ${postCharCount(c)}`);
}
ok.push(`columns ${cols.length} checked`);

// 16 empty sections
for (const p of posts) {
  for (const s of p.sections || []) {
    if (!plain(s.content).length && !s.content?.includes("<")) issues.push(`${p.slug}/${s.id} empty`);
  }
}

// 17 guide decision tree quality
const dt = g.sections.find((s) => s.id === "decision-tree");
if (dt && plain(dt.content).length > 100) ok.push("decision-tree present");
else issues.push("decision-tree weak");

console.log("\n=== PASS ===");
ok.forEach((x) => console.log(" +", x));
console.log("\n=== WARN ===");
if (!warns.length) console.log(" (none)");
warns.forEach((x) => console.log(" !", x));
console.log("\n=== FAIL ===");
if (!issues.length) console.log(" (none)");
issues.forEach((x) => console.log(" x", x));

// sample outputs for human review
console.log("\n=== SAMPLE: guide sections ===");
console.log(g.sections.map((s) => s.id + " | " + s.title).join("\n"));
console.log("\n=== SAMPLE: v9 first 280 plain ===");
console.log(plain(rd.find((p) => p.slug.endsWith("v9")).sections[0].content).slice(0, 280));
console.log("\n=== SAMPLE: v12 editor ===");
console.log(plain(rd.find((p) => p.slug.endsWith("v12")).sections.find((s) => s.id === "editor-note").content));

const report = { ok: ok.length, warns: warns.length, issues: issues.length, warnList: warns, issueList: issues };
fs.writeFileSync("content-audit-report.json", JSON.stringify(report, null, 2));
console.log("\n→ content-audit-report.json");
process.exit(issues.length ? 1 : 0);
