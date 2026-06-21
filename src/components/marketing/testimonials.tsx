import { MessageSquareQuote } from "lucide-react";
import { getFeedbacks } from "@/lib/predictions";
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel";
import { FeedbackForm } from "@/components/marketing/feedback-form";

/**
 * "Punters Feedback" testimonials. Server Component fetches the active feedbacks
 * so the quotes render in the initial HTML; the carousel + submission form are
 * client leaves. The feedback form always renders so punters can submit a story.
 */
export async function Testimonials() {
  const feedbacks = await getFeedbacks();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
          <MessageSquareQuote size={19} />
        </span>
        <h2 className="text-2xl font-bold text-foreground lg:text-3xl">Punters Feedback</h2>
        <p className="mt-1.5 max-w-xl text-sm text-muted">
          Real words from punters who keep winning with Tips180.
        </p>
      </div>

      {feedbacks.length > 0 && (
        <div className="mb-10">
          <TestimonialsCarousel items={feedbacks} />
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <FeedbackForm />
      </div>
    </section>
  );
}
