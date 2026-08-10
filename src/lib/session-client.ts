/**
 * Client-side read of the readable session cookie (`tips180_user` — see
 * `lib/session.ts`; the httpOnly token cookie stays server-only). Shared by
 * every client component that needs to know "is this visitor logged in /
 * what plan do they have" without a network round trip.
 */

export type SessionUser = { name: string; email: string; plan: string; subscribed: boolean };

const USER_COOKIE = "tips180_user";

export function readSessionUser(): SessionUser | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${USER_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as SessionUser;
  } catch {
    return null;
  }
}
