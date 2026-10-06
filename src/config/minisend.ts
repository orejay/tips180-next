import { getPricingFor } from "@/config/pricing";

export const minisendCountries: Record<string, string> = {
  KE: "Kenya",
  TZ: "Tanzania",
};

export function minisendMpesaAvailable(country: string): boolean {
  return Boolean(minisendCountries[country?.toUpperCase()]);
}

export function minisendStablecoinAvailable(country: string): boolean {
  return Boolean(country) && getPricingFor(country).currency === "USD";
}

export const MINISEND_DONE_STATUSES = ["completed", "failed", "expired"];
