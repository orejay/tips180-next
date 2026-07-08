import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { LastUpdated } from "@/components/seo/last-updated";
import { TipStoreBoard } from "@/components/marketing/tip-store-board";
import { TipsterBadge } from "@/components/marketing/tipster-badge";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getTipCategory, tipCategories } from "@/config/tip-store";
import { getStoreTips } from "@/lib/tip-store";

type Params = { name: string };

export function generateStaticParams(): Params[] {
  return tipCategories.map((c) => ({ name: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { name } = await params;
  const cat = getTipCategory(name);
  if (!cat) return { title: "Tip Not Found" };
  return {
    title: `${cat.title} Predictions & Tips | Tips180`,
    description: cat.description,
    alternates: { canonical: `/tip-store/${cat.slug}` },
  };
}

export default async function TipStorePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { name } = await params;
  const cat = getTipCategory(name);
  if (!cat) notFound();

  const rows = await getStoreTips(cat);
  const url = `${siteConfig.url}/tip-store/${cat.slug}`;
  // Weekend Tips show every row with no date tabs (legacy StoreTable behaviour).
  const dateFilter = cat.slug !== "weekendtip";

  const faqs = [
    {
      question: `What are ${cat.title} tips?`,
      answer: cat.description,
    },
    {
      question: `Are ${cat.title} predictions free on Tips180?`,
      answer:
        cat.tier === "Free"
          ? `Yes — ${cat.title} predictions are available free on Tips180, updated daily.`
          : `${cat.title} tips are part of the ${cat.tier} plan. Subscribe to unlock today's selections.`,
    },
  ];

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Tips Store", url: `${siteConfig.url}/tips-store` },
          { name: cat.title, url },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-teal-500 via-cyan-600 to-blue-700 px-4 py-14 text-center text-white lg:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Sparkles size={13} />
            {cat.tier === "Free" ? "Free daily tips" : `${cat.tier} plan`}
          </span>
          <h1 className="mt-4 text-2xl font-bold lg:text-4xl">{cat.title} Predictions</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 lg:text-base">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {rows && rows.length > 0 ? (
          <>
            <div className="mb-4 flex justify-end">
              <LastUpdated />
            </div>
            <TipStoreBoard rows={rows} dateFilter={dateFilter} />
            <TipsterBadge category={cat.slug} />
          </>
        ) : cat.gated ? (
          <UnlockPanel title={cat.title} tier={cat.tier} />
        ) : (
          <p className="rounded-2xl border border-stone-200 bg-white py-12 text-center text-muted shadow-sm dark:border-white/8 dark:bg-[#18181b]">
            No {cat.title} tips posted right now. Please check back later.
          </p>
        )}

        {/* FAQ */}
        <section className="mt-14">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white">
              <HelpCircle size={17} />
            </span>
            <h2 className="text-xl font-bold text-foreground">{cat.title} — FAQ</h2>
          </div>
          <dl className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#18181b]"
              >
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}

function UnlockPanel({ title, tier }: { title: string; tier: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br from-teal-500/10 to-blue-600/10 blur-2xl" />
      <div className="relative">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
          <Lock size={20} />
        </span>
        <h2 className="text-lg font-bold text-foreground">Unlock {title} tips</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {title} predictions are part of the {tier} plan. Subscribe to view today&apos;s
          expert selections.
        </p>
        <Link
          href="/our-plans"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          View Plans
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
