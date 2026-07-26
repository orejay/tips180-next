import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { BETTING_COUNTRIES, BETTING_SITES_PUBLISHER, flagImageUrl } from "@/config/betting-countries";
import { getBettingSiteCounts } from "@/lib/betting-sites";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { LastUpdated } from "@/components/seo/last-updated";
import { RatingCriterion } from "@/components/marketing/rating-criterion";
import { PageSectionHeading } from "@/components/marketing/page-section-heading";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";

export const metadata: Metadata = {
  title: "Best Betting Sites in Africa — Reviews by Country",
  description:
    "Compare the best licensed betting sites across Nigeria, Kenya, Ghana, Uganda, Tanzania, South Africa, Cameroon and Zambia — bonuses, payment methods and regulation, reviewed by Tips180.",
  alternates: { canonical: "/best-betting-sites" },
};

const faqs = [
  {
    question: "How does Tips180 pick the best betting sites?",
    answer:
      "We check licensing and regulation, local payment support, withdrawal speed, bonus terms and customer service before a bookmaker appears on this page.",
  },
  {
    question: "Is online betting legal across Africa?",
    answer:
      "Regulation varies by country — some markets have a clear local licensing regime, others restrict or leave online betting ambiguous. Check the regulator listed for your country below before you register.",
  },
  {
    question: "Which payment methods work across multiple African countries?",
    answer:
      "Common cross-border options include bank cards, mobile money, bank transfers and cryptocurrencies, though supported providers and withdrawal times vary by bookmaker and country.",
  },
];

export default async function BestBettingSitesPage() {
  // Country facts are static config; only the review counts are fetched.
  const counts = await getBettingSiteCounts(BETTING_COUNTRIES.map((c) => c.slug));
  const paymentRows = BETTING_COUNTRIES.filter((c) => (c.topPaymentMethods?.length ?? 0) > 0);

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Best Betting Sites", url: `${siteConfig.url}/best-betting-sites` },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">Best Betting Sites in Africa</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Licensed, reviewed bookmakers — compare bonuses, payment methods and
          withdrawal times by country.
        </p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
        <LastUpdated publisher={BETTING_SITES_PUBLISHER} />

        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          There isn&apos;t a single, cohesive betting market in Africa — the
          experience differs greatly from one country to the next, since each
          nation has its own laws, licensing schemes, payment methods and
          currency regulations. This page gives you a pan-African overview of
          the top betting sites on the continent; pick a country below for a
          full, country-specific breakdown, or head to our{" "}
          <Link href="/leagues" className="font-medium text-primary hover:underline">
            leagues hub
          </Link>{" "}
          for today&apos;s match predictions.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BETTING_COUNTRIES.map((country) => {
            const siteCount = counts[country.slug] ?? 0;
            return (
              <Link
                key={country.slug}
                href={`/best-betting-sites/${country.slug}`}
                className="group flex items-center justify-between rounded-xl bg-surface p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flagImageUrl(country.flagCode)}
                    alt=""
                    width={24}
                    height={18}
                    className="shrink-0 rounded-sm object-cover shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-foreground">{country.name}</p>
                    <p className="mt-1 text-xs text-muted">
                      {siteCount > 0
                        ? `${siteCount} betting ${siteCount === 1 ? "site" : "sites"} reviewed`
                        : country.regulator || "Reviews coming soon"}
                    </p>
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                />
              </Link>
            );
          })}
        </div>

        <section className="mt-14">
          <PageSectionHeading>Regulation &amp; Tax by Country</PageSectionHeading>
          <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Regulator</th>
                  <th className="px-4 py-3 font-medium">Legal Age</th>
                  <th className="px-4 py-3 font-medium">Tax on Winnings</th>
                </tr>
              </thead>
              <tbody>
                {BETTING_COUNTRIES.map((country) => (
                  <tr key={country.slug} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{country.name}</td>
                    <td className="px-4 py-3 text-foreground">{country.regulator || "—"}</td>
                    <td className="px-4 py-3 text-foreground">{country.legalAge || "18"}</td>
                    <td className="px-4 py-3 text-foreground">{country.taxNote || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {paymentRows.length > 0 ? (
          <section className="mt-10">
            <PageSectionHeading>Common Payment Methods by Country</PageSectionHeading>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paymentRows.map((country) => (
                <div key={country.slug} className="rounded-lg bg-surface p-4 shadow-sm">
                  <p className="font-bold text-foreground">{country.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {country.topPaymentMethods?.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14">
          <PageSectionHeading>How We Rate Betting Sites</PageSectionHeading>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RatingCriterion
              title="Reliability & Legality"
              body="We verify a valid licence, responsible-gambling compliance and clear ownership/rules before a bookmaker is even considered."
            />
            <RatingCriterion
              title="Odds & Markets"
              body="We check prices across well-known sports and markets, plus the breadth of pre-match, live, and player-prop coverage."
            />
            <RatingCriterion
              title="Customer Support"
              body="We test live chat, email, phone and FAQ coverage for how quickly and helpfully queries actually get resolved."
            />
            <RatingCriterion
              title="App & Site Performance"
              body="Registration, deposits, withdrawals, bet placement and cash-out are tested on real mobile devices, not just desktop."
            />
          </div>
        </section>

        <section className="mt-14">
          <PageSectionHeading>FAQ</PageSectionHeading>
          <FaqAccordion items={faqs} />
        </section>

        <ResponsibleGamblingNotice />
      </div>
    </div>
  );
}
