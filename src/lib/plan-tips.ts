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
  sure50_1st_tip?: string;
  sure50_1st_odds?: string;
  sure50_2nd_tip?: string;
  sure50_2nd_odds?: string;
  weekend10_1st_tip?: string;
  weekend10_1st_odds?: string;
  weekend10_2nd_tip?: string;
  weekend10_2nd_odds?: string;
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

const first = (...vals: (string | undefined)[]) => vals.find((v) => v && v.trim()) ?? "";

/** Backend dates arrive as ISO or a date string; render day/month, else pass through. */
function fmt(date: string): string {
  const iso = date?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}`;
  return date ?? "";
}

// --- Smart Bet (isubscriptstatus) ---
export async function getSmartBetRows(): Promise<TipRow[] | null> {
  const data = await authFetch<AccaWindow>("tips/smartbet");
  if (!data) return null;
  return [...data.today, ...data.tomorrow].map((m) => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: m.smartbettip,
    odds: m.smartbetodds,
    score: m.ftscore,
  }));
}

// --- Rollover (rollsubscriptstatus) ---
export async function getRolloverRows(): Promise<TipRow[] | null> {
  const data = await authFetch<AccaWindow>("tips/rollover");
  if (!data) return null;
  return [...data.today, ...data.tomorrow].map((m) => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: m.rollovertip,
    odds: m.rolloverodds,
    score: m.ftscore,
  }));
}

// --- 50 Odds (odds50status) ---
export async function getSure50Rows(): Promise<TipRow[] | null> {
  const data = await authFetch<{ matches: SpecMatch[] }>("tips/sure50");
  if (!data) return null;
  return data.matches.map((m) => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: first(m.sure50_1st_tip, m.sure50_2nd_tip),
    odds: first(m.sure50_1st_odds, m.sure50_2nd_odds),
    score: m.ftscore,
  }));
}

// --- Weekend 10 (w10subscriptstatus) ---
export async function getWeekend10Rows(): Promise<TipRow[] | null> {
  const data = await authFetch<{ matches: SpecMatch[] }>("tips/weekend10");
  if (!data) return null;
  return data.matches.map((m) => ({
    id: m.id,
    date: fmt(m.date),
    league: m.league,
    name: m.name,
    tip: first(m.weekend10_1st_tip, m.weekend10_2nd_tip),
    odds: first(m.weekend10_1st_odds, m.weekend10_2nd_odds),
    score: m.ftscore,
  }));
}

// --- Experts ACCA (public endpoint; gated client-side on plan) ---
export async function getExpertsAccaRows(): Promise<{ set1: TipRow[]; set2: TipRow[] }> {
  const data = await authFetch<{
    set_1: AccaWindow;
    set_2: AccaWindow;
  }>("tips/experts-acca");
  const toRows = (w: AccaWindow | undefined, n: 1 | 2): TipRow[] =>
    [...(w?.today ?? []), ...(w?.tomorrow ?? [])].map((m) => ({
      id: m.id,
      date: fmt(m.date),
      league: m.league,
      name: m.name,
      tip: n === 1 ? m.expertsacca1tip : m.expertsacca2tip,
      odds: n === 1 ? m.expertsacca1odds : m.expertsacca2odds,
      score: m.ftscore,
    }));
  return { set1: toRows(data?.set_1, 1), set2: toRows(data?.set_2, 2) };
}

// --- 2 / 3 Odds (Premium only; two sets each) ---
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

export async function getOddsSet(
  kind: "sure2" | "sure3",
  set: 1 | 2,
): Promise<TipRow[] | null> {
  const data = await authFetch<OddsMatch[]>(`tips/${kind}/${set}`);
  if (!data) return null;
  return data.map((m) => ({
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
  }));
}

// --- Banker Tip of the day (public) ---
export async function getBankerTip(): Promise<BankerTip | null> {
  const data = await authFetch<BankerTip | Record<string, never>>("tips/bankers");
  if (!data || !("tip" in data)) return null;
  return data as BankerTip;
}
