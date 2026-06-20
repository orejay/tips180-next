import Image from "next/image";
import { getBooking, bookieLogo } from "@/lib/bookings";

/**
 * "Bet tip on <bookie>" booking-code banner (legacy BookingCode). Shows today's
 * loadable betting code for a category and links out to the bookie. Renders
 * nothing if there's no code. Server Component, fail-soft.
 */
export async function BookingCode({ category }: { category: string }) {
  const booking = await getBooking(category);
  if (!booking) return null;

  const logo = bookieLogo(booking.bookie);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        {logo ? (
          <Image src={logo} alt={booking.bookie} width={64} height={28} className="h-7 w-auto object-contain" />
        ) : (
          <span className="font-semibold text-foreground">{booking.bookie}</span>
        )}
        <div>
          <p className="text-xs text-subtle uppercase">Booking code</p>
          <p className="font-mono text-lg font-bold tracking-wider text-foreground">{booking.code}</p>
        </div>
      </div>
      {booking.link && (
        <a
          href={booking.link}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Load on {booking.bookie}
        </a>
      )}
    </div>
  );
}
