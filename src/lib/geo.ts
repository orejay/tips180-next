import "server-only";
import { headers } from "next/headers";

/**
 * IP geolocation (legacy used ipinfo.io with rotating tokens). Runs server-side
 * so the tokens stay private and we use the real client IP from request headers
 * — the legacy exposed the keys to the browser. Tokens come from `GEO_API_KEYS`
 * (comma-separated); rotates to the next on a 429. Fail-soft -> null.
 */

const GEO_URL = process.env.GEO_API_URL ?? "https://ipinfo.io";

function geoKeys(): string[] {
  return (process.env.GEO_API_KEYS ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

/** Look up the ISO country code for an IP via ipinfo, rotating keys on rate-limit. */
export async function lookupCountry(ip: string): Promise<string | null> {
  const keys = geoKeys();
  if (keys.length === 0) return null;
  const ipPath = ip ? `/${ip}` : "";

  for (const key of keys) {
    try {
      const res = await fetch(`${GEO_URL}${ipPath}/country?token=${key}`, { cache: "no-store" });
      if (res.ok) {
        const code = (await res.text()).trim().toUpperCase();
        if (/^[A-Z]{2}$/.test(code)) return code;
        return null;
      }
      if (res.status === 429) continue; // rate-limited — try the next token
      return null;
    } catch {
      // network error — try the next token
    }
  }
  return null;
}

/** Client IP from the request headers (first hop of x-forwarded-for / x-real-ip). */
async function clientIp(): Promise<string> {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
  const ip = fwd.split(",")[0]?.trim() ?? "";
  // Ignore loopback/private during local dev — ipinfo then uses the server IP.
  if (!ip || ip.startsWith("127.") || ip.startsWith("::1") || ip === "::1") return "";
  return ip;
}

/** Detect the visitor's ISO country code from the current request. */
export async function detectCountry(): Promise<string | null> {
  return lookupCountry(await clientIp());
}
