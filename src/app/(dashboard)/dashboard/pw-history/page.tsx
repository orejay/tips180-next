import type { Metadata } from "next";
import { authFetch } from "@/lib/api-auth";

export const metadata: Metadata = { title: "Predict & Win History" };

type PwRound = {
  id: number;
  date_created: string;
  prediction: string;
  set: string;
  set_id: number;
};

export default async function PredictWinHistoryPage() {
  const rounds = (await authFetch<PwRound[]>("getendpoints/pw-rounds")) ?? [];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">
        Predict &amp; Win History
      </h1>

      {rounds.length === 0 ? (
        <p className="rounded-lg border border-border py-10 text-center text-muted">
          No past entries yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="px-3 py-3 font-medium">Round</th>
                <th className="px-3 py-3 font-medium">Date Entered</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-3 font-medium text-foreground">{round.set}</td>
                  <td className="px-3 py-3 text-muted">{round.date_created}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-green-100 dark:bg-success-soft px-3 py-1 text-xs font-medium text-green-700">
                      Submitted
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
