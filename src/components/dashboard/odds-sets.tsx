import { Ticket } from "lucide-react";
import { getOddsSet, type FiveDayWindow } from "@/lib/plan-tips";
import { getOddsBooking, bookieLogo } from "@/lib/bookings";
import { TipsTable } from "@/components/dashboard/tips-table";
import { SetTabs } from "@/components/dashboard/set-tabs";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { BookingCodeCard } from "@/components/marketing/booking-code-card";

const EMPTY_WINDOW: FiveDayWindow = {
  dayBeforeYesterday: [],
  yesterday: [],
  today: [],
  tomorrow: [],
  dayAfterTomorrow: [],
};

function FiveDayWindowTabs({ window }: { window: FiveDayWindow }) {
  return (
    <DayTabs
      labels={["2 Days Ago", "Yesterday", "Today", "Tomorrow", "In 2 Days"]}
      defaultIndex={2}
      panels={[
        <TipsTable key="dayBeforeYesterday" rows={window.dayBeforeYesterday} />,
        <TipsTable key="yesterday" rows={window.yesterday} />,
        <TipsTable key="today" rows={window.today} />,
        <TipsTable key="tomorrow" rows={window.tomorrow} />,
        <TipsTable key="dayAfterTomorrow" rows={window.dayAfterTomorrow} />,
      ]}
    />
  );
}

/**
 * Total-odds + booking-code banner for one odds2/odds3 set. Unlike the other
 * plan pages, the booking code here can be missing even when a total odds
 * figure is posted (they're entered independently), so this can't just reuse
 * `<PlanBooking>` (which requires a booking).
 */
function OddsSetTotal({ totalOdds, booking }: { totalOdds: string | null; booking: Parameters<typeof BookingCodeCard>[0]["booking"] | null }) {
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

/** Renders the two prediction sets for the 2-odds / 3-odds Premium plans. */
export async function OddsSets({ kind }: { kind: "sure2" | "sure3" }) {
  const bookingKind = kind === "sure2" ? "odds2" : "odds3";
  const [set1, set2, booking1, booking2] = await Promise.all([
    getOddsSet(kind, 1),
    getOddsSet(kind, 2),
    getOddsBooking(bookingKind, 1),
    getOddsBooking(bookingKind, 2),
  ]);

  return (
    <SetTabs
      panels={[
        <div key="1">
          <FiveDayWindowTabs window={set1 ?? EMPTY_WINDOW} />
          <OddsSetTotal totalOdds={booking1?.totalOdds ?? null} booking={booking1?.booking ?? null} />
        </div>,
        <div key="2">
          <FiveDayWindowTabs window={set2 ?? EMPTY_WINDOW} />
          <OddsSetTotal totalOdds={booking2?.totalOdds ?? null} booking={booking2?.booking ?? null} />
        </div>,
      ]}
    />
  );
}
