import { getBooking, bookieLogo } from "@/lib/bookings";
import { BookingCodeCard } from "@/components/marketing/booking-code-card";

/**
 * "Load on <bookie>" booking-code banner (legacy BookingCode). Fetches today's
 * loadable betting code for a category on the server and hands it to a client
 * card for the copy interaction. Renders nothing if there's no code.
 */
export async function BookingCode({ category }: { category: string }) {
  const booking = await getBooking(category);
  if (!booking) return null;

  return <BookingCodeCard booking={booking} logo={bookieLogo(booking.bookie)} />;
}
