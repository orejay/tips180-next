---
name: tips180-migration
description: Resume the Tips180 Next.js rewrite. Use whenever working in the tips180-next repo — porting pages/components from the legacy Vite app, implementing SEO/GEO (schema, SSR, sitemap, robots), or making structural decisions. Holds the goals, locked decisions, conventions, legacy route map and phased plan so the migration continues consistently across sessions.
---

# Tips180 → Next.js Migration

Rewrite the legacy **Tips180** football-prediction SPA into a clean, server-rendered
Next.js app. The driving purpose is **SEO + AI-search (GEO) visibility**: the old
app shipped an empty `<div id="root">` to crawlers, so content/schema/meta were
invisible without JS. This rewrite renders server-side.

This is a **frontend-only** rewrite. The backend (`tips180.com/api`) is unchanged.

## ⚠️ TOP PRIORITY — full legacy parity FIRST

**Port every existing legacy page and feature to full functional parity BEFORE building
any new SEO/GEO enhancement assets, polish, or nice-to-haves.** SEO is the *purpose*, but
a feature-complete port is the *prerequisite* — a beautifully-optimised site that dropped
working features is a regression.

Rules:
- A phase is **not done** while any legacy sub-feature inside it is simplified, stubbed,
  or dropped. Marking it ✅ early hides real gaps (this happened — see Parity gaps below).
- When you must simplify/defer a legacy behaviour, log it in **Parity gaps** immediately,
  not just in prose — it is now backlog, not "done".
- Enhancement work (Phase 8 SEO assets, Phase 9 polish, theme/dark mode, redirects) waits
  until Parity gaps is empty — unless the user explicitly redirects you.

### Parity gaps — ✅ ALL CLEARED (2026-06-20)
- ✅ **Predict & Win — live entry submission**: `lib/predict-win.ts` (round via public
  `/predictions`, fee/prize via `/fees|/prizes/<country>`, paid via `/pw-payment`, entered
  via `/pw-rounds`) + `components/dashboard/predict-game.tsx` (1/X/2 grid, picks → H/D/A
  string in fixture order, inline Paystack entry-fee → `verifyPwEntryAction` [verify-
  paystack-pw + paystack-pw], `submitPredictionAction` → `/submit-prediction {round,set_id,
  prediction}`). Wired into `/dashboard/pw` (country from user profile ∈ 6 PW countries
  else Nigeria). NOTE: country auto-geolocation NOT ported (legacy used a paid IP-geo API
  with 8 keys) — uses profile country instead; fine.
- ✅ **Geo-located pricing**: `config/pricing.ts` (all 7 non-NGN tables extracted via
  script: usd/ghs/kes/ugx/xof/sll/zar + countryPricing map + `getPricingFor`).
  `components/marketing/plans-pricing.tsx` (client country selector, defaults NG so NGN
  SSRs for SEO) on our-plans; payment-client got a country selector + currency passed to
  Paystack/Flutterwave. NOTE: legacy IP auto-detect not ported (manual selector instead).
- ✅ **Booking codes**: `lib/bookings.ts` + `components/marketing/booking-code.tsx`
  (bookie logos in `public/icons/bookies`, `/bookings/<cat>`) on free-tips (freex) +
  home-predictions (upcoming).
- ✅ **`/pw-terms`**: ported via cp + structural edits (like T&C).
- ✅ **Legacy redirects**: `next.config.ts` redirects() — /contact→/contact-us,
  /tipsstore→/tips-store, /payment/:slug→/dashboard/payment (308 permanent). Verified.
- Re-audit: remaining known simplifications are non-functional (toasts→inline; PW geo
  auto-detect → manual selector; booking shown on 2 surfaces not every table). Verify the
  rest of `dashboard/src` if a deeper audit is wanted.

**Still needs you / can't do in-code (NOT parity gaps):** real test login + Paystack/
Flutterwave test keys to verify authed + payment flows end-to-end; monthly win-rate %
needs a backend stats endpoint. (Named tipster data is now enterable via the tips180-theta
admin tipster manager — no longer a code gap; see Phase 8.)

## Repos

