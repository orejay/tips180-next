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
import { TipsterBadge } from "@/components/marketing/tipster-badge";
import { FreeBoard, type BoardStore } from "@/components/marketing/free-board";

/** Static fallback used when the league feed is empty (still links to hubs). */
const TOP_LEAGUE_FALLBACK: { name: string; href: string; shortName: string; logo?: string | null }[] = [
  { name: "UEFA Champions League", href: "/leagues", shortName: "UCL" },
  { name: "Premier League", href: "/leagues", shortName: "EPL" },
  { name: "La Liga", href: "/leagues", shortName: "LA LIGA" },
  { name: "Serie A", href: "/leagues", shortName: "ITA" },
  { name: "Bundesliga", href: "/leagues", shortName: "GER" },
  { name: "Ligue 1", href: "/leagues", shortName: "FRA" },
];

/** The six leagues pinned `is_top` in the league catalog, with hub links. */
function pickTopLeagues(
  all: League[],
): { name: string; href: string; shortName: string; logo?: string | null }[] {
  const top = all.filter((l) => l.is_top);
  if (top.length === 0) return TOP_LEAGUE_FALLBACK;

  return top.map((l) => ({
    name: formatLeagueName(l.name),
    href: `/leagues/${leagueSlug(l.short_name)}`,
    shortName: l.short_name,
    logo: l.logo,
  }));
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
      tipsterBadge={<TipsterBadge category="free-experts" />}
    />
  );
}
