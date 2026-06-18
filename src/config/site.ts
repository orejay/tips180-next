/**
 * Central site configuration. Single source of truth for branding, URLs and
 * locale so SEO metadata, schema and sitemaps stay consistent everywhere.
 */
export const siteConfig = {
  name: "Tips180",
  shortName: "Tips180",
  // Production origin. Used to build absolute URLs for canonical tags, sitemap,
  // robots and JSON-LD. Override per-environment via NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.tips180.com",
  // BCP-47 locale. Nigerian English is the primary audience (SEO master plan).
  locale: "en-NG",
  description:
    "Tips180 is one of the most accurate football prediction sites, providing free and premium football tips, correct scores and accumulators across every market.",
  // Backend API the legacy app already consumes. Frontend-only rewrite — the
  // API contract is unchanged. Override via NEXT_PUBLIC_API_URL.
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "https://www.tips180.com/api",
  ogImage: "/og.png",
  twitter: "@tips180",
  links: {
    twitter: "https://twitter.com/tips180",
  },
} as const;

export type SiteConfig = typeof siteConfig;
