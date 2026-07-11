import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TrendingUp, Trophy, Activity, Shield, Ticket, Landmark } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { getTipster, tipsterImageUrl } from "@/lib/tipsters";

type Params = { id: string };

/** Collapse whitespace and cap length for meta/schema (experience can be long). */
function clamp(s: string, n: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const tipster = await getTipster(id);
  if (!tipster) return { title: "Tipster Not Found" };

  const title = `${tipster.name}${tipster.role ? ` — ${tipster.role}` : ""} | Tips180 Tipster`;
  const description = clamp(
    `${tipster.name}${tipster.role ? ` — ${tipster.role}` : ""}, a Tips180 tipster.` +
      (tipster.experience ? ` ${tipster.experience}` : "") +
      (tipster.win_rate_overall
        ? ` Overall prediction win rate ${tipster.win_rate_overall}.`
        : ""),
    160,
  );

  return {
    title,
    description,
    alternates: { canonical: `/tipsters/${tipster.id}` },
  };
}

export default async function TipsterProfilePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const tipster = await getTipster(id);
  if (!tipster) notFound();

  const avatar = tipsterImageUrl(tipster.image_url);
  const url = `${siteConfig.url}/tipsters/${tipster.id}`;

  const favourites = [
    { label: "Favourite Sport", value: tipster.favourite_sports, icon: <Activity size={18} /> },
    { label: "Favourite Team", value: tipster.favourite_team, icon: <Shield size={18} /> },
    { label: "Favourite Bet Type", value: tipster.favourite_bet_type, icon: <Ticket size={18} /> },
    { label: "Favourite Bookmaker", value: tipster.favourite_bookmaker, icon: <Landmark size={18} /> },
  ].filter((f) => f.value);

  return (
    <div className="bg-background">
      <JsonLd
        data={personSchema({
          name: tipster.name,
          url,
          jobTitle: tipster.role ?? undefined,
          description: tipster.experience
            ? clamp(tipster.experience, 300)
            : undefined,
          image: avatar ?? undefined,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: tipster.name, url },
        ])}
      />

      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-teal-500 via-cyan-600 to-blue-700 px-4 py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={tipster.name}
              className="h-28 w-28 shrink-0 rounded-full object-cover ring-4 ring-white/30"
            />
          ) : (
            <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/15 text-3xl font-bold backdrop-blur">
              {tipster.name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase() ?? "")
                .join("")}
            </span>
          )}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              Tips180 Tipster
            </span>
            <h1 className="mt-3 text-2xl font-bold lg:text-4xl">{tipster.name}</h1>
            {tipster.role && (
              <p className="mt-1.5 text-sm text-white/85 lg:text-base">
                {tipster.role}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {/* About / experience (long-form bio from the textarea) */}
        {tipster.experience && (
          <section className="mb-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/8 dark:bg-[#18181b] sm:p-6">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              About {tipster.name}
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-muted">
              {tipster.experience}
            </p>
          </section>
        )}

        {/* Win rates */}
        {(tipster.win_rate_7d || tipster.win_rate_overall) && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tipster.win_rate_7d && (
              <WinRate
                icon={<TrendingUp size={18} />}
                label="Win Rate — Last 7 Days"
                value={tipster.win_rate_7d}
              />
            )}
            {tipster.win_rate_overall && (
              <WinRate
                icon={<Trophy size={18} />}
                label="Win Rate — Overall"
                value={tipster.win_rate_overall}
              />
            )}
          </section>
        )}

        {/* Favourites */}
        {favourites.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-foreground">At a glance</h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {favourites.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm dark:border-white/8 dark:bg-[#18181b]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white">
                    {f.icon}
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs text-subtle">{f.label}</dt>
                    <dd className="truncate font-semibold text-foreground">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}

function WinRate({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm dark:border-white/8 dark:bg-[#18181b]">
      <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-teal-500 to-blue-600 text-white">
        {icon}
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-subtle">{label}</p>
      <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
