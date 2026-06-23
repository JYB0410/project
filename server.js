const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = process.env.PORT || 5000;
const ROOT = __dirname;
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;
const COOKIE_NAME = "pethamkke_session";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp"
};

const sessions = new Map();
const loginAttempts = new Map();

let adminSecrets = null;

function loadSecrets() {
  const secretsPath = path.join(ROOT, "admin.secrets.json");
  if (fs.existsSync(secretsPath)) {
    adminSecrets = JSON.parse(fs.readFileSync(secretsPath, "utf8"));
    return;
  }
  const envPassword = process.env.ADMIN_PASSWORD;
  if (envPassword && envPassword.length >= 8) {
    const salt = crypto.randomBytes(16).toString("hex");
    adminSecrets = {
      passwordHash: hashPassword(envPassword, salt),
      salt,
      sessionSecret: crypto.randomBytes(32).toString("hex"),
      createdAt: new Date().toISOString()
    };
    console.warn("[보안] admin.secrets.json 없음 — ADMIN_PASSWORD 환경변수로 임시 운영 중");
    console.warn("       영구 설정: node scripts/setup-admin.js");
    return;
  }
  adminSecrets = null;
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
}

function verifyPassword(password) {
  if (!adminSecrets) return false;
  const hash = hashPassword(password, adminSecrets.salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(adminSecrets.passwordHash, "hex"));
  } catch {
    return false;
  }
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function isLockedOut(ip) {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (record.lockedUntil && Date.now() < record.lockedUntil) return true;
  if (record.lockedUntil && Date.now() >= record.lockedUntil) {
    loginAttempts.delete(ip);
  }
  return false;
}

function recordFailedLogin(ip) {
  const record = loginAttempts.get(ip) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_MS;
    record.count = 0;
  }
  loginAttempts.set(ip, record);
}

function clearLoginAttempts(ip) {
  loginAttempts.delete(ip);
}

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { expiresAt });
  return { token, expiresAt };
}

function getSessionToken(req) {
  const cookie = req.headers.cookie || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

function isValidSession(req) {
  const token = getSessionToken(req);
  if (!token) return false;
  const session = sessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function destroySession(req) {
  const token = getSessionToken(req);
  if (token) sessions.delete(token);
}

function securityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
}

function sendJson(res, status, data, extraHeaders = {}) {
  securityHeaders(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...extraHeaders });
  res.end(JSON.stringify(data));
}

function send(res, status, body, type, extraHeaders = {}) {
  securityHeaders(res);
  res.writeHead(status, { "Content-Type": type || "text/plain; charset=utf-8", ...extraHeaders });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e5) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function resolveFile(urlPath) {
  let safe = decodeURIComponent(urlPath.split("?")[0]);
  if (safe.endsWith("/")) safe += "index.html";
  if (safe === "" || safe === "/") safe = "/index.html";
  const filePath = path.normalize(path.join(ROOT, safe));
  if (!filePath.startsWith(ROOT)) return null;
  return filePath;
}

function isAdminPath(urlPath) {
  return urlPath.startsWith("/admin");
}

function serveFile(filePath, res, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 500, "Server Error");
    send(res, statusCode, data, MIME[ext] || "application/octet-stream");
  });
}

async function handleApi(req, res, url) {
  const ip = getClientIp(req);

  if (req.method === "POST" && url.pathname === "/admin/api/login") {
    if (!adminSecrets) {
      return sendJson(res, 503, {
        error: "관리자 인증이 설정되지 않았습니다. node scripts/setup-admin.js 를 실행하세요."
      });
    }
    if (isLockedOut(ip)) {
      return sendJson(res, 429, { error: "로그인 시도 횟수 초과. 15분 후 다시 시도하세요." });
    }
    try {
      const body = await parseBody(req);
      const password = String(body.password || "");
      if (!password || !verifyPassword(password)) {
        recordFailedLogin(ip);
        return sendJson(res, 401, { error: "비밀번호가 올바르지 않습니다." });
      }
      clearLoginAttempts(ip);
      const { token, expiresAt } = createSession();
      const maxAge = Math.floor((expiresAt - Date.now()) / 1000);
      sendJson(res, 200, { ok: true, expiresAt }, {
        "Set-Cookie": `${COOKIE_NAME}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${maxAge}`
      });
    } catch {
      return sendJson(res, 400, { error: "잘못된 요청입니다." });
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/admin/api/logout") {
    destroySession(req);
    return sendJson(res, 200, { ok: true }, {
      "Set-Cookie": `${COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`
    });
  }

  if (req.method === "GET" && url.pathname === "/admin/api/session") {
    const authed = isValidSession(req);
    return sendJson(res, 200, {
      authenticated: authed,
      configured: !!adminSecrets
    });
  }

  sendJson(res, 404, { error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname.startsWith("/admin/api/")) {
    return handleApi(req, res, url);
  }

  if (isAdminPath(url.pathname) && !url.pathname.endsWith(".css") && !url.pathname.endsWith(".svg")) {
    if (!isValidSession(req) && url.pathname !== "/admin/" && url.pathname !== "/admin/index.html") {
      return send(res, 302, "", "text/plain", { Location: "/admin/" });
    }
  }

  const filePath = resolveFile(url.pathname);
  if (!filePath) return send(res, 403, "Forbidden");

  fs.stat(filePath, (err, stat) => {
    if (err) {
      const notFound = path.join(ROOT, "404.html");
      return fs.readFile(notFound, (e2, data) => {
        if (e2) return send(res, 404, "404 Not Found");
        send(res, 404, data, MIME[".html"]);
      });
    }

    if (stat.isDirectory()) {
      const index = path.join(filePath, "index.html");
      return fs.readFile(index, (e2, data) => {
        if (e2) return send(res, 403, "Directory listing disabled");
        send(res, 200, data, MIME[".html"]);
      });
    }

    serveFile(filePath, res);
  });
});

loadSecrets();

function tryListen(port, maxPort) {
  server.once("error", (err) => {
    if (err.code === "EADDRINUSE" && port < maxPort) {
      console.warn(`포트 ${port} 사용 중 → ${port + 1} 시도`);
      tryListen(port + 1, maxPort);
      return;
    }
    console.error(`포트 ${PORT}~${port} 사용 불가:`, err.message);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`펫함께 가이드 서버: http://localhost:${port}`);
    if (!adminSecrets) {
      console.warn("[보안] 관리자 미설정 — node scripts/setup-admin.js 실행 필요");
    } else {
      console.log("[보안] 관리자 인증 활성화 (/admin)");
    }
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) sessions.delete(token);
  }
}, 600000);

tryListen(Number(PORT), Number(PORT) + 5);