/**
 * Illustrative (not real-user) weekly bankroll trajectories for the Smart Bet
 * Strategy tab's "four betting personalities" chart. Deterministic formulas,
 * not random — same shape on every render/hydration.
 */
export type CurveId = "smart" | "chaser" | "lucky" | "casual";

export type Curve = {
  id: CurveId;
  label: string;
  shortLabel: string;
  description: string;
  verdict: string;
  /** SVG stroke-dasharray — a secondary (non-color) way to tell lines apart. */
  dash?: string;
};

export const CURVES: Curve[] = [
  {
    id: "smart",
    label: "Smart bettor (disciplined)",
    shortLabel: "Smart bettor",
    description:
      "Steady upward slope. Gradual growth with natural dips, but the long-run trend climbs. This is what disciplined unit staking and value betting produce over time.",
    verdict: "Grinds out a ~45% gain over 30 weeks — the only curve that ends above its peak-to-date.",
  },
  {
    id: "chaser",
    label: "Loss chaser (reckless)",
    shortLabel: "Loss chaser",
    description:
      "Exponential decay cliff. After early losses, panic sets in. Stakes increase to “recover,” each loss hits harder, and the curve falls off a cliff toward zero. The most common story.",
    verdict: "Wipes out almost the entire bankroll by week 30 — the fastest way to go bust.",
    dash: "1 6",
  },
  {
    id: "lucky",
    label: "Lucky streak (unsustainable)",
    shortLabel: "Lucky streak",
    description:
      "Inverted U (parabola). A hot run creates false confidence. The bettor overextends, luck mean-reverts, and they slide back to where they started — or below. It feels like winning; it ends like breaking even.",
    verdict: "Peaks 68% up by week 12, then gives almost all of it back — ends barely above where it started.",
    dash: "9 6",
  },
  {
    id: "casual",
    label: "Casual bettor (slow bleed)",
    shortLabel: "Casual bettor",
    description:
      "Slow linear bleed. No disaster, no glory. The bookmaker's built-in edge (typically 5–10%) quietly drains the bankroll over weeks. The slope is gentle, but it only points one way.",
    verdict: "No single bad day — just a ~27% loss by week 30 from the house edge, bet after bet.",
    dash: "2 3",
  },
];

export const STARTING_BANKROLL = 10000;
export const WEEKS = 30;

/** Sum of a few sine waves — a deterministic "natural wiggle", not noise. */
function wiggle(w: number, amp: number, seed: number): number {
  return (
    Math.sin(w * 0.9 + seed) * amp +
    Math.sin(w * 0.37 + seed * 2) * amp * 0.45
  );
}

function buildSeries(f: (w: number) => number): number[] {
  return Array.from({ length: WEEKS + 1 }, (_, w) => Math.max(0, Math.round(f(w))));
}

const smart = buildSeries(
  (w) => STARTING_BANKROLL + 4300 * Math.pow(w / WEEKS, 0.85) + wiggle(w, 140, 0.4),
);

const chaser = buildSeries(
  (w) => STARTING_BANKROLL * Math.exp(-w / 11) + wiggle(w, 220, 1.7) * Math.exp(-w / 20),
);

const lucky = buildSeries((w) => {
  const peakWeek = 12;
  const peakVal = 16800;
  if (w <= peakWeek) {
    return STARTING_BANKROLL + (peakVal - STARTING_BANKROLL) * Math.sin((w / peakWeek) * (Math.PI / 2));
  }
  const settleVal = 10300;
  return peakVal - (peakVal - settleVal) * (1 - Math.exp(-(w - peakWeek) / 8));
});

const casual = buildSeries(
  (w) => STARTING_BANKROLL - 95 * w + wiggle(w, 180, 2.6) * Math.exp(-w / 24),
);

export const SERIES: Record<CurveId, number[]> = { smart, chaser, lucky, casual };

export const PEAK_BANKROLL = Math.max(...Object.values(SERIES).flat());
