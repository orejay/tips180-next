/** A normalised prediction row used across all plan pages. */
export type TipRow = {
  id: string | number;
  date?: string;
  league?: string;
  name: string;
  tip?: string;
  odds?: string;
  score?: string;
};

/**
 * Generic tips table for the dashboard plan pages. Columns auto-hide when no row
 * provides that field, so it works for plans with/without odds or scores.
 */
export function TipsTable({ rows }: { rows: TipRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-border py-10 text-center text-muted">
        No tips available right now. Please check back later.
      </p>
    );
  }

  const showOdds = rows.some((r) => r.odds);
  const showScore = rows.some((r) => r.score);
  const showLeague = rows.some((r) => r.league);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-3 py-3 font-medium">Date</th>
            {showLeague && <th className="px-3 py-3 font-medium">League</th>}
            <th className="px-3 py-3 font-medium">Match</th>
            <th className="px-3 py-3 font-medium">Tip</th>
            {showOdds && <th className="px-3 py-3 font-medium">Odds</th>}
            {showScore && <th className="px-3 py-3 font-medium">Score</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-border last:border-0">
              <td className="px-3 py-3 whitespace-nowrap text-muted">{row.date || "—"}</td>
              {showLeague && <td className="px-3 py-3 text-muted">{row.league || "—"}</td>}
              <td className="px-3 py-3 font-medium text-foreground">{row.name}</td>
              <td className="px-3 py-3">
                <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                  {row.tip || "—"}
                </span>
              </td>
              {showOdds && <td className="px-3 py-3 text-foreground">{row.odds || "—"}</td>}
              {showScore && <td className="px-3 py-3 text-foreground">{row.score || "—"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
