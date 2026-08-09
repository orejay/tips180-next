import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, bettingSiteListSchema } from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { MarkdownLite } from "@/components/marketing/markdown-lite";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";
import { SiteLogo } from "@/components/marketing/betting-site-logo";
import {
  BETTING_COUNTRIES,
  BETTING_SITES_PUBLISHER,
  findBettingCountryConfig,
  type BettingCountryConfig,
} from "@/config/betting-countries";
import { getBettingSitesForCountry, type BettingSite } from "@/lib/betting-sites";
import { getPageContent, resolveBlock } from "@/lib/page-content";
import { LastUpdated } from "@/components/seo/last-updated";
import { RatingCriterion } from "@/components/marketing/rating-criterion";
import { PageSectionHeading } from "@/components/marketing/page-section-heading";

type Params = { country: string };

/** tips180-theta "Page Content" page_slug for a given country's page. */
export function countryPageSlug(slug: string): string {
  return `best-betting-sites-${slug}`;
}

// The set of countries is fixed config, so every country always prerenders —
// no dependency on the backend being reachable at build time for routing.
export async function generateStaticParams(): Promise<Params[]> {
  return BETTING_COUNTRIES.map((c) => ({ country: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { country: slug } = await params;
  const country = findBettingCountryConfig(slug);
  if (!country) return { title: "Country Not Found" };

  return {
    title: `Best Betting Sites in ${country.name} — Reviews & Bonuses`,
    description: `Compare the best licensed betting sites in ${country.name}: welcome bonuses, payment methods, withdrawal times and registration steps, reviewed by Tips180.`,
    alternates: { canonical: `/best-betting-sites/${slug}` },
  };
}

/** Hardcoded fallbacks, some depending on the country's own config (regulator,
 *  payment methods) — mirrors what rendered here before admin content existed.
 *  Every field is overridable from tips180-theta ("Best Betting Sites — {country}"). */
function defaultsFor(country: BettingCountryConfig, sites: BettingSite[]) {
  return {
    intro: {
      body: `This page breaks down the top betting sites in ${country.name} so you don't have to dig through each bookmaker's terms yourself. Every operator below is graded on licensing, local payment support, withdrawal speed, bonus terms and customer service before it's allowed to appear here. ${
        country.regulator
          ? `We only list bookmakers with a valid ${country.regulator} licence (or an equivalent, respectable foreign licence), so you can bet with confidence. `
          : ""
      }Check out our [football predictions](/leagues) once you've picked a bookmaker, or browse [other countries we cover](/best-betting-sites).`,
    },
    how_we_pick_intro: {
      body: `We don't sell our rankings — they're earned. We check each bookmaker's licence${
        country.regulator ? ` against the ${country.regulator}` : ""
      }, test registration and deposits on real mobile devices, and confirm withdrawal speed and bonus terms before a bookmaker is allowed to appear on this page.`,
    },
    rating_licensing: {
      heading: "Licensing verification",
      body: country.regulator
        ? `We verify the claimed licence against the ${country.regulator} before a site can rank.`
        : "We verify the claimed licence against the relevant regulator before a site can rank.",
    },
    rating_payments: {
      heading: "Local payment methods",
      body: country.topPaymentMethods?.length
        ? `We weight support for ${country.topPaymentMethods.join(", ")} heavily, since cashing out should feel local.`
        : "We weight support for local payment methods heavily, since cashing out should feel local.",
    },
    rating_mobile: {
      heading: "Mobile performance",
      body: "Testing is done on real phones over mobile data, not just desktop and office Wi-Fi.",
    },
    rating_bonuses: {
      heading: "Bonuses & wagering requirements",
      body: "We check the terms, verify the wagering multiplier and look for market exclusions before rating a bonus.",
    },
    faq_1: {
      heading: `What is the best betting site in ${country.name}?`,
      body: `Based on our review criteria — licensing, payment support, withdrawal speed and bonus terms — ${sites[0]?.name ?? "the top-ranked bookmaker below"} currently leads our ${country.name} rankings, though every bettor's priorities differ.`,
    },
    faq_2: {
      heading: `Is online betting legal in ${country.name}?`,
      body: country.regulator
        ? `Yes — online betting in ${country.name} is regulated by the ${country.regulator}. You must be at least ${country.legalAge || "18"} to register.`
        : `Check the licensing status of any bookmaker before you register in ${country.name}.`,
    },
  };
}

const EXTRA_FAQ_SLOTS = ["faq_3", "faq_4", "faq_5"];

export default async function BettingSitesCountryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country: slug } = await params;
  const country = findBettingCountryConfig(slug);
  if (!country) notFound();

  const [sites, content] = await Promise.all([
    getBettingSitesForCountry(slug),
    getPageContent(countryPageSlug(slug)),
  ]);
  const url = `${siteConfig.url}/best-betting-sites/${slug}`;
  const defaults = defaultsFor(country, sites);

  const intro = resolveBlock(content, "intro", defaults.intro);
  const howWePickIntro = resolveBlock(content, "how_we_pick_intro", defaults.how_we_pick_intro);
  const ratingLicensing = resolveBlock(content, "rating_licensing", defaults.rating_licensing);
  const ratingPayments = resolveBlock(content, "rating_payments", defaults.rating_payments);
  const ratingMobile = resolveBlock(content, "rating_mobile", defaults.rating_mobile);
  const ratingBonuses = resolveBlock(content, "rating_bonuses", defaults.rating_bonuses);

  const faqKeys = ["faq_1", "faq_2", ...EXTRA_FAQ_SLOTS] as const;
  const faqs = faqKeys
    .map((key) =>
      resolveBlock(
        content,
        key,
        (defaults as unknown as Record<string, { heading?: string; body?: string }>)[key] ?? {},
      ),
    )
    .filter((f) => f.heading && f.body)
    .map((f) => ({ question: f.heading, answer: f.body }));

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Best Betting Sites", url: `${siteConfig.url}/best-betting-sites` },
          { name: country.name, url },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      {sites.length > 0 && (
        <JsonLd
          data={bettingSiteListSchema(
            sites.map((s) => ({
              name: s.name,
              url: `${url}/${s.slug}`,
              rating: s.rating,
              description: s.bonus_summary ?? undefined,
            })),
          )}
        />
      )}

      <Hero country={country} />

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <LastUpdated publisher={BETTING_SITES_PUBLISHER} />

        <MarkdownLite text={intro.body} className="mt-3 max-w-3xl text-sm leading-relaxed text-muted" />

        {sites.length === 0 ? (
          <div className="mt-8 rounded-lg bg-surface p-8 text-center text-muted shadow-sm">
            <p>Betting site reviews for {country.name} are being updated. Check back soon.</p>
            <Link
              href="/best-betting-sites"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              Browse other countries →
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <ComparisonTable sites={sites} countrySlug={slug} />
          </div>
        )}

        <section className="mt-14">
          <PageSectionHeading>
            How Do We Pick The Top Betting Sites in {country.name}?
          </PageSectionHeading>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">{howWePickIntro.body}</p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RatingCriterion title={ratingLicensing.heading} body={ratingLicensing.body} />
            <RatingCriterion title={ratingPayments.heading} body={ratingPayments.body} />
            <RatingCriterion title={ratingMobile.heading} body={ratingMobile.body} />
            <RatingCriterion title={ratingBonuses.heading} body={ratingBonuses.body} />
          </div>
        </section>

        <section className="mt-14">
          <PageSectionHeading>
            Best Betting Sites in {country.name} — FAQ
          </PageSectionHeading>
          <FaqAccordion items={faqs} />
        </section>

        <ResponsibleGamblingNotice />
      </div>
    </div>
  );
}

