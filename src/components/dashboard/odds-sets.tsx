import { getOddsSet, type FiveDayWindow } from "@/lib/plan-tips";
import { getOddsBookingWindow, type FiveDayBookingWindow } from "@/lib/bookings";
import { TipsTable } from "@/components/dashboard/tips-table";
import { SetTabs } from "@/components/dashboard/set-tabs";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { TotalOddsBanner } from "@/components/dashboard/total-odds-banner";

const EMPTY_WINDOW: FiveDayWindow = {
  dayBeforeYesterday: [],
  yesterday: [],
  today: [],
  tomorrow: [],
  dayAfterTomorrow: [],
};

const EMPTY_BOOKING_WINDOW: FiveDayBookingWindow = {
  totalOdds: null,
  dayBeforeYesterday: null,
  yesterday: null,
  today: null,
  tomorrow: null,
  dayAfterTomorrow: null,
};

/**
 * `totalOdds` is the same figure on every day tab (it's posted once per set,
 * not per day — see {@link getOddsBookingWindow}), but the booking code
 * varies per day tab, so `TotalOddsBanner` has to live inside each panel
 * rather than once for the whole set.
 */
function FiveDayWindowTabs({
  window,
  bookingWindow,
}: {
  window: FiveDayWindow;
  bookingWindow: FiveDayBookingWindow;
}) {
  const { totalOdds } = bookingWindow;
  return (
    <DayTabs
      labels={["2 Days Ago", "Yesterday", "Today", "Tomorrow", "In 2 Days"]}
      defaultIndex={2}
      panels={[
        <div key="dayBeforeYesterday">
          <TipsTable rows={window.dayBeforeYesterday} hideDateOnMobile />
          <TotalOddsBanner totalOdds={totalOdds} booking={bookingWindow.dayBeforeYesterday} />
        </div>,
        <div key="yesterday">
          <TipsTable rows={window.yesterday} hideDateOnMobile />
          <TotalOddsBanner totalOdds={totalOdds} booking={bookingWindow.yesterday} />
        </div>,
        <div key="today">
          <TipsTable rows={window.today} hideDateOnMobile />
          <TotalOddsBanner totalOdds={totalOdds} booking={bookingWindow.today} />
        </div>,
        <div key="tomorrow">
          <TipsTable rows={window.tomorrow} hideDateOnMobile />
          <TotalOddsBanner totalOdds={totalOdds} booking={bookingWindow.tomorrow} />
        </div>,
        <div key="dayAfterTomorrow">
          <TipsTable rows={window.dayAfterTomorrow} hideDateOnMobile />
          <TotalOddsBanner totalOdds={totalOdds} booking={bookingWindow.dayAfterTomorrow} />
        </div>,
      ]}
    />
  );
}

/** Renders the two prediction sets for the 2-odds / 3-odds Premium plans. */
export async function OddsSets({ kind }: { kind: "sure2" | "sure3" }) {
  const bookingKind = kind === "sure2" ? "odds2" : "odds3";
  const [set1, set2, bookingWindow1, bookingWindow2] = await Promise.all([
    getOddsSet(kind, 1),
    getOddsSet(kind, 2),
    getOddsBookingWindow(bookingKind, 1),
    getOddsBookingWindow(bookingKind, 2),
  ]);

  return (
    <SetTabs
      panels={[
        <div key="1">
          <FiveDayWindowTabs
            window={set1 ?? EMPTY_WINDOW}
            bookingWindow={bookingWindow1 ?? EMPTY_BOOKING_WINDOW}
          />
        </div>,
        <div key="2">
          <FiveDayWindowTabs
            window={set2 ?? EMPTY_WINDOW}
            bookingWindow={bookingWindow2 ?? EMPTY_BOOKING_WINDOW}
          />
        </div>,
      ]}
    />
  );
}
