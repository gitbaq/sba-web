# Site Overhaul: syedbaqirali.com

## 0. How to use this file (instructions for Cursor)

- Read this whole file before changing anything.
- Work one phase at a time. One branch and one PR per phase.
- Do not start the next phase until every acceptance check in the current phase passes.
- Before editing, inspect the repo. Report what you found. If an assumption in this file is wrong, say so and propose a fix. Do not guess.
- Never invent facts. This includes metrics, testimonials, client names, dates, and credentials. Where a fact is missing, insert a visible placeholder in this form: `TODO(owner): <what is needed>`.
- Do not add paid third-party services. Free tiers and AWS pay-as-you-go services already in the account are allowed.
- Keep commits small and named by task ID (for example `P1-03: unique metadata per route`).
- After each task, tick its checkbox in this file.

## 1. Context

- Owner: Syed Baqir Ali. Personal brand site at https://www.syedbaqirali.com.
- Stack: Next.js (frontend), Spring Boot (API), MySQL on AWS RDS, EC2 with Docker.
- Essays currently live in MySQL and are served through the Spring Boot API.
- Purposes, in priority order:
  1. Publish essays and grow readers and email subscribers (primary conversion: subscribe).
  2. Help clients understand services and book a call.
  3. Help hiring managers assess background and fit.
- Voice: professional, plain, concrete. Short sentences. No filler.
- Copy rules for every string you write or edit:
  - No em-dashes and no en-dashes. Use periods, commas, colons, or hyphens.
  - No marketing filler ("cutting-edge", "world-class", "unlock", "seamless").
  - One idea per sentence.

## 2. Audit baseline (what is wrong today)

- Homepage returned only "Loading…" to a crawler. Public content may be client-rendered.
- Claim of "about one piece a week" is false. Seven of nine essays are dated 2025-03-27. The newest is 2025-10-27.
- Newest essay is a stub that links to Substack. Its OG image is hotlinked from Substack.
- Every page shares the homepage's `og:title`, `og:url`, and `og:description`.
- Titles are duplicated, for example "Work | Syed Baqir Ali | Syed Baqir Ali".
- Meta keywords tag is identical on every page. It is ignored by Google.
- Canonical tags exist only on the homepage and essays.
- Slugs carry numeric suffixes (`-19`, `-5`, `-14`). Some are vague (`an-introduction-1`).
- Topic filter lists 9 topics for 9 essays. It filters nothing.
- Blockchain 101 lists 20 articles. 19 are dead `#` links.
- "Related reading" ignores topic (a blockchain essay lists AI essays).
- LinkedIn link points to a "follow" discovery URL, not the profile. Footer links render as raw URLs.
- Header shows a public "Login" link.
- Clients page has four competing buttons and generic service copy. Blox is missing from it.
- Case studies have no metrics, role, or timeline.
- About page is mostly navigation. It has no bio or credentials.
- Subscribe page contradicts itself ("occasional" vs "weekly").
- `next/image` requests `w=3840` with no `sizes`, so mobile likely downloads oversized images.

## 3. Phase 0: Discovery (no code changes)

- [x] P0-01 Map the repo: routes, layouts, data fetching, components, API client, env handling. Write `docs/audit-baseline.md`.
- [x] P0-02 Confirm how public pages render. Run `curl -s https://www.syedbaqirali.com/ | head -200` and compare with the browser. Record whether content is in the initial HTML.
- [x] P0-03 List all Spring Boot endpoints used by the frontend and the post/series/tag schema in MySQL.
- [x] P0-04 Check whether `robots.txt`, `sitemap.xml`, and `feed.xml` exist and what they contain.
- [x] P0-05 Run Lighthouse (mobile) on home, writing index, one essay, clients. Save scores to `docs/audit-baseline.md`.

Acceptance: `docs/audit-baseline.md` exists and answers the four questions above. Stop and wait for owner review before Phase 1.

**P0 complete (2026-10-02).** Baseline: `docs/audit-baseline.md`. Awaiting owner review.

## 4. Phase 1: Tier C (content, metadata, SEO). No layout redesign.

### 4.1 Rendering and metadata

