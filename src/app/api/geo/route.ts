import { NextResponse } from "next/server";
import { detectCountry } from "@/lib/geo";

/** Returns the visitor's ISO country code (or null) for client-side defaults. */
export async function GET() {
  const country = await detectCountry();
  return NextResponse.json({ country });
}
