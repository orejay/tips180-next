import type { Metadata } from "next";
import { ContentShell } from "@/components/layout/content-shell";
import { punterGuide } from "@/config/punter-guide";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Punter's Guide — How to Bet Smarter | Tips180",
  description:
    "A practical punter's guide covering staking, bankroll management and the mindset that separates consistent winners from lucky one-off wins.",
  alternates: { canonical: "/punters-guide" },
};

export default function PuntersGuidePage() {
  return (
    <ContentShell title="Punter's Guide">
      <div className="space-y-4 text-muted">
        <p>
          Anybody can win a bet — through skill, or just dumb luck on a bet with
          terrible odds. To consistently win more than you lose is much harder and
          requires skill rather than luck.
        </p>
        <p>
          Even if you have skill in estimating what the odds for an event should
          be, you are likely to lose many of your bets, as betting by definition
          exposes you to uncertain future outcomes. To survive all of this, you
          need a consistent approach to decide when and how much to bet — that is
          why we advise you thoroughly examine this page to become a successful
          punter and minimise the negative impact of bad luck.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {punterGuide.map((section) => (
          <section key={section.title}>
            <h2 className="mb-2 text-lg font-bold text-foreground">{section.title}</h2>
            <div className="space-y-3 text-muted">
              {section.blocks.map((block, i) =>
                block.type === "p" ? (
                  <p key={i}>{block.text}</p>
                ) : (
                  <ul key={i} className="list-disc space-y-1 pl-6">
                    {block.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </ContentShell>
  );
}
