import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getRolloverRows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TipsTable } from "@/components/dashboard/tips-table";

export const metadata: Metadata = { title: "Rollover Bet" };

export default async function RolloverPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/rollover");

  const locked = !isActive(user.rollsubscriptstatus);
  const rows = locked ? null : await getRolloverRows();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Rollover Bet</h1>
      {locked || rows === null ? (
        <PlanLocked plan="Rollover" />
      ) : (
        <>
          <TipsTable rows={rows} />
          <div className="mt-4">
            <PlanBooking category="rollover" />
          </div>
        </>
      )}
    </div>
  );
}