- **New (this repo):** `c:\Users\Abdullahi\Downloads\ore\tips180-next`
- **Legacy (reference, read-only):** `c:\Users\Abdullahi\Downloads\ore\dashboard`
  - Vite + React 18, JS, React Router, Tailwind **+ MUI**, react-helmet.
  - ~30 pages in `src/pages`, ~76 components in `src/components`, 50+ routes.
  - Read it to understand behavior; **do not** copy MUI or its patterns verbatim.

## Locked decisions (do not relitigate)

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 16, **App Router**, React 19 | SSR/ISR = crawlable content |
| Language | **TypeScript** (strict) | Quality; fresh-start payoff |
| Styling | **Tailwind v4 only** — drop MUI | Smaller bundle, better CWV; use Radix/shadcn for complex primitives if needed |
| Data | Server Components calling `tips180.com/api` | Predictions in initial HTML |
| Repo | Sibling folder, fresh git history | Old repo stays intact |

## Conventions

- **Theme = semantic CSS-variable tokens (central palette, dark-ready).** Defined
  in `app/globals.css`: light values in `:root`, dark in `.dark`, exposed to
  Tailwind via `@theme inline`. USE THE SEMANTIC UTILITIES, never raw palette:
  `bg-background` (page), `bg-surface`/`bg-surface-muted` (cards), `text-foreground`
  /`text-muted`/`text-subtle`, `border-border`/`ring-border`, `bg-primary`/
  `text-primary`/`hover:text-primary`, brand gradient `bg-linear-to-r from-brand-start
  to-brand-end` (+`bg-clip-text text-transparent` for gradient text), `bg-sidebar`/
  `text-sidebar-foreground`, `bg-primary-soft`, success/danger. `@custom-variant dark
  (&:where(.dark, .dark *))` enables class-based `dark:`. For JS-only contexts (next/og
  ImageResponse, SVG stroke) use `config/theme.ts` (mirrors the brand hex).
  **Dark mode is LIVE:** `components/ui/theme-toggle.tsx` (in header, desktop+mobile)
  flips `.dark` on <html> + persists to localStorage; a no-flash inline `<script>` in the
  root layout `<head>` applies stored/system preference before paint (`<html
  suppressHydrationWarning>`). Tokens flip automatically. Raw accent tints got `dark:`
  overrides (e.g. `bg-teal-50 dark:bg-surface-muted`, `bg-blue-50 dark:bg-primary-soft`,
  `bg-green-100 dark:bg-success-soft`) so light is unchanged but dark stays coherent;
  a few end-of-string tints + hero blobs may still want a dark-QA polish pass. Was migrated from raw teal-500/blue-600/stone-* via sed across 73 files;
  light token values == original colours so the migration was visually identical.
- **Server Components by default.** Add `"use client"` only for interactivity
  (forms, carousels, payment widgets, toasts). Keep client components leaf-level.
- **Fetch on the server** via `src/lib/api.ts` (`api<T>()`). Use `next.revalidate`
  for ISR; `revalidate: 0` for always-fresh, e.g. live predictions.
- **SEO per page:** export `metadata` (or `generateMetadata`) with a unique title
  (50–60 chars) + description + `alternates.canonical`. Add JSON-LD via
  `<JsonLd data={...} />` using builders in `src/lib/schema.ts`.
- **Structure:** route groups `(marketing)` (public/indexed), `(auth)` (noindex),
  `(dashboard)` (private). UI primitives in `components/ui`, SEO in `components/seo`.
- **Imports:** use the `@/*` alias. **Styling:** Tailwind classes via `cn()`
  (`src/lib/utils.ts`). No inline emotion/MUI.
- Run `npm run build` before declaring a phase done. Keep it green.

### Design — plan cards & marketing visual style
Follow the pattern established in `components/marketing/plans-pricing.tsx` (adapted
from `ore/90mins-client/src/features/user-dashboard/components/plan-cards/index.tsx`):

- **Per-card gradient header** with a unique accent colour per plan (defined in the
  `ACCENTS` array). Each accent has: `gradient` (header bg), `ring` (featured card
  border), `pill`/`pillOff` (active/inactive duration pills), `badge`, `cta` (button
  gradient), and a Lucide `icon`. Never use one flat colour for all cards.
