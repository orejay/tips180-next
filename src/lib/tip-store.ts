import { api } from "@/lib/api";
import { authFetch } from "@/lib/api-auth";
import { formatDayMonth } from "@/lib/predictions";
import type { TipCategory } from "@/config/tip-store";
import type { TipRow } from "@/components/dashboard/tips-table";

type RawMatch = {
  id: number;
  name: string;
  league: string;
  date: string;
  ftscore?: string;
} & Record<string, unknown>;

/**
 * Tips for a tip-store category. Public-tier endpoints fetch without auth (so the
 * tips render server-side for SEO); gated endpoints use the session token and
 * return `null` for non-subscribers (rendered as an upsell).
 */
export async function getCategoryTips(cat: TipCategory): Promise<TipRow[] | null> {
  let data: RawMatch[] | null = null;
  if (cat.gated) {
    data = await authFetch<RawMatch[]>(`getendpoints/${cat.endpoint}`);
  } else {
    try {
      data = await api<RawMatch[]>(`getendpoints/${cat.endpoint}`, {
        next: { revalidate: 300 },
      });
    } catch {
      data = null;
    }
  }
  if (!data) return null;

  return data.map((m) => {
    const raw = m[cat.tipField];
    const tip = cat.marketLabel ? (raw ? cat.marketLabel : "") : String(raw ?? "");
    return {
      id: m.id,
      date: formatDayMonth(m.date),
      league: m.league,
      name: m.name,
      tip,
      score: m.ftscore,
    };
  });
}

/** A board row that keeps the ISO date so the home board can filter by date. */
export type BoardRow = {
  id: number;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Kick-off time, e.g. "15:00" (may be absent). */
  time: string | null;
  league: string;
  name: string;
  tip: string;
  odds: string | null;
};

/**
 * Tips for a *public* tip-store market, mapped for the home board. Keeps the ISO
 * date (so the date picker can filter) and drops empty tips. Gated markets return
 * `[]` — the board renders an unlock panel for those rather than calling them.
 */
export async function getMarketBoardRows(cat: TipCategory): Promise<BoardRow[]> {
  if (cat.gated) return [];

  let data: RawMatch[] | null = null;
  try {
    data = await api<RawMatch[]>(`getendpoints/${cat.endpoint}`, {
      next: { revalidate: 300 },
    });
  } catch {
    data = null;
  }
  if (!data) return [];

  return data
    .map((m) => {
      const raw = m[cat.tipField];
      const tip = cat.marketLabel ? (raw ? cat.marketLabel : "") : String(raw ?? "");
      const odds = m.ft_odds;
      const time = m.time;
      return {
        id: m.id,
        date: typeof m.date === "string" ? m.date.slice(0, 10) : "",
        time: typeof time === "string" && time ? time : null,
        league: m.league,
        name: m.name,
        tip,
        odds: typeof odds === "string" && odds ? odds : null,
      };
    })
    .filter((r) => r.tip && r.date);
}
