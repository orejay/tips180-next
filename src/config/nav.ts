/**
 * Navigation data for the shared site chrome (header + footer). Centralised so
 * links stay consistent and the components below remain presentational. Paths
 * use the new App Router targets (see the legacy route map), not the old slugs.
 */

export type NavLink = {
  name: string;
  href: string;
  /** External links render as a plain <a> and open in a new tab. */
  external?: boolean;
};

/** Primary navigation shown in the header. */
export const mainNav: NavLink[] = [
  { name: "Leagues", href: "/leagues" },
  { name: "Our Plans", href: "/our-plans" },
  { name: "Tips Store", href: "/tips-store" },
  { name: "Predict & Win", href: "/predict-win" },
  { name: "Blog", href: "https://tips180.com/blog/", external: true },
  { name: "How to Pay", href: "/how-to-pay" },
  { name: "Contact Us", href: "/contact-us" },
];

export type SocialLink = {
  name: string;
  href: string;
  /** Path under /public to the icon. */
  icon: string;
};

/** Footer link groups. */
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
    {
      name: "Instagram",
      href: "https://www.instagram.com/tips180com",
      icon: "/icons/Instagram.png",
    },
    { name: "Telegram", href: "http://t.me/tips1800", icon: "/icons/Telegra.png" },
    {
      name: "Facebook",
      href: "https://web.facebook.com/tips180dotcom/",
      icon: "/icons/Facebook.png",
    },
    { name: "Whatsapp", href: "https://wa.link/itv11v", icon: "/icons/WhatsApp.png" },
  ] satisfies SocialLink[],
  contact: {
    emails: ["hello@tips180.com", "advert@tips180.com"],
    phone: { display: "+234 813 1149 662", tel: "+2348131149662" },
  },
} as const;
