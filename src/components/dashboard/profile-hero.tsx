"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * Profile page hero: avatar + identity, key stat tiles, and a one-tap copy for
 * the referral code. Client leaf only for the clipboard interaction.
 */
export function ProfileHero({
  name,
  email,
  plan,
  balance,
  refCode,
  refPoints,
  loyaltyPoints,
}: {
  name: string;
  email: string;
  plan: string;
  balance: number;
  refCode: string;
  refPoints: number;
  loyaltyPoints: number;
}) {
  const [copied, setCopied] = useState(false);

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase())
      .join("") || "?";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable (insecure context) — fail silently.
    }
  };

  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-linear-to-br from-brand-start to-brand-end p-6 text-white shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-xl font-bold">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold">{name || "—"}</p>
            <p className="text-sm text-white/80">{email}</p>
            <span className="mt-1.5 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
              {plan || "Free"} Plan
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <Stat label="Wallet Balance" value={`₦${(balance ?? 0).toLocaleString("en-US")}`} />
          <Stat label="Referral Points" value={String(refPoints ?? 0)} />
          <Stat label="Loyalty Points" value={String(loyaltyPoints ?? 0)} />
        </div>
      </div>

      {refCode && (
        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
            Referral Code
          </span>
          <span className="font-mono text-base font-bold tracking-widest">{refCode}</span>
          <button
            type="button"
            onClick={copy}
            className="ml-auto flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/25"
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
