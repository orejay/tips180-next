"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * League crest. Renders nothing if there's no logo for this league (long-tail
 * leagues outside `LEAGUE_LOGOS`) or the remote image fails to load.
 */
export function LeagueLogo({
  src,
  alt,
  size = 20,
  className,
}: {
  src: string | null;
  alt: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
