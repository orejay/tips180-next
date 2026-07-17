import { PlanStores } from "@/components/marketing/plan-stores";
import { PlanRecommender } from "@/components/marketing/plan-recommender";

/**
 * Home "stores" block: prediction stores grouped by subscription plan (left)
 * beside the plan recommender widget (right). Anchored as `#all-stores` so the
 * "View More Stores" link in the predictions rail scrolls here.
 */
export function LandingStore() {
  return (
    <section
      id="all-stores"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-10"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* Stores by subscription plan */}
        <div className="lg:w-3/5">
          <PlanStores />
        </div>

        {/* Plan recommender */}
        <div className="lg:w-2/5">
          <PlanRecommender />
        </div>
      </div>
    </section>
  );
}
