/**
 * Tip-store categories, ported from the legacy StorePage endpoint map. Each maps
 * to a backend market endpoint and a tip field. `tier` mirrors the legacy plan
 * gate; `access` reflects whether the backend endpoint is public (so tips can be
 * server-rendered for SEO) or JWT-gated (subscribers only).
 *
 * High-volume keyword targets (over 2.5, BTTS, correct score, accumulator), so
 * these double as SEO landing pages.
 */

export type TipTier = "Free" | "Key" | "Premium";

export type TipCategory = {
  slug: string;
  title: string;
  description: string;
  endpoint: string;
  /** Match field to render as the tip. */
  tipField: string;
  /** Boolean-market categories render this label instead of a text tip. */
  marketLabel?: string;
  tier: TipTier;
  /** Whether the backend endpoint needs a JWT (subscriber-only). */
  gated: boolean;
};

export const tipCategories: TipCategory[] = [
  { slug: "doublechance", title: "Double Chance", description: "Double Chance predictions covering two of the three possible match outcomes for lower-risk betting.", endpoint: "dc", tipField: "dctip", tier: "Free", gated: false },
  { slug: "over1", title: "Over 1.5 Goals", description: "Over 1.5 goals tips — matches our experts expect to produce two or more goals.", endpoint: "over-1", tipField: "over1", marketLabel: "Over 1.5", tier: "Free", gated: false },
  { slug: "pr", title: "Potential Risk", description: "Higher-odds Potential Risk picks for punters chasing bigger returns.", endpoint: "potential-risk", tipField: "potentialrisktip", tier: "Free", gated: false },
  { slug: "correctscore", title: "Correct Score", description: "Correct score predictions — our experts' most likely final scoreline for each fixture.", endpoint: "correct-score", tipField: "cstip", tier: "Free", gated: false },
  { slug: "draw", title: "Full Time Draw", description: "Full-time draw predictions for matches our models expect to end level.", endpoint: "draw", tipField: "draw", marketLabel: "Draw", tier: "Free", gated: false },
  { slug: "bts", title: "Both Teams to Score", description: "BTTS (Both Teams to Score) tips — fixtures where we expect goals at both ends.", endpoint: "bts", tipField: "bts", marketLabel: "BTTS", tier: "Key", gated: true },
  { slug: "over2", title: "Over/Under 2.5 Goals", description: "Over 2.5 and Under 2.5 goals predictions for today's football fixtures.", endpoint: "over-2", tipField: "over2", marketLabel: "Over 2.5", tier: "Key", gated: true },
  { slug: "singlecombo", title: "Single Combo", description: "Single Combo tips combining two strong selections into one value bet.", endpoint: "single-combo", tipField: "singlecombotip", tier: "Key", gated: true },
  { slug: "weekendtip", title: "Weekend Tips", description: "Curated weekend football accumulator tips across the top fixtures.", endpoint: "weekend", tipField: "weekendtip", tier: "Key", gated: true },
  { slug: "htft", title: "Half Time / Full Time", description: "HT/FT predictions for the half-time and full-time result of each match.", endpoint: "ht-ft", tipField: "htfttip", tier: "Premium", gated: true },
  { slug: "singlebet", title: "Single Bet", description: "High-confidence single bet of the day for steady, lower-variance staking.", endpoint: "single-bet", tipField: "singlebettip", tier: "Premium", gated: true },
  { slug: "sbh", title: "Score Both Halves", description: "Score Both Halves tips for teams expected to find the net in each half.", endpoint: "sbh", tipField: "sbhtip", tier: "Premium", gated: true },
  { slug: "handicap", title: "Handicap", description: "Asian and European handicap predictions for evenly or unevenly matched fixtures.", endpoint: "handicap", tipField: "handicaptip", tier: "Premium", gated: true },
  { slug: "httips", title: "Half Time Tips", description: "Half-time result predictions for the first 45 minutes of each match.", endpoint: "ht-tips", tipField: "halftimetip", tier: "Premium", gated: true },
  { slug: "winehalf", title: "Win Either Half", description: "Win Either Half tips for sides expected to win at least one half of the match.", endpoint: "win-either-half", tipField: "wineitherhalftip", tier: "Premium", gated: true },
  { slug: "accumulator", title: "Accumulator", description: "Expert accumulator tips combining multiple selections for bigger combined odds.", endpoint: "acca", tipField: "accatip", tier: "Premium", gated: true },
];

export function getTipCategory(slug: string): TipCategory | undefined {
  return tipCategories.find((c) => c.slug === slug);
}
