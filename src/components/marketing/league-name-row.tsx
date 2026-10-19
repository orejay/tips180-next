"use client";

import { leagueSlug } from "@/lib/leagues";
import { useLeagueCatalog } from "@/components/marketing/league-catalog-context";

export function LeagueNameRow({
  league,
  colSpan,
  className = "",
}: {
  league?: string;
  colSpan: number;
  className?: string;
}) {
  const { names } = useLeagueCatalog();

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
