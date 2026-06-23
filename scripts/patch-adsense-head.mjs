/**
 * 모든 HTML에 consent-mode.js(head) + adsense.js(body) 삽입
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

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
  let rel = path.relative(fromDir, path.join(ROOT, target)).replace(/\\/g, "/");
  return rel;
}

let patched = 0;

for (const file of walk(ROOT)) {
  if (file.includes(`${path.sep}admin${path.sep}`)) continue;
  let html = fs.readFileSync(file, "utf8");
  const consentModeSrc = relScript(file, "assets/js/consent-mode.js");
  const adsenseSrc = relScript(file, "assets/js/adsense.js");

  if (!html.includes("consent-mode.js")) {
    html = html.replace("</head>", `  <script src="${consentModeSrc}"></script>\n</head>`);
    patched++;
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

console.log(`✓ HTML head/body AdSense 스크립트 패치 (${patched}개 파일에 consent-mode 추가)`);