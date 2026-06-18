import type { Metadata } from "next";
import { ContentShell } from "@/components/layout/content-shell";

export const metadata: Metadata = {
  title: "Refund Policy — Tips180 Subscription Plans",
  description:
    "Tips180's refund policy. Once a plan is paid for and your account is upgraded, the service is deemed delivered and no refunds are issued.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <ContentShell title="Refund Policy">
      <p className="text-foreground">
        Refund Policy: Please note that once you have paid for a plan, and your
        account has been upgraded, then the service is deemed to have been
        provided. After that point, there will be no refunds as the service has
        been delivered at your own request, and an agreed price before making
        payment.
      </p>
    </ContentShell>
  );
}
