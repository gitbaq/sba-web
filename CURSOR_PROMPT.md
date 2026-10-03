# Cursor Master Prompt: syedbaqirali.com

This file supersedes `SITE_OVERHAUL.md`. Keep that file only as history.

## 1. Your job

You are the lead engineer for this site. Turn section 6 into tracked tasks, then build them phase by phase, highest value first.

Do this in order:

1. Read this file and `.cursor/rules/site-overhaul.mdc`.
2. Inspect the repo. Write `docs/audit-baseline.md`: every route, its rendering mode (static, ISR, dynamic), revalidate settings, cache headers, data sources, and the shared layout.
3. Create `docs/TASKS.md` with one row per task in section 6: ID, phase, title, status (`todo`, `doing`, `done`, `blocked`), branch or PR, notes. Ask the owner whether to also create GitHub issues. Do not create them without a yes.
4. Present a short plan for Phase 1 and the baseline findings. Stop. Wait for the owner to approve.
5. Build one phase per branch and PR. At the end of each phase, run the verification protocol (section 5), update `docs/TASKS.md`, and stop for owner review before starting the next phase.

## 2. Operating rules

- Fix problems at the template, data, or pipeline level. Never patch a single essay or page by hand. Every task applies to all content: essays, series, case studies, static pages, and future content.
- Never invent facts: metrics, testimonials, client names, dates, or credentials. Use a visible `TODO(owner): <what is needed>` placeholder.
- Decisions that change scope, cost, or public claims go to the owner. List them in your phase report. Do not assume.
- No paid third party services. Free tiers and AWS services already in use are allowed.
- No em-dashes or en-dashes in any visitor-facing string, comment, or doc. Use periods, commas, colons, or hyphens.
- Visitor copy must be plain and concrete. No filler, no developer or admin voice, no claims the site cannot keep.
- Add tests or a check in `scripts/verify-live.mjs` for every rule you introduce, so regressions are caught.
- Small commits named by task ID, for example `P1-03: keep shared layout static`.
- Never delete data. Use migrations that keep legacy values.

## 3. Product context

- Owner: Syed Baqir Ali. Site: https://www.syedbaqirali.com.
- Audience priority: 1) readers of his writing, 2) clients seeking services, 3) hiring managers.
- Primary conversion: email subscribers. Secondary: booking a 30 minute call (Calendly).
- Voice: professional, plain, concrete, short sentences.
- Stack: Next.js (App Router), Spring Boot API, MySQL on AWS RDS, EC2 with Docker. Essays live in MySQL. Keep MySQL as the source of truth.

## 4. Verified live state (checked 2026-10-03)

Live with the new design:

- Homepage: server-rendered hero, subscribe form, latest essays, start-here row, work strip, about snippet. New title and metadata.
- Subscribe page, Contact page (reason selector, 24 hour reply promise), Work index, Blox case study (role, timeline, stack, result).
- Rust essay: TL;DR, mid-article and end subscribe forms, H2 body headings, correct dates, privacy link, footer Projects block.

Still on the old version:

- Writing index (old slugs and titles, repeated excerpts, "About one piece a week", "Get Weekly Insights", dead topic filter, Substack stub first).
- About page ("Choose how to browse", no bio), Clients page (four buttons, "Wrong path?", discovery-URL LinkedIn link, only Cobu).
- Decentralization essay (false "Updated Oct 2, 2026", "New essays weekly", body H1s, no mid-article form).
- Substack stub essay (indexable, old slug, Substack-hosted image).
- RSS feed: `lastBuildDate` stuck at Oct 2 06:33 GMT, truncated descriptions, no full text.

Rendering evidence: the Rust essay and Blox pages put `callbackUrl` in the footer Login link, so they render dynamically. Stale pages use a plain `/login`, so they are static or cached. Treat this as a hypothesis and confirm it in P1-01.

New defects found:

- Blox case study uses the homepage `og:title`, `og:url`, and `og:description`.
- Home shows the Rust essay in both "Latest essays" and "Three places to begin".
- Home shows admin-voice copy: "Updated from admin when needed."
- Work page says Cobu is "still maturing toward full capability". This weakens client confidence.
- Footer names Cobu "AI RAG Agent" while Work calls it an "AI brainstorm buddy".
- Footer Projects block links to a Substack blog, a competing signup.
- Blox "Stack" lists skills, not technologies. "Result" restates the summary. No metrics.
- The subscribe forms show a "Website" field in the text output. Confirm it is a hidden honeypot.

