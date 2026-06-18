/**
 * Tip-store categories shown on the dashboard "My Store" grid (legacy
 * StoreCards). Most link to the marketing tip-store pages; 2/3 Odds and Experts
 * ACCA point at their dedicated dashboard routes.
 */
export type StoreCategory = { name: string; href: string };

export const storeCategories: StoreCategory[] = [
  { name: "Double Chance", href: "/tip-store/doublechance" },
  { name: "Over 1.5", href: "/tip-store/over1" },
  { name: "Potential Risk", href: "/tip-store/pr" },
  { name: "Correct Score", href: "/tip-store/correctscore" },
  { name: "BTS", href: "/tip-store/bts" },
  { name: "Over/Under 2.5", href: "/tip-store/over2" },
  { name: "Single Combo", href: "/tip-store/singlecombo" },
  { name: "Weekend Tips", href: "/tip-store/weekendtip" },
  { name: "HT/FT", href: "/tip-store/htft" },
  { name: "Single Bet", href: "/tip-store/singlebet" },
  { name: "Score Both Halves", href: "/tip-store/sbh" },
  { name: "Handicap", href: "/tip-store/handicap" },
  { name: "2 Odds", href: "/dashboard/odds2" },
  { name: "3 Odds", href: "/dashboard/odds3" },
  { name: "Half Time Tips", href: "/tip-store/httips" },
  { name: "Win Either Half", href: "/tip-store/winehalf" },
  { name: "Draw", href: "/tip-store/draw" },
  { name: "Accumulator", href: "/tip-store/accumulator" },
  { name: "Experts Acca", href: "/dashboard/acca" },
  { name: "Leagues", href: "/leagues" },
];
