"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary. Catches render/runtime errors in any route and offers a
 * retry. Must be a Client Component (Next requirement).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for diagnostics; wire to an error reporter in production.
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-background px-6 py-20">
      <div className="flex max-w-md flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-2 text-muted">
          An unexpected error occurred. Please try again — if the problem
          persists, contact support.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
