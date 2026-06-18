/**
 * Layout for public, SEO-facing marketing pages (home, leagues, plans, legal).
 * The site header + footer live in the root layout (so every page has them);
 * this layout just wraps the page content. Server Components by default.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1">{children}</main>;
}
