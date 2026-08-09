import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/guide-page";
import {
  bettingMistakesFaqs,
  bettingMistakesSections,
  bettingMistakesSlug,
} from "@/config/guides/betting-mistakes";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "7 Mistakes To Avoid When Following Football Tips",
  description:
    "The 7 most dangerous mistakes bettors make when following football betting tips — tipster verification, bankroll management, value betting and responsible gambling.",
  alternates: { canonical: `/${bettingMistakesSlug}` },
};

export default function BettingMistakesPage() {
  return (
    <GuidePage
      slug={bettingMistakesSlug}
      h1="Mistakes To Avoid When Following Football Tips"
      heroSubtitle="A comprehensive guide to the 7 most dangerous mistakes bettors make when following football betting tips — and what to do instead."
      sections={bettingMistakesSections}
      faqs={bettingMistakesFaqs}
      defaultAuthor="Joseph Adetade"
      defaultDateIso="2026-08-09"
      authorRole="Sports Betting Writer"
      authorBio="Joseph is a sports betting writer specialising in football predictions, betting tips, match analysis, betting odds, and sports betting strategies. Joseph analyses team form, player performance, statistics, and betting markets to provide readers with useful, easy-to-understand sports betting insights."
    />
  );
}
