"use server";

import { backendFetch } from "@/lib/backend-fetch";

export type KycState = "none" | "pending" | "in_review" | "approved" | "declined";

export type KycStatusResult =
  | { ok: true; status: KycState; verified: boolean; required: boolean; available: boolean }
  | { ok: false; message: string };

export type KycStartResult =
  | { ok: true; status: KycState; verified: boolean; available: boolean; url?: string; message?: string }
  | { ok: false; message: string };

function toState(value: unknown): KycState {
  return value === "pending" || value === "in_review" || value === "approved" || value === "declined"
    ? value
    : "none";
}

export async function getKycStatusAction(): Promise<KycStatusResult> {
  try {
    const res = await backendFetch("kyc/status", { method: "GET" });
    if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };

    const json = (await res.json().catch(() => null)) as {
      status?: string;
      verified?: boolean;
      required?: boolean;
      available?: boolean;
    } | null;

    if (!res.ok || !json) {
      return { ok: false, message: "We couldn't check your verification status. Please try again." };
    }

    return {
      ok: true,
      status: toState(json.status),
      verified: Boolean(json.verified),
      required: Boolean(json.required),
      available: Boolean(json.available),
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}

export async function startKycAction(input: {
  plan: string;
  duration: string;
}): Promise<KycStartResult> {
  try {
    const res = await backendFetch("kyc/session", {
      method: "POST",
      body: JSON.stringify({ plan: input.plan, duration: input.duration }),
    });
    if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };

    const json = (await res.json().catch(() => null)) as {
      status?: string;
      verified?: boolean;
      available?: boolean;
      url?: string;
      msg?: string;
    } | null;

    if (!res.ok || !json) {
      return { ok: false, message: "Could not start verification. Please try again." };
    }

    return {
      ok: true,
      status: toState(json.status),
      verified: Boolean(json.verified),
      available: json.available !== false,
      url: json.url,
      message: json.msg,
    };
  } catch {
    return { ok: false, message: "Network error. Please try again." };
  }
}
