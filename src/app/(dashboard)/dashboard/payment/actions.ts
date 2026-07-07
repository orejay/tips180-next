"use server";

import { siteConfig } from "@/config/site";
import { getToken } from "@/lib/session";

export type PaymentResult = { ok: boolean; message: string };

type Provider = "paystack" | "flutter";

/**
 * Verify a completed payment and upgrade the user's plan — both server-side, so
 * the session token never reaches the browser. Called from the checkout widget's
 * success callback with the provider reference.
 */
export async function verifyAndUpgradeAction(input: {
  provider: Provider;
  reference: string;
  plan: string;
  duration: string;
}): Promise<PaymentResult> {
  const { provider, reference, plan, duration } = input;
  const token = await getToken();
  if (!token) return { ok: false, message: "Your session has expired. Please sign in again." };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // 1. Verify the transaction with the provider (backend holds the secret key).
    const verifyRes = await fetch(`${siteConfig.apiUrl}/subscriptions/verify/${provider}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reference }),
      cache: "no-store",
    });
    const verifyJson = (await verifyRes.json().catch(() => null)) as
      | { data?: { status?: string } }
      | null;
    const status = verifyJson?.data?.status;
    if (!verifyRes.ok || (status !== "success" && status !== "successful")) {
      return { ok: false, message: "We couldn't confirm your payment. If you were charged, contact support." };
    }

    // 2. Upgrade the plan.
    const upgradeRes = await fetch(`${siteConfig.apiUrl}/subscriptions/${provider}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ plan, duration, reference }),
      cache: "no-store",
    });
    if (!upgradeRes.ok) {
      return { ok: false, message: "Payment confirmed but the upgrade failed. Please contact support with your reference." };
    }

    return { ok: true, message: "Payment complete — your plan has been activated!" };
  } catch {
    return { ok: false, message: "Network error. If you were charged, contact support." };
  }
}
