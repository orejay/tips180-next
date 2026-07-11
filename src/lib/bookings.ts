import { api } from "@/lib/api";

/**
 * Booking codes (legacy "Bet tip on <bookie>"). `/bookings/category/<cat>`
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

/**
 * Domains for known bookies, keyed by uppercase name. The backend only ever
 * stores a free-text `bookie` name (no domain/logo column), so — exactly like
 * the reference project's `lib/constants/bookmakers.ts` — logos are resolved
 * at render time from a favicon service keyed by domain, not local assets.
 */
const BOOKIE_DOMAINS: Record<string, string> = {
  BET9JA: "bet9ja.com",
  BETKING: "betking.com",
  SPORTYBET: "sportybet.com",
  "1XBET": "1xbet.com",
  BANGBET: "bangbet.com",
  BETWAY: "betway.com",
  MSPORT: "msport.com",
  PREMIERBET: "premierbet.com",
  PARIMATCH: "parimatch.com",
  "22BET": "22bet.com",
  MELBET: "melbet.com",
  FRAPAPA: "frapapa.com",
  NAIRABET: "nairaabet.com",
  ACCESSBET: "accessbet.ng",
  STARBET: "starbet.ng",
  PARIBET: "paribet.ng",
};

/** Favicon-based logo for a domain, matching the reference project's `bookmakerLogoUrl`. */
export function bookmakerLogoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function bookieLogo(bookie: string): string | null {
  const domain = BOOKIE_DOMAINS[bookie?.toUpperCase()];
  return domain ? bookmakerLogoUrl(domain) : null;
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
    data = await api<Record<string, unknown>>(`bookings/category/${category}`, {
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
    data = await api<Record<string, unknown>>(`bookings/category/${category}`, {
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
