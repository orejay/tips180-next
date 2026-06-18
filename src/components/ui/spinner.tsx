import { cn } from "@/lib/utils";

/** Simple branded loading spinner. */
export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "h-10 w-10 animate-spin rounded-full border-4 border-border border-t-blue-600",
        className,
      )}
    />
  );
}
