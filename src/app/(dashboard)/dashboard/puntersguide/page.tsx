import type { Metadata } from "next";
import { punterGuide } from "@/config/punter-guide";

export const metadata: Metadata = { title: "Punter's Guide" };

export default function PuntersGuidePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">Punter&apos;s Guide</h1>

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
    </div>
  );
}
