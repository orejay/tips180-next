import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { tipCategories } from "@/config/tip-store";

export const metadata: Metadata = {
  title: "Tips Store — Football Betting Tips by Market | Tips180",
  description:
    "Browse Tips180 football tips by market: Over 2.5 goals, BTTS, correct score, double chance, accumulators, handicap and more. Free and premium expert predictions.",
  alternates: { canonical: "/tips-store" },
};

export default function TipsStorePage() {
  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: "Tips Store", url: `${siteConfig.url}/tips-store` },
        ])}
      />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">Tips Store</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">
          Expert football predictions organised by betting market — pick the tip
          type that suits your strategy.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {tipCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/tip-store/${cat.slug}`}
            className="group flex flex-col rounded-xl bg-surface p-5 shadow-sm ring-1 ring-border transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground group-hover:text-primary">
                {cat.title}
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  cat.tier === "Free"
                    ? "bg-green-100 dark:bg-success-soft text-green-700"
                    : "bg-blue-100 dark:bg-primary-soft text-primary"
                }`}
              >
                {cat.tier}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
