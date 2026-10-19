"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { detectCountryClient } from "@/lib/geo-client";
import { minisendMpesaAvailable } from "@/config/minisend";

export function MpesaAnnouncement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let active = true;
    detectCountryClient().then((code) => {
      if (active && code && minisendMpesaAvailable(code)) setShow(true);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="mx-auto my-6 w-11/12 max-w-6xl">
      <Link href="/our-plans" aria-label="M-Pesa payment is now available">
        <Image
          src="/images/mpesa-desktop.webp"
          alt="M-Pesa payment is now available on Tips180"
          width={1200}
          height={300}
          className="hidden h-auto w-full rounded-md md:block"
        />
        <Image
          src="/images/mpesa-mobile.webp"
          alt="M-Pesa payment is now available on Tips180"
          width={750}
          height={500}
          className="h-auto w-full rounded-md md:hidden"
        />
      </Link>
    </div>
  );
}
