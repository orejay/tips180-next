"use client";

import Image from "next/image";
import { useState } from "react";
import { Ticket, Copy, Check, ArrowUpRight } from "lucide-react";
import type { Booking } from "@/lib/bookings";
import { cn } from "@/lib/utils";

/**
 * Booking-code banner (client leaf): shows the loadable bookie code with a
 * one-tap copy button, and a gradient CTA out to the bookie. The fetch lives in
 * the server `BookingCode` wrapper; this only handles the copy interaction.
 */
export function BookingCodeCard({
  booking,
  logo,
}: {
  booking: Booking;
  logo: string | null;
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
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-[#18181b] sm:p-5">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-linear-to-br from-teal-500/15 to-blue-600/15 blur-2xl" />

      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Bookie logo on a dark tile so white wordmarks read in both themes */}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0f1115] ring-1 ring-white/10">
            {logo ? (
              <Image
                src={logo}
                alt={booking.bookie}
                width={72}
                height={28}
                className="h-6 w-auto object-contain"
              />
            ) : (
              <Ticket size={20} className="text-white/80" />
            )}
          </span>

          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
              <Ticket size={12} className="shrink-0" />
              Booking code
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xl font-extrabold tracking-[0.18em] text-foreground">
                {booking.code}
              </span>
              <button
                type="button"
                onClick={copy}
                aria-label={copied ? "Code copied" : "Copy booking code"}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
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
        </div>

        {booking.link && (
          <a
            href={booking.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            Load on {booking.bookie}
            <ArrowUpRight size={15} className="shrink-0" />
          </a>
        )}
      </div>
    </div>
  );
}
