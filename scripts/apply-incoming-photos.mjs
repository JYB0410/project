#!/usr/bin/env node
/** incoming-photos → assets/images/photos/{slug}/{section}.jpg */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const INCOMING = path.join(ROOT, "incoming-photos");
const PHOTOS = path.join(ROOT, "assets", "images", "photos");

function normalizeName(filename) {
  let n = filename;
  while (/\.jpe?g\.jpe?g$/i.test(n)) n = n.replace(/\.jpe?g$/i, "");
  if (/\.jpeg$/i.test(n)) n = n.replace(/\.jpeg$/i, ".jpg");
  if (!/\.jpg$/i.test(n)) n += ".jpg";
  return n;
}

function parseFlatName(name) {
  const base = name.replace(/\.jpg$/i, "");
  const idx = base.lastIndexOf("__");
  if (idx < 0) throw new Error(`잘못된 파일명: ${name}`);
  return { slug: base.slice(0, idx), section: base.slice(idx + 2) };
}

const py = spawnSync(
  "python",
  [
    "-c",
    `from openpyxl import load_workbook; wb=load_workbook(r'${path.join(ROOT, "image-generation-list.xlsx")}', data_only=True); ws=wb['이미지생성목록']; print('\\n'.join(ws.cell(r,2).value for r in range(2,ws.max_row+1)))`
  ],
  { encoding: "utf8" }
);
if (py.status !== 0) throw new Error(py.stderr || "xlsx read failed");
const expected = py.stdout
  .trim()
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean);

const incomingFiles = fs.readdirSync(INCOMING).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
const map = new Map();
for (const f of incomingFiles) {
  map.set(normalizeName(f), path.join(INCOMING, f));
}

const missing = expected.filter((e) => !map.has(e));
const DUPLICATE_FROM = {
  "baker-cert-series-roadmap__series-purpose.jpg": "baker-cert-series-roadmap__how-to-read.jpg"
};

for (const [target, source] of Object.entries(DUPLICATE_FROM)) {
  if (missing.includes(target) && map.has(source)) {
    console.log(`✓ 누락 보완: ${target} ← ${source} (복제)`);
    map.set(target, map.get(source));
    const i = missing.indexOf(target);
    if (i >= 0) missing.splice(i, 1);
  }
}

if (missing.length) {
  console.error("여전히 누락:", missing);
  process.exit(1);
}

let copied = 0;
for (const flatName of expected) {
  const src = map.get(flatName);
  const { slug, section } = parseFlatName(flatName);
  const destDir = path.join(PHOTOS, slug);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, path.join(destDir, `${section}.jpg`));
  copied++;
}

const assignPath = path.join(ROOT, "data/photo-assignments.json");
if (fs.existsSync(assignPath)) {
  const assign = JSON.parse(fs.readFileSync(assignPath, "utf8"));
  assign.updatedAt = new Date().toISOString();
  assign.sources = ["own"];
  assign.note = "Operator-generated images from incoming-photos";
  fs.writeFileSync(assignPath, JSON.stringify(assign, null, 2) + "\n");
}

console.log(`✓ ${copied}장 배포 완료 → assets/images/photos/`);