import type { Metadata } from "next";
import { TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";
import { PlansPricing } from "@/components/marketing/plans-pricing";
import { FaqAccordion } from "@/components/ui/faq-accordion";

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
    icon: "HelpCircle",
  },
  {
    question: "How much do Tips180 predictions cost?",
    answer:
      "Plans start from ₦2,500. Each plan offers several durations (from one week to twelve months) at the prices shown on this page; local pricing is available for other countries.",
    icon: "CreditCard",
  },
  {
    question: "How do I activate a plan?",
    answer:
      "Sign up for a free account, choose a plan and duration, and pay via card or a supported local method. Your account upgrades automatically once payment is confirmed.",
    icon: "Rocket",
  },
];

const HERO_FEATURES = [
  { Icon: TrendingUp, text: "Daily expert predictions" },
  { Icon: ShieldCheck, text: "All premium categories" },
  { Icon: Zap, text: "Betting codes included" },
];

export default function OurPlansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-zinc-950 dark:to-black transition-colors duration-300">
      <JsonLd data={faqSchema(faqs)} />

      {/* Hero */}
      <div className="relative overflow-hidden px-4 pb-16 pt-24">
        {/* Ambient blobs */}
        <div className="hero-blob pointer-events-none absolute left-1/4 top-10 h-72 w-72 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />
        <div
          className="hero-blob pointer-events-none absolute right-1/4 top-20 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="hero-blob pointer-events-none absolute bottom-0 left-1/2 h-48 w-96 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-900/15"
          style={{ animationDelay: "3s" }}
        />

        <div className="relative mx-auto max-w-3xl space-y-6 text-center">
          {/* Badge */}
          <div className="hero-fade-in inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Zap size={12} /> Premium Predictions
          </div>

          {/* Title */}
          <h1 className="hero-fade-in text-5xl font-black leading-[1.05] tracking-tight text-foreground lg:text-6xl" style={{ animationDelay: "0.1s" }}>
            Pick your{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
                winning
              </span>
              <span className="absolute bottom-1 left-0 right-0 z-0 h-3 rounded bg-teal-100 dark:bg-teal-900/30" />
            </span>{" "}
            plan
          </h1>

          <p className="hero-fade-in text-lg leading-relaxed text-muted" style={{ animationDelay: "0.2s" }}>
            Expert football predictions, exclusive betting codes and daily tips
            tailored to every budget and staking style.
          </p>

          {/* Feature pills */}
          <div className="hero-fade-in flex flex-wrap justify-center gap-3" style={{ animationDelay: "0.3s" }}>
            {HERO_FEATURES.map(({ Icon, text }) => (
              <div
                key={text}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted shadow-sm dark:border-white/10 dark:bg-[#18181b]"
              >
                <span className="text-teal-500"><Icon size={15} /></span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan cards */}
      <PlansPricing />

      {/* FAQ */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16">
        <h2 className="mb-5 text-xl font-bold text-foreground">Plans — FAQ</h2>
        <FaqAccordion items={faqs} />
      </section>

      {/* Bottom trust strip */}
      <div className="border-t border-border bg-surface px-4 py-8 dark:border-white/8 dark:bg-zinc-950">
        <p className="text-center text-sm text-subtle">
          Need help?{" "}
          <a href="/contact-us" className="font-medium text-teal-600 hover:underline dark:text-teal-400">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
