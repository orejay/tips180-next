import type { Metadata } from "next";
import { authFetch } from "@/lib/api-auth";

export const metadata: Metadata = { title: "Predict & Win" };

type PwRound = {
  id: number;
  date_created: string;
  prediction: string;
  set: string;
  set_id: number;
};

const steps = [
  "Each round, our experts publish a set of fixtures to predict.",
  "Submit your predicted outcomes before the round closes.",
  "Score points for every correct call — the top predictors win prizes.",
];

export default async function PredictWinPage() {
  const rounds = (await authFetch<PwRound[]>("getendpoints/pw-rounds")) ?? [];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">Predict &amp; Win</h1>

      <ol className="mb-8 space-y-2">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-muted">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-primary-soft text-xs font-bold text-primary">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <h2 className="mb-3 text-lg font-semibold text-foreground">Your Entries</h2>
      {rounds.length === 0 ? (
        <p className="rounded-lg border border-border py-10 text-center text-muted">
          You haven&apos;t entered any rounds yet. New rounds open regularly — check
          back soon.
        </p>
      ) : (
        <ul className="space-y-3">
          {rounds.map((round) => (
            <li
              key={round.id}
              className="flex items-center justify-between rounded-lg border border-border px-5 py-4"
            >
              <div>
                <p className="font-medium text-foreground">{round.set}</p>
                <p className="text-xs text-subtle">Entered {round.date_created}</p>
              </div>
              <span className="rounded-full bg-green-100 dark:bg-success-soft px-3 py-1 text-xs font-medium text-green-700">
                Submitted
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
