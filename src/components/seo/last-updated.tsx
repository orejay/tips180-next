/**
 * Visible "Last updated" timestamp. Google AI Overviews cite recently-updated
 * pages markedly more often, and it reinforces freshness for daily predictions.
 * Pass a date (defaults to now — valid because these pages render on ISR).
 */
export function LastUpdated({ date = new Date() }: { date?: Date }) {
  const formatted = date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <p className="text-xs text-subtle">
      Last updated:{" "}
      <time dateTime={date.toISOString()} className="font-medium text-muted">
        {formatted}
      </time>
    </p>
  );
}
