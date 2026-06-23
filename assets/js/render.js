(function () {
  const { escapeHtml, formatDate, resolvePath } = window.SiteUtils;

  function renderToc(sections) {
    if (!sections || !sections.length) return "";
    return `
    <nav class="article-toc" aria-label="목차">
      <h2>목차</h2>
      <ol>
        ${sections.map((s) => `<li><a href="#${s.id}">${escapeHtml(s.title)}</a></li>`).join("")}
      </ol>
    </nav>`;
  }

  function renderSections(sections) {
    const sanitize = window.ContentSanitize?.stripScripts || ((html) => html);
    return (sections || [])
      .map(
        (s) => `
      <section id="${escapeHtml(s.id)}" class="article-section">
        <${s.heading || "h2"}>${escapeHtml(s.title)}</${s.heading || "h2"}>
        ${sanitize(s.content)}
      </section>`
      )
      .join("");
  }

  function renderSummaryBox(text) {
    return `
    <aside class="summary-box" aria-label="핵심 요약">
      <h2>핵심 요약</h2>
      <p>${escapeHtml(text)}</p>
    </aside>`;
  }

  function renderMistakesList(items) {
    if (!items || !items.length) return "";
    return `
    <section class="mistakes-box">
      <h2>초보자가 자주 실수하는 포인트</h2>
      <ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
    </section>`;
  }

  function renderChecklist(items) {
    if (!items || !items.length) return "";
    return `
    <section class="checklist-box">
      <h2>체크리스트</h2>
      <ul class="check-list">${items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
    </section>`;
  }

  function renderRelatedPosts(slugs) {
    const posts = window.DataStore.getRelatedPosts(slugs);
    if (!posts.length) return "";
    return `
    <section class="related-posts">
      <h2>관련 글</h2>
      <ul>
        ${posts
          .map(
            (p) =>
              `<li><a href="${resolvePath("posts/" + p.slug + ".html")}">${escapeHtml(p.title)}</a></li>`
          )
          .join("")}
      </ul>
    </section>`;
  }

  function renderFaq(faq) {
    if (!faq || !faq.length) return "";
    return `
    <section class="faq-section">
      <h2>자주 묻는 질문</h2>
      <dl>
        ${faq.map((f) => `<dt>${escapeHtml(f.q)}</dt><dd>${escapeHtml(f.a)}</dd>`).join("")}
      </dl>
    </section>`;
  }

  function renderArticleFooterNote() {
    return `
    <p class="article-note">이 글은 초보자 기준으로 이해하기 쉽게 정리되었으며, 내용은 운영 과정에서 순차적으로 보완될 수 있습니다.</p>`;
  }

  function renderPostArticle(post, config) {
    const cat = window.DataStore.getCategory(post.category);
    return `
    <article class="article-main">
      <header class="article-header">
        <p class="article-category"><a href="${resolvePath("categories/index.html")}?cat=${post.category}">${escapeHtml(cat ? cat.name : "")}</a></p>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="article-subtitle">${escapeHtml(post.subtitle)}</p>
        <div class="article-meta">
          <span>작성 ${ownerLinkInline(config)}</span>
          <span>발행 <time datetime="${post.publishedAt}">${formatDate(post.publishedAt)}</time></span>
          <span>수정 <time datetime="${post.updatedAt}">${formatDate(post.updatedAt)}</time></span>
        </div>
      </header>
      ${renderToc(post.sections)}
      <div class="article-body">
        ${renderSections(post.sections)}
        ${renderSummaryBox(post.summary)}
        ${renderMistakesList(post.commonMistakes)}
        ${renderChecklist(post.checklist)}
        ${renderFaq(post.faq)}
        ${renderRelatedPosts(post.relatedSlugs)}
        ${renderArticleFooterNote()}
      </div>
    </article>`;
  }

  function ownerLinkInline(config) {
    return `<a href="${resolvePath("author/")}" class="owner-link">${escapeHtml(config.ownerName)}</a>`;
  }

  function renderColumnArticle(col, config) {
    return `
    <article class="article-main column-article">
      <header class="article-header">
        <p class="card-badge">운영자 칼럼</p>
        <h1>${escapeHtml(col.title)}</h1>
        <p class="article-subtitle">${escapeHtml(col.subtitle)}</p>
        <div class="article-meta">
          <span>${ownerLinkInline(config)}</span>
          <span>발행 <time datetime="${col.publishedAt}">${formatDate(col.publishedAt)}</time></span>
          <span>수정 <time datetime="${col.updatedAt}">${formatDate(col.updatedAt)}</time></span>
        </div>
      </header>
      <div class="perspective-box">
        <h2>관점</h2>
        <p>${escapeHtml(col.perspective)}</p>
      </div>
      <div class="article-body">
        ${renderSections(col.sections)}
        ${renderSummaryBox(col.summary)}
        ${renderRelatedPosts(col.relatedSlugs)}
        ${renderArticleFooterNote()}
      </div>
    </article>`;
  }

  window.SiteRender = {
    renderPostArticle,
    renderColumnArticle,
    renderToc,
    renderSections,
    renderSummaryBox,
    renderMistakesList,
    renderChecklist,
    renderRelatedPosts,
    renderFaq
  };
})();