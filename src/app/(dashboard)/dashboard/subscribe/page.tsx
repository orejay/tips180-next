import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "How to Subscribe" };

const steps = [
  {
    title: "1. Choose a plan",
    body: "Browse Our Plans and pick the package that suits your betting style — Key, Premium, Smart Bet, Rollover, 50 Odds or Weekend 10.",
  },
  {
    title: "2. Make a payment",
    body: "Head to Make Payment and complete checkout with your preferred method. Pricing is shown in your local currency where supported.",
  },
  {
    title: "3. Your account upgrades automatically",
    body: "Once payment is confirmed, your account plan and subscription status update right away — your tips unlock immediately.",
  },
  {
    title: "4. Start winning",
    body: "Open the plan you subscribed to from the sidebar to view today's expert predictions, odds and accumulators.",
  },
];

export default function SubscribePage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">How to Subscribe</h1>

      <ol className="space-y-4">
        {steps.map((step) => (
          <li key={step.title} className="rounded-lg border border-border p-5">
            <h2 className="font-semibold text-foreground">{step.title}</h2>
            <p className="mt-1 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/our-plans"
          className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
        >
          View Plans
        </Link>
        <Link
          href="/dashboard/payment"
          className="rounded-md border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          Make Payment
        </Link>
      </div>
    </div>
  );
}
