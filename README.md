# Tips180 — Next.js

A clean Next.js rewrite of the Tips180 football prediction site. Migrating the
legacy Vite/CRA client-side SPA to a server-rendered App Router app to unlock
SEO and AI-search (GEO) visibility.

## Stack

- **Next.js 16** (App Router, React 19) — SSR/ISR for crawlability
- **TypeScript** (strict)
- **Tailwind CSS v4**
- Backend: the existing `tips180.com/api` (unchanged — this is a frontend rewrite)

## Getting started

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev                  # http://localhost:3000
```

## Project structure

```
src/
  app/
    (marketing)/   Public, SEO-facing pages (home, leagues, plans, legal)
    (auth)/        Login, signup, password reset (noindex)
    (dashboard)/   Authenticated user area (predictions, profile, payments)
    layout.tsx     Root layout: lang="en-NG", site metadata, site-wide JSON-LD
    robots.ts      robots.txt (allows AI crawlers)
    sitemap.ts     sitemap.xml
  components/
    ui/            Reusable Tailwind primitives
    seo/           JSON-LD and SEO helpers
  config/site.ts   Branding, URLs, locale — single source of truth
  lib/             api client, schema builders, utils
  types/           Shared domain types
```

## Why the rewrite

The legacy app shipped an empty `<div id="root">` to crawlers (CSR-only), so
predictions, schema and meta were invisible without JS. This rewrite renders
content server-side. See the **`tips180-migration`** Claude skill
(`.claude/skills/tips180-migration/`) for the full SEO/GEO master plan, the
legacy route map, and the phased port plan — it lets the migration be resumed
in any session.
