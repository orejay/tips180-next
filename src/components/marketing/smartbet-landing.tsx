import Link from "next/link";
import {
  Zap,
  Crown,
  Clock,
  CalendarDays,
  ArrowRight,
  Flame,
  ChevronRight,
  FileText,
  Percent,
} from "lucide-react";
import { getNextSmartBet } from "@/lib/home";
import { getMarketBoardRows, type BoardRow } from "@/lib/tip-store";
import { getTipCategory } from "@/config/tip-store";
import { formatDayMonth } from "@/lib/predictions";
import { Countdown } from "@/components/ui/countdown";
import { LeagueBadge } from "@/components/marketing/league-badge";

const gradient =
  "bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent";

function fmtDate(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso ?? "");
}

const trendingCat = getTipCategory("trendingmatches");

/**
 * Smart Bet block. The Smart Bet hero card and the (redesigned, compact) Smart
 * Bet Plus card are stacked in the left column; a live Trending Matches widget
 * fills the right column where Smart Bet Plus used to sit.
 */
export async function SmartBetLanding() {
  const [next, trendingRows] = await Promise.all([
    getNextSmartBet(),
    trendingCat
      ? getMarketBoardRows(trendingCat)
      : Promise.resolve<BoardRow[]>([]),
  ]);
  const sb = next[0];
  if (!sb) return null;

  const trending = trendingRows.slice(0, 5);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
          <Zap size={17} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl">
            Smart Bet
          </h2>
          <p className="text-xs text-subtle">
            Expert-curated tips that keep your slips green
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
        {/* Left column — Smart Bet hero + Smart Bet Plus, stacked */}
        <div className="flex flex-col gap-5 lg:col-span-7">
          {/* Smart Bet — gradient hero card */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/20">
            <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  <Zap size={13} />
                  Smart Bet
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                  Odds {sb.smartbetodds}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold leading-tight lg:text-3xl">
                Bet smart, win consistently
              </h3>
              <p className="mt-1.5 text-sm text-white/80">
                Unveil our expert smart-betting tips, built to deliver steady,
                reliable returns.
              </p>

              <div className="mt-5 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <p className="flex items-center gap-1.5 text-xs font-medium text-white/75">
                  <Clock size={13} />
                  Next Smart Bet tips start in
                </p>
                <p className="mt-1 text-2xl font-extrabold tabular-nums lg:text-3xl">
                  <Countdown time={sb.nextsmartbet} />
                </p>
              </div>

              <Link
                href="/dashboard/smartbet"
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Try Smart Bet
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Smart Bet Plus — compact horizontal card (redesigned for the stack) */}
          <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#18181b]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/10 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-sm">
                  <Crown size={19} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-foreground">
                      Smart Bet Plus
                    </h3>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                      Members only
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    A 10-banker ACCA — one hand-picked pick per top-ten league.
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-subtle">
                    <CalendarDays size={13} className="shrink-0" />
                    Next tip
                    <span className={`font-bold ${gradient}`}>
                      {fmtDate(sb.nextsmartbetplus)}
                    </span>
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/smartbet"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              >
                Try Plus
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right column — Trending Matches widget */}
        <div className="lg:col-span-5">
          <TrendingMatchesCard rows={trending} />
        </div>
      </div>
    </section>
  );
}

function TrendingMatchesCard({ rows }: { rows: BoardRow[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-4 py-3.5 dark:border-white/6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-rose-500 text-white shadow-sm">
          <Flame size={16} />
        </span>
        <div>
          <h3 className="font-bold text-foreground">Trending Matches</h3>
          <p className="text-xs text-subtle">
            The fixtures trending among football fans on social media
          </p>
        </div>
      </div>

      {/* List / empty state */}
      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-500/10">
            <Flame size={20} />
          </span>
          <p className="text-sm font-semibold text-foreground">
            No trending matches right now
          </p>
          <p className="text-xs text-subtle">
            Check back soon for today&apos;s hottest fixtures.
          </p>
        </div>
      ) : (
        <ul className="flex-1 divide-y divide-stone-50 dark:divide-white/5">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/tip-store/trendingmatches/${row.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-white/5"
              >
                <LeagueBadge league={row.league} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold leading-snug text-foreground">
                    {row.name}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {formatDayMonth(row.date)}
                    {row.time ? ` · ${row.time}` : ""}
                  </p>
                  {row.analysis && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      <FileText size={11} className="shrink-0" />
                      View Analysis
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {row.tip}
                  </span>
                  {row.trendyOdds && (
                    <span className="rounded-full bg-stone-800 px-2.5 py-1 text-[11px] font-bold text-white dark:bg-zinc-700">
                      {row.trendyOdds}
                    </span>
                  )}
                  {row.percentage != null && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                      <Percent size={11} className="shrink-0" />
                      View Percentage
                    </span>
                  )}
                </div>
                <ChevronRight size={16} className="shrink-0 text-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Footer link */}
      <div className="mt-auto border-t border-stone-100 p-3 dark:border-white/6">
        <Link
          href="/tip-store/trendingmatches"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-50 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-stone-100 dark:bg-white/5 dark:hover:bg-white/10"
        >
          View more trending matches
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
