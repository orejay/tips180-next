import type { LanguageCode } from "@/config/nav";

/** Cookie Google's Website Translator widget itself reads/writes (`/<from>/<to>`). */
const GOOGTRANS_COOKIE = "googtrans";
/** Mirrors the active code so the header can render the right flag without FOUC. */
export const TIPS_LANG_COOKIE = "tips180_lang";

function apexDomain(host: string): string | null {
  if (host === "localhost" || /^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return null;
  const parts = host.split(".");
  return parts.length > 2 ? parts.slice(-2).join(".") : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000`;
  const apex = apexDomain(window.location.hostname);
  if (apex) document.cookie = `${name}=${value}; path=/; domain=.${apex}; max-age=31536000`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
  const apex = apexDomain(window.location.hostname);
  if (apex) document.cookie = `${name}=; path=/; domain=.${apex}; max-age=0`;
}

export function readStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(TIPS_LANG_COOKIE) as LanguageCode) || "en";
}

/**
 * Switch the site's display language via the Google Website Translator widget
 * (see `components/i18n/google-translate.tsx`), then reload.
 *
 * The widget translates the live DOM in place; it doesn't know about React's
 * virtual DOM, so if a client-side (Next Link) navigation re-renders a subtree
 * Google has already mutated, React can throw trying to reconcile against
 * nodes it no longer recognises. Reloading on every switch — and forcing full
 * reloads for in-app navigation while translated, via `TranslateNavGuard` —
 * keeps every render Google touches a fresh, non-React-owned DOM.
 */
export function applyLanguage(code: LanguageCode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TIPS_LANG_COOKIE, code);
  if (code === "en") {
    clearCookie(GOOGTRANS_COOKIE);
  } else {
    setCookie(GOOGTRANS_COOKIE, `/en/${code}`);
  }
  window.location.reload();
}
