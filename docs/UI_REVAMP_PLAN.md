# UI Revamp Plan — syedbaqirali.com

**Status:** Phase 0–5 + **V** complete.  
**Last updated:** 2026-09-30  
**Site:** https://www.syedbaqirali.com  
**Repo:** `sbaweb_frontend` (Next.js App Router)

---

## 1. Goals

1. Personal brand revamp with a modern (2026+) editorial look.
2. Make newer research writing easy to find and clearly highlighted.
3. Separate journeys for hiring managers, clients, and learners/readers.
4. Preserve content quality posture: thorough, research-based, in-depth, easy to understand.
5. Accessibility-first (WCAG 2.2 AA target); subtle motion only.
6. Mobile experience equal in quality to desktop.

**Primary CTA ladder (sitewide):** Subscribe → Read → Socials (LinkedIn first).

---

## 2. Current main pages (inventory)

### Public

| Route | Role today |
| --- | --- |
| `/` | Home: amber hero, subscribe sheet, 4 service cards, desktop “AI Blogs” right rail |
| `/about` | Bio + socials + Portfolio (Blox carousel only) |
| `/contact` | Contact form |
| `/learning` | Learning Hub search; weak empty state (“0 articles found” until search) |
| `/learning/[id]` | Long-form article (HTML, share bar, OG/JSON-LD) |
| `/profile/[id]` | Subscriber profile after join |

### Auth / ops (keep; de-emphasize in public IA)

| Route | Role |
| --- | --- |
| `/login`, `/signup`, `/forgotpassword`, `/logout` | Auth |
| `/editor/[subId]`, `/admin`, `/admin/quotes` | CMS / admin |
| `/sitemap`, `/robots.txt` | SEO plumbing |

### Navigation reality

- Desktop top nav: Home / About / Contact (**Writing/Learning missing**).
- Content discovery lives mainly in the left sidebar + mobile overflow.
- Shell is sidebar-first (app/dashboard feel vs personal research brand).

### Notable UX / a11y gaps

- Home sells services; latest writing is not the hero.
- One generic home; no audience routing.
- Portfolio nested under About; thin (one product carousel).
- Visual language: Inter, amber/cyan cards, glow cards — not DeepMind/Anthropic calm editorial.
- `viewport.userScalable: false` harms accessibility.
- Learning index empty state hurts first impression.

---

## 3. Approved information architecture

```text
/                     → First visit: audience picker; returning: brand home
/writing              → Blog/research index (public name: Writing)
/writing/[slug]       → Article (migrate from /learning/[id] when ready)
/work                 → Portfolio / case studies (separate from Writing)
/for/hiring           → Hiring-manager home
/for/clients          → Client home
/for/readers          → Learner/reader home
/about                → Story, principles, credibility
/contact              → Contact (+ Calendly/LinkedIn secondary)
/subscribe            → Dedicated subscribe (and/or modal + page)
```

- Keep `/learning/*` working via **redirects** during transition.
- Public nav target: **Writing · Work · About · Contact · Subscribe** (audience links secondary or first-visit).
- Retire always-on public sidebar; keep compact nav/sidebar for authenticated editor/admin only.

### First-visit behavior (D22)

1. First-time visitors see an **audience chooser** (Hiring / Clients / Readers) before or as the primary first-viewport action.
2. Choice stored in a local preference (e.g. `localStorage`).
3. Returning visitors land on brand home: Subscribe → latest Writing → socials, with remembered path available.

---

## 4. Visual system (direction)

