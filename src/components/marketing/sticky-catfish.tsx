"use client";

import { useState } from "react";

const AD_URL = "https://8xbet.ng/p/WeGn";
const DESKTOP_IMG = "https://i.imgur.com/DeZZ1rP.gif";
const MOBILE_IMG = "https://i.imgur.com/JNCnRUi.gif";

export function StickyCatfish() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[2147483647] flex items-end justify-center">
      <div className="pointer-events-auto relative w-full max-w-[390px] leading-[0] md:max-w-[1600px]">
        <button
          type="button"
          aria-label="Close advertisement"
          onClick={() => setOpen(false)}
          className="absolute -top-8 right-1.5 z-10 h-[30px] w-[30px] cursor-pointer rounded-[5px] bg-neutral-900/90 text-center text-[22px] leading-[30px] text-white"
        >
          ×
        </button>
        <a href={AD_URL} target="_blank" rel="noopener noreferrer sponsored" className="block w-full">
          <picture>
            <source media="(max-width: 767px)" srcSet={MOBILE_IMG} />
            <img
              src={DESKTOP_IMG}
              width={1600}
              height={150}
              alt="8XBET"
              loading="eager"
              fetchPriority="high"
              className="block h-auto w-full border-0"
            />
          </picture>
        </a>
      </div>
    </div>
  );
}