- [x] P1-01 Make every public route server-rendered or statically generated. No "Loading…" in initial HTML. Use server components and fetch on the server.
- [x] P1-02 Add a metadata system with `generateMetadata` per route.
  - Title template: `%s | Syed Baqir Ali`. Never repeat the site name twice.
  - Unique `description` per page, 120 to 155 characters.
  - Correct `og:title`, `og:description`, `og:url`, and `og:image` per page.
  - `alternates.canonical` on every page.
  - Remove the meta keywords tag.
- [x] P1-03 Align homepage title and tagline. Title: `Syed Baqir Ali | Practical Writing on AI and Software`. Tagline: `Practical notes on software, AI, and leading teams.`
- [x] P1-04 Add `app/sitemap.ts` (dynamic, from the API) and `app/robots.ts`.
  - *(Kept existing `/sitemap` and `/robots.txt` route handlers; extended with privacy + AI crawler comment.)*
  - Sitemap lists only indexable URLs with `lastModified`.
  - Robots allows all crawlers, including AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). Add a code comment so the owner can change this.
- [x] P1-05 Add `link rel="alternate" type="application/rss+xml"` in the head.

### 4.2 Slugs, redirects, and essay data

- [x] P1-06 Add a `slug` column (unique, not null) and run a migration. Do not delete the old slug. Store it in `legacy_slug`.
  - *(Monorepo: `SubTopic` + `EssayCatalogBootstrap`; unique index after bootstrap — see `Queries-p1b-essay-schema.sql`.)*
- [x] P1-07 Apply these new slugs and add 301 redirects from every old URL (in `next.config` redirects, generated from the DB if possible):
  - `why-ai-is-on-everyones-mind`
  - `why-decentralization-matters`
  - `supervised-learning-introduction`
  - `attention-bert-gpt-transformers-nlp`
  - `rust-safety-speed-concurrency`
  - `physical-ai-robotics`
  - `nlp-primer`
  - `evolution-of-ai-collective-intelligence`
  - `multimodal-ai-text-speech-video`
  - *(Frontend: `LEGACY_ARTICLE_PATHS` in `lib/articles.ts` + `next.config.ts`. Page also 301s any non-canonical param.)*
- [x] P1-08 Add post fields: `dek` (one-sentence summary), `tldr` (2 lines), `updated_at`, `canonical_url` (nullable), `og_image_url`, `noindex` (boolean), `series_id`, `series_order`, `tags`.
  - *(Uses existing Auditable `updateDate` as updated_at; `topicId` as series link; no separate `series_id` column.)*
- [x] P1-09 Rewrite essay titles that are weak. Example: "An Introduction" becomes "Supervised Learning: An Introduction". The title and H1 must match the series naming. Remove emoji from titles.
- [x] P1-10 Stub essay (Substack link-out): set `noindex = true` and exclude it from the sitemap until full content is imported. `TODO(owner): supply full text.`
- [x] P1-11 Replace dead `#` links in the Blockchain 101 list. Render published parts as links and unpublished parts as plain text, or remove them. Dead `#` links stripped from Why Decentralization Matters. No expansion planned unless owner adds more parts.
  - *(Bootstrap strips `href="#"` anchors to plain text on id 0.)*
- [x] P1-12 Fix "Related reading". Rank by shared series, then shared tags, then recency. Exclude the current post.
  - *(API: `GET /subtopics/v1/s/{id}/related`. Frontend: `relatedPosts` by topicId/tags.)*

**P1B note (2026-10-02):** Schema/API on `sba_backend_monorepo` branch `overhaul/p1b-essay-schema`. Frontend branch `overhaul/p1b-essay-schema`. Deploy API (bootstrap) before relying on DB slugs in production; FE catalog map covers the nine essays in the meantime.

### 4.3 Copy and links

- [x] P1-13 Remove cadence claims. Use "New essays as they publish." Apply on writing index, subscribe, and essay footer.
- [x] P1-14 Subscribe copy:
  - H1: `Get new essays by email`
  - Bullets: `New essays as they publish`, `AI, software systems, and engineering leadership`, `Unsubscribe anytime`
  - Button: `Subscribe`
  - Keep the RSS link as secondary.
