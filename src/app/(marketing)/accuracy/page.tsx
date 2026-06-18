import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { LastUpdated } from "@/components/seo/last-updated";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { getRecentWins, formatDayMonth } from "@/lib/predictions";

export const metadata: Metadata = {
  title: "Prediction Accuracy — Verified Winning Tips | Tips180",
  description:
    "A transparent, verifiable record of recent Tips180 winning football predictions — the match, our tip and the final result. Updated daily.",
  alternates: { canonical: "/accuracy" },
};

const faqs = [
  {
    question: "How accurate are Tips180 football predictions?",
    answer:
      "Tips180 publishes a transparent record of recent winning tips showing the match, the prediction we made and the verified final result, so accuracy can be checked rather than just claimed.",
  },
  {
    question: "Are these winning tips verified?",
    answer:
      "Yes. Each entry lists the actual final score alongside the tip we issued before kick-off, so every winning prediction shown here is independently checkable.",
  },
  {
    question: "How often is the accuracy record updated?",
    answer:
      "The record refreshes daily as new results are confirmed, reflecting the most recent verified winning predictions across the leagues we cover.",
  },
];

export default async function AccuracyPage() {
  const wins = await getRecentWins();

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Accuracy", url: `${siteConfig.url}/accuracy` },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">Prediction Accuracy</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          A transparent, verifiable record of our recent winning football
          predictions — the match, our tip, and the final result.
        </p>
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Recent Verified Wins</h2>
          <LastUpdated />
        </div>

        {wins.length === 0 ? (
          <p className="rounded-lg bg-surface py-10 text-center text-muted shadow-sm">
            The latest verified results are being updated. Please check back shortly.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">League</th>
                  <th className="px-3 py-3 font-medium">Match</th>
                  <th className="px-3 py-3 font-medium">Our Tip</th>
                  <th className="px-3 py-3 font-medium">Result</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {wins.map((w) => (
                  <tr key={w.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-3 whitespace-nowrap text-muted">{formatDayMonth(w.date)}</td>
                    <td className="px-3 py-3 text-muted">{w.league}</td>
                    <td className="px-3 py-3 font-medium text-foreground">{w.name}</td>
                    <td className="px-3 py-3">
                      <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                        {w.fttip || "—"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-foreground">{w.ftscore || "—"}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-green-100 dark:bg-success-soft px-2.5 py-1 text-xs font-medium text-green-700">
                        Won
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-foreground">
            Accuracy &amp; Transparency — FAQ
          </h2>
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
    </div>
  );
}
