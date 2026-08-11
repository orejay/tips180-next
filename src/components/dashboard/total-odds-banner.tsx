import { Ticket } from "lucide-react";
import type { Booking } from "@/lib/bookings";
import { bookieLogo } from "@/lib/bookings";
import { BookingCodeCard } from "@/components/marketing/booking-code-card";

/**
 * Total-odds + booking-code banner. The booking code and total odds figure
 * are posted independently by the admin (e.g. the total odds lands on the
 * first open match, no booking record required), so either can be present
 * without the other — renders nothing only when both are absent.
 */
export function TotalOddsBanner({
  totalOdds,
  booking,
}: {
  totalOdds: string | null;
  booking: Booking | null;
}) {
  if (!totalOdds && !booking) return null;
  if (booking) {
    return (
      <div className="mt-4">
        <BookingCodeCard booking={booking} logo={bookieLogo(booking.bookie)} totalOdds={totalOdds} />
      </div>
    );
  }
  return (
    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <Ticket size={14} className="shrink-0 text-subtle" />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
        Total odds
      </span>
      <span className="font-mono text-lg font-extrabold text-foreground">{totalOdds}</span>
    </div>
  );
}
