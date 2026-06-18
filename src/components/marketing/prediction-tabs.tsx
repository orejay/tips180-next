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
}: {
  recent: React.ReactNode;
  upcoming: React.ReactNode;
}) {
  const [tab, setTab] = useState<0 | 1>(0);

  const tabClass = (active: boolean) =>
    cn(
      "cursor-pointer px-3 py-2 text-sm font-medium transition-colors md:text-base",
      active
        ? "border-b-2 border-blue-600 text-primary"
        : "text-subtle hover:text-muted",
    );

  return (
    <div>
      <div role="tablist" className="mb-4 flex items-center gap-2 border-b border-border">
        <button type="button" role="tab" aria-selected={tab === 0} className={tabClass(tab === 0)} onClick={() => setTab(0)}>
          Recent Winning Tips
        </button>
        <button type="button" role="tab" aria-selected={tab === 1} className={tabClass(tab === 1)} onClick={() => setTab(1)}>
          Upcoming Tips
        </button>
      </div>

      <div role="tabpanel" hidden={tab !== 0}>
        {recent}
      </div>
      <div role="tabpanel" hidden={tab !== 1}>
        {upcoming}
      </div>
    </div>
  );
}
