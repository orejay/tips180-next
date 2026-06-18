/**
 * Layout for public, SEO-facing marketing pages (home, leagues, plans, legal).
 * Site header and footer will be mounted here as they are ported. Pages in this
 * group are Server Components by default for SSR/ISR crawlability.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1">{children}</main>;
}