- **Lucide icons** inside a frosted `bg-white/20` icon box in the gradient header.
  Pick semantically fitting icons (Key, Crown, Brain, RefreshCw, Zap, Trophy, etc.).
- **Decorative orbs** in the gradient header: two absolute-positioned `bg-white/10`
  circles give the 3-D glossy feel on both light and dark.
- **Card body is always white / dark `#18181b`** (zinc-900, NOT the stone `--surface`
  token) so it contrasts cleanly with the vivid gradient header. Use `dark:bg-[#18181b]`
  explicitly on the body element.
- **Duration pills** (not a `<select>`): clickable `<button>` pills that toggle the
  active duration. Active pill uses `accent.pill` classes (full accent colour + shadow);
  inactive uses `accent.pillOff` (border + text, hover tinted).
- **Large price** (`text-4xl font-black tracking-tight`) with a tiny `text-xs text-subtle`
  "per X" label below.
- **Featured card** (the recommended plan): add a floating "Most Popular" badge 3.5 rem
  above the card, a `ring-2 ring-offset-2` accent ring, and `shadow-lg`. Set
  `isFeatured = plan.slug === "premium"`.
- **Hover state:** `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`.
- **Entrance animation:** `plan-card-in` class (keyframe defined in `globals.css`) with
  a staggered `animationDelay` of `idx * 80ms`.
- **Dark mode glossy feel:** gradient headers remain vivid; card body is zinc-900
  (`#18181b`); borders on non-featured cards use `dark:border-white/8`; pill hover
  states use `dark:hover:bg-white/10`; page background transitions `dark:from-zinc-950
  dark:to-black`.
- **Marketing pages** that showcase plan cards (like our-plans) should open with an
  ambient blob + hero section (same pattern as the 90mins hero) before the card grid,
  and close with a trust-strip. Use `hero-fade-in`/`hero-blob` keyframes (globals.css).

## Progress

### ✅ Phase 0 — Foundation (DONE)
Scaffold (create-next-app: TS, Tailwind v4, App Router, src dir, `@/*`).
Core in place: `config/site.ts`, `lib/{api,schema,utils}.ts`, `components/seo/json-ld.tsx`,
`components/ui/button.tsx`, root `layout.tsx` (lang="en-NG", metadata, WebSite+Org JSON-LD),
`app/robots.ts` (allows AI bots), `app/sitemap.ts`, route-group layouts, home page with
FAQ schema, `public/llms.txt`, `.env.example`, README. Build verified green.

### ✅ Phase 1 — Shared chrome (DONE)
**UPDATE:** SiteHeader+SiteFooter now live in the ROOT `app/layout.tsx` (not the
(marketing) layout) so EVERY page has them — legacy `Main` wrapped all pages (auth,
dashboard, 404) with header/footer. Marketing pages stay static because the header reads
the auth cookie client-side (document.cookie), no server dynamic. (marketing) layout is
now just `<main>`.

`config/nav.ts` (typed header + footer link data). `components/layout/site-header.tsx`
(client: mobile toggle + active link via `usePathname`; MUI dropped, inline SVG icons;
Sign In/Up — logged-in dropdown deferred to Phase 5 auth/cookies). `components/layout/
site-footer.tsx` (pure Server Component). Mounted in `(marketing)/layout.tsx`. Assets
copied to `public/images` + `public/icons`. Note: Tailwind v4 renames `bg-gradient-to-r`
→ `bg-linear-to-r`. Build verified green.

### ✅ Phase 2 — Legal + static marketing pages (DONE)
`components/layout/content-shell.tsx` (`ContentShell` + `Subheading` — grey-page/
white-card frame, gradient headings). Pages: about-us, privacy-policy, refund-policy,
disclaimer, contact-us, our-plans, terms-and-condition. contact-us uses a client leaf
`components/marketing/contact-form.tsx` (POSTs to `/postendpoints/contact-us`, inline
status instead of react-toastify). our-plans renders crawlable plan cards from new
`config/plans.ts` (NGN base) — geo-pricing + Paystack/Flutterwave checkout deferred to
Phase 7; CTA links to /auth/signup. **T&C gotcha:** emitting the ~500-line legal text
through tool-call args truncates the turn repeatedly — instead `cp` the legacy
`TandC.js` into `page.tsx` (text bypasses model output) then make only small structural
edits (imports, drop Main/Helmet wrapper, add metadata) + `sed` the gradient class.
Build green (13 static routes).

