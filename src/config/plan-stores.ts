/**
 * Prediction stores grouped by subscription plan. Drives the home "Prediction
 * Stores by Subscription Plans" accordion. `href` is set where a store has a
 * dedicated page (tip-store category or dashboard route); others render as
 * informational chips.
 */

export type PlanStore = { label: string; href?: string };

export type SubscriptionPlan = {
  key: string;
  name: string;
  tagline: string;
  /** Tailwind gradient stops for the plan accent (e.g. "from-teal-500 to-emerald-600"). */
  accent: string;
  /** Soft tint used for the open/active header state. */
  tint: string;
  /** Short note shown above the store chips when the plan inherits lower tiers. */
  inherits?: string;
  stores: PlanStore[];
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    key: "free",
    name: "Free",
    tagline: "Daily tips, no subscription needed",
    accent: "from-teal-500 to-emerald-600",
    tint: "bg-emerald-50 dark:bg-emerald-950/30",
    stores: [
      { label: "Trendy Matches", href: "/tip-store/trendymatches" },
      { label: "Over 1.5 Goals", href: "/tip-store/over1" },
      { label: "Correct Score", href: "/tip-store/correctscore" },
      { label: "Double Chance", href: "/tip-store/doublechance" },
      { label: "Potential Risk", href: "/tip-store/pr" },
    ],
  },
  {
    key: "key",
    name: "Key Plan",
    tagline: "Higher-value markets + Experts ACCA Set 1",
    accent: "from-blue-500 to-indigo-600",
    tint: "bg-blue-50 dark:bg-blue-950/30",
    inherits: "Everything in Free, plus",
    stores: [
      { label: "Both Teams to Score (BTTS/GG)", href: "/tip-store/bts" },
      { label: "Over/Under 2.5 Goals", href: "/tip-store/over2" },
      { label: "Single Combo", href: "/tip-store/singlecombo" },
      { label: "Experts ACCA Set 1 (5 Odds)", href: "/dashboard/acca" },
      { label: "Weekend Tips", href: "/tip-store/weekendtip" },
    ],
  },
  {
    key: "premium",
    name: "Premium Plan",
    tagline: "The full markets suite for serious punters",
    accent: "from-violet-500 to-purple-600",
    tint: "bg-violet-50 dark:bg-violet-950/30",
    inherits: "Everything in Free & Key, plus",
    stores: [
      { label: "Single Bet Tips", href: "/tip-store/singlebet" },
      { label: "Sure 2 Odds", href: "/dashboard/odds2" },
      { label: "Accumulator", href: "/tip-store/accumulator" },
      { label: "Sure 3 Odds", href: "/dashboard/odds3" },
      { label: "Halftime/Fulltime (HT/FT)", href: "/tip-store/htft" },
      { label: "Experts ACCA Set 2 (5 Odds)", href: "/dashboard/acca" },
      { label: "Score Both Halves", href: "/tip-store/sbh" },
      { label: "Handicap", href: "/tip-store/handicap" },
      { label: "Win Either Half", href: "/tip-store/winehalf" },
      { label: "Draw", href: "/tip-store/draw" },
    ],
  },
  {
    key: "smartbet",
    name: "Smart Bet Plan",
    tagline: "Our data-driven smart betting suite",
    accent: "from-fuchsia-500 to-pink-600",
    tint: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    stores: [
      { label: "Smart Bet Tips", href: "/dashboard/smartbet" },
      { label: "Smart Bet Plus Tips", href: "/dashboard/smartbet" },
      { label: "Smart Bet Strategy", href: "/dashboard/smartbet" },
    ],
  },
  {
    key: "50odds",
    name: "50 Odds ACCA Plan",
    tagline: "Big-odds accumulators, twice over",
    accent: "from-orange-500 to-rose-600",
    tint: "bg-orange-50 dark:bg-orange-950/30",
    stores: [
      { label: "50 Odds ACCA Set 1", href: "/dashboard/50odds" },
      { label: "50 Odds ACCA Set 2", href: "/dashboard/50odds" },
    ],
  },
  {
    key: "10odds",
    name: "10 Odds ACCA Plan",
    tagline: "Balanced-odds accumulators",
    accent: "from-cyan-500 to-sky-600",
    tint: "bg-cyan-50 dark:bg-cyan-950/30",
    stores: [
      { label: "10 Odds ACCA Set 1", href: "/dashboard/weekend10" },
      { label: "10 Odds ACCA Set 2", href: "/dashboard/weekend10" },
    ],
  },
  {
    key: "rollover",
    name: "Rollover Plan",
    tagline: "Compound your stake, risk-protected",
    accent: "from-amber-500 to-yellow-600",
    tint: "bg-amber-50 dark:bg-amber-950/30",
    stores: [
      { label: "Rollover Bet Tips", href: "/dashboard/rollover" },
      { label: "Money-Back Guaranteed", href: "/dashboard/rollover" },
    ],
  },
];
