import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, bettingSiteListSchema } from "@/lib/schema";
import { BettingSiteReview } from "@/components/marketing/betting-site-review";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";
import { BETTING_COUNTRIES, findBettingCountryConfig } from "@/config/betting-countries";
import { getBettingSitesForCountry, findBettingSite } from "@/lib/betting-sites";

type Params = { country: string; site: string };

// One route per bookmaker review, so each is independently indexable and
// linkable — pre-rendered for every country/site combo found at build time;
// any review added later still renders on-demand via ISR (dynamicParams
// defaults to true).
export async function generateStaticParams(): Promise<Params[]> {
  const perCountry = await Promise.all(
    BETTING_COUNTRIES.map(async (c) => {
      const sites = await getBettingSitesForCountry(c.slug);
      return sites.map((s) => ({ country: c.slug, site: s.slug }));
    }),
  );
  return perCountry.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country: countrySlug, site: siteSlug } = await params;
  const country = findBettingCountryConfig(countrySlug);
  const site = country ? await findBettingSite(countrySlug, siteSlug) : undefined;
  if (!country || !site) return { title: "Review Not Found" };

  return {
    title: `${site.name} Review — Best Betting Sites in ${country.name}`,
    description:
      site.bonus_summary ??
      `${site.name} review: welcome bonus, payment methods, withdrawal times and registration steps for bettors in ${country.name}, reviewed by Tips180.`,
    alternates: { canonical: `/best-betting-sites/${countrySlug}/${siteSlug}` },
  };
}

export default async function BettingSiteReviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country: countrySlug, site: siteSlug } = await params;
  const country = findBettingCountryConfig(countrySlug);
  if (!country) notFound();

  const site = await findBettingSite(countrySlug, siteSlug);
  if (!site) notFound();

  const countryUrl = `${siteConfig.url}/best-betting-sites/${countrySlug}`;
  const url = `${countryUrl}/${siteSlug}`;

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Best Betting Sites", url: `${siteConfig.url}/best-betting-sites` },
          { name: country.name, url: countryUrl },
          { name: `${site.name} Review`, url },
        ])}
      />
      <JsonLd
        data={bettingSiteListSchema([
          {
            name: site.name,
            url,
            rating: site.rating,
            description: site.bonus_summary ?? undefined,
          },
        ])}
      />
      {site.faqs.length > 0 && <JsonLd data={faqSchema(site.faqs)} />}

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-10 text-center text-white lg:py-14">
        <p className="text-xs font-medium tracking-wide text-white/80">
          Best Betting Sites in {country.name}
        </p>
        <h1 className="mt-1 text-lg font-bold lg:text-2xl">{site.name} Review</h1>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Link
          href={`/best-betting-sites/${countrySlug}`}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={15} />
          All {country.name} betting sites
        </Link>

        <BettingSiteReview site={site} />

        <ResponsibleGamblingNotice />
      </div>
    </div>
  );
}
