"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signupAction, type AuthState } from "@/app/(auth)/auth/actions";
import { countries } from "@/config/countries";
import { AuthField, FormMessage, PasswordField, SubmitButton } from "./auth-ui";
import { SearchableSelect } from "@/components/ui/searchable-select";

const initial: AuthState = {};
const countryOptions = countries.map((c) => ({ value: c.label, label: c.label }));

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initial);
  const [country, setCountry] = useState("");

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-foreground">Create Account</h1>

      <form action={formAction} className="space-y-4">
        <AuthField label="Full Name" name="fname" />
        <AuthField label="Email Address" name="email" type="email" />
        <AuthField label="Phone Number" name="phone" type="tel" />

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted">
            Country<span className="text-red-500"> *</span>
          </span>
          <SearchableSelect
            options={countryOptions}
            value={country}
            onChange={setCountry}
            name="country"
            required
            placeholder="Select a country"
            searchPlaceholder="Search countries…"
          />
        </div>

        <PasswordField />
        <PasswordField label="Confirm Password" name="confirm" />
        <AuthField label="Referral Code" name="ref_code" required={false} placeholder="Optional" />

        <FormMessage state={state} />
        <SubmitButton pending={pending}>Sign Up</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-semibold text-primary underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
