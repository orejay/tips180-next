"use client";

import { useState } from "react";
import { Ticket, Copy, Check, ArrowUpRight } from "lucide-react";
import type { Booking } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/**
 * Booking-code banner (client leaf): shows the loadable bookie code with a
 * one-tap copy button, and a solid-pill CTA out to the bookie whose logo sits
 * in its own white chip overlapping the pill's edge. The fetch lives in the
 * server `BookingCode` wrapper; this only handles the copy interaction.
 */
export function BookingCodeCard({
  booking,
  logo,
  totalOdds,
}: {
  booking: Booking;
  logo: string | null;
  totalOdds?: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(booking.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable (insecure context) — fail silently.
    }
  };

  return (
    <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-[#18181b] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
            <Ticket size={12} className="shrink-0" />
            Booking code
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="rounded-lg bg-stone-100 px-3 py-1.5 font-mono text-xl font-extrabold tracking-[0.18em] text-foreground dark:bg-white/5">
              {booking.code}
            </span>
            <button
              type="button"
              onClick={copy}
              aria-label={copied ? "Code copied" : "Copy booking code"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
                copied
                  ? "border-success/30 bg-success-soft text-success"
                  : "border-stone-200 text-subtle hover:bg-stone-50 hover:text-foreground dark:border-white/10 dark:hover:bg-white/5",
              )}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            {copied && (
              <span className="text-xs font-medium text-success">Copied</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalOdds && (
            <div className="text-right">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-subtle">
                Total odds
              </p>
              <p className="font-mono text-lg font-extrabold text-foreground">{totalOdds}</p>
            </div>
          )}
          {booking.link && <CtaLink booking={booking} logo={logo} />}
        </div>
      </div>
    </div>
  );
}

function CtaLink({ booking, logo }: { booking: Booking; logo: string | null }) {
  return (
    <a
      href={booking.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-full bg-primary pr-5 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
    >
      <span className="-ml-px flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white shadow-sm dark:border-[#18181b]">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- tiny favicon, no benefit from next/image optimization
          <img
            src={logo}
            alt=""
            className="h-6 w-6 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Ticket size={16} className="text-primary" />
        )}
      </span>
      <span className="flex items-center gap-1.5 pl-3">
        Load on {booking.bookie}
        <ArrowUpRight size={15} className="shrink-0" />
      </span>
    </a>
  );
}
