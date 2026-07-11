"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Globe, X, Menu, Zap, User, Bell, LogOut } from "lucide-react";
import {
  sectionTabs,
  subNav,
  LANGUAGES,
  type SubnavGroup,
  type LanguageCode,
} from "@/config/nav";
import { logoutAction } from "@/app/(auth)/auth/actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { applyLanguage, readStoredLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeaderUser = { name: string; email: string; plan: string; subscribed: boolean };

function readUserCookie(): HeaderUser | null {
  const match = document.cookie.match(/(?:^|;\s*)tips180_user=([^;]+)/);
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])) as HeaderUser; }
  catch { return null; }
}

export function SiteHeader() {
  const pathname = usePathname();
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [lang, setLang] = useState<LanguageCode>("en");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync auth/locale from external systems (cookie + localStorage). Must run
  // after mount to stay hydration-safe; re-reads on navigation (e.g. post-login).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading external (cookie/localStorage) state
    setUser(readUserCookie());
    setLang(readStoredLanguage());
  }, [pathname]);

  // Collapse the mobile menu whenever the route changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing transient UI to route change
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

  const openUser = useCallback(() => {
    if (userTimer.current) clearTimeout(userTimer.current);
    setUserOpen(true);
  }, []);

  const scheduleUserClose = useCallback(() => {
    userTimer.current = setTimeout(() => setUserOpen(false), 180);
  }, []);

  const selectLang = (code: LanguageCode) => {
    setLangOpen(false);
    setMobileGroup(null);
    if (code === lang) return;
    applyLanguage(code); // reloads the page once the translate cookie is set
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];
  const isFootballActive = !pathname.startsWith("/articles");

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-white/80 backdrop-blur-xl dark:border-zinc-800/70 dark:bg-black/80">
      {/* ── Row 1: Brand bar ───────────────────────────────── */}
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-8 px-4 lg:px-8">

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

        {/* Section tabs — full-height underline indicator (desktop) */}
        <nav className="hidden h-full items-stretch gap-7 lg:flex" aria-label="Site sections">
          {sectionTabs.map((tab) => {
            const active = tab.href === "/" ? isFootballActive : false;
            const inner = (
              <>
                <span>{tab.name}</span>
                {/* underline bar */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-[3px] origin-center rounded-t-full bg-linear-to-r from-teal-500 to-blue-600 transition-all duration-300 ease-out",
                    active
                      ? "scale-x-100 opacity-100"
                      : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40",
                  )}
                />
              </>
            );
            const cls = cn(
              "group relative flex h-full items-center text-[15px] font-semibold transition-colors duration-200",
              active
                ? "text-stone-900 dark:text-white"
                : "text-stone-400 hover:text-stone-700 dark:text-zinc-500 dark:hover:text-zinc-200",
            );
            return tab.external ? (
              <a key={tab.name} href={tab.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={tab.name} href={tab.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right cluster */}
        <div className="hidden items-center gap-1.5 lg:flex">
          <ThemeToggle />

          {/* Language — excluded from Google Translate so the picker always
              shows each language's own name, never translated into the
              currently-selected one. */}
          <div
            className="notranslate relative"
            translate="no"
            onMouseEnter={openLang}
            onMouseLeave={scheduleLangClose}
          >
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-2.5 py-2 transition-colors",
                langOpen
                  ? "bg-stone-100 text-stone-800 dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
              )}
            >
              <Globe size={15} />
              <span className="text-base leading-none">{currentLang.flag}</span>
              <ChevronDown size={12} className={cn("transition-transform duration-200", langOpen && "rotate-180")} />
            </button>

            {langOpen && (
              <div
                onMouseEnter={openLang}
                onMouseLeave={scheduleLangClose}
                role="listbox"
                className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-2xl shadow-stone-300/40 ring-1 ring-black/[0.02] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/60 dark:ring-white/5"
              >
                <p className="px-3 pb-1.5 pt-2 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400 dark:text-zinc-500">
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
                      "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      l.code === lang
                        ? "bg-linear-to-r from-teal-50 to-blue-50 font-semibold text-stone-900 dark:from-teal-950/40 dark:to-blue-950/40 dark:text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
                    )}
                  >
                    <span className="text-base leading-none">{l.flag}</span>
                    <span className="flex-1 text-left">{l.name}</span>
                    {l.code === lang && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-linear-to-r from-teal-500 to-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mx-2 h-6 w-px bg-stone-200 dark:bg-zinc-800" />

          {/* Auth */}
          {user ? (
            <div className="relative" onMouseEnter={openUser} onMouseLeave={scheduleUserClose}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-sm font-semibold transition-colors",
                  userOpen
                    ? "bg-stone-100 text-stone-900 dark:bg-zinc-800 dark:text-white"
                    : "text-stone-700 hover:bg-stone-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                )}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                  {(user.name || "U").trim().charAt(0).toUpperCase()}
                </span>
                <span className="max-w-32 truncate">{user.name || "Account"}</span>
                <ChevronDown size={13} className={cn("text-stone-400 transition-transform duration-200", userOpen && "rotate-180")} />
              </button>

              {userOpen && (
                <div
                  onMouseEnter={openUser}
                  onMouseLeave={scheduleUserClose}
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-2xl shadow-stone-300/40 ring-1 ring-black/[0.02] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/60 dark:ring-white/5"
                >
                  {/* Identity header */}
                  <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-teal-50 to-blue-50 px-3 py-2.5 dark:from-teal-950/40 dark:to-blue-950/40">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-sm font-bold text-white">
                      {(user.name || "U").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{user.name || "My Account"}</p>
                      {user.email && <p className="truncate text-xs text-stone-400 dark:text-zinc-500">{user.email}</p>}
                    </div>
                  </div>

                  <div className="my-1.5 h-px bg-stone-100 dark:bg-zinc-800" />

                  <Link
                    href="/dashboard/profile"
                    role="menuitem"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <User size={16} className="text-stone-400" />
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    role="menuitem"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <Bell size={16} className="text-stone-400" />
                    Notifications
                  </Link>

                  <div className="my-1.5 h-px bg-stone-100 dark:bg-zinc-800" />

                  <form action={logoutAction}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
                    >
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-xl px-3.5 py-2 text-sm font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="group relative ml-1 overflow-hidden rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/30 dark:shadow-blue-500/10"
              >
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">Sign Up</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-xl p-2 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Row 2: Subnav — desktop ─────────────────────────── */}
      <div className="hidden border-t border-stone-200/60 bg-stone-50/60 dark:border-zinc-800/60 dark:bg-zinc-900/30 lg:block">
        <div className="mx-auto flex h-11 w-full max-w-7xl items-stretch px-4 lg:px-8">
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

          <div className="ml-auto flex items-center">
            <Link
              href="/our-plans"
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-lg bg-linear-to-r from-amber-400 to-orange-500 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-amber-500/25 transition-all hover:shadow-lg hover:shadow-amber-500/40 dark:shadow-amber-500/15"
            >
              <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <Zap size={12} fill="currentColor" className="relative" />
              <span className="relative">Go Premium</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white dark:border-zinc-800 dark:bg-black lg:hidden">
          {/* Section tabs — underline style */}
          <div className="flex gap-6 border-b border-stone-200 px-5 dark:border-zinc-800">
            {sectionTabs.map((tab) => {
              const active = tab.href === "/" ? isFootballActive : false;
              const inner = (
                <>
                  <span>{tab.name}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-linear-to-r from-teal-500 to-blue-600 transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                </>
              );
              const cls = cn(
                "relative flex items-center py-3.5 text-sm font-semibold transition-colors",
                active ? "text-stone-900 dark:text-white" : "text-stone-400 dark:text-zinc-500",
              );
              return tab.external ? (
                <a key={tab.name} href={tab.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link key={tab.name} href={tab.href} className={cls}>{inner}</Link>
              );
            })}
          </div>

          {/* Subnav accordion */}
          <div className="max-h-[62vh] overflow-y-auto">
            {subNav.map((group) => (
              <div key={group.label} className="border-b border-stone-100 dark:border-zinc-800/60">
                <button
                  type="button"
                  onClick={() => setMobileGroup(mobileGroup === group.label ? null : group.label)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold text-stone-700 dark:text-zinc-200"
                >
                  {group.label}
                  <ChevronDown
                    size={15}
                    className={cn("text-stone-400 transition-transform duration-200", mobileGroup === group.label && "rotate-180")}
                  />
                </button>
                {mobileGroup === group.label && (
                  <div className="bg-stone-50/70 pb-2 dark:bg-zinc-900/40">
                    {group.items.map((item, i) =>
                      item.sectionHeader ? (
                        <p
                          key={i}
                          className={cn(
                            "px-6 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400 dark:text-zinc-500",
                            item.divider && "border-t border-stone-200/70 dark:border-zinc-800",
                          )}
                        >
                          {item.name}
                        </p>
                      ) : (
                        <Link
                          key={i}
                          href={item.href}
                          className="block px-6 py-2.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-zinc-400 dark:hover:text-white"
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
            <div className="notranslate border-b border-stone-100 dark:border-zinc-800/60" translate="no">
              <button
                type="button"
                onClick={() => setMobileGroup(mobileGroup === "__lang" ? null : "__lang")}
                className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-semibold text-stone-700 dark:text-zinc-200"
              >
                <span className="flex items-center gap-2.5">
                  <Globe size={14} className="text-stone-400" />
                  Language
                  <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {currentLang.flag} {currentLang.code.toUpperCase()}
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  className={cn("text-stone-400 transition-transform duration-200", mobileGroup === "__lang" && "rotate-180")}
                />
              </button>
              {mobileGroup === "__lang" && (
                <div className="bg-stone-50/70 pb-2 dark:bg-zinc-900/40">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => selectLang(l.code)}
                      className={cn(
                        "flex w-full items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                        l.code === lang ? "font-semibold text-stone-900 dark:text-white" : "text-stone-500 dark:text-zinc-400",
                      )}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span className="flex-1 text-left">{l.name}</span>
                      {l.code === lang && <span className="h-2 w-2 rounded-full bg-linear-to-r from-teal-500 to-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth + Go Premium */}
            <div className="flex flex-col gap-2.5 px-5 py-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl bg-linear-to-r from-teal-50 to-blue-50 px-3 py-3 dark:from-teal-950/40 dark:to-blue-950/40">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-sm font-bold text-white">
                      {(user.name || "U").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{user.name || "My Account"}</p>
                      {user.email && <p className="truncate text-xs text-stone-400 dark:text-zinc-500">{user.email}</p>}
                    </div>
                  </div>
                  <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 dark:border-zinc-700 dark:text-zinc-200">
                    <User size={16} className="text-stone-400" /> My Profile
                  </Link>
                  <Link href="/dashboard/messages" className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-700 dark:border-zinc-700 dark:text-zinc-200">
                    <Bell size={16} className="text-stone-400" /> Notifications
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-950/40 dark:text-red-400">
                      <LogOut size={16} /> Log Out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="rounded-xl border border-stone-200 py-2.5 text-center text-sm font-semibold text-stone-700 dark:border-zinc-700 dark:text-zinc-200">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="rounded-xl bg-linear-to-r from-teal-500 to-blue-600 py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                    Sign Up
                  </Link>
                </>
              )}
              <Link
                href="/our-plans"
                className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25"
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
    <div className="relative flex items-stretch" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "group relative flex items-center gap-1 px-3 text-xs font-semibold tracking-wide transition-colors",
          open
            ? "text-stone-900 dark:text-white"
            : "text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200",
        )}
      >
        {group.label}
        <ChevronDown
          size={12}
          className={cn(
            "shrink-0 transition-transform duration-200",
            open ? "rotate-180 text-stone-700 dark:text-zinc-200" : "text-stone-400",
          )}
        />
        {/* underline indicator */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-2.5 bottom-0 h-[2.5px] rounded-t-full bg-linear-to-r from-teal-500 to-blue-600 transition-all duration-300 ease-out",
            open ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-40",
          )}
        />
      </button>

      {open && (
        <div
          onMouseEnter={onDropdownEnter}
          onMouseLeave={onDropdownLeave}
          className="absolute left-0 top-full z-50 mt-0 w-64 overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-1.5 shadow-2xl shadow-stone-300/40 ring-1 ring-black/[0.02] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/60 dark:ring-white/5"
        >
          {group.items.map((item, i) =>
            item.sectionHeader ? (
              <p
                key={i}
                className={cn(
                  "px-3 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-stone-400 dark:text-zinc-500",
                  item.divider && "mt-1 border-t border-stone-200/70 dark:border-zinc-800",
                )}
              >
                {item.name}
              </p>
            ) : (
              <Link
                key={i}
                href={item.href}
                className={cn(
                  "flex items-center rounded-xl px-3 py-2 text-sm transition-colors",
                  item.name.includes("→")
                    ? "font-semibold text-teal-600 hover:bg-teal-50 hover:text-teal-700 dark:text-teal-400 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
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
