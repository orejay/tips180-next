import { bettingSiteLogoUrl, type BettingSite } from "@/lib/betting-sites";

/** A bookmaker's logo, or a text-initials fallback — shared by the country
 *  comparison table and the per-bookmaker review page. */
export function SiteLogo({ site, size }: { site: BettingSite; size: number }) {
  const src = bettingSiteLogoUrl(site.logo_url);
  if (!src) {
    return (
      <span
        className="flex shrink-0 items-center justify-center rounded-full bg-surface-muted text-[10px] font-bold text-muted"
        style={{ width: size, height: size }}
      >
        {site.name.slice(0, 2).toUpperCase()}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={site.name}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
