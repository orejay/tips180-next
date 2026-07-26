import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, X, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema, bettingSiteListSchema, personSchema } from "@/lib/schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";
import { TipsterCard } from "@/components/marketing/tipster-badge";
import {
  BETTING_COUNTRIES,
  BETTING_SITES_PUBLISHER,
  findBettingCountryConfig,
  type BettingCountryConfig,
} from "@/config/betting-countries";
import {
  getBettingSitesForCountry,
  bettingSiteLogoUrl,
  type BettingSite,
} from "@/lib/betting-sites";
import { tipsterImageUrl } from "@/lib/tipsters";
import { LastUpdated } from "@/components/seo/last-updated";
import { RatingCriterion } from "@/components/marketing/rating-criterion";

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
              url,
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
          <>
            <ComparisonTable sites={sites} />

            <div className="mt-14 flex flex-col gap-10">
              {sites.map((site) => (
                <ReviewCard key={site.id} site={site} />
              ))}
            </div>
          </>
        )}

        <section className="mt-14">
          <h2 className="mb-5 text-xl font-bold text-foreground">
            How Do We Pick The Top Betting Sites in {country.name}?
          </h2>
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
          <h2 className="mb-5 text-xl font-bold text-foreground">
            Best Betting Sites in {country.name} — FAQ
          </h2>
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

function ComparisonTable({ sites }: { sites: BettingSite[] }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-4 py-3 font-medium">Bookmaker</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Welcome Bonus</th>
            <th className="px-4 py-3 font-medium">Min. Deposit</th>
            <th className="px-4 py-3 font-medium">Withdrawal Time</th>
            <th className="px-4 py-3 font-medium"></th>
            <th className="px-4 py-3 font-medium"></th>
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
                <a
                  href={`#review-${site.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap font-medium text-primary hover:underline"
                >
                  {site.name} Review
                </a>
              </td>
              <td className="px-4 py-3">
                {site.affiliate_link ? (
                  <a
                    href={site.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="inline-block whitespace-nowrap rounded-md bg-linear-to-r from-brand-start to-brand-end px-4 py-1.5 text-xs font-medium text-white hover:opacity-90"
                  >
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

function SiteLogo({ site, size }: { site: BettingSite; size: number }) {
  const src = bettingSiteLogoUrl(site.logo_url);
  if (!src) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-muted"
        style={{ width: size, height: size }}
      >
        {site.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={site.name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
    />
  );
}

function ReviewCard({ site }: { site: BettingSite }) {
  const facts = [
    site.licence && { label: "Gaming Licence", value: site.licence },
    site.withdrawal_time && { label: "Withdrawal Time", value: site.withdrawal_time },
    site.support_types.length > 0 && { label: "Support Types", value: site.support_types.join(", ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article
      id={`review-${site.slug}`}
      className="scroll-mt-28 overflow-hidden rounded-xl bg-surface shadow-sm"
    >
      {site.tipster && (
        <JsonLd
          data={personSchema({
            name: site.tipster.name,
            url: `${siteConfig.url}/tipsters/${site.tipster.id}`,
            jobTitle: site.tipster.role ?? undefined,
            description: site.tipster.experience ?? undefined,
            image: tipsterImageUrl(site.tipster.image_url) ?? undefined,
          })}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <SiteLogo site={site} size={44} />
          <h3 className="text-lg font-bold text-foreground">{site.name}</h3>
        </div>
        {site.rating ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
            <Star size={14} className="fill-current" /> {site.rating}/5
          </span>
        ) : null}
      </div>

      <div className="p-5">
        {(site.pros.length > 0 || site.cons.length > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {site.pros.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {site.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    {pro}
                  </li>
                ))}
              </ul>
            )}
            {site.cons.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {site.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <X size={16} className="mt-0.5 shrink-0 text-danger" />
                    {con}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {facts.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg bg-surface-muted p-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="text-xs font-medium text-muted">{f.label}</p>
                <p className="text-sm font-semibold text-foreground">{f.value}</p>
              </div>
            ))}
          </div>
        )}

        {site.registration_steps.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-bold text-foreground">
              Registration steps
            </h4>
            <ol className="flex flex-col gap-2">
              {site.registration_steps.map((step, i) => (
                <li key={i} className="text-sm text-foreground">
                  <span className="font-semibold">
                    {i + 1}. {step.title}
                  </span>
                  {step.description ? (
                    <p className="mt-0.5 text-muted">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        )}

        {site.features.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-bold text-foreground">Features</h4>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {site.features.map((f, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border py-1.5 text-sm">
                  <span className="text-foreground">{f.label}</span>
                  {f.available ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-danger" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {site.payment_methods.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-2 font-bold text-foreground">Payment Methods</h4>
            <p className="text-sm text-muted">{site.payment_methods.join(", ")}</p>
          </div>
        )}

        {site.review_sections.map((section, i) => (
          <div key={i} className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="font-bold text-foreground">{section.heading}</h4>
              {section.rating ? (
                <span className="text-xs font-semibold text-primary">{section.rating}/5</span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}

        {site.faqs.length > 0 && (
          <div className="mt-6">
            <h4 className="mb-3 font-bold text-foreground">{site.name} — FAQ</h4>
            <FaqAccordion items={site.faqs} />
          </div>
        )}

        {site.tipster && <TipsterCard tipster={site.tipster} />}

        {site.affiliate_link ? (
          <div className="mt-6 flex justify-end border-t border-border pt-4">
            <a
              href={site.affiliate_link}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Register on {site.name}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
