import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Generates /robots.txt at build time.
 *
 * Explicitly allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.) — AI referral traffic is a primary growth channel in
 * the SEO/GEO master plan, and silent wildcard blocks would exclude us.
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "PerplexityBot",
    "Google-Extended",
    "CCBot",
    "Applebot-Extended",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/auth/", "/payment/", "/api/"],
      },
      // AI crawlers: allow public content, keep authed/payment areas private.
      ...aiBots.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/dashboard/", "/auth/", "/payment/"],
      })),
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
