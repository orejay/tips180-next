import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Generates /sitemap.xml.
 *
 * Static marketing routes are listed here. As dynamic sections land (league
 * hubs, match pages, tipster profiles), extend this to fetch slugs from the API
 * and emit per-URL `lastModified` so Google crawls fresh content first.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/about-us", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact-us", changeFrequency: "yearly", priority: 0.4 },
    { path: "/our-plans", changeFrequency: "weekly", priority: 0.8 },
    { path: "/leagues", changeFrequency: "daily", priority: 0.9 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-and-condition", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  ];

  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
