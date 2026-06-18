/**
 * Subscription plan tiers, ported from the legacy `plansData.js` (Nigeria/NGN
 * base pricing). Rendered as crawlable content on /our-plans. Geo-located
 * pricing and Paystack/Flutterwave checkout are deferred to the payments phase;
 * until then these are the canonical, indexable plan descriptions.
 */

export type Plan = {
  name: string;
  /** Stable slug used by the backend (legacy `title`). */
  slug: string;
  prices: { label: string; value: number }[];
  durations: string[];
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Key",
    slug: "key",
    prices: [
      { label: "₦2,500", value: 2500 },
      { label: "₦5,000", value: 5000 },
      { label: "₦10,000", value: 10000 },
      { label: "₦15,000", value: 15000 },
      { label: "₦20,000", value: 20000 },
    ],
    durations: ["1 week", "1 month", "3 months", "6 months", "12 months"],
    features: [
      "Access to one set of Experts ACCA",
      "Access to 8 Tips Stores",
      "70% Accuracy Rate",
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    prices: [
      { label: "₦3,400", value: 3400 },
      { label: "₦7,500", value: 7500 },
      { label: "₦15,000", value: 15000 },
      { label: "₦22,500", value: 22500 },
      { label: "₦35,000", value: 35000 },
    ],
    durations: ["1 week", "1 month", "3 months", "6 months", "12 months"],
    features: [
      "Access to over 40 Leagues Tips",
      "Access to 2 sets of Experts ACCA",
      "Access to 20 Tips Stores",
      "Access to Risk Management Theory",
      "Access to 2 and 3 odds daily",
      "75% Accuracy Rate",
    ],
  },
  {
    name: "Smart Bet / Smart Bet Plus",
    slug: "smartbet",
    prices: [
      { label: "₦3,000", value: 3000 },
      { label: "₦4,500", value: 4500 },
      { label: "₦6,500", value: 6500 },
    ],
    durations: ["5 days", "10 days", "15 days"],
    features: [
      "Access to Smart Betting Strategy",
      "Access to 1.6 - 2.05 odds Daily",
      "Access to Best Ten Tips for the Weekend",
      "A More Steady Winning Strategy",
      "78% Accuracy Rate",
    ],
  },
  {
    name: "Rollover",
    slug: "rollover",
    prices: [{ label: "₦4,000", value: 4000 }],
    durations: ["10 days"],
    features: [
      "Rollover Betting Strategy",
      "Access to 1.3 odds Daily",
      "85% Accuracy Rate",
    ],
  },
  {
    name: "50 Odds",
    slug: "odds50",
    prices: [
      { label: "₦3,500", value: 3500 },
      { label: "₦7,000", value: 7000 },
    ],
    durations: ["1 week", "1 month"],
    features: [
      "Access to Winning Tactics",
      "Access to 50 odds twice a Week",
      "Access to 2 different sets of 50 odds on weekends",
      "Access to over 2500 odds of accumulated tips on weekends",
      "75% Accuracy Rate",
    ],
  },
  {
    name: "Weekend 10 Odds",
    slug: "weekend10",
    prices: [{ label: "₦5,200", value: 5200 }],
    durations: ["1 month"],
    features: [
      "Access to Best Accumulated Tips",
      "Access to 10 odds twice a week",
      "Access to 2 different set of 10 odds on weekends",
      "Access to over 100 odds on weekends",
      "78% Accuracy Rate",
    ],
  },
];