function Hero({ country }: { country: BettingCountryConfig }) {
  const factRows = [
    country.currency && { label: "Currency", value: country.currency },
    country.legalAge && { label: "Legal Age", value: country.legalAge },
    country.regulator && { label: "Regulator", value: country.regulator },
    country.taxNote && { label: "Tax on Winnings", value: country.taxNote },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-12 text-center text-white lg:py-16">
      <h1 className="text-xl font-bold lg:text-3xl">Best Betting Sites in {country.name}</h1>
      {factRows.length > 0 ? (
        <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-3">
          {factRows.map((f) => (
            <span
              key={f.label}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur"
            >
              <span className="opacity-80">{f.label}:</span> {f.value}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ComparisonTable({
  sites,
  countrySlug,
}: {
  sites: BettingSite[];
  countrySlug: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b-2 border-border bg-surface-muted">
            <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Bookmaker</th>
            <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Rating</th>
            <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Welcome Bonus</th>
            <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Min. Deposit</th>
            <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Withdrawal Time</th>
            <th className="px-4 py-3"></th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site.id} className="border-b border-border last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <SiteLogo site={site} size={24} />
                  {site.name}
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">
                {site.rating ? `${site.rating}/5` : "—"}
              </td>
              <td className="px-4 py-3 text-foreground">{site.bonus_summary || "—"}</td>
              <td className="px-4 py-3 text-foreground">{site.min_deposit || "—"}</td>
              <td className="px-4 py-3 text-foreground">{site.withdrawal_time || "—"}</td>
              <td className="px-4 py-3">
                <Link
                  href={`/best-betting-sites/${countrySlug}/${site.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-primary hover:underline"
                >
                  {site.name} Review
                  <ArrowUpRight size={13} className="shrink-0" />
                </Link>
              </td>
              <td className="px-4 py-3">
                {site.affiliate_link ? (
                  <a
                    href={site.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-primary py-1.5 pr-3.5 pl-1.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-md"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white p-1 shadow-sm">
                      <SiteLogo site={site} size={20} />
                    </span>
                    Register on {site.name}
                    <ArrowUpRight
                      size={13}
                      className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
