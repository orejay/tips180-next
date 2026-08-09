import { api } from "@/lib/api";
import type { Tipster } from "@/lib/tipsters";

/**
 * "Best Betting Sites" data access. The public read route is open (no auth):
 *  - GET betting-sites/country/<slug>     -> { sites: BettingSite[] }
 *
 * *Which* countries the section covers, and each one's regulatory fact-sheet,
 * is fixed, static config (`config/betting-countries.ts`) — not admin-managed.
 * What comes from here (admin-managed via the tips180-theta "Best Betting
 * Sites" section) is the bookmaker reviews themselves. Each review's reviewer
 * is an existing `Tipster` profile, attached by the admin rather than typed in
 * free-text, so it's returned nested (see `tipster` below). Fetches fail soft
 * (empty result) so a backend hiccup never breaks the build or the page shell.
 */

export type BettingSiteFeature = { label: string; available: boolean };
export type BettingSiteStep = { title: string; description: string };
export type BettingSiteReviewSection = { heading: string; rating?: string; body: string };
export type BettingSiteFaq = { question: string; answer: string };

export type BettingSite = {
  id: number;
  country_slug: string;
  name: string;
  slug: string;
  logo_url: string | null;
  rating: number | null;
  rank: number;
  affiliate_link: string | null;
  licence: string | null;
  withdrawal_time: string | null;
  support_types: string[];
  min_deposit: string | null;
  bonus_summary: string | null;
  pros: string[];
  cons: string[];
  features: BettingSiteFeature[];
  payment_methods: string[];
  registration_steps: BettingSiteStep[];
  review_sections: BettingSiteReviewSection[];
  faqs: BettingSiteFaq[];
  tipster_id: number | null;
  tipster: Tipster | null;
  is_active: boolean;
};

/** Every active bookmaker review for a country, ordered by rank. */
export async function getBettingSitesForCountry(slug: string): Promise<BettingSite[]> {
  try {
    const res = await api<{ sites: BettingSite[] }>(
      `betting-sites/country/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300, tags: ["betting-sites"] } },
    );
    return res.sites ?? [];
  } catch {
    return [];
  }
}

/** A single bookmaker review by country + site slug, or undefined if not found. */
export async function findBettingSite(
  countrySlug: string,
  siteSlug: string,
): Promise<BettingSite | undefined> {
  const sites = await getBettingSitesForCountry(countrySlug);
  return sites.find((s) => s.slug === siteSlug);
}

/**
 * Bookmaker counts for each of the given country slugs (e.g. for the hub page's
 * country cards). Fetches all countries in parallel — each call is itself
 * fail-soft, so one slow/erroring country never blocks the others.
 */
export async function getBettingSiteCounts(slugs: string[]): Promise<Record<string, number>> {
  const counts = await Promise.all(
    slugs.map(async (slug) => [slug, (await getBettingSitesForCountry(slug)).length] as const),
  );
  return Object.fromEntries(counts);
}

/**
 * Resolve a backend-relative logo (`/uploads/photos/..`) to an absolute URL.
 * Mirrors `tipsterImageUrl()` — host is hardcoded on purpose (never localhost/
 * staging), and nginx serves the uploads folder under the API mount (`/api`).
 */
export function bettingSiteLogoUrl(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  if (logoUrl.startsWith("http")) return logoUrl;
  const path = logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`;
  return `https://www.tips180.com/api${path}`;
}
