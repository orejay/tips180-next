import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/api-auth";
import { storeCategories, canAccessStore } from "@/config/store-categories";

export const metadata: Metadata = { title: "My Store" };

export default async function StorePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/store");

  const unlocked = storeCategories.filter((cat) => canAccessStore(cat.tier, user));
  const lockedCount = storeCategories.length - unlocked.length;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">My Store</h1>
      <p className="mb-6 text-sm text-muted">
        The tip stores included with your{" "}
        <span className="font-semibold text-foreground">{user.accoutplan}</span> plan.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {unlocked.map((cat) => (
          <Link
            key={cat.name}
            href={cat.href}
            className="flex items-center justify-center rounded-xl border border-stone-200 px-3 py-6 text-center text-sm font-medium text-foreground shadow-sm transition-colors hover:border-teal-500 hover:bg-linear-to-r hover:from-teal-500 hover:to-blue-600 hover:text-white dark:border-white/8 dark:bg-[#18181b]"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {lockedCount > 0 && (
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800/40 dark:bg-teal-900/15 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{lockedCount} more</span>{" "}
            {lockedCount === 1 ? "store is" : "stores are"} available on a higher plan.
          </p>
          <Link
            href="/dashboard/payment"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Upgrade plan
            <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
