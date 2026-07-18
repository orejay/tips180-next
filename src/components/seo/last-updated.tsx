import { cache } from "react";

// Memoized per request: a Suspense boundary elsewhere on the page (e.g. a
// client component reading searchParams) can cause the server tree around it
// to render more than once for the same request. `new Date()` as a bare
// default would return a different value each time, which then mismatches
// between the initial HTML and the hydration pass — cache() keeps it stable.
const getNow = cache(() => new Date());

/**
 * Visible "Last updated" timestamp. Google AI Overviews cite recently-updated
 * pages markedly more often, and it reinforces freshness for daily predictions.
 * Pass a date (defaults to now — valid because these pages render on ISR).
 */
export function LastUpdated({ date = getNow() }: { date?: Date }) {
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
