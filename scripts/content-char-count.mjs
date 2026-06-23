export const MIN_CHARS = 2000;

export const stripHtml = (s) => s.replace(/<[^>]+>/g, "");

/** 공백 미포함 글자수 (HTML 태그 제거 후) */
export function charCountNoSpace(html) {
  return stripHtml(html).replace(/\s/g, "").length;
}

export function postCharCount(post) {
  return charCountNoSpace(post.sections.map((s) => s.content).join(""));
}

export function postBaseCharCount(post) {
  return charCountNoSpace(
    post.sections.filter((s) => s.id !== "practice-notes").map((s) => s.content).join("")
  );
}