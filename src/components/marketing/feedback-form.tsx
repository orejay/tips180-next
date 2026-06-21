"use client";

import { useActionState } from "react";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import { submitFeedbackAction, type FeedbackState } from "./feedback-action";

const initial: FeedbackState = { status: "idle" };

/**
 * "Submit your feedback to be featured" form. Client leaf wired to a server
 * action via React 19's `useActionState`. Optimistic, friendly acknowledgement
 * (the backend feedback endpoint is moderated before anything is featured).
 */
export function FeedbackForm() {
  const [state, action, pending] = useActionState(submitFeedbackAction, initial);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-7 dark:border-white/8 dark:bg-[#18181b]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-linear-to-br from-teal-500/10 to-blue-600/10 blur-2xl" />

      <div className="relative">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white shadow-sm">
            <Sparkles size={17} />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">Submit your feedback to be featured</h3>
            <p className="text-xs text-subtle">Won with Tips180? Share your story with other punters.</p>
          </div>
        </div>

        {state.status === "success" ? (
          <div className="flex items-start gap-3 rounded-xl bg-success-soft p-4 text-success">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{state.message}</p>
          </div>
        ) : (
          <form action={action} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="name" label="Your name" placeholder="e.g. John D." />
              <Field name="country" label="Country" placeholder="e.g. Nigeria" />
            </div>
            <div>
              <label htmlFor="fb-message" className="mb-1.5 block text-xs font-semibold text-subtle">
                Your feedback
              </label>
              <textarea
                id="fb-message"
                name="message"
                rows={3}
                required
                placeholder="Tell us how Tips180 worked out for you…"
                className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/8"
              />
            </div>

            {state.status === "error" && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{state.message}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-teal-500 to-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Sending…" : "Submit feedback"}
              {!pending && <Send size={15} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={`fb-${name}`} className="mb-1.5 block text-xs font-semibold text-subtle">
        {label}
      </label>
      <input
        id={`fb-${name}`}
        name={name}
        type="text"
        required
        placeholder={placeholder}
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-white/5 dark:focus:bg-white/8"
      />
    </div>
  );
}
