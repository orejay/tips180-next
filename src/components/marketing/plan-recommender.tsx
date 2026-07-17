"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import {
  CURRENCIES,
  ODDS_OPTIONS,
  STAKE_MAX,
  recommendPlans,
  type Currency,
  type OddsBucket,
} from "@/config/plan-recommendations";

/**
 * "Don't know what plan to select?" — a rule-based (not literally AI) plan
 * recommender. Replaces the Experts ACCA promo in the homepage stores section.
 * Collapsed by default; expands into currency/stake/odds inputs and shows the
 * matched plan(s) on submit. See `config/plan-recommendations.ts` for the rules.
 */
export function PlanRecommender() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [stake, setStake] = useState(0);
  const [odds, setOdds] = useState<OddsBucket>(ODDS_OPTIONS[0].value);
  const [result, setResult] = useState<string[] | null>(null);

  const stakeMax = STAKE_MAX[currency];

  const onCurrencyChange = (next: Currency) => {
    setCurrency(next);
    setStake(0);
    setResult(null);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(recommendPlans(currency, odds, stake));
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 via-cyan-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-500/20">
      <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-1 flex-col">
        <h3 className="text-2xl font-bold leading-tight lg:text-3xl">
          Don&apos;t know what plan to select?
        </h3>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl bg-white/10 p-4 text-left ring-1 ring-white/15 backdrop-blur transition-colors hover:bg-white/15"
        >
          <span>
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles size={15} />
              Get our recommendation here
            </span>
            <span className="mt-0.5 block text-xs text-white/75">
              Specially tailored for you
            </span>
          </span>
          <ChevronDown
            size={18}
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <form onSubmit={submit} className="mt-4 flex flex-1 flex-col gap-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-white/85">
                Preferred Betting Currency
              </span>
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="w-full rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-stone-800 outline-none"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 flex items-center justify-between font-medium text-white/85">
                Staking Budget
                <span className="font-bold">
                  {stake.toLocaleString("en-US")}{" "}
                  {CURRENCIES.find((c) => c.code === currency)?.stakeLabel}
                </span>
              </span>
              <input
                type="range"
                min={0}
                max={stakeMax}
                step={Math.max(1, Math.round(stakeMax / 200))}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="w-full accent-white"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-white/85">Odds Target</span>
              <select
                value={odds}
                onChange={(e) => setOdds(e.target.value as OddsBucket)}
                className="w-full rounded-lg bg-white/95 px-3 py-2 text-sm font-medium text-stone-800 outline-none"
              >
                {ODDS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Submit
            </button>

            {result && result.length > 0 && (
              <div className="mt-1 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <p className="text-xs font-medium text-white/75">
                  Recommending {result.length > 1 ? "these plans" : "this plan"} for you
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.map((plan) => (
                    <span
                      key={plan}
                      className="rounded-full bg-white/15 px-3 py-1 text-sm font-bold backdrop-blur"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
                <Link
                  href="/our-plans"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
                >
                  Subscribe Now
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
