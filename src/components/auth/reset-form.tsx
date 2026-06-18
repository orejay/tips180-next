"use client";

import { useActionState } from "react";
import { resetAction, type AuthState } from "@/app/(auth)/auth/actions";
import { FormMessage, PasswordField, SubmitButton } from "./auth-ui";

const initial: AuthState = {};

export function ResetForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetAction, initial);

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold text-foreground">Reset Password</h1>
      <p className="mb-6 text-sm text-muted">Enter your new password below.</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <PasswordField label="New Password" name="password" />
        <PasswordField label="Confirm Password" name="confirm" />
        <FormMessage state={state} />
        <SubmitButton pending={pending}>Submit</SubmitButton>
      </form>
    </div>
  );
}
