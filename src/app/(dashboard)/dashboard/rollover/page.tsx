import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getRolloverRows, productOdds, type DayWindow } from "@/lib/plan-tips";
import { getPlanBooking } from "@/lib/bookings";
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
 * code itself still comes from the backend (it's independent of any match).
 */
async function RolloverContent({ window }: { window: DayWindow }) {
  const planBooking = await getPlanBooking("rollover");
  const booking = planBooking?.booking ?? null;

  return (
    <>
      <DayTabs
        labels={["Yesterday", "Today", "Tomorrow"]}
        defaultIndex={1}
        panels={[
          <div key="yesterday">
            <TipsTable rows={window.yesterday} />
            <TotalOddsBanner totalOdds={productOdds(window.yesterday)} booking={booking} />
          </div>,
          <div key="today">
            <TipsTable rows={window.today} />
            <TotalOddsBanner totalOdds={productOdds(window.today)} booking={booking} />
          </div>,
          <div key="tomorrow">
            <TipsTable rows={window.tomorrow} />
            <TotalOddsBanner totalOdds={productOdds(window.tomorrow)} booking={booking} />
          </div>,
        ]}
      />
      <TipsterBadge category="rollover" />
    </>
  );
}
