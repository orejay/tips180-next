import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getRolloverRows, productOdds, type DayWindow } from "@/lib/plan-tips";
import { getDayBookingWindow } from "@/lib/bookings";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { TotalOddsBanner } from "@/components/dashboard/total-odds-banner";
import { TipsTable } from "@/components/dashboard/tips-table";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { TipsterBadge } from "@/components/marketing/tipster-badge";

export const metadata: Metadata = { title: "Rollover Bet" };

export default async function RolloverPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/rollover");

  const locked = !isActive(user.rollsubscriptstatus);
  const window = locked ? null : await getRolloverRows();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Rollover Bet</h1>
      {locked || window === null ? (
        <PlanLocked plan="Rollover" />
      ) : (
        <RolloverContent window={window} />
      )}
    </div>
  );
}

/**
 * Total odds per day are computed here from each match's own `rolloverodds`
 * (the running product, matching the rollover accumulator) rather than
 * trusted off the backend's `today_odds`/`tomorrow_odds`/`yesterday_odds`
 * aggregate, which is computed from a separate all-rollover-matches query and
 * can drift from the exact rows shown in a given day's table. The booking
 * code DOES come from the backend, but it's posted per-day (each booking row
 * carries its own date) — {@link getDayBookingWindow} buckets those so
 * yesterday/today/tomorrow each show their own code instead of one code
 * repeated across all three tabs.
 */
async function RolloverContent({ window }: { window: DayWindow }) {
  const bookingWindow = await getDayBookingWindow("rollover");

  return (
    <>
      <DayTabs
        labels={["Yesterday", "Today", "Tomorrow"]}
        defaultIndex={1}
        panels={[
          <div key="yesterday">
            <TipsTable rows={window.yesterday} hideDateOnMobile />
            <TotalOddsBanner
              totalOdds={productOdds(window.yesterday)}
              booking={window.yesterday.length > 0 ? (bookingWindow.yesterday?.booking ?? null) : null}
            />
          </div>,
          <div key="today">
            <TipsTable rows={window.today} hideDateOnMobile />
            <TotalOddsBanner
              totalOdds={productOdds(window.today)}
              booking={window.today.length > 0 ? (bookingWindow.today?.booking ?? null) : null}
            />
          </div>,
          <div key="tomorrow">
            <TipsTable rows={window.tomorrow} hideDateOnMobile />
            <TotalOddsBanner
              totalOdds={productOdds(window.tomorrow)}
              booking={window.tomorrow.length > 0 ? (bookingWindow.tomorrow?.booking ?? null) : null}
            />
          </div>,
        ]}
      />
      <TipsterBadge category="rollover" />
    </>
  );
}
