import "server-only";
import { cache } from "react";
import { siteConfig } from "@/config/site";
import { getToken } from "@/lib/session";

/**
 * Authenticated, server-side API access for the dashboard. Reads the httpOnly
 * `tips180_token` cookie and sends it as the Bearer token. Returns `null` on any
 * failure (no token, network error, non-2xx) so callers can render a graceful
 * empty/locked state rather than crashing the private page.
 */
export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const token = await getToken();
  if (!token) return null;

  try {
    const res = await fetch(`${siteConfig.apiUrl}/${path.replace(/^\//, "")}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    if (res.status === 204) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Full user payload returned by `/getendpoints/auth` (subscription statuses). */
export type DashboardUser = {
  is_authenticated: boolean;
  user_id: number | string;
  name: string;
  email: string;
  country: string;
  phone: string;
  accoutplan: string;
  acc_plan_exp: string;
  ref_code: string;
  ref_points: number;
  loyalty_points: number;
  balance: number;
  rsubscriptstatus: string;
  isubscriptstatus: string;
  smart_exp: string;
  odds50status: string;
  odds50_exp: string;
  w10subscriptstatus: string;
  w10_exp: string;
  rollsubscriptstatus: string;
  roll_exp: string;
};

/**
 * The current authenticated user, validated against the backend. Memoised per
 * request via React `cache` so the layout and page don't double-fetch.
 */
export const getCurrentUser = cache(async (): Promise<DashboardUser | null> => {
  const data = await authFetch<{ auth: boolean; user_data: DashboardUser }>(
    "getendpoints/auth",
  );
  return data?.user_data ?? null;
});

/** Treat any non-"inactive"/empty status string as an active subscription. */
export function isActive(status: string | null | undefined): boolean {
  if (!status) return false;
  return status.toLowerCase() !== "inactive";
}
