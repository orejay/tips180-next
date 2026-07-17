import {
  formatDayMonth,
  getRecentWins,
  getUpcomingMatches,
  type CardMatch,
} from "@/lib/predictions";
import { PredictionTabs } from "@/components/marketing/prediction-tabs";
import { BookingCode } from "@/components/marketing/booking-code";
import { TipsterBadge } from "@/components/marketing/tipster-badge";
import { LeagueBadge } from "@/components/marketing/league-badge";
import { cn } from "@/lib/utils";

/** Row height beyond which Recent Winning Tips scrolls instead of growing the page. */
const RECENT_TIPS_VISIBLE_ROWS = 10;

/**
 * Home prediction tables (Recent Winning Tips + Upcoming Tips). Server Component:
 * both data sets are fetched and rendered server-side so predictions ship in the
 * initial HTML; the {@link PredictionTabs} client leaf only toggles visibility.
 */
export async function HomePredictions() {
  const [recent, upcoming] = await Promise.all([
    getRecentWins(),
    getUpcomingMatches(),
  ]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <h2 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">
        Football Predictions &amp; Winning Tips
      </h2>
      <p className="mb-6 text-sm text-muted">
        Our latest winning results and the next tips going live.
      </p>
      <BookingCode category="upcoming" />
      <PredictionTabs
        recent={<PredictionTable rows={recent} variant="recent" />}
        upcoming={<PredictionTable rows={upcoming} variant="upcoming" />}
        recentTipster={<TipsterBadge category="recent-win" />}
        upcomingTipster={<TipsterBadge category="upcoming" />}
      />
    </section>
  );
}

function EmptyState() {
  return (
    <p className="rounded-2xl border border-stone-200 bg-white py-12 text-center text-base font-medium text-muted dark:border-white/8 dark:bg-[#18181b]">
      Please check back later!
    </p>
  );
}

/**
 * Shared modern table. `recent` shows the winning score with a WON badge;
 * `upcoming` shows the match odds instead.
 */
function PredictionTable({
  rows,
  variant,
}: {
  rows: CardMatch[];
  variant: "recent" | "upcoming";
}) {
  if (rows.length === 0) return <EmptyState />;

  const isRecent = variant === "recent";
  const lastHeading = isRecent ? "Result" : "Odds";
  const scrollable = isRecent && rows.length > RECENT_TIPS_VISIBLE_ROWS;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <div
        className={cn(
          "overflow-x-auto",
          scrollable && "max-h-120 overflow-y-auto lg:max-h-none lg:overflow-y-visible",
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/70 text-left text-[11px] uppercase tracking-wide text-subtle dark:border-white/6 dark:bg-white/5 sticky top-0">
              <th className="px-4 py-3 text-center font-semibold">League</th>
              <th className="px-4 py-3 font-semibold">Match</th>
              <th className="px-4 py-3 font-semibold">Tip</th>
              <th className="px-4 py-3 text-right font-semibold">{lastHeading}</th>
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
                  <p className="font-semibold leading-snug text-foreground">{row.name}</p>
                  <p className="mt-0.5 text-xs text-subtle">
                    {formatDayMonth(row.date)}
                    {row.time ? ` · ${row.time}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {row.fttip || row.upcoming_tip || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                  {isRecent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold text-success">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" />
                      {row.ftscore || "WON"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-stone-800 px-2.5 py-1 text-xs font-bold text-white dark:bg-zinc-700">
                      {row.ft_odds || "—"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
