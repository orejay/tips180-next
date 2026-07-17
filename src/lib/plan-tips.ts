import { authFetch } from "@/lib/api-auth";
import type { TipRow } from "@/components/dashboard/tips-table";

/**
 * Subscription-plan tip data. All endpoints are JWT-gated (the backend returns
 * 401 when the plan is inactive); `authFetch` turns that into `null`, which the
 * pages render as a locked/upsell state. Shapes mirror `accaformat`/`specformat`.
 */

type AccaMatch = {
  id: number;
  date: string;
  league: string;
  name: string;
  smartbettip?: string;
  smartbetodds?: string;
  rollovertip?: string;
  rolloverodds?: string;
  expertsacca1tip?: string;
  expertsacca1odds?: string;
  expertsacca2tip?: string;
  expertsacca2odds?: string;
  ftscore?: string;
};

type AccaWindow = { today: AccaMatch[]; yesterday: AccaMatch[]; tomorrow: AccaMatch[] };

type SpecMatch = {
  id: number;
  date: string;
  league: string;
  name: string;
  sure50_1st?: boolean;
  sure50_1st_tip?: string;
  sure50_1st_odds?: string;
  sure50_2nd?: boolean;
  sure50_2nd_tip?: string;
  sure50_2nd_odds?: string;
  weekend10_1st?: boolean;
  weekend10_1st_tip?: string;
  weekend10_1st_odds?: string;
  weekend10_2nd?: boolean;
  weekend10_2nd_tip?: string;
  weekend10_2nd_odds?: string;
  ftscore?: string;
};

type SbPlusMatch = {
  id: number;
  date: string;
  league: string;
  name: string;
  sbplustip?: string;
  sbplusodds?: string;
  ftscore?: string;
};

export type BankerTip = {
  id: number;
  name: string;
  date: string;
  league: string;
  time: string;
  tip: string;
  odds: string;
  confidence: string;
  analysis: string;
};

