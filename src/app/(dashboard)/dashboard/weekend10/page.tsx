import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getWeekend10Rows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TipsTable } from "@/components/dashboard/tips-table";

export const metadata: Metadata = { title: "Weekend 10" };

export default async function Weekend10Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/weekend10");

  const locked = !isActive(user.w10subscriptstatus);
  const rows = locked ? null : await getWeekend10Rows();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Weekend 10</h1>
      {locked || rows === null ? (
        <PlanLocked plan="Weekend 10" />
      ) : (
        <>
          <TipsTable rows={rows} />
          <div className="mt-4 space-y-4">
            <PlanBooking category="w101" />
            <PlanBooking category="w102" />
          </div>
        </>
      )}
    </div>
  );
}
