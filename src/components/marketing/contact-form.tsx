"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Contact form — client leaf. Posts to the existing backend endpoint. Replaces
 * the legacy react-toastify feedback with inline status messaging to avoid a
 * global toast provider for a single form.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch(`${siteConfig.apiUrl}/postendpoints/contact-us`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-md border border-border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium text-muted">
          Full Name*
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium text-muted">
          Email Address*
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-sm font-medium text-muted">
          Phone Number
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-medium text-muted">
          Message*
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-md bg-linear-to-r from-brand-start to-brand-end py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "success" && (
        <p className="text-sm font-medium text-green-600" role="status">
          Thank you for reaching out to us! We&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm font-medium text-red-600" role="alert">
          Something went wrong. Please check your network and try again.
        </p>
      )}
    </form>
  );
}
