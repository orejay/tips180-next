import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, articleSchema, personSchema } from "@/lib/schema";
import { siteConfig } from "@/config/site";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { LastUpdated } from "@/components/seo/last-updated";
import { ResponsibleGamblingNotice } from "@/components/marketing/responsible-gambling-notice";
import { GuideContent } from "@/components/marketing/guide-content";
import { getArticleMeta, parseIsoDate } from "@/lib/articles";
import type { GuideFaq, GuideSection } from "@/config/guides/types";

/**
 * Shared shell for the long-form editorial guide pages (betting-mistakes,
 * how-to-bet, betting-strategies). Fetches the admin-managed byline
 * (`lib/articles.ts`) and falls back to a build-time default if the admin
 * hasn't set one for this slug yet.
 */
export async function GuidePage({
  slug,
  h1,
  heroSubtitle,
  sections,
  faqs,
  defaultAuthor,
  defaultDateIso,
  authorRole,
  authorBio,
}: {
  slug: string;
  h1: string;
  heroSubtitle: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  defaultAuthor: string;
  defaultDateIso: string;
  authorRole: string;
  authorBio: string;
}) {
  const meta = await getArticleMeta(slug);
  const author = meta?.author || defaultAuthor;
  const role = meta?.author_role || authorRole;
  const bio = meta?.author_bio || authorBio;
  const lastUpdatedIso = meta?.last_updated || defaultDateIso;
  const url = `${siteConfig.url}/${slug}`;

  return (
    <div className="bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: siteConfig.url },
          { name: h1, url },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={articleSchema({
          headline: h1,
          description: heroSubtitle,
          url,
          datePublished: lastUpdatedIso,
          dateModified: lastUpdatedIso,
          authorName: author,
        })}
      />
      <JsonLd
        data={personSchema({
          name: author,
          url,
          jobTitle: role,
          description: bio,
        })}
      />

      <div className="bg-linear-to-r from-brand-start to-brand-end px-4 py-14 text-center text-white lg:py-20">
        <h1 className="text-xl font-bold lg:text-4xl">{h1}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm lg:text-base">{heroSubtitle}</p>
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 py-10 lg:py-14">
        <LastUpdated date={parseIsoDate(lastUpdatedIso)} publisher={author} />

        <GuideContent sections={sections} />

        <section className="mt-12">
          <h2 className="mb-4 text-xl font-black text-foreground">
            Frequently asked questions
          </h2>
          <FaqAccordion items={faqs} />
        </section>

        <section className="mt-12 rounded-2xl border border-border bg-surface-muted p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            About the author
          </p>
          <p className="mt-1 font-bold text-foreground">{author}</p>
          <p className="text-xs text-subtle">{role}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{bio}</p>
        </section>

        <ResponsibleGamblingNotice />
      </div>
    </div>
  );
}
