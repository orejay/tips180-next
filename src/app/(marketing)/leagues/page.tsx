import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import {
  formatLeagueName,
  getLeagueRegions,
  leagueSlug,
  REGION_ORDER,
  type League,
} from "@/lib/leagues";

export const metadata: Metadata = {
  title: "Football Leagues — Predictions for Every League | Tips180",
  description:
    "Browse Tips180 football predictions and betting tips by league: Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and 100+ competitions worldwide.",
  alternates: { canonical: "/leagues" },
};

export default async function LeaguesPage() {
  const regions = await getLeagueRegions();

  // Render known regions in a sensible order, then any extras the API adds.
  const orderedRegions = [
    ...REGION_ORDER.filter((r) => regions[r]?.length),
    ...Object.keys(regions).filter(
      (r) => !REGION_ORDER.includes(r) && regions[r]?.length,
    ),
  ];

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Leagues", url: `${siteConfig.url}/leagues` },
        ])}
      />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">Football Leagues</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Expert predictions, betting tips and accumulators for every major
          league and competition.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
        {orderedRegions.length === 0 ? (
          <p className="text-center text-muted">
            Leagues are being updated. Please check back shortly.
          </p>
        ) : (
          orderedRegions.map((region) => (
            <section key={region} className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">{region}</h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {regions[region].map((league) => (
                  <LeagueLink key={league.short_name} league={league} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

function LeagueLink({ league }: { league: League }) {
  return (
    <Link
      href={`/leagues/${leagueSlug(league.short_name)}`}
      className="rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-linear-to-r hover:from-brand-start hover:to-brand-end hover:bg-clip-text hover:text-transparent"
    >
      {formatLeagueName(league.name)}
    </Link>
  );
}
