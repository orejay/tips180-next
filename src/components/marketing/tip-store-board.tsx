"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, ChevronRight, FileText, Percent } from "lucide-react";
import type { StoreTipRow } from "@/lib/tip-store";
import { cn } from "@/lib/utils";
import { LeagueBadge } from "@/components/marketing/league-badge";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Local YYYY-MM-DD (avoids the UTC shift of toISOString). */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(base.getDate() + n);
  return d;
}

/**
 * Per-page tip-store board with the legacy 5-day date filter (−2…+2, today
 * selected) and modern table. Client leaf so the day selection is interactive;
 * the initial (today's) rows are server-rendered for SEO. Weekend Tips skip the
 * filter and show every row, mirroring the legacy StoreTable behaviour.
 */
export function TipStoreBoard({
  rows,
  dateFilter = true,
}: {
  rows: StoreTipRow[];
  dateFilter?: boolean;
}) {
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState(() => toDateString(today));

  const days = useMemo(
    () => [-2, -1, 0, 1, 2].map((n) => addDays(today, n)),
    [today],
  );

  const visible = dateFilter ? rows.filter((r) => r.date === selected) : rows;

  const showOdds = visible.some((r) => r.odds);
  const showHt = visible.some((r) => r.htscore);

  return (
    <div>
      {dateFilter && (
        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {days.map((d) => {
            const value = toDateString(d);
            const isToday = value === toDateString(today);
            const active = value === selected;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                className={cn(
                  "flex min-w-17 flex-col items-center rounded-xl border px-3 py-2 text-center transition-all",
                  active
                    ? "border-transparent bg-linear-to-r from-teal-500 to-blue-600 text-white shadow-sm"
                    : "border-stone-200 bg-white text-foreground hover:border-primary/40 hover:bg-stone-50 dark:border-white/8 dark:bg-[#18181b] dark:hover:bg-white/5",
                )}
              >
                <span className="text-[11px] font-bold uppercase tracking-wide">
                  {isToday ? "Today" : DAY_LABELS[d.getDay()]}
                </span>
                <span className={cn("text-xs", active ? "text-white/85" : "text-subtle")}>
                  {d.getDate()} {MONTH_LABELS[d.getMonth()]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <PredictionTable rows={visible} showOdds={showOdds} showHt={showHt} />
    </div>
  );
}

function PredictionTable({
  rows,
  showOdds,
  showHt,
}: {
  rows: StoreTipRow[];
  showOdds: boolean;
  showHt: boolean;
}) {
  const router = useRouter();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-stone-200 bg-white py-14 text-center dark:border-white/8 dark:bg-[#18181b]">
        <CalendarDays size={28} className="text-subtle" />
        <p className="text-base font-medium text-muted">
          Sorry, tips aren&apos;t available for this date.
        </p>
        <p className="text-sm text-subtle">Please check back later.</p>
      </div>
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
              {showOdds && <th className="px-4 py-3 font-semibold">Odds</th>}
              {showHt && <th className="px-4 py-3 font-semibold">HT</th>}
              <th className="px-4 py-3 text-right font-semibold">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50 dark:divide-white/5">
            {rows.map((row) => {
              const detailsHref = row.analysis || row.percentage != null
                ? `/tip-store/trendymatches/${row.id}`
                : null;
              return (
                <tr
                  key={row.id}
                  onClick={detailsHref ? () => router.push(detailsHref) : undefined}
                  className={cn(
                    "transition-colors hover:bg-stone-50/70 dark:hover:bg-white/5",
                    detailsHref && "cursor-pointer",
                  )}
                >
                  <td className="px-4 py-3 text-center align-middle">
                    <LeagueBadge league={row.league} />
                  </td>
                  <td className="px-4 py-3 align-middle">
                    {detailsHref ? (
                      <Link href={detailsHref} className="font-semibold leading-snug text-foreground hover:underline">
                        {row.name}
                      </Link>
                    ) : (
                      <p className="font-semibold leading-snug text-foreground">{row.name}</p>
                    )}
                    {row.time && <p className="mt-0.5 text-xs text-subtle">{row.time}</p>}
                    {row.analysis && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <FileText size={11} className="shrink-0" />
                        View Analysis
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {row.tip || "—"}
                    </span>
                    {row.percentage != null && (
                      <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <Percent size={11} className="shrink-0" />
                        View Percentage
                      </span>
                    )}
                  </td>
                  {showOdds && (
                    <td className="px-4 py-3 align-middle font-semibold text-foreground">
                      {row.odds || "—"}
                    </td>
                  )}
                  {showHt && (
                    <td className="px-4 py-3 align-middle text-muted">{row.htscore || "—"}</td>
                  )}
                  <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {row.ftscore ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                          <span className="h-1.5 w-1.5 rounded-full bg-success" />
                          {row.ftscore}
                        </span>
                      ) : (
                        <span className="text-xs text-subtle">—</span>
                      )}
                      {detailsHref && (
                        <ChevronRight size={16} className="shrink-0 text-subtle" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
