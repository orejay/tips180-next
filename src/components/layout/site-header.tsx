"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, X, Menu, Zap } from "lucide-react";
import {
  sectionTabs,
  subNav,
  LANGUAGES,
  type SubnavGroup,
  type LanguageCode,
} from "@/config/nav";
import { logoutAction } from "@/app/(auth)/auth/actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

type HeaderUser = { name: string; email: string; plan: string; subscribed: boolean };

function readUserCookie(): HeaderUser | null {
  const match = document.cookie.match(/(?:^|;\s*)tips180_user=([^;]+)/);
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])) as HeaderUser; }
  catch { return null; }
}

const LANG_KEY = "tips180_lang";

function readLang(): LanguageCode {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LANG_KEY) as LanguageCode) ?? "en";
}

export function SiteHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState<LanguageCode>("en");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setUser(readUserCookie());
    setLang(readLang());
  }, [pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileGroup(null);
  }, [pathname]);

  const openGroup = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 180);
  }, []);

  const openLang = useCallback(() => {
    if (langTimer.current) clearTimeout(langTimer.current);
    setLangOpen(true);
  }, []);

  const scheduleLangClose = useCallback(() => {
    langTimer.current = setTimeout(() => setLangOpen(false), 180);
  }, []);

  const selectLang = (code: LanguageCode) => {
    setLang(code);
    localStorage.setItem(LANG_KEY, code);
    setLangOpen(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const isFootballActive = !pathname.startsWith("/articles");

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/95 shadow-sm backdrop-blur-xl dark:border-stone-800/60 dark:bg-stone-950/95 dark:shadow-black/30">
      {/* ── Row 1: Brand bar ───────────────────────────────── */}
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4 lg:px-8">

        {/* Logo */}
        <Link href="/" aria-label="Tips180 home" className="shrink-0">
          <Image
            src="/images/tip-logo.png"
            alt="Tips180"
            width={3494}
            height={894}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Section tabs — segmented control (desktop) */}
        <nav
          className="hidden items-center rounded-xl bg-stone-100 p-1 dark:bg-stone-800/70 lg:flex"
          aria-label="Site sections"
        >
          {sectionTabs.map((tab) => {
            const active = tab.href === "/" ? isFootballActive : false;
            const cls = cn(
              "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
              active
                ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-50"
                : "text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300",
            );
            return tab.external ? (
              <a key={tab.name} href={tab.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {tab.name}
              </a>
            ) : (
              <Link key={tab.name} href={tab.href} className={cls}>
                {tab.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="hidden items-center gap-1 lg:flex">
          <ThemeToggle />

          {/* Language */}
          <div className="relative" onMouseEnter={openLang} onMouseLeave={scheduleLangClose}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
            >
              <Globe size={15} />
              <span className="text-base leading-none">{currentLang.flag}</span>
            </button>

            {langOpen && (
              <div
                onMouseEnter={openLang}
                onMouseLeave={scheduleLangClose}
                role="listbox"
                className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-stone-100 bg-white py-2 shadow-xl shadow-stone-200/80 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/50"
              >
                <p className="px-4 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                  Language
                </p>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    role="option"
                    aria-selected={l.code === lang}
                    onClick={() => selectLang(l.code)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 mx-1 w-[calc(100%-8px)] rounded-xl text-sm transition-colors",
                      l.code === lang
                        ? "bg-stone-50 font-semibold text-stone-900 dark:bg-stone-800 dark:text-stone-50"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                    )}
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="flex-1 text-left">{l.name}</span>
                    {l.code === lang && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-2 h-5 w-px bg-stone-200 dark:bg-stone-700" />

          {/* Auth */}
          {user ? (
            <>
              <Link href="/dashboard/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50">
                {user.name || "Account"}
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40">
                  Log Out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="ml-1 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-sm shadow-teal-500/20 transition-all hover:shadow-md hover:shadow-teal-500/30 hover:opacity-95 dark:shadow-teal-500/10"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-stone-50"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Row 2: Subnav — desktop ─────────────────────────── */}
      <div className="hidden border-t border-stone-100 bg-stone-50/70 dark:border-stone-800/60 dark:bg-stone-900/40 lg:block">
        <div className="mx-auto flex h-10 w-full max-w-7xl items-center px-4 lg:px-8">
          {subNav.map((group) => (
            <SubnavDropdown
              key={group.label}
              group={group}
              open={openMenu === group.label}
              onEnter={() => openGroup(group.label)}
              onLeave={scheduleClose}
              onDropdownEnter={() => openGroup(group.label)}
              onDropdownLeave={scheduleClose}
            />
          ))}

          <div className="ml-auto">
            <Link
              href="/our-plans"
              className="flex items-center gap-1.5 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-sm shadow-amber-400/30 transition-all hover:opacity-90 hover:shadow-amber-400/50 dark:shadow-amber-500/20"
            >
              <Zap size={12} fill="currentColor" />
              Go Premium
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-stone-100 bg-white dark:border-stone-800 dark:bg-stone-950 lg:hidden">
          {/* Section tabs */}
          <div className="border-b border-stone-100 px-4 py-3 dark:border-stone-800">
            <div className="inline-flex items-center rounded-xl bg-stone-100 p-1 dark:bg-stone-800/70">
              {sectionTabs.map((tab) => {
                const active = tab.href === "/" ? isFootballActive : false;
                const cls = cn(
                  "px-4 py-1.5 rounded-lg text-sm font-semibold transition-all",
                  active
                    ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-50"
                    : "text-stone-400 dark:text-stone-500",
                );
                return tab.external ? (
                  <a key={tab.name} href={tab.href} target="_blank" rel="noopener noreferrer" className={cls}>{tab.name}</a>
                ) : (
                  <Link key={tab.name} href={tab.href} className={cls}>{tab.name}</Link>
                );
              })}
            </div>
          </div>

          {/* Subnav accordion */}
          <div className="max-h-[65vh] overflow-y-auto">
            {subNav.map((group) => (
              <div key={group.label} className="border-b border-stone-100 dark:border-stone-800/60">
                <button
                  type="button"
                  onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-stone-700 dark:text-stone-200"
                >
                  {group.label}
                  <ChevronDown
                    size={15}
                    className={cn("text-stone-400 transition-transform duration-200", mobileGroup === group.label && "rotate-180")}
                  />
                </button>
                {mobileGroup === group.label && (
                  <div className="bg-stone-50/60 pb-2 dark:bg-stone-900/40">
                    {group.items.map((item, i) =>
                      item.sectionHeader ? (
                        <p
                          key={i}
                          className={cn(
                            "px-5 pb-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500",
                            item.divider && "border-t border-stone-100 dark:border-stone-800",
                          )}
                        >
                          {item.name}
                        </p>
                      ) : (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-5 py-2.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-50"
                          {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          {item.name}
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Language */}
            <div className="border-b border-stone-100 dark:border-stone-800/60">
              <button
                type="button"
                onClick={() => setMobileGroup(mobileGroup === "__lang" ? null : "__lang")}
                className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold text-stone-700 dark:text-stone-200"
              >
                <span className="flex items-center gap-2.5">
                  <Globe size={14} className="text-stone-400" />
                  Language
                  <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500 dark:bg-stone-800 dark:text-stone-400">
                    {currentLang.flag} {currentLang.code.toUpperCase()}
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  className={cn("text-stone-400 transition-transform duration-200", mobileGroup === "__lang" && "rotate-180")}
                />
              </button>
              {mobileGroup === "__lang" && (
                <div className="bg-stone-50/60 pb-2 dark:bg-stone-900/40">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => selectLang(l.code)}
                      className={cn(
                        "flex w-full items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                        l.code === lang
                          ? "font-semibold text-stone-900 dark:text-stone-50"
                          : "text-stone-500 dark:text-stone-400",
                      )}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="flex-1 text-left">{l.name}</span>
                      {l.code === lang && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth + Go Premium */}
            <div className="flex flex-col gap-2 px-4 py-4">
              {user ? (
                <>
                  <Link href="/dashboard/profile" className="rounded-xl border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-200">
                    {user.name || "My Account"}
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="w-full rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                      Log Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="rounded-xl border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-700 dark:border-stone-700 dark:text-stone-200">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="rounded-xl bg-linear-to-r from-teal-500 to-blue-600 py-2.5 text-center text-sm font-bold text-white">
                    Sign Up
                  </Link>
                </>
              )}
              <Link
                href="/our-plans"
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-bold text-white"
              >
                <Zap size={14} fill="currentColor" /> Go Premium
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Subnav dropdown ────────────────────────────────────────── */

function SubnavDropdown({
  group,
  open,
  onEnter,
  onLeave,
  onDropdownEnter,
  onDropdownLeave,
}: {
  group: SubnavGroup;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onDropdownEnter: () => void;
  onDropdownLeave: () => void;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-1 px-3 text-xs font-semibold tracking-wide transition-colors",
          open
            ? "text-stone-900 dark:text-stone-50"
            : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200",
        )}
      >
        {group.label}
        <ChevronDown
          size={12}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180 text-stone-700 dark:text-stone-200" : "text-stone-400",
          )}
        />
      </button>

      {open && (
        <div
          onMouseEnter={onDropdownEnter}
          onMouseLeave={onDropdownLeave}
          className="absolute left-0 top-full z-50 mt-1 w-64 rounded-2xl border border-stone-100 bg-white py-2 shadow-xl shadow-stone-200/70 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/50"
        >
          {group.items.map((item, i) =>
            item.sectionHeader ? (
              <p
                key={i}
                className={cn(
                  "px-4 pb-1.5 pt-3.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500",
                  item.divider && "mt-1 border-t border-stone-100 dark:border-stone-800",
                )}
              >
                {item.name}
              </p>
            ) : (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  "mx-1 flex items-center rounded-xl px-3 py-2 text-sm transition-colors",
                  item.name.includes("→")
                    ? "font-semibold text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50",
                )}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {item.name}
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
