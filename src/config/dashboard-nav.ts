/**
 * Dashboard sidebar navigation, ported from the legacy `leftSide.js`. The
 * Messages item shows an unread count appended at render time.
 */
export type DashboardNavLink = { name: string; href: string };

export const dashboardNav: DashboardNavLink[] = [
  { name: "My Profile", href: "/dashboard/profile" },
  { name: "My Store", href: "/dashboard/store" },
  { name: "Messages", href: "/dashboard/messages" },
  { name: "Predict & Win", href: "/dashboard/pw" },
  { name: "Predict & Win History", href: "/dashboard/pw-history" },
  { name: "How to Subscribe", href: "/dashboard/subscribe" },
  { name: "Make Payment", href: "/dashboard/payment" },
  { name: "2 Odds", href: "/dashboard/odds2" },
  { name: "3 Odds", href: "/dashboard/odds3" },
  { name: "50 Odds Plan", href: "/dashboard/50odds" },
  { name: "Smart Bet Plan", href: "/dashboard/smartbet" },
  { name: "Rollover Bet", href: "/dashboard/rollover" },
  { name: "Weekend 10", href: "/dashboard/weekend10" },
  { name: "Experts ACCA", href: "/dashboard/acca" },
  { name: "Banker Tips of the Day", href: "/dashboard/bankertips" },
  { name: "Punter's Guide", href: "/dashboard/puntersguide" },
  { name: "Betting Glossary", href: "/dashboard/glossary" },
  { name: "We Are Hiring", href: "/dashboard/hiring" },
];
