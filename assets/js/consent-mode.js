/* Google Consent Mode v2 — 광고 스크립트 로드 전 기본값 설정 */
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
window.gtag = gtag;

gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
  wait_for_update: 500
});

try {
  const choice = localStorage.getItem("pethamkke_cookie_consent");
  if (choice === "accepted") {
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted"
    });
  }
} catch (_) {}