import Link from "next/link";
import { getLeagueTips, type LeagueTips } from "@/lib/home";
import { leagueLogo, leagueSlug } from "@/lib/leagues";
import { formatDayMonth, type CardMatch } from "@/lib/predictions";
import { LeagueLogo } from "@/components/marketing/league-logo";

const LEAGUES: { key: keyof LeagueTips; title: string }[] = [
  { key: "epl", title: "English Premier League" },
  { key: "la_liga", title: "Spanish La Liga" },
  { key: "seria_a", title: "Italian Serie A" },
  { key: "bundesliga", title: "German Bundesliga" },
];

/** Top-league tips preview cards (legacy LandingLeagues). */
export async function LandingLeagues() {
  const tips = await getLeagueTips();
  if (!tips) return null;

  const cards = LEAGUES.map((l) => ({ ...l, matches: tips[l.key] ?? [] })).filter(
    (c) => c.matches.length > 0,
  );
  if (cards.length === 0) return null;

  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-8 lg:grid-cols-2">
      {cards.map((card) => (
        <LeagueCard key={card.key} title={card.title} matches={card.matches} />
      ))}
    </section>
  );
}

function LeagueCard({ title, matches }: { title: string; matches: CardMatch[] }) {
  const shortName = matches[0]?.league ?? "";
  const slug = leagueSlug(shortName);
  return (
    <div className="rounded-xl border border-border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-foreground">
          <LeagueLogo src={leagueLogo(shortName)} alt="" size={20} />
          {title}
        </h2>
        <Link href={`/leagues/${slug}`} className="text-sm font-medium text-primary hover:underline">
          View all →
        </Link>
      </div>
      <ul className="divide-y divide-stone-100">
        {matches.slice(0, 4).map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="font-medium text-foreground">{m.name}</span>
            <span className="flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {m.fttip || "—"}
              </span>
              <span className="shrink-0 text-xs text-subtle">{formatDayMonth(m.date)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
