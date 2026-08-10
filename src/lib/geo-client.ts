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

function geoKeys(): string[] {
  return (process.env.NEXT_PUBLIC_GEO_API_KEYS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/** The visitor's ISO country code, or null if detection is unavailable/fails. */
export async function detectCountryClient(): Promise<string | null> {
  const keys = geoKeys();
  if (keys.length === 0) return null;

  for (const key of keys) {
    try {
      const res = await fetch(`${GEO_URL}/country?token=${key}`);
      if (res.ok) {
        const code = (await res.text()).trim().toUpperCase();
        return /^[A-Z]{2}$/.test(code) ? code : null;
      }
      if (res.status === 429) continue; // rate-limited — try the next token
      return null;
    } catch {
      // network error — try the next token
    }
  }
  return null;
}
