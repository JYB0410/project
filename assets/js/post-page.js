(function () {
  function resolveSlug() {
    if (window.POST_SLUG) return window.POST_SLUG;
    const match = window.location.pathname.match(/\/posts\/([^/]+)\.html$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  const slug = resolveSlug();
  const articleRoot = document.getElementById("article-root");
  const isPrerendered = articleRoot?.dataset.prerendered === "true";

  if (!slug) {
    if (articleRoot) {
      articleRoot.innerHTML =
        '<div class="error-page"><h1>글을 불러올 수 없습니다</h1><p><a href="../index.html">홈으로</a></p></div>';
    }
    window.SiteLayout?.mountLayout("");
    return;
  }

  const post = window.DataStore.getPosts({ slug });
  const config = window.DataStore.getConfig();
  if (!post) {
    if (articleRoot) {
      articleRoot.innerHTML =
        '<div class="error-page"><h1>글을 찾을 수 없습니다</h1><p><a href="../index.html">홈으로</a></p></div>';
    }
    return;
  }

  const cat = window.DataStore.getCategory(post.category);
  const base = window.SiteUtils.resolvePath("");
  const canonical = `${config.siteUrl}/posts/${post.slug}.html`;

  window.SiteSEO.setPageMeta({
    title: `${post.title} | ${config.name}`,
    description: post.excerpt,
    canonical,
    ogType: "article"
  });

  window.SiteSEO.breadcrumbJsonLd([
    { name: "홈", url: config.siteUrl + "/" },
    { name: "카테고리", url: config.siteUrl + "/categories/" },
    { name: cat ? cat.name : "글", url: `${config.siteUrl}/categories/?cat=${post.category}` },
    { name: post.title, url: canonical }
  ]);
  window.SiteSEO.articleJsonLd(post, config);
  window.SiteSEO.faqJsonLd(post.faq);

  window.SiteLayout.mountLayout("");

  if (isPrerendered) {
    const editorWrap = document.getElementById("editor-box-wrap");
    if (editorWrap) editorWrap.innerHTML = window.SiteLayout.renderEditorBox(config);
    return;
  }

  const breadcrumbEl = document.getElementById("breadcrumb");
  if (breadcrumbEl) {
    breadcrumbEl.innerHTML = window.SiteLayout.renderBreadcrumb([
      { name: "홈", url: base + "index.html" },
      { name: "카테고리", url: base + "categories/index.html" },
      { name: cat ? cat.name : "글", url: base + `categories/index.html?cat=${post.category}` },
      { name: post.title, url: "#" }
    ]);
  }

  articleRoot.innerHTML = window.SiteRender.renderPostArticle(post, config);
  document.getElementById("editor-box-wrap").innerHTML = window.SiteLayout.renderEditorBox(config);
})();