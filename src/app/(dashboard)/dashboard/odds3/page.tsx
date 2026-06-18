import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-auth";
import { OddsSets } from "@/components/dashboard/odds-sets";
import { PlanLocked } from "@/components/dashboard/plan-locked";

export const metadata: Metadata = { title: "3 Odds" };

export default async function Odds3Page() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/odds3");

  // 3 Odds requires the Premium plan.
  const locked = user.accoutplan !== "Premium";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">3 Odds</h1>
      {locked ? <PlanLocked plan="3 Odds (Premium)" /> : <OddsSets kind="sure3" />}
    </div>
  );
}
