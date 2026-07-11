import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // League crest logos (one-time seeded from API-Football, see lib/leagues.ts).
      { protocol: "https", hostname: "media.api-sports.io" },
      // Bookmaker favicon fallback for bookies without a local icon, see lib/bookings.ts.
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons" },
    ],
  },
  // Preserve SEO equity + old bookmarks: 301 legacy URLs to their new homes.
  async redirects() {
    return [
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/tipsstore", destination: "/tips-store", permanent: true },
      // Legacy per-provider / per-country checkout routes were consolidated
      // into a single dashboard payment page.
      { source: "/payment/:slug", destination: "/dashboard/payment", permanent: true },
    ];
  },
};

export default nextConfig;
