"use client";

import { useMemo, useState } from "react";
import { Search, BookOpen } from "lucide-react";
import type { GlossaryTerm } from "@/config/glossary";

/** Clean a raw glossary title (legacy data has trailing colons / whitespace). */
function cleanTitle(title: string): string {
  return title.replace(/[:\s]+$/, "").trim();
}

/**
 * Searchable glossary list. Client leaf so punters can filter terms instantly;
 * the full set is server-rendered into props (dashboard is noindex, so live
 * filtering over SEO is the right trade-off here).
 */
export function GlossaryList({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        cleanTitle(t.title).toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q),
    );
  }, [query, terms]);

  return (
    <div>
      <div className="sticky top-2 z-10 mb-6">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-subtle focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-white/10 dark:bg-[#18181b]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-stone-200 bg-white py-12 text-center text-sm text-muted dark:border-white/8 dark:bg-[#18181b]">
          No terms match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((term) => (
            <article
              key={term.title}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/8 dark:bg-[#18181b]"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen size={14} />
                </span>
                <h2 className="text-sm font-bold text-foreground">{cleanTitle(term.title)}</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">{term.content}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
