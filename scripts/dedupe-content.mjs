/**
 * HTML 본문 중복 <p> 제거 + 보일러플레이트 문단 삭제
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const BOILERPLATE_PATTERNS = [
  /<p>이번 주에는[^<]*중 하나만 골라 같은 요일에 반복해 보세요\. 기록이 쌓이면 다음 조정이 쉬워집니다\.<\/p>/g
];

export function dedupeParagraphs(html) {
  if (!html) return html;
  let out = html;
  for (const re of BOILERPLATE_PATTERNS) out = out.replace(re, "");
  const seen = new Set();
  out = out.replace(/<p>([\s\S]*?)<\/p>/g, (full, inner) => {
    const key = inner.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (key.length < 30) return full;
    if (seen.has(key)) return "";
    seen.add(key);
    return full;
  });
  return out.replace(/(<\/p>)\s*(<p>)/g, "$1$2");
}

export function cleanItemSections(item) {
  for (const sec of item.sections || []) {
    sec.content = dedupeParagraphs(sec.content);
  }
  return item;
}

/** posts-value-batch.json, columns-batch.json 등 소스 배치 파일 정리 */
export function dedupeBatchFile(filePath) {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const items = Array.isArray(raw) ? raw : raw.posts || raw.columns || [];
  for (const item of items) cleanItemSections(item);
  fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n");
  return items.length;
}

// CLI: node scripts/dedupe-content.mjs [batch.json ...]
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const defaults = ["data/posts-value-batch.json", "data/columns-batch.json"];
  const targets = process.argv.slice(2).length ? process.argv.slice(2) : defaults;
  for (const rel of targets) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      console.warn(`skip (없음): ${rel}`);
      continue;
    }
    const n = dedupeBatchFile(full);
    console.log(`✓ ${rel} (${n}개 항목 정리)`);
  }
}