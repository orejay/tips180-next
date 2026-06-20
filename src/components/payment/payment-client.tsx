"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getPricingFor, pricingOptions } from "@/config/pricing";
import { verifyAndUpgradeAction } from "@/app/(dashboard)/dashboard/payment/actions";
import { ManualPayments } from "@/components/payment/manual-payments";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    PaystackPop?: any;
    FlutterwaveCheckout?: any;
  }
}

/** Load an external script once; resolve when ready. */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

/** Unique transaction reference (module scope — not a render-time computation). */
function newTxRef(): string {
  return `tips180-${Date.now()}`;
}

type Status = { kind: "idle" | "working" | "ok" | "error"; message?: string };

export function PaymentClient({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const [country, setCountry] = useState("NG");
  const [planIdx, setPlanIdx] = useState(0);
  const [durationIdx, setDurationIdx] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const { plans, currency } = getPricingFor(country);
  const plan = plans[Math.min(planIdx, plans.length - 1)];
  const price = plan.prices[Math.min(durationIdx, plan.prices.length - 1)];
  const duration = plan.durations[Math.min(durationIdx, plan.durations.length - 1)];
  const cardEnabled = Boolean(siteConfig.paystackKey || siteConfig.flutterwaveKey);

  function changeCountry(code: string) {
    setCountry(code);
    setPlanIdx(0);
    setDurationIdx(0);
  }

  async function finalize(provider: "paystack" | "flutter", reference: string) {
    setStatus({ kind: "working", message: "Confirming your payment…" });
    const result = await verifyAndUpgradeAction({
      provider,
      reference,
      plan: plan.slug,
      duration,
    });
    setStatus({ kind: result.ok ? "ok" : "error", message: result.message });
    if (result.ok) {
      router.refresh();
      setTimeout(() => router.push("/dashboard/profile"), 2500);
    }
  }

  async function payWithPaystack() {
    if (!siteConfig.paystackKey) return;
    try {
      await loadScript("https://js.paystack.co/v1/inline.js");
      const handler = window.PaystackPop.setup({
        key: siteConfig.paystackKey,
        email,
        amount: price.value * 100, // smallest currency unit
        currency,
        metadata: { custom_fields: [{ display_name: "Name", variable_name: "name", value: name }] },
        callback: (response: { reference: string }) => {
          void finalize("paystack", response.reference);
        },
        onClose: () => setStatus({ kind: "idle" }),
      });
      handler.openIframe();
    } catch {
      setStatus({ kind: "error", message: "Could not start card payment. Please try again." });
    }
  }

  async function payWithFlutterwave() {
    if (!siteConfig.flutterwaveKey) return;
    try {
      await loadScript("https://checkout.flutterwave.com/v3.js");
      window.FlutterwaveCheckout({
        public_key: siteConfig.flutterwaveKey,
        tx_ref: newTxRef(),
        amount: price.value,
        currency,
        customer: { email, name },
        customizations: { title: "Tips180", description: `${plan.name} — ${duration}` },
        callback: (data: { transaction_id?: number | string }) => {
          if (data?.transaction_id) void finalize("flutter", String(data.transaction_id));
        },
        onclose: () => setStatus((s) => (s.kind === "working" ? s : { kind: "idle" })),
      });
    } catch {
      setStatus({ kind: "error", message: "Could not start card payment. Please try again." });
    }
  }

  return (
    <div className="space-y-8">
      {/* Country / currency selector */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">1. Your country</h2>
        <select
          value={country}
          onChange={(e) => changeCountry(e.target.value)}
          className="w-64 rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        >
          {pricingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-subtle">Prices in {currency}.</p>
      </section>

      {/* Plan selector */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">2. Choose a plan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {plans.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => { setPlanIdx(i); setDurationIdx(0); }}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                i === planIdx
                  ? "border-blue-600 bg-blue-50 dark:bg-primary-soft text-primary"
                  : "border-border text-foreground hover:border-blue-400"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Duration selector */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">3. Choose a duration</h2>
        <div className="flex flex-wrap gap-2">
          {plan.durations.map((d, i) => (
            <button
              key={d}
              type="button"
              onClick={() => setDurationIdx(i)}
              className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                i === durationIdx
                  ? "border-blue-600 bg-primary text-white"
                  : "border-border text-foreground hover:border-blue-400"
              }`}
            >
              {d} — {plan.prices[Math.min(i, plan.prices.length - 1)].label}
            </button>
          ))}
        </div>
      </section>

      {/* Pay */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">4. Pay</h2>
        <div className="rounded-lg border border-border p-5">
          <p className="mb-4 text-foreground">
            <span className="font-semibold">{plan.name}</span> · {duration} ·{" "}
            <span className="font-bold text-primary">{price.label}</span>
          </p>

          {cardEnabled ? (
            <div className="flex flex-wrap gap-3">
              {siteConfig.paystackKey && (
                <button
                  type="button"
                  onClick={payWithPaystack}
                  disabled={status.kind === "working"}
                  className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  Pay with Card (Paystack)
                </button>
              )}
              {siteConfig.flutterwaveKey && (
                <button
                  type="button"
                  onClick={payWithFlutterwave}
                  disabled={status.kind === "working"}
                  className="rounded-md border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-60"
                >
                  Pay with Flutterwave
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Card payment is not configured. Use a manual payment method below.
            </p>
          )}

          {status.message && (
            <p
              className={`mt-4 text-sm font-medium ${
                status.kind === "ok" ? "text-green-600" : status.kind === "error" ? "text-red-600" : "text-muted"
              }`}
              role="status"
            >
              {status.message}
            </p>
          )}
        </div>
      </section>

      {/* Manual instructions */}
      <ManualPayments />

      <p className="text-xs text-subtle">
        Tips180 does not refund money paid for subscriptions and is not liable for
        any money lost or gained. Content is intended for persons aged 18+.
      </p>
    </div>
  );
}
