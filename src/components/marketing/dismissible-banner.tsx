"use client";

import { useState } from "react";

export function DismissibleBanner({ caption, body }: { caption: string; body: string }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="mx-auto mt-4 mb-2 flex w-11/12 items-start justify-between rounded-lg border-l-4 border-blue-600 bg-blue-50 dark:bg-primary-soft p-4 shadow-sm">
      <div className="min-w-0 flex-1 pr-4">
        <p className="font-bold text-primary">{caption}</p>
        <p className="mt-1 text-sm text-foreground">{body}</p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="shrink-0 text-lg leading-none text-subtle hover:text-muted"
      >
        ✕
      </button>
    </div>
  );
}
