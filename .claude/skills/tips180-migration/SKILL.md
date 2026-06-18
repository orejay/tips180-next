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

## Progress

### ✅ Phase 0 — Foundation (DONE)
Scaffold (create-next-app: TS, Tailwind v4, App Router, src dir, `@/*`).
Core in place: `config/site.ts`, `lib/{api,schema,utils}.ts`, `components/seo/json-ld.tsx`,
`components/ui/button.tsx`, root `layout.tsx` (lang="en-NG", metadata, WebSite+Org JSON-LD),
`app/robots.ts` (allows AI bots), `app/sitemap.ts`, route-group layouts, home page with
FAQ schema, `public/llms.txt`, `.env.example`, README. Build verified green.

### ▶️ Next phases (in order)
1. **Shared chrome** — port Header/Nav + Footer into `(marketing)/layout.tsx`.
   Replace MUI `useMediaQuery` with CSS/Tailwind responsive or a `useMediaQuery` hook.
2. **Legal + static marketing pages** (easy SSR wins, high SEO value): about-us,
   contact-us, privacy-policy, terms-and-condition, refund-policy, disclaimer,
   our-plans. Pure content → straightforward Server Components.
3. **Leagues** — `/leagues` index + `/leagues/[slug]` hub pages. Build these as
   the SEO pillar pages (topical clusters). Add `SportsEvent` + `BreadcrumbList`
   schema. Fetch via `api()`, ISR.
4. **Home** — full port of `pages/nav/Home.js`: hero, slideshow (replace
   react-slick/react-slideshow with a light client carousel), prediction tables.
5. **Auth** — login, signup, forgot-password, reset (`(auth)` group). Port the
   API auth calls; move session handling to cookies/middleware. noindex.
6. **Dashboard** — `(dashboard)` group: profile, 50odds, smartbet, weekend10,
   rollover, acca, store, messages, subscribe, predict-and-win, etc. Add auth
   gating via middleware. Private (robots disallows).
7. **Payments** — Paystack + Flutterwave + country flows (ghana/kenya/tanzania/
   uganda/cameroon/benin/wa). These are client components; port public keys to
   env. Test each flow.
8. **SEO/GEO assets** (the differentiators — see references/seo-geo-masterplan.md):
   accuracy archive, named tipster profiles (Person schema), data studies, FAQ
   blocks per page, dynamic sitemap from API, multi-modal content.
9. **Polish** — Core Web Vitals audit (LCP<2.5s, INP<200ms, CLS<0.1), OG images,
   error/loading/not-found boundaries, analytics (port the AW-17670030360 Google
   Ads tag; add GA4 if desired), deploy config.

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
