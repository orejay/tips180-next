"use client";

import { useEffect } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

const SCRIPT_ID = "google-translate-script";

/**
 * Loads Google's Website Translator widget once, mounted invisibly. The header
 * language dropdown (`site-header.tsx`) drives it entirely via the `googtrans`
 * cookie + `applyLanguage()` (see `lib/i18n.ts`) — this component only needs to
 * exist so the widget initialises and picks that cookie up on page load.
 */
export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "sw,fr,es",
          autoDisplay: false,
        },
        "google_translate_element",
      );
    };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return <div id="google_translate_element" className="hidden" />;
}
