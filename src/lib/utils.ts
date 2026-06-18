import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with conditional logic, resolving conflicts so the
 * last utility wins (e.g. `cn("px-2", isActive && "px-4")` -> `px-4`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Build an absolute URL against the configured site origin. */
export function absoluteUrl(path: string, base: string): string {
  return new URL(path, base).toString();
}
