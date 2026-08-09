import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell, Subheading } from "@/components/layout/content-shell";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Rollover Plan Money-Back Guarantee — Tips180",
  description:
    "Tips180 guarantees a minimum of 20 correctly predicted day-tips during your 30-day Rollover Plan, or you get a full refund. See eligibility, exclusions and how to claim.",
  alternates: { canonical: "/rollover-guarantee" },
};

export default function RolloverGuaranteePage() {
  return (
    <ContentShell title="Rollover Plan — Money-Back Guarantee Policy">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Rollover Money-Back Guarantee", url: `${siteConfig.url}/rollover-guarantee` },
        ])}
      />

      <Subheading as="h2">1. Overview</Subheading>
      <p className="text-foreground">
        The Rollover Plan Money-Back Guarantee Policy covers a 30-day
        subscription plan. It is available exclusively to the{" "}
        <Link href="/dashboard/rollover" className="font-medium text-primary hover:underline">
          Rollover subscribers
        </Link>{" "}
        of Tips180. On this page, we have set out the terms of the money-back
        guarantee attached to the Rollover Plan.
      </p>

      <Subheading as="h2">2. The Guarantee</Subheading>
      <p className="text-foreground">
        Tips180 guarantees a minimum of 20 correctly predicted day-tips during
        each subscriber&apos;s 30-day Rollover Plan period. If you are
        subscribing for the 10-day access, to qualify, you&apos;ll have to
        renew your subscription plan 3 times consecutively.
      </p>
      <p className="mt-3 text-foreground">
        If fewer than 20 day-tips are correctly predicted during the
        subscriber&apos;s active Rollover Plan period, the subscriber is
        entitled to a full refund of the subscription fee paid for that plan.
      </p>

      <Subheading as="h2">3. Definitions</Subheading>
      <ul className="list-disc space-y-2 pl-6 text-foreground">
        <li>
          <span className="font-semibold">Day-Tip:</span> A betting
          prediction/tip issued by tips180.com on a given day during the
          active Rollover Plan period.
        </li>
        <li>
          <span className="font-semibold">Correctly Predicted:</span> A
          day-tip whose predicted outcome matches the actual, settled result
          of the event.
        </li>
        <li>
          <span className="font-semibold">Rollover Plan Period:</span> The
          continuous 30-day period beginning on the date the subscription is
          activated.
        </li>
      </ul>

      <Subheading as="h2">4. Eligibility</Subheading>
      <p className="text-foreground">
        To qualify for the money-back guarantee, a subscriber must:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-foreground">
        <li>Hold an active, fully paid Rollover Plan subscription for the entire 30-day period.</li>
        <li>Have received all day-tips issued during that period.</li>
        <li>Submit a refund request within 5 days of the Rollover Plan period ending.</li>
      </ul>

      <Subheading as="h2">5. Exclusions</Subheading>
      <p className="text-foreground">
        The following do not count toward the 20-tip minimum, or may affect
        eligibility:
      </p>
      <ul className="list-disc space-y-2 pl-6 text-foreground">
        <li>Tips on events that are postponed, abandoned, or voided, where no settled result exists.</li>
        <li>
          Tips affected by circumstances outside tips180.com&apos;s control
          (e.g. third-party data/result feed errors) — these will be excluded
          from the count and communicated to the subscriber.
        </li>
        <li>Refund requests submitted after the claim window has closed.</li>
        <li>Subscriptions cancelled, paused, or refunded for other reasons before the 30-day period is complete.</li>
      </ul>

      <Subheading as="h2">6. How to Claim</Subheading>
      <ol className="list-decimal space-y-2 pl-6 text-foreground">
        <li>
          Contact us via our WhatsApp line on{" "}
          <a href="https://wa.me/2348131149662" className="font-medium text-primary hover:underline">
            +234 813 1149 662
          </a>{" "}
          within 5 days of the Rollover Plan period ending, requesting a
          Rollover Plan refund.
        </li>
        <li>Tips180 will review the subscriber&apos;s day-tip history against the 20-tip guarantee threshold.</li>
        <li>Approved refunds are processed within 3 business days, via the subscriber&apos;s original payment method.</li>
      </ol>

      <Subheading as="h2">7. Policy Notes</Subheading>
      <ul className="list-disc space-y-2 pl-6 text-foreground">
        <li>This guarantee applies solely to the Rollover Plan and does not extend to other tips180.com plans unless separately stated.</li>
        <li>Tips180 reserves the right to amend this policy; changes will not apply retroactively to subscriptions already active at the time of the change.</li>
        <li>This is a service-quality guarantee based on prediction accuracy — it is not a guarantee of betting winnings. Subscribers remain fully responsible for their own betting decisions and stakes.</li>
      </ul>

      <p className="mt-8 rounded-lg border border-border bg-surface-muted p-4 text-xs italic leading-relaxed text-subtle">
        None of the tips offered on{" "}
        <Link href="/" className="underline">
          tips180.com
        </Link>{" "}
        is 100% accurate. Please stake responsibly. Do not stake above your
        betting budget. See our{" "}
        <Link href="/betting-mistakes" className="underline">
          articles on how to gamble responsibly
        </Link>
        .
      </p>
    </ContentShell>
  );
}
