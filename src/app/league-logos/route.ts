import { NextResponse } from "next/server";
import { getAllLeagues, leagueSlug } from "@/lib/leagues";

/**
 * `leagueSlug(short_name) -> logo` for every catalog league that has an
 * admin-uploaded crest. `LeagueBadge` (used in every predictions/tips table)
 * only knows the short league code (e.g. "SAUDIPL"), not the full catalog
 * `League` object with its `logo` field, so it fetches this map client-side
 * once and merges it with the static `LEAGUE_LOGOS` fallback — otherwise any
 * league outside that curated top-100 list falls back to a plain text pill
 * even when the admin has since uploaded a real crest for it.
 *
 * Deliberately NOT under /api/* — see store-preview/route.ts for why.
 */
export async function GET() {
  const leagues = await getAllLeagues();
  const map: Record<string, string> = {};
  for (const league of leagues) {
    if (league.logo) map[leagueSlug(league.short_name)] = league.logo;
  }
  return NextResponse.json(map, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
