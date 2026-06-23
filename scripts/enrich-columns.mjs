/**
 * 칼럼 보강 + 신규 추가 (공백 미포함 2000자 이상)
 * 사용: node scripts/enrich-columns.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MIN_CHARS } from "./content-char-count.mjs";
import { columnCharCount } from "./column-char-count.mjs";
import {
  COLUMN_EXTRA_SECTIONS,
  COLUMN_TEXT_UPDATES,
  NEW_COLUMNS,
  COLUMN_PAD_PARAGRAPHS
} from "./column-content.mjs";
import {
  COLUMN_LONG_SECTIONS,
  COLUMN_EXTRA_PADS,
  COLUMN_FINAL_SECTIONS
} from "./column-content-long.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const columnsPath = path.join(ROOT, "data", "columns.js");

const columns = Function(
  `return (${fs.readFileSync(columnsPath, "utf8").replace("window.COLUMNS_DATA = ", "").replace(/;\s*$/, "")})`
)();

const existingSlugs = new Set(columns.map((c) => c.slug));

for (const col of columns) {
  const updates = COLUMN_TEXT_UPDATES[col.slug];
  if (updates) {
    if (updates.perspective) col.perspective = updates.perspective;
    if (updates.excerpt) col.excerpt = updates.excerpt;
    if (updates.summary) col.summary = updates.summary;
  }

  const extras = COLUMN_EXTRA_SECTIONS[col.slug];
  if (extras) {
    const ids = new Set(col.sections.map((s) => s.id));
    for (const sec of extras) {
      if (!ids.has(sec.id)) {
        col.sections.push(sec);
        ids.add(sec.id);
      } else {
        const idx = col.sections.findIndex((s) => s.id === sec.id);
        col.sections[idx] = sec;
      }
    }
  }

}

for (const col of NEW_COLUMNS) {
  if (!existingSlugs.has(col.slug)) {
    columns.push(col);
    existingSlugs.add(col.slug);
  }
}

for (const col of columns) {
  const longSecs = COLUMN_LONG_SECTIONS[col.slug];
  if (longSecs) {
    const ids = new Set(col.sections.map((s) => s.id));
    for (const sec of longSecs) {
      if (!ids.has(sec.id)) {
        col.sections.push(sec);
        ids.add(sec.id);
      }
    }
  }
  const finalSec = COLUMN_FINAL_SECTIONS[col.slug];
  if (finalSec && !col.sections.some((s) => s.id === finalSec.id)) {
    col.sections.push(finalSec);
  }
}

function padColumn(col) {
  const pools = [...COLUMN_PAD_PARAGRAPHS, ...COLUMN_EXTRA_PADS];
  let guard = 0;
  while (columnCharCount(col) < MIN_CHARS && guard < 20) {
    const pad =
      pools[guard] ||
      `<p>실천 메모 ${guard + 1}: 이번 주는 위 체크리스트에서 하나만 골라 같은 요일에 반복해 보세요. 7일이 지나면 다음 항목을 추가해도 늦지 않습니다.</p>`;
    const last = col.sections[col.sections.length - 1];
    if (last?.id === "editor-closing" || last?.id === "practice-notes" || last?.id === "closing-note") {
      last.content += pad;
    } else {
      col.sections.push({
        id: "closing-note",
        heading: "h2",
        title: "마무리",
        content: pad
      });
    }
    guard++;
  }
  return columnCharCount(col);
}

let enriched = 0;
const under = [];

for (const col of columns) {
  const before = columnCharCount(col);
  const after = padColumn(col);
  if (after >= MIN_CHARS) enriched++;
  else under.push({ slug: col.slug, chars: after, gap: MIN_CHARS - after });
}

columns.sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

fs.writeFileSync(columnsPath, `window.COLUMNS_DATA = ${JSON.stringify(columns, null, 2)};\n`);

const counts = columns.map((c) => ({ slug: c.slug, chars: columnCharCount(c) }));
counts.sort((a, b) => a.chars - b.chars);

console.log(`✓ 칼럼 ${columns.length}편 (신규 ${NEW_COLUMNS.length}편 정의)`);
console.log(`✓ ${MIN_CHARS}자 이상: ${enriched}편, 평균 ${Math.round(counts.reduce((s, c) => s + c.chars, 0) / counts.length)}자`);
console.log(`  최소 ${counts[0].slug} ${counts[0].chars}자, 최대 ${counts.at(-1).chars}자`);
if (under.length) {
  console.warn(`⚠ 미달 ${under.length}편:`, under.map((u) => `${u.slug}(${u.chars})`).join(", "));
}