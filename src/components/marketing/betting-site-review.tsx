import { Check, X, Star } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { TipsterCard } from "@/components/marketing/tipster-badge";
import { SiteLogo } from "@/components/marketing/betting-site-logo";
import { siteConfig } from "@/config/site";
import { personSchema } from "@/lib/schema";
import { tipsterImageUrl } from "@/lib/tipsters";
import type { BettingSite } from "@/lib/betting-sites";

/** Full bookmaker review — pros/cons, licence/withdrawal/support facts,
 *  registration steps, features, payment methods, free-text review sections,
 *  FAQ, reviewer card and register CTA. Its own page (not a same-page anchor),
 *  so every bookmaker review is independently indexable and shareable. */
export function BettingSiteReview({ site }: { site: BettingSite }) {
  const facts = [
    site.licence && { label: "Gaming Licence", value: site.licence },
    site.withdrawal_time && { label: "Withdrawal Time", value: site.withdrawal_time },
    site.support_types.length > 0 && { label: "Support Types", value: site.support_types.join(", ") },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="overflow-hidden rounded-xl bg-surface shadow-sm">
      {site.tipster && (
        <JsonLd
          data={personSchema({
            name: site.tipster.name,
            url: `${siteConfig.url}/tipsters/${site.tipster.id}`,
            jobTitle: site.tipster.role ?? undefined,
            description: site.tipster.experience ?? undefined,
            image: tipsterImageUrl(site.tipster.image_url) ?? undefined,
          })}
        />
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <SiteLogo site={site} size={44} />
          <h2 className="text-lg font-bold text-foreground lg:text-xl">{site.name} Review</h2>
        </div>
        {site.rating ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-sm font-bold text-primary">
            <Star size={14} className="fill-current" /> {site.rating}/5
          </span>
        ) : null}
      </div>

      <div className="p-5">
        {(site.pros.length > 0 || site.cons.length > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {site.pros.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {site.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    {pro}
                  </li>
                ))}
              </ul>
            )}
            {site.cons.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {site.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <X size={16} className="mt-0.5 shrink-0 text-danger" />
                    {con}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {facts.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-3 rounded-lg bg-surface-muted p-4 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label}>
                <p className="text-xs font-medium text-muted">{f.label}</p>
                <p className="text-sm font-semibold text-foreground">{f.value}</p>
              </div>
            ))}
          </div>
        )}

        {site.registration_steps.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-bold text-foreground">Registration steps</h3>
            <ol className="flex flex-col gap-2">
              {site.registration_steps.map((step, i) => (
                <li key={i} className="text-sm text-foreground">
                  <span className="font-semibold">
                    {i + 1}. {step.title}
                  </span>
                  {step.description ? (
                    <p className="mt-0.5 text-muted">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        )}

        {site.features.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-bold text-foreground">Features</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {site.features.map((f, i) => (
                <div key={i} className="flex items-center justify-between border-b border-border py-1.5 text-sm">
                  <span className="text-foreground">{f.label}</span>
                  {f.available ? (
                    <Check size={16} className="text-success" />
                  ) : (
                    <X size={16} className="text-danger" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {site.payment_methods.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 font-bold text-foreground">Payment Methods</h3>
            <p className="text-sm text-muted">{site.payment_methods.join(", ")}</p>
          </div>
        )}

        {site.review_sections.map((section, i) => (
          <div key={i} className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-bold text-foreground">{section.heading}</h3>
              {section.rating ? (
                <span className="text-xs font-semibold text-primary">{section.rating}/5</span>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-muted">{section.body}</p>
          </div>
        ))}

        {site.faqs.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 font-bold text-foreground">{site.name} — FAQ</h3>
            <FaqAccordion items={site.faqs} />
          </div>
        )}

        {site.tipster && <TipsterCard tipster={site.tipster} />}

        {site.affiliate_link ? (
          <div className="mt-6 flex justify-end border-t border-border pt-4">
            <a
              href={site.affiliate_link}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Register on {site.name}
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
