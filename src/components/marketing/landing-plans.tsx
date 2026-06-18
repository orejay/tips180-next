import Link from "next/link";
import { plans } from "@/config/plans";

/** Plans showcase on the home page (legacy LandingPlans). */
export function LandingPlans() {
  return (
    <section className="bg-background py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">Our Plans</h2>
        <p className="mb-6 text-muted">There&apos;s a plan tailored for everyone.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.slug} className="flex flex-col rounded-xl bg-surface p-5 shadow-sm ring-1 ring-border">
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted">
                from{" "}
                <span className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text font-bold text-transparent">
                  {plan.prices[0].label}
                </span>
              </p>
              <ul className="mt-3 flex-1 space-y-1 text-sm text-muted">
                {plan.features.slice(0, 3).map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link
                href="/our-plans"
                className="mt-4 rounded-md bg-linear-to-r from-brand-start to-brand-end py-2 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Subscribe
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
