import Link from "next/link";
import { Zap, Crown, Clock, CalendarDays, ArrowRight } from "lucide-react";
import { getNextSmartBet } from "@/lib/home";
import { Countdown } from "@/components/ui/countdown";

const gradient = "bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent";

function fmtDate(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso ?? "";
}

/** Smart Bet / Smart Bet Plus promo cards (legacy SmartBetLanding). */
export async function SmartBetLanding() {
  const next = await getNextSmartBet();
  const sb = next[0];
  if (!sb) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
          <Zap size={17} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl">Smart Bet</h2>
          <p className="text-xs text-subtle">Expert-curated tips that keep your slips green</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Smart Bet — gradient hero card */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 to-blue-600 p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Zap size={13} />
                Smart Bet
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                Odds {sb.smartbetodds}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold leading-tight lg:text-3xl">
              Bet smart, win consistently
            </h3>
            <p className="mt-1.5 text-sm text-white/80">
              Unveil our expert smart-betting tips, built to deliver steady, reliable returns.
            </p>

            <div className="mt-5 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
              <p className="flex items-center gap-1.5 text-xs font-medium text-white/75">
                <Clock size={13} />
                Next Smart Bet tips start in
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums lg:text-3xl">
                <Countdown time={sb.nextsmartbet} />
              </p>
            </div>

            <Link
              href="/dashboard/smartbet"
              className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Try Smart Bet
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Smart Bet Plus — clean surface card */}
        <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-white/8 dark:bg-[#18181b]">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-teal-50 to-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100 dark:from-teal-950/40 dark:to-blue-950/40 dark:text-blue-300 dark:ring-blue-900/40">
              <Crown size={13} />
              Smart Bet Plus
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              Members only
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold leading-tight text-foreground lg:text-3xl">
            A 10-banker ACCA
          </h3>
          <p className="mt-1.5 text-sm text-muted">
            One banker tip per league, hand-picked from Europe&apos;s top ten leagues.
          </p>

          <div className="mt-5 rounded-xl bg-stone-50 p-4 dark:bg-white/5">
            <p className="flex items-center gap-1.5 text-xs font-medium text-subtle">
              <CalendarDays size={13} />
              Next Smart Bet Plus tip
            </p>
            <p className={`mt-1 text-2xl font-extrabold lg:text-3xl ${gradient}`}>
              {fmtDate(sb.nextsmartbetplus)}
            </p>
          </div>

          <Link
            href="/dashboard/smartbet"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Try Smart Bet Plus
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
