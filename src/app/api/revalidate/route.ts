import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * Webhook the backend (tips-back-new) calls right after an admin write, so
 * content edits (bookings, page-content, tipsters, ...) show up in seconds
 * instead of waiting out the ISR cache window (up to 1h for some resources).
 * See `app/services/revalidate.py::notify_revalidate` on the backend side.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ revalidated: false, error: "not configured" }, { status: 501 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ revalidated: false, error: "unauthorized" }, { status: 401 });
  }

  let tags: unknown;
  try {
    ({ tags } = await request.json());
  } catch {
    return NextResponse.json({ revalidated: false, error: "invalid body" }, { status: 400 });
  }
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    return NextResponse.json({ revalidated: false, error: "tags must be a string[]" }, { status: 400 });
  }

  for (const tag of tags as string[]) {
    // { expire: 0 } = no stale-while-revalidate window — the next request for
    // this tag blocks until fresh data is fetched, so the change is visible
    // immediately rather than after one more stale serve.
    revalidateTag(tag, { expire: 0 });
  }

  return NextResponse.json({ revalidated: true, tags });
}
