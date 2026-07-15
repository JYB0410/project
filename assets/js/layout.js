(function () {
  const { escapeHtml, formatDate, resolvePath } = window.SiteUtils;

  function ownerLink(config, className = "owner-link") {
    const href = resolvePath("author/");
    return `<a href="${href}" class="${className}">${escapeHtml(config.ownerName)}</a>`;
  }

  function renderHeader(active = "") {
    const config = window.DataStore.getConfig();
    const categories = window.DataStore.getCategories();
    const navItems = [
      { href: "index.html", label: "홈", key: "home" },
      { href: "about/", label: "소개", key: "about" },
      { href: "categories/", label: "가이드", key: "categories" },
      { href: "columns/", label: "칼럼", key: "columns" },
      { href: "contact/", label: "문의", key: "contact" }
    ];

    const catLinks = categories
      .map(
        (c) =>
          `<li><a href="${resolvePath("categories/index.html")}?cat=${c.slug}" class="subnav-chip">${escapeHtml(c.name)}</a></li>`
      )
      .join("");

    return `
    <header class="site-header" role="banner">
      <div class="container header-inner">
        <a href="${resolvePath("index.html")}" class="logo" aria-label="${escapeHtml(config.name)} 홈">
          <span class="logo-mark" aria-hidden="true">🍞</span>
          <span class="logo-text"><strong>${escapeHtml(config.name)}</strong></span>
        </a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" type="button">
          <span class="sr-only">메뉴 열기</span>
          <span aria-hidden="true"></span>
        </button>
        <nav id="main-nav" class="main-nav" aria-label="주요 메뉴">
          <ul class="nav-list">
            ${navItems
              .map(
                (n) =>
                  `<li><a href="${resolvePath(n.href)}" class="nav-link ${active === n.key ? "active" : ""}">${n.label}</a></li>`
              )
              .join("")}
          </ul>
        </nav>
      </div>
      <div class="site-subnav" aria-label="카테고리 바로가기">
        <div class="container subnav-inner">
          <span class="subnav-label">주제</span>
          <ul class="subnav-list">${catLinks}</ul>
        </div>
      </div>
    </header>`;
  }

  function renderFooter() {
    const config = window.DataStore.getConfig();
    const year = new Date().getFullYear();
    return `
    <footer class="site-footer" role="contentinfo">
      <div class="container footer-grid">
        <section class="footer-brand">
          <h2>${escapeHtml(config.name)}</h2>
          <p>${escapeHtml(config.tagline)}</p>
          <p class="footer-topic">주제: ${escapeHtml(config.topic)}</p>
        </section>
        <section>
          <h3>바로가기</h3>
          <ul class="footer-links">
            <li><a href="${resolvePath("about/")}">소개</a></li>
            <li><a href="${resolvePath("categories/")}">가이드</a></li>
            <li><a href="${resolvePath("columns/")}">칼럼</a></li>
            <li><a href="${resolvePath("author/")}">운영자</a></li>
            <li><a href="${resolvePath("contact/")}">문의하기</a></li>
            <li><a href="${resolvePath("sitemap/")}">사이트맵</a></li>
          </ul>
        </section>
        <section>
          <h3>정책</h3>
          <ul class="footer-links">
            <li><a href="${resolvePath("privacy/")}">개인정보처리방침</a></li>
            <li><a href="${resolvePath("terms/")}">이용약관</a></li>
            <li><a href="${resolvePath("disclaimer/")}">면책고지</a></li>
            <li><button type="button" class="footer-cookie-btn" id="footer-cookie-settings">쿠키 설정</button></li>
          </ul>
        </section>
        <section>
          <h3>운영</h3>
          <p>운영자: ${ownerLink(config)}</p>
          <p>문의: <a href="mailto:${escapeHtml(config.contactEmail)}">${escapeHtml(config.contactEmail)}</a></p>
        </section>
      </div>
      <div class="container footer-bottom">
        <p>© ${year} ${escapeHtml(config.name)}. 일반 정보 제공 목적의 사이트입니다.</p>
        <p class="footer-note">${escapeHtml(config.disclaimerShort)}</p>
      </div>
    </footer>`;
  }

  function renderBreadcrumb(items) {
    return `
    <nav class="breadcrumb" aria-label="breadcrumb">
      <ol>
        ${items
          .map((item, i) => {
            const isLast = i === items.length - 1;
            if (isLast) return `<li aria-current="page">${escapeHtml(item.name)}</li>`;
            return `<li><a href="${item.url}">${escapeHtml(item.name)}</a></li>`;
          })
          .join("")}
      </ol>
    </nav>`;
  }

  function renderEditorBox(config) {
    return `
    <aside class="editor-box" aria-label="편집자 소개">
      <div class="editor-avatar" aria-hidden="true">${config.ownerName.charAt(0)}</div>
      <div>
        <p class="editor-label">편집·운영</p>
        <h3>${ownerLink(config, "owner-link editor-name")}</h3>
        <p>${escapeHtml(config.ownerBio)}</p>
        <a href="${resolvePath("author/")}" class="text-link">운영자 소개와 칼럼 보기 →</a>
      </div>
    </aside>`;
  }

  function renderPostCards(posts, base = "posts/") {
    if (!posts.length) return '<p class="empty-msg">표시할 글이 없습니다.</p>';
    return `<div class="card-grid">${posts
      .map((post) => {
        const cat = window.DataStore.getCategory(post.category);
        const cover = window.SiteUtils.postCoverSrc(post);
        const media = cover
          ? `<img src="${cover}" alt="" class="card-media" loading="lazy" width="640" height="360">`
          : "";
        return `
        <article class="post-card">
          <a href="${resolvePath(base + post.slug + ".html")}" class="card-link">
            ${media}
            <div class="card-body">
              <span class="card-category">${escapeHtml(cat ? cat.name : "")}</span>
              <h3>${escapeHtml(post.title)}</h3>
              <p>${escapeHtml(post.excerpt)}</p>
              <time datetime="${post.updatedAt}">수정 ${formatDate(post.updatedAt)}</time>
            </div>
          </a>
        </article>`;
      })
      .join("")}</div>`;
  }

  function renderColumnCards(columns) {
    if (!columns.length) return '<p class="empty-msg">표시할 칼럼이 없습니다.</p>';
    return `<div class="card-grid column-grid">${columns
      .map(
        (col) => `
      <article class="post-card column-card">
        <a href="${resolvePath("columns/" + col.slug + ".html")}" class="card-link">
          <span class="card-badge">운영자 칼럼</span>
          <h3>${escapeHtml(col.title)}</h3>
          <p>${escapeHtml(col.excerpt)}</p>
          <time datetime="${col.updatedAt}">${formatDate(col.updatedAt)}</time>
        </a>
      </article>`
      )
      .join("")}</div>`;
  }

  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector("#main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
  }

  function initSubnavActive() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("cat");
    if (!cat) return;
    document.querySelectorAll(".subnav-chip").forEach((link) => {
      if (link.href.includes(`cat=${cat}`)) link.classList.add("active");
    });
  }

  function applyTheme() {
    const config = window.DataStore?.getConfig?.();
    if (!config) return;
    const root = document.documentElement;
    if (config.mainColor) root.style.setProperty("--color-main", config.mainColor);
    if (config.subColor) root.style.setProperty("--color-sub", config.subColor);
  }

  function mountLayout(active) {
    applyTheme();
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.innerHTML = renderHeader(active);
    if (footerEl) footerEl.innerHTML = renderFooter();
    initNavToggle();
    initSubnavActive();
    const cookieBtn = document.getElementById("footer-cookie-settings");
    if (cookieBtn) {
      cookieBtn.addEventListener("click", () => {
        if (window.PetHamkkeConsent?.reopen) window.PetHamkkeConsent.reopen();
      });
    }
  }

  window.SiteLayout = {
    renderHeader,
    renderFooter,
    renderBreadcrumb,
    renderEditorBox,
    renderPostCards,
    renderColumnCards,
    ownerLink,
    mountLayout
  };
})();