/**
 * Fixed set of countries the "Best Betting Sites" section covers, plus each
 * country's regulatory fact-sheet (currency, regulator, tax note, common
 * payment methods). Both the *set of countries* and their *fact-sheets* are
 * static config, not admin-managed — adding/changing either is a deliberate
 * editorial decision a developer makes, not routine content.
 *
 * `regulator`/`taxNote` are legally-sensitive claims, so they're only filled
 * in where sourced from Tips180's editorial research; unsourced fields are
 * left `undefined` rather than guessed. Tax rules in particular change (e.g.
 * Uganda's rate below takes effect 1 July 2026) — review periodically rather
 * than trusting this indefinitely.
 */

// ISO 3166-1 alpha-2 code, used to build a flagcdn.com image URL (see
// `flagImageUrl` below) — emoji flags render as plain two-letter text on
// Windows (no flag-emoji font support), so this project uses flag images
// instead of the emoji glyph everywhere a flag is shown.
export type BettingCountryConfig = {
  slug: string;
  name: string;
  flagCode: string;
  currency?: string;
  legalAge?: string;
  regulator?: string;
  taxNote?: string;
  topPaymentMethods?: string[];
};

export const BETTING_COUNTRIES: BettingCountryConfig[] = [
  {
    slug: "nigeria",
    name: "Nigeria",
    flagCode: "ng",
    currency: "NGN",
    legalAge: "18",
    regulator: "National Lottery Regulatory Commission (NLRC)",
    taxNote:
      "5% withholding tax on net winnings for resident individuals; 15% for non-residents, from 1 January 2025",
    topPaymentMethods: ["Opay", "Moniepoint", "Palmpay", "Kuda", "Bank Transfer"],
  },
  {
    slug: "kenya",
    name: "Kenya",
    flagCode: "ke",
    currency: "KES",
    legalAge: "18",
    regulator: "National Lottery Regulatory Commission (NLRC)",
    taxNote: "20% withholding tax on gross winnings",
    topPaymentMethods: ["M-Pesa"],
  },
  {
    slug: "ghana",
    name: "Ghana",
    flagCode: "gh",
    currency: "GHS",
    legalAge: "18",
    regulator: "Gaming Commission of Ghana",
    taxNote:
      "No player withholding tax on betting/lottery winnings from 2 April 2025; the former 10% tax was abolished",
    topPaymentMethods: ["Mobile Money", "Bank Transfer", "Paystack"],
  },
  {
    slug: "cameroon",
    name: "Cameroon",
    flagCode: "cm",
    currency: "XAF",
    legalAge: "18",
    regulator: "Gaming Board of Cameroon",
    taxNote: "15% withholding tax on net winnings",
  },
  {
    slug: "uganda",
    name: "Uganda",
    flagCode: "ug",
    currency: "UGX",
    legalAge: "18",
    regulator: "National Lotteries and Gaming Regulatory Board",
    taxNote: "15% withholding tax on net winnings, from 1 July 2026",
    topPaymentMethods: ["Airtel Money", "MTN Mobile Money"],
  },
  {
    slug: "tanzania",
    name: "Tanzania",
    flagCode: "tz",
    currency: "TZS",
    legalAge: "18",
    regulator: "Gaming Board of Tanzania",
    taxNote: "12% tax on net winnings from sports betting",
    topPaymentMethods: ["M-Pesa"],
  },
  {
    slug: "south-africa",
    name: "South Africa",
    flagCode: "za",
    currency: "ZAR",
    legalAge: "18",
    regulator: "National Gambling Board and Provincial Gambling Boards",
    taxNote:
      "No standard national player withholding tax; operator-level provincial gambling taxes and VAT/GGR taxes apply",
    topPaymentMethods: ["EFT", "OZOW", "Vouchers", "Cards"],
  },
  {
    // No regulatory data sourced for Zambia yet — fields left unset rather
    // than guessed. Add them once researched.
    slug: "zambia",
    name: "Zambia",
    flagCode: "zm",
    currency: "ZMW",
    legalAge: "18",
  },
];

export function findBettingCountryConfig(slug: string): BettingCountryConfig | undefined {
  return BETTING_COUNTRIES.find((c) => c.slug === slug);
}

/**
 * Flag image URL for a given ISO alpha-2 code, via flagcdn.com (free, no
 * install). Uses the SVG endpoint — flagcdn's PNGs only exist at fixed width
 * buckets (w20/w40/w80/...), so SVG (scales freely via the `<img>` width/height
 * attrs) avoids picking a bucket that 404s.
 */
export function flagImageUrl(code: string): string {
  return `https://flagcdn.com/${code.toLowerCase()}.svg`;
}
