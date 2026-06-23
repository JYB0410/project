(function () {
  const OPS_NOTICE =
    "편집 내용은 이 브라우저의 localStorage에 저장됩니다. 영구 반영은 JSON보내기 후 data 파일에 반영하고 서버를 재시작하세요. 세션은 2시간 후 만료됩니다.";

  let currentView = "dashboard";
  let editingPostSlug = null;
  let editingColumnSlug = null;

  function $(id) {
    return document.getElementById(id);
  }

  function showLogin() {
    $("admin-app").classList.add("hidden");
    $("admin-login").classList.remove("hidden");
  }

  async function showApp() {
    const status = await window.AdminAuth.checkSession(true);
    if (!status.authenticated) {
      showLogin();
      showLoginError("세션이 만료되었습니다. 다시 로그인하세요.");
      return;
    }
    $("admin-login").classList.add("hidden");
    $("admin-app").classList.remove("hidden");
    render();
  }

  function menuItems() {
    return [
      { id: "dashboard", label: "대시보드" },
      { id: "posts", label: "일반 글 관리" },
      { id: "posts-new", label: "새 글 작성" },
      { id: "columns", label: "칼럼 관리" },
      { id: "columns-new", label: "새 칼럼 작성" },
      { id: "categories", label: "카테고리" },
      { id: "settings", label: "사이트 설정" },
      { id: "data", label: "데이터보내기/가져오기" }
    ];
  }

  function setView(view) {
    currentView = view;
    location.hash = view;
    render();
  }

  function renderSidebar() {
    return `
      <div class="brand">펫함께 관리자<small>콘텐츠 관리</small></div>
      <ul class="admin-menu">
        ${menuItems()
          .map(
            (m) =>
              `<li><a href="#${m.id}" class="${currentView === m.id ? "active" : ""}" data-view="${m.id}">${m.label}</a></li>`
          )
          .join("")}
      </ul>`;
  }

  function statsCards() {
    const data = window.DataStore.load();
    const posts = data.posts;
    const cols = data.columns;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const featured = posts.filter((p) => p.featured).length;
    return `
      <div class="admin-cards">
        <div class="admin-card"><strong>${posts.length}</strong><span>총 글</span></div>
        <div class="admin-card"><strong>${cols.length}</strong><span>총 칼럼</span></div>
        <div class="admin-card"><strong>${data.categories.length}</strong><span>카테고리</span></div>
        <div class="admin-card"><strong>${published}</strong><span>발행 글</span></div>
        <div class="admin-card"><strong>${drafts}</strong><span>초안</span></div>
        <div class="admin-card"><strong>${featured}</strong><span>추천 글</span></div>
      </div>`;
  }

  function renderDashboard() {
    const data = window.DataStore.load();
    const recent = [...data.posts, ...data.columns]
      .sort((a, b) => new Date(b.updatedAt || b.publishedAt) - new Date(a.updatedAt || a.publishedAt))
      .slice(0, 8);
    return `
      <div class="admin-notice">${OPS_NOTICE}</div>
      ${statsCards()}
      <div class="admin-panel">
        <h2>최근 수정 콘텐츠</h2>
        <table class="admin-table">
          <thead><tr><th>제목</th><th>유형</th><th>상태</th><th>수정일</th></tr></thead>
          <tbody>
            ${recent
              .map((item) => {
                const isCol = !!item.perspective;
                return `<tr>
                  <td>${window.SiteUtils.escapeHtml(item.title)}</td>
                  <td>${isCol ? "칼럼" : "글"}</td>
                  <td><span class="badge badge-${item.status === "published" ? "published" : "draft"}">${item.status || "published"}</span></td>
                  <td>${window.SiteUtils.formatDate(item.updatedAt)}</td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function postList() {
    const posts = window.DataStore.getAllPosts();
    return `
      <div class="admin-panel">
        <h2>글 목록</h2>
        <table class="admin-table">
          <thead><tr><th>제목</th><th>카테고리</th><th>상태</th><th>추천</th><th>작업</th></tr></thead>
          <tbody>
            ${posts
              .map((p) => {
                const cat = window.DataStore.getCategory(p.category);
                return `<tr>
                  <td>${window.SiteUtils.escapeHtml(p.title)}</td>
                  <td>${cat ? cat.name : "-"}</td>
                  <td><span class="badge badge-${p.status === "published" ? "published" : "draft"}">${p.status}</span></td>
                  <td>${p.featured ? "★" : "-"}</td>
                  <td>
                    <button class="admin-btn secondary" data-edit-post="${p.slug}">수정</button>
                    <button class="admin-btn danger" data-del-post="${p.slug}">삭제</button>
                  </td>
                </tr>`;
              })
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function columnList() {
    const cols = window.DataStore.getAllColumns();
    return `
      <div class="admin-panel">
        <h2>칼럼 목록</h2>
        <table class="admin-table">
          <thead><tr><th>제목</th><th>상태</th><th>수정일</th><th>작업</th></tr></thead>
          <tbody>
            ${cols
              .map(
                (c) => `<tr>
                  <td>${window.SiteUtils.escapeHtml(c.title)}</td>
                  <td><span class="badge badge-${c.status === "published" ? "published" : "draft"}">${c.status}</span></td>
                  <td>${window.SiteUtils.formatDate(c.updatedAt)}</td>
                  <td>
                    <button class="admin-btn secondary" data-edit-col="${c.slug}">수정</button>
                    <button class="admin-btn danger" data-del-col="${c.slug}">삭제</button>
                  </td>
                </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function postForm(post = null) {
    const data = window.DataStore.load();
    const categories = data.categories;
    const p = post || {
      slug: "",
      title: "",
      subtitle: "",
      category: categories[0]?.slug || "",
      author: data.config.ownerName,
      publishedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      featured: false,
      status: "draft",
      excerpt: "",
      sections: [{ id: "section-1", heading: "h2", title: "섹션 제목", content: "<p>본문</p>" }],
      summary: "",
      commonMistakes: [],
      checklist: [],
      relatedSlugs: [],
      faq: []
    };
    return `
      <div class="admin-panel">
        <h2>${post ? "글 수정" : "새 글 작성"}</h2>
        <form class="admin-form" id="post-form">
          <div class="row"><label>제목</label><input name="title" value="${window.SiteUtils.escapeHtml(p.title)}" required></div>
          <div class="row"><label>슬러그</label><input name="slug" value="${window.SiteUtils.escapeHtml(p.slug)}" required></div>
          <div class="row"><label>요약</label><textarea name="excerpt">${window.SiteUtils.escapeHtml(p.excerpt)}</textarea></div>
          <div class="row"><label>서브타이틀</label><input name="subtitle" value="${window.SiteUtils.escapeHtml(p.subtitle)}"></div>
          <div class="row"><label>카테고리</label>
            <select name="category">${categories.map((c) => `<option value="${c.slug}" ${c.slug === p.category ? "selected" : ""}>${c.name}</option>`).join("")}</select>
          </div>
          <div class="row"><label>본문 섹션 (JSON)</label><textarea name="sections" rows="8">${JSON.stringify(p.sections, null, 2)}</textarea></div>
          <div class="row"><label>핵심 요약</label><textarea name="summary">${window.SiteUtils.escapeHtml(p.summary)}</textarea></div>
          <div class="row"><label>자주 하는 실수 (줄바꿈)</label><textarea name="commonMistakes">${(p.commonMistakes || []).join("\n")}</textarea></div>
          <div class="row"><label>체크리스트 (줄바꿈)</label><textarea name="checklist">${(p.checklist || []).join("\n")}</textarea></div>
          <div class="row"><label>관련 글 슬러그 (쉼표)</label><input name="relatedSlugs" value="${(p.relatedSlugs || []).join(", ")}"></div>
          <div class="row"><label>FAQ (JSON)</label><textarea name="faq" rows="4">${JSON.stringify(p.faq || [], null, 2)}</textarea></div>
          <div class="inline">
            <label><input type="checkbox" name="featured" ${p.featured ? "checked" : ""}> 추천글</label>
            <label>상태 <select name="status"><option value="published" ${p.status === "published" ? "selected" : ""}>발행</option><option value="draft" ${p.status === "draft" ? "selected" : ""}>초안</option></select></label>
            <label>발행일 <input type="date" name="publishedAt" value="${p.publishedAt}"></label>
            <label>수정일 <input type="date" name="updatedAt" value="${p.updatedAt}"></label>
          </div>
          <div class="admin-actions">
            <button type="submit" class="admin-btn">저장</button>
            <button type="button" class="admin-btn secondary" id="preview-post">미리보기</button>
            <button type="button" class="admin-btn secondary" data-view="posts">목록으로</button>
          </div>
        </form>
      </div>`;
  }

  function columnForm(col = null) {
    const data = window.DataStore.load();
    const c = col || {
      slug: "",
      title: "",
      subtitle: "",
      author: data.config.ownerName,
      publishedAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      status: "draft",
      excerpt: "",
      perspective: "",
      sections: [{ id: "section-1", heading: "h2", title: "섹션", content: "<p>본문</p>" }],
      summary: "",
      relatedSlugs: []
    };
    return `
      <div class="admin-panel">
        <h2>${col ? "칼럼 수정" : "새 칼럼 작성"}</h2>
        <p class="form-note">운영자 칼럼은 ${window.SiteUtils.escapeHtml(data.config.ownerName)}의 관점 글로 표시됩니다.</p>
        <form class="admin-form" id="column-form">
          <div class="row"><label>제목</label><input name="title" value="${window.SiteUtils.escapeHtml(c.title)}" required></div>
          <div class="row"><label>슬러그</label><input name="slug" value="${window.SiteUtils.escapeHtml(c.slug)}" required></div>
          <div class="row"><label>요약</label><textarea name="excerpt">${window.SiteUtils.escapeHtml(c.excerpt)}</textarea></div>
          <div class="row"><label>서브타이틀</label><input name="subtitle" value="${window.SiteUtils.escapeHtml(c.subtitle)}"></div>
          <div class="row"><label>관점</label><textarea name="perspective">${window.SiteUtils.escapeHtml(c.perspective)}</textarea></div>
          <div class="row"><label>본문 섹션 (JSON)</label><textarea name="sections" rows="8">${JSON.stringify(c.sections, null, 2)}</textarea></div>
          <div class="row"><label>핵심 요약</label><textarea name="summary">${window.SiteUtils.escapeHtml(c.summary)}</textarea></div>
          <div class="row"><label>관련 글 슬러그 (쉼표)</label><input name="relatedSlugs" value="${(c.relatedSlugs || []).join(", ")}"></div>
          <div class="inline">
            <label>상태 <select name="status"><option value="published" ${c.status === "published" ? "selected" : ""}>발행</option><option value="draft" ${c.status === "draft" ? "selected" : ""}>초안</option></select></label>
            <label>발행일 <input type="date" name="publishedAt" value="${c.publishedAt}"></label>
            <label>수정일 <input type="date" name="updatedAt" value="${c.updatedAt}"></label>
          </div>
          <div class="admin-actions">
            <button type="submit" class="admin-btn">저장</button>
            <button type="button" class="admin-btn secondary" id="preview-column">미리보기</button>
            <button type="button" class="admin-btn secondary" data-view="columns">목록으로</button>
          </div>
        </form>
      </div>`;
  }

  function settingsForm() {
    const c = window.DataStore.getConfig();
    return `
      <div class="admin-panel">
        <h2>사이트 설정</h2>
        <p class="form-note">변경 사항은 localStorage에 저장됩니다. 영구 반영을 원하면 JSON보내기 후 data 파일에 반영하세요.</p>
        <form class="admin-form" id="settings-form">
          <div class="row"><label>사이트명</label><input name="name" value="${window.SiteUtils.escapeHtml(c.name)}"></div>
          <div class="row"><label>한줄 소개</label><input name="tagline" value="${window.SiteUtils.escapeHtml(c.tagline)}"></div>
          <div class="row"><label>운영자명</label><input name="ownerName" value="${window.SiteUtils.escapeHtml(c.ownerName)}"></div>
          <div class="row"><label>운영자 소개</label><textarea name="ownerBio">${window.SiteUtils.escapeHtml(c.ownerBio)}</textarea></div>
          <div class="row"><label>이메일</label><input name="contactEmail" value="${window.SiteUtils.escapeHtml(c.contactEmail)}"></div>
          <div class="row"><label>메인 컬러</label><input name="mainColor" value="${c.mainColor}"></div>
          <div class="row"><label>서브 컬러</label><input name="subColor" value="${c.subColor}"></div>
          <div class="row"><label>기본 도메인</label><input name="siteUrl" value="${window.SiteUtils.escapeHtml(c.siteUrl)}"></div>
          <button type="submit" class="admin-btn">저장</button>
        </form>
      </div>`;
  }

  function categoriesView() {
    const cats = window.DataStore.getCategories();
    return `
      <div class="admin-panel">
        <h2>카테고리</h2>
        <p class="form-note">카테고리 구조는 data/categories.js에서 기본 관리됩니다. 여기서는 현재 로드된 목록을 확인합니다.</p>
        <table class="admin-table">
          <thead><tr><th>이름</th><th>슬러그</th><th>글 수</th></tr></thead>
          <tbody>${cats
            .map(
              (c) => `<tr>
                <td>${window.SiteUtils.escapeHtml(c.name)}</td>
                <td>${c.slug}</td>
                <td>${window.DataStore.getPostsByCategory(c.slug).length}</td>
              </tr>`
            )
            .join("")}</tbody>
        </table>
      </div>`;
  }

  function dataView() {
    return `
      <div class="admin-panel">
        <h2>데이터보내기 / 가져오기</h2>
        <p class="form-note">${OPS_NOTICE}</p>
        <p>추후 Supabase, Firebase, Git 기반 CMS 등으로 확장할 수 있도록 JSON 구조를 유지합니다.</p>
        <div class="admin-actions">
          <button class="admin-btn" id="export-json">JSON보내기</button>
          <button class="admin-btn secondary" id="reset-data">기본 데이터로 초기화</button>
        </div>
        <div class="row" style="margin-top:1rem">
          <label>JSON 가져오기</label>
          <textarea id="import-json" rows="10" placeholder="보낸 JSON을 붙여넣으세요"></textarea>
          <button class="admin-btn" id="import-btn" style="margin-top:0.5rem">가져오기</button>
        </div>
        <p class="form-note">영구 반영:보낸 JSON의 항목을 data/site.config.js, posts.js, columns.js에 수동 반영할 수 있습니다.</p>
      </div>`;
  }

  function renderMain() {
    if (currentView === "dashboard") return renderDashboard();
    if (currentView === "posts") return postList();
    if (currentView === "posts-new") return postForm();
    if (currentView === "posts-edit") {
      const post = window.DataStore.getAllPosts().find((p) => p.slug === editingPostSlug);
      return postForm(post);
    }
    if (currentView === "columns") return columnList();
    if (currentView === "columns-new") return columnForm();
    if (currentView === "columns-edit") {
      const col = window.DataStore.getAllColumns().find((c) => c.slug === editingColumnSlug);
      return columnForm(col);
    }
    if (currentView === "categories") return categoriesView();
    if (currentView === "settings") return settingsForm();
    if (currentView === "data") return dataView();
    return renderDashboard();
  }

  function render() {
    $("admin-sidebar").innerHTML = renderSidebar();
    $("admin-main").innerHTML = renderMain();
    bindEvents();
  }

  function sanitizeSections(sections) {
    const strip = window.ContentSanitize?.stripScripts || ((h) => h);
    return (sections || []).map((s) => ({
      ...s,
      id: window.ContentSanitize?.sanitizeSlug(s.id) || s.id,
      content: strip(s.content || "")
    }));
  }

  function savePostFromForm(form, originalSlug) {
    const data = window.DataStore.load();
    const fd = new FormData(form);
    const slug = window.ContentSanitize
      ? window.ContentSanitize.sanitizeSlug(fd.get("slug").trim())
      : fd.get("slug").trim();
    const post = {
      slug,
      title: fd.get("title").trim(),
      subtitle: fd.get("subtitle").trim(),
      category: fd.get("category"),
      author: data.config.ownerName,
      publishedAt: fd.get("publishedAt"),
      updatedAt: fd.get("updatedAt"),
      featured: !!form.featured?.checked,
      status: fd.get("status"),
      excerpt: fd.get("excerpt").trim(),
      sections: sanitizeSections(JSON.parse(fd.get("sections"))),
      summary: fd.get("summary").trim(),
      commonMistakes: fd.get("commonMistakes").split("\n").map((s) => s.trim()).filter(Boolean),
      checklist: fd.get("checklist").split("\n").map((s) => s.trim()).filter(Boolean),
      relatedSlugs: fd.get("relatedSlugs").split(",").map((s) => s.trim()).filter(Boolean),
      faq: JSON.parse(fd.get("faq") || "[]")
    };
    if (originalSlug && originalSlug !== slug) {
      data.posts = data.posts.filter((p) => p.slug !== originalSlug);
    } else if (!originalSlug) {
      data.posts = data.posts.filter((p) => p.slug !== slug);
    } else {
      data.posts = data.posts.filter((p) => p.slug !== originalSlug);
    }
    data.posts.push(post);
    window.DataStore.save(data);
    alert("저장되었습니다. (localStorage)");
    setView("posts");
  }

  function saveColumnFromForm(form, originalSlug) {
    const data = window.DataStore.load();
    const fd = new FormData(form);
    const slug = window.ContentSanitize
      ? window.ContentSanitize.sanitizeSlug(fd.get("slug").trim())
      : fd.get("slug").trim();
    const col = {
      slug,
      title: fd.get("title").trim(),
      subtitle: fd.get("subtitle").trim(),
      author: data.config.ownerName,
      publishedAt: fd.get("publishedAt"),
      updatedAt: fd.get("updatedAt"),
      status: fd.get("status"),
      excerpt: fd.get("excerpt").trim(),
      perspective: fd.get("perspective").trim(),
      sections: sanitizeSections(JSON.parse(fd.get("sections"))),
      summary: fd.get("summary").trim(),
      relatedSlugs: fd.get("relatedSlugs").split(",").map((s) => s.trim()).filter(Boolean)
    };
    data.columns = data.columns.filter((c) => c.slug !== (originalSlug || slug));
    data.columns.push(col);
    window.DataStore.save(data);
    alert("저장되었습니다. (localStorage)");
    setView("columns");
  }

  function bindEvents() {
    document.querySelectorAll("[data-view]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        setView(el.dataset.view);
      });
    });

    document.querySelectorAll("[data-edit-post]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingPostSlug = btn.dataset.editPost;
        currentView = "posts-edit";
        render();
      });
    });
    document.querySelectorAll("[data-del-post]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("삭제하시겠습니까?")) return;
        const data = window.DataStore.load();
        data.posts = data.posts.filter((p) => p.slug !== btn.dataset.delPost);
        window.DataStore.save(data);
        render();
      });
    });

    document.querySelectorAll("[data-edit-col]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingColumnSlug = btn.dataset.editCol;
        currentView = "columns-edit";
        render();
      });
    });
    document.querySelectorAll("[data-del-col]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!confirm("삭제하시겠습니까?")) return;
        const data = window.DataStore.load();
        data.columns = data.columns.filter((c) => c.slug !== btn.dataset.delCol);
        window.DataStore.save(data);
        render();
      });
    });

    const postForm = $("post-form");
    if (postForm) {
      postForm.addEventListener("submit", (e) => {
        e.preventDefault();
        savePostFromForm(postForm, editingPostSlug);
        editingPostSlug = null;
      });
      const preview = $("preview-post");
      if (preview) {
        preview.addEventListener("click", () => {
          const slug = postForm.slug.value.trim();
          if (slug) window.open(`../posts/${slug}.html`, "_blank");
        });
      }
    }

    const columnForm = $("column-form");
    if (columnForm) {
      columnForm.addEventListener("submit", (e) => {
        e.preventDefault();
        saveColumnFromForm(columnForm, editingColumnSlug);
        editingColumnSlug = null;
      });
      const preview = $("preview-column");
      if (preview) {
        preview.addEventListener("click", () => {
          const slug = columnForm.slug.value.trim();
          if (slug) window.open(`../columns/${slug}.html`, "_blank");
        });
      }
    }

    const settingsForm = $("settings-form");
    if (settingsForm) {
      settingsForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = window.DataStore.load();
        const fd = new FormData(settingsForm);
        data.config = {
          ...data.config,
          name: fd.get("name"),
          tagline: fd.get("tagline"),
          ownerName: fd.get("ownerName"),
          ownerBio: fd.get("ownerBio"),
          contactEmail: fd.get("contactEmail"),
          mainColor: fd.get("mainColor"),
          subColor: fd.get("subColor"),
          siteUrl: fd.get("siteUrl")
        };
        window.DataStore.save(data);
        window.DataStore.applyTheme(data.config);
        alert("설정이 저장되었습니다.");
      });
    }

    const exportBtn = $("export-json");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const blob = new Blob([window.DataStore.exportJSON()], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "pethamkke-data.json";
        a.click();
      });
    }
    const importBtn = $("import-btn");
    if (importBtn) {
      importBtn.addEventListener("click", () => {
        try {
          window.DataStore.importJSON($("import-json").value);
          alert("가져오기 완료");
          render();
        } catch (err) {
          alert("가져오기 실패: " + err.message);
        }
      });
    }
    const resetBtn = $("reset-data");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("기본 데이터로 초기화할까요?")) {
          window.DataStore.reset();
          render();
        }
      });
    }
  }

  function showLoginError(msg) {
    const el = $("login-error");
    if (!msg) {
      el.classList.add("hidden");
      el.textContent = "";
      return;
    }
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  async function init() {
    const hash = location.hash.replace("#", "");
    if (hash) currentView = hash;

    $("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      showLoginError("");
      const pw = $("admin-password").value;
      const result = await window.AdminAuth.login(pw);
      if (result.ok) {
        $("admin-password").value = "";
        await showApp();
      } else {
        showLoginError(result.error);
      }
    });

    $("logout-btn").addEventListener("click", async () => {
      await window.AdminAuth.logout();
      showLogin();
    });

    const status = await window.AdminAuth.checkSession(true);
    const setupNotice = $("setup-notice");

    if (!status.serverMode) {
      setupNotice.classList.remove("hidden");
      setupNotice.textContent =
        "관리자 인증은 node server.js 실행 시에만 동작합니다. python -m http.server 등 정적 서버에서는 로그인할 수 없습니다.";
      showLogin();
      return;
    }

    if (!status.configured) {
      setupNotice.classList.remove("hidden");
      setupNotice.textContent =
        "관리자 비밀번호가 설정되지 않았습니다. 터미널에서 node scripts/setup-admin.js 를 실행하세요.";
      showLogin();
      return;
    }

    if (status.authenticated) showApp();
    else showLogin();
  }

  document.addEventListener("DOMContentLoaded", init);
})();