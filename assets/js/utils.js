(function () {
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
  }

  function basePath() {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (path.includes("/posts/") || path.includes("/columns/") || path.includes("/categories/")) return "../";
    if (path.endsWith("/admin/") || path.match(/\/(about|author|contact|privacy|terms|disclaimer|sitemap)\//)) return "../";
    return "";
  }

  function resolvePath(href) {
    if (href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) return href;
    return basePath() + href;
  }

  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function buildToc(sections) {
    return (sections || []).map((s) => ({ id: s.id, title: s.title }));
  }

  function postCoverSrc(post, base = "") {
    if (!post) return "";
    if (post.coverImage) return resolvePath(base + post.coverImage.replace(/^\.\.\//, ""));
    const sec = (post.sections || []).find((s) => s.content && s.content.includes("article-figure"));
    if (!sec) return "";
    const m = sec.content.match(/src="([^"]+photos\/[^"]+)"/);
    return m ? resolvePath(base + m[1].replace(/^\.\.\//, "")) : "";
  }

  window.SiteUtils = { escapeHtml, formatDate, basePath, resolvePath, slugify, buildToc, postCoverSrc };
})();