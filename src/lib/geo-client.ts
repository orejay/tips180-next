/**
 * Client-side IP geolocation for the plan/payment country selectors — calls
 * ipinfo.io directly from the visitor's browser, exactly like the legacy
 * site did. This used to go through our own `/api/geo` route so the token
 * stayed server-only, but that added a round trip through our server AND
 * made country detection depend on nginx correctly threading the visitor's
 * real IP through `X-Forwarded-For`/`X-Real-IP` to Next — one more thing to
 * get right for no real benefit (a free geolocation lookup token isn't
 * something worth protecting). Calling ipinfo directly from the browser
 * sidesteps all of that: ipinfo reads the request's own source IP, which
 * from the browser IS the visitor's real IP, no header relay needed.
 */

const GEO_URL = process.env.NEXT_PUBLIC_GEO_API_URL ?? "https://ipinfo.io";

// Legacy cached the detected country in localStorage (`userCountry`) so a
// visitor's repeat page loads didn't re-hit ipinfo and burn through the
// rotating token pool. Mirrored here under the same key.
const CACHE_KEY = "userCountry";

function geoKeys(): string[] {
  return (process.env.NEXT_PUBLIC_GEO_API_KEYS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/**
 * The visitor's ISO country code, or null if detection is unavailable/fails.
 * Cached in localStorage after the first successful lookup for the session.
 */
export async function detectCountryClient(): Promise<string | null> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return cached;
  } catch {
    // localStorage unavailable (private mode, SSR edge cases) — fall through to a live lookup.
  }

  const keys = geoKeys();
  if (keys.length === 0) return null;

  for (const key of keys) {
    try {
      const res = await fetch(`${GEO_URL}/country?token=${key}`);
      if (res.ok) {
        const code = (await res.text()).trim().toUpperCase();
        if (!/^[A-Z]{2}$/.test(code)) return null;
        try {
          localStorage.setItem(CACHE_KEY, code);
        } catch {
          // ignore write failures
        }
        return code;
      }
      if (res.status === 429) continue; // rate-limited — try the next token
      return null;
    } catch {
      // network error — try the next token
    }
  }
  return null;
}
