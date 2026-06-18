import Script from "next/script";
import { siteConfig } from "@/config/site";

/**
 * Google tag (gtag.js) for the Google Ads conversion tag (ported AW-17670030360)
 * and, optionally, GA4. Loaded after the page is interactive so it never blocks
 * LCP. Renders nothing if no ID is configured.
 */
export function Analytics() {
  const { googleAdsId, ga4Id } = siteConfig;
  const primaryId = googleAdsId || ga4Id;
  if (!primaryId) return null;

  const configs = [googleAdsId, ga4Id].filter(Boolean);

  return (
    <>
      <Script
        id="gtag-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configs.map((id) => `gtag('config', '${id}');`).join("\n          ")}
        `}
      </Script>
    </>
  );
}
