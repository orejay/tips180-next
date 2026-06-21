"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Feedback } from "@/lib/predictions";

/**
 * Lightweight testimonial carousel — replaces the legacy react-slick slider.
 * Uses native scroll-snap (no transform math, no deps): a horizontal track of
 * snap-aligned cards with prev/next controls and gentle autoplay that pauses on
 * hover/focus and respects reduced-motion.
 */
export function TestimonialsCarousel({ items }: { items: Feedback[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card?.clientWidth ?? track.clientWidth;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (dir === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step * dir, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || items.length <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) scrollByCard(1);
    }, 3500);
    return () => clearInterval(id);
  }, [items.length, scrollByCard]);

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocusCapture={() => (paused.current = true)}
      onBlurCapture={() => (paused.current = false)}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <figure
            key={i}
            className="flex min-h-56 shrink-0 basis-full snap-start flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:basis-1/2 lg:basis-1/3 dark:border-white/8 dark:bg-[#18181b]"
          >
            <blockquote className="text-sm leading-relaxed text-foreground lg:text-base">
              <span className="mb-2 block bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-5xl leading-none font-serif font-bold text-transparent">
                &ldquo;
              </span>
              {item.message}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4 dark:border-white/8">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-xs font-bold text-white">
                {item.name?.trim().charAt(0).toUpperCase() || "?"}
              </span>
              <span>
                <span className="block text-sm font-bold text-foreground">{item.name}</span>
                <span className="block text-xs text-muted">{item.country}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <CarouselButton label="Previous testimonials" onClick={() => scrollByCard(-1)} dir="prev" />
        <CarouselButton label="Next testimonials" onClick={() => scrollByCard(1)} dir="next" />
      </div>
    </div>
  );
}

function CarouselButton({
  label,
  onClick,
  dir,
}: {
  label: string;
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-primary hover:text-primary"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dir === "prev" ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
