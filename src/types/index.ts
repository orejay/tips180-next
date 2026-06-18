/**
 * Shared domain types. Expand these as API responses are mapped during the
 * port — keep them aligned with the actual tips180.com/api payloads.
 */

export type TipResult = "won" | "lost" | "pending" | "void";

export interface Prediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  /** ISO 8601 kickoff datetime. */
  kickoff: string;
  market: string; // e.g. "1X2", "Over 2.5", "BTTS", "Correct Score"
  tip: string;
  odds?: number;
  result?: TipResult;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  country?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  isSubscribed: boolean;
}
