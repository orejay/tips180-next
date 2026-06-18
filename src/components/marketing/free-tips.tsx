import { getFreeExperts, formatDayMonth } from "@/lib/predictions";
import { LastUpdated } from "@/components/seo/last-updated";

/**
 * "Free Football Predictions Today" — the highest-value SEO section. Server
 * Component fetching the public `/free-experts` feed so the tips render in HTML.
 */
export async function FreeTips() {
  const tips = await getFreeExperts();
  if (tips.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
          Free Football Predictions Today
        </h2>
        <LastUpdated />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">League</th>
              <th className="px-3 py-3 font-medium">Match</th>
              <th className="px-3 py-3 font-medium">Tip</th>
              <th className="px-3 py-3 font-medium">Odds</th>
            </tr>
          </thead>
          <tbody>
            {tips.map((tip, i) => (
              <tr key={tip.id} className={i % 2 === 0 ? "bg-surface-muted" : "bg-surface"}>
                <td className="px-3 py-3 whitespace-nowrap text-muted">
                  {formatDayMonth(tip.date)}
                </td>
                <td className="px-3 py-3 text-muted">{tip.league}</td>
                <td className="px-3 py-3 font-medium text-foreground">{tip.name}</td>
                <td className="px-3 py-3">
                  <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                    {tip.fttip || tip.upcoming_tip || "—"}
                  </span>
                </td>
                <td className="px-3 py-3 text-foreground">{tip.ft_odds || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