- [x] P1-15 Header: remove public "Login". Move it to the footer as a small link.
- [x] P1-16 Links: replace the LinkedIn URL with the profile URL (`TODO(owner): confirm exact profile URL`). Change `twitter.com` to `x.com`. Give every icon or URL link a readable label. Keep Calendly. Drop Linktree from the footer.
- [x] P1-17 Writing index cards: remove the repeated title from the excerpt. Show title, `dek`, date, reading time. Remove "Read more".
- [x] P1-18 Clients page: one primary button `Book a 30 minute call` (Calendly). One secondary link `Contact`. Remove the LinkedIn and View Work buttons from the hero. Add Blox to featured work.
- [x] P1-19 Contact page: add a "Reason" select (`Project`, `Role`, `Question about writing`, `Other`). Add `TODO(owner): reply-time promise`.
- [x] P1-20 Add `/privacy` with a short plain-language policy covering contact form and newsletter data.

Acceptance for Phase 1:

- `curl` of home, writing index, one essay, and clients shows full content in HTML.
- Every page has a unique title, description, canonical, and correct OG URL.
- Old slugs return 301 to new slugs. No redirect chains.
- No em-dashes or en-dashes in any user-visible string. Check with `grep -rnP "\x{2014}|\x{2013}" app components content`.
- Lighthouse SEO is 100 on all four tested pages.

## 5. Phase 2: Tier B (layout and components). Keep the platform.

### 5.1 Homepage (reader first)

Order of sections:

1. Hero: H1 `Practical writing on AI, software, and leading teams.` Sub: `Researched essays for engineers and technical leaders.` Inline subscribe form (email field plus `Subscribe`). Microcopy: `Unsubscribe anytime.`
2. Latest essays: 3 cards with `dek`, date, reading time.
3. Start here: Evolution of AI and Collective Intelligence, NLP Primer, Rust (IDs 18, 16, 14). Editable later via P3-24.
4. Work with me strip: one sentence, one link to the clients page.
5. About snippet: photo, 2 sentences, link to About.

- [x] P2-01 Build the homepage in that order. No other sections.
  - *(Hero: H1 + sub + subscribe only, with clear subscribe panel separation. Latest, Start here, Work strip, About snippet. Quote and hero secondary CTAs removed.)*
- [x] P2-02 Build reusable components: `SubscribeForm` (variants: `hero`, `inline`, `footer`), `EssayCard`, `SeriesCard`, `AuthorBox`, `TldrBlock`, `SeriesNav`, `CredentialsStrip`, `CaseStudySummary`.

### 5.2 Writing index

- [x] P2-03 Add a "Start here" row (3 items) above the chronological list.
- [x] P2-04 Replace the topic filter with series and tag chips that link to real URLs. Keep search if it works. Remove anything that filters nothing.
- [x] P2-05 Show series as cards with count and description.

### 5.3 Essay page

- [x] P2-06 Header block: title, `dek`, byline (name and photo), published date, `Updated` date if different, reading time.
- [x] P2-07 `TldrBlock` under the header when `tldr` exists.
- [x] P2-08 Contents list: sticky on desktop, collapsible on mobile. Keep existing heading anchors.
- [x] P2-09 `SubscribeForm` inline variant after roughly the 40 percent point of the body (insert between H2 sections) and a full variant at the end.
- [x] P2-10 `SeriesNav` (previous, next, full list) when the essay is in a series.
- [x] P2-11 `AuthorBox` at the end: 2-sentence bio and link to About.
- [x] P2-12 Copy-link and LinkedIn share on essays. Full social clutter still avoided. `TODO(owner): wire essay likes when ready (API `/v1/likes` exists; no FE yet).`

### 5.4 Work and case studies

- [x] P2-13 Case study template: summary strip (Role, Timeline, Stack, Result), product mark, then Problem, Approach, Outcome. Role SWE/SME. Timelines: Blox 2024, Cobu 2025. `TODO(owner): one measurable result for Cobu and Blox when available.`
- [x] P2-14 Work index: card per project with mark, one-line result, stack tags.

### 5.5 About, hiring, clients

- [x] P2-15 About page: bio, photo, `CredentialsStrip`, and "For hiring managers" (`#hiring`) with LinkedIn profile link (not CV PDF).
- [x] P2-16 `CredentialsStrip` content (2-col pairs: left | right):
  - 25+ years in SWE and AI | Master of Artificial Intelligence, UNSW Sydney
  - PMP, PMI-ACP, PMI-PBA | AWS Certified AI Practitioner
  - Co-author on Amazon | Book reviewer, Manning Publications
  - Casual Academic, UNSW CS/IT
  - Shared brand-dot marker (no per-item icon set).
