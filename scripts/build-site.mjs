/**
 * 사이트 빌드: 콘텐츠 정리 → HTML 프리렌더 → sitemap/robots 생성
 * 사용: node scripts/build-site.mjs
 * 환경변수 SITE_URL 로 배포 URL 지정 (기본: site.config.js)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function loadJsExport(file, varName) {
  const code = fs.readFileSync(path.join(ROOT, file), "utf8");
  const expr = code.replace(`window.${varName} = `, "").replace(/;\s*$/, "");
  return Function(`return (${expr})`)();
}

const config = loadJsExport("data/site.config.js", "SITE_CONFIG");
const categories = loadJsExport("data/categories.js", "CATEGORIES_DATA");
let posts = loadJsExport("data/posts.js", "POSTS_DATA");
const columns = loadJsExport("data/columns.js", "COLUMNS_DATA");

const SITE_URL = (process.env.SITE_URL || config.siteUrl || "https://JYB0410.github.io/project").replace(/\/$/, "");

const BOILERPLATE_PATTERNS = [
  /<p>정지석이 상담할 때 자주 확인하는 질문은[\s\S]*?<\/p>/g,
  /<p>입양 준비는 하루 만에 끝나지 않습니다[\s\S]*?<\/p>/g,
  /<p>집에서 하는 5분 관리는[\s\S]*?<\/p>/g,
  /<p>서울·수도권 아파트는 환기[\s\S]*?<\/p>/g,
  /<p>사료 2~4만 원\/2kg[\s\S]*?<\/p>/g,
  /<p>산책 15분·실내 놀이 10분 뒤에는[\s\S]*?<\/p>/g,
  /<p>안전 점검은 한 번으로 끝나지 않습니다[\s\S]*?<\/p>/g,
  /<p>건강 관리는 '매일 완벽하게'[\s\S]*?<\/p>/g,
  /<p>조용히 같은 공간에 있는 10분도[\s\S]*?<\/p>/g,
  /<p>아파트·원룸에서는 출퇴근[\s\S]*?<\/p>/g,
  /<p>한국 아파트·원룸에서는 출퇴근[\s\S]*?<\/p>/g,
  /<p>글을 읽으며 '우리 집은 어디까지 하고 있지\?'[\s\S]*?<\/p>/g,
  /<p>사료·간식 변경은 7~10일에 걸쳐 천천히 하는 편이 소화 부담이 적습니다[\s\S]*?<\/p>/g
];

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

function buildArticleJsonLd(item, type = "Article") {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: item.title,
    description: item.excerpt,
    image: `${SITE_URL}/assets/images/og-default.svg`,
    author: {
      "@type": "Person",
      name: item.author || config.ownerName,
      url: `${SITE_URL}/author/`
    },
    datePublished: item.publishedAt,
    dateModified: item.updatedAt,
    publisher: { "@type": "Organization", name: config.name, url: SITE_URL }
  };
}

function buildFaqJsonLd(faq) {
  if (!faq?.length) return "";
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  });
}

function buildBreadcrumbJsonLd(items) {
  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url.replace(/^\.\./, "")}`
    }))
  });
}

function dedupeParagraphs(html) {
  let out = html;
  for (const re of BOILERPLATE_PATTERNS) out = out.replace(re, "");
  const seen = new Set();
  out = out.replace(/<p>([\s\S]*?)<\/p>/g, (full, inner) => {
    const key = inner.replace(/<[^>]+>/g, "").trim();
    if (key.length < 40) return full;
    if (seen.has(key)) return "";
    seen.add(key);
    return full;
  });
  return out.replace(/\n{3,}/g, "\n");
}

function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}

function renderBreadcrumbHtml(items) {
  return `<nav class="breadcrumb" aria-label="breadcrumb"><ol>${items
    .map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast) return `<li aria-current="page">${escapeHtml(item.name)}</li>`;
      return `<li><a href="${item.url}">${escapeHtml(item.name)}</a></li>`;
    })
    .join("")}</ol></nav>`;
}

function renderToc(sections) {
  if (!sections?.length) return "";
  return `<nav class="article-toc" aria-label="목차"><h2>목차</h2><ol>${sections
    .map((s) => `<li><a href="#${escapeHtml(s.id)}">${escapeHtml(s.title)}</a></li>`)
    .join("")}</ol></nav>`;
}

function renderSections(sections) {
  return (sections || [])
    .map(
      (s) =>
        `<section id="${escapeHtml(s.id)}" class="article-section"><${s.heading || "h2"}>${escapeHtml(s.title)}</${s.heading || "h2"}>${s.content}</section>`
    )
    .join("");
}

function renderPostArticle(post) {
  const cat = getCategory(post.category);
  const mistakes = post.commonMistakes?.length
    ? `<section class="mistakes-box"><h2>초보자가 자주 실수하는 포인트</h2><ul>${post.commonMistakes.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul></section>`
    : "";
  const checklist = post.checklist?.length
    ? `<section class="checklist-box"><h2>체크리스트</h2><ul class="check-list">${post.checklist.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul></section>`
    : "";
  const faq = post.faq?.length
    ? `<section class="faq-section"><h2>자주 묻는 질문</h2><dl>${post.faq.map((f) => `<dt>${escapeHtml(f.q)}</dt><dd>${escapeHtml(f.a)}</dd>`).join("")}</dl></section>`
    : "";
  const related = post.relatedSlugs?.length
    ? `<section class="related-posts"><h2>관련 글</h2><ul>${post.relatedSlugs
        .map((slug) => {
          const p = posts.find((x) => x.slug === slug);
          return p ? `<li><a href="../posts/${p.slug}.html">${escapeHtml(p.title)}</a></li>` : "";
        })
        .join("")}</ul></section>`
    : "";

  return `<article class="article-main">
  <header class="article-header">
    <p class="article-category"><a href="../categories/index.html?cat=${post.category}">${escapeHtml(cat?.name || "")}</a></p>
    <h1>${escapeHtml(post.title)}</h1>
    <p class="article-subtitle">${escapeHtml(post.subtitle)}</p>
    <div class="article-meta">
      <span>작성 <a href="../author/" class="owner-link">${escapeHtml(config.ownerName)}</a></span>
      <span>발행 <time datetime="${post.publishedAt}">${formatDate(post.publishedAt)}</time></span>
      <span>수정 <time datetime="${post.updatedAt}">${formatDate(post.updatedAt)}</time></span>
    </div>
  </header>
  ${renderToc(post.sections)}
  <div class="article-body">
    ${renderSections(post.sections)}
    <aside class="summary-box" aria-label="핵심 요약"><h2>핵심 요약</h2><p>${escapeHtml(post.summary)}</p></aside>
    ${mistakes}
    ${checklist}
    ${faq}
    ${related}
    <p class="article-note">이 글은 초보자 기준으로 이해하기 쉽게 정리되었으며, 내용은 운영 과정에서 순차적으로 보완될 수 있습니다. 수의사 등 전문가의 진단·처치를 대체하지 않습니다.</p>
  </div>
</article>`;
}

function renderColumnArticle(col) {
  const related = col.relatedSlugs?.length
    ? `<section class="related-posts"><h2>관련 글</h2><ul>${col.relatedSlugs
        .map((slug) => {
          const p = posts.find((x) => x.slug === slug);
          return p ? `<li><a href="../posts/${p.slug}.html">${escapeHtml(p.title)}</a></li>` : "";
        })
        .join("")}</ul></section>`
    : "";
  return `<article class="article-main column-article">
  <header class="article-header">
    <p class="card-badge">운영자 칼럼</p>
    <h1>${escapeHtml(col.title)}</h1>
    <p class="article-subtitle">${escapeHtml(col.subtitle)}</p>
    <div class="article-meta">
      <span><a href="../author/" class="owner-link">${escapeHtml(config.ownerName)}</a></span>
      <span>발행 <time datetime="${col.publishedAt}">${formatDate(col.publishedAt)}</time></span>
      <span>수정 <time datetime="${col.updatedAt}">${formatDate(col.updatedAt)}</time></span>
    </div>
  </header>
  <div class="perspective-box"><h2>관점</h2><p>${escapeHtml(col.perspective)}</p></div>
  <div class="article-body">
    ${renderSections(col.sections)}
    <aside class="summary-box" aria-label="핵심 요약"><h2>핵심 요약</h2><p>${escapeHtml(col.summary)}</p></aside>
    ${related}
    <p class="article-note">이 칼럼은 운영자의 관찰과 정리를 바탕으로 작성되었으며, 일반 정보 제공 목적입니다.</p>
  </div>
</article>`;
}

// 1) Clean posts
let cleaned = 0;
posts = posts.map((post) => {
  post.sections = post.sections.map((sec) => {
    if (sec.id === "practice-notes") return sec;
    const before = sec.content;
    sec.content = dedupeParagraphs(sec.content);
    if (sec.content !== before) cleaned++;
    return sec;
  });
  return post;
});
fs.writeFileSync(path.join(ROOT, "data/posts.js"), `window.POSTS_DATA = ${JSON.stringify(posts, null, 2)};\n`);
console.log(`✓ posts.js 정리 (${cleaned}개 섹션 보일러플레이트 제거)`);

// 2) Update site.config siteUrl
const cfgPath = path.join(ROOT, "data/site.config.js");
let cfgText = fs.readFileSync(cfgPath, "utf8");
cfgText = cfgText.replace(/siteUrl:\s*"[^"]*"/, `siteUrl: "${SITE_URL}"`);
fs.writeFileSync(cfgPath, cfgText);
console.log(`✓ siteUrl → ${SITE_URL}`);

// 3) Prerender posts
const postTemplate = fs.readFileSync(path.join(ROOT, "posts", "first-week-checklist.html"), "utf8");
for (const post of posts) {
  const cat = getCategory(post.category);
  const canonical = `${SITE_URL}/posts/${post.slug}.html`;
  const title = `${post.title} | ${config.name}`;
  const description = post.excerpt;
  const articleHtml = renderPostArticle(post);
  const postJsonLd = [
    jsonLdScript(buildArticleJsonLd(post)),
    buildBreadcrumbJsonLd([
      { name: "홈", url: "/" },
      { name: "카테고리", url: "/categories/" },
      { name: cat?.name || "", url: `/categories/?cat=${post.category}` },
      { name: post.title, url: `/posts/${post.slug}.html` }
    ]),
    buildFaqJsonLd(post.faq)
  ]
    .filter(Boolean)
    .join("\n  ");
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_URL}/assets/images/og-default.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/main.css">
  <title>${escapeHtml(title)}</title>
  <script src="../assets/js/consent-mode.js"></script>
  ${postJsonLd}
</head>
<body data-prerendered="post" data-slug="${post.slug}">
  <div id="site-header"></div>
  <main class="container page-main">
    <nav class="breadcrumb" aria-label="breadcrumb"><ol>
      <li><a href="../index.html">홈</a></li>
      <li><a href="../categories/index.html">카테고리</a></li>
      <li><a href="../categories/index.html?cat=${post.category}">${escapeHtml(cat?.name || "")}</a></li>
      <li aria-current="page">${escapeHtml(post.title)}</li>
    </ol></nav>
    <div id="article-root" class="article-layout" data-prerendered="true">${articleHtml}</div>
    <div id="editor-box-wrap"></div>
  </main>
  <div id="site-footer"></div>
  <script src="../data/site.config.js"></script>
  <script src="../data/categories.js"></script>
  <script src="../data/posts.js"></script>
  <script src="../data/columns.js"></script>
  <script src="../assets/js/data-store.js"></script>
  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/seo.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/sanitize.js"></script>
  <script src="../assets/js/render.js"></script>
  <script src="../assets/js/post-page.js"></script>
  <script src="../assets/js/consent.js" defer></script>
  <script src="../assets/js/adsense.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "posts", `${post.slug}.html`), html);
}
console.log(`✓ ${posts.length}개 글 HTML 프리렌더`);

// 4) Prerender columns
for (const col of columns) {
  const canonical = `${SITE_URL}/columns/${col.slug}.html`;
  const title = `${col.title} | ${config.name}`;
  const columnBreadcrumb = renderBreadcrumbHtml([
    { name: "홈", url: "../index.html" },
    { name: "칼럼", url: "../columns/index.html" },
    { name: col.title, url: "#" }
  ]);
  const columnJsonLd = [
    jsonLdScript(buildArticleJsonLd(col, "Article")),
    buildBreadcrumbJsonLd([
      { name: "홈", url: "/" },
      { name: "칼럼", url: "/columns/" },
      { name: col.title, url: `/columns/${col.slug}.html` }
    ])
  ].join("\n  ");
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(col.excerpt)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(col.excerpt)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_URL}/assets/images/og-default.svg">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../assets/icons/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/main.css">
  <title>${escapeHtml(title)}</title>
  <script src="../assets/js/consent-mode.js"></script>
  ${columnJsonLd}
</head>
<body data-prerendered="column" data-slug="${col.slug}">
  <div id="site-header"></div>
  <main class="container page-main">
    ${columnBreadcrumb}
    <div id="article-root" class="article-layout" data-prerendered="true">${renderColumnArticle(col)}</div>
    <div id="editor-box-wrap"></div>
  </main>
  <div id="site-footer"></div>
  <script src="../data/site.config.js"></script>
  <script src="../data/categories.js"></script>
  <script src="../data/posts.js"></script>
  <script src="../data/columns.js"></script>
  <script src="../assets/js/data-store.js"></script>
  <script src="../assets/js/utils.js"></script>
  <script src="../assets/js/seo.js"></script>
  <script src="../assets/js/layout.js"></script>
  <script src="../assets/js/sanitize.js"></script>
  <script src="../assets/js/render.js"></script>
  <script src="../assets/js/column-page.js"></script>
  <script src="../assets/js/consent.js" defer></script>
  <script src="../assets/js/adsense.js" defer></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, "columns", `${col.slug}.html`), html);
}
console.log(`✓ ${columns.length}개 칼럼 HTML 프리렌더`);

// 5) Sitemap + robots
const today = new Date().toISOString().slice(0, 10);
const staticPages = [
  { loc: "/", priority: "1.0", changefreq: "weekly", lastmod: today },
  { loc: "/about/", priority: "0.8", changefreq: "monthly", lastmod: today },
  { loc: "/author/", priority: "0.8", changefreq: "weekly", lastmod: today },
  { loc: "/contact/", priority: "0.7", changefreq: "monthly", lastmod: today },
  { loc: "/categories/", priority: "0.9", changefreq: "weekly", lastmod: today },
  { loc: "/columns/", priority: "0.8", changefreq: "weekly", lastmod: today },
  { loc: "/privacy/", priority: "0.4", changefreq: "yearly", lastmod: config.privacyLastUpdated || today },
  { loc: "/terms/", priority: "0.4", changefreq: "yearly", lastmod: config.termsLastUpdated || config.privacyLastUpdated || today },
  { loc: "/disclaimer/", priority: "0.4", changefreq: "yearly", lastmod: config.disclaimerLastUpdated || config.privacyLastUpdated || today },
  { loc: "/sitemap/", priority: "0.5", changefreq: "monthly", lastmod: today }
];

const urls = [...staticPages];
for (const c of categories) {
  urls.push({ loc: `/categories/?cat=${c.slug}`, priority: "0.8", changefreq: "weekly", lastmod: today });
}
for (const p of posts) {
  urls.push({ loc: `/posts/${p.slug}.html`, priority: "0.7", changefreq: "monthly", lastmod: p.updatedAt || today });
}
for (const c of columns) {
  urls.push({ loc: `/columns/${c.slug}.html`, priority: "0.7", changefreq: "monthly", lastmod: c.updatedAt || today });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url><loc>${SITE_URL}${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n\nDisallow: /admin/\n`);
console.log(`✓ sitemap.xml (${urls.length} URLs) + robots.txt`);

console.log("\n빌드 완료. 배포 URL이 다르면: SITE_URL=https://your-domain.com node scripts/build-site.mjs");