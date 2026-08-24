import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, isActive } from "@/lib/api-auth";
import { getExpertsAccaRows, type DayWindow } from "@/lib/plan-tips";
import { getDayBookingWindow, type DayBookingWindow } from "@/lib/bookings";
import { PlanLocked } from "@/components/dashboard/plan-locked";
import { TotalOddsBanner } from "@/components/dashboard/total-odds-banner";
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

function DayWindowTabs({
  window,
  bookingWindow,
}: {
  window: DayWindow;
  bookingWindow: DayBookingWindow;
}) {
  return (
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
  );
}

async function AccaSets() {
  const [{ set1, set2 }, bookingWindow1, bookingWindow2] = await Promise.all([
    getExpertsAccaRows(),
    getDayBookingWindow("expertsacca1"),
    getDayBookingWindow("expertsacca2"),
  ]);
  return (
    <SetTabs
      panels={[
        <div key="1">
          <DayWindowTabs window={set1} bookingWindow={bookingWindow1} />
        </div>,
        <div key="2">
          <DayWindowTabs window={set2} bookingWindow={bookingWindow2} />
        </div>,
      ]}
    />
  );
}
