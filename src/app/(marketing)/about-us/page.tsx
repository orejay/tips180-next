import type { Metadata } from "next";
import { ContentShell, Subheading } from "@/components/layout/content-shell";

export const metadata: Metadata = {
  title: "About Us — Accurate Football Predictions | Tips180",
  description:
    "Learn about Tips180: how we analyse football matches, the plans we offer and why we focus on top leagues to help punters win more than they lose.",
  alternates: { canonical: "/about-us" },
};

export default function AboutUsPage() {
  return (
    <ContentShell title="About Tips180 Services">
      <div className="space-y-2 text-foreground">
        <p>
          At Tips180, we are passionate about guiding punters across the world
          win more than they lose eventually.
        </p>

        <Subheading as="h2">
          What is our objective? How do you benefit?
        </Subheading>

        <Subheading as="h3">We?</Subheading>
        <ul className="list-disc space-y-1 pl-8">
          <li>Thoroughly analyze football matches.</li>
          <li>
            Consider all aspects of uncertainties to provide tip(s) that has the
            highest probability to win.
          </li>
          <li>Avoid predicting uncertain football matches.</li>
          <li>Provide analytical report for our premium users on demand.</li>
          <li>Provide series of Experts&apos; tips for our users to make selections on.</li>
          <li>
            Provide different types of plan tailored to accommodate your betting
            style.
          </li>
        </ul>

        <Subheading as="h3">You?</Subheading>
        <ul className="list-disc space-y-1 pl-8">
          <li>Have different plans to make your selections from.</li>
          <li>Form your ideas and opinions based on our guidance.</li>
          <li>Increase your chances of winning.</li>
          <li>Typically win more than you lose.</li>
          <li>Aren&apos;t spending a lot of time making match forecasts on your own.</li>
          <li>WIN!</li>
        </ul>

        <Subheading as="h2">How do we operate?</Subheading>
        <p>For every tip provided on our platform, we have covered;</p>
        <ul className="list-disc space-y-1 pl-8">
          <li>Concrete reasoning behind each pick.</li>
          <li>
            Risk management strategy which determines possible outcomes of single
            and multiple events.
          </li>
          <li>Recommendations on how to spread your budget among selected picks.</li>
        </ul>
        <p>
          Our team offers details concerning upcoming football matches on request.
          You are not compelled to take all our selections. It is your choice
          whether to place a bet on a recommended result.
        </p>

        <Subheading as="h2">We predict top leagues</Subheading>
        <p>
          At Tips180, we offer predictions mainly on top leagues and major
          tournaments. We try to avoid predicting the outcome of non-popular
          leagues and uncertain events. Top-leagues are under constant close
          attention of media and sport governing organizations, unlike
          non-popular championships, where there is a high chance of bribery. In
          this case, how can you trust such analysis? Simply put, we are dedicated
          to help you increase the success rate of your bets!
        </p>
      </div>
    </ContentShell>
  );
}
