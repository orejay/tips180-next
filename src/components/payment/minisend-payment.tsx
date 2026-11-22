"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MINISEND_DONE_STATUSES,
  minisendMpesaAvailable,
  minisendStablecoinAvailable,
} from "@/config/minisend";
import {
  checkMinisendOrderAction,
  startMinisendCheckoutAction,
  startMinisendOrderAction,
} from "@/app/(dashboard)/dashboard/payment/minisend-actions";
import {
  getKycStatusAction,
  startKycAction,
  type KycState,
} from "@/app/(dashboard)/dashboard/payment/kyc-actions";

type Kyc =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; status: KycState; required: boolean; available: boolean };

type Stage =
  | { kind: "idle" }
  | { kind: "working"; message: string }
  | { kind: "waiting"; amountKes: number; phone: string }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

function toKyc(result: Awaited<ReturnType<typeof getKycStatusAction>>): Kyc {
  if (!result.ok) return { kind: "error", message: result.message };
  return {
    kind: "ready",
    status: result.status,
    required: result.required,
    available: result.available,
  };
}

const KES = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });
const POLL_MS = 4000;
const MAX_POLLS = 150;
const KYC_POLL_MS = 5000;
const KYC_MAX_POLLS = 120;

export function MinisendPayment({
  country,
  planSlug,
  planName,
  duration,
  returnedSessionId,
  kycReturned,
}: {
  country: string;
  planSlug: string;
  planName: string;
  duration: string;
  returnedSessionId?: string;
  kycReturned?: boolean;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [kyc, setKyc] = useState<Kyc>({ kind: "loading" });
  const [kycBusy, setKycBusy] = useState(false);
  const [kycNote, setKycNote] = useState<string | null>(null);
  const confirmed = useRef<string | null>(null);

  const mpesa = minisendMpesaAvailable(country);
  const stablecoin = minisendStablecoinAvailable(country);

  const loadKyc = useCallback(async () => {
    setKyc(toKyc(await getKycStatusAction()));
  }, []);

  useEffect(() => {
    if (!mpesa || returnedSessionId) return;
    let cancelled = false;
    getKycStatusAction().then((result) => {
      if (!cancelled) setKyc(toKyc(result));
    });
    return () => {
      cancelled = true;
    };
  }, [mpesa, returnedSessionId]);

  const kycStatus = kyc.kind === "ready" ? kyc.status : null;
  const kycPolling =
    kycStatus === "in_review" || (Boolean(kycReturned) && kycStatus === "pending");

  useEffect(() => {
    if (!kycPolling) return;
    let cancelled = false;
    void (async () => {
      for (let i = 0; i < KYC_MAX_POLLS && !cancelled; i++) {
        await new Promise((r) => setTimeout(r, KYC_POLL_MS));
        if (cancelled) return;
        const result = await getKycStatusAction();
        if (cancelled || !result.ok) continue;
        setKyc(toKyc(result));
        if (result.status !== "in_review" && result.status !== "pending") return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kycPolling]);

  async function startVerification() {
    setKycBusy(true);
    setKycNote(null);
    const result = await startKycAction({ plan: planSlug, duration });
    if (!result.ok) {
      setKycBusy(false);
      return setKycNote(result.message);
    }
    if (result.url) {
      window.location.href = result.url;
      return;
    }
    setKyc({
      kind: "ready",
      status: result.status,
      required: true,
      available: result.available,
    });
    if (result.message) setKycNote(result.message);
    setKycBusy(false);
  }

  function settle(status: Awaited<ReturnType<typeof checkMinisendOrderAction>>) {
    if (!status.ok) return setStage({ kind: "error", message: status.message });

    if (status.credited) {
      setStage({ kind: "ok", message: "Payment complete — your plan has been activated!" });
      router.refresh();
      setTimeout(() => router.push("/dashboard/profile"), 2500);
      return "done";
    }
    if (status.needsReview) {
      return setStage({
        kind: "error",
        message:
          "We received a payment for a different amount than expected. Our team is reviewing it — please contact support.",
      });
    }
    if (MINISEND_DONE_STATUSES.includes(status.status)) {
      return setStage({
        kind: "error",
        message: "The payment wasn't completed. You can try again.",
      });
    }
  }

  async function poll(id: string) {
    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      const status = await checkMinisendOrderAction(id);
      if (!status.ok) continue;
      if (status.credited || status.needsReview || MINISEND_DONE_STATUSES.includes(status.status)) {
        return settle(status);
      }
    }
    setStage({
      kind: "error",
      message: "This is taking longer than expected. If you were charged, contact support.",
    });
  }

  useEffect(() => {
    if (!returnedSessionId || confirmed.current === returnedSessionId) return;
    confirmed.current = returnedSessionId;
    setStage({ kind: "working", message: "Confirming your payment…" });
    void (async () => {
      const status = await checkMinisendOrderAction(returnedSessionId);
      if (status.ok && !status.credited && !status.needsReview &&
          !MINISEND_DONE_STATUSES.includes(status.status)) {
        return poll(returnedSessionId);
      }
      settle(status);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per returned session
  }, [returnedSessionId]);

  if (returnedSessionId) {
    return (
      <section>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Minisend payment</h2>
        <div className="rounded-lg border border-border p-5">
          <p
            className={`text-sm font-medium ${
              stage.kind === "ok"
                ? "text-green-600"
                : stage.kind === "error"
                  ? "text-red-600"
                  : "text-muted"
            }`}
            role="status"
          >
            {("message" in stage && stage.message) || "Confirming your payment…"}
          </p>
        </div>
      </section>
    );
  }

  if (!mpesa && !stablecoin) return null;

  async function payWithMpesa() {
    setStage({ kind: "working", message: "Sending the payment request to your phone…" });
    const started = await startMinisendOrderAction({
      plan: planSlug,
      duration,
      phone: phone.trim(),
      country,
    });
    if (!started.ok) {
      if (started.kycRequired) {
        setStage({ kind: "idle" });
        return loadKyc();
      }
      return setStage({ kind: "error", message: started.message });
    }

    setStage({ kind: "waiting", amountKes: started.amountKes, phone: started.phone });
    void poll(started.orderId);
  }

  async function payWithStablecoin() {
    setStage({ kind: "working", message: "Opening secure checkout…" });
    const started = await startMinisendCheckoutAction({ plan: planSlug, duration, country });
    if (!started.ok) return setStage({ kind: "error", message: started.message });
    window.location.href = started.checkoutUrl;
  }

  const busy = stage.kind === "working" || stage.kind === "waiting";
  const kycPassed = kyc.kind === "ready" && (!kyc.required || kyc.status === "approved");

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {mpesa ? "Pay with M-Pesa (Safaricom only)" : "Pay with USDC / USDT"}
      </h2>
      <div className="rounded-lg border border-border p-5">
        {stage.kind === "waiting" ? (
          <p className="text-foreground">
            Check {stage.phone} and approve the M-Pesa request for{" "}
            <span className="font-bold text-primary">KSh {KES.format(stage.amountKes)}</span>. This
            page updates on its own.
          </p>
        ) : mpesa && !kycPassed ? (
          <KycGate
            kyc={kyc}
            returned={Boolean(kycReturned)}
            busy={kycBusy}
            note={kycNote}
            onStart={startVerification}
            onRetry={() => {
              setKycNote(null);
              setKyc({ kind: "loading" });
              void loadKyc();
            }}
          />
        ) : mpesa ? (
          <>
            <p className="mb-4 text-sm text-muted">
              {planName} · {duration} — pay in KES from your Safaricom M-Pesa line. You&apos;ll be
              shown the exact amount before your phone is charged.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XX XXX XXX"
                aria-label="Safaricom M-Pesa phone number"
                className="w-56 rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground"
              />
              <button
                type="button"
                onClick={payWithMpesa}
                disabled={busy || phone.trim().length < 9}
                className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Send request to my phone
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">
              {planName} · {duration} — pay with USDC or USDT from any wallet. Your plan activates
              as soon as the payment confirms.
            </p>
            <button
              type="button"
              onClick={payWithStablecoin}
              disabled={busy}
              className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              Pay with USDC / USDT
            </button>
          </>
        )}

        {(stage.kind === "working" || stage.kind === "ok" || stage.kind === "error") && (
          <p
            className={`mt-4 text-sm font-medium ${
              stage.kind === "ok"
                ? "text-green-600"
                : stage.kind === "error"
                  ? "text-red-600"
                  : "text-muted"
            }`}
            role="status"
          >
            {stage.message}
          </p>
        )}
      </div>
    </section>
  );
}

const BUTTON_CLASS =
  "rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60";

function KycGate({
  kyc,
  returned,
  busy,
  note,
  onStart,
  onRetry,
}: {
  kyc: Kyc;
  returned: boolean;
  busy: boolean;
  note: string | null;
  onStart: () => void;
  onRetry: () => void;
}) {
  if (kyc.kind === "loading") {
    return <p className="text-sm text-muted">Checking your verification status…</p>;
  }

  if (kyc.kind === "error") {
    return (
      <>
        <p className="mb-4 text-sm font-medium text-red-600" role="status">
          {kyc.message}
        </p>
        <button type="button" onClick={onRetry} className={BUTTON_CLASS}>
          Try again
        </button>
      </>
    );
  }

  if (kyc.status === "declined") {
    return (
      <p className="text-sm font-medium text-red-600" role="status">
        We couldn&apos;t verify your identity, so M-Pesa payments aren&apos;t available on this
        account. Please contact support, or choose another payment method below.
      </p>
    );
  }

  if (kyc.status === "in_review") {
    return (
      <p className="text-sm text-foreground" role="status">
        Your identity verification is being reviewed. This page updates on its own — you can pay
        with M-Pesa as soon as it&apos;s approved.
      </p>
    );
  }

  if (!kyc.available) {
    return (
      <>
        <p className="mb-4 text-sm text-foreground" role="status">
          ID verification is temporarily unavailable, so M-Pesa payments are paused. Please try again
          later, or choose another payment method below.
        </p>
        <button type="button" onClick={onRetry} className={BUTTON_CLASS}>
          Check again
        </button>
      </>
    );
  }

  if (kyc.status === "pending" && returned) {
    return (
      <p className="text-sm text-foreground" role="status">
        Finishing your verification… this page updates on its own.
      </p>
    );
  }

  return (
    <>
      <p className="mb-2 text-sm text-foreground">
        Before your first M-Pesa payment we need to verify your identity. It takes about two
        minutes: a photo of your ID and a quick selfie.
      </p>
      <p className="mb-4 text-xs text-subtle">
        Verification is handled securely by our partner Didit. By continuing you agree to your ID
        document and selfie being scanned to confirm who you are.
      </p>
      <button type="button" onClick={onStart} disabled={busy} className={BUTTON_CLASS}>
        {busy ? "Opening verification…" : kyc.status === "pending" ? "Continue verification" : "Verify my identity"}
      </button>
      {note && (
        <p className="mt-4 text-sm font-medium text-red-600" role="status">
          {note}
        </p>
      )}
    </>
  );
}
