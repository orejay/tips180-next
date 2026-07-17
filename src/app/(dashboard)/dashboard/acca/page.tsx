import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getExpertsAccaRows, type DayWindow } from "@/lib/plan-tips";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { PlanBooking } from "@/components/dashboard/plan-booking";
import { TipsTable } from "@/components/dashboard/tips-table";
import { SetTabs } from "@/components/dashboard/set-tabs";
import { DayTabs } from "@/components/dashboard/day-tabs";
import { TipsterBadge } from "@/components/marketing/tipster-badge";

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
        <>
          <AccaSets />
          <TipsterBadge category="experts-acca" />
        </>
      )}
    </div>
  );
}

function DayWindowTabs({ window }: { window: DayWindow }) {
  return (
    <DayTabs
      labels={["Yesterday", "Today", "Tomorrow"]}
      defaultIndex={1}
      panels={[
        <TipsTable key="yesterday" rows={window.yesterday} />,
        <TipsTable key="today" rows={window.today} />,
        <TipsTable key="tomorrow" rows={window.tomorrow} />,
      ]}
    />
  );
}

async function AccaSets() {
  const { set1, set2 } = await getExpertsAccaRows();
  return (
    <SetTabs
      panels={[
        <div key="1">
          <DayWindowTabs window={set1} />
          <div className="mt-4">
            <PlanBooking category="expertsacca1" />
          </div>
        </div>,
        <div key="2">
          <DayWindowTabs window={set2} />
          <div className="mt-4">
            <PlanBooking category="expertsacca2" />
          </div>
        </div>,
      ]}
    />
  );
}