| Token | Decision |
| --- | --- |
| Personality | Warm/human → technical/precise → calm/minimal → light luxury; avoid loud editorial |
| Theme | Light-first; full dark + system via existing `next-themes` |
| Typography | Replace Inter: expressive display + highly readable body for long research. Exact pair chosen in Phase 0. |
| Color | Soft warm neutrals + one precise accent (not amber carnival; not purple-AI cliché). Deep charcoal text. |
| Layout | Full-bleed brand/atmosphere on home; **no card grids in hero**; cards only where interaction needs them |
| Motion | Subtle section enter + link underlines; respect `prefers-reduced-motion` |
| References | [DeepMind](https://deepmind.google/), [Anthropic](https://www.anthropic.com/), top AI/ML blogs — adapted to personal brand, not lab clone |

---

## 5. Page-by-page UX

### Brand home `/` (returning visitors)

First viewport:

- Brand name as hero-level signal
- One positioning line (research depth, easy to understand)
- CTA triad: **Subscribe** · **Read latest** · LinkedIn
- Dominant visual plane (not service cards)

Below fold:

- **Latest** — 3–5 newest posts; “New” for &lt;14 days
- Soft recall of chosen audience path
- Optional featured case study teaser → `/work`

### First-visit audience picker

Three calm paths (not glow cards):

| Path | Job | Content focus |
| --- | --- | --- |
| `/for/hiring` | Credibility + fit | Leadership/architecture writing, experience narrative, LinkedIn, contact |
| `/for/clients` | Outcomes + trust | Services as outcomes, work samples, subscribe, contact/Calendly |
| `/for/readers` | Learn deeply | Series/topics, latest posts, subscribe, “Start here” |

### Writing `/writing`

- Default: **newest first** (no empty “0 articles” without search)
- Filters: topic/series, reading time, featured
- List: large title, deck, date, topic chip (Anthropic “Latest releases” energy)
- Article: comfortable measure, TOC for long pieces, series nav, end CTA (subscribe + related + LinkedIn)

### Work `/work`

- Case studies: problem → approach → outcome → stack
- Start with Blox; structure ready for more products without conflating with weekly Writing cadence

### About / Contact

- About: principles + bio; links to Work and Writing
- Contact: short form + socials; no emoji-primary buttons

---

## 6. High-value additions

1. RSS + email digest (weekly cadence made tangible)
2. “New this week” on home + Writing index
3. Series / topic hubs (map existing `Topic` / `SubTopic`)
4. Reading time + depth cue (“~18 min · deep dive”)
5. “Start here” curated list for new readers
6. Slug URLs (`/writing/my-slug`) — `slug` already on `SubTopic`
7. Subtle article progress + sticky subscribe (a11y-safe)
8. WCAG pass: pinch-zoom, focus rings, contrast, skip-link, reduced motion
9. Optional later: short “lab notes” vs long research — only if cadence needs it

---

## 7. Phased delivery

| Phase | Scope | Outcome | Code status |
| --- | --- | --- | --- |
| **0** | Design tokens, type, light/dark, a11y baseline | Visual foundation | **Done** (2026-09-29) |
| **0.5** | Upgrade to **latest Next.js** and project dependencies (align `@next/third-parties` / `eslint-config-next` with `next`; bump React types, Tailwind/tooling, Radix, etc. within compatibility) | Modern, supported toolchain before IA rebuild | **Done** (2026-09-29) — `next@16.3.7`, `react@19.3.0`; see notes below |
| **1** | Audience picker + new home + nav + latest Writing surface | Newer content highlighted; first-visit routing | **Done** (2026-09-29) |
| **2** | Writing index/article redesign + `/learning` redirects | Modern research-blog UX | **Done** (2026-09-29) |
| **3** | `/work` + audience homes | Separate journeys | **Done** (2026-09-29) |
| **4** | Subscribe/RSS polish + series hubs | Retention & habit | **Done** (2026-09-29) |
| **5** | **Complete SEO + Google Analytics + LLM / AI-search optimization** (after Phases 3–4 UI are done) | Discoverability in Google, Analytics fidelity, and AI/LLM citation readiness | **Done** (2026-09-30) |
| **V** | **Craft-minimal visual polish** (type scale, hairlines, soft elevation, restrained motion) | Less flat; precise presence without loud decoration | **Done** (2026-09-30) |

**Rule:** No implementation until categorical approval for that phase (or an explicit “start Phase N”).

**Stack note (Phase 0.5):** Completed. Key versions: `next@16.3.7`, `react@19.3.0`, `@next/third-parties@16.3.7`.

**Deferred majors — Done (2026-09-30):** Tailwind CSS 4.3, Zod 4.6, TypeScript 7 (CLI via `@typescript/native`; TS6 API aliased as `typescript` for eslint), ESLint 10 flat config, `@daypicker/react` 10.

### Phase 5 scope — **Done** (2026-09-30)

**SEO**
- Sitewide `metadataBase`, Open Graph / Twitter defaults in root layout (`lib/seo.ts`)
- Article OG + canonical + Article / BreadcrumbList JSON-LD; Person + WebSite on all pages
- Sitemap: writing, series hubs, work case studies, `/for/*`, subscribe, contact, llms
- `robots.txt` with Search Console via optional `NEXT_PUBLIC_GSC_VERIFICATION`
- Legacy `/learning` → `/writing` redirects retained

**Google Analytics**
- GA4 `G-8EVK1ZF0L8` + Vercel Analytics / Speed Insights audited (still wired)
- Events: subscribe, audience_select, cta_click, article_read_depth, contact_submit — see `docs/ANALYTICS.md`
- Consent CMP deferred (document only) until region traffic requires it

**LLM & AI-search**
- `/llms.txt` + `/llms-full.txt` (brand, series, work, abstracts, citation policy)
- Author/entity signals via Person schema + About
- AI crawlers allowed (GPTBot, ClaudeBot, Google-Extended, PerplexityBot); Bytespider blocked
- RSS `/feed.xml` retained for aggregators

---

## 8. Decision log

| ID | Decision | Status |
| --- | --- | --- |
| D1 | Primary goal = personal brand revamp; highlight newer content | Confirmed |
| D2 | Separate homes for hiring managers, clients, learners/readers | Confirmed → `/for/*` |
| D3 | Content posture = thorough research, in-depth but understandable | Confirmed |
| D4 | Personality: warm/human → technical/precise → calm/minimal → luxury → bold | Confirmed |
| D5 | Theme: light-first; dark + system must work | Confirmed |
| D6 | Visual system may be redefined (logo/colors/type open) | Confirmed |
| D7 | References: DeepMind, Anthropic, top AI/ML blogs | Confirmed |
| D8 | Portfolio and blog = separate sections | Confirmed → `/work` + `/writing` |
| D9 | CTA order: subscribe → read → socials | Confirmed |
| D10 | Content baseline = current site + ~1 researched post/week | Confirmed |
| D11 | Accessibility-first (WCAG); subtle motion only | Confirmed |
| D12 | Mobile quality = desktop quality | Confirmed |
| D13 | Open to high-value stack/UX additions | Confirmed |
| D14 | Rename Learning Hub → **Writing** publicly; keep `/learning` redirects | **Accepted** |
| D15 | Retire public always-on sidebar shell; editorial top-nav site | **Accepted** |
| D16 | Home hero = brand + one line + CTA triad; no service-card hero | **Accepted** |
| D17 | Move service cards off home into `/for/clients` (as outcomes) | **Accepted** |
| D18 | Prefer slug-based article URLs when implementing | **Accepted** |
| D19 | Target WCAG 2.2 AA; fix `userScalable: false` | **Accepted** |
| D20 | No code until categorical approval | Confirmed |
| D21 | Decision log in chat + this `docs/UI_REVAMP_PLAN.md` | Confirmed |
| D22 | First-time visitors **pick audience first**; returning get brand home | **Accepted** |
| D23 | Public content label = **Writing** | **Accepted** |
| D24 | Type: **Newsreader** (display) + **Source Sans 3** (UI) + **Source Serif 4** (articles) | **Superseded by D41** |
| D25 | Accent: **navy ink + steel** — cool gray-white paper, deep navy `--brand`, soft gold `--spark` for “New” only (supersedes warm-paper teal / ink+signal teal) | **Accepted** |
| D26 | Viewport allows zoom; `colorScheme: light dark`; skip-link → `#main-content` | Phase 0 |
| D27 | `prefers-reduced-motion` respected globally; `:focus-visible` ring on brand | Phase 0 |
| D28 | Theme control = accessible button group (light/dark/system) | Phase 0 |
| D29 | Upgrade to **latest Next.js and dependencies** before / as Phase 0.5 (toolchain first, then Phase 1 UI) | **Done** — see Phase 0.5 |
| D30 | Defer Tailwind 4 / Zod 4 / TS 7 / ESLint 10 / day-picker 9+ to later migrations | **Done** (2026-09-30) — see stack note |
| D31 | Public shell: sidebar only on `/learning`, `/editor`, `/admin` | Phase 1 |
| D32 | Nav: Writing · Work · About · Contact · Subscribe | Phase 1 |
| D33 | Article links still `/learning/[id]` until Phase 2 slug migration | **Superseded by D34** |
| D34 | Canonical article URLs: `/writing/{slugified-title}-{id}`; `/learning` → `/writing` redirects | Phase 2 |
| D35 | Writing UX: TOC, reading time, progress, related + subscribe end CTA | Phase 2 |
| D36 | After Phases 3–4: **Phase 5** = complete SEO + Google Analytics + LLM/AI-search optimization | **Done** |
| D37 | Work = case studies (problem → approach → outcome → stack); Blox first; About links to `/work` | Phase 3 |
| D38 | Audience homes share shell; hiring/clients/readers each have distinct sections + CTAs | Phase 3 |
| D39 | RSS at `/feed.xml`; series hubs at `/writing/series` + `/writing/series/{name}-{id}` | Phase 4 |
| D40 | Sticky dismissible subscribe bar on articles; subscribe page + “New this week” | Phase 4 |
| D41 | Brand/display type: **Outfit** (modern sans); articles keep Source Serif 4 | Accepted |
| D42 | Audience cards use function labels: Review for a role / Explore the work / Read the essays | Accepted |
| D43 | Brand wordmark lives in the header; page H1 is purpose (not the name), except About | Accepted |
| D45 | Home/Writing density: Josh-inspired **lively & filled** — organic life-hero, excerpted article blocks, series chips, inline subscribe; keep ink+teal then **navy** | **Accepted** |
| D46 | Sitewide centered `max-w-3xl` + life-hero; email-first subscribe; stable series color map | **Accepted** |

### Phase V — Visual polish (craft minimal)

**Status:** **Done** (2026-09-30)  
**After:** Phases 0–4 UI; can run before or after Phase 5 SEO.

Shipped:
- Stronger type scale (`display-title`, Outfit display vs Source Sans body)
- Hairline rules / separators; soft `--elev-1` / `--elev-2` surfaces
- `Reveal` scroll enter (2–3 staged delays; `prefers-reduced-motion` safe)
- Glass header; craft hero + CTA variants; path-row audience picker
- Writing / audience shells aligned to display titles + craft CTAs
- Keep light-first + **ink + signal teal**; copper `--spark` for rare “New” marks only; no purple glow / terracotta cream

---

## 9. Content & cadence notes

- Start from content already on https://www.syedbaqirali.com.
- Ongoing: thoroughly researched writing, about once per week.
- Portfolio launches are independent of Writing cadence.

---

## 10. Next ask for the owner

Phase 0–5 + **V** complete. Deferred toolchain majors shipped.

Optional follow-ups:
- Set `NEXT_PUBLIC_GSC_VERIFICATION` and submit sitemap in Search Console
- Confirm GA4 DebugView sees custom events
- Clear remaining ESLint `react-hooks/*` warnings (set-state-in-effect, etc.)
- When typescript-eslint supports TS 7.1 API, drop the TS6 alias