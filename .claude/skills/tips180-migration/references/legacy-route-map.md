# Legacy route map → Next.js targets

All routes from the legacy `dashboard/src/App.js`. Target = App Router path +
route group. Status: ☐ todo · ◐ in progress · ✅ done.

Legacy files live in `c:\Users\Abdullahi\Downloads\ore\dashboard\src`.

## (marketing) — public, indexed

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/` | pages/nav/Home.js | `(marketing)/page.tsx` | ◐ stub |
| `/about-us` | pages/AboutUs.js | `(marketing)/about-us` | ☐ |
| `/contact-us`, `/contact` | pages/ContactUs.js | `(marketing)/contact-us` | ☐ |
| `/disclaimer` | pages/Disclaimer.js | `(marketing)/disclaimer` | ☐ |
| `/privacy-policy` | pages/PrivacyPolicy.js | `(marketing)/privacy-policy` | ☐ |
| `/refund-policy` | pages/RefundPolicy.js | `(marketing)/refund-policy` | ☐ |
| `/terms-and-condition`, `/pw-terms` | pages/TandC.js, PwTandC.js | `(marketing)/terms-and-condition` | ☐ |
| `/our-plans` | pages/nav/OurPlans.js | `(marketing)/our-plans` | ☐ |
| `/leagues` | pages/nav/Leagues.js | `(marketing)/leagues` | ☐ |
| `/leagues/:name` | pages/League.js | `(marketing)/leagues/[slug]` | ☐ |
| `/predict-win` | pages/nav/PredictWin.js | `(marketing)/predict-win` | ☐ |
| `/tips-store`, `/tipsstore` | pages/nav/TipStore.js | `(marketing)/tips-store` | ☐ |
| `/tip-store/:name` | pages/StorePage.js | `(marketing)/tip-store/[name]` | ☐ |
| `/how-to-pay` | pages/nav/Payments.js (LandSub) | `(marketing)/how-to-pay` | ☐ |
| `/ad` | pages/Ad.js | `(marketing)/ad` | ☐ |

## (auth) — noindex

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/auth/login` | pages/auth/Login.js | `(auth)/auth/login` | ☐ |
| `/auth/signup` | pages/auth/Signup.js | `(auth)/auth/signup` | ☐ |
| `/auth/password` | pages/auth/ForgotPassword.js | `(auth)/auth/password` | ☐ |
| `/auth/reset/:id` | pages/auth/Reset.js | `(auth)/auth/reset/[id]` | ☐ |

## (dashboard) — private, robots-disallowed

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/dashboard` | components/Dashboard.js | `(dashboard)/dashboard` | ☐ |
| `/dashboard/profile` | pages/Profile.js | `(dashboard)/dashboard/profile` | ☐ |
| `/dashboard/50odds` | components/Odds50.js | `(dashboard)/dashboard/50odds` | ☐ |
| `/dashboard/smartbet` | components/SmartBet.js | `(dashboard)/dashboard/smartbet` | ☐ |
| `/dashboard/weekend10` | components/Weekend10.js | `(dashboard)/dashboard/weekend10` | ☐ |
| `/dashboard/rollover` | components/Rollover.js | `(dashboard)/dashboard/rollover` | ☐ |
| `/dashboard/acca` | components/Acca.js | `(dashboard)/dashboard/acca` | ☐ |
| `/dashboard/store` | components/Store.js | `(dashboard)/dashboard/store` | ☐ |
| `/dashboard/glossary` | components/Glossary.js | `(dashboard)/dashboard/glossary` | ☐ |
| `/dashboard/messages` | pages/Messages.js | `(dashboard)/dashboard/messages` | ☐ |
| `/dashboard/subscribe` | pages/Subscribe.js | `(dashboard)/dashboard/subscribe` | ☐ |
| `/dashboard/payment` | components/Payment.js | `(dashboard)/dashboard/payment` | ☐ |
| `/dashboard/rollover`, `/odds2`, `/odds3` | ProfileSure2/3.js | `(dashboard)/dashboard/odds2`, `/odds3` | ☐ |
| `/dashboard/puntersguide` | components/PuntersGuid.js | `(dashboard)/dashboard/puntersguide` | ☐ |
| `/dashboard/bankertips` | components/BankersTip.js | `(dashboard)/dashboard/bankertips` | ☐ |
| `/dashboard/hiring` | components/Hiring.js | `(dashboard)/dashboard/hiring` | ☐ |
| `/dashboard/pw`, `/pw-history` | pages/PandW.js, PredictAndWin.js | `(dashboard)/dashboard/pw` | ☐ |

## (payment) — client flows, noindex

Legacy routes: `/payment/{paystack,flutterwave,ghana,kenya,tanzania,uganda,cameroon,benin,wa}-payment`.
Legacy files: components/{Paystack,Flutterwave,Ghana,Kenya,Tanzania,Uganda,Cameroon,Benin}Checkout/Payment.js + SlPayment.js.
Target: `(dashboard)/payment/[provider]` or dedicated `(payment)` group. Client components; public keys via env. Status: ☐

## Not-found

`*` → App Router `not-found.tsx`. Legacy: pages/Error/PageNotFound.js. Status: ☐

## Notes for porting

- Replace `react-helmet` → Next `metadata`/`generateMetadata`.
- Replace `react-router` `<Link>` → `next/link`; `useLocation`/`useNavigate` →
  `next/navigation` (`usePathname`, `useRouter`).
- Replace MUI `useMediaQuery` → CSS responsive or a small hook.
- Replace `react-slick`/`react-slideshow-image` → a lightweight client carousel.
- Replace `react-toastify` → keep (works) or swap to `sonner`.
- `react-select`, `react-phone-input-2`, `lottie-react`, `flutterwave-react-v3`,
  `react-paystack` → keep as client-component dependencies; install as needed.
- Legacy had a `proxy` to `/api`; in Next, call the API directly via `lib/api.ts`.
