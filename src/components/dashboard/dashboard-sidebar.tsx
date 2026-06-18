"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNav } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

/**
 * Dark dashboard sidebar (legacy `leftSide.js`). Collapsible on mobile; active
 * link derived from the path. Messages link shows the unread count.
 */
export function DashboardSidebar({ unread = 0 }: { unread?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="m-4 flex items-center gap-2 rounded-md bg-sidebar px-4 py-2 text-sm font-medium text-white lg:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      <nav
        className={cn(
          "bg-sidebar p-4 text-sm lg:block lg:rounded-l-xl",
          open ? "block" : "hidden",
        )}
      >
        <ul className="space-y-1">
          {dashboardNav.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2.5 transition-colors",
                    active
                      ? "bg-linear-to-r from-brand-start to-brand-end font-medium text-white"
                      : "text-sidebar-foreground hover:bg-white/5 hover:text-white",
                  )}
                >
                  {link.name}
                  {link.href === "/dashboard/messages" && unread > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
