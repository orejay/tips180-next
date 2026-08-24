import Script from "next/script";

/**
 * Site-wide CleverCore ad loader (ported from legacy `Main.js`, which wrapped
 * every page and injected this on mount — not the page-scoped copy on
 * `/ad`, which serves a dedicated full-page ad slot). CleverCore renders its
 * own overlay/popunder once loaded, so no container div is needed here.
 * Loaded lazily (after the page is idle) so it never competes with real
 * content for LCP/INP.
 */
export function CleverCoreAd() {
  return (
    <Script id="clever-core-site" data-cfasync="false" strategy="lazyOnload">
      {`
        (function (document, window) {
          var a, c = document.createElement("script"), f = window.frameElement;
          c.id = "CleverCoreLoader50448";
          c.src = "https://scripts.cleverwebserver.com/1b246c2b83b7f322480a19abdd2ceff6.js";
          c.async = !0;
          c.type = "text/javascript";
          c.setAttribute("data-target", window.name || (f && f.getAttribute("id")));
          c.setAttribute("data-callback", "put-your-callback-macro-here");
          try { a = parent.document.getElementsByTagName("script")[0] || document.getElementsByTagName("script")[0]; }
          catch (e) { a = !1; }
          a || (a = document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]);
          a.parentNode.insertBefore(c, a);
        })(document, window);
      `}
    </Script>
  );
}
