import Link from "next/link";
import { tipCategories } from "@/config/tip-store";

/** Tips Store + Experts ACCA promo split panel (legacy LandingStore). */
export function LandingStore() {
  const featured = tipCategories.slice(0, 10);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col px-4 py-8 lg:flex-row lg:gap-4">
      <div className="rounded-xl bg-teal-50 dark:bg-surface-muted p-6 lg:w-1/2">
        <h2 className="mb-4 text-xl font-bold text-foreground md:text-2xl">Tips Store</h2>
        <div className="flex flex-wrap gap-2">
          {featured.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tip-store/${cat.slug}`}
              className="rounded-md bg-surface px-3 py-1.5 text-sm font-medium text-foreground shadow-sm hover:text-primary"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-indigo-50 dark:bg-surface-muted p-6 lg:mt-0 lg:w-1/2">
        <p className="text-2xl font-bold text-primary">Experts ACCA</p>
        <p className="mt-2 max-w-[80%] text-sm text-muted">
          Confused about making the right selections? Let our experts guide you to
          victory with their best football tips of the day.
        </p>
        <Link
          href="/dashboard/acca"
          className="mt-4 inline-block rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Get the best 5–10 odds of Experts Tips
        </Link>
      </div>
    </section>
  );
}
