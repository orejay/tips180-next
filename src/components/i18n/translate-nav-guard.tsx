"use client";

import { useEffect } from "react";
import { readStoredLanguage } from "@/lib/i18n";

/**
 * While a non-English language is active, forces every in-app navigation to
 * be a full browser navigation instead of Next's client-side routing.
 *
 * Why: Google Translate rewrites DOM text nodes directly; React has no idea
 * this happened. The moment a Link click triggers a client-side re-render of
 * a subtree Google has touched, React's reconciler can throw trying to
 * remove/replace nodes it no longer recognises. A capture-phase listener here
 * intercepts same-origin anchor clicks before Next's own Link handler runs
 * and does a real navigation instead — same for back/forward via `popstate`.
 */
export function TranslateNavGuard() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (readStoredLanguage() === "en") return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return;
      }
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      window.location.href = url.toString();
    }

    function onPopState() {
      if (readStoredLanguage() !== "en") window.location.reload();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}
