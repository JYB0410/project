/**
 * 커스텀 도메인 연결: siteUrl, CNAME, sitemap/canonical 일괄 갱신
 * 사용: node scripts/set-custom-domain.mjs www.example.com
 *       node scripts/set-custom-domain.mjs example.com
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const hostname = (process.argv[2] || "").trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

if (!hostname || !hostname.includes(".")) {
  console.error("사용법: node scripts/set-custom-domain.mjs <도메인>");
  console.error("예: node scripts/set-custom-domain.mjs www.mysite.com");
  process.exit(1);
}

const siteUrl = `https://${hostname}`;
const configPath = path.join(ROOT, "data/site.config.js");
let configText = fs.readFileSync(configPath, "utf8");

if (/siteUrl:\s*"/.test(configText)) {
  configText = configText.replace(/siteUrl:\s*"[^"]*"/, `siteUrl: "${siteUrl}"`);
} else {
  configText = configText.replace(/contactEmail:/, `siteUrl: "${siteUrl}",\n  contactEmail:`);
}

if (/customDomain:\s*"/.test(configText)) {
  configText = configText.replace(/customDomain:\s*"[^"]*"/, `customDomain: "${hostname}"`);
} else {
  configText = configText.replace(/siteUrl:/, `customDomain: "${hostname}",\n  siteUrl:`);
}

fs.writeFileSync(configPath, configText);
fs.writeFileSync(path.join(ROOT, "CNAME"), `${hostname}\n`);

const OLD_URL_PATTERNS = [
  /https:\/\/hopet\.github\.io\/pet-hamkke-guide/g,
  /https:\/\/JYB0410\.github\.io\/project/g
];

function patchStaticHtml() {
  const staticFiles = [
    "index.html",
    "about/index.html",
    "author/index.html",
    "contact/index.html",
    "privacy/index.html",
    "terms/index.html",
    "disclaimer/index.html",
    "categories/index.html",
    "columns/index.html",
    "sitemap/index.html"
  ];
  let count = 0;
  for (const rel of staticFiles) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    let html = fs.readFileSync(p, "utf8");
    const before = html;
    for (const re of OLD_URL_PATTERNS) html = html.replace(re, siteUrl);
    if (rel === "index.html") {
      html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${siteUrl}/">`
      );
      html = html.replace(
        /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"펫함께 가이드","description":"반려동물과 함께하는 일상을 차분하게 정리하는 정보 사이트","url":"${siteUrl}/","publisher":{"@type":"Organization","name":"펫함께 가이드","url":"${siteUrl}/"}}</script>`
      );
    }
    if (html !== before) {
      fs.writeFileSync(p, html);
      count++;
    }
  }
  return count;
}

patchStaticHtml();

const build = spawnSync("node", ["scripts/build-site.mjs"], {
  cwd: ROOT,
  encoding: "utf8",
  env: { ...process.env, SITE_URL: siteUrl }
});
if (build.stdout) process.stdout.write(build.stdout);
if (build.stderr) process.stderr.write(build.stderr);

const isWww = hostname.startsWith("www.");
console.log(`\n✓ 커스텀 도메인 설정 완료: ${siteUrl}`);
console.log(`✓ CNAME 파일 생성: ${hostname}`);
console.log("\n── DNS 설정 (도메인 업체 관리 페이지) ──");
if (isWww) {
  console.log(`  유형: CNAME`);
  console.log(`  호스트: www`);
  console.log(`  값: JYB0410.github.io`);
} else {
  console.log(`  유형: A (4개 모두 추가)`);
  console.log(`  값: 185.199.108.153 / 109.153 / 110.153 / 111.153`);
  console.log(`  (또는 업체가 지원하면 ALIAS/ANAME → JYB0410.github.io)`);
}
console.log("\n── GitHub 설정 ──");
console.log("  https://github.com/JYB0410/project/settings/pages");
console.log(`  Custom domain에 "${hostname}" 입력`);
console.log("  Enforce HTTPS 체크 (DNS 전파 후 활성화)");
console.log("\n── 배포 ──");
console.log("  git add CNAME data/site.config.js sitemap.xml robots.txt");
console.log("  git commit -m \"커스텀 도메인 연결\"");
console.log("  git push");
console.log("\nDNS 반영 후 https://" + hostname + " 로 접속해 확인하세요.");

process.exit(build.status ?? 0);