import { redirect } from "next/navigation";

/** /dashboard has no landing of its own — send users to their profile. */
export default function DashboardIndex() {
  redirect("/dashboard/profile");
}
