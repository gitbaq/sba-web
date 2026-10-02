# Audit baseline — syedbaqirali.com

**Phase:** P0 Discovery  
**Date:** 2026-10-02  
**Branch:** `overhaul/p0-discovery`  
**Production checked:** https://www.syedbaqirali.com  
**API:** https://api.syedbaqirali.com  
**Repos:** `sbaweb_frontend` (+ schema from `sba_backend_monorepo/sbaweb_backend`)

---

## P0-01 Repo map

### App Router routes

| Route | Role |
| --- | --- |
| `/` | Home via `HomeGate` (client audience gate) |
| `/writing`, `/writing/[slug]`, `/writing/series`, `/writing/series/[topicSlug]` | Writing |
| `/learning`, `/learning/[topicId]` | Legacy redirects to Writing |
| `/work`, `/work/[slug]` | Case studies (static `lib/work.ts`) |
| `/for/hiring`, `/for/clients`, `/for/readers` | Audience homes |
| `/about`, `/contact`, `/subscribe` | Brand pages |
| `/login`, `/signup`, `/forgotpassword`, `/logout` | Auth |
| `/editor/[subId]`, `/admin`, `/profile/[id]` | Ops / account |
| `/feed.xml`, `/robots.txt`, `/sitemap`, `/llms.txt`, `/llms-full.txt` | SEO / AI surfaces |

Single root layout: `app/layout.tsx` (nav via `SidebarWrapper`, footer). No nested route-group layouts.

### Data fetching

- Server fetch helpers under `utils/services/` (`getLatestSubtopics`, `getTopics`, `getRandomQuote`, etc.).
- API base hardcoded in `utils/endpoints/endpoints.tsx` → `https://api.syedbaqirali.com`.
- Essays = Spring `SubTopic` rows. Series ≈ `Topic` + `topicId`.
- Canonical essay URLs built in `lib/articles.ts` as `{slugified-title}-{id}` because API `slug` values are duplicated or null.

### Key UI

- Home: `HomeGate` → `AudiencePicker` or `BrandHome`.
- Writing: index + article TOC / progress / subscribe CTAs.
- Design tokens: `life-hero`, craft CTAs in `app/ui/globals.css`.
- Theme: `@wrksz/themes` / next-themes; nav toggle + footer light/dark/system.

### Env

- `.env` / `.env.local` (gitignored). Used: `NEXT_PUBLIC_GSC_VERIFICATION`, `SESSION_SECRET`. (TinyMCE API key removed; editor is TipTap self-hosted.)

### Assumption corrections vs `site_overhaul.md`

| Doc assumption | Finding |
| --- | --- |
| Need new sitemap/robots from scratch | Already exist as route handlers (`/sitemap`, `/robots.txt`) |
| Topic filter lists 9 topics | API returns **5** topics for **9** essays |
| Slugs only numeric-suffix problem | API `slug` often **identical** across posts; frontend already synthesizes `{title}-{id}` |
| No RSS / llms | `/feed.xml`, `/llms.txt`, `/llms-full.txt` already ship |

---

## P0-02 Public HTML rendering

**Method:** `curl -sS https://www.syedbaqirali.com/` (no JS).

| Check | Result |
| --- | --- |
| Initial HTML includes `Loading…` | **Yes** (from client `HomeGate` while `useAudience` not ready) |
| Hero / essay list / subscribe in HTML without JS | **No** for first-visit path (picker or brand home only after hydration) |
| Meta title / description present | Yes (server `metadata` on `app/page.tsx`) |
| `keywords` meta | Present (identical-style keywords; Phase 1 should remove) |
| Canonical | Present on home |

**Conclusion:** Home is **server-fetched** but **client-gated**. Crawlers and no-JS users see “Loading…”, not the reader hero. Matches audit item; Phase 1 P1-01 remains valid.

Other public routes (`/writing`, essays, `/for/clients`) are mostly server-rendered page content (not re-verified line-by-line here; Lighthouse ran successfully on them).

---

## P0-03 API endpoints and schema

### Frontend-used public API

| Method | Path | Use |
| --- | --- | --- |
| GET | `/subtopics/v1` | Essay list |
| GET | `/subtopics/v1/s/{id}` | Essay by id |
| GET | `/subtopics/v1/search` | Search |
| GET | `/topics/v1` | Series / topics |
| GET | `/quotes/v1` | Home quote |
| POST | `/subs/v1` | Subscribe |
| POST | `/contact/v1` | Contact |
| POST | `/auth/v1/login3`, `/signup` | Auth |

