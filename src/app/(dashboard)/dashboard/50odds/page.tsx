import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getSure50Rows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TipsTable } from "@/components/dashboard/tips-table";
import { SetTabs } from "@/components/dashboard/set-tabs";

export const metadata: Metadata = { title: "50 Odds Plan" };

export default async function Odds50Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/50odds");

  const locked = !isActive(user.odds50status);
  const sets = locked ? null : await getSure50Rows();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">50 Odds Plan</h1>
      {locked || sets === null ? (
        <PlanLocked plan="50 Odds" />
      ) : (
        <SetTabs
          panels={[
            <div key="1">
              <TipsTable rows={sets.set1} />
              <div className="mt-4">
                <PlanBooking category="odds501" />
              </div>
            </div>,
            <div key="2">
              <TipsTable rows={sets.set2} />
              <div className="mt-4">
                <PlanBooking category="odds502" />
              </div>
            </div>,
          ]}
        />
      )}
    </div>
  );
}
