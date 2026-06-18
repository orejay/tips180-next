import {
  formatDayMonth,
  getRecentWins,
  getUpcomingMatches,
  type CardMatch,
} from "@/lib/predictions";
import { PredictionTabs } from "@/components/marketing/prediction-tabs";

/** Brand-ish badge colours for the most-recognised leagues; others fall back. */
const LEAGUE_COLORS: Record<string, string> = {
  EPL: "#38003C",
  "LA LIGA": "#E00C1A",
  ITA: "#024494",
  FRA: "#1d4ed8",
};

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
      <h2 className="mb-6 text-2xl font-bold text-foreground lg:text-3xl">
        Football Predictions &amp; Winning Tips
      </h2>
      <PredictionTabs
        recent={<RecentWinsTable rows={recent} />}
        upcoming={<UpcomingTable rows={upcoming} />}
      />
    </section>
  );
}

function LeagueBadge({ league }: { league: string }) {
  const bg = LEAGUE_COLORS[league?.toUpperCase()] ?? "#0f766e";
  return (
    <span
      className="inline-block rounded px-2 py-1 text-xs font-medium text-white"
      style={{ backgroundColor: bg }}
    >
      {league}
    </span>
  );
}

function Tip({ value }: { value: string | null }) {
  return (
    <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-white">
      {value || "—"}
    </span>
  );
}

function EmptyState() {
  return (
    <p className="py-10 text-center text-lg font-medium text-muted">
      Please check back later!
    </p>
  );
}

function RecentWinsTable({ rows }: { rows: CardMatch[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="text-muted">
            <th className="px-3 py-3 font-medium">League</th>
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 text-left font-medium">Match</th>
            <th className="px-3 py-3 font-medium">Tip</th>
            <th className="px-3 py-3 font-medium">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? "bg-surface-muted" : "bg-surface"}>
              <td className="px-3 py-3">
                <LeagueBadge league={row.league} />
              </td>
              <td className="px-3 py-3 whitespace-nowrap text-muted">
                {formatDayMonth(row.date)}
              </td>
              <td className="px-3 py-3 text-left font-medium text-foreground">
                {row.name}
              </td>
              <td className="px-3 py-3">
                <Tip value={row.fttip} />
              </td>
              <td className="px-3 py-3 font-medium text-foreground">
                {row.ftscore || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UpcomingTable({ rows }: { rows: CardMatch[] }) {
  if (rows.length === 0) return <EmptyState />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="text-muted">
            <th className="px-3 py-3 font-medium">Date</th>
            <th className="px-3 py-3 font-medium">League</th>
            <th className="px-3 py-3 text-left font-medium">Match</th>
            <th className="px-3 py-3 font-medium">Tip</th>
            <th className="px-3 py-3 font-medium">Odds</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className={i % 2 === 0 ? "bg-surface-muted" : "bg-surface"}>
              <td className="px-3 py-3 whitespace-nowrap text-muted">
                {formatDayMonth(row.date)}
              </td>
              <td className="px-3 py-3">
                <LeagueBadge league={row.league} />
              </td>
              <td className="px-3 py-3 text-left font-medium text-foreground">
                {row.name}
              </td>
              <td className="px-3 py-3">
                <Tip value={row.fttip} />
              </td>
              <td className="px-3 py-3 font-medium text-foreground">
                {row.ft_odds || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
