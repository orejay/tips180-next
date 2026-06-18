/**
 * Layout for the authenticated user dashboard (predictions, profile, payments).
 *
 * Auth gating belongs here via middleware/session checks once auth is ported.
 * Dashboard pages are private and excluded from indexing in robots.ts.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1">{children}</main>;
}
