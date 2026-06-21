import Link from "next/link";
import { Trophy, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { PlanStores } from "@/components/marketing/plan-stores";

/**
 * Home "stores" block: prediction stores grouped by subscription plan (left)
 * beside the Experts ACCA promo (right). Anchored as `#all-stores` so the
 * "View More Stores" link in the predictions rail scrolls here.
 */
export function LandingStore() {
  return (
    <section
      id="all-stores"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-10"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Stores by subscription plan */}
        <div className="lg:w-3/5">
          <PlanStores />
        </div>

        {/* Experts ACCA promo */}
        <div className="lg:w-2/5">
          <ExpertsAccaCard />
        </div>
      </div>
    </section>
  );
}

function ExpertsAccaCard() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 via-cyan-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-500/20">
      {/* Ambient light */}
      <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Trophy size={13} />
            Experts ACCA
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
            <Sparkles size={12} />
            5–10 Odds
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-bold leading-tight lg:text-3xl">
          Today&apos;s best ACCA, built by experts
        </h3>
        <p className="mt-2 text-sm text-white/80">
          Confused about the right selections? Let our experts guide you to victory
          with hand-picked accumulators carrying the day&apos;s strongest value.
        </p>

        {/* Set panels */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { name: "ACCA Set 1", note: "5 odds · Key plan" },
            { name: "ACCA Set 2", note: "5 odds · Premium" },
          ].map((set) => (
            <div
              key={set.name}
              className="rounded-xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur"
            >
              <p className="text-sm font-bold">{set.name}</p>
              <p className="mt-0.5 text-xs text-white/70">{set.note}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-white/75">
          <ShieldCheck size={14} className="shrink-0" />
          Curated daily from Europe&apos;s top leagues
        </p>

        <Link
          href="/dashboard/acca"
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Get today&apos;s ACCA
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
