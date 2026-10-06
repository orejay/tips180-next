"use server";

import { siteConfig } from "@/config/site";
import { minisendMpesaAvailable, minisendStablecoinAvailable } from "@/config/minisend";
import { getToken, setSession, toSessionUser } from "@/lib/session";
import { getCurrentUser } from "@/lib/api-auth";
import { mintPriceToken, priceSigningConfigured, resolvePrice } from "@/lib/price-token";

export type StartResult =
  | { ok: true; orderId: string; amountKes: number; phone: string }
  | { ok: false; message: string };

export type StatusResult =
  | { ok: true; status: string; credited: boolean; needsReview: boolean; failureReason?: string }
  | { ok: false; message: string };

async function backend(path: string, init: RequestInit) {
  const token = await getToken();
  if (!token) return null;
  return fetch(`${siteConfig.apiUrl}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
    cache: "no-store",
  });
}

function signedPrice(plan: string, duration: string, country: string): string | null {
  if (!priceSigningConfigured()) return null;
  const resolved = resolvePrice(plan, duration, country);
  if (!resolved) return null;
  return mintPriceToken({
    plan,
    duration,
    country: country.toUpperCase(),
    amount: resolved.amount,
    currency: resolved.currency,
  });
}

export async function startMinisendOrderAction(input: {
  plan: string;
  duration: string;
  phone: string;
  country: string;
}): Promise<StartResult> {
  if (!minisendMpesaAvailable(input.country)) {
    return { ok: false, message: "M-Pesa payment is not available in your country." };
  }

  const token = signedPrice(input.plan, input.duration, input.country);
  if (!token) {
    return { ok: false, message: "Payment is temporarily unavailable. Please try again later." };
  }

  try {
    const res = await backend("subscriptions/minisend/order", {
      method: "POST",
      body: JSON.stringify({ price_token: token, phone: input.phone }),
    });
    if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };

    const json = (await res.json().catch(() => null)) as {
      created?: boolean;
      msg?: string;
      order_id?: string;
      amount_kes?: number;
      phone?: string;
    } | null;

    if (!res.ok || !json?.created || !json.order_id) {
      return { ok: false, message: json?.msg ?? "Could not start the payment. Please try again." };
    }

    return {
      ok: true,
      orderId: json.order_id,
      amountKes: json.amount_kes ?? 0,
      phone: json.phone ?? input.phone,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export type CheckoutResult =
  | { ok: true; sessionId: string; checkoutUrl: string }
  | { ok: false; message: string };

export async function startMinisendCheckoutAction(input: {
  plan: string;
  duration: string;
  country: string;
}): Promise<CheckoutResult> {
  if (!minisendStablecoinAvailable(input.country)) {
    return { ok: false, message: "Stablecoin payment is not available in your country." };
  }

  const token = signedPrice(input.plan, input.duration, input.country);
  if (!token) {
    return { ok: false, message: "Payment is temporarily unavailable. Please try again later." };
  }

  try {
    const res = await backend("subscriptions/minisend/checkout", {
      method: "POST",
      body: JSON.stringify({ price_token: token }),
    });
    if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };

    const json = (await res.json().catch(() => null)) as {
      created?: boolean;
      msg?: string;
      session_id?: string;
      checkout_url?: string;
    } | null;

    if (!res.ok || !json?.created || !json.checkout_url || !json.session_id) {
      return { ok: false, message: json?.msg ?? "Could not start the payment. Please try again." };
    }

    return { ok: true, sessionId: json.session_id, checkoutUrl: json.checkout_url };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function checkMinisendOrderAction(orderId: string): Promise<StatusResult> {
  try {
    const res = await backend(`subscriptions/minisend/order/${encodeURIComponent(orderId)}`, {
      method: "GET",
    });
    if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };

    const json = (await res.json().catch(() => null)) as {
      found?: boolean;
      status?: string;
      credited?: boolean;
      needs_review?: boolean;
      failure_reason?: string | null;
    } | null;

    if (!res.ok || !json?.found || !json.status) {
      return { ok: false, message: "We couldn't find this payment. If you were charged, contact support." };
    }

    if (json.credited) {
      const token = await getToken();
      const user = await getCurrentUser();
      if (token && user) await setSession(token, toSessionUser(user));
    }

    return {
      ok: true,
      status: json.status,
      credited: Boolean(json.credited),
      needsReview: Boolean(json.needs_review),
      failureReason: json.failure_reason ?? undefined,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
