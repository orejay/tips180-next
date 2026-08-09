"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill switcher for dashboard plans that publish multiple independent panels
 * (2/3 Odds, Experts ACCA, Smart Bet's Strategy tab). All panels stay mounted
 * (toggled via `hidden`) so server-rendered content for inactive tabs isn't lost.
 */
export function SetTabs({
  labels = ["Set 1", "Set 2"],
  panels,
  defaultIndex = 0,
}: {
  labels?: string[];
  panels: React.ReactNode[];
  defaultIndex?: number;
}) {
  const [tab, setTab] = useState(defaultIndex);

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
        className="mb-5 inline-flex flex-wrap gap-1 rounded-xl bg-stone-100 p-1 dark:bg-white/5"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={tab === i}
            className={tabClass(tab === i)}
            onClick={() => setTab(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {panels.map((panel, i) => (
        <div key={i} role="tabpanel" hidden={tab !== i}>
          {panel}
        </div>
      ))}
    </div>
  );
}
