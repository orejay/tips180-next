import { NextRequest, NextResponse } from "next/server";
import { getPwFee, getPwPrize, hasPaidEntry, pwSymbol, PW_COUNTRIES } from "@/lib/predict-win";

/**
 * Predict & Win's fee/prize/paid-status for a given country + round, refetched
 * client-side once the browser resolves the visitor's real country (see
 * `predict-game-geo.tsx`). The page itself renders with the user's profile
 * country as a same-render fallback (no IP lookup — everywhere geo runs
 * client-side now, this route exists only because the page's initial data
 * needs *some* value server-side before the client can correct it).
 *
 * Deliberately NOT under /api/* — nginx proxies /api/ to the Flask backend
 * except for a couple of explicitly carved-out paths, so a Next-only route
 * placed under /api/ 404s (wrong server) unless that carve-out is added
 * server-side too. Living outside /api/ avoids needing any nginx change.
 */
export async function GET(req: NextRequest) {
  const country = req.nextUrl.searchParams.get("country") ?? "";
  const setId = Number(req.nextUrl.searchParams.get("setId"));
  if (!PW_COUNTRIES.some((c) => c.label === country) || !Number.isFinite(setId)) {
    return NextResponse.json({ error: "invalid country or setId" }, { status: 400 });
  }

  const [fee, prize, paid] = await Promise.all([
    getPwFee(country),
    getPwPrize(country),
    hasPaidEntry(country, setId),
  ]);

  return NextResponse.json({ country, fee, prize, paid, symbol: pwSymbol(country) });
}
