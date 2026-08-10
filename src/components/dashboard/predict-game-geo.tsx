"use client";

import { useEffect, useState } from "react";
import { detectCountryClient } from "@/lib/geo-client";
import { PredictGame } from "@/components/dashboard/predict-game";
import type { PwRound } from "@/lib/predict-win";

/** ISO country -> Predict & Win's country label, the six markets it runs in. */
const PW_ISO: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  KE: "Kenya",
  TZ: "Tanzania",
  CM: "Cameroon",
  UG: "Uganda",
};

type PwCountryData = { country: string; symbol: string; fee: number | null; prize: number | null; paid: boolean };

/**
 * Client-side wrapper around `<PredictGame>` — renders immediately with the
 * server-picked default (the user's profile country, or Nigeria), then
 * resolves the visitor's real country in the browser and swaps in the
 * correct fee/prize/paid-status if it's different. Keeps this page's geo
 * detection consistent with everywhere else (client-side, no IP round-trip
 * through our own server) even though its data can't be fetched until the
 * country is known.
 */
export function PredictGameWithGeo({
  round,
  email,
  name,
  initial,
}: {
  round: PwRound;
  email: string;
  name: string;
  initial: PwCountryData;
}) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    detectCountryClient().then((iso) => {
      const detected = iso ? PW_ISO[iso.toUpperCase()] : undefined;
      if (!detected || detected === data.country) return;
      fetch(`/pw-country?country=${encodeURIComponent(detected)}&setId=${round.setid}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d: PwCountryData | null) => {
          if (d) setData(d);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only
  }, []);

  return (
    <PredictGame
      round={round}
      email={email}
      name={name}
      country={data.country}
      symbol={data.symbol}
      fee={data.fee}
      prize={data.prize}
      paid={data.paid}
    />
  );
}
