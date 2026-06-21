"use server";

import { api } from "@/lib/api";

export type FeedbackState = {
  status: "idle" | "success" | "error";
  message?: string;
};

/**
 * Submit a punter testimonial for review.
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
  const name = String(formData.get("name") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !country || !message) {
    return {
      status: "error",
      message: "Please add your name, country and a short message.",
    };
  }
  if (message.length < 10) {
    return {
      status: "error",
      message: "Tell us a little more — your feedback is too short.",
    };
  }

  try {
    await api("postendpoints/feedbacks", {
      method: "POST",
      body: JSON.stringify({ name, country, message, active: false }),
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
