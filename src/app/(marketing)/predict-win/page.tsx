import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { FaqAccordion } from "@/components/ui/faq-accordion";

export const metadata: Metadata = {
  title: "Predict & Win — Free Football Prediction Game | Tips180",
  description:
    "Play Tips180 Predict & Win: forecast the outcomes of a set of fixtures each round, score points for correct calls and win prizes. Free to enter.",
  alternates: { canonical: "/predict-win" },
};

const steps = [
  "Each round, our experts publish a set of fixtures to predict.",
  "Submit your predicted outcomes before the round closes.",
  "Score points for every correct call.",
  "The top predictors each round win prizes.",
];

const faqs = [
  {
    question: "What is Tips180 Predict & Win?",
    answer:
      "Predict & Win is a free football prediction game where you forecast the outcomes of a set of fixtures each round and earn points for correct predictions, competing for prizes.",
    icon: "Gamepad2",
  },
  {
    question: "Is Predict & Win free to play?",
    answer:
      "Yes. Predict & Win is free to enter — create a Tips180 account, open the current round and submit your predictions before it closes.",
    icon: "Star",
  },
  {
    question: "How do I win?",
    answer:
      "You score points for each correct prediction in a round. The players with the most points top the leaderboard and win the round's prizes.",
    icon: "Trophy",
  },
];

export default function PredictWinPage() {
  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Predict & Win", url: `${siteConfig.url}/predict-win` },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">Predict &amp; Win</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Forecast the fixtures, score points, win prizes — free to play.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <h2 className="mb-4 text-xl font-bold text-foreground">How it works</h2>
        <ol className="space-y-3">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="my-8 flex flex-wrap gap-3">
          <Link
            href="/auth/signup"
            className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            Sign Up to Play
          </Link>
          <Link
            href="/dashboard/pw"
            className="rounded-md border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Go to Predict &amp; Win
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="mb-5 text-xl font-bold text-foreground">Predict &amp; Win — FAQ</h2>
          <FaqAccordion items={faqs} />
        </section>
      </div>
    </div>
  );
}