Not verified (could not reach or see): sitemap, robots.txt, llms.txt, JSON-LD, response headers, Lighthouse scores, `/work/cobu`, `/for/hiring`, series pages, privacy page, and whether the subscribe flow sends mail.

## 5. Verification protocol (run at the end of every phase)

Production is cached. A query string does not bypass the Next.js server cache. Never judge a task done from a cached page.

1. Revalidate all routes (P1-02). Confirm with `curl -sI <url>` that `x-nextjs-cache` is not `STALE` and that any CDN invalidation completed.
2. Run `node scripts/verify-live.mjs <base-url>`. It reads the sitemap (or a route list) and checks every URL for:
   - status 200 and no redirect chains
   - unique title and description
   - canonical equals `og:url`
   - exactly one H1
   - no "Loading" text in the initial HTML
   - no banned phrases (weekly claims, "Read more", "Wrong path", admin-voice text)
   - no em-dashes or en-dashes in visible text
   - JSON-LD parses (after Phase 4)
3. Sample at least one URL of each content type: essay, series, case study, static page, listing.
4. Run Lighthouse (mobile) on home, one essay, one case study, and the clients page.
5. Record results in `docs/TASKS.md` under the phase.

## 6. Phases and tasks (highest value first)

### Phase 1: Foundation and consistency
Value: every fix reaches every visitor. Today 5 pages are new and 6 are stale.

- [ ] P1-01 Baseline audit. Write `docs/audit-baseline.md` and confirm why some pages are stale (cache, static generation, or unmigrated code).
- [ ] P1-02 Revalidation. Revalidate all routes on deploy and on publish. Set explicit `revalidate` times. Use tags for lists and detail pages. Add a protected `/api/revalidate` that Spring Boot calls on publish or update.
- [ ] P1-03 Keep the shared layout static. Do not read headers, cookies, or search params in the layout. Remove `callbackUrl` from the footer Login link, or resolve it on the client. Public pages should be cacheable.
- [ ] P1-04 One shared shell. Header, footer, nav, social links, and the Projects list come from one config. Fix every page to use the LinkedIn profile URL, `x.com`, labelled links, no Linktree, and Login only in the footer. Use consistent project names.
- [ ] P1-05 Server-render every public route. No "Loading…" state. No client-only fetch of page content.
- [ ] P1-06 Central metadata helper for every route type (website, article, project). It sets: title template (`%s | Syed Baqir Ali`, never a doubled brand), unique description (120 to 155 characters), canonical, and matching `og:title`, `og:description`, `og:url`, `og:image`, and Twitter tags. Remove the meta keywords tag. Fix the Blox route that inherits homepage tags.
- [ ] P1-07 Create `scripts/verify-live.mjs` as described in section 5 and an npm script. Run it in CI.

Exit: all content types render the new shell, one metadata system, no stale pages after a deploy.

### Phase 2: Trust and content integrity
Value: removes false or confusing signals. Cheap and visible.

- [ ] P2-01 Remove claims the site cannot keep ("about one piece a week", "weekly", "Get Weekly Insights"). Use one copy constant: "New essays as they publish."
- [ ] P2-02 Real dates only. Published and updated dates come from data. Migrations and backfills never change `updated_at`. Show "Updated" only when the content actually changed after publish.
- [ ] P2-03 Unfinished content. Series with unpublished parts label them "Planned". Link only live pages. Show no dates for planned items.
- [ ] P2-04 Single source of truth for series and tags. Index chips, series pages, essay labels, and RSS categories use the same query. Counts must agree. Owner decides whether "Opinion" is a real series.
- [ ] P2-05 Permanent URL rule. Descriptive slugs, no numeric suffixes, unique. All internal links use the `slug` field. Old URLs return one 301 to the new URL. Fix the writing index and stub, which still link to old slugs.
- [ ] P2-06 External or imported content. For the Substack stub: import the full text, or set `noindex` and exclude it from the sitemap and feed. No page may exist only to send readers elsewhere.
- [ ] P2-07 No foreign-hosted assets. Copy images to your own S3 bucket behind the CDN. `og:image` must be on your own domain.
- [ ] P2-08 Remove admin and developer voice from visitor copy (for example "Updated from admin when needed."). Audit all strings.
- [ ] P2-09 No duplicate blocks on a page. A content item must not appear in both "Latest" and "Start here". Add a dedupe rule.
- [ ] P2-10 Remove meta-navigation fluff ("Wrong path? Choose again", "Choose how to browse").
- [ ] P2-11 Copy that undermines confidence. Replace "still maturing toward full capability" with an honest, confident status such as "in active development". Owner approves wording.
- [ ] P2-12 Copy lint. Add banned-phrase and dash checks to `verify-live.mjs`.

