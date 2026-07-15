(function () {
  const STORAGE_KEY = "breadblog_cms_data";

  function getDefaults() {
    return {
      config: window.SITE_CONFIG || {},
      categories: window.CATEGORIES_DATA || [],
      posts: window.POSTS_DATA || [],
      columns: window.COLUMNS_DATA || []
    };
  }

  function isAdminPage() {
    return /\/admin(?:\/|$)/.test(window.location.pathname || "");
  }

  function mergeBySlug(defaultItems, cachedItems) {
    const bySlug = new Map((cachedItems || []).map((item) => [item.slug, item]));
    for (const item of defaultItems || []) {
      if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
    }
    return [...bySlug.values()];
  }

  function load() {
    if (!isAdminPage()) return getDefaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaults();
      const parsed = JSON.parse(raw);
      const defaults = getDefaults();
      return {
        config: { ...defaults.config, ...(parsed.config || {}) },
        categories: parsed.categories || defaults.categories,
        posts: mergeBySlug(defaults.posts, parsed.posts),
        columns: mergeBySlug(defaults.columns, parsed.columns)
      };
    } catch (e) {
      console.warn("데이터 로드 실패, 기본값 사용", e);
      return getDefaults();
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    return getDefaults();
  }

  function exportJSON() {
    return JSON.stringify(load(), null, 2);
  }

  function importJSON(jsonString) {
    if (window.ContentSanitize) window.ContentSanitize.validateImportSize(jsonString);
    const parsed = JSON.parse(jsonString);
    if (!parsed.config || !parsed.posts) throw new Error("유효하지 않은 데이터 형식입니다.");
    if (!Array.isArray(parsed.posts) || parsed.posts.length > 500) throw new Error("글 데이터가 유효하지 않습니다.");
    save({
      config: parsed.config,
      categories: parsed.categories || getDefaults().categories,
      posts: parsed.posts,
      columns: parsed.columns || []
    });
    return load();
  }

  function applyTheme(config) {
    const root = document.documentElement;
    root.style.setProperty("--color-main", config.mainColor || "#0071E3");
    root.style.setProperty("--color-sub", config.subColor || "#FF9500");
  }

  window.DataStore = {
    STORAGE_KEY,
    getDefaults,
    load,
    save,
    reset,
    exportJSON,
    importJSON,
    applyTheme,
    getConfig: () => load().config,
    getCategories: () => load().categories.slice().sort((a, b) => a.order - b.order),
    getCategory: (slug) => load().categories.find((c) => c.slug === slug),
    getPosts: (opts = {}) => {
      let posts = load().posts.filter((p) => p.status !== "draft");
      if (opts.category) posts = posts.filter((p) => p.category === opts.category);
      if (opts.featured) posts = posts.filter((p) => p.featured);
      if (opts.slug) return posts.find((p) => p.slug === opts.slug);
      return posts;
    },
    getAllPosts: () => load().posts,
    getColumns: (opts = {}) => {
      let cols = load().columns.filter((c) => c.status !== "draft");
      if (opts.slug) return cols.find((c) => c.slug === opts.slug);
      return cols;
    },
    getAllColumns: () => load().columns,
    getLatestPosts: (limit = 6) => {
      return load()
        .posts.filter((p) => p.status !== "draft")
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, limit);
    },
    getFeaturedPosts: (limit = 4) => {
      const featured = load()
        .posts.filter((p) => p.status !== "draft" && p.featured)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      if (featured.length >= limit) return featured.slice(0, limit);
      const rest = load()
        .posts.filter((p) => p.status !== "draft" && !p.featured)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      return [...featured, ...rest].slice(0, limit);
    },
    getRelatedPosts: (slugs) => {
      const all = load().posts;
      return (slugs || []).map((s) => all.find((p) => p.slug === s)).filter(Boolean);
    },
    getPostsByCategory: (slug) => DataStore.getPosts({ category: slug }),
    getPostCount: () => load().posts.filter((p) => p.status !== "draft").length,
    getColumnCount: () => load().columns.filter((c) => c.status !== "draft").length
  };

  DataStore.applyTheme(DataStore.getConfig());
})();