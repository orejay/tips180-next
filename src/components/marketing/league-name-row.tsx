"use client";

import { useEffect, useState } from "react";
import { leagueSlug } from "@/lib/leagues";

let leagueNamesPromise: Promise<Record<string, string>> | null = null;
function getLeagueNames(): Promise<Record<string, string>> {
  if (!leagueNamesPromise) {
    leagueNamesPromise = fetch("/league-names")
      .then((r) => (r.ok ? r.json() : {}))
      .catch(() => ({}));
  }
  return leagueNamesPromise;
}

export function LeagueNameRow({
  league,
  colSpan,
  className = "",
}: {
  league?: string;
  colSpan: number;
  className?: string;
}) {
  const [names, setNames] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    getLeagueNames().then((map) => {
      if (!cancelled) setNames(map);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!league) return null;
  const name = names[leagueSlug(league)] ?? league;

  return (
    <tr className={className}>
      <td
        colSpan={colSpan}
        className="bg-stone-50/60 px-4 py-1 text-center text-[11px] font-medium leading-tight text-subtle dark:bg-white/3"
      >
        {name}
      </td>
    </tr>
  );
}
