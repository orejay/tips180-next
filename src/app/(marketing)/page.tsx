import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";
import { homeFaqs } from "@/config/faq";
import { Hero } from "@/components/marketing/hero";
import { AnnouncementBanner } from "@/components/marketing/announcement-banner";
import { FreeTips } from "@/components/marketing/free-tips";
import { LoyaltyAd } from "@/components/marketing/loyalty-ad";
import { SmartBetLanding } from "@/components/marketing/smartbet-landing";
import { LandingLeagues } from "@/components/marketing/landing-leagues";
import { HomePredictions } from "@/components/marketing/home-predictions";
import { LandingStore } from "@/components/marketing/landing-store";
import { LandingPlans } from "@/components/marketing/landing-plans";
import { SportsNews } from "@/components/marketing/sports-news";
import { Testimonials } from "@/components/marketing/testimonials";
import { HomeFaq } from "@/components/marketing/home-faq";
import { Writeup } from "@/components/marketing/writeup";

export const metadata: Metadata = {
  title: "Free Football Predictions & Betting Tips Today",
  description:
    "Get today's most accurate free football predictions, correct scores, over 2.5 goals and accumulator tips from Tips180.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* The full FAQ set drives both the visible accordion and the schema. */}
      <JsonLd data={faqSchema(homeFaqs)} />
      <Hero />
      <AnnouncementBanner />
      <FreeTips />
      <LoyaltyAd />
      <SmartBetLanding />
      <LandingLeagues />
      <HomePredictions />
      <LandingStore />
      <LandingPlans />
      <SportsNews />
      <Testimonials />
      <HomeFaq />
      <Writeup />
    </>
  );
}
