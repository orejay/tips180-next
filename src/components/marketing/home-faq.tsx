import { homeFaqs } from "@/config/faq";
import { FaqAccordion } from "@/components/ui/faq-accordion";

const ICON_NAMES = [
  "Info", "TrendingUp", "CreditCard", "UserPlus", "Target", "Clock",
  "ShieldCheck", "MessageCircle", "RotateCcw", "BookOpen", "Wallet",
  "XCircle", "Globe", "Bell",
];

const items = homeFaqs.map((faq, i) => ({
  ...faq,
  icon: ICON_NAMES[i % ICON_NAMES.length],
}));

/** Roughly how many closed FAQ rows fit before the list scrolls — a fixed
 *  height (not a hard item cap) keeps the section bounded as more questions
 *  are added in config/faq.ts, while still letting all of them be reached in
 *  one continuous scroll instead of a second, visually separate box. */
const VISIBLE_ROWS = 10;
const ROW_HEIGHT_PX = 61; // measured closed-row height (px-5 py-4 content + gap-3)

export function HomeFaq() {
  return (
    <section
      id="faq"
      className="w-full bg-white px-4 py-20 transition-colors duration-300 dark:bg-black"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="text-3xl font-black leading-tight text-foreground lg:text-5xl">
            Got{" "}
            <span className="bg-linear-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              questions?
            </span>
          </h2>
          <p className="text-base text-subtle">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* -mx-3 px-3: setting overflow-y forces the browser to clip
            overflow-x too (per spec), which would cut off the open card's
            scale(1.015)/shadow bleed. The padding gives that room; the
            matching negative margin keeps the visible edges aligned with
            the heading above. */}
        <div
          className="scrollbar-hide -mx-3 overflow-y-auto px-3"
          style={{ maxHeight: VISIBLE_ROWS * ROW_HEIGHT_PX }}
        >
          <FaqAccordion items={items} />
        </div>
      </div>
    </section>
  );
}
