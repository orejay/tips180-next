"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Key,
  Crown,
  Brain,
  RefreshCw,
  Zap,
  Trophy,
  Star,
  Check,
} from "lucide-react";
import { getPricingFor, pricingOptions, toPricingCountry } from "@/config/pricing";
import type { Plan } from "@/config/plans";
import { cn } from "@/lib/utils";

/**
 * Plan grid with geo-located price selector. Defaults to Nigeria (NGN) so the
 * cards render server-side for SEO; refines to visitor's country after mount.
 */
export function PlansPricing() {
  const [country, setCountry] = useState("NG");
  const { plans, currency } = getPricingFor(country);

  useEffect(() => {
    fetch("/api/geo")
      .then((r) => r.json())
      .then((d: { country?: string | null }) => setCountry(toPricingCountry(d.country)))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      {/* Country selector */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <label htmlFor="pricing-country" className="text-sm font-medium text-muted">
          Showing prices for
        </label>
        <select
          id="pricing-country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-64 rounded-xl border border-border bg-surface px-4 py-2.5 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-white/10 dark:bg-[#18181b]"
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
        {plans.map((plan, idx) => (
          <PlanCard key={plan.slug} plan={plan} idx={idx} />
        ))}
      </div>
    </div>
  );
}

/* ── Per-plan accent configs ─────────────────────────────────── */

const ACCENTS = [
  {
    // Key — brand teal→blue
    gradient: "from-teal-500 to-blue-600",
    ring: "ring-teal-400",
    pill: "bg-teal-600 text-white shadow-teal-200/60 shadow-md dark:shadow-teal-900/40",
    pillOff: "border border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-700/40 dark:text-teal-300 dark:hover:bg-teal-900/30",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
    cta: "from-teal-500 to-blue-600",
    icon: Key,
  },
  {
    // Premium — emerald
    gradient: "from-emerald-500 to-green-600",
    ring: "ring-emerald-400",
    pill: "bg-emerald-600 text-white shadow-emerald-200/60 shadow-md dark:shadow-emerald-900/40",
    pillOff: "border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700/40 dark:text-emerald-300 dark:hover:bg-emerald-900/30",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    cta: "from-emerald-500 to-green-600",
    icon: Crown,
  },
  {
    // Smart Bet — orange→rose
    gradient: "from-orange-500 to-rose-500",
    ring: "ring-orange-400",
    pill: "bg-orange-500 text-white shadow-orange-200/60 shadow-md dark:shadow-orange-900/40",
    pillOff: "border border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-700/40 dark:text-orange-300 dark:hover:bg-orange-900/30",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    cta: "from-orange-500 to-rose-500",
    icon: Brain,
  },
  {
    // Rollover — sky→indigo
    gradient: "from-sky-500 to-indigo-600",
    ring: "ring-sky-400",
    pill: "bg-sky-600 text-white shadow-sky-200/60 shadow-md dark:shadow-sky-900/40",
    pillOff: "border border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-700/40 dark:text-sky-300 dark:hover:bg-sky-900/30",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    cta: "from-sky-500 to-indigo-600",
    icon: RefreshCw,
  },
  {
    // 50 Odds — pink→fuchsia
    gradient: "from-pink-500 to-fuchsia-600",
    ring: "ring-pink-400",
    pill: "bg-pink-600 text-white shadow-pink-200/60 shadow-md dark:shadow-pink-900/40",
    pillOff: "border border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-700/40 dark:text-pink-300 dark:hover:bg-pink-900/30",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    cta: "from-pink-500 to-fuchsia-600",
    icon: Zap,
  },
  {
    // Weekend 10 Odds — amber→yellow
    gradient: "from-amber-500 to-yellow-400",
    ring: "ring-amber-400",
    pill: "bg-amber-500 text-white shadow-amber-200/60 shadow-md dark:shadow-amber-900/40",
    pillOff: "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-700/40 dark:text-amber-300 dark:hover:bg-amber-900/30",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    cta: "from-amber-500 to-yellow-400",
    icon: Trophy,
  },
] as const;

/* ── Plan card ───────────────────────────────────────────────── */

function PlanCard({ plan, idx }: { plan: Plan; idx: number }) {
  const [durIdx, setDurIdx] = useState(0);
  const accent = ACCENTS[idx % ACCENTS.length];
  const Icon = accent.icon;
  const price = plan.prices[Math.min(durIdx, plan.prices.length - 1)];
  const isFeatured = plan.slug === "premium";

  return (
    <div
      className="plan-card-in relative flex flex-col"
      style={{ animationDelay: `${idx * 80}ms` }}
    >
      {/* "Most Popular" badge above featured card */}
      {isFeatured && (
        <div className="absolute -top-3.5 inset-x-0 z-10 flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg",
              `bg-gradient-to-r ${accent.gradient}`,
            )}
          >
            <Star size={10} fill="currentColor" /> Most Popular
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          isFeatured
            ? `ring-2 ring-offset-2 ring-offset-background ${accent.ring} shadow-lg`
            : "border border-gray-100 shadow-sm dark:border-white/8",
        )}
      >
        {/* Gradient header */}
        <div
          className={cn(
            "relative overflow-hidden px-6 pb-8 pt-7",
            `bg-gradient-to-br ${accent.gradient}`,
          )}
        >
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-5 -left-5 h-20 w-20 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
              <Icon size={18} />
            </div>
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="mt-0.5 font-mono text-xs uppercase tracking-widest text-white/60">
              {plan.slug}
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col space-y-4 bg-white px-6 py-5 dark:bg-[#18181b]">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-foreground">
                {price.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-subtle">
              per {plan.durations[Math.min(durIdx, plan.durations.length - 1)].toLowerCase()}
            </p>
          </div>

          {/* Duration pills */}
          {plan.durations.length > 1 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-subtle">
                Duration
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.durations.map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurIdx(i)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150",
                      durIdx === i ? accent.pill : accent.pillOff,
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <ul className="flex-1 space-y-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                <Check
                  size={16}
                  strokeWidth={2.5}
                  className="mt-0.5 shrink-0 text-teal-500"
                  aria-hidden
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex-1" />

          {/* CTA */}
          <Link
            href="/auth/signup"
            className={cn(
              "block w-full rounded-xl py-3 text-center text-sm font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]",
              `bg-gradient-to-r ${accent.cta}`,
            )}
          >
            Get {plan.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
