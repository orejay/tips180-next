import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/guide-page";
import {
  bettingStrategiesFaqs,
  bettingStrategiesSections,
  bettingStrategiesSlug,
} from "@/config/guides/betting-strategies";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Best Football Betting Strategies — Detailed Guide",
  description:
    "Proven football betting strategies that actually work: value betting, bankroll management, niche markets, in-play trading and closing line value (CLV).",
  alternates: { canonical: `/${bettingStrategiesSlug}` },
};

export default function BettingStrategiesPage() {
  return (
    <GuidePage
      slug={bettingStrategiesSlug}
      h1="Best Football Betting Strategies"
      heroSubtitle="A detailed guide to the football betting strategies that actually work — value betting, bankroll management, niche markets and in-play trading."
      sections={bettingStrategiesSections}
      faqs={bettingStrategiesFaqs}
      defaultAuthor="Teboho Mokoena"
      defaultDateIso="2026-08-09"
      authorRole="Sports Betting Analyst"
      authorBio="Teboho Mokoena is South Africa's authoritative voice on sports betting platforms, leveraging years of financial journalism to navigate the region's sophisticated and highly regulated betting market, with deep expertise in how local legislation, consumer protection laws and licensing requirements shape the sportsbook landscape."
    />
  );
}
