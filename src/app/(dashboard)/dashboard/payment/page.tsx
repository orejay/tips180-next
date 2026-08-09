import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-auth";
import { PaymentClient } from "@/components/payment/payment-client";

export const metadata: Metadata = { title: "Make Payment" };

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; duration?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/payment");

  const { plan, duration } = await searchParams;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Make Payment</h1>
      <PaymentClient
        email={user.email}
        name={user.name}
        initialPlan={plan}
        initialDuration={duration}
      />
    </div>
  );
}
