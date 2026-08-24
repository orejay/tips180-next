import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getSmartBetRows, getSmartBetPlusRows } from "@/lib/plan-tips";
import { getDayBookingWindow } from "@/lib/bookings";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TotalOddsBanner } from "@/components/dashboard/total-odds-banner";
import { TipsTable } from "@/components/dashboard/tips-table";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { SetTabs } from "@/components/dashboard/set-tabs";
import { TipsterBadge } from "@/components/marketing/tipster-badge";
import { SmartBetStrategy } from "@/components/dashboard/smart-bet-strategy";

export const metadata: Metadata = { title: "Smart Bet Plan" };

export default async function SmartBetPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/smartbet");

  const locked = !isActive(user.isubscriptstatus);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Smart Bet Plan</h1>
      {locked ? <PlanLocked plan="Smart Bet" /> : <SmartBetPanels />}
    </div>
  );
}

async function SmartBetPanels() {
  const [window, plusRows, bookingWindow] = await Promise.all([
    getSmartBetRows(),
    getSmartBetPlusRows(),
    getDayBookingWindow("smartbet"),
  ]);

  return (
    <SetTabs
      labels={["Smart Bet", "Smart Bet Plus", "Strategy"]}
      panels={[
        <div key="smartbet">
          {window === null ? (
            <p className="rounded-lg border border-border py-10 text-center text-muted">
              No tips available right now. Please check back later.
            </p>
          ) : (
            <DayTabs
              labels={["Yesterday", "Today", "Tomorrow"]}
              defaultIndex={1}
              panels={[
                <div key="yesterday">
                  <TipsTable rows={window.yesterday} hideDateOnMobile />
                  <TotalOddsBanner
                    totalOdds={window.yesterday.length > 0 ? (bookingWindow.yesterday?.totalOdds ?? null) : null}
                    booking={window.yesterday.length > 0 ? (bookingWindow.yesterday?.booking ?? null) : null}
                  />
                </div>,
                <div key="today">
                  <TipsTable rows={window.today} hideDateOnMobile />
                  <TotalOddsBanner
                    totalOdds={window.today.length > 0 ? (bookingWindow.today?.totalOdds ?? null) : null}
                    booking={window.today.length > 0 ? (bookingWindow.today?.booking ?? null) : null}
                  />
                </div>,
                <div key="tomorrow">
                  <TipsTable rows={window.tomorrow} hideDateOnMobile />
                  <TotalOddsBanner
                    totalOdds={window.tomorrow.length > 0 ? (bookingWindow.tomorrow?.totalOdds ?? null) : null}
                    booking={window.tomorrow.length > 0 ? (bookingWindow.tomorrow?.booking ?? null) : null}
                  />
                </div>,
              ]}
            />
          )}
          <TipsterBadge category="smartbet" />
        </div>,
        <div key="smartbetplus">
          <TipsTable rows={plusRows ?? []} />
          {plusRows && plusRows.length > 0 && <PlanBooking category="smartbetplus" />}
        </div>,
        <SmartBetStrategy key="strategy" />,
      ]}
    />
  );
}
