(function () {
  const ALLOWED_TAGS = new Set([
    "p", "br", "strong", "em", "b", "i", "u", "ul", "ol", "li", "a", "h2", "h3", "h4",
    "blockquote", "aside", "div", "figure", "figcaption", "img"
  ]);

  const IMG_ATTRS = new Set(["src", "alt", "class", "loading", "width", "height"]);

  function stripScripts(html) {
    if (!html) return "";
    const template = document.createElement("template");
    template.innerHTML = html;

    template.content.querySelectorAll("script, style, iframe, object, embed, form, input, button").forEach((el) => el.remove());

    template.content.querySelectorAll("*").forEach((el) => {
      if (!ALLOWED_TAGS.has(el.tagName.toLowerCase())) {
        const text = document.createTextNode(el.textContent);
        el.replaceWith(text);
        return;
      }
      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on")) el.removeAttribute(attr.name);
        if (el.tagName.toLowerCase() === "a" && name !== "href") el.removeAttribute(attr.name);
        if (el.tagName.toLowerCase() === "img") {
          if (!IMG_ATTRS.has(name)) el.removeAttribute(attr.name);
          if (name === "src" && !/^(https?:\/\/|\.\.\/assets\/|\/?assets\/)/i.test(attr.value)) {
            el.removeAttribute("src");
          }
          return;
        }
        if ((el.tagName.toLowerCase() === "aside" || el.tagName.toLowerCase() === "div" || el.tagName.toLowerCase() === "figure") && name !== "class") {
          el.removeAttribute(attr.name);
        }
        if (name === "href" && /^\s*javascript:/i.test(attr.value)) el.removeAttribute("href");
      });
    });

    return template.innerHTML;
  }

  function sanitizeSlug(slug) {
    return String(slug || "")
      .toLowerCase()
      .replace(/[^a-z0-9가-힣-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
  }

  function validateImportSize(jsonStr, maxBytes = 2 * 1024 * 1024) {
    if (jsonStr.length > maxBytes) throw new Error("가져오기 데이터가 너무 큽니다 (최대 2MB).");
  }

  window.ContentSanitize = { stripScripts, sanitizeSlug, validateImportSize };
})();