import { siteConfig } from "@/config/site";

/**
 * JSON-LD structured data builders.
 *
 * Rendered server-side (see `<JsonLd />`) so the markup is present in the raw
 * HTML — this is what makes schema actually count for Google rich results and
 * AI-engine citations (a key gap in the legacy CSR app).
 */

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [siteConfig.links.twitter],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/**
 * Author/expert profile. A core YMYL E-E-A-T signal — links predictions to a
 * real, identifiable person with verifiable social profiles (`sameAs`).
 */
export function personSchema(person: {
  name: string;
  url: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: person.url,
    ...(person.jobTitle && { jobTitle: person.jobTitle }),
    ...(person.description && { description: person.description }),
    ...(person.image && { image: person.image }),
    worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(person.sameAs?.length && { sameAs: person.sameAs }),
  };
}

/** Editorial article/analysis with a named author — improves AI citation. */
export function articleSchema(article: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    ...(article.image && { image: article.image }),
    author: {
      "@type": "Person",
      name: article.authorName,
      ...(article.authorUrl && { url: article.authorUrl }),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/logo.png` },
    },
  };
}

/** A single football match prediction. Drives rich event cards + AI citations. */
export function sportsEventSchema(event: {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  startDate: string;
  url: string;
  venue?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${event.homeTeam} vs ${event.awayTeam}`,
    sport: "Soccer",
    startDate: event.startDate,
    url: event.url,
    ...(event.venue && {
      location: { "@type": "Place", name: event.venue },
    }),
    competitor: [
      { "@type": "SportsTeam", name: event.homeTeam },
      { "@type": "SportsTeam", name: event.awayTeam },
    ],
    superEvent: { "@type": "SportsOrganization", name: event.competition },
  };
}
