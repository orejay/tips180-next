"use client";

import { useActionState, useState } from "react";
import { changePasswordAction, type FormState } from "@/app/(dashboard)/dashboard/actions";
import { cn } from "@/lib/utils";

export type ProfileInfo = {
  name: string;
  email: string;
  phone: string;
  country: string;
};

const initial: FormState = {};

export function ProfileTabs({ info }: { info: ProfileInfo }) {
  const [tab, setTab] = useState<0 | 1>(0);

  return (
    <div>
      <div className="mb-6 inline-flex rounded-md border border-border bg-background p-1 text-sm">
        {["My Information", "Change Password"].map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setTab(i as 0 | 1)}
            className={cn(
              "rounded px-3 py-1.5 font-medium transition-colors",
              tab === i ? "bg-primary text-white" : "text-muted hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 0 ? <InfoPanel info={info} /> : <ChangePasswordPanel />}
    </div>
  );
}

function InfoPanel({ info }: { info: ProfileInfo }) {
  const rows: [string, string][] = [
    ["Name", info.name || "—"],
    ["Email", info.email || "—"],
    ["Phone", info.phone || "—"],
    ["Country", info.country || "—"],
  ];

  return (
    <dl className="divide-y divide-stone-100 rounded-lg border border-border">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between px-4 py-3">
          <dt className="text-sm text-muted">{label}</dt>
          <dd className="text-sm font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ChangePasswordPanel() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initial);
  const inputClass =
    "w-full rounded-md border border-border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="old_password" className="text-sm font-medium text-muted">
          Current Password
        </label>
        <input id="old_password" name="old_password" type="password" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="new_password" className="text-sm font-medium text-muted">
          New Password
        </label>
        <input id="new_password" name="new_password" type="password" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirm" className="text-sm font-medium text-muted">
          Confirm New Password
        </label>
        <input id="confirm" name="confirm" type="password" required className={inputClass} />
      </div>

      {state.error && <p className="text-sm font-medium text-red-600" role="alert">{state.error}</p>}
      {state.success && <p className="text-sm font-medium text-green-600" role="status">{state.success}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-6 py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}
