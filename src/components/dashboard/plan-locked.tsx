import Link from "next/link";

/** Upsell shown when the user's subscription for a plan is inactive. */
export function PlanLocked({ plan }: { plan: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-muted p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-primary-soft text-primary">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-foreground">Unlock {plan}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">
        Subscribe to the {plan} plan to view today&apos;s expert predictions, odds
        and accumulators.
      </p>
      <Link
        href="/dashboard/payment"
        className="mt-5 inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
      >
        Subscribe Now
      </Link>
    </div>
  );
}
