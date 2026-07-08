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
 * Persists via the public `POST /feedbacks/submit` endpoint, which stores the
 * testimonial as inactive (`active=false`); an admin then marks it displayed in
 * the dashboard before it appears on the site.
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
      message: "Tell us a little more, your feedback is too short.",
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
    const res = await api<{ created?: boolean }>("feedbacks/submit", {
      method: "POST",
      body: JSON.stringify({
        name: user.name,
        country: user.country,
        message,
      }),
      next: { revalidate: 0 },
    });
    if (!res?.created) {
      return {
        status: "error",
        message: "Sorry, we couldn't submit your feedback. Please try again.",
      };
    }
  } catch {
    return {
      status: "error",
      message: "Network error. Please try again.",
    };
  }

  return {
    status: "success",
    message:
      "Thanks! Your feedback has been received and will be reviewed before it's featured.",
  };
}
