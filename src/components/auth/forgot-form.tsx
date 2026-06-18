"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotAction, type AuthState } from "@/app/(auth)/auth/actions";
import { AuthField, FormMessage, SubmitButton } from "./auth-ui";

const initial: AuthState = {};

export function ForgotForm() {
  const [state, formAction, pending] = useActionState(forgotAction, initial);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold text-foreground">Forgot Password?</h1>
      <p className="mb-6 text-sm text-muted">
        A link will be sent to your registered email address. Click it to reset
        your password.
      </p>

      <form action={formAction} className="space-y-4">
        <AuthField label="Email Address" name="email" type="email" />
        <FormMessage state={state} />
        <SubmitButton pending={pending}>Submit</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href="/auth/login" className="font-semibold text-primary underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
