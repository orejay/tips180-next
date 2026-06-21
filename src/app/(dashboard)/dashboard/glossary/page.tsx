import type { Metadata } from "next";
import { glossary } from "@/config/glossary";
import { GlossaryList } from "@/components/dashboard/glossary-list";

export const metadata: Metadata = { title: "Betting Glossary" };

export default function GlossaryPage() {
  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-2xl bg-linear-to-br from-teal-500 to-blue-600 p-6 text-white shadow-sm md:p-8">
        <h1 className="text-2xl font-bold lg:text-3xl">Betting Glossary</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/85">
          The world of football betting can be overwhelming at first. Familiarise
          yourself with the terms below to feel comfortable and sound like a
          serious punter while you learn the ropes. Miss a term? Send it to us and
          we&apos;ll add it to the list.
        </p>
        <p className="mt-3 text-xs font-medium text-white/70">
          {glossary.length} terms &amp; acronyms
        </p>
      </div>

      <GlossaryList terms={glossary} />
    </div>
  );
}
