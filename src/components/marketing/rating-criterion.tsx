/** A single "how we rate" methodology card — shared by the Best Betting Sites
 *  hub page and each country page. */
export function RatingCriterion({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg bg-surface p-4 shadow-sm">
      <p className="font-bold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
