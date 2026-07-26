/** Emphasized page-level h2 — a colored accent bar visually separates each
 *  major section, shared across the Best Betting Sites hub + country pages. */
export function PageSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 text-xl font-black tracking-tight text-foreground">
      <span className="h-6 w-1.5 shrink-0 rounded-full bg-linear-to-b from-brand-start to-brand-end" />
      {children}
    </h2>
  );
}
