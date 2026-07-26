import Link from "next/link";
import { TrendingUp } from "lucide-react";
import {
  getAllLeagues,
  getLeagueMatches,
  leagueLogo,
  leagueSlug,
  formatLeagueName,
  type League,
  type LeagueMatch,
} from "@/lib/leagues";
import { LeagueLogo } from "@/components/marketing/league-logo";

/** Cap on how many `is_top` leagues render tips inline (keeps the grid & the
 *  homepage's server-side fan-out of match fetches bounded). */
const MAX_TOP_LEAGUES = 6;

/** Top-league tips preview cards, driven by the `is_top` flag admins set on
 *  the league catalog (legacy LandingLeagues was hardcoded to 4 leagues).
 *  Every pinned league renders a card — one with no open matches right now
 *  still shows (with an empty state) rather than silently vanishing, so
 *  admins/users can see every pinned league is actually there. */
export async function LandingLeagues() {
  const all = await getAllLeagues();
  const topLeagues = all.filter((l) => l.is_top).slice(0, MAX_TOP_LEAGUES);
  if (topLeagues.length === 0) return null;

  const cards = await Promise.all(
    topLeagues.map(async (league) => ({
      league,
      matches: await getLeagueMatches(league.short_name),
    })),
  );

  return (
    <section
      id="top-leagues"
      className="mx-auto grid w-full max-w-6xl scroll-mt-28 grid-cols-1 gap-4 px-4 py-8 lg:grid-cols-2"
    >
      {cards.map(({ league, matches }) => (
        <LeagueCard key={league.short_name} league={league} matches={matches} />
      ))}
    </section>
  );
}

function LeagueCard({
  league,
  matches,
}: {
  league: League;
  matches: LeagueMatch[];
}) {
  const slug = leagueSlug(league.short_name);
  const name = formatLeagueName(league.name);
  const rows = matches.slice(0, 4);
  const hasOdds = rows.some((m) => m.odds);

  return (
    <div
      id={`league-${slug}`}
      className="scroll-mt-28 overflow-hidden rounded-xl border border-border bg-surface"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <LeagueLogo src={league.logo ?? leagueLogo(league.short_name)} alt="" size={20} />
          Betting Tips for {name}
        </h2>
        <Link href={`/leagues/${slug}`} className="text-sm font-medium text-primary hover:underline">
          View more →
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-6 text-center text-sm text-muted">
          No open {name} predictions right now — check back soon.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {rows.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{m.name}</p>
                <p className="text-xs text-subtle">{m.date}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                  {m.ft_tip || "—"}
                </span>
                {hasOdds && (
                  <span className="flex items-center gap-1 rounded-md bg-surface-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                    <TrendingUp size={11} className="text-primary" />
                    {m.odds || "—"}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
