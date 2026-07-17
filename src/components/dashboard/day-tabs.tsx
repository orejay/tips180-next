"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill switcher for date-windowed dashboard plan tables (Yesterday/Today/
 * Tomorrow, or the wider 2-days-back/forward range for 2/3 Odds). All panels
 * stay mounted (toggled via `hidden`) so server-rendered content for inactive
 * days isn't lost.
 */
export function DayTabs({
  labels,
  panels,
  defaultIndex = 0,
}: {
  labels: string[];
  panels: React.ReactNode[];
  defaultIndex?: number;
}) {
  const [active, setActive] = useState(defaultIndex);

  const tabClass = (isActive: boolean) =>
    cn(
      "cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
      isActive
        ? "bg-white text-primary shadow-sm dark:bg-white/10"
        : "text-muted hover:text-foreground",
    );

  return (
    <div>
      <div
        role="tablist"
        className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-stone-100 p-1 dark:bg-white/5"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={tabClass(active === i)}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={i} role="tabpanel" hidden={active !== i}>
          {panel}
        </div>
      ))}
    </div>
  );
}