Exit: no false claims, no dead or planned links shown as live, series and tags agree everywhere.

### Phase 3: Reader and subscriber growth (primary conversion)
Value: grows the audience that matters most.

- [ ] P3-01 Verify the subscribe flow end to end: submit, confirmation email, confirm, unsubscribe. Build what is missing:
  - Table `subscribers`: `id`, `email` (unique, lowercase), `status` (`pending`, `confirmed`, `unsubscribed`), token hashes, `source_path`, timestamps.
  - Endpoints: `POST /api/subscribe`, `GET /api/subscribe/confirm?token=`, `GET` and `POST /api/unsubscribe`.
  - Double opt-in, rate limit per IP, AWS SES, `List-Unsubscribe` and `List-Unsubscribe-Post` headers. Never log raw emails.
  - Tests for tokens, rate limiting, and status transitions.
- [ ] P3-02 One `SubscribeForm` component with variants (hero, inline, end, footer) and one copy source. Place it in the homepage hero, mid-content, end of content, and the subscribe page.
- [ ] P3-03 Form quality. Honeypot hidden from users and assistive tech (`aria-hidden`, `tabindex="-1"`, off-screen). Labelled fields. Clear states: success ("Check your inbox to confirm"), error, already subscribed, pending.
- [ ] P3-04 Welcome email with three best essays, driven by config.
- [ ] P3-05 Events: `subscribe_submit`, `subscribe_confirmed`, `cta_book_call_click`, `contact_submit`, `essay_read_50`. Use a free tool (self-hosted Umami or similar).
- [ ] P3-06 One long-form page anatomy, at template level, for every essay and case study: one H1, dek, TL;DR, byline, dates, read time, contents list, H2 and H3 body headings (demote imported H1s), then an end block (subscribe, author box, series nav, related).
- [ ] P3-07 Reading layout: body 18 to 20px, line height 1.6 to 1.7, line length 60 to 75 characters, clear heading scale, code block styles. WCAG AA contrast in both themes.
- [ ] P3-08 Topical related content: same series, then shared tags, then recency. Exclude the current item. Show fewer rather than unrelated items.
- [ ] P3-09 Series navigation (previous, next, full list) and series landing pages with an intro and ordered list.
- [ ] P3-10 Listing pages: each card shows title, dek, date, read time. Remove repeated text and "Read more". Show filters only if they filter something. Add a "Start here" row. Paginate above 20 items.
- [ ] P3-11 Homepage rules: one primary action (subscribe), then latest, start here, a work strip, and an about snippet. No duplicates.
- [ ] P3-12 Site search using MySQL FULLTEXT or Pagefind (both free).
- [ ] P3-13 Topic hubs at `/writing/topics/[tag]`, only for tags with 3 or more items.

Exit: a visitor can read, understand, and subscribe on any page. Subscribe works end to end.

### Phase 4: Search and AI discoverability
Value: brings new readers and makes the site easy for AI tools to cite.

- [ ] P4-01 Dynamic `sitemap.ts`: only indexable URLs, `lastModified` from real content changes.
- [ ] P4-02 `robots.ts`: allow all crawlers, including AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). Add a comment so the owner can change it.
- [ ] P4-03 Generated `/llms.txt`: site summary, key pages, series, and every essay with its dek. Adoption is unproven. Keep it low cost.
- [ ] P4-04 JSON-LD per page type, server-rendered: `Person`, `WebSite`, `BlogPosting`, `BreadcrumbList`, `ProfessionalService`, and project markup. Include `sameAs`. No fake ratings or reviews.
- [ ] P4-05 RSS: full text in `content:encoded`, dek as description, categories from the single source, correct `lastBuildDate` (newest item date), and no stale caching.
- [ ] P4-06 Write `docs/writing-guide.md`: answer first in two sentences, question-style H2s where natural, define terms once, link to the series and two related items.
- [ ] P4-07 Internal linking rules: visible breadcrumbs plus matching JSON-LD, contextual links in the body.
- [ ] P4-08 Dynamic social images with `next/og` per content type.
- [ ] P4-09 Owner: verify the site in Google Search Console and submit the sitemap.

