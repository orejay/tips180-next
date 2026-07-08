import { ArrowUpRight, BadgeCheck, TrendingUp, Trophy } from "lucide-react";
import { getTipsterFor, tipsterImageUrl, type Tipster } from "@/lib/tipsters";

/**
 * Server component: the tipster attached to `category` for `date` (default today),
 * rendered below that category's prediction list. Renders nothing when no tipster
 * is attached, so it's safe to drop onto any list.
 */
export async function TipsterBadge({
  category,
  date,
}: {
  category: string;
  date?: string;
}) {
  const tipster = await getTipsterFor(category, date);
  if (!tipster) return null;
  return <TipsterCard tipster={tipster} />;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function TipsterCard({ tipster }: { tipster: Tipster }) {
  const avatar = tipsterImageUrl(tipster.image_url);
  const favourites = [
    { label: "Favourite Sport", value: tipster.favourite_sports },
    { label: "Favourite Team", value: tipster.favourite_team },
    { label: "Favourite Bet", value: tipster.favourite_bet_type },
    { label: "Bookmaker", value: tipster.favourite_bookmaker },
  ].filter((f) => f.value);

  return (
    <a
      href={`/tipsters/${tipster.id}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${tipster.name}'s full profile (opens in a new tab)`}
      className="group mt-5 block overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-colors hover:border-teal-400/60 dark:border-white/8 dark:bg-[#18181b] dark:hover:border-teal-400/40"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt={tipster.name}
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-teal-500/30"
          />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-blue-600 text-lg font-bold text-white">
            {initials(tipster.name)}
          </span>
        )}

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400">
              Today&apos;s Tipster
            </span>
            <BadgeCheck size={14} className="text-teal-500" />
          </div>
          <h3 className="mt-0.5 flex items-center gap-1 text-lg font-bold text-foreground">
            {tipster.name}
            <ArrowUpRight
              size={16}
              className="text-subtle transition-colors group-hover:text-teal-500"
            />
          </h3>
          {(tipster.role || tipster.experience) && (
            <p className="text-sm text-muted">
              {[tipster.role, tipster.experience].filter(Boolean).join(" · ")}
            </p>
          )}
          <span className="text-xs font-medium text-teal-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-teal-400">
            View full profile &rarr;
          </span>
        </div>

        {/* Win rates */}
        <div className="flex gap-2 sm:gap-3">
          {tipster.win_rate_7d && (
            <Stat
              icon={<TrendingUp size={14} />}
              label="7-Day"
              value={tipster.win_rate_7d}
            />
          )}
          {tipster.win_rate_overall && (
            <Stat
              icon={<Trophy size={14} />}
              label="Overall"
              value={tipster.win_rate_overall}
            />
          )}
        </div>
      </div>

      {favourites.length > 0 && (
        <dl className="flex flex-wrap gap-x-6 gap-y-1.5 border-t border-stone-100 px-5 py-3 text-xs dark:border-white/8">
          {favourites.map((f) => (
            <div key={f.label} className="flex items-center gap-1.5">
              <dt className="text-subtle">{f.label}:</dt>
              <dd className="font-medium text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </a>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-stone-50 px-3 py-2 text-center dark:bg-white/5">
      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-subtle">
        {icon}
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}