- [x] P2-17 Clients page: outcome-led service list, the 3-step process, 2 proof items (case studies), engagement via paid Calendly consultation.
- [x] P2-18 Remove the "Wrong path? Choose again" lines and the "Choose how to browse" block.

### 5.6 Visual system and accessibility

- [x] P2-19 Typography: body 18px / line-height 1.65, article max-width ~42rem, heading scale via display titles. Fonts via `next/font` (Outfit, Source Sans 3, Source Serif 4).
- [x] P2-20 Focus-visible rings on interactive elements; semantic color tokens for light/dark. (Spot-check contrast on new surfaces if needed.)
- [~] P2-21 Images: `next/image` with `sizes` / descriptive alt on portfolio and about. `TODO(owner): migrate any remaining Substack-hosted article media to S3/CloudFront.`
- [x] P2-22 `prefers-reduced-motion` respected globally (animations/transitions/scroll).
- [x] P2-23 Overflow-x clipped; primary CTAs and key links use min 44px tap targets (`min-h-11`).

Acceptance for Phase 2:

- Lighthouse mobile: Performance 90+, Accessibility 95+, SEO 100, Best Practices 95+ on the four tested pages.
- LCP under 2.5s, CLS under 0.1, INP under 200ms on the throttled mobile profile.
- axe-core reports no serious or critical issues on the tested pages.
- Each page has exactly one primary call to action.

## 6. Phase 3: Tier A (restructure and systems)

### 6.1 Information architecture

- Header: Writing, Work, About, Work with me, and a `Subscribe` button.
- Footer: Series, RSS, Contact, Privacy, social links, Login.
- Retire the three-path chooser.

- [ ] P3-01 Redirect `/for/clients` to `/work-with-me`, `/for/hiring` to `/about#hiring`, `/for/readers` to `/writing` (all 301). Update all internal links.
- [ ] P3-02 Series landing pages (`/writing/series/[slug]`): intro paragraph, ordered list, subscribe block.
- [ ] P3-03 Topic hubs (`/writing/topics/[tag]`): intro text, curated essays, related series. Only create hubs with 3 or more essays.
- [ ] P3-04 Optional, only if the owner confirms client work is a priority: one page per service under `/work-with-me/[service]`.

### 6.2 In-house newsletter (low cost)

Design goals: double opt-in, minimal data, cost near zero.

- [ ] P3-05 Table `subscribers`: `id`, `email` (unique, lowercase), `status` (`pending`, `confirmed`, `unsubscribed`), `confirm_token_hash`, `unsubscribe_token_hash`, `source_path`, `created_at`, `confirmed_at`, `unsubscribed_at`.
- [ ] P3-06 Endpoints:
  - `POST /api/subscribe`: validate, rate limit per IP, honeypot field, create or refresh `pending`, send confirmation email.
  - `GET /api/subscribe/confirm?token=`: set `confirmed`.
  - `GET /api/unsubscribe?token=` and `POST` for one-click unsubscribe.
- [ ] P3-07 Send mail with AWS SES. Include `List-Unsubscribe` and `List-Unsubscribe-Post` headers. Never log raw email addresses.
- [ ] P3-08 Admin-only endpoint or CLI task: send a published essay to confirmed subscribers in batches, with a dry-run flag.
- [ ] P3-09 Frontend: `SubscribeForm` uses a server action or route handler that calls the API. Show clear success ("Check your inbox to confirm"), error, and already-subscribed states. No page reload.
- [ ] P3-10 Instrument events: `subscribe_submit`, `subscribe_confirmed`, `cta_book_call_click`, `contact_submit`, `essay_read_50`.
- [ ] P3-11 Unit and integration tests for token handling, rate limiting, and status transitions.

### 6.3 Content pipeline

- Keep MySQL as the source of truth. Do not migrate to MDX now.
- [ ] P3-12 Fetch posts on the server with `revalidate = 3600` and cache tags.
- [ ] P3-13 Add `POST /api/revalidate` in Next.js, protected by a shared secret. Spring Boot calls it on publish or update.
- [ ] P3-14 Render markdown with a sanitizing renderer. Cover headings with anchors, code blocks, images with captions, and tables.
- [ ] P3-15 Add an export script `scripts/export-posts-to-mdx.ts` so content can move to MDX later if the admin UI is not worth maintaining.

