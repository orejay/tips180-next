import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getSmartBetRows, getSmartBetPlusRows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TipsTable } from "@/components/dashboard/tips-table";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { SetTabs } from "@/components/dashboard/set-tabs";
import { TipsterBadge } from "@/components/marketing/tipster-badge";

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
  const [window, plusRows] = await Promise.all([getSmartBetRows(), getSmartBetPlusRows()]);

  return (
    <SetTabs
      labels={["Smart Bet", "Smart Bet Plus"]}
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
                <TipsTable key="yesterday" rows={window.yesterday} />,
                <TipsTable key="today" rows={window.today} />,
                <TipsTable key="tomorrow" rows={window.tomorrow} />,
              ]}
            />
          )}
          <div className="mt-4">
            <PlanBooking category="smartbet" />
          </div>
          <TipsterBadge category="smartbet" />
        </div>,
        <div key="smartbetplus">
          <TipsTable rows={plusRows ?? []} />
          <div className="mt-4">
            <PlanBooking category="smartbetplus" />
          </div>
        </div>,
      ]}
    />
  );
}
