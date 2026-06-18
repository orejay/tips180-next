# Legacy route map → Next.js targets

All routes from the legacy `dashboard/src/App.js`. Target = App Router path +
route group. Status: ☐ todo · ◐ in progress · ✅ done.

Legacy files live in `c:\Users\Abdullahi\Downloads\ore\dashboard\src`.

## (marketing) — public, indexed

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/` | pages/nav/Home.js | `(marketing)/page.tsx` | ✅ FULL legacy composition: hero, announcement banner, free tips, loyalty ad, smartbet landing, landing-leagues, predictions, landing-store, landing-plans, sports-news, testimonials, FAQ(14 visible+schema), writeup |
| `/about-us` | pages/AboutUs.js | `(marketing)/about-us` | ✅ |
| `/contact-us`, `/contact` | pages/ContactUs.js | `(marketing)/contact-us` | ✅ |
| `/disclaimer` | pages/Disclaimer.js | `(marketing)/disclaimer` | ✅ |
| `/privacy-policy` | pages/PrivacyPolicy.js | `(marketing)/privacy-policy` | ✅ |
| `/refund-policy` | pages/RefundPolicy.js | `(marketing)/refund-policy` | ✅ |
| `/terms-and-condition`, `/pw-terms` | pages/TandC.js, PwTandC.js | `(marketing)/terms-and-condition` | ✅ (pw-terms not ported) |
| `/our-plans` | pages/nav/OurPlans.js | `(marketing)/our-plans` | ◐ content done; geo-pricing + checkout → Phase 7 |
| `/leagues` | pages/nav/Leagues.js | `(marketing)/leagues` | ✅ |
| `/leagues/:name` | pages/League.js | `(marketing)/leagues/[slug]` | ✅ public predictions + SportsEvent/FAQ schema |
| `/predict-win` | pages/nav/PredictWin.js | `(marketing)/predict-win` | ✅ public landing + FAQ |
| `/tips-store`, `/tipsstore` | pages/nav/TipStore.js | `(marketing)/tips-store` | ✅ category grid |
| `/tip-store/:name` | pages/StorePage.js | `(marketing)/tip-store/[name]` | ✅ 16 cats; public tiers render live tips, gated show upsell |
| `/how-to-pay` | pages/nav/Payments.js (LandSub) | `(marketing)/how-to-pay` | ✅ steps + manual methods |
| `/ad` | pages/Ad.js | `(marketing)/ad` | ✅ CleverCore ad script, noindex |

## (auth) — noindex

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/auth/login` | pages/auth/Login.js | `(auth)/auth/login` | ✅ |
| `/auth/signup` | pages/auth/Signup.js | `(auth)/auth/signup` | ✅ |
| `/auth/password` | pages/auth/ForgotPassword.js | `(auth)/auth/password` | ✅ |
| `/auth/reset/:id` | pages/auth/Reset.js | `(auth)/auth/reset/[id]` | ✅ |

## (dashboard) — private, robots-disallowed

| Legacy route | Legacy file | Target path | Status |
|---|---|---|---|
| `/dashboard` | components/Dashboard.js | `(dashboard)/dashboard` | ✅ index redirects to /dashboard/profile |
| `/dashboard/profile` | pages/Profile.js | `(dashboard)/dashboard/profile` | ✅ info + change-password |
| `(dashboard layout + sidebar + auth infra)` | components/Dashboard.js, leftSide.js | `(dashboard)/layout.tsx` | ✅ |
| `/dashboard/50odds` | components/Odds50.js | `(dashboard)/dashboard/50odds` | ✅ gated tip table |
| `/dashboard/smartbet` | components/SmartBet.js | `(dashboard)/dashboard/smartbet` | ✅ gated tip table |
| `/dashboard/weekend10` | components/Weekend10.js | `(dashboard)/dashboard/weekend10` | ✅ gated tip table |
| `/dashboard/rollover` | components/Rollover.js | `(dashboard)/dashboard/rollover` | ✅ gated tip table |
| `/dashboard/acca` | components/Acca.js | `(dashboard)/dashboard/acca` | ✅ gated (2 sets) |
| `/dashboard/store` | components/Store.js | `(dashboard)/dashboard/store` | ✅ category cards |
| `/dashboard/glossary` | components/Glossary.js | `(dashboard)/dashboard/glossary` | ✅ |
| `/dashboard/messages` | pages/Messages.js | `(dashboard)/dashboard/messages` | ✅ read/unread + mark-read |
| `/dashboard/subscribe` | pages/Subscribe.js | `(dashboard)/dashboard/subscribe` | ✅ static (per-country pay details → Phase 7) |
| `/dashboard/payment` | components/Payment.js | `(dashboard)/dashboard/payment` | ✅ Paystack+Flutterwave (inline) + manual; geo card-pricing deferred |
| `/odds2`, `/odds3` | ProfileSure2/3.js | `(dashboard)/dashboard/odds2`, `/odds3` | ✅ Premium-gated 2 sets |
| `/dashboard/puntersguide` | components/PuntersGuid.js | `(dashboard)/dashboard/puntersguide` | ✅ content |
| `/dashboard/bankertips` | components/BankersTip.js | `(dashboard)/dashboard/bankertips` | ✅ public single card |
| `/dashboard/hiring` | components/Hiring.js | `(dashboard)/dashboard/hiring` | ✅ jobs endpoint |
| `/dashboard/pw`, `/pw-history` | pages/PandW.js, PredictAndWin.js | `(dashboard)/dashboard/pw` | ◐ read views; live entry submission pending |

## (payment) — client flows, noindex

Legacy routes: `/payment/{paystack,flutterwave,ghana,kenya,tanzania,uganda,cameroon,benin,wa}-payment`.
Legacy files: components/{Paystack,Flutterwave,Ghana,Kenya,Tanzania,Uganda,Cameroon,Benin}Checkout/Payment.js + SlPayment.js.
Target: ✅ CONSOLIDATED into the single `(dashboard)/dashboard/payment` page (plan/duration
selector + Paystack/Flutterwave inline card checkout + per-country manual instructions),
rather than per-provider/per-country routes. Public keys via env. Geo card-pricing deferred.

## Not-found

`*` → App Router `not-found.tsx`. Legacy: pages/Error/PageNotFound.js. Status: ✅ (+ `error.tsx`, `loading.tsx`, dynamic `opengraph-image.tsx`, gtag analytics)

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
