import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileTabs, type ProfileInfo } from "@/components/dashboard/profile-tabs";
import { getCurrentUser } from "@/lib/api-auth";

export const metadata: Metadata = { title: "My Account" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?from=/dashboard/profile");

  const info: ProfileInfo = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    country: user.country,
    plan: user.accoutplan,
    refCode: user.ref_code,
    refPoints: user.ref_points,
    loyaltyPoints: user.loyalty_points,
    balance: user.balance,
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">My Account</h1>
      <ProfileTabs info={info} />
    </div>
  );
}
