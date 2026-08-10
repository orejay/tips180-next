"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import type { LeagueMatch } from "@/lib/leagues";

// Free visitors see the first 2 matches; Premium subscribers see them all.
const FREE_MATCH_LIMIT = 2;

/**
 * League matches table + upsell. `getLeagueMatches` (the fetch that produced
 * `allMatches`) is a fully public, unauthenticated endpoint — SSR'd that way
 * on purpose so crawlers see real predictions — so a signed-in Premium
 * subscriber already has every match in `allMatches`, the page just doesn't
 * know it yet server-side. This client component checks the visitor's real
 * session after mount (via /premium-status, not the readable `tips180_user`
 * cookie — that cookie is only refreshed at login/upgrade and can drift) and
 * reveals the rest instead of the SSR default of "first 2 + upsell". Renders
 * neither the lock panel nor the upsell banner until the check resolves
 * (`status === "checking"`) — defaulting to "locked" and correcting a moment
 * later flashed the paywall at Premium subscribers before yanking it away.
 */
export function LeaguePredictions({
  allMatches,
  leagueName,
}: {
  allMatches: LeagueMatch[];
  leagueName: string;
}) {
  // Three states, not a boolean: while "checking", render neither the lock
  // panel nor the upsell banner. A boolean defaulting to "not premium" was
  // the earlier bug — it painted the locked state first for EVERY visitor,
  // Premium or not, then yanked it away a moment later once the real check
  // resolved, which reads as a flash of a paywall on a page the visitor
  // already pays for.
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">("checking");

  useEffect(() => {
    fetch("/premium-status")
      .then((r) => r.json())
      .then((d: { premium: boolean }) => setStatus(d.premium ? "unlocked" : "locked"))
      .catch(() => setStatus("locked"));
  }, []);

  const visible = status === "unlocked" ? allMatches : allMatches.slice(0, FREE_MATCH_LIMIT);
  const hiddenCount = allMatches.length - visible.length;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg bg-surface shadow-sm">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 text-left font-medium">Match</th>
              <th className="px-3 py-3 font-medium">Tip</th>
              <th className="px-3 py-3 font-medium">Score</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((match) => (
              <tr key={match.id} className="border-b border-border last:border-0">
                <td className="px-3 py-3 whitespace-nowrap text-muted">{match.date}</td>
                <td className="px-3 py-3 text-left font-medium text-foreground">{match.name}</td>
                <td className="px-3 py-3 text-foreground">{match.ft_tip || "—"}</td>
                <td className="px-3 py-3 text-foreground">{match.ft_score || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {status === "locked" && hiddenCount > 0 && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-muted p-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-primary dark:bg-primary-soft">
            <Lock size={19} />
          </span>
          <h3 className="font-bold text-foreground">
            {hiddenCount} more {leagueName} {hiddenCount === 1 ? "match" : "matches"} for
            Premium subscribers
          </h3>
          <p className="mx-auto max-w-md text-sm text-muted">
            Subscribe to Premium to unlock every {leagueName} prediction, not just today&apos;s
            top picks.
          </p>
          <Link
            href="/our-plans"
            className="mt-1 inline-flex items-center gap-1.5 rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            View Plans
            <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {status === "locked" && (
        <div className="mt-12 rounded-xl bg-linear-to-r from-brand-start to-brand-end p-8 text-center text-white">
          <h2 className="text-lg font-bold lg:text-2xl">
            Want higher-accuracy {leagueName} tips?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm">
            Unlock premium predictions, risk-managed accumulators and expert
            analysis.
          </p>
          <Link
            href="/our-plans"
            className="mt-5 inline-block rounded-md bg-surface px-6 py-2.5 font-medium text-primary transition-opacity hover:opacity-90"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
