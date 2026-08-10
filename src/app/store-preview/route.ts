import { NextRequest, NextResponse } from "next/server";
import { getTipCategory } from "@/config/tip-store";
import { getStoreTips } from "@/lib/tip-store";
import { authFetch } from "@/lib/api-auth";
import type { BoardRow } from "@/lib/tip-store";

/** Local YYYY-MM-DD, matching how the home board keys tips by date. */
function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

type Sure2Match = {
  id: number;
  date: string;
  league: string;
  name: string;
  sure2tip?: string;
};

/**
 * Re-checks a gated home-board store pill (BTTS, Weekend Tips, 2 Odds) against
 * the visitor's real session. The board itself is server-rendered/ISR for SEO
 * and has no access to the session cookie, so `free-tips.tsx` always ships
 * these pills as `locked: true`; `FreeBoard` calls this client-side after
 * mount to unlock them for a signed-in subscriber. `rows: null` means "stays
 * locked" (no session, or the plan doesn't cover this category) — matches the
 * same authFetch-returns-null-on-401 convention used by /tip-store/[name].
 *
 * Deliberately NOT under /api/* — nginx proxies /api/ to the Flask backend
 * except for a couple of explicitly carved-out paths, so a Next-only route
 * placed under /api/ 404s (wrong server) unless that carve-out is added
 * server-side too. Living outside /api/ avoids needing any nginx change.
 */
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("cat");

  // "2 Odds" has no public tip-store category — it's a Premium-only dashboard
  // endpoint with its own match shape, so it's handled separately here.
  if (slug === "sure2") {
    const data = await authFetch<Sure2Match[]>("tips/sure2/1");
    if (!Array.isArray(data)) return NextResponse.json({ rows: null });
    const today = todayIso();
    const rows: BoardRow[] = data
      .filter((m) => m.date?.slice(0, 10) === today && m.sure2tip)
      .map((m) => ({
        id: m.id,
        date: m.date.slice(0, 10),
        time: null,
        league: m.league,
        name: m.name,
        tip: m.sure2tip!,
        odds: null,
      }));
    return NextResponse.json({ rows });
  }

  const cat = slug ? getTipCategory(slug) : undefined;
  if (!cat || !cat.gated) return NextResponse.json({ rows: null });

  const rows = await getStoreTips(cat);
  return NextResponse.json({ rows });
}
