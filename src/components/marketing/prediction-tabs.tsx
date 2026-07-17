"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Tab switcher for the home prediction tables. Both tables are server-rendered
 * and stay in the DOM (toggled with `hidden`) so crawlers index both sets of
 * predictions regardless of the active tab.
 */
export function PredictionTabs({
  recent,
  upcoming,
  recentTipster,
  upcomingTipster,
}: {
  recent: React.ReactNode;
  upcoming: React.ReactNode;
  recentTipster?: React.ReactNode;
  upcomingTipster?: React.ReactNode;
}) {
  const [tab, setTab] = useState<0 | 1>(0);

  const tabClass = (active: boolean) =>
    cn(
      "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
      active
        ? "bg-white text-primary shadow-sm dark:bg-white/10"
        : "text-muted hover:text-foreground",
    );

  return (
    <div>
      <div
        role="tablist"
        className="mb-5 inline-flex gap-1 rounded-xl bg-stone-100 p-1 dark:bg-white/5"
      >
        <button type="button" role="tab" aria-selected={tab === 0} className={tabClass(tab === 0)} onClick={() => setTab(0)}>
          Recent Winning Tips
        </button>
        <button type="button" role="tab" aria-selected={tab === 1} className={tabClass(tab === 1)} onClick={() => setTab(1)}>
          Upcoming Tips
        </button>
      </div>

      <div role="tabpanel" hidden={tab !== 0}>
        {recent}
        {recentTipster}
      </div>
      <div role="tabpanel" hidden={tab !== 1}>
        {upcoming}
        {upcomingTipster}
      </div>
    </div>
  );
}
