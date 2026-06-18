import type { Metadata } from "next";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact Us — Get in Touch with Tips180 Support",
  description:
    "Reach the Tips180 team for general enquiries, adverts and sponsorship, or subscription support. Call us or send a message and we'll respond promptly.",
  alternates: { canonical: "/contact-us" },
};

const contactDetails = [
  { label: "For general enquiries, please reach us", value: "hello@tips180.com" },
  { label: "For Advert & sponsorship please reach us", value: "adverts@tips180.com" },
  {
    label: "Call us on",
    value: "+234 813 1149 662, +254 796 118 357 (Kenya)",
  },
  {
    label: "Working Hours",
    value: "Mondays to Fridays (9am to 5pm), Saturdays (10am–12noon)",
  },
  { label: "Email", value: "hello@tips180.com" },
];

export default function ContactUsPage() {
  return (
    <div className="bg-background">
      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="mx-auto text-xl font-bold lg:text-4xl">Contact Us</h1>
        <p className="mx-auto mt-2 w-11/12 max-w-2xl">
          Send us a message by using the form below and a team member will get
          back to you as soon as possible.
        </p>
      </div>

      <div className="mx-auto my-10 grid w-full max-w-4xl grid-cols-1 gap-8 rounded-lg bg-surface p-5 lg:grid-cols-2 lg:p-10">
        <div className="space-y-6">
          {contactDetails.map((detail) => (
            <div key={detail.label}>
              <p className="text-sm text-muted">{detail.label}</p>
              <p className="text-lg font-bold text-foreground">{detail.value}</p>
            </div>
          ))}
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
