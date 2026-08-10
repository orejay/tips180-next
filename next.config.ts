import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next's default is 1 year, sent as `stale-while-revalidate` on every ISR
  // response's Cache-Control header. With no CDN in front of this site, that
  // header goes straight to visitors' browsers, which are allowed (RFC 5861)
  // to serve their own cached copy of a page instantly without re-checking
  // the server for up to that long — so an admin edit + on-demand
  // revalidateTag() call (which does work immediately at the origin) can
  // still look "stale" to a visitor whose browser skips the round trip.
  // Capping it forces browsers to re-validate against origin much sooner.
  expireTime: 3600,
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
      { source: "/payment", destination: "/dashboard/payment", permanent: true },
    ];
  },
};

export default nextConfig;
