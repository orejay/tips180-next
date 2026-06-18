import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with TOKEN_COOKIE in lib/session.ts (can't import it here — that
// module pulls in `server-only`/`next/headers`, unavailable in the proxy runtime).
const TOKEN_COOKIE = "tips180_token";

/**
 * Request proxy (Next 16's renamed middleware). Gates the private dashboard:
 * no session cookie -> redirect to login.
 */
export function proxy(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
