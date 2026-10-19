"use client";

import { leagueLogo, leagueSlug } from "@/lib/leagues";
import { useLeagueCatalog } from "@/components/marketing/league-catalog-context";
import { LeagueLogo } from "@/components/marketing/league-logo";

/** Brand-ish badge colours for recognised leagues without a crest; others fall back. */
const LEAGUE_COLORS: Record<string, string> = {
  EPL: "#38003C",
  "LA LIGA": "#E00C1A",
  ITA: "#024494",
  FRA: "#1d4ed8",
};

/**
 * League indicator shown in every tips table's League column. Checks the
 * live catalog crest first (admin-uploaded, via `/league-logos`), then the
 * static curated set (see `LEAGUE_LOGOS`) — only leagues in neither fall back
 * to the plain colour-coded text pill.
 */
export function LeagueBadge({ league }: { league: string }) {
  const { logos: catalogLogos } = useLeagueCatalog();

  const logo = catalogLogos[leagueSlug(league)] ?? leagueLogo(league);

  if (logo) {
    return (
      <span className="flex items-center justify-center">
        <LeagueLogo src={logo} alt={league} size={32} />
      </span>
    );
  }

  const bg = LEAGUE_COLORS[league?.toUpperCase()] ?? "#0f766e";
  return (
    <span className="flex items-center justify-center">
      <span
        className="inline-block rounded px-2 py-0.5 text-[11px] font-semibold text-white"
        style={{ backgroundColor: bg }}
      >
        {league}
      </span>
    </span>
  );
}
