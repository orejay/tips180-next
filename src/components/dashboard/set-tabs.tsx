"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Pill switcher for dashboard plans that publish two independent prediction
 * sets (2/3 Odds, Experts ACCA). Both panels stay mounted (toggled via
 * `hidden`) so server-rendered content for the inactive set isn't lost.
 */
export function SetTabs({
  labels = ["Set 1", "Set 2"],
  panels,
}: {
  labels?: [string, string];
  panels: [React.ReactNode, React.ReactNode];
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
      <div role="tablist" className="mb-5 inline-flex gap-1 rounded-xl bg-stone-100 p-1 dark:bg-white/5">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={tab === i}
            className={tabClass(tab === i)}
            onClick={() => setTab(i as 0 | 1)}
          >
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" hidden={tab !== 0}>{panels[0]}</div>
      <div role="tabpanel" hidden={tab !== 1}>{panels[1]}</div>
    </div>
  );
}
