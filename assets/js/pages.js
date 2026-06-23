(function () {
  const page = document.body.dataset.page;
  const config = window.DataStore.getConfig();
  const base = window.SiteUtils.resolvePath("");

  window.SiteLayout.mountLayout(page === "categories" ? "categories" : page);

  if (page === "about") {
    window.SiteSEO.setPageMeta({
      title: `사이트 소개 | ${config.name}`,
      description: config.sitePurpose,
      canonical: `${config.siteUrl}/about/`
    });
    document.getElementById("about-purpose").textContent = config.sitePurpose;
    document.getElementById("about-topic").textContent = config.topic;
    document.getElementById("about-audience").textContent = config.targetAudience;
    document.getElementById("principles-list").innerHTML = config.editorialPrinciples
      .map((p) => `<li>${window.SiteUtils.escapeHtml(p)}</li>`)
      .join("");
  }

  if (page === "author") {
    window.SiteSEO.setPageMeta({
      title: `운영자 소개 | ${config.ownerName}`,
      description: `${config.ownerName} - ${config.ownerBio}`,
      canonical: `${config.siteUrl}/author/`
    });
    window.SiteSEO.personJsonLd(config);
    window.SiteSEO.breadcrumbJsonLd([
      { name: "홈", url: config.siteUrl + "/" },
      { name: "운영자 소개", url: config.siteUrl + "/author/" }
    ]);
    document.getElementById("author-name").textContent = config.ownerName;
    document.getElementById("author-bio").textContent = config.ownerBio;
    document.getElementById("author-purpose").textContent = config.sitePurpose;
    const expEl = document.getElementById("author-experience");
    if (expEl) expEl.textContent = config.ownerExperience || config.ownerBio;
    const expertiseEl = document.getElementById("author-expertise");
    if (expertiseEl && config.ownerExpertise?.length) {
      expertiseEl.innerHTML = config.ownerExpertise
        .map((item) => `<li>${window.SiteUtils.escapeHtml(item)}</li>`)
        .join("");
    }
    const updateEl = document.getElementById("author-update-policy");
    if (updateEl) updateEl.textContent = config.contentUpdatePolicy || "";
    const emailEl = document.getElementById("author-email");
    if (emailEl) {
      emailEl.href = `mailto:${config.contactEmail}`;
      emailEl.textContent = config.contactEmail;
    }

    window.AdminAuth.isLoggedIn().then((isAdmin) => {
      const banner = document.getElementById("author-admin-banner");
      if (isAdmin) {
        banner.classList.remove("hidden");
        banner.innerHTML = `
          <p><strong>관리자로 로그인되어 있습니다.</strong> 새 칼럼을 작성할 수 있습니다.</p>
          <a href="${base}admin/#columns-new" class="btn btn-primary" style="margin-top:0.5rem">새 칼럼 작성하기</a>`;
        document.getElementById("author-visitor-msg").classList.add("hidden");
      } else {
        document.getElementById("author-visitor-msg").textContent =
          "운영자가 정리한 칼럼을 읽어보세요. 편집 원칙과 최신 글도 함께 확인할 수 있습니다.";
      }
    });

    document.getElementById("author-principles").innerHTML = config.editorialPrinciples
      .map((p) => `<li>${window.SiteUtils.escapeHtml(p)}</li>`)
      .join("");

    const cols = window.DataStore.getColumns().sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    document.getElementById("author-columns").innerHTML = window.SiteLayout.renderColumnCards(cols);

    const ownerPosts = window.DataStore.getPosts()
      .filter((p) => p.author === config.ownerName)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 6);
    document.getElementById("author-posts").innerHTML = window.SiteLayout.renderPostCards(ownerPosts);
  }

  if (page === "contact") {
    window.SiteSEO.setPageMeta({
      title: `문의하기 | ${config.name}`,
      description: `${config.name}에 대한 문의는 이메일로 연락해 주세요.`,
      canonical: `${config.siteUrl}/contact/`
    });
    document.getElementById("contact-email").href = `mailto:${config.contactEmail}`;
    document.getElementById("contact-email").textContent = config.contactEmail;
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const msg = form.message.value.trim();
        const subject = encodeURIComponent(`[${config.name}] 문의`);
        const body = encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n${msg}`);
        window.location.href = `mailto:${config.contactEmail}?subject=${subject}&body=${body}`;
      });
    }
  }

  if (page === "categories") {
    const params = new URLSearchParams(window.location.search);
    const catSlug = params.get("cat");
    const categories = window.DataStore.getCategories();

    if (catSlug) {
      const cat = window.DataStore.getCategory(catSlug);
      if (!cat) {
        document.getElementById("page-content").innerHTML = "<p>카테고리를 찾을 수 없습니다.</p>";
        return;
      }
      window.SiteSEO.setPageMeta({
        title: `${cat.name} | ${config.name}`,
        description: cat.description,
        canonical: `${config.siteUrl}/categories/?cat=${cat.slug}`
      });
      document.getElementById("page-title").textContent = cat.name;
      document.getElementById("page-desc").textContent = cat.description;
      document.getElementById("category-posts").innerHTML = window.SiteLayout.renderPostCards(
        window.DataStore.getPostsByCategory(cat.slug).sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      document.getElementById("all-cats-nav").innerHTML = categories
        .map(
          (c) =>
            `<a href="?cat=${c.slug}" class="btn btn-secondary${c.slug === catSlug ? " active" : ""}">${window.SiteUtils.escapeHtml(c.name)}</a>`
        )
        .join(" ");
    } else {
      window.SiteSEO.setPageMeta({
        title: `카테고리 | ${config.name}`,
        description: "반려생활 정보를 주제별로 찾아볼 수 있습니다.",
        canonical: `${config.siteUrl}/categories/`
      });
      document.getElementById("page-title").textContent = "카테고리";
      document.getElementById("page-desc").textContent =
        "주제별로 정리된 글 목록입니다. 관심 있는 카테고리를 선택해 읽어보세요.";
      document.getElementById("category-posts").innerHTML = `<div class="category-grid">${categories
        .map((c) => {
          const count = window.DataStore.getPostsByCategory(c.slug).length;
          return `
          <a href="?cat=${c.slug}" class="category-card">
            <h3>${window.SiteUtils.escapeHtml(c.name)}</h3>
            <p>${window.SiteUtils.escapeHtml(c.description)}</p>
            <span class="category-count">글 ${count}편</span>
          </a>`;
        })
        .join("")}</div>`;
    }
  }

  if (page === "columns") {
    window.SiteSEO.setPageMeta({
      title: `운영자 칼럼 | ${config.name}`,
      description: `${config.ownerName}의 관점과 편집 메모를 담은 칼럼 목록입니다.`,
      canonical: `${config.siteUrl}/columns/`
    });
    window.AdminAuth.isLoggedIn().then((isAdmin) => {
      const adminBar = document.getElementById("columns-admin-bar");
      if (isAdmin && adminBar) {
        adminBar.classList.remove("hidden");
        adminBar.innerHTML = `<a href="${base}admin/#columns-new" class="btn btn-primary">새 칼럼 작성하기</a>`;
      }
    });
    document.getElementById("columns-list").innerHTML = window.SiteLayout.renderColumnCards(
      window.DataStore.getColumns().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
  }

  if (page === "sitemap") {
    window.SiteSEO.setPageMeta({
      title: `사이트맵 | ${config.name}`,
      description: "펫함께 가이드의 전체 페이지 목록입니다.",
      canonical: `${config.siteUrl}/sitemap/`
    });
    const posts = window.DataStore.getPosts();
    const cols = window.DataStore.getColumns();
    const cats = window.DataStore.getCategories();
    document.getElementById("sitemap-links").innerHTML = `
      <h2>주요 페이지</h2>
      <ul>
        <li><a href="${base}index.html">홈</a></li>
        <li><a href="${base}about/">사이트 소개</a></li>
        <li><a href="${base}author/">운영자 소개</a></li>
        <li><a href="${base}contact/">문의하기</a></li>
        <li><a href="${base}privacy/">개인정보처리방침</a></li>
        <li><a href="${base}terms/">이용약관</a></li>
        <li><a href="${base}disclaimer/">면책고지</a></li>
      </ul>
      <h2>카테고리</h2>
      <ul>${cats.map((c) => `<li><a href="${base}categories/?cat=${c.slug}">${window.SiteUtils.escapeHtml(c.name)}</a></li>`).join("")}</ul>
      <h2>글 (${posts.length})</h2>
      <ul>${posts.map((p) => `<li><a href="${base}posts/${p.slug}.html">${window.SiteUtils.escapeHtml(p.title)}</a></li>`).join("")}</ul>
      <h2>칼럼 (${cols.length})</h2>
      <ul>${cols.map((c) => `<li><a href="${base}columns/${c.slug}.html">${window.SiteUtils.escapeHtml(c.title)}</a></li>`).join("")}</ul>`;
  }
})();