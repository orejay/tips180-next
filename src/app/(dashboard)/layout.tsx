import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { authFetch, getCurrentUser } from "@/lib/api-auth";

/** Private area — keep it out of search indexes (robots also disallows it). */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The proxy already gates /dashboard, but confirm the token is still valid and
  // load the user so the chrome can greet them.
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard");

  const messages = await authFetch<{ unread?: unknown[] }>("messages");
  const unread = messages?.unread?.length ?? 0;

  return (
    <main className="min-h-screen bg-background py-6 lg:py-10">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-xl bg-surface shadow-sm lg:flex">
        <aside className="lg:w-1/4">
          <DashboardSidebar unread={unread} />
        </aside>

        <div className="lg:w-3/4">
          <header className="flex items-center justify-between border-b border-border px-6 py-4">
            <p className="text-sm text-muted">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">{user.name}</span>
            </p>
            <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
              {user.accoutplan} Plan
            </span>
          </header>
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
