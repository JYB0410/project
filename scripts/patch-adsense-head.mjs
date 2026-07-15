/**
 * AdSense head: consent-mode + 소유권 확인 pagead(adsenseSiteVerification) 또는 승인 후(adsenseEnabled)
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

function pageadHeadTag(pubId) {
  return `  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}"
     crossorigin="anonymous"></script>\n`;
}

const config = loadConfig();
const pubId = config.adsensePublisherId || "";
const needsHeadPagead = Boolean(pubId && (config.adsenseSiteVerification || config.adsenseEnabled));

let consentPatched = 0;
let pageadInjected = 0;
let pageadStripped = 0;

for (const file of walk(ROOT)) {
  if (file.includes(`${path.sep}admin${path.sep}`)) continue;

  let html = fs.readFileSync(file, "utf8");
  const before = html;

  if (PAGEAD_RE.test(html)) {
    html = html.replace(PAGEAD_RE, "\n");
    pageadStripped++;
  }

  const consentModeSrc = relScript(file, "assets/js/consent-mode.js");
  const adsenseSrc = relScript(file, "assets/js/adsense.js");

  if (!html.includes("consent-mode.js")) {
    html = html.replace("</head>", `  <script src="${consentModeSrc}"></script>\n</head>`);
    consentPatched++;
  }

  if (needsHeadPagead && !isExcluded(file) && !html.includes("pagead2.googlesyndication.com")) {
    const tag = pageadHeadTag(pubId);
    if (html.includes("consent-mode.js")) {
      html = html.replace(
        /(<script src="[^"]*consent-mode\.js"><\/script>)/,
        `$1\n${tag.trimEnd()}`
      );
    } else {
      html = html.replace("</head>", `${tag}</head>`);
    }
    pageadInjected++;
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

console.log(`✓ pagead head 정리: ${pageadStripped}개 파일에서 기존 태그 제거`);
console.log(`✓ consent-mode 추가: ${consentPatched}개`);
if (needsHeadPagead) {
  console.log(`✓ 소유권 확인 pagead head 삽입: ${pageadInjected}개 (pub ${pubId})`);
} else {
  console.log("✓ head pagead 없음 (adsenseSiteVerification·adsenseEnabled 모두 false)");
}