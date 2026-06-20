import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { authFetch, getCurrentUser } from "@/lib/api-auth";
import { detectCountry } from "@/lib/geo";
import { PredictGame } from "@/components/dashboard/predict-game";
import {
  getCurrentRound,
  getPwFee,
  getPwPrize,
  hasEnteredRound,
  hasPaidEntry,
  pwSymbol,
  PW_COUNTRIES,
} from "@/lib/predict-win";

export const metadata: Metadata = { title: "Predict & Win" };

type PwEntry = { id: number; date_created: string; set: string; set_id: number };

export default async function PredictWinPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/pw");

  // Detect country by IP; fall back to the user's profile country, then Nigeria.
  // Predict & Win only runs in these six markets.
  const PW_ISO: Record<string, string> = {
    NG: "Nigeria", GH: "Ghana", KE: "Kenya", TZ: "Tanzania", CM: "Cameroon", UG: "Uganda",
  };
  const iso = await detectCountry();
  const country =
    (iso && PW_ISO[iso.toUpperCase()]) ||
    (PW_COUNTRIES.some((c) => c.label === user.country) ? user.country : "Nigeria");

  const [round, entries] = await Promise.all([
    getCurrentRound(),
    authFetch<PwEntry[]>("getendpoints/pw-rounds"),
  ]);

  let game = null;
  if (round) {
    const [fee, prize, entered, paid] = await Promise.all([
      getPwFee(country),
      getPwPrize(country),
      hasEnteredRound(round.setid),
      hasPaidEntry(country, round.setid),
    ]);
    game = entered ? (
      <p className="rounded-lg border border-border py-10 text-center text-muted">
        You&apos;ve already entered round {round.round}. Good luck!
      </p>
    ) : (
      <PredictGame
        round={round}
        email={user.email}
        name={user.name}
        country={country}
        symbol={pwSymbol(country)}
        fee={fee}
        prize={prize}
        paid={paid}
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Predict &amp; Win</h1>

      {game ?? (
        <p className="mb-8 rounded-lg border border-border py-10 text-center text-muted">
          There&apos;s no active round right now. New rounds open regularly — check back soon.
        </p>
      )}

      <h2 className="mt-10 mb-3 text-lg font-semibold text-foreground">Your Entries</h2>
      {!entries || entries.length === 0 ? (
        <p className="rounded-lg border border-border py-8 text-center text-muted">
          You haven&apos;t entered any rounds yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg border border-border px-5 py-4">
              <div>
                <p className="font-medium text-foreground">{entry.set}</p>
                <p className="text-xs text-subtle">Entered {entry.date_created}</p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-success-soft dark:text-success">
                Submitted
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
