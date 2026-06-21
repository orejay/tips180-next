"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  ChevronDown,
  Clock,
  CreditCard,
  Gamepad2,
  Globe,
  HelpCircle,
  Info,
  MessageCircle,
  RefreshCw,
  Rocket,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  Wallet,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Icon registry — pass `icon: "TrendingUp"` from Server Components instead of a ref. */
const ICON_MAP: Record<string, LucideIcon> = {
  Bell, BookOpen, Clock, CreditCard, Gamepad2, Globe, HelpCircle, Info,
  MessageCircle, RefreshCw, Rocket, RotateCcw, Search, ShieldCheck, Star,
  Target, TrendingUp, Trophy, UserPlus, Wallet, XCircle,
};

export type FaqItem = {
  question: string;
  answer: string;
  /** Icon name from the ICON_MAP registry above. Falls back to HelpCircle. */
  icon?: string;
};

/* Six cycling accent colours aligned to the Tips180 brand palette. */
const ACCENTS = [
  { color: "#14b8a6", light: "#f0fdfa", darkBg: "#042f2e" }, // teal
  { color: "#2563eb", light: "#eff6ff", darkBg: "#082544" }, // blue
  { color: "#10b981", light: "#ecfdf5", darkBg: "#062416" }, // emerald
  { color: "#f97316", light: "#fff7ed", darkBg: "#2d1403" }, // orange
  { color: "#8b5cf6", light: "#f5f3ff", darkBg: "#1e1045" }, // violet
  { color: "#ec4899", light: "#fdf2f8", darkBg: "#2e0a2e" }, // pink
];

/** True when the primary input is a pointer that can hover (desktop/trackpad). */
const isHoverDevice = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover)").matches;

/** Watches the `.dark` class on <html> for class-based dark mode. */
function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const isDark = useIsDark();

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => {
        const accent = ACCENTS[i % ACCENTS.length];
        const isOpen = open === i;
        const Icon = (item.icon ? ICON_MAP[item.icon] : null) ?? HelpCircle;
        const num = String(i + 1).padStart(2, "0");

        const cardBg = isOpen
          ? isDark ? accent.darkBg : accent.light
          : isDark ? "#18181b" : "#ffffff";

        const questionColor = isOpen
          ? accent.color
          : isDark ? "#e7e5e4" : "#1c1917";

        return (
          <div
            key={i}
            role="button"
            aria-expanded={isOpen}
            tabIndex={0}
            onMouseEnter={() => { if (isHoverDevice()) setOpen(i); }}
            onMouseLeave={() => { if (isHoverDevice()) setOpen(null); }}
            onClick={() => { if (!isHoverDevice()) setOpen(open === i ? null : i); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(open === i ? null : i);
              }
            }}
            className="cursor-pointer overflow-hidden rounded-2xl border-l-4 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              borderLeftColor: isOpen ? accent.color : "transparent",
              backgroundColor: cardBg,
              boxShadow: isOpen
                ? `0 12px 40px -10px ${accent.color}55, 0 0 0 1.5px ${accent.color}30`
                : isDark
                  ? "0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)"
                  : "0 1px 4px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)",
              transform: isOpen ? "scale(1.015)" : "scale(1)",
              transition:
                "background-color 0.3s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1), border-left-color 0.3s ease",
            }}
          >
            {/* Question row */}
            <div className="flex items-center gap-3 px-5 py-4">
              {/* Numbered badge */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-black"
                style={{
                  backgroundColor: isOpen
                    ? accent.color
                    : isDark ? "#1f1f1f" : "#f3f4f6",
                  color: isOpen ? "#fff" : accent.color,
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
              >
                {num}
              </div>

              {/* Icon */}
              <div
                className="shrink-0"
                style={{
                  color: isOpen
                    ? accent.color
                    : isDark ? "#52525b" : "#9ca3af",
                  transform: isOpen
                    ? "rotate(-12deg) scale(1.1)"
                    : "rotate(0deg) scale(1)",
                  transition: "color 0.3s ease, transform 0.3s ease",
                }}
              >
                <Icon size={16} />
              </div>

              {/* Question text */}
              <span
                className="flex-1 text-sm font-semibold leading-snug"
                style={{
                  color: questionColor,
                  transition: "color 0.3s ease",
                }}
              >
                {item.question}
              </span>

              {/* Chevron */}
              <ChevronDown
                size={18}
                className="shrink-0"
                style={{
                  color: isOpen
                    ? accent.color
                    : isDark ? "#475569" : "#9ca3af",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition:
                    "transform 0.4s cubic-bezier(0.22,1,0.36,1), color 0.3s ease",
                }}
              />
            </div>

            {/* Answer — expands via CSS grid trick */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition:
                  "grid-template-rows 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <p
                  key={isOpen ? "open" : "closed"}
                  className={isOpen ? "faq-answer-in" : ""}
                  style={{
                    padding: "4px 20px 20px 20px",
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: isDark ? "#71717a" : "#4b5563",
                    borderTop: `1px dashed ${accent.color}35`,
                  }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
