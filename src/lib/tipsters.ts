import { api } from "@/lib/api";

/**
 * Tipster attribution. The admin attaches a tipster to a store/market category for
 * a date; the public site looks that up per category so a date's prediction list
 * can show who's behind it. The endpoint is public and fail-soft.
 *
 *  - GET /tipsters/for/<category>/<YYYY-MM-DD>  -> Tipster | {}
 *  - GET /tipsters/<id>/profile                 -> Tipster | {}  (full profile page)
 */

export type Tipster = {
  id: number;
  name: string;
  role: string | null;
  experience: string | null;
  win_rate_7d: string | null;
  win_rate_overall: string | null;
  favourite_sports: string | null;
  favourite_team: string | null;
  favourite_bet_type: string | null;
  favourite_bookmaker: string | null;
  image_url: string | null;
};

/** Local YYYY-MM-DD, matching how the admin + backend store the assignment date. */
function todayIso(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** The tipster attached to a category for a date (defaults to today), or null. */
export async function getTipsterFor(
  category: string,
  date?: string,
): Promise<Tipster | null> {
  const iso = date ?? todayIso();
  try {
    const data = await api<Tipster | Record<string, never>>(
      `tipsters/for/${encodeURIComponent(category)}/${iso}`,
      { next: { revalidate: 300 } },
    );
    return data && typeof data === "object" && "id" in data
      ? (data as Tipster)
      : null;
  } catch {
    return null;
  }
}

/** A single tipster's full profile by id (public), or null. */
export async function getTipster(id: number | string): Promise<Tipster | null> {
  try {
    const data = await api<Tipster | Record<string, never>>(
      `tipsters/${encodeURIComponent(String(id))}/profile`,
      { next: { revalidate: 300 } },
    );
    return data && typeof data === "object" && "id" in data
      ? (data as Tipster)
      : null;
  } catch {
    return null;
  }
}

/**
 * Resolve a backend-relative avatar (`/uploads/photos/..`) to an absolute URL.
 * The host is hardcoded on purpose (never point avatars at localhost/staging),
 * and nginx serves the uploads folder under the API mount — `/api/uploads/photos`
 * (see the server config) — so the path needs the `/api` prefix.
 */
export function tipsterImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `https://www.tips180.com/api${path}`;
}
