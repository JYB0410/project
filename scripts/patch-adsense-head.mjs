/**
 * AdSense head 정리: consent-mode 삽입, pagead 스크립트는 adsenseEnabled일 때만·허용 페이지만
 * 사용: node scripts/patch-adsense-head.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGEAD_RE =
  /\s*<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"]*" crossorigin="anonymous"><\/script>\s*/g;

/** 광고·검증 스크립트를 넣지 않는 페이지 */
const ADSENSE_EXCLUDE = new Set([
  "admin",
  "404.html",
  "sitemap",
  "privacy",
  "terms",
  "disclaimer",
  "contact"
]);

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, "data/site.config.js"), "utf8");
  const expr = code.replace("window.SITE_CONFIG = ", "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (name.endsWith(".html")) files.push(p);
  }
  return files;
}

function relScript(from, target) {
  const fromDir = path.dirname(from);
  return path.relative(fromDir, path.join(ROOT, target)).replace(/\\/g, "/");
}

function isExcluded(file) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (rel === "404.html") return true;
  const top = rel.split("/")[0];
  return ADSENSE_EXCLUDE.has(top);
}

const config = loadConfig();
const pubId = config.adsensePublisherId || "";
const enabled = Boolean(config.adsenseEnabled && pubId);

let consentPatched = 0;
let stripped = 0;
let adsenseKept = 0;

for (const file of walk(ROOT)) {
  if (file.includes(`${path.sep}admin${path.sep}`)) continue;

  let html = fs.readFileSync(file, "utf8");
  const before = html;

  if (PAGEAD_RE.test(html)) {
    html = html.replace(PAGEAD_RE, "\n");
    stripped++;
  }

  const consentModeSrc = relScript(file, "assets/js/consent-mode.js");
  const adsenseSrc = relScript(file, "assets/js/adsense.js");

  if (!html.includes("consent-mode.js")) {
    html = html.replace("</head>", `  <script src="${consentModeSrc}"></script>\n</head>`);
    consentPatched++;
  }

  // head 직접 삽입 금지 — 동의 후 adsense.js가 로드 (Consent Mode v2)
  if (enabled && !isExcluded(file)) {
    // intentionally empty: no head pagead injection
    adsenseKept++;
  }

  if (!html.includes("adsense.js") && html.includes("consent.js")) {
    html = html.replace(
      /(<script[^>]+consent\.js[^>]*><\/script>)/,
      `$1\n  <script src="${adsenseSrc}" defer></script>`
    );
  } else if (!html.includes("adsense.js") && html.includes("</body>")) {
    html = html.replace("</body>", `  <script src="${adsenseSrc}" defer></script>\n</body>`);
  }

  if (html !== before) fs.writeFileSync(file, html);
}

console.log(`✓ pagead head 스크립트 제거: ${stripped}개 파일`);
console.log(`✓ consent-mode 추가: ${consentPatched}개`);
console.log(
  enabled
    ? `✓ adsenseEnabled=true — 광고는 adsense.js(동의 후)로만 로드, 허용 페이지 ${adsenseKept}개`
    : "✓ adsenseEnabled=false — head 광고 스크립트 없음 (재심사 전 권장 상태)"
);