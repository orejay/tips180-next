"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPricingFor, pricingOptions, toPricingCountry } from "@/config/pricing";
import type { Plan } from "@/config/plans";

/**
 * Plan grid with a geo-located price selector (legacy OurPlans country switch).
 * Defaults to Nigeria so the NGN cards render server-side for SEO; changing the
 * country swaps the whole price table + currency client-side.
 */
export function PlansPricing() {
  const [country, setCountry] = useState("NG");
  const { plans, currency } = getPricingFor(country);

  // Auto-select the visitor's country from IP geolocation (default NG renders on
  // the server for SEO; this refines it after mount).
  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { country?: string | null }) => setCountry(toPricingCountry(d.country)))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-6 flex flex-col items-center gap-2">
        <label htmlFor="pricing-country" className="text-sm font-medium text-muted">
          Showing prices for
        </label>
        <select
          id="pricing-country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-64 rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {pricingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-subtle">Prices shown in {currency}.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.slug} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const from = plan.prices[0];
  return (
    <div className="flex flex-col rounded-xl bg-surface p-6 shadow-sm ring-1 ring-border">
      <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
      <p className="mt-1 text-sm text-muted">
        from{" "}
        <span className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-lg font-bold text-transparent">
          {from.label}
        </span>
      </p>

      <p className="mt-3 text-xs font-medium tracking-wide text-subtle uppercase">Durations</p>
      <p className="text-sm text-muted">{plan.durations.join(" · ")}</p>

      <ul className="mt-4 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/auth/signup"
        className="mt-6 rounded-md bg-linear-to-r from-brand-start to-brand-end py-2.5 text-center font-medium text-white transition-opacity hover:opacity-90"
      >
        Get Started
      </Link>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-teal-500"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
