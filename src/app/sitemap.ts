import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllLeagues, leagueSlug } from "@/lib/leagues";
import { tipCategories } from "@/config/tip-store";

/**
 * Generates /sitemap.xml.
 *
 * Static marketing routes plus the dynamic league hub pages (fetched from the
 * API, fail-soft). As more dynamic sections land (match pages, tipster
 * profiles), extend this and emit per-URL `lastModified`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/accuracy", changeFrequency: "daily", priority: 0.9 },
    { path: "/about-us", changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact-us", changeFrequency: "yearly", priority: 0.4 },
    { path: "/our-plans", changeFrequency: "weekly", priority: 0.8 },
    { path: "/leagues", changeFrequency: "daily", priority: 0.9 },
    { path: "/tips-store", changeFrequency: "daily", priority: 0.8 },
    { path: "/predict-win", changeFrequency: "weekly", priority: 0.6 },
    { path: "/how-to-pay", changeFrequency: "monthly", priority: 0.5 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-and-condition", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  // League hub pages — predictions refresh daily, so flag them as such.
  const leagues = await getAllLeagues();
  const leagueEntries: MetadataRoute.Sitemap = leagues.map((league) => ({
    url: `${siteConfig.url}/leagues/${leagueSlug(league.short_name)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  // Tip-store market pages (Over 2.5, BTTS, correct score, …).
  const tipStoreEntries: MetadataRoute.Sitemap = tipCategories.map((cat) => ({
    url: `${siteConfig.url}/tip-store/${cat.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticEntries, ...leagueEntries, ...tipStoreEntries];
}
