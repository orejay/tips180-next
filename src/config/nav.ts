/**
 * Navigation data for the shared site chrome. Centralised so links stay
 * consistent and components remain presentational.
 */

import { BETTING_COUNTRIES } from "@/config/betting-countries";

export type NavLink = {
  name: string;
  href: string;
  external?: boolean;
};

export type SectionTab = {
  name: string;
  href: string;
  external?: boolean;
};

/** Top-level section tabs in the primary header bar. */
export const sectionTabs: SectionTab[] = [
  { name: "Football Betting Tips", href: "/" },
  { name: "Articles", href: "https://tips180.com/blog/", external: true },
];

/* ── Subnav (secondary row) ──────────────────────────────────── */

export type DropdownItem = {
  name: string;
  href: string;
  external?: boolean;
  /** Renders as a non-link section header inside the dropdown. */
  sectionHeader?: boolean;
  /** Renders a divider line above this item. */
  divider?: boolean;
};

export type SubnavGroup = {
  label: string;
  items: DropdownItem[];
  /** If set, the group label itself is a link to a hub page (click), on top of
   *  the hover dropdown of items. Groups without a single landing page omit this. */
  href?: string;
};

export const subNav: SubnavGroup[] = [
  {
    label: "All Predictions",
    items: [
      { name: "Leagues' Predictions", href: "/leagues" },
      { name: "Banker Tip of the Day", href: "/dashboard/bankertips" },
      { name: "Predictions Store", href: "#", sectionHeader: true, divider: true },
      { name: "Trending Matches", href: "/tip-store/trendingmatches" },
      { name: "Double Chance", href: "/tip-store/doublechance" },
      { name: "Over 1.5 Goals", href: "/tip-store/over1" },
      { name: "Over/Under 2.5", href: "/tip-store/over2" },
      { name: "Both Teams to Score", href: "/tip-store/bts" },
      { name: "Potential Risk", href: "/tip-store/pr" },
      { name: "Weekend Tips", href: "/tip-store/weekendtip" },
      { name: "View all stores →", href: "/tips-store" },
    ],
  },
  // Items are date-based and computed per-render by getDailyPredictionsGroup()
  // below (a static list would go stale the moment the server started).
  { label: "Daily Predictions", items: [] },
  {
    label: "Betting Strategies",
    items: [
      { name: "Best football betting strategies", href: "/betting-strategies" },
      { name: "How to bet on football matches", href: "/how-to-bet" },
      { name: "Punters' Guide", href: "/dashboard/puntersguide" },
      { name: "Betting Glossary / Acronyms", href: "/dashboard/glossary" },
      {
        name: "Mistakes to avoid when following football tips",
        href: "/betting-mistakes",
      },
    ],
  },
  {
    label: "Best Betting Sites",
    href: "/best-betting-sites",
    // The set of countries is static config (`config/betting-countries.ts`) —
    // only the per-country content is admin-managed.
    items: BETTING_COUNTRIES.map((c) => ({
      name: `Best betting sites in ${c.name}`,
      href: `/best-betting-sites/${c.slug}`,
    })),
  },
  {
    label: "Get More",
    items: [
      { name: "Our Plans", href: "/our-plans" },
      { name: "Predict & Win", href: "/predict-win" },
      { name: "How to Subscribe", href: "/dashboard/subscribe" },
      { name: "Contact Us", href: "/contact-us" },
    ],
  },
];

/** Local YYYY-MM-DD (avoids the UTC offset shifting the day), mirrors FreeBoard. */
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  d.setDate(d.getDate() + n);
  return d;
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** How far the homepage Free Tips date-pill row reaches, in either direction. */
const PILL_WINDOW_DAYS = 3;

/**
 * "Daily Predictions" group, computed fresh on every render: each day links
 * to the homepage Free Tips board with that date pre-selected (and scrolled
 * into view), so the dates never go stale. Weekend links to the Weekend Tips
 * tip-store category (`/tip-store/weekendtip`) instead of a date. Weekday
 * offsets are capped to the pill row's own window (today ±3 days) — the board
 * only ever selects from those existing pills, never a date outside what's shown.
 */
