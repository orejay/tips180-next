/**
 * Plan pricing denominated in wallet points ("Tcoin"), ported from the legacy
 * `pointsPaymentsData.js`. A separate table from `config/plans.ts` (which is
 * card/manual-payment pricing in local currency) — slugs match so a plan
 * picked in one system maps onto the other.
 */

export type PointsPlan = {
  name: string;
  slug: string;
  prices: { title: string; value: number }[];
  durations: string[];
};

export const pointsPlans: PointsPlan[] = [
  {
    name: "Key",
    slug: "key",
    prices: [
      { title: "10 Tcoin", value: 10 },
      { title: "40 Tcoin", value: 40 },
    ],
    durations: ["1 week", "1 month"],
  },
  {
    name: "Premium",
    slug: "premium",
    prices: [
      { title: "20 Tcoin", value: 20 },
      { title: "80 Tcoin", value: 80 },
    ],
    durations: ["1 week", "1 month"],
  },
  {
    name: "Smart Bet / Smart Bet Plus",
    slug: "smartbet",
    prices: [{ title: "30 Tcoin", value: 30 }],
    durations: ["5 days"],
  },
  {
    name: "Rollover",
    slug: "rollover",
    prices: [{ title: "40 Tcoin", value: 40 }],
    durations: ["10 days"],
  },
  {
    name: "50 Odds",
    slug: "odds50",
    prices: [{ title: "35 Tcoin", value: 35 }],
    durations: ["1 week"],
  },
  {
    name: "Weekend 10 Odds",
    slug: "weekend10",
    prices: [{ title: "55 Tcoin", value: 55 }],
    durations: ["1 month"],
  },
];
