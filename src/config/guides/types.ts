/**
 * Content model for the long-form editorial guide pages (betting-mistakes,
 * how-to-bet, betting-strategies). Same "flattened paragraphs + bullets"
 * approach as `config/punter-guide.ts`, extended with `id` (anchor targets
 * for cross-guide links) and `p-link` (a paragraph with one inline link).
 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "p-link"; before: string; linkText: string; href: string; after: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "example"; label?: string; items: string[] };

export type GuideSection = {
  id: string;
  title: string;
  blocks: GuideBlock[];
};

export type GuideFaq = { question: string; answer: string };