export function getDailyPredictionsGroup(): SubnavGroup {
  const today = new Date();
  const todayDow = today.getDay();
  const dateHref = (d: Date) => `/?date=${toDateString(d)}#free-tips`;

  const weekdayItems: DropdownItem[] = WEEKDAY_NAMES.map((name, dow) => {
    const offset = Math.min((dow - todayDow + 7) % 7, PILL_WINDOW_DAYS);
    return { name: `${name} football predictions`, href: dateHref(addDays(today, offset)) };
  });

  return {
    label: "Daily Predictions",
    items: [
      { name: "Today's football predictions", href: dateHref(today) },
      { name: "Tomorrow's football predictions", href: dateHref(addDays(today, 1)) },
      ...weekdayItems,
      { name: "Weekend football predictions", href: "/tip-store/weekendtip" },
    ],
  };
}

/* ── Language options ────────────────────────────────────────── */

// `flagCode` is an ISO 3166-1 alpha-2 code for a flagcdn.com image (see
// `flagImageUrl` in config/betting-countries.ts) — emoji flags render as plain
// two-letter text on Windows, so real flag images are used instead. English
// International has no single flag; it keeps the Globe icon (flagCode: null).
export const LANGUAGES = [
  { code: "en", name: "English International", flagCode: null },
  { code: "sw", name: "Swahili", flagCode: "ke" },
  { code: "fr", name: "French", flagCode: "fr" },
  { code: "es", name: "Spanish", flagCode: "es" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

/* ── Footer nav (unchanged) ──────────────────────────────────── */

export type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

export const footerNav = {
  predictions: [
    { name: "Football Betting Tips", href: "/" },
    { name: "English Premier League", href: "/leagues/epl" },
    { name: "Spanish La Liga", href: "/leagues/la-liga" },
    { name: "German Bundesliga", href: "/leagues/bundesliga" },
    { name: "Italian Serie A", href: "/leagues/serie-a" },
    { name: "French Ligue One", href: "/leagues/ligue-1" },
    { name: "Trending Matches", href: "/tip-store/trendingmatches" },
    { name: "Both Teams To Score Tips", href: "/tip-store/bts" },
    { name: "Over 2.5 Goals Tips", href: "/tip-store/over2" },
    { name: "Double Chance Tips", href: "/tip-store/doublechance" },
  ] satisfies NavLink[],
  helpful: [
    { name: "About Us", href: "/about-us" },
    { name: "Best Betting Sites", href: "/best-betting-sites" },
    { name: "Prediction Accuracy", href: "/accuracy" },
    { name: "How to Pay", href: "/how-to-pay" },
    { name: "Our Plans", href: "/our-plans" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Terms and Conditions", href: "/terms-and-condition" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Disclaimer", href: "/disclaimer" },
  ] satisfies NavLink[],
  social: [
    { name: "X", href: "https://twitter.com/tips180", icon: "/icons/X.png" },
    { name: "Instagram", href: "https://www.instagram.com/tips180com", icon: "/icons/Instagram.png" },
    { name: "Telegram", href: "http://t.me/tips1800", icon: "/icons/Telegra.png" },
    { name: "Facebook", href: "https://web.facebook.com/tips180dotcom/", icon: "/icons/Facebook.png" },
    { name: "Whatsapp", href: "https://wa.link/itv11v", icon: "/icons/WhatsApp.png" },
  ] satisfies SocialLink[],
  contact: {
    emails: ["hello@tips180.com", "advert@tips180.com"],
    phone: { display: "+234 813 1149 662", tel: "+2348131149662" },
  },
} as const;

/** @deprecated Use sectionTabs + subNav instead. Kept for any code that still imports mainNav. */
export const mainNav: NavLink[] = [
  { name: "Leagues", href: "/leagues" },
  { name: "Our Plans", href: "/our-plans" },
  { name: "Tips Store", href: "/tips-store" },
  { name: "Predict & Win", href: "/predict-win" },
  { name: "Blog", href: "https://tips180.com/blog/", external: true },
  { name: "How to Pay", href: "/how-to-pay" },
  { name: "Contact Us", href: "/contact-us" },
];
