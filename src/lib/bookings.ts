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

/** A plan booking plus its total odds (shown on the dashboard plan pages). */
export type PlanBooking = { booking: Booking; totalOdds: string | null };

/** Local YYYY-MM-DD, to match today's booking entry in the array shapes. */
function todayString(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * Pull a single booking from a category value, which is either one booking
 * object ({ odds50: {...} }) or an array of per-day bookings ({ smartbet: [...] }).
 * For arrays, prefer today's entry, else the first one with a code.
 */
function pickBooking(value: unknown): Booking | null {
  if (Array.isArray(value)) {
    const valid = value.filter(
      (b): b is Booking => !!b && typeof b === "object" && !!(b as Booking).code,
    );
    return valid.find((b) => b.date === todayString()) ?? valid[0] ?? null;
  }
  return pick(value as RawBooking);
}

/**
 * Booking code + total odds for a dashboard plan category, e.g. "expertsacca1",
 * "odds501", "w102", "smartbet", "rollover". The endpoint is public; the booking
 * lives under a category-specific key and the total odds under `odds`,
 * `today_odds`, or `accumulator_odds`. Returns null when nothing is posted.
 */
export async function getPlanBooking(category: string): Promise<PlanBooking | null> {
  let data: Record<string, unknown> | null = null;
  try {
    data = await api<Record<string, unknown>>(`getendpoints/bookings/${category}`, {
      next: { revalidate: 600 },
    });
  } catch {
    return null;
  }
  if (!data || typeof data !== "object") return null;

  const rawOdds = data.odds ?? data.today_odds ?? data.accumulator_odds;
  const n = parseFloat(String(rawOdds));
  const totalOdds = Number.isFinite(n) && n > 1 ? String(rawOdds) : null;

  for (const [key, value] of Object.entries(data)) {
    if (key === "odds" || key.endsWith("_odds")) continue;
    const booking = pickBooking(value);
    if (booking) return { booking, totalOdds };
  }
  return null;
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
