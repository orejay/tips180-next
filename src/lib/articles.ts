import { api } from "@/lib/api";

/**
 * Editorial byline (last-updated date + author) for a long-form guide page,
 * admin-managed in tips180-theta ("Guide Pages") so it can change without a
 * code deploy. Public, fail-soft: an unset slug returns `null` and callers
 * fall back to a build-time default date/author.
 *
 *  - GET /articles/<slug> -> ArticleMeta | {}
 */
export type ArticleMeta = {
  id: number;
  slug: string;
  title: string | null;
  author: string;
  author_role: string | null;
  author_bio: string | null;
  last_updated: string; // YYYY-MM-DD
};

export async function getArticleMeta(slug: string): Promise<ArticleMeta | null> {
  try {
    const data = await api<ArticleMeta | Record<string, never>>(
      `articles/${encodeURIComponent(slug)}`,
      { next: { revalidate: 3600 } },
    );
    return data && typeof data === "object" && "slug" in data
      ? (data as ArticleMeta)
      : null;
  } catch {
    return null;
  }
}

/** Parses a `YYYY-MM-DD` string as a local date (avoids UTC-shift off-by-one). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}
