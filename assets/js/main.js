(function () {
  const config = window.DataStore.getConfig();
  const categories = window.DataStore.getCategories();

  window.SiteSEO.setPageMeta({
    title: `${config.name} | ${config.tagline}`,
    description: `${config.tagline}. ${config.topic}.`,
    canonical: `${config.siteUrl}/`
  });
  window.SiteSEO.websiteJsonLd(config);

  window.SiteLayout.mountLayout("home");

  document.getElementById("hero-title").textContent = config.name;
  document.getElementById("hero-lead").textContent = config.tagline;
  document.getElementById("hero-topic").textContent = config.topic;
  document.getElementById("hero-audience").textContent = `대상 독자: ${config.targetAudience}`;
  document.getElementById("site-purpose-text").textContent = config.sitePurpose;

  const catGrid = document.getElementById("category-grid");
  catGrid.innerHTML = categories
    .map((c) => {
      const count = window.DataStore.getPostsByCategory(c.slug).length;
      return `
      <a href="${window.SiteUtils.resolvePath("categories/index.html")}?cat=${c.slug}" class="category-card">
        <h3>${window.SiteUtils.escapeHtml(c.name)}</h3>
        <p>${window.SiteUtils.escapeHtml(c.description)}</p>
        <span class="category-count">글 ${count}편</span>
      </a>`;
    })
    .join("");

  document.getElementById("latest-posts").innerHTML = window.SiteLayout.renderPostCards(
    window.DataStore.getLatestPosts(6)
  );
  document.getElementById("featured-posts").innerHTML = window.SiteLayout.renderPostCards(
    window.DataStore.getFeaturedPosts(4)
  );
  const columnSection = document.getElementById("column-section");
  const columns = window.DataStore.getColumns();
  if (columnSection) {
    if (columns.length) {
      document.getElementById("column-preview").innerHTML = window.SiteLayout.renderColumnCards(
        columns.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3)
      );
    } else {
      columnSection.hidden = true;
    }
  }

  const principles = document.getElementById("principles-list");
  principles.innerHTML = config.editorialPrinciples
    .map((p) => `<li>${window.SiteUtils.escapeHtml(p)}</li>`)
    .join("");

  document.getElementById("editor-mini").innerHTML = `
    <div class="editor-avatar" aria-hidden="true">${config.ownerName.charAt(0)}</div>
    <div>
      <p class="editor-label">편집·운영</p>
      <h3>${window.SiteLayout.ownerLink(config, "owner-link")}</h3>
      <p>${window.SiteUtils.escapeHtml(config.ownerBio)}</p>
      <a href="${window.SiteUtils.resolvePath("author/")}" class="text-link">운영자 소개 보기 →</a>
    </div>`;

  document.getElementById("contact-email-cta").href = `mailto:${config.contactEmail}`;
  document.getElementById("contact-email-cta").textContent = config.contactEmail;
})();