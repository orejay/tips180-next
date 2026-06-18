/**
 * Server-rendered JSON-LD injector. Output lands in the initial HTML so
 * crawlers and AI bots see structured data without executing JS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from trusted, server-side config — not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
