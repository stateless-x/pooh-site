# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Thai SME/business owners and operations leads — non-technical, often evaluating on a phone, deciding within one visit whether to trust ภูรินท์ enough to message him on LINE. They may recognise themselves by a recurring workflow problem, a familiar system type, or an industry example before they know what to call the solution.

Confirmed broader audience beyond traditional SME owners: startup founders; owners of half-finished AI-generated websites that still have a clear, bounded path to launch (served by `/fix-ai-website`); people who already heard of him through referral and are checking the site before messaging. The AI-fix offer is a one-round inspection and repair service, not indefinite maintenance or emergency on-call support.

## Product Purpose

Freelance client acquisition site for ภูรินท์ บุรีวงศ์ (Pooh), Business Technology Engineer. The site's single success event: a visitor sends a message to his personal LINE (`bobroach`) — ideally within the first visit.

## Positioning

- Former Agoda developer, now freelance + building his own products; founder of pawjai.co (a live product he develops and operates himself — proof he maintains real systems, not just delivers them).
- Explains everything in plain Thai a business owner understands — no technical vocabulary in visible copy.
- Personal LINE, he replies to every message himself (ไลน์ส่วนตัว ตอบเองทุกข้อความ) — not an OA, not a team inbox. The LINE handle (`bobroach`) is personal and reads informally, so it never appears in running copy: buttons say `ทักไลน์`, the href carries the ID, and `/contact` still shows it because a visitor adds by searching it. Email `askpurin@pm.me` is the quieter second channel for buyers who want a paper trail.
- Uses AI for speed on an engineering foundation he can maintain long-term (per current hero copy).
- The broad service category shown to buyers is “ระบบจัดการงานสำหรับธุรกิจ”; “ระบบหลังบ้าน” remains secondary search language. Engagement can be a scoped build, consulting/system planning, or joining an existing team under a fixed-term contract.

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

- Real projects shown as cards in `/work`, each described by what the business actually is and what the site had to solve; screenshots pending (placeholders):
  - pawjai.co — own product (pet platform), featured card.
  - สายมู.com — client site: online fortune-telling combining Thai astrology, Chinese Bazi, and a personality test. (Ownership unconfirmed by the owner; kept as client work per the original data.)
  - valasauna.com — client site for a Hat Yai sauna, multilingual because it serves Thai and cross-border visitors.
  - forgio.co, pscmceramic.com — client factory/manufacturing work; the clearest B2B proof, so they lead the non-featured cards on `/work` and the home teaser.
- True credentials only: ex-Agoda, founder of pawjai.co, 7+ years software development (as stated in current site copy).
- No testimonials, client counts, or metrics exist — future work must state absences, never fabricate.
- Payment terms are stated on the site as staged by milestone with no full amount up front (owner-confirmed). Amounts and percentages stay unstated, per the no-pricing rule.
- Engineering stack (TypeScript, React, Next.js, Node, Astro, Python, Ruby on Rails, PostgreSQL) is recorded only in `Person.knowsAbout` JSON-LD. It must never appear in visible copy; structured data is the one surface where a hiring company or an assistant can read it.

## Product Principles

1. Trust in one visit — every surface exists to earn a LINE message.
2. Plain Thai outcomes, never technology vocabulary.
3. Only true facts; missing proof is left out, not faked.
4. LINE-first and personal — one human replies.
5. Mobile-first persuasion; a phone screen is the primary canvas.

## Accessibility & Inclusion

Documented contrast discipline in `docs/site-spec.md`: body ink 15.05:1 on cream, muted 6.06:1, honey banned as text color (1.79:1), LINE button fill darkened to clear AA. Thai typography: body line-height 1.78 for mark stacking. Maintain WCAG AA on any change.
