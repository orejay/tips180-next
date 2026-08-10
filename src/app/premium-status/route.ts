import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/api-auth";

/**
 * Whether the visitor's *current* session is on the Premium plan — checked
 * live against the backend (via the httpOnly session token), not the
 * readable `tips180_user` cookie. That cookie is only refreshed at login (and
 * now also right after a plan upgrade — see payment/actions.ts), but a gate
 * this precise shouldn't depend on remembering every place the cookie needs
 * refreshing; hitting the real session is the only version that can't drift.
 *
 * Deliberately NOT under /api/* — see store-preview/route.ts for why.
 */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ premium: user?.accoutplan === "Premium" });
}
