/**
 * 모든 HTML에 consent-mode.js(head), AdSense 소유권 확인(head), adsense.js(body) 삽입
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadConfig() {
  const code = fs.readFileSync(path.join(ROOT, "data/site.config.js"), "utf8");
  const expr = code.replace("window.SITE_CONFIG = ", "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

const config = loadConfig();
const pubId = config.adsensePublisherId || "";
const adsenseVerify =
  pubId &&
  `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}" crossorigin="anonymous"></script>`;

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

let consentPatched = 0;
let adsensePatched = 0;

for (const file of walk(ROOT)) {
  if (file.includes(`${path.sep}admin${path.sep}`)) continue;
  let html = fs.readFileSync(file, "utf8");
  const consentModeSrc = relScript(file, "assets/js/consent-mode.js");
  const adsenseSrc = relScript(file, "assets/js/adsense.js");

  if (!html.includes("consent-mode.js")) {
    html = html.replace("</head>", `  <script src="${consentModeSrc}"></script>\n</head>`);
    consentPatched++;
  }

  if (adsenseVerify && !html.includes("pagead2.googlesyndication.com")) {
    html = html.replace("</head>", `  ${adsenseVerify}\n</head>`);
    adsensePatched++;
  }

  if (!html.includes("adsense.js") && html.includes("consent.js")) {
    html = html.replace(
      /(<script[^>]+consent\.js[^>]*><\/script>)/,
      `$1\n  <script src="${adsenseSrc}" defer></script>`
    );
  } else if (!html.includes("adsense.js") && html.includes("</body>")) {
    html = html.replace("</body>", `  <script src="${adsenseSrc}" defer></script>\n</body>`);
  }

  fs.writeFileSync(file, html);
}

console.log(`✓ consent-mode: ${consentPatched}개 추가`);
console.log(`✓ AdSense 소유권 확인 스크립트: ${adsensePatched}개 head 삽입`);