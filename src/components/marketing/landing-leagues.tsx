import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import {
  getAllLeagues,
  getLeagueMatches,
  leagueLogo,
  leagueSlug,
  parseTeams,
  type League,
  type LeagueMatch,
} from "@/lib/leagues";
import { LeagueLogo } from "@/components/marketing/league-logo";
import { BookingCode } from "@/components/marketing/booking-code";

/** Cap on how many `is_top` leagues render tips inline (keeps the grid & the
 *  homepage's server-side fan-out of match fetches bounded). */
const MAX_TOP_LEAGUES = 6;

/** Top-league tips preview cards, driven by the `is_top` flag admins set on
 *  the league catalog (legacy LandingLeagues was hardcoded to 4 leagues).
 *  A pinned league with no open matches right now is skipped — there's
 *  nothing useful to show for it. */
export async function LandingLeagues() {
  const all = await getAllLeagues();
  const topLeagues = all.filter((l) => l.is_top).slice(0, MAX_TOP_LEAGUES);
  if (topLeagues.length === 0) return null;

  const cards = (
    await Promise.all(
      topLeagues.map(async (league) => ({
        league,
        matches: await getLeagueMatches(league.short_name),
      })),
    )
  ).filter((c) => c.matches.length > 0);
  if (cards.length === 0) return null;

  return (
    <section
      id="top-leagues"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-8"
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {cards.map(({ league, matches }) => (
          <LeagueCard key={league.short_name} league={league} matches={matches} />
        ))}
      </div>
      {/* One shared "League Tips" booking code for the whole widget — the
          backend posts a single code for this category, not one per league. */}
      <div className="mt-5">
        <BookingCode category="league" />
      </div>
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
  const name = league.name;
  // Free preview on the landing page — always 2, matching the linked /leagues/[slug]
  // page's FREE_MATCH_LIMIT, regardless of how many open matches exist.
  const rows = matches.slice(0, 2);

  return (
    <div
      id={`league-${slug}`}
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 bg-linear-to-r from-brand-start to-brand-end px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 p-1.5 backdrop-blur">
            <LeagueLogo src={league.logo ?? leagueLogo(league.short_name)} alt="" size={22} />
          </span>
          <h2 className="truncate font-bold text-white">Betting Tips for {name}</h2>
        </div>
        <Link
          href={`/leagues/${slug}`}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-white/25"
        >
          View more
          <ArrowRight size={12} />
        </Link>
      </div>

      <ul className="divide-y divide-border">
        {rows.map((m) => {
          const teams = parseTeams(m.name);
          return (
            <li
              key={m.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-surface-muted"
            >
              <div className="min-w-0">
                {teams ? (
                  <p className="truncate text-sm font-semibold text-foreground">
                    {teams.home} <span className="font-normal text-subtle">vs</span> {teams.away}
                  </p>
                ) : (
                  <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                )}
                <p className="mt-0.5 text-xs text-subtle">{m.date}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded-md bg-primary px-2.5 py-1 text-xs font-bold text-white">
                  {m.ft_tip || "—"}
                </span>
                {m.league_tip ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-muted">
                    <TrendingUp size={11} className="text-primary" />
                    {m.league_tip}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
