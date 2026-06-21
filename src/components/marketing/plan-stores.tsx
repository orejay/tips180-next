"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { subscriptionPlans, type PlanStore } from "@/config/plan-stores";
import { cn } from "@/lib/utils";

/**
 * "Prediction Stores by Subscription Plans" — an accordion that reveals the
 * stores bundled into each plan. Client leaf (expand/collapse); a single plan is
 * open at a time, with the Free plan open by default.
 */
export function PlanStores() {
  const [open, setOpen] = useState<string>(subscriptionPlans[0].key);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#18181b] sm:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-purple-600 text-white">
          <Layers size={17} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-foreground md:text-xl">
            Prediction Stores by Plan
          </h2>
          <p className="text-xs text-subtle">Tap a plan to see the stores it unlocks</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {subscriptionPlans.map((plan) => {
          const isOpen = open === plan.key;
          return (
            <div
              key={plan.key}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                isOpen
                  ? "border-stone-200 dark:border-white/10"
                  : "border-stone-200/70 dark:border-white/6",
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? "" : plan.key)}
                className={cn(
                  "flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors",
                  isOpen ? plan.tint : "hover:bg-stone-50 dark:hover:bg-white/5",
                )}
              >
                <span
                  className={cn(
                    "h-9 w-1.5 shrink-0 rounded-full bg-linear-to-b",
                    plan.accent,
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {plan.name}
                  </span>
                  <span className="block truncate text-xs text-subtle">{plan.tagline}</span>
                </span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-muted dark:bg-white/10">
                  {plan.stores.length} {plan.stores.length === 1 ? "store" : "stores"}
                </span>
                <ChevronDown
                  size={16}
                  className={cn(
                    "shrink-0 text-subtle transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-4 pt-1">
                  {plan.inherits && (
                    <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-success">
                      <Check size={13} className="shrink-0" />
                      {plan.inherits}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {plan.stores.map((store) => (
                      <StoreChip key={store.label} store={store} accent={plan.accent} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StoreChip({ store, accent }: { store: PlanStore; accent: string }) {
  const base =
    "group inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50/70 px-2.5 py-1.5 text-xs font-medium text-foreground dark:border-white/8 dark:bg-white/5";

  if (!store.href) {
    return <span className={base}>{store.label}</span>;
  }

  return (
    <Link
      href={store.href}
      className={cn(base, "transition-colors hover:border-transparent hover:text-white", `hover:bg-linear-to-r ${accent}`)}
    >
      {store.label}
      <ArrowUpRight
        size={12}
        className="shrink-0 text-subtle transition-colors group-hover:text-white"
      />
    </Link>
  );
}
