import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with TOKEN_COOKIE in lib/session.ts (can't import it here — that
// module pulls in `server-only`/`next/headers`, unavailable in the proxy runtime).
const TOKEN_COOKIE = "tips180_token";

/**
 * Request proxy (Next 16's renamed middleware). Gates the private dashboard:
 * no session cookie -> redirect to login. Also forces every page response to
 * `no-store` — the client needs admin edits to show up immediately, and
 * without a CDN in front, Next's default ISR `Cache-Control` (s-maxage +
 * up to a 1-year stale-while-revalidate) lets a visitor's own browser serve
 * an old cached copy without ever asking the server again. `revalidateTag()`
 * already keeps Next's own server-side cache instantly fresh after the
 * on-demand webhook fires (verified: ETag changes on the very next request),
 * so forcing every navigation to hit the server costs nothing but a fast
 * cache-backed render, and guarantees no client ever sees stale HTML.
 */
export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) {
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("from", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "private, no-cache, no-store, max-age=0, must-revalidate");
  return res;
}

export const config = {
  // Every page except static assets, images, and API/webhook routes (those
  // set their own headers and must not be touched here).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
