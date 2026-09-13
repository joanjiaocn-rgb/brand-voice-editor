const CONSENT_KEY = "voicedraft.analytics-consent.v1";
const measurementId = document.querySelector('meta[name="voicedraft-analytics-id"]')?.content?.trim() || "";
let analyticsReady = false;

window.addEventListener("voicedraft:analytics", (event) => {
  const detail = event.detail || {};
  if (typeof detail.event !== "string") return;
  sendEvent(detail.event, detail.properties || {});
});

initialize();

function initialize() {
  if (["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
  const consent = readConsent();
  if (consent === "granted") {
    enableAnalytics();
  } else if (!consent) {
    showConsentBanner();
  }
}

function enableAnalytics() {
  if (!measurementId || analyticsReady) return;
  analyticsReady = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  if (!document.querySelector("script[data-voicedraft-ga4]")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.voicedraftGa4 = "true";
    document.head.append(script);
  }

  sendEvent("page_view", {
    page_title: document.title.slice(0, 120),
    page_path: window.location.pathname
  });
}

function sendEvent(eventName, properties) {
  if (!analyticsReady || typeof window.gtag !== "function") return;
  const safeProperties = {};
  for (const [key, value] of Object.entries(properties || {})) {
    if (!/^[a-zA-Z0-9_]{1,40}$/.test(key)) continue;
    if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) {
      safeProperties[key] = value;
    } else if (typeof value === "string" && value.length <= 120) {
      safeProperties[key] = value;
    }
  }
  const safeEventName = eventName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 40);
  window.gtag("event", safeEventName, safeProperties);
}

function showConsentBanner() {
  if (!measurementId || document.querySelector("[data-analytics-consent]")) return;
  const banner = document.createElement("aside");
  banner.className = "analytics-consent";
  banner.dataset.analyticsConsent = "true";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Analytics preference");
  banner.innerHTML = `
    <div class="analytics-consent-copy">
      <strong>Help us improve VoiceDraft</strong>
      <p>Optional Google Analytics measures page visits and product actions. We never send your drafts, rewrites, samples, or freeform context. <a href="/privacy/">Read the privacy details</a>.</p>
    </div>
    <div class="analytics-consent-actions">
      <button class="button button-secondary" type="button" data-analytics-decline>Decline</button>
      <button class="button button-primary" type="button" data-analytics-accept>Allow analytics</button>
    </div>`;
  document.body.append(banner);
  banner.querySelector("[data-analytics-accept]")?.addEventListener("click", () => {
    saveConsent("granted");
    banner.remove();
    enableAnalytics();
  });
  banner.querySelector("[data-analytics-decline]")?.addEventListener("click", () => {
    saveConsent("declined");
    banner.remove();
  });
}

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function saveConsent(value) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Analytics remains disabled when browser storage is unavailable.
  }
}
