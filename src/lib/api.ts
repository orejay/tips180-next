import { siteConfig } from "@/config/site";

/**
 * Thin, typed wrapper over `fetch` for the Tips180 backend.
 *
 * Works in both Server Components (default — enables SSR/ISR for SEO) and
 * Client Components. Prefer calling this from the server so prediction data is
 * present in the initial HTML for crawlers and AI bots.
 */

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiOptions = RequestInit & {
  /** Next.js fetch cache controls. Defaults to a 60s revalidate window. */
  next?: { revalidate?: number | false; tags?: string[] };
};

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${siteConfig.apiUrl}/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // Default ISR window; callers can override (e.g. `next: { revalidate: 0 }`
    // for always-fresh, or `false` to cache indefinitely).
    next: { revalidate: 60, ...options.next },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = await res.text().catch(() => undefined);
    }
    throw new ApiError(`API ${res.status} on ${path}`, res.status, body);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
