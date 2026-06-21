/**
 * Navigation data for the shared site chrome. Centralised so links stay
 * consistent and components remain presentational.
 */

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
};

export const subNav: SubnavGroup[] = [
  {
    label: "All Predictions",
    items: [
      { name: "Leagues' Predictions", href: "/leagues" },
      { name: "Banker Tip of the Day", href: "/dashboard/bankertips" },
      { name: "Predictions Store", href: "#", sectionHeader: true, divider: true },
      { name: "Double Chance", href: "/tip-store/doublechance" },
      { name: "Over 1.5 Goals", href: "/tip-store/over1" },
      { name: "Over/Under 2.5", href: "/tip-store/over2" },
      { name: "Both Teams to Score", href: "/tip-store/bts" },
      { name: "Potential Risk", href: "/tip-store/pr" },
      { name: "Weekend Tips", href: "/tip-store/weekendtip" },
      { name: "View all stores →", href: "/tips-store" },
    ],
  },
  {
    label: "Daily Predictions",
    items: [
      { name: "Today's football predictions", href: "/" },
      { name: "Tomorrow's football predictions", href: "/predictions/tomorrow" },
      { name: "Weekend football predictions", href: "/predictions/weekend" },
      { name: "Monday football predictions", href: "/predictions/monday" },
      { name: "Tuesday football predictions", href: "/predictions/tuesday" },
      { name: "Wednesday football predictions", href: "/predictions/wednesday" },
      { name: "Thursday football predictions", href: "/predictions/thursday" },
      { name: "Friday football predictions", href: "/predictions/friday" },
      { name: "Saturday football predictions", href: "/predictions/saturday" },
      { name: "Sunday football predictions", href: "/predictions/sunday" },
    ],
  },
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
    items: [
      { name: "Best betting sites in Nigeria", href: "/best-betting-sites/nigeria" },
      { name: "Best betting sites in Kenya", href: "/best-betting-sites/kenya" },
      { name: "Best betting sites in Ghana", href: "/best-betting-sites/ghana" },
      { name: "Best betting sites in Cameroon", href: "/best-betting-sites/cameroon" },
      { name: "Best betting sites in Uganda", href: "/best-betting-sites/uganda" },
      { name: "Best betting sites in Tanzania", href: "/best-betting-sites/tanzania" },
      { name: "Best betting sites in South Africa", href: "/best-betting-sites/south-africa" },
      { name: "Best betting sites in Zambia", href: "/best-betting-sites/zambia" },
    ],
  },
  {
    label: "Get More",
    items: [
      { name: "Our Plans", href: "/our-plans" },
      { name: "How to Subscribe", href: "/dashboard/subscribe" },
      { name: "Contact Us", href: "/contact-us" },
    ],
  },
];

/* ── Language options ────────────────────────────────────────── */

export const LANGUAGES = [
  { code: "en", name: "English International", flag: "🌐" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
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
    { name: "Both Teams To Score Tips", href: "/tip-store/bts" },
    { name: "Over 2.5 Goals Tips", href: "/tip-store/over2" },
    { name: "Double Chance Tips", href: "/tip-store/doublechance" },
  ] satisfies NavLink[],
  helpful: [
    { name: "About Us", href: "/about-us" },
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
