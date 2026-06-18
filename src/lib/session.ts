import "server-only";
import { cookies } from "next/headers";

/**
 * Cookie-based session. Replaces the legacy localStorage approach (locked
 * decision: move session handling to cookies/middleware).
 *
 *  - `tips180_token` is httpOnly — the backend refresh-token JWT used as the
 *    Bearer for authenticated API calls from Server Components / route handlers.
 *  - `tips180_user` is readable by the client so the header can show the logged-in
 *    name/plan without forcing the marketing pages to render dynamically. It holds
 *    only non-sensitive display fields.
 */

export const TOKEN_COOKIE = "tips180_token";
export const USER_COOKIE = "tips180_user";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Minimal, display-safe slice of the login response stored client-readable. */
export type SessionUser = {
  name: string;
  email: string;
  plan: string;
  subscribed: boolean;
};

/** Map the backend login payload to the cookie session shape. */
export function toSessionUser(login: {
  name?: string;
  email?: string;
  accoutplan?: string;
  rsubscriptstatus?: string;
}): SessionUser {
  return {
    name: login.name ?? "",
    email: login.email ?? "",
    plan: login.accoutplan ?? "Free",
    subscribed: (login.accoutplan ?? "Free") !== "Free",
  };
}

export async function setSession(token: string, user: SessionUser): Promise<void> {
  const store = await cookies();
  const secure = process.env.NODE_ENV === "production";
  store.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  store.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: false,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
