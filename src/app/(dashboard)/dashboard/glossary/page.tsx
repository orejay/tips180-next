import type { Metadata } from "next";
import { glossary } from "@/config/glossary";

export const metadata: Metadata = { title: "Betting Glossary" };

export default function GlossaryPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-foreground">Betting Glossary</h1>
      <p className="mb-4 text-muted">
        When you first enter the world of football betting, it can be
        overwhelming. There are a lot of betting terms to master, and
        understanding the various elements of betting terminology can seriously
        affect your enjoyment of the games. Familiarising yourself with the terms
        below will help you feel more comfortable and sound like a serious punter
        while you learn the ropes.
      </p>
      <p className="mb-8 text-muted">
        If you miss a term, send it to us and we&apos;ll add it to the list.
      </p>

      <dl className="divide-y divide-stone-100">
        {glossary.map((term) => (
          <div key={term.title} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-4 sm:gap-4">
            <dt className="font-bold text-foreground sm:col-span-1">{term.title}</dt>
            <dd className="leading-relaxed text-muted sm:col-span-3">{term.content}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
