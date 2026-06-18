import type { Metadata } from "next";
import { authFetch } from "@/lib/api-auth";

export const metadata: Metadata = { title: "We Are Hiring" };

export default async function HiringPage() {
  const data = await authFetch<{ jobs?: { roles?: string } }>("getendpoints/jobs");
  const roles = (data?.jobs?.roles ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">We Are Hiring!</h1>
      <p className="mb-6 text-muted">
        Join the Tips180 team. We&apos;re currently looking to fill the roles
        below — send your CV and a short cover note to{" "}
        <a href="mailto:hello@tips180.com" className="text-primary underline">
          hello@tips180.com
        </a>
        .
      </p>

      {roles.length === 0 ? (
        <p className="rounded-lg border border-border py-10 text-center text-muted">
          There are no open roles right now. Please check back later.
        </p>
      ) : (
        <ul className="space-y-3">
          {roles.map((role) => (
            <li
              key={role}
              className="flex items-center justify-between rounded-lg border border-border px-5 py-4"
            >
              <span className="font-medium text-foreground">{role}</span>
              <a
                href={`mailto:hello@tips180.com?subject=${encodeURIComponent(`Application: ${role}`)}`}
                className="rounded-md bg-linear-to-r from-brand-start to-brand-end px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Apply
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
