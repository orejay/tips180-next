import Link from "next/link";
import { PlansPricing } from "@/components/marketing/plans-pricing";

/**
 * Plans showcase on the home page (legacy LandingPlans). Reuses the same
 * geo-priced grid as /our-plans (country selector + IP-detected currency)
 * instead of a static NGN-only card list, so pricing here matches the full
 * plans page instead of drifting out of sync with it.
 */
export function LandingPlans() {
  return (
    <section className="bg-background py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-2 text-center text-2xl font-bold text-foreground lg:text-3xl">
          Our Plans
        </h2>
        <p className="mb-2 text-center text-muted">There&apos;s a plan tailored for everyone.</p>
      </div>

      <PlansPricing />

      <div className="mt-2 text-center">
        <Link
          href="/our-plans"
          className="text-sm font-semibold text-primary hover:underline"
        >
          See full plan details →
        </Link>
      </div>
    </section>
  );
}
