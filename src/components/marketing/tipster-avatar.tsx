"use client";

import { useState } from "react";
import { tipsterInitials } from "@/lib/tipsters";
import { cn } from "@/lib/utils";

/**
 * Tipster avatar with an initials fallback — used both when no `image_url` is
 * set AND when the URL is set but the image fails to load (e.g. the upload
 * never actually landed where nginx serves `/api/uploads/photos` from). A
 * plain server-rendered `<img>` can't react to a load failure, so this is a
 * client leaf specifically for the `onError` swap.
 */
export function TipsterAvatar({
  src,
  name,
  className,
  initialsClassName,
}: {
  src: string | null;
  name: string;
  className?: string;
  initialsClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 font-bold text-white",
          initialsClassName,
        )}
      >
        {tipsterInitials(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- small avatar, no benefit from next/image optimization
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