### 6.4 Structured data and AI discoverability

- [ ] P3-16 JSON-LD components (server-rendered, one per page type):
  - `Person` on Home and About: `name`, `jobTitle`, `url`, `image`, `sameAs` (GitHub, LinkedIn, X), `knowsAbout`.
  - `WebSite` on Home. Add `SearchAction` only if site search exists.
  - `BlogPosting` on essays: `headline`, `description`, `datePublished`, `dateModified`, `author`, `image`, `mainEntityOfPage`, `articleSection`, `keywords`.
  - `BreadcrumbList` on all nested pages.
  - `ProfessionalService` on the clients page. No fake ratings or reviews.
  - `CreativeWork` or `SoftwareApplication` on case studies.
- [ ] P3-17 `/llms.txt` route handler (generated): one-paragraph site summary, key pages, series list, and every essay with its `dek`. Low cost. Adoption by AI systems is unproven, so do not expect results from this alone.
- [ ] P3-18 RSS: full-text `content:encoded`, `updated`, and correct author. Validate the feed.
- [ ] P3-19 Essay writing pattern (document in `docs/writing-guide.md`):
  - Answer first. State the main point in the first 2 sentences.
  - Question-style H2s where natural.
  - Define terms in one sentence on first use.
  - Link to the series and 2 related essays in the body.

### 6.5 Infrastructure and performance

- [ ] P3-20 Put CloudFront in front of EC2. Enable Brotli and gzip. Cache `/_next/static/*` as immutable. Cache HTML with `s-maxage` and `stale-while-revalidate`. `TODO(owner): create distribution and update DNS.`
- [ ] P3-21 Add security headers in `next.config`: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a conservative `Content-Security-Policy`.
- [ ] P3-22 Add a Docker `HEALTHCHECK` for Next.js and Spring Boot.
- [ ] P3-23 Analytics: Google Search Console (free) plus one cookieless tool. Prefer self-hosted Umami on the existing EC2 host. Do not add paid analytics.

Acceptance for Phase 3:

- Rich Results Test passes for `BlogPosting` and `Person`. Schema validator shows no errors.
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, and `/feed.xml` all return 200 and validate.
- Double opt-in flow works end to end on staging with a real SES sandbox address.
- Crawl of the site (for example `npx linkinator https://staging-host --recurse`) finds zero broken internal links.
- All Phase 2 Lighthouse and Core Web Vitals targets still pass.

### 6.6 Admin panel (ops and layout)

Extend the existing `/admin` surface (auth-gated, already disallowed in `robots.txt`). Prefer server actions or Spring Boot admin APIs behind the same session. No public UI for these controls.

Goals: replace hard-coded owner picks (for example Start here IDs) with editable config; manage subscribers and users without SSH; keep GitHub and deploy ops visible without leaving the site.

- [ ] P3-24 Site layout / homepage config:
  - Choose and order the 3 "Start here" essays or series (store slugs or IDs in DB or a `site_settings` table).
  - Optional: featured work order, homepage about blurb override.
  - Preview before publish. Invalidate Next.js cache on save (`revalidate` tag).
- [x] P3-25 Content ops (streamline `/editor` + admin essay/series tools):
  - Essay workflow: draft, publish, unpublish, schedule publish (`publishDate` in future + unpublished; Spring `@Scheduled` job). Preview button opens essay route (cache-busted query).
  - Essay metadata: `noindex`, slug, `dek`, `tldr`, tags, series membership and `series_order`.
  - Series CRUD: add, update, rename (and slug via name), publish flag. UI at `/admin/series`.
  - Editor body: free TipTap (self-hosted). TinyMCE Cloud API key removed.
  - Stub / Substack link-out flag (`noindex`).
  - On save/publish: call Next.js `/api/revalidate` + `RefreshOnBack` so browser Back is not stale.
  - Edit link + editor save: admin only (username `admin` or `NEXT_PUBLIC_ADMIN_EMAILS`; later ROLE_ADMIN).
- [ ] P3-26 Users:
  - List accounts, roles (reader / editor / admin), disable or reset access.
  - Audit last login. No plaintext passwords in logs or UI.