### ✅ Phase 3 — Leagues (DONE)
`lib/leagues.ts` (typed fetchers, fail-soft). `(marketing)/leagues` index (ISR 1h,
region-grouped) + `(marketing)/leagues/[slug]` hub (SSG for top-8 Europe via
`generateStaticParams`, rest on-demand ISR 5m). **Key finding:** the matches endpoint
`GET /getendpoints/leagues/<league>` is PUBLIC (legacy gated it client-side behind
Premium, but the API is open) — so real predictions are server-rendered for crawlers.
Backend contract lives at `c:\Users\Abdullahi\Downloads\ore\tipsback\src` (Flask): list
endpoint returns `{ [region]: League[] }`; match endpoint upper-cases the path seg and
filters `Match.league == short_name.upper()`, `matchclosed=False`. **Slug gotcha:** raw
`short_name` has spaces (e.g. "LA LIGA") → `leagueSlug()` emits clean hyphenated URLs,
but query matches with the real `league.short_name` (via `findLeagueBySlug`), not the
slug. Schema: BreadcrumbList + FAQPage + SportsEvent (@graph, teams parsed from
"Home vs Away", dd/mm/YYYY→ISO). `sitemap.ts` now async, emits all ~313 league URLs.
Verified: `/leagues/mor` renders table + 5 SportsEvent in HTML. Build green (22 routes).

