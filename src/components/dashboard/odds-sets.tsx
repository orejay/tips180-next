import { getOddsSet } from "@/lib/plan-tips";
import { TipsTable } from "@/components/dashboard/tips-table";

/** Renders the two prediction sets for the 2-odds / 3-odds Premium plans. */
export async function OddsSets({ kind }: { kind: "sure2" | "sure3" }) {
  const [set1, set2] = await Promise.all([getOddsSet(kind, 1), getOddsSet(kind, 2)]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Set 1</h2>
        <TipsTable rows={set1 ?? []} />
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Set 2</h2>
        <TipsTable rows={set2 ?? []} />
      </section>
    </div>
  );
}
