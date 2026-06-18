import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { ManualPayments } from "@/components/payment/manual-payments";

export const metadata: Metadata = {
  title: "How to Pay — Subscribe to Tips180 Predictions",
  description:
    "How to pay for a Tips180 subscription: pay by card (Paystack/Flutterwave) or local mobile money and bank transfer across Nigeria, Ghana, Kenya and more.",
  alternates: { canonical: "/how-to-pay" },
};

const steps = [
  { title: "1. Create a free account", body: "Sign up with your email and phone number — it takes less than a minute." },
  { title: "2. Choose a plan", body: "Pick the plan and duration that match your betting style from Our Plans." },
  { title: "3. Pay securely", body: "Pay by card (Paystack or Flutterwave) or use a local mobile-money / bank transfer option below." },
  { title: "4. Get upgraded automatically", body: "Card payments activate instantly; manual payments are confirmed on WhatsApp and upgraded shortly after." },
];

export default function HowToPayPage() {
  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "How to Pay", url: `${siteConfig.url}/how-to-pay` },
        ])}
      />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">How to Pay</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Subscribe by card or your preferred local payment method.
        </p>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-12">
        <ol className="space-y-4">
          {steps.map((step) => (
            <li key={step.title} className="rounded-lg border border-border bg-surface p-5">
              <h2 className="font-semibold text-foreground">{step.title}</h2>
              <p className="mt-1 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="my-8 flex flex-wrap gap-3">
          <Link
            href="/our-plans"
            className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90"
          >
            View Plans
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md border border-border px-6 py-2.5 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Create Account
          </Link>
        </div>

        <ManualPayments />
      </div>
    </div>
  );
}
