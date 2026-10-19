import { NextResponse } from "next/server";
import { getAllLeagues, leagueSlug } from "@/lib/leagues";

export async function GET() {
  const leagues = await getAllLeagues();
  const map: Record<string, string> = {};
  for (const league of leagues) {
    map[leagueSlug(league.short_name)] = league.name;
  }
  return NextResponse.json(map, {
    headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
  });
}
