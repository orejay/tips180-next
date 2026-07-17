/**
 * Rule-based plan recommender ("Don't know what plan to select?" widget on the
 * homepage). Not literally AI — a lookup table of (currency, odds target, stake
 * range) -> recommended plan(s), keyed per currency since the stake breakpoints
 * differ by currency purchasing power. Ported from the product-provided sheet.
 */

export type Currency = "NGN" | "KES" | "GHS" | "UGX" | "XOF" | "TZS" | "ZAR" | "USD";

export const CURRENCIES: { code: Currency; label: string; stakeLabel: string }[] = [
  { code: "NGN", label: "Nigerian Naira", stakeLabel: "NGN" },
  { code: "KES", label: "Kenyan Shillings", stakeLabel: "KES" },
  { code: "GHS", label: "Ghanaian Cedi", stakeLabel: "GHS" },
  { code: "UGX", label: "Ugandan Shillings", stakeLabel: "UGX" },
  { code: "XOF", label: "Cameroonian CFA", stakeLabel: "CFA" },
  { code: "TZS", label: "Tanzanian Shillings", stakeLabel: "TSh" },
  { code: "ZAR", label: "South African Rand", stakeLabel: "ZAR" },
  { code: "USD", label: "US Dollar (Others)", stakeLabel: "USD" },
];

/** Slider ceiling per currency — roughly the top stake breakpoint, rounded up. */
export const STAKE_MAX: Record<Currency, number> = {
  NGN: 1_000_000,
  KES: 100_000,
  GHS: 8_500,
  UGX: 500_000,
  XOF: 400_000,
  TZS: 2_000_000,
  ZAR: 10_000,
  USD: 1_000,
};

export type OddsBucket =
  | "1.30"
  | "1.50-1.80"
  | "2-3"
  | "5"
  | "5-10"
  | "10"
  | "over-10"
  | "50"
  | "over-50"
  | "100"
  | "over-100"
  | "1000";

export const ODDS_OPTIONS: { value: OddsBucket; label: string }[] = [
  { value: "1.30", label: "1.30" },
  { value: "1.50-1.80", label: "1.50 – 1.80" },
  { value: "2-3", label: "2 – 3" },
  { value: "5", label: "5" },
  { value: "5-10", label: "5 – 10" },
  { value: "10", label: "10" },
  { value: "over-10", label: "Over 10" },
  { value: "50", label: "50" },
  { value: "over-50", label: "Over 50" },
  { value: "100", label: "100" },
  { value: "over-100", label: "Over 100" },
  { value: "1000", label: "1,000" },
];

type Rule = {
  odds: OddsBucket;
  /** Omit for "Any Range". Only the `5`-odds bucket is stake-sensitive. */
  minStake?: number;
  maxStake?: number;
  plans: string[];
};

/** Rules shared by every currency except the stake-sensitive `5`-odds rows. */
const COMMON_RULES: Rule[] = [
  { odds: "1.30", plans: ["Rollover Plan"] },
  { odds: "1.50-1.80", plans: ["Smart Bet Plan"] },
  { odds: "2-3", plans: ["Premium Plan"] },
  { odds: "5-10", plans: ["Premium Plan"] },
  { odds: "10", plans: ["Weekend 10 Odds Plan"] },
  { odds: "over-10", plans: ["Premium Plan", "Weekend 10 Odds Plan"] },
  { odds: "50", plans: ["50 Odds Plan"] },
  { odds: "over-50", plans: ["50 Odds Plan", "Premium Plan"] },
  { odds: "100", plans: ["Weekend 10 Odds Plan", "50 Odds Plan", "Premium Plan"] },
  { odds: "over-100", plans: ["Premium Plan", "50 Odds Plan"] },
  { odds: "1000", plans: ["50 Odds Plan", "Premium Plan"] },
];

/** The two stake-tiered `5`-odds rows, per currency. */
const FIVE_ODDS_RULES: Record<Currency, Rule[]> = {
  NGN: [
    { odds: "5", minStake: 100, maxStake: 10_000, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 10_001, plans: ["Premium Plan"] },
  ],
  KES: [
    { odds: "5", minStake: 100, maxStake: 1_000, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 1_001, plans: ["Premium Plan"] },
  ],
  GHS: [
    { odds: "5", minStake: 5, maxStake: 100, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 101, maxStake: 8_500, plans: ["Premium Plan"] },
  ],
  UGX: [
    { odds: "5", minStake: 1_000, maxStake: 30_000, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 30_001, plans: ["Premium Plan"] },
  ],
  XOF: [
    { odds: "5", minStake: 100, maxStake: 5_000, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 5_001, maxStake: 400_000, plans: ["Premium Plan"] },
  ],
  TZS: [
    { odds: "5", minStake: 1_000, maxStake: 20_000, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 20_001, maxStake: 2_000_000, plans: ["Premium Plan"] },
  ],
  ZAR: [
    { odds: "5", minStake: 10, maxStake: 120, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 121, maxStake: 10_000, plans: ["Premium Plan"] },
  ],
  USD: [
    { odds: "5", minStake: 1, maxStake: 10, plans: ["Key Plan", "Premium Plan"] },
    { odds: "5", minStake: 11, maxStake: 1_000, plans: ["Premium Plan"] },
  ],
};

export const RECOMMENDATION_RULES: Record<Currency, Rule[]> = Object.fromEntries(
  (Object.keys(FIVE_ODDS_RULES) as Currency[]).map((code) => [
    code,
    [...COMMON_RULES, ...FIVE_ODDS_RULES[code]],
  ]),
) as Record<Currency, Rule[]>;

/** Recommended plan(s) for a currency + odds target + stake amount. */
export function recommendPlans(
  currency: Currency,
  odds: OddsBucket,
  stake: number,
): string[] {
  const matches = RECOMMENDATION_RULES[currency].filter((r) => r.odds === odds);
  const hit = matches.find(
    (r) => stake >= (r.minStake ?? -Infinity) && stake <= (r.maxStake ?? Infinity),
  );
  return (hit ?? matches[0])?.plans ?? [];
}
