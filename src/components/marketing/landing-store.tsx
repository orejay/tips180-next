import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import { tipCategories } from "@/config/tip-store";

/**
 * Full Tips Store directory + Experts ACCA promo. Anchored as `#all-stores` so
 * the "View More Stores" link in the predictions rail scrolls here. Lists every
 * tip-store category (legacy LandingStore showed only a subset).
 */
export function LandingStore() {
  return (
    <section
      id="all-stores"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-10"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* All tip stores */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-[#18181b] lg:w-3/5">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-rose-500 text-white">
              <Store size={17} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">Tips Store</h2>
              <p className="text-xs text-subtle">Browse every prediction market</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {tipCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tip-store/${cat.slug}`}
                className="group flex items-center justify-between gap-1 rounded-xl border border-stone-100 bg-stone-50/60 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 dark:border-white/6 dark:bg-white/5 dark:hover:border-orange-500/30 dark:hover:bg-orange-950/30 dark:hover:text-orange-300"
              >
                <span className="truncate">{cat.title}</span>
                <ArrowRight
                  size={13}
                  className="shrink-0 text-subtle opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-orange-500"
                />
              </Link>
            ))}
          </div>
        </div>

        {/* Experts ACCA promo */}
        <div className="flex flex-col justify-center rounded-2xl bg-linear-to-br from-teal-500 to-blue-600 p-6 text-white shadow-sm lg:w-2/5">
          <p className="text-2xl font-bold">Experts ACCA</p>
          <p className="mt-2 text-sm text-white/80">
            Confused about making the right selections? Let our experts guide you to
            victory with their best football tips of the day.
          </p>
          <Link
            href="/dashboard/acca"
            className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-teal-700 transition-transform hover:-translate-y-0.5"
          >
            Get the best 5–10 odds
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
