import { getOddsSet, type FiveDayWindow } from "@/lib/plan-tips";
import { getOddsBooking } from "@/lib/bookings";
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
          <TotalOddsBanner totalOdds={booking1?.totalOdds ?? null} booking={booking1?.booking ?? null} />
        </div>,
        <div key="2">
          <FiveDayWindowTabs window={set2 ?? EMPTY_WINDOW} />
          <TotalOddsBanner totalOdds={booking2?.totalOdds ?? null} booking={booking2?.booking ?? null} />
        </div>,
      ]}
    />
  );
}
