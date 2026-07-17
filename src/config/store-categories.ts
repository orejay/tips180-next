/**
 * Tip-store categories shown on the dashboard "My Store" grid (legacy
 * StoreCards). Most link to the marketing tip-store pages; 2/3 Odds and Experts
 * ACCA point at their dedicated dashboard routes.
 *
 * Each category carries the access `tier` it unlocks at, mirroring the legacy
 * store gate (StorePage.js) and the dashboard route guards:
 *   - free    → everyone, including Free-plan accounts
 *   - key     → Key or Premium plan
 *   - premium → Premium plan only
 *   - acca    → a paid plan (Key/Premium) with an active Experts-ACCA subscription
 */
import type { DashboardUser } from "@/lib/api-auth";
import { isActive } from "@/lib/api-auth";

export type StoreTier = "free" | "key" | "premium" | "acca";

export type StoreCategory = { name: string; href: string; tier: StoreTier };

export const storeCategories: StoreCategory[] = [
  { name: "Trending Matches", href: "/tip-store/trendingmatches", tier: "free" },
  { name: "Double Chance", href: "/tip-store/doublechance", tier: "free" },
  { name: "Over 1.5", href: "/tip-store/over1", tier: "free" },
  { name: "Potential Risk", href: "/tip-store/pr", tier: "free" },
  { name: "Correct Score", href: "/tip-store/correctscore", tier: "free" },
  { name: "Accumulator", href: "/tip-store/accumulator", tier: "free" },
  { name: "BTS", href: "/tip-store/bts", tier: "key" },
  { name: "Over/Under 2.5", href: "/tip-store/over2", tier: "key" },
  { name: "Single Combo", href: "/tip-store/singlecombo", tier: "key" },
  { name: "Weekend Tips", href: "/tip-store/weekendtip", tier: "key" },
  { name: "HT/FT", href: "/tip-store/htft", tier: "premium" },
  { name: "Single Bet", href: "/tip-store/singlebet", tier: "premium" },
  { name: "Score Both Halves", href: "/tip-store/sbh", tier: "premium" },
  { name: "Handicap", href: "/tip-store/handicap", tier: "premium" },
  { name: "2 Odds", href: "/dashboard/odds2", tier: "premium" },
  { name: "3 Odds", href: "/dashboard/odds3", tier: "premium" },
  { name: "Half Time Tips", href: "/tip-store/httips", tier: "premium" },
  { name: "Win Either Half", href: "/tip-store/winehalf", tier: "premium" },
  { name: "Draw", href: "/tip-store/draw", tier: "premium" },
  { name: "Experts Acca", href: "/dashboard/acca", tier: "acca" },
  { name: "Leagues", href: "/leagues", tier: "premium" },
];

/** Whether the given user can open a store of this tier. */
export function canAccessStore(tier: StoreTier, user: DashboardUser): boolean {
  const plan = user.accoutplan;
  switch (tier) {
    case "free":
      return true;
    case "key":
      return plan === "Key" || plan === "Premium";
    case "premium":
      return plan === "Premium";
    case "acca":
      return plan !== "Free" && isActive(user.rsubscriptstatus);
  }
}
