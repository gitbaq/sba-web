# Audit baseline (P1-01)

**Date:** 2026-10-03 (updated 2026-10-04 during Phase 1)  
**Source of truth:** `CURSOR_PROMPT.md` + `.cursor/rules/site-overhaul.mdc`  
**Production:** https://www.syedbaqirali.com  
**API:** https://api.syedbaqirali.com  

This replaces the older P0-era notes in spirit. Keep `SITE_OVERHAUL.md` as history only.

---

## Shared layout

| Piece | File | Notes |
| --- | --- | --- |
| Root layout | `app/layout.tsx` | Server component. Site-wide metadata template, ThemeProvider, AuthProvider, `SidebarWrapper`, Footer. Does **not** read cookies/headers/searchParams. No meta keywords. |
| Nav / shell | `components/SidebarWrapper.tsx` | Client. Public: Navbar. `/admin` and `/editor`: admin sidebar modes. |
| Header | `components/navbar.tsx` + `navlinks.tsx` | Nav from `lib/siteShell` `PRIMARY_NAV`. |
| Footer | `components/footer.tsx` | From `FOOTER_NAV` / `FOOTER_PROJECTS`. `LoginLink` SSR href is always `/login`. |
| Socials | `components/socials.tsx` | From `SOCIAL_LINKS` (LinkedIn profile, x.com, Calendly). |
| SEO helpers | `lib/seo.ts` | `SITE`, `pageMeta()` for website/article/project, Person/WebSite JSON-LD. |

**P1-03:** Footer Login no longer uses `useSearchParams`. SSR HTML always has `href="/login"`. Return URL is attached in `useEffect` after mount.

---

## Public routes (rendering and data)

| Route | Mode (code) | `revalidate` / tags | Data source | Metadata |
| --- | --- | --- | --- | --- |
| `/` | ISR (async RSC) | `60`; essays, home-config, work, about tags | API essays + configs | `pageMeta` absolute title |
| `/writing` | ISR | `60` + essays | essays + topics | `pageMeta` |
| `/writing/[slug]` | ISR | `60` + essays | essay by slug/id | `pageMeta` article |
| `/writing/series` | ISR | `60` + essays/topics | topics | `pageMeta` |
| `/writing/series/[topicSlug]` | ISR | `60` + tags | topic + essays | `pageMeta` |
| `/work` | ISR | `60` + work-projects | work API (+ fallback) | `pageMeta` |
| `/work/[slug]` | ISR | `60` + work-projects | work API (+ fallback) | `pageMeta` (fixes Blox OG inherit) |
| `/about` | ISR | `60` + about-config | about API (+ fallback) | `pageMeta` |
| `/contact` | RSC + client form | static shell | contact POST | `pageMeta` |
| `/subscribe` | RSC + client form | static shell | newsletter API | `pageMeta` |
| `/subscribe/confirm` | client confirm | n/a | confirm API | `pageMeta` |
| `/unsubscribe` | client | n/a | unsubscribe API | `pageMeta` noIndex via layout |
| `/for/clients` | ISR | `60` | static + essays | `pageMeta` |
| `/for/readers` | ISR | `60` | essays | `pageMeta` |
| `/for/hiring` | ISR | `60` | about-ish | `pageMeta` |
| `/privacy` | static RSC | n/a | copy | `pageMeta` |
| `/learning`, `/learning/[topicId]` | redirects | n/a | n/a | n/a |
| `/login`, `/signup`, … | client auth | dynamic | auth API | local metadata |
| `/admin/*`, `/editor/*` | dynamic (auth) | no-store where needed | secure APIs | admin titles |
| `/feed.xml` | route handler | check feed route | essays | RSS |
| `/sitemap` | route handler | essays `86400` | essays + topics + work | XML |
| `/robots.txt` | route handler | static allow list | n/a | text |
| `/llms.txt`, `/llms-full.txt` | `force-dynamic` + `revalidate 3600` | 3600 | essays + topics | text |

**Added:** `scripts/verify-live.mjs`, `scripts/revalidate-all.mjs`, npm `verify:live` / `revalidate:all`, CI workflow `.github/workflows/verify-live.yml`.

---

## Revalidation (P1-02)

| Mechanism | Status |
| --- | --- |
| Per-fetch `next: { revalidate: 60, tags }` | essays, topics, work, about, home-config |
| `/api/revalidate` | Protected with optional `REVALIDATE_SECRET`. Supports `tag`, `paths`, and `all: true` (all tags + core paths). |
| FE editor / admin saves | Best-effort `fetch("/api/revalidate")` with tag + paths |
| Spring publish hook | `FrontendCacheRevalidator` called from `SubTopicService` create/update/delete and `ScheduledPublishJob`. Config: `FRONTEND_REVALIDATE_URL`, `REVALIDATE_SECRET`. |
| Deploy-time full revalidate | `npm run revalidate:all` (set `REVALIDATE_SECRET`) |

---

## Live headers checked 2026-10-04 (before this branch ships)

| URL | Cache signal | Notes |
| --- | --- | --- |
| `/` | `x-vercel-cache: HIT`, `x-nextjs-prerender: 1` | Prerendered; SSR Login `href="/login"` |
| `/writing` | `cache-control: private, no-cache…`, `x-vercel-cache: MISS` | Still dynamic on live (old LoginLink / unshipped fixes) |
| `/work/blox` | same private/MISS | Live still has `callbackUrl` in Login and homepage `og:*` (fixed in this branch, not deployed) |

Stale-vs-new split was: (1) Footer `useSearchParams` dynamic hole, (2) ISR/CDN without reliable on-publish bust, (3) older HTML not revalidated after design ship. Not an unmigrated HomeGate on `/` (`HomeGate.tsx` unused).

---

## Shell / copy / SEO defects still relevant (later phases)

- Writing index / some essays may still serve old cached HTML until deploy + `revalidate:all`.
- Home duplicate essay in Latest + Start here (P2-09 / P3-11).
- Admin-voice and confidence-weakening copy (P2-08, P2-11).
- Subscribe honeypot visibility (P3-03).
- RSS `lastBuildDate` / truncated descriptions (P4-05).
- Owner removing Substack stub essay (P2-06). Footer Substack link removed in P1-04.

---

## Data sources

| Content | Source of truth |
| --- | --- |
| Essays / series | MySQL via Spring (`/subtopics/v1`, `/topics/v1`) |
| Work / about / home placement | MySQL site config APIs with FE fallbacks in `lib/work.ts`, `lib/homeConfig.ts` |
| Media | S3 via `/secure/media/v1` |
| Newsletter | Spring subscribe/confirm/unsubscribe + SES |

---

## Phase 1 readiness snapshot (end of implementation)

| ID | Title | Code reality |
| --- | --- | --- |
| P1-01 | Baseline audit | This file + live header sample |
| P1-02 | Revalidation | FE `/api/revalidate` + Spring hook + deploy script |
| P1-03 | Static shared layout | LoginLink static SSR |
| P1-04 | One shared shell | `lib/siteShell.ts`; Substack removed; Cobu name aligned |
| P1-05 | Server-render public routes | Public pages are RSC; no HomeGate Loading on `/` |
| P1-06 | Central metadata | `pageMeta` on website, article, project routes |
| P1-07 | `verify-live.mjs` | Script + npm + scheduled CI workflow |

---

## Owner inputs recorded

- Phase 1 approved.
- GitHub issues: no.
- Substack footer Projects link: remove (owner will also remove stub essay).
