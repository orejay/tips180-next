import { CONFIRM_FIELDS, manualPayments } from "@/config/payment-methods";

/**
 * Per-country manual payment instructions (mobile money / bank transfer). Native
 * <details> disclosure — no JS required. After paying, the user sends proof on
 * WhatsApp and the account is upgraded manually.
 */
export function ManualPayments() {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Or pay manually (mobile money / bank transfer)
      </h2>
      <div className="space-y-2">
        {manualPayments.map((country) => (
          <details key={country.code} className="rounded-lg border border-border">
            <summary className="cursor-pointer px-4 py-3 font-medium text-foreground">
              {country.name}
            </summary>
            <div className="space-y-4 border-t border-border px-4 py-4 text-sm text-muted">
              {country.methods.map((method) => (
                <div key={method.label}>
                  <p className="font-semibold text-foreground">{method.label}</p>
                  {method.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              ))}
              <div>
                <p className="font-semibold text-foreground">After paying</p>
                <p>
                  Send proof of payment on WhatsApp to{" "}
                  <span className="font-semibold">{country.confirmOn}</span> including:
                </p>
                <ul className="mt-1 list-disc pl-5">
                  {CONFIRM_FIELDS.map((field) => (
                    <li key={field}>{field}</li>
                  ))}
                </ul>
                <p className="mt-1">Your account will be upgraded once payment is confirmed.</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
