"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/app/(auth)/auth/actions";
import { AuthField, FormMessage, PasswordField, SubmitButton } from "./auth-ui";

const initial: AuthState = {};

export function LoginForm({ notice, from }: { notice?: string | null; from?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);
  const signupHref = from ? `/auth/signup?next=${encodeURIComponent(from)}` : "/auth/signup";

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Sign In</h1>

      {notice && (
        <p className="mb-4 text-sm font-medium text-green-600" role="status">
          {notice}
        </p>
      )}

      <form action={formAction} className="space-y-4">
        {from && <input type="hidden" name="from" value={from} />}
        <AuthField label="Email Address" name="email" type="email" />
        <PasswordField />
        <FormMessage state={state} />
        <SubmitButton pending={pending}>Sign In</SubmitButton>
      </form>

      <div className="mt-5 text-sm">
        <Link href="/auth/password" className="text-primary underline">
          Forgot Password?
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href={signupHref} className="font-semibold text-primary underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
