import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { LastUpdated } from "@/components/seo/last-updated";
import { TipsTable } from "@/components/dashboard/tips-table";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getTipCategory, tipCategories } from "@/config/tip-store";
import { getCategoryTips } from "@/lib/tip-store";

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

  const rows = await getCategoryTips(cat);
  const url = `${siteConfig.url}/tip-store/${cat.slug}`;

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

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-12 text-center text-white lg:py-16">
        <h1 className="text-xl font-bold lg:text-3xl">{cat.title} Predictions</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">{cat.description}</p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {rows && rows.length > 0 ? (
          <>
            <div className="mb-3 flex justify-end">
              <LastUpdated />
            </div>
            <TipsTable rows={rows} />
          </>
        ) : cat.gated ? (
          <div className="rounded-xl border border-border bg-surface p-8 text-center">
            <h2 className="text-lg font-bold text-foreground">
              Unlock {cat.title} tips
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              {cat.title} predictions are part of the {cat.tier} plan. Subscribe to
              view today&apos;s expert selections.
            </p>
            <Link
              href="/our-plans"
              className="mt-5 inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              View Plans
            </Link>
          </div>
        ) : (
          <p className="rounded-lg bg-surface py-10 text-center text-muted shadow-sm">
            No {cat.title} tips posted right now. Please check back later.
          </p>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-foreground">{cat.title} — FAQ</h2>
          <dl className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg bg-surface p-5 shadow-sm">
                <dt className="font-semibold text-foreground">{faq.question}</dt>
                <dd className="mt-1 text-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
