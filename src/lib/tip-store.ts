import { api } from "@/lib/api";
import { authFetch } from "@/lib/api-auth";
import type { TipCategory } from "@/config/tip-store";

type RawMatch = {
  id: number;
  name: string;
  league: string;
  date: string;
  ftscore?: string;
} & Record<string, unknown>;

/**
 * A tip-store row that keeps the ISO date + time (and HT/FT scores, odds) so the
 * per-page board can offer the legacy date filter and the right columns.
 */
export type StoreTipRow = {
  id: number;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** Kick-off time, e.g. "15:00" (may be absent). */
  time: string | null;
  league: string;
  name: string;
  tip: string;
  /** Single Bet odds (only populated for the single-bet market). */
  odds: string | null;
  /** Half-time score (HT/FT and Half Time markets). */
  htscore: string | null;
  /** Full-time result. */
  ftscore: string | null;
  /** Trending-match headline (only populated for the Trending Matches market). */
  title?: string | null;
  /** Trending-match write-up (only populated for the Trending Matches market). */
  analysis?: string | null;
  /** Trending-match confidence, 1-100 (only populated for the Trending Matches market). */
  percentage?: number | null;
};

/**
 * Tips for a tip-store category, preserving the ISO date/time so the page board
 * can filter by day like the legacy StoreTable. Gated endpoints use the session
 * token and return `null` for non-subscribers (rendered as an upsell).
 */
export async function getStoreTips(cat: TipCategory): Promise<StoreTipRow[] | null> {
  let data: RawMatch[] | null = null;
  if (cat.gated) {
    data = await authFetch<RawMatch[]>(`tips/${cat.endpoint}`);
  } else {
    try {
      data = await api<RawMatch[]>(`tips/${cat.endpoint}`, {
        next: { revalidate: 300 },
      });
    } catch {
      data = null;
    }
  }
  if (!Array.isArray(data)) return null;

  const str = (v: unknown) => (typeof v === "string" && v ? v : null);

  return data
    .map((m) => {
      const raw = m[cat.tipField];
      const tip = cat.marketLabel ? (raw ? cat.marketLabel : "") : String(raw ?? "");
      return {
        id: m.id,
        date: typeof m.date === "string" ? m.date.slice(0, 10) : "",
        time: str(m.time),
        league: m.league,
        name: m.name,
        tip,
        odds: str(m.singlebetodds),
        htscore: str(m.htscore),
        ftscore: str(m.ftscore),
        title: str(m.trendytitle),
        analysis: str(m.trendyanalysis),
        percentage: typeof m.trendypercentage === "number" ? m.trendypercentage : null,
      };
    })
    .filter((r) => r.tip && r.date);
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
  /** Trending-match headline (only populated for the Trending Matches market). */
  title?: string | null;
  /** Trending-match write-up (only populated for the Trending Matches market). */
  analysis?: string | null;
  /** Trending-match confidence, 1-100 (only populated for the Trending Matches market). */
  percentage?: number | null;
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
    data = await api<RawMatch[]>(`tips/${cat.endpoint}`, {
      next: { revalidate: 300 },
    });
  } catch {
    data = null;
  }
  if (!Array.isArray(data)) return [];

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
        title: typeof m.trendytitle === "string" && m.trendytitle ? m.trendytitle : null,
        analysis: typeof m.trendyanalysis === "string" && m.trendyanalysis ? m.trendyanalysis : null,
        percentage: typeof m.trendypercentage === "number" ? m.trendypercentage : null,
      };
    })
    .filter((r) => r.tip && r.date);
}
