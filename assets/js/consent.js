(function () {
  const STORAGE_KEY = "pethamkke_cookie_consent";
  const bannerId = "cookie-consent-banner";

  function getConfig() {
    return window.SITE_CONFIG || window.DataStore?.getConfig?.() || {};
  }

  function applyConsent(choice) {
    if (typeof window.gtag === "function") {
      if (choice === "accepted") {
        window.gtag("consent", "update", {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted"
        });
      } else {
        window.gtag("consent", "update", {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied"
        });
      }
    }
    document.dispatchEvent(new CustomEvent("pethamkke:consent-updated", { detail: { choice } }));
  }

  function saveChoice(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (_) {}
    applyConsent(choice);
  }

  function createBanner() {
    if (document.getElementById(bannerId)) return;

    const config = getConfig();
    const privacyPath = (window.SiteUtils?.resolvePath || ((p) => p))("privacy/");

    const banner = document.createElement("div");
    banner.id = bannerId;
    banner.className = "cookie-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "쿠키 및 광고 안내");
    banner.innerHTML = `
      <div class="cookie-consent-inner">
        <p class="cookie-consent-text">
          ${config.name || "이 사이트"}는 서비스 운영과 광고(예: Google AdSense) 제공을 위해 쿠키를 사용할 수 있습니다.
          EU/EEA·영국 이용자는 동의·거부를 선택할 수 있습니다.
          자세한 내용은 <a href="${privacyPath}">개인정보처리방침</a>을 참고해 주세요.
        </p>
        <div class="cookie-consent-actions">
          <button type="button" class="btn btn-secondary cookie-consent-reject">거부</button>
          <button type="button" class="btn btn-primary cookie-consent-accept">동의</button>
        </div>
      </div>`;

    document.body.appendChild(banner);

    banner.querySelector(".cookie-consent-accept").addEventListener("click", () => {
      saveChoice("accepted");
      banner.remove();
    });

    banner.querySelector(".cookie-consent-reject").addEventListener("click", () => {
      saveChoice("rejected");
      banner.remove();
    });
  }

  function init() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        applyConsent(saved);
        return;
      }
    } catch (_) {}
    createBanner();
  }

  window.PetHamkkeConsent = {
    reopen: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
      createBanner();
    },
    getChoice: () => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (_) {
        return null;
      }
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();