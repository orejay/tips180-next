import { getFreeExperts } from "@/lib/predictions";
import {
  getAllLeagues,
  leagueSlug,
  formatLeagueName,
  type League,
} from "@/lib/leagues";
import { tipCategories, getTipCategory } from "@/config/tip-store";
import { getMarketBoardRows, type BoardRow } from "@/lib/tip-store";
import { LastUpdated } from "@/components/seo/last-updated";
import { BookingCode } from "@/components/marketing/booking-code";
import { FreeBoard, type BoardStore } from "@/components/marketing/free-board";

/** Curated "top league" matchers, tried in order against the live league feed. */
const TOP_LEAGUE_MATCHERS: RegExp[] = [
  /champions\s*league/i,
  /premier\s*league|\bEPL\b/i,
  /la\s*liga/i,
  /serie\s*a\b|\bITA\b/i,
  /bundesliga/i,
  /ligue\s*1|\bFRA\b/i,
];

/** Static fallback used when the league feed is empty (still links to hubs). */
const TOP_LEAGUE_FALLBACK: { name: string; href: string; shortName: string }[] = [
  { name: "UEFA Champions League", href: "/leagues", shortName: "UCL" },
  { name: "Premier League", href: "/leagues", shortName: "EPL" },
  { name: "La Liga", href: "/leagues", shortName: "LA LIGA" },
  { name: "Serie A", href: "/leagues", shortName: "ITA" },
  { name: "Bundesliga", href: "/leagues", shortName: "GER" },
  { name: "Ligue 1", href: "/leagues", shortName: "FRA" },
];

/** Map live league data onto the curated top-league list, with hub links. */
function pickTopLeagues(all: League[]): { name: string; href: string; shortName: string }[] {
  if (all.length === 0) return TOP_LEAGUE_FALLBACK;

  const picked: { name: string; href: string; shortName: string }[] = [];
  for (const re of TOP_LEAGUE_MATCHERS) {
    const hit = all.find((l) => re.test(l.name) || re.test(l.short_name));
    if (hit) {
      picked.push({
        name: formatLeagueName(hit.name),
        href: `/leagues/${leagueSlug(hit.short_name)}`,
        shortName: hit.short_name,
      });
    }
  }
  return picked.length > 0 ? picked : TOP_LEAGUE_FALLBACK;
}

/** Quick-pick store pills on the board. Public markets render their tips inline;
 *  gated markets show an unlock panel (Sure 2 Odds has no public category). */
const over1 = getTipCategory("over1");
const correctScore = getTipCategory("correctscore");

/**
 * "Today's Predictions" board — the highest-value SEO section. Server Component
 * fetching the public feeds (free experts, Over 1.5, Correct Score) plus the
 * league list, so tips render in HTML; {@link FreeBoard} adds the date filtering
 * and inline store switching. Gated markets render an unlock panel client-side.
 */
export async function FreeTips() {
  const [tips, leagues, over1Rows, csRows] = await Promise.all([
    getFreeExperts(),
    getAllLeagues(),
    over1 ? getMarketBoardRows(over1) : Promise.resolve<BoardRow[]>([]),
    correctScore ? getMarketBoardRows(correctScore) : Promise.resolve<BoardRow[]>([]),
  ]);
  if (tips.length === 0) return null;

  const freeRows: BoardRow[] = tips.map((t) => ({
    id: t.id,
    date: t.date,
    time: t.time ?? null,
    league: t.league,
    name: t.name,
    tip: t.fttip || t.upcoming_tip || "",
    odds: t.ft_odds ?? null,
  }));

  const stores: BoardStore[] = [
    { key: "free", label: "Free Tips", rows: freeRows, locked: false, tier: "Free" },
    { key: "over1", label: "Over 1.5", rows: over1Rows, locked: false, tier: "Free" },
    { key: "correctscore", label: "Correct Score", rows: csRows, locked: false, tier: "Free" },
    { key: "sure2", label: "Sure 2 Odds", rows: [], locked: true, tier: "Premium" },
    { key: "bts", label: "BTS(GG)", rows: [], locked: true, tier: "Key" },
    { key: "weekendtip", label: "Weekend Tips", rows: [], locked: true, tier: "Key" },
  ];

  const allStores = tipCategories.map((c) => ({ title: c.title, slug: c.slug }));

  return (
    <FreeBoard
      stores={stores}
      topLeagues={pickTopLeagues(leagues)}
      allStores={allStores}
      lastUpdated={<LastUpdated />}
      booking={<BookingCode category="freex" />}
    />
  );
}
