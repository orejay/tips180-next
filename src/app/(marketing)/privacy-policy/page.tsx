import type { Metadata } from "next";
import { ContentShell, Subheading } from "@/components/layout/content-shell";

export const metadata: Metadata = {
  title: "Privacy Policy — How Tips180 Protects Your Data",
  description:
    "How Tips180 Concepts collects, uses and safeguards the personal information you provide when using tips180.com. Effective 25/12/2023.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <ContentShell title="Privacy Policy">
      <div className="space-y-3 text-foreground">
        <p>
          This privacy policy sets out how Tips180 Concepts (hereon referred to as
          Tips180) uses and protects any information that you give Tips180 when you
          use this website. Tips180 is committed to ensuring that your privacy is
          protected. If required to provide certain information by which you can be
          identified when using this website, be assured that it will only be used
          in accordance with this privacy statement.
        </p>
        <p>
          Tips180 may change this policy from time to time by updating this page.
          You should check this page from time to time to ensure you are happy with
          the changes. This policy is effective from 25/12/2023.
        </p>

        <Subheading as="h2">What we collect?</Subheading>
        <p>We may collect the following information:</p>
        <ol className="list-decimal space-y-1 pl-8">
          <li>Your name.</li>
          <li>Your email address.</li>
          <li>Your phone number and date of birth.</li>
          <li>Other information relevant to customer savers and/or offers.</li>
        </ol>

        <Subheading as="h2">
          What do we do with the information we gather?
        </Subheading>
        <p>
          We require this information to understand your needs and provide you with
          a better service, and in particular for the following reasons:
        </p>
        <ol className="list-decimal space-y-1 pl-8">
          <li>
            Internal record keeping. We may periodically send emails and SMS
            consisting of our products and services using the email address and
            phone numbers which you have provided.
          </li>
          <li>We may use the information to improve our products and services.</li>
          <li>
            We may periodically send promotional emails about new products, special
            offers or other information which we think you may find interesting
            using the email address which you have provided. From time to time, we
            may also use your information to contact you for market research
            purposes.
          </li>
          <li>We may contact you by email or phone.</li>
          <li>
            We may use the information to customize the website according to some of
            your interests.
          </li>
        </ol>

        <Subheading as="h2">Security</Subheading>
        <p>
          We are committed to ensuring that your information is secure. In order to
          prevent unauthorised access or disclosure, we have put in place suitable
          physical, electronic and managerial procedures to safeguard and secure the
          information we collect online. Controlling your personal information you
          may choose to restrict the collection or use of your personal information
          in the following ways:
        </p>
        <ol className="list-decimal space-y-1 pl-8">
          <li>
            Whenever you are asked to fill in a form on the website, look for the box
            that you can click on to indicate that you do not want the information to
            be used by anybody for direct marketing purposes. If you have previously
            agreed to us using your personal information for direct marketing
            purposes, you may change your mind at any time by emailing us at
            hello@tips180.com.
          </li>
          <li>
            We will not sell, distribute or lease your personal information to third
            parties unless we have your permission or are required by law to do so.
            We may use your personal information to send you promotional information
            about third parties which we think you may find interesting if you tell
            us that you wish this to happen.
          </li>
          <li>
            You may request details of personal information which we hold about you
            under the Data Protection Laws. If you believe that any information we are
            holding on you is incorrect or incomplete, please email us as soon as
            possible at the above address. We will promptly correct any information
            found to be incorrect.
          </li>
          <li>
            Delete your Tips180 account. You can delete your account at any time. If
            you change your mind, you might not be able to recover it.
          </li>
        </ol>

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
