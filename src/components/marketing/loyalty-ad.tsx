import Image from "next/image";
import Link from "next/link";

/** Loyalty promo banner linking to plans (legacy home loyalty ad). */
export function LoyaltyAd() {
  return (
    <div className="mx-auto my-6 w-11/12 max-w-6xl">
      <Link href="/our-plans" aria-label="View our loyalty plans">
        {/* Desktop */}
        <Image
          src="/images/loyalty-pc.webp"
          alt="Tips180 loyalty offer"
          width={8256}
          height={750}
          className="hidden h-auto w-full rounded-md md:block"
        />
        {/* Mobile */}
        <Image
          src="/images/loyalty-mobile.webp"
          alt="Tips180 loyalty offer"
          width={2463}
          height={568}
          className="h-auto w-full rounded-md md:hidden"
        />
      </Link>
    </div>
  );
}
