# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Thai SME/business owners — non-technical, often evaluating on a phone, deciding within one visit whether to trust ภูรินท์ enough to message him on LINE.

Confirmed broader audience beyond traditional SME owners: startup founders; owners of half-finished or broken AI-generated websites (served by `/fix-ai-website`); people who already heard of him through referral and are checking the site before messaging.

## Product Purpose

Freelance client acquisition site for ภูรินท์ บุรีวงศ์ (Pooh), Business Technology Engineer. The site's single success event: a visitor sends a message to his personal LINE (`bobroach`) — ideally within the first visit.

## Positioning

- Former Agoda developer, now freelance + building his own products; founder of pawjai.co (a live product he develops and operates himself — proof he maintains real systems, not just delivers them).
- Explains everything in plain Thai a business owner understands — no technical vocabulary in visible copy.
- Personal LINE, he replies to every message himself (ไลน์ส่วนตัว ตอบเองทุกข้อความ) — not an OA, not a team inbox.
- Uses AI for speed on an engineering foundation he can maintain long-term (per current hero copy).

## Operating Context

Site is new — no meaningful traffic data yet (user-confirmed). Design for cold search visitors as the safe default while still reassuring referral checkers. The site carries deliberate SEO/GEO prose zones for search and AI-crawler discovery. Deployed at https://pooh.fyi.

## Capabilities and Constraints

Hard rules from `docs/site-spec.md` (violations fail the audit):

- No pricing, package names, or baht amounts anywhere ( `/budget-factors` uses magnitude words only).
- No technical jargon in visible copy (no stack names, API, database, deploy, responsive…). Outcomes in plain Thai. Code itself may be technical.
- No emoji. No em dashes or en dashes in copy.
- No icon libraries or generic icon sets — only the hand-drawn line icons in `src/components/Icon.astro`.
- Every image slot is `ImagePlaceholder.astro` with real descriptive Thai `alt`; owner swaps in real images at launch. Do not replace placeholders with stock or generated imagery.
- No invented facts: no client counts, testimonials, star ratings, or metrics beyond the true facts in the spec.

Stack (incumbent): Astro 7 static, plain CSS (no Tailwind, no client framework), deps limited to `astro` + `@astrojs/sitemap`. All copy Thai (`lang="th"`); Thai loanword line-breaking handled by `src/utils/thai.ts`.

Undecided: blog (`docs/blog-plan.md` — planned, not built, owner decision pending).

## Brand Commitments

- Two names, one site: the **site** is **Pooh** (lowercase wordmark/lockup); the **person** is **ภูรินท์** (all first-person Thai copy). Assets in `public/brand/`; logo never stretched, lockup only ≥100px wide.
- v3 palette derived from the logo SVG (cream `#FFF9ED`, cocoa `#33241A`, honey `#F3B21A`, scarf red `#D92731`). Honey is decorative-only as text; LINE green only on LINE buttons. `theme-color` cream vs. manifest honey is deliberate — do not unify.
- Type: Mitr (headings) + IBM Plex Sans Thai Looped (body).
- Voice: warm, honest, plain Thai business language; first person; no hype.

## Evidence on Hand

- Real projects: pawjai.co (own product), สายมู.com, valasauna.com — shown as cards in `/work` with neutral one-line Thai descriptions; screenshots pending (placeholders).
- True credentials only: ex-Agoda, founder of pawjai.co, 7+ years software development (as stated in current site copy).
- No testimonials, client counts, or metrics exist — future work must state absences, never fabricate.

## Product Principles

1. Trust in one visit — every surface exists to earn a LINE message.
2. Plain Thai outcomes, never technology vocabulary.
3. Only true facts; missing proof is left out, not faked.
4. LINE-first and personal — one human replies.
5. Mobile-first persuasion; a phone screen is the primary canvas.

## Accessibility & Inclusion

Documented contrast discipline in `docs/site-spec.md`: body ink 15.05:1 on cream, muted 6.06:1, honey banned as text color (1.79:1), LINE button fill darkened to clear AA. Thai typography: body line-height 1.78 for mark stacking. Maintain WCAG AA on any change.
