"use server";

import { revalidatePath } from "next/cache";
import { siteConfig } from "@/config/site";
import { getToken } from "@/lib/session";

export type FormState = { error?: string; success?: string };

/** Mark a message as read, then refresh the messages page. */
export async function markMessageReadAction(id: number): Promise<void> {
  const token = await getToken();
  if (!token) return;
  try {
    await fetch(`${siteConfig.apiUrl}/messages/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message_id: id }),
      cache: "no-store",
    });
  } catch {
    // best-effort; the unread badge will simply persist until next load
  }
  revalidatePath("/dashboard/messages");
}

export async function changePasswordAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const old_password = String(formData.get("old_password") ?? "");
  const new_password = String(formData.get("new_password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (new_password.length < 6) return { error: "New password must be at least 6 characters." };
  if (new_password !== confirm) return { error: "New passwords do not match." };

  const token = await getToken();
  if (!token) return { error: "Your session has expired. Please sign in again." };

  try {
    const res = await fetch(`${siteConfig.apiUrl}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ old_password, new_password }),
      cache: "no-store",
    });
    if (res.status === 400) return { error: "Your current password is incorrect." };
    if (!res.ok) return { error: "Could not change your password. Please try again." };
    return { success: "Password changed successfully." };
  } catch {
    return { error: "Network error. Please try again." };
  }
}
