import Link from "next/link";
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
 *  the league catalog (legacy LandingLeagues was hardcoded to 4 leagues). */
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
  return (
    <div
      id={`league-${slug}`}
      className="scroll-mt-28 rounded-xl border border-border p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <LeagueLogo src={league.logo ?? leagueLogo(league.short_name)} alt="" size={20} />
          Betting Tips for {name}
        </h2>
        <Link href={`/leagues/${slug}`} className="text-sm font-medium text-primary hover:underline">
          View more →
        </Link>
      </div>
      <ul className="divide-y divide-stone-100">
        {matches.slice(0, 4).map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="font-medium text-foreground">{m.name}</span>
            <span className="flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {m.ft_tip || "—"}
              </span>
              <span className="shrink-0 text-xs text-subtle">{m.date}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
