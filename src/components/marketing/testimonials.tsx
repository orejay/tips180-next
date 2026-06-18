import { getFeedbacks } from "@/lib/predictions";
import { TestimonialsCarousel } from "@/components/marketing/testimonials-carousel";

/**
 * "Punters Feedback" testimonials. Server Component fetches the active feedbacks
 * so the quotes render in the initial HTML; the carousel interactivity is a
 * client leaf. Renders nothing if there are no testimonials.
 */
export async function Testimonials() {
  const feedbacks = await getFeedbacks();
  if (feedbacks.length === 0) return null;

  return (
    <section className="bg-background py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground lg:text-3xl">
          Punters Feedback
        </h2>
        <TestimonialsCarousel items={feedbacks} />
      </div>
    </section>
  );
}
