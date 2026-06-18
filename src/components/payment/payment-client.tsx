"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { plans, type Plan } from "@/config/plans";
import { siteConfig } from "@/config/site";
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

type Status = { kind: "idle" | "working" | "ok" | "error"; message?: string };

export function PaymentClient({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>(plans[0]);
  const [durationIdx, setDurationIdx] = useState(0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const price = plan.prices[Math.min(durationIdx, plan.prices.length - 1)];
  const duration = plan.durations[Math.min(durationIdx, plan.durations.length - 1)];
  const cardEnabled = Boolean(siteConfig.paystackKey || siteConfig.flutterwaveKey);

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
        amount: price.value * 100, // kobo
        currency: "NGN",
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
        tx_ref: `tips180-${Date.now()}`,
        amount: price.value,
        currency: "NGN",
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
      {/* Plan selector */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">1. Choose a plan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {plans.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => { setPlan(p); setDurationIdx(0); }}
              className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
                p.slug === plan.slug
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
        <h2 className="mb-3 text-lg font-semibold text-foreground">2. Choose a duration</h2>
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
        <h2 className="mb-3 text-lg font-semibold text-foreground">3. Pay</h2>
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
