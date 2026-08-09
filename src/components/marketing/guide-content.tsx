import Link from "next/link";
import type { GuideSection } from "@/config/guides/types";
import { Subheading } from "@/components/layout/content-shell";

/** Renders a `GuideSection[]` (see config/guides/types.ts) as article body copy. */
export function GuideContent({ sections }: { sections: GuideSection[] }) {
  return (
    <div className="mt-8 space-y-10">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <Subheading as="h2" className="text-xl">
            {section.title}
          </Subheading>
          <div className="mt-3 space-y-4 text-sm leading-relaxed text-muted">
            {section.blocks.map((block, i) => {
              switch (block.type) {
                case "p":
                  return <p key={i}>{block.text}</p>;
                case "p-link":
                  return (
                    <p key={i}>
                      {block.before}{" "}
                      <Link
                        href={block.href}
                        className="font-medium text-primary hover:underline"
                      >
                        {block.linkText}
                      </Link>{" "}
                      {block.after}
                    </p>
                  );
                case "ul":
                  return (
                    <ul key={i} className="list-disc space-y-1.5 pl-6">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  );
                case "ol":
                  return (
                    <ol key={i} className="list-decimal space-y-1.5 pl-6">
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ol>
                  );
                case "h3":
                  return (
                    <h3 key={i} className="pt-1 text-base font-bold text-foreground">
                      {block.text}
                    </h3>
                  );
                case "example":
                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-surface-muted p-4"
                    >
                      {block.label ? (
                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                          {block.label}
                        </p>
                      ) : null}
                      <ul className="list-disc space-y-1 pl-5">
                        {block.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
