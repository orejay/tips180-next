import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
