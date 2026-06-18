import { cn } from "@/lib/utils";

/**
 * Shared shell for static content pages (legal, about, plans). Reproduces the
 * legacy "grey page, white card" frame as a Server Component so the copy lands
 * in the initial HTML for crawlers. Pass `title` to render the page <h1>.
 */
export function ContentShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="bg-background px-4 py-8 lg:py-12">
      <article
        className={cn(
          "mx-auto w-full max-w-5xl rounded-lg bg-surface px-5 py-8 lg:px-14 lg:py-12",
          className,
        )}
      >
        <h1 className="mb-4 bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-2xl font-bold text-transparent">
          {title}
        </h1>
        {children}
      </article>
    </div>
  );
}

/** Gradient sub-heading matching the legacy section headers. */
export function Subheading({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  as?: "h2" | "h3" | "h4";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "mt-6 mb-2 bg-linear-to-r from-brand-start to-brand-end bg-clip-text text-lg font-semibold text-transparent",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
