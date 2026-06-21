import Link from "next/link";
import { plans } from "@/config/plans";
import { PlanCard } from "@/components/marketing/plans-pricing";

/** Plans showcase on the home page (legacy LandingPlans). Same card design as /our-plans. */
export function LandingPlans() {
  return (
    <section className="bg-background py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-2 text-2xl font-bold text-foreground lg:text-3xl">Our Plans</h2>
        <p className="mb-8 text-muted">There&apos;s a plan tailored for everyone.</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <PlanCard key={plan.slug} plan={plan} idx={idx} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/our-plans"
            className="text-sm font-semibold text-primary hover:underline"
          >
            See full plan details →
          </Link>
        </div>
      </div>
    </section>
  );
}