### Secure (auth) write APIs

`/secure/subtopics/v1`, `/secure/topics/v1`, `/secure/quotes/v1`, `/secure/contact/v1` (GET by id + POST).

### Other controllers (exist; low frontend use)

`/v1/posts`, `/v1/likes`, `/v1/comments` — note prior security review: several public mutate/list risks.

### MySQL essay shape (`sub_topic` / `SubTopic`)

| Field | Notes |
| --- | --- |
| `id` | PK |
| `heading`, `subHeading` | Title / subtitle |
| `slug` | **Not unique in practice**; often shared string |
| `content` | HTML text |
| `topic_id` | FK to topic (series) |
| `imageUrl` | Optional |
| `isPublished`, `publishDate`, `publishedBy` | Publish meta |
| `createDate`, `updateDate` | From `Auditable` |
| Missing vs overhaul P1-08 | `dek`, `tldr`, `legacy_slug`, `canonical_url`, `og_image_url`, `noindex`, `series_order`, `tags` |

### Live inventory (2026-10-02)

- **9** subtopics, **5** topics (Deep Learning, NLP, Rust, Blockchain, Opinion).
- Publish dates: **7** on `2025-03-27`, 1 on `2025-06-30` (Blockchain 101), 1 on `2025-10-27` (Why AI…).
- Cadence claim “about one piece a week” is **false**.
- Newest id 19 slug in API: `why-ai-is-on-everyones-mind`; public URL uses `…-19` suffix via frontend helper.
- Several API slugs = `augmenting-and-transforming-collective-intelligence` (collision).

---

## P0-04 robots / sitemap / feed / llms

| URL | HTTP | Notes |
| --- | --- | --- |
| `/robots.txt` | 200 | Allows `*`, GPTBot, ClaudeBot, Google-Extended, etc. Disallows `/admin/`, `/editor/`, `/api/`, `/_next/` |
| `/sitemap` | 200 | XML urlset; home, writing, series, work, for/*, essays. **Not** `/sitemap.xml` (doc may want alias or `app/sitemap.ts`) |
| `/feed.xml` | 200 | RSS 2.0; items present; titles/links use writing URLs |
| `/llms.txt` | 200 | Site summary + audience paths |
| `/llms-full.txt` | 200 | Longer variant |

**Gap vs Phase 1/3:** sitemap path naming; ensure only indexable essays; stub `noindex` not implemented yet; RSS full-text / `content:encoded` not verified as complete HTML.

---

## P0-05 Lighthouse mobile (lab, 2026-10-02)

Tool: Lighthouse 12.2.1, mobile emulation, headless Chrome.

| Page | Perf | A11y | Best practices | SEO |
| --- | --- | --- | --- | --- |
| `/` | 73 | 100 | 79 | 100 |
| `/writing` | 81 | 100 | 79 | 100 |
| `/writing/why-ai-is-on-everyones-mind-19` | 67 | 97 | 79 | 100 |
| `/for/clients` | 82 | 100 | 79 | 100 |

Home CWV (lab): **LCP 3.6s** (over 2.5s target), **CLS 0.067** (OK), **INP ~200ms** (on threshold).

Phase 2 targets (Perf 90+, BP 95+, LCP &lt; 2.5s) are **not** met yet. SEO category already 100 in lab (does not mean unique OG/canonical everywhere).

---

## Priority findings for Phase 1

1. Remove client-only home gate from first paint (P1-01).
2. Metadata uniqueness + drop keywords; title template (P1-02…03).
3. Cadence copy honesty (P1-13…14).
4. Login out of header (P1-15).
5. Backend: unique `slug` / `legacy_slug` + dek/tldr/noindex (P1-06…08) — **API work in monorepo**.
6. Related reading / dead Blockchain links need content decisions (owner TODOs).

---

## Owner review gate

Phase 0 acceptance: this file answers P0-01…05.  
**Stop here.** Do not start Phase 1 until owner approves.

Optional owner notes before P1:

- Confirm keep or kill audience picker on first visit.
- Confirm LinkedIn profile URL (seo.ts already has `/in/syedbaqirali`).
- Stub essay / Blockchain 101 decisions (see `site_overhaul.md` §7).
