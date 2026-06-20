import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";
import { PlansPricing } from "@/components/marketing/plans-pricing";

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

      <PlansPricing />

      <section className="mx-auto w-full max-w-3xl px-4 pb-12">
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
