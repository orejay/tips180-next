import { homeFaqs } from "@/config/faq";

/**
 * Visible FAQ accordion (legacy FrequentlyAskedCard). Native <details> — no JS.
 * The same `homeFaqs` drive the FAQPage JSON-LD on the home page.
 */
export function HomeFaq() {
  return (
    <section id="faq" className="bg-linear-to-r from-brand-start to-brand-end py-14">
      <div className="mx-auto mb-6 max-w-2xl px-4 text-center text-white">
        <h2 className="text-2xl font-bold lg:text-3xl">Frequently Asked Questions</h2>
        <p className="mx-auto mt-2 text-sm">
          We answer as much as we can here — if you need more help, reach us at
          hello@tips180.com.
        </p>
      </div>
      <div className="mx-auto w-11/12 max-w-2xl rounded-xl bg-surface p-4 lg:p-6">
        {homeFaqs.map((faq) => (
          <details key={faq.question} className="border-b border-border last:border-0">
            <summary className="cursor-pointer py-3 font-semibold text-foreground">
              {faq.question}
            </summary>
            <p className="pb-3 text-sm text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
