import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getSmartBetRows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { TipsTable } from "@/components/dashboard/tips-table";

export const metadata: Metadata = { title: "Smart Bet Plan" };

export default async function SmartBetPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/smartbet");

  const locked = !isActive(user.isubscriptstatus);
  const rows = locked ? null : await getSmartBetRows();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Smart Bet Plan</h1>
      {locked || rows === null ? <PlanLocked plan="Smart Bet" /> : <TipsTable rows={rows} />}
    </div>
  );
}
