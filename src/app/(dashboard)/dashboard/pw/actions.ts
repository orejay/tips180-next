"use server";

import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";
import { getToken } from "@/lib/session";

export type PwResult = { ok: boolean; message: string };

async function pwPost(path: string, body: unknown): Promise<Response | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await fetch(`${siteConfig.apiUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return null;
  }
}

/** Submit a round's predictions (one H/D/A char per fixture, in order). */
export async function submitPredictionAction(input: {
  round: string;
  set_id: number;
  prediction: string;
}): Promise<PwResult> {
  const res = await pwPost("/predictions/submit", input);
  if (!res) return { ok: false, message: "Your session has expired. Please sign in again." };
  if (res.status === 403) return { ok: false, message: "You have already entered this round." };
  if (!res.ok) return { ok: false, message: "Could not submit your predictions. Please try again." };
  revalidatePath("/dashboard/pw");
  return { ok: true, message: "Your predictions have been submitted. Good luck!" };
}

/** Verify the entry-fee payment, then record it against the round. */
export async function verifyPwEntryAction(input: {
  reference: string;
  round: number;
  country: string;
}): Promise<PwResult> {
  const verify = await pwPost("/predictions/pay/verify", { reference: input.reference });
  if (!verify) return { ok: false, message: "Your session has expired. Please sign in again." };
  const json = (await verify.json().catch(() => null)) as { data?: { status?: string } } | null;
  if (!verify.ok || json?.data?.status !== "success") {
    return { ok: false, message: "We couldn't confirm your entry payment." };
  }

  const record = await pwPost("/predictions/pay/paystack", {
    round: input.round,
    reference: input.reference,
    country: input.country,
  });
  if (!record || !record.ok) {
    return { ok: false, message: "Payment confirmed but entry wasn't recorded. Contact support." };
  }
  revalidatePath("/dashboard/pw");
  return { ok: true, message: "Entry fee paid — you can now submit your predictions." };
}
