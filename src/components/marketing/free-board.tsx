"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Trophy, Store, ChevronRight, ArrowRight, Lock } from "lucide-react";
import { formatDayMonth } from "@/lib/predictions";
import { leagueLogo } from "@/lib/leagues";
import type { BoardRow } from "@/lib/tip-store";
import type { TipTier } from "@/config/tip-store";
import { LeagueBadge } from "@/components/marketing/league-badge";
import { LeagueLogo } from "@/components/marketing/league-logo";

export type BoardStore = {
  key: string;
  label: string;
  rows: BoardRow[];
  locked: boolean;
  tier: TipTier;
};

const DAY_LABELS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Local YYYY-MM-DD (avoids the UTC offset shifting the day). */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

/** Heading prefix relative to today, matching the reference design. */
function getHeading(dateStr: string): string {
  const today = toDateString(new Date());
  const yesterday = toDateString(addDays(new Date(), -1));
  const tomorrow = toDateString(addDays(new Date(), 1));
  const formatted = new Date(`${dateStr}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
  if (dateStr === today) return `Today's Predictions — ${formatted}`;
  if (dateStr === yesterday) return `Yesterday's Predictions — ${formatted}`;
  if (dateStr === tomorrow) return `Tomorrow's Predictions — ${formatted}`;
  return `Predictions — ${formatted}`;
}

export function FreeBoard({
  stores,
  topLeagues,
  allStores,
  lastUpdated,
  booking,
  tipsterBadge,
}: {
  stores: BoardStore[];
  topLeagues: {
    name: string;
    href: string;
    shortName: string;
    logo?: string | null;
  }[];
  allStores: { title: string; slug: string }[];
  lastUpdated: ReactNode;
  booking: ReactNode;
  tipsterBadge?: ReactNode;
}) {
  const searchParams = useSearchParams();
  const requestedDate = searchParams.get("date");
  const sectionRef = useRef<HTMLElement>(null);

  const [selectedKey, setSelectedKey] = useState<string>(
    stores[0]?.key ?? "free",
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    () => requestedDate || toDateString(new Date()),
  );

  // Header day links (e.g. "Monday football predictions") land here with
  // ?date=YYYY-MM-DD#free-tips. Adjust selectedDate during render (React's
  // recommended pattern for syncing state to a changed prop) so navigating
  // between two different dates without a remount still picks it up.
  const [syncedDate, setSyncedDate] = useState(requestedDate);
  if (requestedDate !== syncedDate) {
    setSyncedDate(requestedDate);
    if (requestedDate) setSelectedDate(requestedDate);
  }

  // Scrolling the board into view is a genuine side effect, so it stays here.
  useEffect(() => {
    if (requestedDate) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [requestedDate]);

  // ±3 days around today, like the referenced date picker — plus the
  // requested date itself, if a header link pointed further out.
  const days = useMemo(() => {
    const today = new Date();
    const base = Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
    if (requestedDate && !base.some((d) => toDateString(d) === requestedDate)) {
      const [y, m, d] = requestedDate.split("-").map(Number);
      base.push(new Date(y, m - 1, d));
    }
    return base;
  }, [requestedDate]);

  const activeStore = stores.find((s) => s.key === selectedKey) ?? stores[0];
  const rows = activeStore.rows.filter((r) => r.date === selectedDate);

  return (
    <section id="free-tips" ref={sectionRef} className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6 lg:gap-8">
        {/* ── Left rail (after the predictions table on mobile) ────── */}
        <aside className="order-2 space-y-5 lg:order-1 lg:col-span-2">
          <TopLeaguesCard leagues={topLeagues} />
          <AllStoresCard stores={allStores} />
        </aside>

        {/* ── Main column ───────────────────────────────── */}
        <div className="order-1 lg:order-2 lg:col-span-4">
          <div className="mb-5 flex flex-col items-center gap-1.5 text-center">
            <h2 className="text-xl font-bold text-foreground lg:text-2xl">
              {getHeading(selectedDate)}
            </h2>
            {lastUpdated}
          </div>

          {/* Date selector */}
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {days.map((date) => {
              const ds = toDateString(date);
              const isSelected = ds === selectedDate;
              const isToday = ds === toDateString(new Date());
              const label = isToday ? "TODAY" : DAY_LABELS[date.getDay()];
              return (
                <button
                  key={ds}
                  type="button"
                  onClick={() => setSelectedDate(ds)}
                  className={
                    isSelected
                      ? "flex min-w-17 flex-col items-center rounded-xl border border-transparent bg-linear-to-br from-teal-500 to-blue-600 px-4 py-2 text-white shadow-md shadow-blue-500/20"
                      : "flex min-w-17 flex-col items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-muted transition-colors hover:border-teal-400 hover:text-foreground dark:border-white/10 dark:bg-[#18181b] dark:hover:border-teal-600"
                  }
                >
                  <span className="text-[11px] font-bold leading-tight tracking-wide">
                    {label}
                  </span>
                  <span className="mt-0.5 text-[13px] font-semibold leading-tight">
                    {date.getDate()} {MONTH_LABELS[date.getMonth()]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mb-5 h-px w-full max-w-md bg-stone-200 dark:bg-white/10" />

          {/* Store pills */}
          <div className="mb-5 flex flex-wrap justify-center gap-2">
            {stores.map((s) => {
              const active = s.key === selectedKey;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSelectedKey(s.key)}
                  className={
                    active
                      ? "inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-teal-500 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm"
                      : "inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-teal-50 hover:text-teal-700 dark:bg-white/5 dark:text-zinc-300 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                  }
                >
                  {s.locked && <Lock size={12} className="shrink-0" />}
                  {s.label}
                </button>
              );
            })}
            <a
              href="#all-tip-stores"
              className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 dark:bg-white/5"
            >
              View More Stores
              <ArrowRight size={14} />
            </a>
          </div>

          {/* Predictions / unlock panel */}
          {activeStore.locked ? (
            <UnlockPanel label={activeStore.label} tier={activeStore.tier} />
          ) : (
            <>
              <PredictionTable rows={rows} />
              {activeStore.key === "free" && (
                <>
                  <div className="mt-4">{booking}</div>
                  {tipsterBadge}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Left-rail cards ───────────────────────────────────── */

function TopLeaguesCard({
  leagues,
}: {
  leagues: {
    name: string;
    href: string;
    shortName: string;
    logo?: string | null;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-4 py-3.5 dark:border-white/6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-teal-500 to-blue-600 text-white">
          <Trophy size={15} />
        </span>
        <h3 className="font-bold text-foreground">Top Football Leagues</h3>
      </div>
      <ul className="p-2">
        {leagues.map((l) => (
          <li key={l.name}>
            <Link
              href={l.href}
              className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-stone-50 hover:text-foreground dark:hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <LeagueLogo
                  src={l.logo ?? leagueLogo(l.shortName)}
                  alt=""
                  size={18}
                />
                {l.name}
              </span>
              <ChevronRight
                size={15}
                className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-2 pb-2">
        <Link
          href="/leagues"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-50 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-stone-100 dark:bg-white/5 dark:hover:bg-white/10"
        >
          View More Leagues
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function AllStoresCard({
  stores,
}: {
  stores: { title: string; slug: string }[];
}) {
  return (
    <div
      id="all-tip-stores"
      className="scroll-mt-28 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]"
    >
      <div className="flex items-center gap-2.5 border-b border-stone-100 px-4 py-3.5 dark:border-white/6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-orange-500 to-rose-500 text-white">
          <Store size={15} />
        </span>
        <h3 className="font-bold text-foreground">All Tip Stores</h3>
      </div>
      <ul className="max-h-115 space-y-0.5 overflow-y-auto p-2">
        {stores.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/tip-store/${s.slug}`}
              className="group flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-stone-50 hover:text-foreground dark:hover:bg-white/5"
            >
              <span>{s.title}</span>
              <ChevronRight
                size={15}
                className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-orange-500"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Unlock panel (gated markets) ──────────────────────── */

function UnlockPanel({ label, tier }: { label: string; tier: TipTier }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-stone-200 bg-white py-12 text-center dark:border-white/8 dark:bg-[#18181b]">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-white">
        <Lock size={20} />
      </span>
      <h3 className="text-lg font-bold text-foreground">Unlock {label} tips</h3>
      <p className="mx-auto max-w-md px-4 text-sm text-muted">
        {label} predictions are part of the {tier} plan. Subscribe to view
        today&apos;s expert selections.
      </p>
      <Link
        href="/our-plans"
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
      >
        View Plans
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

/* ── Prediction table ──────────────────────────────────── */

function PredictionTable({ rows }: { rows: BoardRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-stone-200 bg-white py-12 text-center text-base font-medium text-muted dark:border-white/8 dark:bg-[#18181b]">
        Sorry, tips aren&apos;t available for this date. Please check back
        later.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70 text-left text-[11px] uppercase tracking-wide text-subtle dark:border-white/6 dark:bg-white/5">
              <th className="px-4 py-3 text-center font-semibold">League</th>
              <th className="px-4 py-3 font-semibold">Match</th>
              <th className="px-4 py-3 font-semibold">Tip</th>
              <th className="px-4 py-3 text-right font-semibold">Odds</th>
              <th className="px-4 py-3 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50 dark:divide-white/5">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-stone-50/70 dark:hover:bg-white/5"
              >
                <td className="px-4 py-3 text-center align-middle">
                  <LeagueBadge league={row.league} />
                </td>
                <td className="px-4 py-3 align-middle">
                  <p className="font-semibold leading-snug text-foreground">
                    {row.name}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {formatDayMonth(row.date)}
                    {row.time ? ` · ${row.time}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {row.tip || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-stone-800 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-700">
                    {row.odds || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                  <span className="inline-flex items-center rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white dark:bg-emerald-700">
                    {row.ftscore || "?-?"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
