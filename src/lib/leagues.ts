import { api } from "@/lib/api";

/**
 * Leagues data access. Both endpoints are public:
 *  - GET /leagues/all               -> { [region]: League[] }
 *  - GET /leagues/<slug>/matches    -> { matches: LeagueMatch[] }  (open, not yet closed)
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

/**
 * Crest logos for the ~100 leagues/competitions users actually recognise
 * (top-5 European leagues, continental cups, major African/Asian/American
 * leagues). Keyed by `leagueSlug(short_name)`.
 *
 * The backend's `leagues_table` has no logo column and the ~340 leagues it
 * lists include a long tail of obscure lower divisions and qualifiers, so
 * rather than call a third-party API on every request, this map was seeded
 * ONCE from API-Football's `/leagues` endpoint (matched by name+country,
 * hand-verified) and is committed as a static asset. Leagues outside this
 * list simply render without a crest (see `LeagueLogo`'s null fallback) —
 * mirrors how the reference project only crests "top leagues" and leaves
 * the long tail generic.
 */
export const LEAGUE_LOGOS: Record<string, string> = {
  epl: "https://media.api-sports.io/football/leagues/39.png",
  "eng-2": "https://media.api-sports.io/football/leagues/40.png",
  "eng-l1": "https://media.api-sports.io/football/leagues/41.png",
  "eng-l2": "https://media.api-sports.io/football/leagues/42.png",
  "la-liga": "https://media.api-sports.io/football/leagues/140.png",
  "spa-2": "https://media.api-sports.io/football/leagues/141.png",
  ita: "https://media.api-sports.io/football/leagues/135.png",
  "ita-b": "https://media.api-sports.io/football/leagues/136.png",
  ger: "https://media.api-sports.io/football/leagues/78.png",
  "ger-2": "https://media.api-sports.io/football/leagues/79.png",
  fra: "https://media.api-sports.io/football/leagues/61.png",
  "fre-l2": "https://media.api-sports.io/football/leagues/62.png",
  por: "https://media.api-sports.io/football/leagues/94.png",
  "por-2": "https://media.api-sports.io/football/leagues/95.png",
  tur: "https://media.api-sports.io/football/leagues/203.png",
  neth: "https://media.api-sports.io/football/leagues/88.png",
  "neth-2": "https://media.api-sports.io/football/leagues/89.png",
  belg: "https://media.api-sports.io/football/leagues/144.png",
  sco: "https://media.api-sports.io/football/leagues/179.png",
  "sco-cha": "https://media.api-sports.io/football/leagues/180.png",
  den: "https://media.api-sports.io/football/leagues/119.png",
  switz: "https://media.api-sports.io/football/leagues/207.png",
  rus: "https://media.api-sports.io/football/leagues/235.png",
  ukr: "https://media.api-sports.io/football/leagues/333.png",
  gree: "https://media.api-sports.io/football/leagues/197.png",
  pol: "https://media.api-sports.io/football/leagues/106.png",
  swe: "https://media.api-sports.io/football/leagues/113.png",
  nor: "https://media.api-sports.io/football/leagues/103.png",
  cze: "https://media.api-sports.io/football/leagues/345.png",
  cro: "https://media.api-sports.io/football/leagues/210.png",
  serb: "https://media.api-sports.io/football/leagues/286.png",
  aust: "https://media.api-sports.io/football/leagues/218.png",
  ucl: "https://media.api-sports.io/football/leagues/2.png",
  uel: "https://media.api-sports.io/football/leagues/3.png",
  ecl: "https://media.api-sports.io/football/leagues/848.png",
  usc: "https://media.api-sports.io/football/leagues/531.png",
  cs: "https://media.api-sports.io/football/leagues/528.png",
  "fa-cup": "https://media.api-sports.io/football/leagues/45.png",
  "spa-cup": "https://media.api-sports.io/football/leagues/143.png",
  "ger-cup": "https://media.api-sports.io/football/leagues/81.png",
  "fre-cup": "https://media.api-sports.io/football/leagues/66.png",
  "cop-ita": "https://media.api-sports.io/football/leagues/137.png",
  "nor-cup": "https://media.api-sports.io/football/leagues/105.png",
  "swe-cup": "https://media.api-sports.io/football/leagues/115.png",
  mls: "https://media.api-sports.io/football/leagues/253.png",
  bra: "https://media.api-sports.io/football/leagues/71.png",
  "bra-2": "https://media.api-sports.io/football/leagues/72.png",
  "cop-bra": "https://media.api-sports.io/football/leagues/73.png",
  arg: "https://media.api-sports.io/football/leagues/128.png",
  "cop-arg": "https://media.api-sports.io/football/leagues/130.png",
  col: "https://media.api-sports.io/football/leagues/239.png",
  mexico: "https://media.api-sports.io/football/leagues/262.png",
  ecuad: "https://media.api-sports.io/football/leagues/242.png",
  urug: "https://media.api-sports.io/football/leagues/268.png",
  chile: "https://media.api-sports.io/football/leagues/265.png",
  peru: "https://media.api-sports.io/football/leagues/281.png",
  para: "https://media.api-sports.io/football/leagues/250.png",
  venez: "https://media.api-sports.io/football/leagues/299.png",
  bol: "https://media.api-sports.io/football/leagues/344.png",
  costa: "https://media.api-sports.io/football/leagues/162.png",
  mor: "https://media.api-sports.io/football/leagues/200.png",
  alg: "https://media.api-sports.io/football/leagues/186.png",
  tun: "https://media.api-sports.io/football/leagues/202.png",
  egy: "https://media.api-sports.io/football/leagues/233.png",
  gha: "https://media.api-sports.io/football/leagues/570.png",
  nig: "https://media.api-sports.io/football/leagues/399.png",
  ken: "https://media.api-sports.io/football/leagues/276.png",
  sou: "https://media.api-sports.io/football/leagues/288.png",
  uga: "https://media.api-sports.io/football/leagues/585.png",
  zamb: "https://media.api-sports.io/football/leagues/400.png",
  tanz: "https://media.api-sports.io/football/leagues/567.png",
  ango: "https://media.api-sports.io/football/leagues/397.png",
  zimb: "https://media.api-sports.io/football/leagues/401.png",
  "caf-cc": "https://media.api-sports.io/football/leagues/20.png",
  "caf-sc": "https://media.api-sports.io/football/leagues/533.png",
  "caf-cl": "https://media.api-sports.io/football/leagues/12.png",
  saudi: "https://media.api-sports.io/football/leagues/307.png",
  uae: "https://media.api-sports.io/football/leagues/301.png",
  qatar: "https://media.api-sports.io/football/leagues/305.png",
  kuwait: "https://media.api-sports.io/football/leagues/330.png",
  japan: "https://media.api-sports.io/football/leagues/98.png",
  "jap-j2": "https://media.api-sports.io/football/leagues/99.png",
  korea: "https://media.api-sports.io/football/leagues/292.png",
  "korea-2": "https://media.api-sports.io/football/leagues/293.png",
  china: "https://media.api-sports.io/football/leagues/169.png",
  india: "https://media.api-sports.io/football/leagues/323.png",
  thai: "https://media.api-sports.io/football/leagues/296.png",
  viet: "https://media.api-sports.io/football/leagues/340.png",
  austl: "https://media.api-sports.io/football/leagues/188.png",
  iran: "https://media.api-sports.io/football/leagues/290.png",
  bahr: "https://media.api-sports.io/football/leagues/417.png",
  singap: "https://media.api-sports.io/football/leagues/368.png",
  hk: "https://media.api-sports.io/football/leagues/380.png",
  phil: "https://media.api-sports.io/football/leagues/765.png",
  wc: "https://media.api-sports.io/football/leagues/1.png",
  "cop-am": "https://media.api-sports.io/football/leagues/9.png",
  asia: "https://media.api-sports.io/football/leagues/7.png",
};

/** Crest logo for a league, or null if it's outside the curated set above. */
export function leagueLogo(shortName: string): string | null {
  return LEAGUE_LOGOS[leagueSlug(shortName)] ?? null;
}

export async function getLeagueRegions(): Promise<LeagueRegions> {
  try {
    // League list changes rarely — cache for an hour.
    return await api<LeagueRegions>("leagues/all", {
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
      `leagues/${encodeURIComponent(shortName)}/matches`,
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
