import type { Metadata } from "next";
import Link from "next/link";
import { ListChecks, CreditCard, Sparkles, Trophy, Globe, ArrowUpRight } from "lucide-react";
import { ManualPayments } from "@/components/payment/manual-payments";

export const metadata: Metadata = { title: "How to Subscribe" };

const steps = [
  {
    Icon: ListChecks,
    title: "Choose a plan",
    body: "Browse Our Plans and pick the package that suits your betting style — Key, Premium, Smart Bet, Rollover, 50 Odds or Weekend 10.",
  },
  {
    Icon: CreditCard,
    title: "Make a payment",
    body: "Head to Make Payment and check out with card (Paystack / Flutterwave) or a local mobile-money method. Prices are shown in your local currency where supported.",
  },
  {
    Icon: Sparkles,
    title: "Your account upgrades automatically",
    body: "Once payment is confirmed, your plan and subscription status update right away — your tips unlock immediately.",
  },
  {
    Icon: Trophy,
    title: "Start winning",
    body: "Open the plan you subscribed to from the sidebar to view today's expert predictions, odds and accumulators.",
  },
];

export default function SubscribePage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-foreground">How to Subscribe</h1>
        <p className="mt-1 text-muted">
          Four quick steps to unlock your tips — plus every local payment method we support.
        </p>
      </header>

      {/* Steps */}
      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#18181b]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
                <step.Icon size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-subtle">
                  Step {i + 1}
                </p>
                <h2 className="font-semibold text-foreground">{step.title}</h2>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {/* Local pricing callout */}
      <div className="flex flex-col gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-800/40 dark:bg-teal-900/15 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-teal-600 dark:text-teal-400">
            <Globe size={18} />
          </span>
          <div>
            <p className="font-semibold text-foreground">Local pricing in your currency</p>
            <p className="text-sm text-muted">
              We show prices in NGN, GHS, KES, UGX, ZAR, XOF, SLL and USD based on your country.
            </p>
          </div>
        </div>
        <Link
          href="/our-plans"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Compare plans
          <ArrowUpRight size={15} />
        </Link>
      </div>

      {/* Per-country payment details */}
      <ManualPayments />

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/our-plans"
          className="rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
        >
          View Plans
        </Link>
        <Link
          href="/dashboard/payment"
          className="rounded-xl border border-stone-200 px-6 py-2.5 font-medium text-foreground transition-colors hover:border-teal-500 hover:text-teal-600 dark:border-white/8 dark:hover:text-teal-400"
        >
          Make Payment
        </Link>
      </div>
    </div>
  );
}
