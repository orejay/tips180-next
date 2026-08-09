import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import {
  AFRICA_PAYMENT_REGIONS,
  BETTING_COUNTRIES,
  BETTING_SITES_PUBLISHER,
  flagImageUrl,
} from "@/config/betting-countries";
import { getBettingSitesForCountry } from "@/lib/betting-sites";
import { getPageContent, resolveBlock } from "@/lib/page-content";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { LastUpdated } from "@/components/seo/last-updated";
import { MarkdownLite } from "@/components/marketing/markdown-lite";
import { RatingCriterion } from "@/components/marketing/rating-criterion";
import { PageSectionHeading } from "@/components/marketing/page-section-heading";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";

export const PAGE_SLUG = "best-betting-sites";

export const metadata: Metadata = {
  title: "Best Betting Sites in Africa — Reviews by Country",
  description:
    "Compare the best licensed betting sites across Nigeria, Kenya, Ghana, Uganda, Tanzania, South Africa, Cameroon and Zambia — bonuses, payment methods and regulation, reviewed by Tips180.",
  alternates: { canonical: "/best-betting-sites" },
};

/** Hardcoded fallbacks — every field here is overridable per-block from the
 *  tips180-theta "Page Content" admin (page: "Best Betting Sites — Hub"). */
const DEFAULTS = {
  hero: {
    heading: "Best Betting Sites in Africa",
    body: "Licensed, reviewed bookmakers — compare bonuses, payment methods and withdrawal times by country.",
  },
  intro: {
    body: `There isn't a single, cohesive betting market in Africa. The experience can differ greatly from Nigeria and Kenya to South Africa, Ghana, Uganda, Tanzania, Zambia, Cameroon and beyond, because each nation has its own laws, licensing schemes, payment methods and currency regulations.

With an emphasis on safety, licensing, football coverage, [mobile performance](#app-performance), payment choices, bonuses and overall bookmaker quality, this guide provides you with a pan-African overview of the top betting sites on the continent.

Currently, legal gambling and sports betting are permitted in about 45 African nations, however the degree of regulation varies greatly between them. There isn't a single betting licence for all of Africa, but there are numerous locally and internationally licensed bookmakers operating in various markets, and at least 20 well-known brands are regularly included in comparisons of African betting.

Start by comparing reputable [African betting sites](#countries) on this page, then look into specific nation guides for more in-depth local information. Visit our [predictions hub](/leagues) for match analysis and value selections. Go through the [nation selection grid](#countries) to see offers tailored to your area.

Many of the bookies listed on Tips180 operate in many African markets; however, availability, licensing, payment methods and bonuses vary per nation. See which operators are now featured on Tips180's African betting-site pages by using the comparison below.

Before selecting a bookmaker that suits your location, desired payment method and currency, this structure makes it simpler for you to compare regional coverage.`,
  },
  regulation_intro: {
    body: "In Africa, betting regulations vary by nation. While some markets limit, suspend, or strictly regulate betting activities, others permit online sportsbooks with a local licence. The regulator, licensing authority, legal status and player winnings tax for each of the eight Tips180 nation pages are summarised below.",
  },
  payment_intro: {
    body: `Due to regional differences in banking practices, mobile money use, financial restrictions and bookmaker relationships, payment choices vary greatly throughout Africa. Due to their speed and popularity, mobile wallets are dominant in various markets.

In others, local fintech gateways, cards, vouchers, bank transfers and EFT systems are more prevalent. Before registering, always check the cashier page because different countries and operators may have different possible methods.

Operators are assisted in meeting these regional demands by a number of pan-African payment providers. In markets that are enabled, Flutterwave accepts cards, bank account payments, bank transfers, USSD, QR, mobile money and Kenyan M-Pesa. Depending on the nation and merchant configuration, Paystack offers a variety of channels, such as cards, bank payments, USSD, QR, mobile money, bank transfers, EFT and Capitec Pay. While Tingg enables card, mobile money and direct bank transfer collections throughout Africa, DPO/Network provides cards, bank transfers and mobile money choices like M-Pesa, Tigo Pesa, Airtel Money and MTN in specific regions. Individual operator integration, country and licensing can still affect availability.`,
  },
  rating_intro: {
    body: "We use a straightforward, useful technique to evaluate betting sites with an emphasis on player experience, value, safety and usability. To enable readers to objectively compare choices and select a bookmaker that best suits their betting needs, all bookmakers are evaluated in the same key categories.",
  },
  rating_reliability: {
    heading: "Reliability & Legality",
    body: "When evaluating any betting site, trust is the most crucial consideration. We verify that the bookmaker has a valid licence, adheres to responsible gambling guidelines, and gives clear information about its ownership, rules and player protection practices. We also consider privacy policies, account verification, site security and the operator's general reputation.",
  },
  rating_odds: {
    heading: "Odds & Markets",
    body: "A good betting experience is largely dependent on competitive odds. We examine the prices offered across well-known sports and betting markets, plus the breadth and depth of markets — pre-match betting, live betting, football markets, player props, handicaps, totals, bet builders and other well-liked choices.",
  },
  rating_support: {
    heading: "Customer Support",
    body: "When you need assistance with payments, account access, bonuses or verification, good customer service is crucial. We assess how simple it is to get in touch with the support staff and how helpful the answers are, across live chat, email, phone, help centers and FAQ pages.",
  },
  rating_app: {
    heading: "App & Site Performance",
    body: "A decent betting app should be simple to use, quick and reliable. We examine how effectively mobile webpages and specialised apps function on smaller screens — registration, deposits, withdrawals, bet placement, live betting, cash out and account management.",
  },
  faq_1: {
    heading: "Which betting site is the most available in most African countries?",
    body: "Betway, 1xBet and 22Bet appear in the greatest number of listed nations according to Tips180's current African betting-site pages. Users should always confirm whether the bookmaker supports registrations, deposits and withdrawals in their present country because availability can still differ by region.",
  },
  faq_2: {
    heading: "Can I use the same betting account in different African countries?",
    body: "Occasionally, but not always. Depending on the nation, some foreign bookies may limit logins, payments, bonuses or verification, while others permit users to use one account when abroad. Before making bets if you relocate or travel, make sure to review the bookmaker's conditions, approved nations and KYC requirements.",
  },
  faq_3: {
    heading: "Is online betting legal across Africa?",
    body: "In Africa, different regulations apply to online betting. Certain gambling products are prohibited in some nations, internet betting regulations are ambiguous or restricted in others, and some nations have legal betting markets. Africa's gaming regulations differ greatly from nation to nation.",
  },
  faq_4: {
    heading: "Which payment method works across multiple African countries?",
    body: "Depending on the bookmaker and nation, common cross-border payment methods include bank cards, mobile money, bank transfers, e-wallets and cryptocurrencies. Although supported providers, currencies, withdrawal times and limitations can vary between nations, mobile money is particularly prevalent in many African markets.",
  },
  faq_5: {
    heading: "Why do welcome bonuses differ across African countries?",
    body: "Because bookies customise offers to local regulations, currencies, payment methods, taxes, competition and consumer behaviour, welcome bonuses vary. A bonus that is accessible in one African nation might not be available in another, be lower, or have different wagering conditions. Always read the bonus terms before accepting an offer.",
  },
} as const;

