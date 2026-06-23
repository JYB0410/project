(function () {
  function setMeta(name, content, attr = "name") {
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  }

  function setPageMeta({ title, description, canonical, ogType = "website", ogImage, ogUrl }) {
    document.title = title;
    setMeta("description", description);
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    if (ogUrl || canonical) setMeta("og:url", ogUrl || canonical, "property");
    const config = window.SITE_CONFIG || window.DataStore?.getConfig?.();
    const image = ogImage || (config?.siteUrl ? `${config.siteUrl}/assets/images/og-default.svg` : "");
    if (image) {
      setMeta("og:image", image, "property");
      setMeta("twitter:image", image);
    }
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
  }

  function personJsonLd(config) {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Person",
      name: config.ownerName,
      jobTitle: config.ownerTitle || "편집·운영",
      description: config.ownerBio,
      email: config.contactEmail,
      url: `${config.siteUrl}/author/`,
      worksFor: { "@type": "Organization", name: config.name, url: config.siteUrl }
    });
  }

  function websiteJsonLd(config) {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: config.name,
      description: config.tagline,
      url: config.siteUrl,
      publisher: { "@type": "Organization", name: config.name, url: config.siteUrl }
    });
  }

  function injectJsonLd(data) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  function breadcrumbJsonLd(items) {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url
      }))
    });
  }

  function articleJsonLd(post, config) {
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: `${config.siteUrl}/assets/images/og-default.svg`,
      author: {
        "@type": "Person",
        name: post.author || config.ownerName,
        url: `${config.siteUrl}/author/`
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      publisher: { "@type": "Organization", name: config.name, url: config.siteUrl }
    });
  }

  function faqJsonLd(faq) {
    if (!faq || !faq.length) return;
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    });
  }

  window.SiteSEO = {
    setPageMeta,
    breadcrumbJsonLd,
    articleJsonLd,
    faqJsonLd,
    personJsonLd,
    websiteJsonLd,
    injectJsonLd
  };
})();