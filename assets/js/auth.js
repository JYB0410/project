(function () {
  const API = {
    session: "/admin/api/session",
    login: "/admin/api/login",
    logout: "/admin/api/logout"
  };

  let cachedAuth = null;
  let cacheTime = 0;
  const CACHE_MS = 30000;

  async function checkSession(force = false) {
    const now = Date.now();
    if (!force && cachedAuth !== null && now - cacheTime < CACHE_MS) {
      return cachedAuth;
    }
    try {
      const res = await fetch(API.session, { credentials: "same-origin", cache: "no-store" });
      if (!res.ok) {
        cachedAuth = { authenticated: false, configured: false, serverMode: false };
        cacheTime = now;
        return cachedAuth;
      }
      const data = await res.json();
      cachedAuth = { ...data, serverMode: true };
      cacheTime = now;
      return cachedAuth;
    } catch {
      cachedAuth = { authenticated: false, configured: false, serverMode: false };
      cacheTime = now;
      return cachedAuth;
    }
  }

  async function isLoggedIn() {
    const status = await checkSession();
    return !!status.authenticated;
  }

  async function login(password) {
    try {
      const res = await fetch(API.login, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return { ok: false, error: data.error || "로그인에 실패했습니다." };
      }
      cachedAuth = { authenticated: true, configured: true, serverMode: true };
      cacheTime = Date.now();
      return { ok: true };
    } catch {
      return { ok: false, error: "서버에 연결할 수 없습니다. node server.js 로 실행 중인지 확인하세요." };
    }
  }

  async function logout() {
    try {
      await fetch(API.logout, { method: "POST", credentials: "same-origin" });
    } catch {
      /* ignore */
    }
    cachedAuth = { authenticated: false, configured: true, serverMode: true };
    cacheTime = Date.now();
  }

  window.AdminAuth = {
    checkSession,
    isLoggedIn,
    login,
    logout
  };
})();