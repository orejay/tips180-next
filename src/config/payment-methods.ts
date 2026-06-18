/**
 * Manual payment instructions per country, ported from the legacy country
 * checkout components (Ghana/Kenya/Uganda/Tanzania/Cameroon/Benin/Nigeria...).
 * After paying, users confirm on WhatsApp and the account is upgraded manually.
 */

export type ManualMethod = {
  /** e.g. "MTN Mobile Money", "Bank Transfer". */
  label: string;
  /** Lines of detail (account numbers / pay-to numbers). */
  lines: string[];
};

export type CountryPayment = {
  code: string;
  name: string;
  /** WhatsApp number to send proof of payment to. */
  confirmOn: string;
  methods: ManualMethod[];
};

/** Fields every confirmation message should include. */
export const CONFIRM_FIELDS = [
  "Sender / mobile money name",
  "Date of payment",
  "Amount paid",
  "Registered email address or User ID",
];

export const manualPayments: CountryPayment[] = [
  {
    code: "NG",
    name: "Nigeria",
    confirmOn: "+234 813 1149 662",
    methods: [
      {
        label: "Bank Transfer / USSD / Deposit",
        lines: [
          "TIPS 180 CONCEPTS — 1021742465 — UBA",
          "TIPS 180 CONCEPTS — 1313138723 — Zenith Bank",
        ],
      },
      {
        label: "POS / PalmPay / OPay",
        lines: [
          "TIPS 180 CONCEPTS — 1021742465 — UBA",
          "TIPS 180 CONCEPTS — 1313138723 — Zenith Bank",
        ],
      },
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "MTN Mobile Money", lines: ["Pay to +233 249 447 682"] }],
  },
  {
    code: "KE",
    name: "Kenya",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "M-Pesa", lines: ["Pay to +254 1409 365 21"] }],
  },
  {
    code: "TZ",
    name: "Tanzania",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "M-Pesa", lines: ["Pay to +254 1409 365 21"] }],
  },
  {
    code: "UG",
    name: "Uganda",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "MTN Mobile Money", lines: ["Contact support for the current pay number"] }],
  },
  {
    code: "CM",
    name: "Cameroon",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "MTN Mobile Money", lines: ["Pay to +237 676 988 731"] }],
  },
  {
    code: "BJ",
    name: "Benin Republic",
    confirmOn: "+234 814 600 0171",
    methods: [{ label: "MTN Mobile Money", lines: ["Pay to +229 466 199 56"] }],
  },
  {
    code: "SL",
    name: "Sierra Leone",
    confirmOn: "+232 760 600 00",
    methods: [{ label: "Mobile Money", lines: ["Pay to +232 760 600 00 or +232 781 093 88"] }],
  },
];