/** Backend dates arrive as ISO or a date string; render day/month, else pass through. */
function fmt(date: string): string {
  const iso = date?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}`;
  return date ?? "";
}

/** A Yesterday/Today/Tomorrow window of rows, as returned by the accaformat endpoints. */
export type DayWindow = { yesterday: TipRow[]; today: TipRow[]; tomorrow: TipRow[] };

// --- Smart Bet (isubscriptstatus) ---
export async function getSmartBetRows(): Promise<DayWindow | null> {
  const data = await authFetch<AccaWindow>("tips/smartbet");
  if (!data) return null;
  const toRow = (m: AccaMatch): TipRow => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: m.smartbettip,
    odds: m.smartbetodds,
    score: m.ftscore,
  });
  return {
    yesterday: data.yesterday.map(toRow),
    today: data.today.map(toRow),
    tomorrow: data.tomorrow.map(toRow),
  };
}

// --- Smart Bet Plus (isubscriptstatus; flat, no date window) ---
export async function getSmartBetPlusRows(): Promise<TipRow[] | null> {
  const data = await authFetch<{ sb_plus: SbPlusMatch[] }>("tips/smartbet-plus");
  if (!data) return null;
  return data.sb_plus.map((m) => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: m.sbplustip,
    odds: m.sbplusodds,
    score: m.ftscore,
  }));
}

// --- Rollover (rollsubscriptstatus) ---
export async function getRolloverRows(): Promise<DayWindow | null> {
  const data = await authFetch<AccaWindow>("tips/rollover");
  if (!data) return null;
  const toRow = (m: AccaMatch): TipRow => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: m.rollovertip,
    odds: m.rolloverodds,
    score: m.ftscore,
  });
  return {
    yesterday: data.yesterday.map(toRow),
    today: data.today.map(toRow),
    tomorrow: data.tomorrow.map(toRow),
  };
}

// --- 50 Odds (odds50status; two independently-populated sets) ---
export async function getSure50Rows(): Promise<{ set1: TipRow[]; set2: TipRow[] } | null> {
  const data = await authFetch<{ matches: SpecMatch[] }>("tips/sure50");
  if (!data) return null;
  return {
    set1: data.matches
      .filter((m) => m.sure50_1st)
      .map((m) => ({
        id: m.id,
        date: fmt(m.date),
        league: m.league,
        name: m.name,
        tip: m.sure50_1st_tip,
        odds: m.sure50_1st_odds,
        score: m.ftscore,
      })),
    set2: data.matches
      .filter((m) => m.sure50_2nd)
      .map((m) => ({
        id: m.id,
        date: fmt(m.date),
        league: m.league,
        name: m.name,
        tip: m.sure50_2nd_tip,
        odds: m.sure50_2nd_odds,
        score: m.ftscore,
      })),
  };
}

// --- Weekend 10 (w10subscriptstatus; two independently-populated sets) ---
export async function getWeekend10Rows(): Promise<{ set1: TipRow[]; set2: TipRow[] } | null> {
  const data = await authFetch<{ matches: SpecMatch[] }>("tips/weekend10");
  if (!data) return null;
  return {
    set1: data.matches
      .filter((m) => m.weekend10_1st)
      .map((m) => ({
        id: m.id,
        date: fmt(m.date),
        league: m.league,
        name: m.name,
        tip: m.weekend10_1st_tip,
        odds: m.weekend10_1st_odds,
        score: m.ftscore,
      })),
    set2: data.matches
      .filter((m) => m.weekend10_2nd)
      .map((m) => ({
        id: m.id,
        date: fmt(m.date),
        league: m.league,
        name: m.name,
        tip: m.weekend10_2nd_tip,
        odds: m.weekend10_2nd_odds,
        score: m.ftscore,
      })),
  };
}

// --- Experts ACCA (public endpoint; gated client-side on plan) ---
export async function getExpertsAccaRows(): Promise<{ set1: DayWindow; set2: DayWindow }> {
  const data = await authFetch<{
    set_1: AccaWindow;
    set_2: AccaWindow;
  }>("tips/experts-acca");
  const toWindow = (w: AccaWindow | undefined, n: 1 | 2): DayWindow => {
    const toRow = (m: AccaMatch): TipRow => ({
      id: m.id,
      date: fmt(m.date),
      league: m.league,
      name: m.name,
      tip: n === 1 ? m.expertsacca1tip : m.expertsacca2tip,
      odds: n === 1 ? m.expertsacca1odds : m.expertsacca2odds,
      score: m.ftscore,
    });
    return {
      yesterday: (w?.yesterday ?? []).map(toRow),
      today: (w?.today ?? []).map(toRow),
      tomorrow: (w?.tomorrow ?? []).map(toRow),
    };
  };
  return { set1: toWindow(data?.set_1, 1), set2: toWindow(data?.set_2, 2) };
}

// --- 2 / 3 Odds (Premium only; two sets each, bucketed 2 days back/forward) ---
type OddsMatch = {
  id: number;
  date: string;
  league: string;
  name: string;
  sure2tip?: string;
  sure21stsetodds?: string;
  sure22ndsetodds?: string;
  sure3tip?: string;
  sure31stsetodds?: string;
  sure32ndsetodds?: string;
};

/** A 5-day window centred on today, used by the 2/3 Odds plans. */
export type FiveDayWindow = {
  dayBeforeYesterday: TipRow[];
  yesterday: TipRow[];
  today: TipRow[];
  tomorrow: TipRow[];
  dayAfterTomorrow: TipRow[];
};

const FIVE_DAY_OFFSETS = {
  dayBeforeYesterday: -2,
  yesterday: -1,
  today: 0,
  tomorrow: 1,
  dayAfterTomorrow: 2,
} as const;

/** UTC calendar-day ISO string (YYYY-MM-DD), `offsetDays` from today. */
function isoDateOffset(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function getOddsSet(
  kind: "sure2" | "sure3",
  set: 1 | 2,
): Promise<FiveDayWindow | null> {
  const data = await authFetch<OddsMatch[]>(`tips/${kind}/${set}`);
  if (!data) return null;

  const buckets: FiveDayWindow = {
    dayBeforeYesterday: [],
    yesterday: [],
    today: [],
    tomorrow: [],
    dayAfterTomorrow: [],
  };
  const isoByOffset = Object.fromEntries(
    Object.entries(FIVE_DAY_OFFSETS).map(([key, offset]) => [isoDateOffset(offset), key]),
  ) as Record<string, keyof FiveDayWindow>;

  for (const m of data) {
    const raw = m.date?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
    const bucket = raw ? isoByOffset[raw] : undefined;
    if (!bucket) continue;
    buckets[bucket].push({
      id: m.id,
      date: fmt(m.date),
      league: m.league,
      name: m.name,
      tip: kind === "sure2" ? m.sure2tip : m.sure3tip,
      odds:
        kind === "sure2"
          ? set === 1
            ? m.sure21stsetodds
            : m.sure22ndsetodds
          : set === 1
            ? m.sure31stsetodds
            : m.sure32ndsetodds,
    });
  }
  return buckets;
}

// --- Banker Tip of the day (public) ---
export async function getBankerTip(): Promise<BankerTip | null> {
  const data = await authFetch<BankerTip | Record<string, never>>("tips/bankers");
  if (!data || !("tip" in data)) return null;
  return data as BankerTip;
}
