"use client";

import { useEffect, useState } from "react";
import { CONFIRM_FIELDS, manualPayments, otherPayments } from "@/config/payment-methods";
import { countries } from "@/config/countries";
import { detectCountryClient } from "@/lib/geo-client";
import { SearchableSelect } from "@/components/ui/searchable-select";

/**
 * Payment instructions for ONE selected country — mirrors the legacy "How to
 * Pay" flow exactly: pick a country, see only what's available to it (never
 * every country's methods at once). Countries with no dedicated manual method
 * (most of the world) fall back to PayPal/Crypto, same as the legacy site's
 * default tab. Pass `country` to reuse a selection made elsewhere (e.g. the
 * card-payment country picker); omit it to render this component's own
 * geo-detected selector (used standalone on /how-to-pay).
 */
export function ManualPayments({ country: controlledCountry }: { country?: string } = {}) {
  // "" = undetected/unselected — never falsely pinned to a specific country.
  const [ownCountry, setOwnCountry] = useState("");
  const standalone = controlledCountry === undefined;

  useEffect(() => {
    if (!standalone) return;
    detectCountryClient().then((iso) => setOwnCountry(iso ?? ""));
  }, [standalone]);

  const country = controlledCountry ?? ownCountry;
  const match = manualPayments.find((c) => c.code === country);

  return (
    <section>
      {standalone && (
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Select your country</h2>
          <SearchableSelect
            options={countries}
            value={ownCountry}
            onChange={setOwnCountry}
            placeholder="Select your country"
            className="w-64"
          />
        </div>
      )}

      {match ? (
        <>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Pay manually — {match.name}
          </h2>
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]">
            <div className="space-y-4 px-4 py-4 text-sm text-muted">
              {match.methods.map((method) => (
                <div key={method.label}>
                  <p className="font-semibold text-foreground">{method.label}</p>
                  {method.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
              <div>
                <p className="font-semibold text-foreground">After paying</p>
                <p>
                  Send proof of payment on WhatsApp to{" "}
                  <span className="font-semibold">{match.confirmOn}</span> including:
                </p>
                <ul className="mt-1 list-disc pl-5">
                  {CONFIRM_FIELDS.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
                <p className="mt-1">Your account will be upgraded once payment is confirmed.</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="mb-3 text-sm text-muted">
          No local mobile-money/bank option is set up for your country yet — use PayPal or
          Crypto below, or pay by card.
        </p>
      )}

      <h2 className="mt-8 mb-3 text-lg font-semibold text-foreground">
        Other payment methods
      </h2>
      <div className="space-y-2">
        {otherPayments.map((method) => (
          <details
            key={method.label}
            className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-white/8 dark:bg-[#18181b]"
          >
            <summary className="cursor-pointer px-4 py-3 font-medium text-foreground">
              {method.label}
            </summary>
            <div className="space-y-3 border-t border-stone-200 px-4 py-4 text-sm text-muted dark:border-white/8">
              <p>{method.description}</p>
              <a
                href={method.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-md bg-linear-to-r from-brand-start to-brand-end px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
              >
                {method.ctaLabel}
              </a>
              <p>{method.confirmText}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
