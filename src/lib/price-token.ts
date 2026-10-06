import "server-only";
import crypto from "node:crypto";
import { getPricingFor } from "@/config/pricing";

const SECRET = process.env.PAYMENT_SIGNING_SECRET ?? "";
const TTL_MS = 15 * 60 * 1000;

export type PriceClaim = {
  plan: string;
  duration: string;
  country: string;
  amount: number;
  currency: string;
  exp: number;
};

export function priceSigningConfigured(): boolean {
  return SECRET.length >= 16;
}

export function resolvePrice(planSlug: string, duration: string, country: string) {
  const { plans, currency } = getPricingFor(country);
  const plan = plans.find((p) => p.slug === planSlug);
  if (!plan) return null;
  const i = plan.durations.indexOf(duration);
  if (i === -1) return null;
  const price = plan.prices[i];
  if (!price) return null;
  return { amount: price.value, currency, label: price.label, name: plan.name };
}

export function mintPriceToken(input: {
  plan: string;
  duration: string;
  country: string;
  amount: number;
  currency: string;
}): string | null {
  if (!priceSigningConfigured()) return null;
  const claim: PriceClaim = { ...input, exp: Date.now() + TTL_MS };
  const body = Buffer.from(JSON.stringify(claim)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("hex");
  return `${body}.${sig}`;
}
