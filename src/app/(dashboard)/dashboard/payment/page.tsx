import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-auth";
import { PaymentClient } from "@/components/payment/payment-client";

export const metadata: Metadata = { title: "Make Payment" };

export default async function PaymentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/payment");

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Make Payment</h1>
      <PaymentClient email={user.email} name={user.name} />
    </div>
  );
}
