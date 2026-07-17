import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getRolloverRows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
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
        <>
          <DayTabs
            labels={["Yesterday", "Today", "Tomorrow"]}
            defaultIndex={1}
            panels={[
              <TipsTable key="yesterday" rows={window.yesterday} />,
              <TipsTable key="today" rows={window.today} />,
              <TipsTable key="tomorrow" rows={window.tomorrow} />,
            ]}
          />
          <div className="mt-4">
            <PlanBooking category="rollover" />
          </div>
          <TipsterBadge category="rollover" />
        </>
      )}
    </div>
  );
}
