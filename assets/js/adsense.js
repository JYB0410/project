(function () {
  const CONSENT_KEY = "pethamkke_cookie_consent";

  function getConfig() {
    return window.SITE_CONFIG || window.DataStore?.getConfig?.() || {};
  }

  function hasConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch (_) {
      return false;
    }
  }

  function loadAdSense() {
    const config = getConfig();
    if (!config.adsenseEnabled || !config.adsensePublisherId) return;
    if (!hasConsent()) return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) return;

    const s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsensePublisherId)}`;
    s.setAttribute("data-ad-client", config.adsensePublisherId);
    document.head.appendChild(s);
  }

  window.PetHamkkeAds = { loadAdSense, hasConsent };

  document.addEventListener("pethamkke:consent-updated", loadAdSense);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadAdSense);
  } else {
    loadAdSense();
  }
})();