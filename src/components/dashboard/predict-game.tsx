"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import type { PwRound } from "@/lib/predict-win";
import { submitPredictionAction, verifyPwEntryAction } from "@/app/(dashboard)/dashboard/pw/actions";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    PaystackPop?: any;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script"));
    document.body.appendChild(s);
  });
}

const PICK_CURRENCY: Record<string, string> = {
  Nigeria: "NGN",
  Ghana: "GHS",
  Kenya: "KES",
  Tanzania: "KES",
};

type Status = { kind: "idle" | "working" | "ok" | "error"; message?: string };

/**
 * Predict & Win game (legacy PredWin): pick 1/X/2 for each fixture, pay the
 * per-round entry fee (Paystack), then submit. Predictions are sent as a string
 * of H/D/A chars (one per fixture, in order) to match the backend.
 */
export function PredictGame({
  round,
  email,
  name,
  country,
  symbol,
  fee,
  prize,
  paid: initialPaid,
}: {
  round: PwRound;
  email: string;
  name: string;
  country: string;
  symbol: string;
  fee: number | null;
  prize: number | null;
  paid: boolean;
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<Record<number, "H" | "D" | "A">>({});
  const [paid, setPaid] = useState(initialPaid);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const fixtures = round.predictions;
  const allPicked = fixtures.every((_, i) => picks[i]);

  function pick(i: number, v: "H" | "D" | "A") {
    setPicks((p) => ({ ...p, [i]: v }));
  }

  async function payEntry() {
    if (!siteConfig.paystackKey || !fee) return;
    try {
      await loadScript("https://js.paystack.co/v1/inline.js");
      const handler = window.PaystackPop.setup({
        key: siteConfig.paystackKey,
        email,
        amount: fee * 100,
        currency: PICK_CURRENCY[country] ?? "NGN",
        metadata: { custom_fields: [{ display_name: "Name", variable_name: "name", value: name }] },
        callback: (res: { reference: string }) => {
          setStatus({ kind: "working", message: "Confirming entry…" });
          void verifyPwEntryAction({ reference: res.reference, round: round.setid, country }).then((r) => {
            setStatus({ kind: r.ok ? "ok" : "error", message: r.message });
            if (r.ok) setPaid(true);
          });
        },
        onClose: () => setStatus({ kind: "idle" }),
      });
      handler.openIframe();
    } catch {
      setStatus({ kind: "error", message: "Could not start payment. Please try again." });
    }
  }

  async function submit() {
    if (!allPicked) {
      setStatus({ kind: "error", message: "Please make a pick for every fixture." });
      return;
    }
    const prediction = fixtures.map((_, i) => picks[i]).join("");
    setStatus({ kind: "working", message: "Submitting…" });
    const r = await submitPredictionAction({ round: round.round, set_id: round.setid, prediction });
    setStatus({ kind: r.ok ? "ok" : "error", message: r.message });
    if (r.ok) {
      router.refresh();
    }
  }

  return (
    <div>
      {/* Prize banner */}
      <div className="mb-6 rounded-xl bg-linear-to-r from-brand-start to-brand-end px-4 py-8 text-center text-white">
        <p className="text-sm font-semibold">Round {round.round} — fight for a chance to win</p>
        {prize != null && (
          <p className="text-4xl font-extrabold lg:text-5xl">
            {symbol}
            {prize.toLocaleString()}
          </p>
        )}
        <a href="/pw-terms" target="_blank" rel="noopener noreferrer" className="text-sm underline">
          T&amp;C apply
        </a>
      </div>

      <p className="mb-4 text-sm text-muted">
        Select 1 (Home), X (Draw) or 2 (Away) for each fixture.
      </p>

      <ul className="space-y-2">
        {fixtures.map((fx, i) => (
          <li key={fx.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
            <div>
              <p className="font-medium text-foreground">{fx.match}</p>
              <p className="text-xs text-subtle">{fx.league?.label}</p>
            </div>
            <div className="flex gap-2">
              {(["H", "D", "A"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pick(i, v)}
                  className={`h-9 w-9 rounded-md border text-sm font-bold transition-colors ${
                    picks[i] === v
                      ? "border-primary bg-primary text-white"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  {v === "H" ? "1" : v === "D" ? "X" : "2"}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        {!paid ? (
          <button
            type="button"
            onClick={payEntry}
            disabled={status.kind === "working" || !fee || !siteConfig.paystackKey}
            className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {fee ? `Pay entry fee (${symbol}${fee.toLocaleString()})` : "Entry fee unavailable"}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={status.kind === "working" || !allPicked}
            className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            Submit Predictions
          </button>
        )}
        {status.message && (
          <p className={`mt-3 text-sm font-medium ${status.kind === "ok" ? "text-success" : status.kind === "error" ? "text-danger" : "text-muted"}`} role="status">
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
