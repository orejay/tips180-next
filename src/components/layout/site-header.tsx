"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, type NavLink } from "@/config/nav";
import { logoutAction } from "@/app/(auth)/auth/actions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

/** Client-readable shape of the `tips180_user` cookie (mirrors SessionUser). */
type HeaderUser = { name: string; email: string; plan: string; subscribed: boolean };

/** Read the client-readable `tips180_user` cookie set on login. */
function readUserCookie(): HeaderUser | null {
  const match = document.cookie.match(/(?:^|;\s*)tips180_user=([^;]+)/);
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1])) as HeaderUser;
  } catch {
    return null;
  }
}

/**
 * Sticky site header for the public marketing pages. Client component: owns the
 * mobile menu toggle, derives the active link from the path, and reflects auth
 * state from the (non-httpOnly) session cookie so the marketing pages stay
 * statically rendered.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<HeaderUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // The user cookie is browser-only, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(readUserCookie());
  }, [pathname]);

  const isActive = (link: NavLink) =>
    !link.external &&
    (pathname === link.href ||
      (link.href !== "/" && pathname.startsWith(`${link.href}/`)));

  return (
    <header className="sticky top-0 z-50 bg-surface shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/" aria-label="Tips180 home" className="shrink-0">
          <Image
            src="/images/tip-logo.png"
            alt="Tips180 logo"
            width={3494}
            height={894}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Mobile: theme toggle + menu button (nav is collapsed) */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={cn(
            "absolute inset-x-0 top-full flex-col gap-4 bg-surface px-6 py-6 shadow-md",
            "lg:static lg:flex lg:flex-row lg:items-center lg:gap-6 lg:px-0 lg:py-0 lg:shadow-none",
            open ? "flex" : "hidden",
          )}
        >
          <ul className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
            {mainNav.map((link) => (
              <li key={link.name}>
                <NavItem link={link} active={isActive(link)} onNavigate={() => setOpen(false)} />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 lg:ml-4 lg:flex-row lg:items-center">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            {user ? (
              <>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {user.name || "My Account"}
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-md bg-red-500 px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90"
                  >
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

function NavItem({
  link,
  active,
  onNavigate,
}: {
  link: NavLink;
  active: boolean;
  onNavigate: () => void;
}) {
  const className = cn(
    "text-base font-medium text-foreground transition-colors hover:text-primary",
    active && "bg-linear-to-r from-brand-start to-brand-end bg-clip-text font-bold text-transparent",
  );

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.name}
      </a>
    );
  }

  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      {link.name}
    </Link>
  );
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}
