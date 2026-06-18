import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getExpertsAccaRows } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { TipsTable } from "@/components/dashboard/tips-table";

export const metadata: Metadata = { title: "Experts ACCA" };

export default async function AccaPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/acca");

  // Experts ACCA needs a paid plan (Key/Premium) with an active subscription.
  const locked = user.accoutplan === "Free" || !isActive(user.rsubscriptstatus);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Experts ACCA</h1>
      {locked ? (
        <PlanLocked plan="Experts ACCA" />
      ) : (
        <AccaSets />
      )}
    </div>
  );
}

async function AccaSets() {
  const { set1, set2 } = await getExpertsAccaRows();
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Set 1</h2>
        <TipsTable rows={set1} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Set 2</h2>
        <TipsTable rows={set2} />
      </section>
    </div>
  );
}
