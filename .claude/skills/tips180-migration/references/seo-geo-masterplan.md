# Tips180 SEO + AI-Search (GEO) Master Plan

Source strategy doc (June 2026) condensed for engineering use. Baseline metrics:
~524K monthly traffic, Google share 34.1%, **Domain Rating 21/100**, 53.6K
backlinks, 2,260 referring domains, AI visibility untapped. Competitors outrank
on authority: Forebet DR 63, FreeSuperTips DR 58, Predictz DR 52.

This is a **YMYL** (Your Money/Your Life) niche → Google applies the highest
E-E-A-T scrutiny. Trust signals matter more than in most verticals.

## Verified legacy state (what the rewrite fixes)

- Legacy served an empty `<div id="root">` (Vite CSR) → crawlers saw nothing. ✅ fixed by SSR.
- No `robots.txt` existed at all. ✅ added (`app/robots.ts`).
- No `sitemap.xml`. ✅ added (`app/sitemap.ts`, extend with dynamic URLs).
- No `/llms.txt`. ✅ added (`public/llms.txt`).
- `lang="en"` (generic). ✅ now `en-NG`.
- Schema was WebSite+Organization only, injected client-side via react-helmet →
  invisible in raw HTML. ✅ now server-rendered; expand to SportsEvent/FAQ/Person.

## Section 1 — Technical (build into the rewrite)

- **SSR** — the unlock. App Router Server Components. (Foundation done.)
- HTTPS single 301, no chains. `lang="en-NG"`. ✅
- robots.txt allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
  Google-Extended, CCBot, Applebot-Extended. ✅
- Dynamic XML sitemap with `lastmod`; submit to Google Search Console **and Bing
  Webmaster Tools** (Bing powers ChatGPT retrieval). (Static done; make dynamic.)
- Core Web Vitals on mobile: LCP <2.5s, INP <200ms, CLS <0.1.

## Section 2 — Keyword tiers (drive page/route planning)

1. Branded: tips180, tips180 prediction today, tips180 correct score
2. High-volume niche: football predictions today, sure bet tips, over 2.5 goals today, correct score prediction, accumulator tips
3. Regional long-tail: football predictions Nigeria today, NPFL betting tips, Kenya Premier League prediction, AFCON correct score, Betking tips today
4. Conversational/AI: "best football prediction site in Nigeria", "most accurate free tips site Africa"
5. Competitor gaps: victorspredict alternative, better than forebet, confirmbets alternative
6. **World Cup 2026** (time-sensitive, Jun–Jul 2026): World Cup 2026 predictions, FIFA 2026 group stage tips, Super Eagles World Cup odds

Mirror exact query wording in titles/H1s. Use tip-type entities ("1X2",
"over 2.5 goals", "BTTS") not just "football tips".

## Section 3 — E-E-A-T & content authority

- **Named tipster profiles** with photos, bios, social (`sameAs`), per-league
  win-rate history. Anonymous predictions rank poorly + can't be AI-cited.
- **Public accuracy archive** — verifiable record of predictions vs outcomes,
  monthly win rates by tip type/league. Likely top-ranking, most-cited asset.
  (Needs real historical data from backend.)
- **League/competition hub pages** (EPL, La Liga, AFCON, NPFL, KPL, UCL, WC2026)
  → topical clusters linking to daily sub-pages, stats, form, H2H.
- Original monthly **data studies** (needs real data) → natural backlinks + AI citations.
- **FAQ sections** on every prediction page, 5–8 Q&As, each self-contained.
- Multi-modal: text + tables + short video → higher AI Overview selection.

## Section 4 — Schema (builders in src/lib/schema.ts)

- `SportsEvent` on every match page (teams, competition, date, venue). ✅ builder ready.
- `Article` + `Person` (author) with `sameAs` → LinkedIn/X. Core YMYL signal. (add Person)
- `FAQPage` + `BreadcrumbList` + `WebSite` (with SearchAction). ✅ builders ready.
- `/llms.txt` markdown TOC of best pages. ✅ (keep updated as pages land).

## Section 5 — Off-page (NOT code — track, don't implement)

Target DR 40+ in 12 months. Roundup features (FulltimePredict, ThePuntersPage…),
Nigerian/Kenyan media PR (Punch, Goal, KBC), Betika/Victorspredict link
partnerships, Reddit presence (Perplexity cites Reddit 46.7%), Wikipedia mentions.

## Section 6 — Platform GEO

- **ChatGPT:** Bing retrieval → submit Bing sitemap; favors Wikipedia authority;
  clean Article + author schema cited higher.
- **Perplexity:** Reddit-heavy, strong recency bias (timestamp daily predictions),
  exact keyword match in titles, Q&A format (lead with direct answers).
- **Google AI Overviews:** SportsEvent+FAQ schema, multi-modal, visible
  "Last updated" timestamps (pages <3 months old cited 3×).

## 12-month roadmap (engineering-relevant slices)

- M1–2: technical fixes (✅ much done in foundation) + base schema + title tags + AI baseline audit.
- M2–4: SSR (done), tipster profiles + author schema, accuracy archive, 6 league hubs, SportsEvent sitewide, first data study.
- M4–6: World Cup 2026 cluster, WC hub, `/llms.txt` (✅), dynamic sitemap.
- M6–9: multi-modal content, expand FAQs, hreflang for Kenya/Ghana.
- M9–12: CWV/competitive polish, YouTube SEO, quarterly data studies.
