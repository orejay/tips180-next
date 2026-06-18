"use server";

import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { setSession, toSessionUser } from "@/lib/session";

export type AuthState = { error?: string; success?: string };

type PostResult = { ok: boolean; status: number; json: Record<string, unknown> | null };

async function postJson(path: string, body: unknown): Promise<PostResult> {
  const res = await fetch(`${siteConfig.apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  let json: Record<string, unknown> | null = null;
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    json = null;
  }
  return { ok: res.ok, status: res.status, json };
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  let authed = false;
  try {
    const { ok, json } = await postJson("/auth/login", { email, password });
    if (ok && json?.is_authenticated && typeof json.refresh_token === "string") {
      await setSession(json.refresh_token, toSessionUser(json));
      authed = true;
    }
  } catch {
    return { error: "Network error. Please try again." };
  }

  if (!authed) return { error: "Email or password is invalid." };
  redirect("/dashboard/profile");
}

export async function signupAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fname = String(formData.get("fname") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const ref_code = String(formData.get("ref_code") ?? "").trim();

  if (!fname || !email || !phone || !country) return { error: "Please fill in all required fields." };
  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  let created = false;
  try {
    const { json, status } = await postJson("/auth/signup", {
      fname,
      email,
      phone,
      country,
      password,
      ref_code,
    });
    if (status === 409 || json?.user_exists) {
      return { error: "An account with this email already exists." };
    }
    if (json?.user_created) created = true;
  } catch {
    return { error: "Network error. Please try again." };
  }

  if (!created) return { error: "Could not create your account. Please try again." };
  redirect("/auth/login?registered=1");
}

export async function forgotAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email address." };

  try {
    const { ok, json } = await postJson("/auth/reset-request", { email });
    if (ok && json?.sent) {
      return { success: "Check your email for a password reset link." };
    }
    return { error: "No account found with that email address." };
  } catch {
    return { error: "Network error. Please try again." };
  }
}

export async function resetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) return { error: "Password must be at least 6 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  let done = false;
  try {
    const { ok } = await postJson("/auth/reset", { token, password });
    done = ok;
  } catch {
    return { error: "Network error. Please try again." };
  }

  if (!done) return { error: "This password reset link is invalid or has expired." };
  redirect("/auth/login?reset=1");
}

export async function logoutAction(): Promise<void> {
  const { clearSession } = await import("@/lib/session");
  await clearSession();
  redirect("/auth/login");
}
