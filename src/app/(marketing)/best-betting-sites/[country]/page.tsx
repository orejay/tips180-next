import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, bettingSiteListSchema } from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";
import { SiteLogo } from "@/components/marketing/betting-site-logo";
import {
  BETTING_COUNTRIES,
  BETTING_SITES_PUBLISHER,
  findBettingCountryConfig,
  type BettingCountryConfig,
} from "@/config/betting-countries";
import { getBettingSitesForCountry, type BettingSite } from "@/lib/betting-sites";
import { LastUpdated } from "@/components/seo/last-updated";
import { RatingCriterion } from "@/components/marketing/rating-criterion";
import { PageSectionHeading } from "@/components/marketing/page-section-heading";

type Params = { country: string };

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

export default async function BettingSitesCountryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { country: slug } = await params;
  const country = findBettingCountryConfig(slug);
  if (!country) notFound();

  const sites = await getBettingSitesForCountry(slug);
  const url = `${siteConfig.url}/best-betting-sites/${slug}`;

  const faqs = [
    {
      question: `What is the best betting site in ${country.name}?`,
      answer: `Based on our review criteria — licensing, payment support, withdrawal speed and bonus terms — ${sites[0]?.name ?? "the top-ranked bookmaker below"} currently leads our ${country.name} rankings, though every bettor's priorities differ.`,
    },
    {
      question: `Is online betting legal in ${country.name}?`,
      answer: country.regulator
        ? `Yes — online betting in ${country.name} is regulated by the ${country.regulator}. You must be at least ${country.legalAge || "18"} to register.`
        : `Check the licensing status of any bookmaker before you register in ${country.name}.`,
    },
  ];

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

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          This page breaks down the top betting sites in {country.name} so you
          don&apos;t have to dig through each bookmaker&apos;s terms yourself.
          Every operator below is graded on licensing, local payment support,
          withdrawal speed, bonus terms and customer service before it&apos;s
          allowed to appear here.{" "}
          {country.regulator ? (
            <>
              We only list bookmakers with a valid {country.regulator} licence
              (or an equivalent, respectable foreign licence), so you can bet
              with confidence.{" "}
            </>
          ) : null}
          Check out our{" "}
          <Link href="/leagues" className="font-medium text-primary hover:underline">
            football predictions
          </Link>{" "}
          once you&apos;ve picked a bookmaker, or browse{" "}
          <Link href="/best-betting-sites" className="font-medium text-primary hover:underline">
            other countries we cover
          </Link>
          .
        </p>

        {sites.length === 0 ? (
          <div className="rounded-lg bg-surface p-8 text-center text-muted shadow-sm">
            <p>Betting site reviews for {country.name} are being updated. Check back soon.</p>
            <Link
              href="/best-betting-sites"
              className="mt-4 inline-block font-medium text-primary hover:underline"
            >
              Browse other countries →
            </Link>
          </div>
        ) : (
          <ComparisonTable sites={sites} countrySlug={slug} />
        )}

        <section className="mt-14">
          <PageSectionHeading>
            How Do We Pick The Top Betting Sites in {country.name}?
          </PageSectionHeading>
          <p className="max-w-3xl text-sm leading-relaxed text-muted">
            We don&apos;t sell our rankings — they&apos;re earned. We check
            each bookmaker&apos;s licence
            {country.regulator ? <> against the {country.regulator}</> : null},
            test registration and deposits on real mobile devices, and confirm
            withdrawal speed and bonus terms before a bookmaker is allowed to
            appear on this page.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RatingCriterion
              title="Licensing verification"
              body={
                country.regulator
                  ? `We verify the claimed licence against the ${country.regulator} before a site can rank.`
                  : "We verify the claimed licence against the relevant regulator before a site can rank."
              }
            />
            <RatingCriterion
              title="Local payment methods"
              body={
                country.topPaymentMethods?.length
                  ? `We weight support for ${country.topPaymentMethods.join(", ")} heavily, since cashing out should feel local.`
                  : "We weight support for local payment methods heavily, since cashing out should feel local."
              }
            />
            <RatingCriterion
              title="Mobile performance"
              body="Testing is done on real phones over mobile data, not just desktop and office Wi-Fi."
            />
            <RatingCriterion
              title="Bonuses & wagering requirements"
              body="We check the terms, verify the wagering multiplier and look for market exclusions before rating a bonus."
            />
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
                  className="whitespace-nowrap font-medium text-primary hover:underline"
                >
                  {site.name} Review
                </Link>
              </td>
              <td className="px-4 py-3">
                {site.affiliate_link ? (
                  <a
                    href={site.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-linear-to-r from-brand-start to-brand-end py-1.5 pr-3.5 pl-1.5 text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="flex shrink-0 items-center justify-center rounded-full bg-white p-0.5 shadow-sm">
                      <SiteLogo site={site} size={18} />
                    </span>
                    Register on {site.name}
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
