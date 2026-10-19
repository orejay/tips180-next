import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { JsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@/components/analytics/analytics";
import { CleverCoreAd } from "@/components/analytics/clever-core-ad";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GoogleTranslate } from "@/components/i18n/google-translate";
import { TranslateNavGuard } from "@/components/i18n/translate-nav-guard";
import { getAllLeagues, leagueSlug } from "@/lib/leagues";
import { LeagueCatalogProvider } from "@/components/marketing/league-catalog-context";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Default metadata applied site-wide. `metadataBase` lets child routes use
 * relative URLs for canonical/OG tags. `title.template` brands every page.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Accurate Football Predictions & Betting Tips`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: { canonical: "/" },
  // OG/Twitter images come from the file-based `opengraph-image.tsx` convention,
  // which Next injects automatically — no hardcoded asset needed.
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const leagues = await getAllLeagues();
  const catalog = { logos: {} as Record<string, string>, names: {} as Record<string, string> };
  for (const league of leagues) {
    const slug = leagueSlug(league.short_name);
    catalog.names[slug] = league.name;
    if (league.logo) catalog.logos[slug] = league.logo;
  }

  return (
    <html
      lang={siteConfig.locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        {/* Apply the stored theme before paint to avoid a flash. Dark is the
            site default for every visitor — system preference is ignored
            unless the visitor has explicitly picked "light" via the toggle. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t!=='light';document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
        <GoogleTranslate />
        <TranslateNavGuard />
        <LeagueCatalogProvider value={catalog}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </LeagueCatalogProvider>
        <Analytics />
        <CleverCoreAd />
      </body>
    </html>
  );
}
