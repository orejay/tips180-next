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
