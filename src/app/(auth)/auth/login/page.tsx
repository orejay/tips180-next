import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const { registered, reset } = await searchParams;
  const notice = registered
    ? "Account created — please sign in."
    : reset
      ? "Password changed — please sign in."
      : null;

  return (
    <AuthShell image="/images/signin.svg">
      <LoginForm notice={notice} />
    </AuthShell>
  );
}
