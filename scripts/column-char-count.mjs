import { charCountNoSpace } from "./content-char-count.mjs";

export function columnCharCount(col) {
  const html = [
    col.perspective,
    col.excerpt,
    col.summary,
    ...(col.sections || []).map((s) => s.content)
  ].join("");
  return charCountNoSpace(html);
}