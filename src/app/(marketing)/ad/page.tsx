import type { Metadata } from "next";
import Script from "next/script";

// Ad-serving container (legacy CleverCore). No content value — keep out of index.
export const metadata: Metadata = {
  title: "Tips180",
  robots: { index: false, follow: false },
};

export default function AdPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="clever-core-ads" />
      <Script id="clever-core" data-cfasync="false" strategy="afterInteractive">
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
    </div>
  );
}