// Extra FAQ slots an admin can fill in beyond the 5 defaults above — unset by
// default, so they render nothing until the admin adds one.
const EXTRA_FAQ_SLOTS = ["faq_6", "faq_7", "faq_8"];

export default async function BestBettingSitesPage() {
  // Country facts are static config; the reviewed bookmakers themselves are
  // admin-managed (tips180-theta), fetched once here and reused for both the
  // country cards' review counts and the "Top Betting Sites" table below —
  // that table stays real, never a hardcoded list that can drift from what's
  // actually reviewed.
  const [sitesByCountry, content] = await Promise.all([
    Promise.all(BETTING_COUNTRIES.map((c) => getBettingSitesForCountry(c.slug))),
    getPageContent(PAGE_SLUG),
  ]);
  const paymentRows = BETTING_COUNTRIES.filter((c) => (c.topPaymentMethods?.length ?? 0) > 0);

  const hero = resolveBlock(content, "hero", DEFAULTS.hero);
  const intro = resolveBlock(content, "intro", DEFAULTS.intro);
  const regulationIntro = resolveBlock(content, "regulation_intro", DEFAULTS.regulation_intro);
  const paymentIntro = resolveBlock(content, "payment_intro", DEFAULTS.payment_intro);
  const ratingIntro = resolveBlock(content, "rating_intro", DEFAULTS.rating_intro);
  const ratingReliability = resolveBlock(content, "rating_reliability", DEFAULTS.rating_reliability);
  const ratingOdds = resolveBlock(content, "rating_odds", DEFAULTS.rating_odds);
  const ratingSupport = resolveBlock(content, "rating_support", DEFAULTS.rating_support);
  const ratingApp = resolveBlock(content, "rating_app", DEFAULTS.rating_app);

  const faqKeys = [
    "faq_1",
    "faq_2",
    "faq_3",
    "faq_4",
    "faq_5",
    ...EXTRA_FAQ_SLOTS,
  ] as const;
  const faqs = faqKeys
    .map((key) =>
      resolveBlock(
        content,
        key,
        (DEFAULTS as Record<string, { heading?: string; body?: string }>)[key] ?? {},
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
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">{hero.heading}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">{hero.body}</p>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:py-14">
        <LastUpdated publisher={BETTING_SITES_PUBLISHER} />

        <MarkdownLite text={intro.body} className="mt-3 max-w-3xl text-sm leading-relaxed text-muted" />

        <div id="countries" className="mt-8 scroll-mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BETTING_COUNTRIES.map((country, i) => {
            const siteCount = sitesByCountry[i].length;
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
          <PageSectionHeading>Top Betting Sites by Country</PageSectionHeading>
          <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-border bg-surface-muted">
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Country</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Top Betting Sites</th>
                </tr>
              </thead>
              <tbody>
                {BETTING_COUNTRIES.map((country, i) => {
                  const sites = sitesByCountry[i];
                  return (
                    <tr key={country.slug} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium whitespace-nowrap text-foreground">
                        {country.name}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {sites.length > 0 ? (
                          sites.map((site, j) => (
                            <span key={site.id}>
                              {j > 0 && ", "}
                              <Link
                                href={`/best-betting-sites/${country.slug}/${site.slug}`}
                                className="font-medium text-primary hover:underline"
                              >
                                {site.name}
                              </Link>
                            </span>
                          ))
                        ) : (
                          <span className="text-muted">Reviews coming soon</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <PageSectionHeading>Betting Regulation Across Africa</PageSectionHeading>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted">{regulationIntro.body}</p>
          <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-border bg-surface-muted">
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Country</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Regulator</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Legal Age</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Tax on Winnings</th>
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

        <section className="mt-14">
          <PageSectionHeading>Payment Methods Across Africa</PageSectionHeading>
          <MarkdownLite text={paymentIntro.body} className="mb-3 max-w-3xl text-sm leading-relaxed text-muted" />
          <div className="mt-6 overflow-x-auto rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-border bg-surface-muted">
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Region</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-subtle uppercase">Common Methods</th>
                </tr>
              </thead>
              <tbody>
                {AFRICA_PAYMENT_REGIONS.map((row) => (
                  <tr key={row.region} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-foreground">{row.region}</td>
                    <td className="px-4 py-3 text-foreground">{row.methods}</td>
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
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-muted">{ratingIntro.body}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <RatingCriterion title={ratingReliability.heading} body={ratingReliability.body} />
            <RatingCriterion title={ratingOdds.heading} body={ratingOdds.body} />
            <RatingCriterion title={ratingSupport.heading} body={ratingSupport.body} />
            <RatingCriterion id="app-performance" title={ratingApp.heading} body={ratingApp.body} />
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
