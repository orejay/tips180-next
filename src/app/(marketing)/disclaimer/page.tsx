import type { Metadata } from "next";
import { ContentShell } from "@/components/layout/content-shell";

export const metadata: Metadata = {
  title: "Disclaimer — General Disclaimer & Waiver of Liability",
  description:
    "Tips180's general disclaimer and waiver of liability. Football predictions and betting advice are provided for general guidance only — bet responsibly.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <ContentShell title="General Disclaimer and Waiver of Liability">
      <div className="space-y-4 text-foreground">
        <p>
          The information on this site is intended to furnish users with general
          information on football predictions, and betting advisory among other
          betting-related analyses.
        </p>
        <p>
          The information contained and accessed on this site{" "}
          <a href="https://www.tips180.com" className="text-primary underline">
            www.tips180.com
          </a>{" "}
          is provided by Tips180 for general football predictions guidance and it
          is not intended to substitute for any investment scheme whatsoever.
        </p>
        <p>
          However, there are no expressed or implicit warranties nor
          representations with regards to the content&apos;s accuracy and/or
          completeness.
        </p>
        <p>
          You are advised to consult with appropriate Tips180 customer service
          representatives via the channels provided on the website for inquiries
          and advice regarding any of our service offerings.
        </p>
        <p>
          Tips180 Concepts shall not be held responsible and/or liable for any
          consultation made outside the contact channels provided on this
          website.
        </p>
        <p className="mt-6">
          <span className="mb-2 block font-bold">
            COMPANY REGISTRATION: BN 2640693
          </span>
          <span className="block font-bold">REGISTERED COMPANY ADDRESS</span>
          HFP EASTLINE COMPLEX, ABRAHAM ADESANYA, LAGOS, NIGERIA.
          <span className="mt-4 block">
            COPYRIGHT© 2023 TIPS180 CONCEPTS ALL RIGHTS RESERVED | POWERED BY
            TIPS180
          </span>
        </p>
      </div>
    </ContentShell>
  );
}
