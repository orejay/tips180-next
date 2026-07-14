import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Percent } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema } from "@/lib/schema";
import { getTipCategory } from "@/config/tip-store";
import { getStoreTips, type StoreTipRow } from "@/lib/tip-store";
import { formatDayMonth } from "@/lib/predictions";
import { LeagueBadge } from "@/components/marketing/league-badge";

type Params = { id: string };

const trendyCat = getTipCategory("trendymatches");

async function getTrendyMatch(id: number): Promise<StoreTipRow | null> {
  if (!trendyCat || Number.isNaN(id)) return null;
  const rows = await getStoreTips(trendyCat);
  return rows?.find((r) => r.id === id) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await getTrendyMatch(Number(id));
  if (!match) return { title: "Trendy Match Not Found" };

  const title = match.title || match.name;
  return {
    title: `${title} | Tips180 Trendy Matches`,
    description: match.analysis
      ? match.analysis.slice(0, 155)
      : `Trendy match prediction for ${match.name} — ${match.tip}.`,
    alternates: { canonical: `/tip-store/trendymatches/${id}` },
  };
}

export default async function TrendyMatchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const match = await getTrendyMatch(Number(id));
  if (!match) notFound();

  const url = `${siteConfig.url}/tip-store/trendymatches/${id}`;
  const title = match.title || match.name;

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Tips Store", url: `${siteConfig.url}/tips-store` },
          { name: "Trendy Matches", url: `${siteConfig.url}/tip-store/trendymatches` },
          { name: title, url },
        ])}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-teal-500 via-cyan-600 to-blue-700 px-4 py-14 text-center text-white lg:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <Link
            href="/tip-store/trendymatches"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft size={13} /> Back to Trendy Matches
          </Link>
          <h1 className="mt-4 text-2xl font-bold lg:text-4xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85 lg:text-base">
            {match.name} · {formatDayMonth(match.date)}
            {match.time ? ` · ${match.time}` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-[#18181b]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <LeagueBadge league={match.league} />
              <div>
                <p className="font-bold text-foreground">{match.name}</p>
                <p className="text-xs text-subtle">
                  {formatDayMonth(match.date)}
                  {match.time ? ` · ${match.time}` : ""}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
              {match.tip}
            </span>
          </div>

          {match.analysis && (
            <div className="mt-6">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
                <FileText size={13} /> Analysis
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {match.analysis}
              </p>
            </div>
          )}

          {match.percentage != null && (
            <div className="mt-6">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
                <Percent size={13} /> Confidence
              </p>
              <div className="flex items-center gap-3">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-teal-500 to-blue-600"
                    style={{ width: `${match.percentage}%` }}
                  />
                </div>
                <span className="text-lg font-extrabold text-foreground">
                  {match.percentage}%
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tip-store/trendymatches"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft size={14} /> View all Trendy Matches
          </Link>
        </div>
      </div>
    </div>
  );
}
