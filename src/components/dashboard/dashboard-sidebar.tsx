"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { dashboardNav } from "@/config/dashboard-nav";
import { cn } from "@/lib/utils";

/**
 * Dark dashboard sidebar (legacy `leftSide.js`). Collapsible on mobile; active
 * link derived from the path. Messages link shows the unread count.
 *
 * The mobile toggle used to be a small plain-text "Menu" button that blended
 * into the page and got scrolled past — users kept missing it. It's now a
 * full-width, icon-led bar (matching the site header's mobile pattern) that
 * also names the current section. It's `fixed`, not `sticky`: on mobile its
 * parent `<aside>` collapses to just the button's own height once the panel
 * is closed, so a sticky button had nowhere to stick and scrolled away
 * (under the header) the moment that tiny parent box scrolled past. `fixed`
 * anchors it to the viewport regardless of parent size — a spacer below
 * reserves its place in the flow. The open panel is `fixed` full-screen too,
 * for the same reason.
 */
export function DashboardSidebar({ unread = 0 }: { unread?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const currentLabel = dashboardNav.find((l) => l.href === pathname)?.name ?? "Dashboard";

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="fixed inset-x-0 top-16 z-20 flex h-14 w-full items-center gap-2.5 border-b border-white/10 bg-sidebar px-4 text-sm font-semibold text-white shadow-sm lg:hidden"
      >
        {open ? <X size={18} className="shrink-0" /> : <Menu size={18} className="shrink-0" />}
        {open ? "Close Menu" : currentLabel}
        {unread > 0 && !open && (
          <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs">
            {unread}
          </span>
        )}
      </button>
      {/* Spacer reserving the fixed toggle's place in normal flow. */}
      <div className="h-14 lg:hidden" />

      <nav
        className={cn(
          "bg-sidebar p-4 text-sm lg:static lg:block lg:h-full lg:rounded-l-xl",
          open ? "fixed inset-x-0 top-30 bottom-0 z-20 block overflow-y-auto" : "hidden",
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
