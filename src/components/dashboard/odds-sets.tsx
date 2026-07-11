import { getOddsSet } from "@/lib/plan-tips";
import { TipsTable } from "@/components/dashboard/tips-table";
import { SetTabs } from "@/components/dashboard/set-tabs";

/** Renders the two prediction sets for the 2-odds / 3-odds Premium plans. */
export async function OddsSets({ kind }: { kind: "sure2" | "sure3" }) {
  const [set1, set2] = await Promise.all([getOddsSet(kind, 1), getOddsSet(kind, 2)]);

  return (
    <SetTabs
      panels={[<TipsTable key="1" rows={set1 ?? []} />, <TipsTable key="2" rows={set2 ?? []} />]}
    />
  );
}
