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

        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
