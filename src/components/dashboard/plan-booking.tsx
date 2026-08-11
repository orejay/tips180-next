import { getPlanBooking } from "@/lib/bookings";
import { TotalOddsBanner } from "@/components/dashboard/total-odds-banner";

/**
 * Booking-code + total-odds banner for a dashboard plan set (e.g.
 * "expertsacca1", "odds501", "w102", "smartbet", "rollover"). Fetches on the
 * server and renders nothing when neither a code nor a total odds figure is
 * posted for the set.
 */
export async function PlanBooking({ category }: { category: string }) {
  const result = await getPlanBooking(category);
  if (!result) return null;

  return <TotalOddsBanner totalOdds={result.totalOdds} booking={result.booking} />;
}
