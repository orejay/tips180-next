import { getPlanBooking, bookieLogo } from "@/lib/bookings";
import { BookingCodeCard } from "@/components/marketing/booking-code-card";

/**
 * Booking-code banner for a dashboard plan set (e.g. "expertsacca1", "odds501",
 * "w102", "smartbet", "rollover"). Fetches the loadable code + total odds on the
 * server and renders nothing when no code is posted for the set.
 */
export async function PlanBooking({ category }: { category: string }) {
  const result = await getPlanBooking(category);
  if (!result) return null;

  return (
    <BookingCodeCard
      booking={result.booking}
      logo={bookieLogo(result.booking.bookie)}
      totalOdds={result.totalOdds}
    />
  );
}
