/** A single "how we rate" methodology card — shared by the Best Betting Sites
 *  hub page and each country page. `id` is optional, for cards that need to be
 *  a same-page link target (e.g. an inline "mobile performance" reference). */
export function RatingCriterion({ title, body, id }: { title: string; body: string; id?: string }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-lg bg-surface p-4 shadow-sm">
      <p className="font-bold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
    </div>
  );
}
