(function () {
  function resolveSlug() {
    if (window.COLUMN_SLUG) return window.COLUMN_SLUG;
    const match = window.location.pathname.match(/\/columns\/([^/]+)\.html$/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  const slug = resolveSlug();
  const articleRoot = document.getElementById("article-root");
  const isPrerendered = articleRoot?.dataset.prerendered === "true";

  if (!slug) {
    if (articleRoot) {
      articleRoot.innerHTML =
        '<div class="error-page"><h1>칼럼을 불러올 수 없습니다</h1><p><a href="../index.html">홈으로</a></p></div>';
    }
    window.SiteLayout?.mountLayout("columns");
    return;
  }

  const col = window.DataStore.getColumns({ slug });
  const config = window.DataStore.getConfig();
  if (!col) {
    if (articleRoot) {
      articleRoot.innerHTML =
        '<div class="error-page"><h1>칼럼을 찾을 수 없습니다</h1><p><a href="../index.html">홈으로</a></p></div>';
    }
    return;
  }

  const base = window.SiteUtils.resolvePath("");
  const canonical = `${config.siteUrl}/columns/${col.slug}.html`;

  window.SiteSEO.setPageMeta({
    title: `${col.title} | ${config.ownerName} 칼럼`,
    description: col.excerpt,
    canonical,
    ogType: "article"
  });

  window.SiteSEO.breadcrumbJsonLd([
    { name: "홈", url: config.siteUrl + "/" },
    { name: "칼럼", url: config.siteUrl + "/columns/" },
    { name: col.title, url: canonical }
  ]);
  window.SiteSEO.articleJsonLd(col, config);

  window.SiteLayout.mountLayout("columns");

  const breadcrumbItems = [
    { name: "홈", url: base + "index.html" },
    { name: "칼럼", url: base + "columns/index.html" },
    { name: col.title, url: "#" }
  ];
  const existingBreadcrumb = document.querySelector("main .breadcrumb");
  if (!existingBreadcrumb?.querySelector("ol li")) {
    const breadcrumbEl = document.getElementById("breadcrumb");
    const target = breadcrumbEl || existingBreadcrumb;
    if (target) {
      target.outerHTML = window.SiteLayout.renderBreadcrumb(breadcrumbItems);
    } else {
      const main = document.querySelector("main.page-main");
      if (main) {
        main.insertAdjacentHTML("afterbegin", window.SiteLayout.renderBreadcrumb(breadcrumbItems));
      }
    }
  }

  if (isPrerendered) {
    const editorWrap = document.getElementById("editor-box-wrap");
    if (editorWrap) editorWrap.innerHTML = window.SiteLayout.renderEditorBox(config);
    return;
  }

  articleRoot.innerHTML = window.SiteRender.renderColumnArticle(col, config);
  document.getElementById("editor-box-wrap").innerHTML = window.SiteLayout.renderEditorBox(config);
})();