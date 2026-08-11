import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { LastUpdated } from "@/components/seo/last-updated";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import {
  findLeagueBySlug,
  getLeagueMatches,
  getLeagueRegions,
  leagueLogo,
  leagueSlug,
} from "@/lib/leagues";
import { LeagueLogo } from "@/components/marketing/league-logo";
import { BookingCode } from "@/components/marketing/booking-code";
import { LeaguePredictions } from "@/components/marketing/league-predictions";

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

  const name = league.name;
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

  const name = league.name;
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
            <LeaguePredictions allMatches={matches} leagueName={name} />
            <BookingCode category="league" hideCode />
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
      </div>
    </div>
  );
}
