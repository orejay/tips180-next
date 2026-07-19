"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  end: number;
  /** Decimal places to render (e.g. 1 for "1.1M"). */
  decimals?: number;
  /** Divisor applied before formatting, so 1_100_000 can show as "1.1M". */
  divisor?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { end: 10, suffix: "+", label: "Years Betting Experience" },
  { end: 1_100_000, divisor: 1_000_000, decimals: 1, suffix: "M+", label: "Registered Members" },
  { end: 486, suffix: "+", label: "Tips Provided Weekly" },
  { end: 75, suffix: "%", label: "Accuracy Rate" },
  { end: 70, suffix: "+", label: "Leagues Covered" },
  { end: 785_622, suffix: "+", label: "Tips Provided So Far" },
];

/** Pause after scrolling into view, before the count-up starts — gives the
 *  user a moment to notice the numbers are about to animate. */
const START_DELAY = 500;
const DURATION = 2800;

/** Stats strip that counts each number up once it scrolls into view. */
export function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // matchMedia is browser-only; show final values immediately, no animation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStart(true);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setStart(true), START_DELAY);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hero-fade-in mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3"
      style={{ animationDelay: "0.35s" }}
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1">
          <span className="bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-3xl font-black text-transparent lg:text-4xl">
            <AnimatedNumber stat={stat} start={start} />
          </span>
          <span className="text-xs font-medium tracking-wider text-muted uppercase">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function AnimatedNumber({ stat, start }: { stat: Stat; start: boolean }) {
  const { end, decimals = 0, divisor = 1, prefix = "", suffix = "" } = stat;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / DURATION, 1);
      // easeOutExpo for a quick-then-settle feel.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(end * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, end]);

  const display = (value / divisor).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
