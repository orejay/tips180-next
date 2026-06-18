import type { Metadata } from "next";
import Link from "next/link";
import { plans, type Plan } from "@/config/plans";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Our Plans — Football Prediction Subscriptions | Tips180",
  description:
    "Compare Tips180 subscription plans: Key, Premium, Smart Bet, Rollover, 50 Odds and Weekend 10. Tailored football prediction packages for every betting style.",
  alternates: { canonical: "/our-plans" },
};

const faqs = [
  {
    question: "Which Tips180 plan is best for me?",
    answer:
      "Choose Key or Premium for the widest coverage including league tips and Experts ACCA. Smart Bet, Rollover, 50 Odds and Weekend 10 are specialist plans tuned to a specific staking strategy.",
  },
  {
    question: "How much do Tips180 predictions cost?",
    answer:
      "Plans start from ₦2,500. Each plan offers several durations (from one week to twelve months) at the prices shown on this page; local pricing is available for other countries.",
  },
  {
    question: "How do I activate a plan?",
    answer:
      "Sign up for a free account, choose a plan and duration, and pay via card or a supported local method. Your account upgrades automatically once payment is confirmed.",
  },
];

export default function OurPlansPage() {
  return (
    <div className="bg-background">
      <JsonLd data={faqSchema(faqs)} />
      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="mx-auto text-xl font-bold lg:text-4xl">Our Plans</h1>
        <p className="mt-2 text-xs lg:text-base">
          There&apos;s a plan tailored for everyone!
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} />
        ))}
      </div>

      <p className="mx-auto max-w-3xl px-4 text-center text-sm text-muted">
        Prices shown in Nigerian Naira (₦). Pricing for other countries and
        secure checkout are available after sign-up.
      </p>

      <section className="mx-auto w-full max-w-3xl px-4 py-12">
        <h2 className="mb-4 text-xl font-bold text-foreground">Plans — FAQ</h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-lg bg-surface p-5 shadow-sm">
              <dt className="font-semibold text-foreground">{faq.question}</dt>
              <dd className="mt-1 text-muted">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const from = plan.prices[0];

  return (
    <div className="flex flex-col rounded-xl bg-surface p-6 shadow-sm ring-1 ring-border">
      <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted">
        from{" "}
        <span className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-lg font-bold text-transparent">
          {from.label}
        </span>
      </p>

      <p className="mt-3 text-xs font-medium tracking-wide text-subtle uppercase">
        Durations
      </p>
      <p className="text-sm text-muted">{plan.durations.join(" · ")}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/auth/signup"
        className="mt-6 rounded-md bg-linear-to-r from-brand-start to-brand-end py-2.5 text-center font-medium text-white transition-opacity hover:opacity-90"
      >
        Get Started
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-teal-500"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
