import { api } from "@/lib/api";
import { authFetch } from "@/lib/api-auth";

/**
 * Predict & Win game data. The round fixtures (`/predictions`) and fee/prize are
 * public; payment status is per-user. Predictions are submitted as a string of
 * H/D/A picks (one char per fixture, in order) plus the round + set_id.
 */

export type PwFixture = {
  id: number;
  match: string;
  date: string;
  league: { label: string; value: string };
};

export type PwRound = {
  setid: number;
  round: string;
  expiry: string;
  predictions: PwFixture[];
};

/** Countries Predict & Win runs in, with their fee/prize currency symbol. */
export const PW_COUNTRIES = [
  { label: "Nigeria", symbol: "₦" },
  { label: "Ghana", symbol: "GHC" },
  { label: "Kenya", symbol: "KSH" },
  { label: "Tanzania", symbol: "KSH" },
  { label: "Cameroon", symbol: "CFA" },
  { label: "Uganda", symbol: "UGX" },
] as const;

export function pwSymbol(country: string): string {
  return PW_COUNTRIES.find((c) => c.label === country)?.symbol ?? "₦";
}

export async function getCurrentRound(): Promise<PwRound | null> {
  try {
    const data = await api<PwRound>("getendpoints/predictions", {
      next: { revalidate: 120 },
    });
    return data?.predictions?.length ? data : null;
  } catch {
    return null;
  }
}

export async function getPwFee(country: string): Promise<number | null> {
  try {
    const data = await api<{ fee?: number }>(`getendpoints/fees/${encodeURIComponent(country)}`, {
      next: { revalidate: 600 },
    });
    return typeof data?.fee === "number" ? data.fee : null;
  } catch {
    return null;
  }
}

export async function getPwPrize(country: string): Promise<number | null> {
  try {
    const data = await api<{ prize?: number }>(`getendpoints/prizes/${encodeURIComponent(country)}`, {
      next: { revalidate: 600 },
    });
    return typeof data?.prize === "number" ? data.prize : null;
  } catch {
    return null;
  }
}

/** Whether the signed-in user has already entered the given round. */
export async function hasEnteredRound(setId: number): Promise<boolean> {
  const rounds = await authFetch<{ set_id: number }[]>("getendpoints/pw-rounds");
  return Boolean(rounds?.some((r) => r.set_id === setId));
}

/** Whether the user has paid the entry fee for this round + country. */
export async function hasPaidEntry(country: string, setId: number): Promise<boolean> {
  const data = await authFetch<{ payed?: boolean }>(
    `getendpoints/pw-payment/${encodeURIComponent(country)}`,
    { method: "POST", body: JSON.stringify({ round: setId }) },
  );
  return Boolean(data?.payed);
}
