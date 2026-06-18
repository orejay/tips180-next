"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/app/(auth)/auth/actions";
import { AuthField, FormMessage, PasswordField, SubmitButton } from "./auth-ui";

const initial: AuthState = {};

export function LoginForm({ notice }: { notice?: string | null }) {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Sign In</h1>

      {notice && (
        <p className="mb-4 text-sm font-medium text-green-600" role="status">
          {notice}
        </p>
      )}

      <form action={formAction} className="space-y-4">
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
        <Link href="/auth/signup" className="font-semibold text-primary underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
