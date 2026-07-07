import Link from "next/link";
import { HeroStats } from "@/components/marketing/hero-stats";
import { theme } from "@/config/theme";

const TAGS = [
  { icon: <MedalIcon />, text: "Top Prediction Experts & Analysis" },
  { icon: <ShieldIcon />, text: "Money-Back Guarantee on Some Plans" },
];

/**
 * Home hero — structure adapted from the 90mins hero (ambient blobs, tag pills,
 * underlined headline, dual CTAs, stats strip) in the Tips180 teal→blue palette.
 * Server Component so the H1 and copy ship in the initial HTML; only the
 * count-up stats strip is a client leaf.
 */
export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface px-4 pt-20 pb-16 transition-colors duration-300 dark:bg-black lg:px-12">
      {/* Decorative ambient blobs — light tints in light mode, deep low-opacity
          tints over pure black in dark (mirrors the 90mins hero). */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="hero-blob absolute top-10 right-1/4 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />
        <div
          className="hero-blob absolute right-12 bottom-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="hero-blob absolute top-16 left-10 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl dark:bg-cyan-900/15"
          style={{ animationDelay: "6s" }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Tag row */}
        <div className="hero-fade-in mb-6 flex flex-wrap gap-2" style={{ animationDelay: "0.1s" }}>
          {TAGS.map((tag) => (
            <span
              key={tag.text}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-600/15 bg-blue-600/8 px-3 py-1.5 text-xs font-semibold text-primary"
            >
              {tag.icon}
              {tag.text}
            </span>
          ))}
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Win More With{" "}
          <span className="relative inline-block">
            <span className="relative z-10 bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
              Accurate Football
            </span>
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 300 10"
              fill="none"
              preserveAspectRatio="none"
              style={{ height: "8px" }}
              aria-hidden="true"
            >
              <path
                d="M0 7 Q75 1 150 7 Q225 13 300 7"
                stroke={theme.primary}
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.45"
              />
            </svg>
          </span>{" "}
          Predictions
        </h1>

        {/* Subtext */}
        <p
          className="hero-fade-in mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          Daily football predictions, correct scores and accumulator tips —
          researched by expert analysts so you can bet smarter, not harder.
        </p>

        {/* CTAs */}
        <div className="hero-fade-in mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.25s" }}>
          <Link
            href="/leagues"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-brand-start to-brand-end px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-opacity hover:opacity-90"
          >
            View Today&apos;s Tips
            <ArrowIcon />
          </Link>
          <Link
            href="/our-plans"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            See Our Plans
          </Link>
        </div>

        <HeroStats />
      </div>
    </section>
  );
}

function MedalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="6" />
      <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
