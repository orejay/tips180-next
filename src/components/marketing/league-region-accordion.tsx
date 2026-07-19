"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Collapsible league-region section for mobile (`/leagues`). Desktop always
 * shows every region expanded in the multi-column grid — `lg:block!` forces
 * the content visible there regardless of toggle state, and the toggle button
 * itself is inert (`lg:pointer-events-none`, chevron hidden) so there's
 * nothing to accidentally collapse on larger screens.
 */
export function LeagueRegionAccordion({
  region,
  defaultOpen = false,
  children,
}: {
  region: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-6 border-b border-stone-200 pb-6 last:border-b-0 lg:mb-10 lg:border-none lg:pb-0 dark:border-white/8">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left lg:pointer-events-none lg:cursor-default"
      >
        <h2 className="text-xl font-bold text-foreground">{region}</h2>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-subtle transition-transform duration-200 lg:hidden",
            open && "rotate-180",
          )}
        />
      </button>
      <div className={cn("mt-4", open ? "block" : "hidden", "lg:block!")}>
        {children}
      </div>
    </section>
  );
}
