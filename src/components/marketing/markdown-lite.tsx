import Link from "next/link";
import { Fragment } from "react";

/** Parse `**bold**` and `[text](url)` inside one paragraph into React nodes. */
function parseInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = re.exec(text))) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      const label = match[2];
      const href = match[3];
      const internal = href.startsWith("/") || href.startsWith("#");
      nodes.push(
        internal ? (
          <Link
            key={`${keyPrefix}-${i++}`}
            href={href}
            className="font-medium text-primary hover:underline"
          >
            {label}
          </Link>
        ) : (
          <a
            key={`${keyPrefix}-${i++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {label}
          </a>
        ),
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

/**
 * Minimal markdown renderer for admin-editable prose blocks (`lib/page-content.ts`):
 * blank-line-separated paragraphs, `**bold**` and `[text](url)` links. Internal
 * hrefs (`/...` or `#...`) use `next/link`; everything else opens in a new tab.
 * Deliberately a tiny subset, not a full markdown parser — no dependency.
 */
export function MarkdownLite({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className={className}>
          {parseInline(p, `p${i}`).map((node, j) => (
            <Fragment key={j}>{node}</Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
