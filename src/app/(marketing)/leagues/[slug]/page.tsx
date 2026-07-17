import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { LastUpdated } from "@/components/seo/last-updated";
import { siteConfig } from "@/config/site";
import {
  breadcrumbSchema,
  faqSchema,
  sportsEventSchema,
} from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import {
  findLeagueBySlug,
  formatLeagueName,
  getLeagueMatches,
  getLeagueRegions,
  leagueLogo,
  leagueSlug,
  parseTeams,
  toIsoDate,
  type LeagueMatch,
} from "@/lib/leagues";
import { LeagueLogo } from "@/components/marketing/league-logo";

type Params = { slug: string };

// Prerender the top European leagues at build; the rest render on-demand (ISR).
export async function generateStaticParams(): Promise<Params[]> {
  const regions = await getLeagueRegions();
  const europe = regions["Europe"] ?? [];
  return europe.slice(0, 8).map((l) => ({ slug: leagueSlug(l.short_name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const league = await findLeagueBySlug(slug);
  if (!league) return { title: "League Not Found" };

  const name = formatLeagueName(league.name);
  return {
    title: `${name} Predictions & Betting Tips`,
    description: `Today's ${name} predictions, expert betting tips, correct scores and accumulators from Tips180. Free football tips updated daily.`,
    alternates: { canonical: `/leagues/${slug}` },
  };
}

export default async function LeaguePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const league = await findLeagueBySlug(slug);
  if (!league) notFound();

  const name = formatLeagueName(league.name);
  const matches = await getLeagueMatches(league.short_name);
  const url = `${siteConfig.url}/leagues/${slug}`;

  const faqs = [
    {
      question: `Where can I find ${name} predictions?`,
      answer: `Tips180 publishes ${name} predictions and betting tips daily, including match results, correct scores and accumulators researched by our experts.`,
      icon: "Search",
    },
    {
      question: `Are ${name} betting tips free?`,
      answer: `Yes. Tips180 offers free ${name} football predictions, with premium plans available for deeper analysis and higher-accuracy selections.`,
      icon: "Star",
    },
  ];

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Leagues", url: `${siteConfig.url}/leagues` },
          { name, url },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <MatchesSchema matches={matches} competition={name} url={url} />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-12 text-center text-white lg:py-16">
        <div className="flex items-center justify-center gap-3">
          <LeagueLogo
            src={league.logo ?? leagueLogo(league.short_name)}
            alt=""
            size={40}
            className="rounded-full bg-white/15 p-1.5"
          />
          <h1 className="text-xl font-bold lg:text-3xl">{name} Predictions</h1>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Expert {name} betting tips, correct scores and accumulators — updated
          daily.
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {matches.length > 0 ? (
          <>
            <div className="mb-3 flex justify-end">
              <LastUpdated />
            </div>
            <PredictionsTable matches={matches} leagueName={name} />
          </>
        ) : (
          <div className="rounded-lg bg-surface p-8 text-center text-muted shadow-sm">
            <p>
              No open {name} predictions right now. Check back soon or explore
              other leagues.
            </p>
            <Link
              href="/leagues"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              Browse all leagues →
            </Link>
          </div>
        )}

        <section className="mt-12">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            {name} Predictions — FAQ
          </h2>
          <FaqAccordion items={faqs} />
        </section>

        <div className="mt-12 rounded-xl bg-linear-to-r from-brand-start to-brand-end p-8 text-center text-white">
          <h2 className="text-lg font-bold lg:text-2xl">
            Want higher-accuracy {name} tips?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm">
            Unlock premium predictions, risk-managed accumulators and expert
            analysis.
          </p>
          <Link
            href="/our-plans"
            className="mt-5 inline-block rounded-md bg-surface px-6 py-2.5 font-medium text-primary transition-opacity hover:opacity-90"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}

// Free visitors see the first 2 matches; the rest need a Premium subscription.
const FREE_MATCH_LIMIT = 2;

function PredictionsTable({
  matches,
  leagueName,
}: {
  matches: LeagueMatch[];
  leagueName: string;
}) {
  const visible = matches.slice(0, FREE_MATCH_LIMIT);
  const hiddenCount = matches.length - visible.length;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 text-left font-medium">Match</th>
              <th className="px-3 py-3 font-medium">Tip</th>
              <th className="px-3 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => (
              <tr key={match.id} className="border-b border-border last:border-0">
                <td className="px-3 py-3 whitespace-nowrap text-muted">
                  {match.date}
                </td>
                <td className="px-3 py-3 text-left font-medium text-foreground">
                  {match.name}
                </td>
                <td className="px-3 py-3 text-foreground">{match.ft_tip || "—"}</td>
                <td className="px-3 py-3 text-foreground">{match.ft_score || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hiddenCount > 0 && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-muted p-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-primary dark:bg-primary-soft">
            <Lock size={19} />
          </span>
          <h3 className="font-bold text-foreground">
            {hiddenCount} more {leagueName} {hiddenCount === 1 ? "match" : "matches"} for
            Premium subscribers
          </h3>
          <p className="mx-auto max-w-md text-sm text-muted">
            Subscribe to Premium to unlock every {leagueName} prediction, not just today&apos;s
            top picks.
          </p>
          <Link
            href="/our-plans"
            className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            View Plans
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}

/** Emits SportsEvent JSON-LD for matches whose names parse into two teams. */
function MatchesSchema({
  matches,
  competition,
  url,
}: {
  matches: LeagueMatch[];
  competition: string;
  url: string;
}) {
  const events = matches
    .map((match) => {
      const teams = parseTeams(match.name);
      const startDate = toIsoDate(match.date);
      if (!teams || !startDate) return null;
      return sportsEventSchema({
        homeTeam: teams.home,
        awayTeam: teams.away,
        competition,
        startDate,
        url,
      });
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .slice(0, 20);

  if (events.length === 0) return null;
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": events }} />;
}
