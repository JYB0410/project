/**
 * HTML 본문 중복 <p> 제거 + 보일러플레이트 문단 삭제
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const BOILERPLATE_PATTERNS = [
  /<p>이번 주에는[^<]*중 하나만 골라 같은 요일에 반복해 보세요\. 기록이 쌓이면 다음 조정이 쉬워집니다\.<\/p>/g
];

function plainText(html) {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function overlapRatio(a, b) {
  if (!a || !b) return 0;
  const short = a.length <= b.length ? a : b;
  const long = a.length > b.length ? a : b;
  if (short.length < 30) return 0;
  if (long.includes(short)) return short.length / long.length;
  const wordsA = new Set(short.split(" ").filter((w) => w.length > 1));
  const wordsB = new Set(long.split(" ").filter((w) => w.length > 1));
  if (!wordsA.size) return 0;
  let shared = 0;
  for (const w of wordsA) if (wordsB.has(w)) shared++;
  return shared / wordsA.size;
}

function dedupeSentencesInParagraph(inner) {
  const parts = inner.split(/(?<=[.!?])\s+(?=[가-힣A-Za-z0-9「『"])/);
  if (parts.length < 2) return inner;
  const kept = [];
  for (const part of parts) {
    const text = plainText(part);
    if (!text) continue;
    const prev = kept.length ? plainText(kept[kept.length - 1]) : "";
    if (prev && overlapRatio(prev, text) >= 0.68) continue;
    kept.push(part);
  }
  return kept.join(" ");
}

export function dedupeParagraphs(html) {
  if (!html) return html;
  let out = html;
  for (const re of BOILERPLATE_PATTERNS) out = out.replace(re, "");
  const keptTexts = [];
  out = out.replace(/<p>([\s\S]*?)<\/p>/g, (full, inner) => {
    const cleanedInner = dedupeSentencesInParagraph(inner);
    const text = plainText(cleanedInner);
    if (text.length < 30) return `<p>${cleanedInner}</p>`;
    if (keptTexts.some((t) => t === text || overlapRatio(t, text) >= 0.72)) return "";
    keptTexts.push(text);
    return `<p>${cleanedInner}</p>`;
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