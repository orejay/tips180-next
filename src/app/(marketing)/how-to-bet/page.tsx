import type { Metadata } from "next";
import { GuidePage } from "@/components/marketing/guide-page";
import { howToBetFaqs, howToBetSections, howToBetSlug } from "@/config/guides/how-to-bet";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "How To Bet On Football Matches — Complete Guide",
  description:
    "A step-by-step guide to placing a football bet in Nigeria: choosing a licensed site, depositing funds, understanding odds, placing bets and withdrawing winnings.",
  alternates: { canonical: `/${howToBetSlug}` },
};

export default function HowToBetPage() {
  return (
    <GuidePage
      slug={howToBetSlug}
      h1="How To Bet On Football Matches"
      heroSubtitle="A complete, step-by-step guide to placing a football bet in Nigeria — choosing a site, depositing funds, understanding odds, and withdrawing winnings."
      sections={howToBetSections}
      faqs={howToBetFaqs}
      defaultAuthor="Joseph Adetade"
      defaultDateIso="2026-08-09"
      authorRole="Sports Betting Writer"
      authorBio="Joseph is a sports betting writer specialising in football predictions, betting tips, match analysis, betting odds, and sports betting strategies. Joseph analyses team form, player performance, statistics, and betting markets to provide readers with useful, easy-to-understand sports betting insights."
    />
  );
}
