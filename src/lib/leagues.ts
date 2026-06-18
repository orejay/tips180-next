import { api } from "@/lib/api";

/**
 * Leagues data access. Both endpoints are public:
 *  - GET /getendpoints/leagues          -> { [region]: League[] }
 *  - GET /getendpoints/leagues/<slug>   -> { matches: LeagueMatch[] }  (open, not yet closed)
 *
 * The legacy app gated league matches behind a Premium check client-side, but
 * the API itself is open, so we server-render predictions for crawlers. All
 * fetches fail soft (empty result) so a backend hiccup never breaks the build
 * or the page shell.
 */

export type League = {
  name: string;
  short_name: string;
  region: string;
};

export type LeagueRegions = Record<string, League[]>;

/** A match row as returned by `Match.editformat()` on the backend. */
export type LeagueMatch = {
  id: number;
  /** dd/mm/YYYY */
  date: string;
  /** Usually "Home Team vs Away Team". */
  name: string;
  league: string;
  ft_tip: string | null;
  ht_score: string | null;
  ft_score: string | null;
  league_tip: string | null;
};

/** Display order for the region groups the backend returns. */
export const REGION_ORDER = [
  "Europe",
  "America",
  "Asia & Australia",
  "Africa",
  "International",
  "Cups",
  "Others",
];

/**
 * Clean URL slug for a league (e.g. "LA LIGA" -> "la-liga"). The backend matches
 * on the raw `short_name`, so callers query matches with `league.short_name`,
 * not this slug — `findLeagueBySlug` bridges the two.
 */
export function leagueSlug(shortName: string): string {
  return shortName.toLowerCase().trim().replace(/[\s_]+/g, "-");
}

/** Backend stores league names in ALL CAPS; render them more readably. */
export function formatLeagueName(name: string): string {
  return name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function getLeagueRegions(): Promise<LeagueRegions> {
  try {
    // League list changes rarely — cache for an hour.
    return await api<LeagueRegions>("getendpoints/leagues", {
      next: { revalidate: 3600 },
    });
  } catch {
    return {};
  }
}

export async function getAllLeagues(): Promise<League[]> {
  const regions = await getLeagueRegions();
  return Object.values(regions).flat();
}

export async function findLeagueBySlug(slug: string): Promise<League | undefined> {
  const all = await getAllLeagues();
  const target = slug.toLowerCase();
  return all.find((l) => leagueSlug(l.short_name) === target);
}

export async function getLeagueMatches(shortName: string): Promise<LeagueMatch[]> {
  try {
    // Predictions are time-sensitive — refresh every 5 minutes. The backend
    // upper-cases this path segment and matches it against `Match.league`.
    const res = await api<{ matches: LeagueMatch[] }>(
      `getendpoints/leagues/${encodeURIComponent(shortName)}`,
      { next: { revalidate: 300 } },
    );
    return res.matches ?? [];
  } catch {
    return [];
  }
}

/** Split a "Home vs Away" match name into team names, for SportsEvent schema. */
export function parseTeams(name: string): { home: string; away: string } | null {
  const m = name.split(/\s+(?:vs?\.?|v|-|–)\s+/i);
  if (m.length === 2 && m[0].trim() && m[1].trim()) {
    return { home: m[0].trim(), away: m[1].trim() };
  }
  return null;
}

/** Convert backend dd/mm/YYYY to an ISO date (YYYY-MM-DD) for schema. */
export function toIsoDate(ddmmyyyy: string): string | null {
  const m = ddmmyyyy?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}
