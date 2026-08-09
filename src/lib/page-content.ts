import { api } from "@/lib/api";

/**
 * Admin-editable prose blocks for a marketing page (Best Betting Sites hub +
 * its per-country pages), managed in tips180-theta's "Page Content" section.
 * Public, fail-soft: a page with nothing set returns `{}` and every block
 * falls back to its hardcoded default via `resolveBlock`.
 *
 *  - GET /page-content/<page_slug> -> { [block_key]: { heading, body } }
 */
export type PageContentBlock = { heading: string | null; body: string | null };
export type PageContent = Record<string, PageContentBlock>;

export async function getPageContent(pageSlug: string): Promise<PageContent> {
  try {
    return await api<PageContent>(`page-content/${encodeURIComponent(pageSlug)}`, {
      next: { revalidate: 3600 },
    });
  } catch {
    return {};
  }
}

/**
 * Resolve one block's heading/body against hardcoded defaults — an admin
 * value wins only when it's actually been set (non-blank); otherwise the
 * default renders exactly as before this system existed.
 */
export function resolveBlock(
  blocks: PageContent,
  key: string,
  fallback: { heading?: string; body?: string },
): { heading: string; body: string } {
  const block = blocks[key];
  return {
    heading: block?.heading?.trim() || fallback.heading || "",
    body: block?.body?.trim() || fallback.body || "",
  };
}
