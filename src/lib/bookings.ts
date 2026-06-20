import { api } from "@/lib/api";

/**
 * Booking codes (legacy "Bet tip on <bookie>"). `/getendpoints/bookings/<cat>`
 * returns a per-category object; for "freex" it nests today/yesterday/tomorrow.
 * Each booking is { bookie, code, link, category, date }. Public, fail-soft.
 */
export type Booking = {
  bookie: string;
  code: string;
  link: string;
  category: string;
  date: string;
};

type RawBooking = Booking | "" | null;

/** Map an uppercase bookie name to its logo in /public/icons/bookies. */
const BOOKIE_LOGOS: Record<string, string> = {
  BET9JA: "/icons/bookies/bet9ja.png",
  SPORTYBET: "/icons/bookies/sportybet.png",
  "1XBET": "/icons/bookies/1xbet.png",
  MSPORT: "/icons/bookies/msport.png",
  STARBET: "/icons/bookies/starbet.png",
  "22BET": "/icons/bookies/22bet.png",
  PARIBET: "/icons/bookies/paribet.png",
};

export function bookieLogo(bookie: string): string | null {
  return BOOKIE_LOGOS[bookie?.toUpperCase()] ?? null;
}

function pick(raw: RawBooking): Booking | null {
  if (!raw || typeof raw !== "object") return null;
  if (!raw.code) return null;
  return raw;
}

/**
 * Fetch the booking code for a category ("freex", "upcoming", "league", ...).
 * Returns the most relevant single booking (today for freex) or null.
 */
export async function getBooking(category: string): Promise<Booking | null> {
  let data: Record<string, unknown> | null = null;
  try {
    data = await api<Record<string, unknown>>(`getendpoints/bookings/${category}`, {
      next: { revalidate: 600 },
    });
  } catch {
    return null;
  }
  if (!data) return null;

  if (category === "freex") {
    const freex = data.freex as { today?: RawBooking } | "" | undefined;
    return freex && typeof freex === "object" ? pick(freex.today ?? null) : null;
  }
  // Other categories expose the booking under their own key.
  const value = (data[category] ?? Object.values(data)[0]) as RawBooking;
  return pick(value);
}