### ✅ Phase 4 — Home (DONE — FULL build; gap-filled later)
Home was later completed to the full legacy composition: Hero → `free-tips.tsx` (public
`/free-experts`, real tips, #1 SEO keyword) → `home-predictions.tsx` (recent/upcoming) →
`home-explore.tsx` (popular markets + leagues/plans/accuracy links) → `testimonials.tsx`
→ `home-faq.tsx` (visible 14-FAQ accordion, native <details>, from `config/faq.ts`; same
set drives FAQPage schema — was only 2) → `writeup.tsx` (long-form SEO copy). Verified:
all sections + 14-question FAQPage + 3 tables in prerendered HTML.
Then completed to the FULL legacy composition (user: "everything, SEO or not"): added
`announcement-banner.tsx` (+`dismissible-banner.tsx`, `/announcements`), `smartbet-landing.tsx`
(+`ui/countdown.tsx`, `/next-sb`), `landing-leagues.tsx` (`/league-tips` →
{epl,la_liga,seria_a,bundesliga}), `landing-store.tsx` (tip-store + ACCA promo),
`landing-plans.tsx`, `sports-news.tsx` (`/news`, external imgs via plain <img>),
`loyalty-ad.tsx` (loyalty-pc/mobile.webp). Fetchers in `lib/home.ts` (public, fail-soft).
Removed interim `home-explore.tsx`. Final order matches legacy; all 13 sections verified
in prerendered HTML with live data. Build+lint green (66 routes).

### (original Phase 4 detail) ✅ Phase 4 — Home (DONE)
Hero: `components/marketing/hero.tsx` (Server Component — structure adapted from the
90mins hero at `ore/90mins-client/src/marketing/components/hero`, tips180 teal→blue
palette; ambient blobs, tag pills, underlined headline, dual CTAs) + `hero-stats.tsx`
(client leaf, count-up on scroll-into-view via IntersectionObserver + rAF easeOutExpo,
reduced-motion aware; 6 stats). Keyframes `hero-fade-in`/`hero-blob` in globals.css.
Predictions: `lib/predictions.ts` (recent-win, upcoming-matches, feedbacks — all PUBLIC,
fail-soft) → `home-predictions.tsx` (Server Component renders both tables; `card_model`
fields: date ISO, league, name, fttip, ftscore, ft_odds) + `prediction-tabs.tsx` (client
leaf — both tables stay in DOM via `hidden` so crawlers index both). Slideshow: legacy
had two (hero Fade slider = obsolete; Feedback react-slick = testimonials) — ported the
testimonials one as `testimonials-carousel.tsx` (client, native scroll-snap, autoplay,
no deps) + `testimonials.tsx` (server wrapper). Icons inline SVG (no lucide). Verified:
home prerender has 2 tables / 24 prediction rows / 25 testimonials in HTML. Home is ISR
(10m). Build green. NOTE: legacy Home had many more sections not ported (Announcement
Banner, AllFreeExpert, SmartBetLanding, LandingLeagues/Store/Plans, SportsNews, Writeup)
— add later if desired; core hero+predictions+testimonials done.

### ✅ Phase 5 — Auth (DONE)
Pages in `(auth)/auth/{login,signup,password,reset/[id]}` (layout sets robots noindex;
`auth-shell.tsx` split card w/ illustration). Forms are client leaves using React 19
`useActionState` + Server Actions in `(auth)/auth/actions.ts` (login/signup/forgot/reset/
logout). Session = cookies (`lib/session.ts`): `tips180_token` httpOnly (backend
refresh_token, for server-side API auth in Phase 6) + `tips180_user` readable JSON (name/
plan, for header display without forcing marketing pages dynamic). Backend contracts:
`/auth/login` → `{is_authenticated, refresh_token, name, email, accoutplan, ...statuses}`;
`/auth/signup` {fname,email,phone,country,password,ref_code} → `{user_created}` | 409
`{user_exists}`; `/auth/reset-request` {email} → `{sent}`; `/auth/reset` {token,password}.
Countries extracted via script to `config/countries.ts` (233). **Next 16 gotcha:**
`middleware.ts` is DEPRECATED → renamed to `src/proxy.ts` with `export function proxy`
(same API); gates `/dashboard/:path*` → redirects to login when no token cookie. Also
wired the header logged-in state (Phase 1 deferral): reads `tips180_user` cookie client-
side, shows name + Log Out (logoutAction). **useSearchParams gotcha:** forced login form
CSR-only behind Suspense — read `searchParams` in the page (Server Component) and pass as
prop instead, so the form SSRs. Build green (25 routes).

### ✅ Phase 6 — Dashboard (DONE — except payment = Phase 7)
All 17 sidebar pages built (profile, store, messages, pw, pw-history, subscribe, odds2,
odds3, 50odds, smartbet, rollover, weekend10, acca, bankertips, puntersguide, glossary,
hiring). Added this pass: messages (`messages-view.tsx` client, mark-read via
`markMessageReadAction` PATCH `/edit/message/{id}` + revalidatePath), store
(`config/store-categories.ts` → tip-store links), odds2/odds3 (`sure2`/`sure3` Premium-
gated 2 sets via `getOddsSet` + `odds-sets.tsx`), puntersguide (`config/punter-guide.ts`
— legacy PuntersData had inline JSX, manually flattened to paragraphs+bullets), pw +
pw-history (read views of `getendpoints/pw-rounds` = user's entered rounds). All gate
307→login. ⚠ Predict & Win LIVE ENTRY SUBMISSION not built (needs the prediction grid +
POST; pw-entries/<set_id> returns round matches + user's prediction) — current pages are
read-only entry/history lists. payment page deferred to Phase 7.

Infra detail (still current): `lib/api-auth.ts` (`authFetch` adds Bearer from `tips180_token` cookie, fail-soft;
   `getCurrentUser()` = React `cache()`-memoised call to `/getendpoints/auth` →
   `{auth, new_token, user_data}` with all subscription statuses; `isActive()` helper).
   `config/dashboard-nav.ts` (18 sidebar links). `(dashboard)/layout.tsx` (Server
   Component — getCurrentUser or redirect, fetches unread count, renders chrome) +
   `components/dashboard/dashboard-sidebar.tsx` (client, active link + mobile toggle).
   Pages: profile (`/auth/change-pass` via `(dashboard)/dashboard/actions.ts` server
   action + `profile-tabs.tsx` client), glossary (`config/glossary.ts`, 44 terms via
   script), subscribe (static steps). Verified: all redirect 307→login when unauth.
   Note: can't runtime-test authed views (no creds) — built to backend contract,
   fail-soft. ✅ Plan pages done: 50odds(sure50/odds50status), smartbet(smart-bet/
   isubscriptstatus), weekend10(w10/w10subscriptstatus), rollover(rollover/
   rollsubscriptstatus), acca(experts-acca/Free+rsubscriptstatus gate, 2 sets),
   bankertips(bankers-tip, public single card), hiring(jobs, public). Shared:
   `lib/plan-tips.ts` (typed fetchers + normalizers → `TipRow`), `components/dashboard/
   {tips-table,plan-locked}.tsx`. accaformat plans use today+tomorrow; specformat plans
   (50odds/w10) pick 1st-or-2nd-set tip/odds. All gate 307→login unauth. Note `50odds`
   dir name starts with a digit — fine for Next route segments.

### ✅ Phase 7 — Payments (DONE — core; geo card-pricing deferred)
Consolidated the legacy scattered routes (`/payment/{paystack,flutterwave,ghana,...}`)
into ONE `(dashboard)/dashboard/payment` page. Plan+duration selector (config/plans.ts
NGN) → card checkout. **Used the official INLINE scripts** (`js.paystack.co/v1/inline.js`
→ `PaystackPop.setup`; `checkout.flutterwave.com/v3.js` → `FlutterwaveCheckout`) via a
`loadScript` helper, NOT the react-paystack/flutterwave-react-v3 wrappers (they peer-dep
React ≤18, conflict with React 19). Widget success callback → secure Server Action
`payment/actions.ts::verifyAndUpgradeAction` (verify-{paystack|flutter} → check
data.status success/successful → {paystack|flutter}-upgrade {plan:slug, duration:string,
reference}) — token stays httpOnly server-side. Keys: `config/site.ts` paystackKey/
flutterwaveKey from `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`/`NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY`
(.env.example updated). Country flows = manual mobile-money/bank instructions (NOT SDK
integrations) → `config/payment-methods.ts` + `components/payment/manual-payments.tsx`
(native <details>). Gates 307→login. ⚠ CAN'T TEST real payments (no keys/txns) — built
to provider+backend contract. ⚠ Per-country CARD pricing (legacy dollarData/ghanaData/
kenyaData geo price tables) DEFERRED — card uses NGN; manual instructions cover countries.
This also fills `/dashboard/payment` (Phase 6 hole). Build green (43 routes).

### ▶️ Remaining phases (in order)
### ✅ Phase 8 — SEO/GEO assets (DONE — code-able parts; data-dependent parts flagged)
Schema builders added to `lib/schema.ts`: `personSchema` (author/tipster E-E-A-T, sameAs)
+ `articleSchema` (authored analysis). `components/seo/last-updated.tsx` (visible
"Last updated" <time> — AI Overviews cite recent pages 3×) added to league `[slug]` pages
+ accuracy. **Accuracy archive** `(marketing)/accuracy` — grounded in REAL `/recent-win`
data (20 verified wins: match + our tip + final score + Won badge), NOT fabricated win-
rate %; BreadcrumbList + FAQPage + LastUpdated; added to sitemap (0.9 daily), footer
helpful links, llms.txt. FAQ block + faqSchema added to our-plans. llms.txt refreshed
(accuracy, leagues, how-to-pay, contact + schema inventory). Build green (44 routes,
accuracy renders 20 Won rows + schema in HTML).
✅ Named tipster profiles — now LIVE (2026-07-08), delivered via a backend-driven tipster
feature rather than the `config/tipsters.ts` stub: public `/tipsters/[id]` profile page +
`components/marketing/tipster-badge.tsx` (rendered BELOW the prediction tables) reading
`/tipsters/for/<category>/<date>` and `/tipsters/<id>/profile` (`lib/tipsters.ts`), with
full tipster CRUD + per-date/per-category assignment in the tips180-theta admin. `personSchema`
is now populated from real data. Avatars resolve to the hardcoded `/api/uploads/photos/...`
(nginx-served) URL.
⚠ DELIBERATELY NOT DONE (integrity / needs real backend data, do NOT fabricate): computed
monthly win-rate % + data studies (no backend stats endpoint — `/recent-win` is the only
results data); hreflang for KE/GH (roadmap M6-9). Off-page (Section 5: backlinks/DR/PR/
Reddit/Wikipedia) is NOT code — track separately.
### ✅ Phase 9 — Polish (DONE — code parts; live CWV audit needs deploy)
`app/not-found.tsx` (branded 404, logo + home CTA), `app/error.tsx` (client error
boundary, reset + Link home), `loading.tsx` for `leagues/[slug]` + `(dashboard)` (shared
`components/ui/spinner.tsx`). **OG image:** `app/opengraph-image.tsx` (dynamic via
`next/og` ImageResponse, teal→blue branded, 1200×630) — removed the dead `/og.png`
refs from root layout metadata so the file-convention image is used (verified 200
image/png 79KB). **Analytics:** `components/analytics/analytics.tsx` (gtag via next/script
afterInteractive — won't block LCP) wired in root layout; `config/site.ts` googleAdsId
(default AW-17670030360) + ga4Id from env (.env.example updated). Verified gtag in home
HTML. **Lint:** turned off `react/no-unescaped-entities` (valid apostrophes, incl. cp'd
legal text) in eslint.config; targeted inline-disables for 2 legit post-hydration
`set-state-in-effect` (cookie/matchMedia reads). `npm run lint` + `npm run build` both
GREEN (45 routes). ⚠ Live CWV audit (Lighthouse LCP/INP/CLS) needs a deployed instance —
code-side already done: next/image everywhere, afterInteractive analytics, font swap,
loading states, Server-Components-by-default. next.config is clean (no special deploy
config needed for Vercel/Node).

### ✅ Gap fix — missing routes (were 404ing nav/footer links)
Audit found 6 routes never built (header nav `/how-to-pay` `/tips-store` `/predict-win`,
footer/store `/tip-store/[name]`, `/dashboard` index, `/ad`). All built now:
`config/tip-store.ts` (16 market categories + tier + `gated` flag from backend auth probe:
PUBLIC = dc/over-1/potential-risk/correct-score/draw; rest JWT) + `lib/tip-store.ts`
(`getCategoryTips` — public via `api()` so tips SSR for SEO, gated via `authFetch`→upsell).
`(marketing)/tips-store` (grid), `(marketing)/tip-store/[name]` (SEO landing + live tips
for public tiers / subscribe-upsell for gated; breadcrumb+FAQ schema; doublechance renders
38 real tips in HTML), `(marketing)/how-to-pay` (steps + ManualPayments), `(marketing)/
predict-win` (public landing + FAQ), `(marketing)/ad` (CleverCore script, noindex),
`(dashboard)/dashboard/page.tsx` (redirect→profile). Sitemap extended (tips-store,
tip-store/*, predict-win, how-to-pay). All nav links now 200. Build+lint green (66 routes).

— MIGRATION CORE COMPLETE (Phases 1–9).
Since cleared (do NOT re-list as pending): PW live entry submission + geo card-pricing
(see Parity gaps, 2026-06-20); legacy Home secondary sections (Phase 4 gap-fill); named
tipster profiles (now LIVE via the backend tipster feature — see Phase 8, 2026-07-08).
Genuine remaining deferrals — need external data / keys / deploy, NOT code: verify authed +
payment flows with real test creds/keys; computed monthly win-rate % + data studies (no
backend stats endpoint); hreflang KE/GH; live CWV/Lighthouse audit; minor dark-mode QA pass.
Note: the admin (tips180-theta) upgrade, Trendy Matches store, feedback/analytics, and the
/theta-v2 parallel deploy are OUT OF SCOPE for this skill (tips180-next migration only).

See `references/legacy-route-map.md` for the full route → legacy-file mapping.

## What this rewrite can / cannot achieve

**Can (in-code):** SSR crawlability, schema that actually renders, robots, sitemap,
llms.txt, en-NG locale, fast CWV, hub pages, FAQ/accuracy-archive *templates*.

**Cannot (off-page, not code):** Domain Rating growth, backlinks, roundup features,
media PR, link partnerships, Reddit/Wikipedia presence, original data studies
(needs real match data), YouTube. These determine final rankings — code only makes
the site *eligible* to rank. Don't promise ranking outcomes from code changes.

## References

- `references/seo-geo-masterplan.md` — full SEO/GEO strategy (6 sections + roadmap).
- `references/legacy-route-map.md` — every legacy route, its file, target group, status.