Exit: Rich Results Test passes, sitemap, robots, llms.txt, and feed return 200 and validate.

### Phase 5: Clients (second priority audience)
Value: turns readers into enquiries.

- [ ] P5-01 One primary action on the clients page: "Book a 30 minute call". One secondary link: Contact. Remove the rest from the hero.
- [ ] P5-02 Outcome-led services. For each: who it is for, the problem, what you deliver, typical timeline. Replace generic labels.
- [ ] P5-03 Case-study template for all projects: role, timeline, stack (technologies only), result, hero screenshot, problem, approach, outcome with a measurable result or explicit qualitative proof. `TODO(owner): metrics for Cobu and Blox.`
- [ ] P5-04 Show every project (Cobu and Blox) on Home, Work, and Clients with consistent names and one-line results.
- [ ] P5-05 Proof: testimonials or LinkedIn recommendations block, plus an engagement model or pricing signal. `TODO(owner)`.
- [ ] P5-06 Contact: keep the reason selector and route by reason. Add spam protection (Cloudflare Turnstile, free). Obfuscate the email address. Keep the 24 hour reply promise only if the owner confirms it.
- [ ] P5-07 Optional, if the owner confirms: one page per service at `/work-with-me/[service]`.

Exit: every client path leads to one clear booking action and visible proof.

### Phase 6: Hiring managers
Value: lowest priority audience, small effort for a clear profile.

- [ ] P6-01 About page: real bio, photo, credentials strip, and teaching. Owner approves wording before publish. `TODO(owner)`.
- [ ] P6-02 Downloadable CV and a short timeline in a "For hiring managers" section (`#hiring`). `TODO(owner): CV PDF.`
- [ ] P6-03 Simplify navigation: Writing, Work, About, Work with me, and a Subscribe button. Retire the `/for/*` chooser with 301 redirects (`/for/clients` to `/work-with-me`, `/for/hiring` to `/about#hiring`, `/for/readers` to `/writing`).

Exit: a hiring manager finds credentials, a CV, and contact within two clicks.

### Phase 7: Performance, accessibility, security
Value: quality that supports every earlier phase.

- [ ] P7-01 Images: correct `sizes` on every `next/image`, small avatars (about 40px, never 3840px), `priority` only on the LCP image, descriptive alt text on every image, CDN delivery.
- [ ] P7-02 Put CloudFront in front of EC2: Brotli and gzip, immutable cache for `/_next/static/*`, HTML with `s-maxage` and `stale-while-revalidate`, invalidation on deploy. `TODO(owner): create the distribution.`
- [ ] P7-03 Targets on mobile: LCP under 2.5s, CLS under 0.1, INP under 200ms, Lighthouse 90 or higher.
- [ ] P7-04 Accessibility: WCAG AA, visible focus, skip link, labelled links, `prefers-reduced-motion`, tap targets of 44px or more, axe-core with no serious issues.
- [ ] P7-05 Security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, a conservative `Content-Security-Policy`.
- [ ] P7-06 Docker `HEALTHCHECK` for Next.js and Spring Boot.

### Phase 8: Measurement and operations

- [ ] P8-01 Privacy page matches reality: contact form fields (including the reason selector), newsletter data, and analytics.
- [ ] P8-02 Free uptime and error monitoring (UptimeRobot, Sentry free tier).
- [ ] P8-03 Admin view: subscriber count, confirmation rate, top signup pages.
- [ ] P8-04 Post-deploy checklist automated: revalidate, run `verify-live.mjs`, Lighthouse, redirect tests.

## 7. Owner decisions and inputs (Cursor cannot do these)

- Approve each phase plan and each phase result.
- Decide: cadence wording, "Opinion" series, Substack footer link, Cobu status wording, Cobu footer name.
- Supply: full text of the Substack stub essay, case-study metrics, testimonials, CV PDF, credentials wording, engagement model or pricing signal.
- Set up: SES production access and DNS (SPF, DKIM, DMARC), CloudFront, Search Console, analytics host.

## 8. Backlog (not scheduled)

- Free PDF primer from a series as a signup incentive.
- Public archive of sent newsletter issues.
- Teaching and workshops page.
- Cross-posting workflow to Substack and LinkedIn with a canonical link back.
- Print-friendly essay view.