- [ ] P3-27 Subscribers (depends on P3-05 to P3-09):
  - List by status (`pending`, `confirmed`, `unsubscribed`). Search by email hash or last-4 local-part only if needed for support.
  - Resend confirmation, force unsubscribe, export count by day (not raw emails by default).
  - Trigger "send latest essay to confirmed" with dry-run (ties to P3-08).
- [ ] P3-28 GitHub and deploy ops (read-mostly; no force-push from UI):
  - Links to frontend and monorepo repos, open PRs, and latest Actions runs (CI / Deploy).
  - Show last successful deploy SHA and health URL status.
  - Optional: "open compare" deep link to GitHub. Do not store PATs in the browser; use server-side GitHub App or fine-scoped token in secrets.
- [ ] P3-29 Admin IA: sidebar sections `Layout`, `Essays`, `Users`, `Subscribers`, `GitHub`, `Quotes` (existing). Mobile usable. Confirm destructive actions.

Acceptance for admin panel:

- Unauthenticated requests to `/admin/**` redirect to login.
- Changing Start here updates the homepage after revalidation without a redeploy.
- Subscriber list never logs full emails in application logs.
- GitHub panel fails closed if the token is missing (shows setup instructions, not a stack trace).

## 7. Owner actions (you must supply or decide these)

Items Cursor cannot invent. Until you answer, the site keeps a `TODO(owner): …` placeholder or safe interim copy.

### Still required

| Need | Why | What to send |
| --- | --- | --- |
| Cobu / Blox measurable result | Outcome credibility | One real number or concrete outcome each when you have them |
| Essay likes | Reader engagement | Confirm you want like counts on essays; FE not wired yet (backend `/v1/likes` exists) |
| SES production + DNS | In-house newsletter (P3 infra) | Request SES production access; add SPF, DKIM, DMARC |
| CloudFront + DNS | CDN / perf (P3 infra) | Create distribution; point DNS |
| Search Console | Discoverability (P3 infra) | Verify property; submit sitemap |
| Substack image migration | P2-21 | Host article images on your S3/CloudFront instead of Substack URLs |

### Done or no longer blocking

- Role on Cobu / Blox: SWE / SME. Timelines: Blox 2024, Cobu 2025.
- Hiring CTA: LinkedIn profile. Confirmed URL with trailing slash.
- Credentials (2-col order): 25+ years SWE/AI | Master of AI; PMP suite | AWS AI; Co-author | Book reviews; Casual Academic.
- Start here: Evolution of AI, NLP Primer, Rust.
- Cadence: weekly. Contact: reply within 24 hours. Substack stub: keep + link, `noindex`.
- Clients engagement: paid consultation booked on Calendly.
- Essay engagement: LinkedIn share + copy link on essay pages.
- Blockchain 101: this is the **Blockchain** series intro essay **Why Decentralization Matters** (`/writing/why-decentralization-matters`). It used to list ~20 follow-on pieces as dead `#` links. Those `#` links were stripped in P1. No further owner decision unless you want to publish more parts or change the series copy.
- P2 layout: merged and deployed (per owner).

### What "P3 infra" means

Phase 3 section **6.5 Infrastructure and performance** (and related DNS/email setup). Not app features. Specifically:

- **SES + SPF/DKIM/DMARC** so the in-house newsletter can send real confirmation and essay emails.
- **CloudFront in front of EC2** for caching static assets and HTML (speed, TLS edge).
- **Security headers** in Next.js config (HSTS, CSP, etc.).
- **Docker HEALTHCHECK** for Next and Spring Boot.
- **Search Console** (and optional cookieless analytics like Umami).

Admin panel, redirects, and subscribe APIs are also Phase 3, but "P3 infra" usually means the AWS/DNS/CDN/email ops items above that only you can complete in the AWS console and DNS.

## 8. Final verification checklist

- [ ] Homepage HTML contains the hero, latest essays, and subscribe form without JavaScript.
- [ ] No page has a duplicate title or description.
- [ ] Every essay has `dek`, canonical, JSON-LD, series navigation (if in a series), and two subscribe prompts.
- [ ] No dead links, no `#` placeholder links, no em-dashes or en-dashes in visible copy.
- [ ] Images are served at appropriate sizes with alt text.
- [ ] Old URLs redirect with a single 301.
- [ ] Analytics events fire and appear in the dashboard.
- [ ] `docs/audit-baseline.md` is updated with before and after scores.