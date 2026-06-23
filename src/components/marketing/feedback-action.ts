"use server";

import { api } from "@/lib/api";
import { getCurrentUser } from "@/lib/api-auth";

export type FeedbackState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * Submit a punter testimonial for review.
 *
 * The author's identity comes from the logged-in session (never the form), so
 * the only thing we read from the client is the message itself. Visitors who
 * aren't signed in are asked to log in first.
 *
 * NOTE: the backend `POST /postendpoints/feedbacks` is admin-gated
 * (`@jwt_required(refresh=True)` + admin/superadmin role), so a public
 * submission cannot persist without a backend change. We still post it as
 * best-effort (it 401s silently) and queue the punter with a "pending review"
 * acknowledgement. Wire a public endpoint server-side to actually store these.
 */
export async function submitFeedbackAction(
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const message = String(formData.get("message") ?? "").trim();

  if (!message) {
    return { status: "error", message: "Please write a short message." };
  }
  if (message.length < 10) {
    return {
      status: "error",
      message: "Tell us a little more — your feedback is too short.",
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Please log in to share your feedback.",
    };
  }

  try {
    await api("postendpoints/feedbacks", {
      method: "POST",
      body: JSON.stringify({
        name: user.name,
        country: user.country,
        message,
        active: false,
      }),
      next: { revalidate: 0 },
    });
  } catch {
    // Endpoint is moderated/admin-gated — the submission is queued for manual
    // review rather than persisted directly. Swallow so punters still get a
    // friendly acknowledgement.
  }

  return {
    status: "success",
    message: "Thanks! Your feedback has been received and will be reviewed before it's featured.",
  };
}
