# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Thai SME/business owners and operations leads — non-technical, often evaluating on a phone, deciding within one visit whether to trust ภูรินท์ enough to message him on LINE. They may recognise themselves by a recurring workflow problem, a familiar system type, or an industry example before they know what to call the solution.

Confirmed broader audience beyond traditional SME owners: startup founders; owners of half-finished AI-generated websites that still have a clear, bounded path to launch (served by `/fix-ai-website`); people who already heard of him through referral and are checking the site before messaging. The AI-fix offer is a one-round inspection and repair service, not indefinite maintenance or emergency on-call support.

Second audience, added 2026-09-01 with the English edition: foreign owners
operating in or around Thailand, and remote international clients hiring from
abroad. They read `/en/`, they are colder traffic, and they convert by email.
See "English edition carve-out".

## Product Purpose

Freelance client acquisition site for ภูรินท์ บุรีวงศ์ (Pooh), Business Technology Engineer.

Two success events, one per edition:

- **Thai (root URLs):** a visitor sends a message to his personal LINE (`bobroach`) — ideally within the first visit.
- **English (`/en/`):** a visitor sends an email to `askpurin@pm.me`.

## Positioning

- Former Agoda developer, now freelance + building his own products; founder of pawjai.co (a live product he develops and operates himself — proof he maintains real systems, not just delivers them).
- Explains everything in plain Thai a business owner understands — no technical vocabulary in visible copy.
- Personal LINE, he replies to every message himself (ไลน์ส่วนตัว ตอบเองทุกข้อความ) — not an OA, not a team inbox. The LINE handle (`bobroach`) is personal and reads informally, so it never appears in running copy: buttons say `ทักไลน์`, the href carries the ID, and `/contact` still shows it because a visitor adds by searching it. Email `askpurin@pm.me` is the quieter second channel for buyers who want a paper trail.
- Uses AI for speed on an engineering foundation he can maintain long-term (per current hero copy).
- The broad service category shown to buyers is “ระบบจัดการงานสำหรับธุรกิจ”; “ระบบหลังบ้าน” remains secondary search language. Engagement can be a scoped build, consulting/system planning, or joining an existing team under a fixed-term contract.

## Operating Context

Site is new — no meaningful traffic data yet (user-confirmed). Design for cold search visitors as the safe default while still reassuring referral checkers. The site carries deliberate SEO/GEO prose zones for search and AI-crawler discovery. Deployed at https://pooh.fyi.

## Capabilities and Constraints

**Scope note: the rules in this section describe the THAI edition.** The site
ships two language editions with deliberately different voices; see
"English edition carve-out" below and `docs/adr/0001-english-edition-diverges-from-thai-voice.md`.
Audit each edition against its own rules.

Hard rules from `docs/site-spec.md` (violations fail the audit):

- No pricing, package names, or baht amounts anywhere ( `/budget-factors` uses magnitude words only). **Binds both editions.**
- No technical jargon in visible copy (no stack names, API, database, deploy, responsive…). Outcomes in plain Thai. Code itself may be technical. **Thai edition only.**
- No emoji. No em dashes or en dashes in copy. **Binds both editions.**
- No icon libraries or generic icon sets — only the hand-drawn line icons in `src/components/Icon.astro`. **Binds both editions.**
- Every image slot is `ImagePlaceholder.astro` with real descriptive `alt` in that page's own language; owner swaps in real images at launch. Do not replace placeholders with stock or generated imagery. **Binds both editions.**
- No invented facts: no client counts, testimonials, star ratings, or metrics beyond the true facts in the spec. **Binds both editions**, and it also forbids borrowing a third party's credibility (naming other companies' engineering operations, or calling a former employer "one of the largest").

Stack (incumbent): Astro 7 static, plain CSS (no Tailwind, no client framework), deps limited to `astro` + `@astrojs/sitemap`. Astro's built-in i18n with `defaultLocale: 'th'` and `prefixDefaultLocale: false`, so Thai holds the root URLs and English lives under `/en/`. Thai copy is `lang="th"` with loanword line-breaking via `src/utils/thai.ts`; English pages are `lang="en"` and skip that utility.

## English edition carve-out

Added 2026-09-01. Decision and rationale:
`docs/adr/0001-english-edition-diverges-from-thai-voice.md`, whose **voice
portion is superseded by**
`docs/adr/0002-english-voice-warm-freelancer-not-wolf.md`.
Domain language: `CONTEXT.md`.

The English edition under `/en/` is a **native rewrite, not a translation**.
It has its own audience and its own success event, and a future audit must
judge it against the rules in this section rather than the Thai ones above.

**Who he is, in English.** A freelance developer based in Bangkok, Thailand,
who takes remote work and builds business websites and back-office systems
for customers. Every English page should sound like that person. This is the
sentence to check copy against.

**Audience.** (a) Foreign owners operating in or around Thailand. (b) Remote
international clients hiring from abroad. Both are colder traffic than the
Thai visitor and are comparing against a global market.

**Success event.** An email to `askpurin@pm.me`. Every English CTA drives to
email. LINE appears on `/en/contact` only, as a secondary option for a reader
already in Thailand.

**Voice.** The same warm, honest, plain first-person voice as the Thai
edition, in grade-5 English. The persuasion lives in the **structure** (a
clear offer, one objection handled at a time, a single email CTA per page),
never in the **tone**. Helpful, not closing.

A full persuasion-first register was written, read by the owner, and rejected
as arrogant. The test that replaced it: **would a modest, competent freelancer
actually say this sentence out loud to a customer?** If not, rewrite it. The
patterns that failed that test are recorded as worked examples in
`docs/site-spec.md`.

### Rules that differ from the Thai edition

| Thai rule | English carve-out |
| --- | --- |
| "Phone and email must never appear. LINE is the only channel." | **Email is the primary and default channel.** `askpurin@pm.me` appears in the header, the footer, every closing band, the entity paragraph, and JSON-LD. LINE is confined to `/en/contact`. |
| "Agoda appears at most ONCE site-wide", zero in titles/metas/JSON-LD. | **Scoped to Thai.** English may cite ex-Agoda experience wherever it builds trust, including the meta description and `Person.description`. It is still stated as his own experience, never embellished into a claim about Agoda's size or ranking. |
| "No technical jargon in visible copy." | **Relaxed.** Technical vocabulary is allowed where it builds trust: naming real systems, "front end" and "back end", "back-office systems". Everything must still be followable by a non-technical owner at grade-5 reading level. |
| Warm, plain, no hype. | **Unchanged. Both editions share this voice** (ADR 0002). English differs from Thai only in the jargon allowance and the contact channel, not in warmth. |

### Rules unique to the English edition

- **Identity is stated plainly and often.** "Freelance developer based in
  Bangkok, Thailand" belongs in the hero area, the about page facts, the
  footer, the entity paragraph, and JSON-LD. It is both what the owner wanted
  said and the string an answer engine can retrieve and cite.
- **Name the place.** "This region", "here", and "this part of the world"
  standing in for Thailand are banned: say Bangkok, Thailand, or Southeast
  Asia. Vague geography is both unclear to a reader and uncitable by an
  assistant.
- **The budget point is made once, and modestly.** That a budget goes further
  in Bangkok than in London or San Francisco may be said **once on the home
  page** and at most once more in a budget FAQ answer where the reader asked
  about money directly. It is never a thesis, never a challenge to the reader,
  and never repeated across pages. An earlier draft repeated a near-identical
  version of it on five pages; that repetition was the arrogance.
- **Banned words, English only:** "cheap", "affordable", "low-cost",
  "budget-friendly", "inexpensive". He is not selling on price. A headline
  names what the reader gets, never what they do not pay.
- **No borrowed credibility.** Any point about engineering in Thailand is made
  from his own documented experience. Naming other companies' engineering
  operations to imply endorsement is an invented-fact violation.
- `/en/budget-factors` follows the Thai magnitude-only approach in English:
  it explains what affects cost and states no number, rate, or range.
- `/en/fix-ai-website` is a one-round inspection and repair offer, framed as
  "you got most of the way with AI, I can help you finish". Never shaming: he
  uses AI daily himself.

### Shared plumbing

- Every page in both editions carries `th`, `en`, and `x-default` hreflang
  alternates, with x-default pointing at Thai because Thai is the fallback.
  `/blog` is Thai-only and correctly emits no `en` alternate.
- `src/utils/locale.ts` is the single path map. hreflang, the switcher, the
  detection script, and nav `aria-current` all read it, so an alternate can
  never point at a page that does not exist.
- A TH/EN switcher appears in the desktop header and the mobile drawer on
  every page of both editions. An explicit choice is stored and always beats
  browser detection.
- Browser-language detection runs on Thai pages only, once per visitor, and
  can only ever send someone to that page's own English counterpart. Thai is
  the fallback whenever it cannot decide.

Undecided: blog (`docs/blog-plan.md` — planned, not built, owner decision pending).

## Brand Commitments

- Two names, one site: the **site** is **Pooh** (lowercase wordmark/lockup); the **person** is **ภูรินท์** (all first-person Thai copy). Assets in `public/brand/`; logo never stretched, lockup only ≥100px wide.
- v3 palette derived from the logo SVG (cream `#FFF9ED`, cocoa `#33241A`, honey `#F3B21A`, scarf red `#D92731`). Honey is decorative-only as text; LINE green only on LINE buttons. `theme-color` cream vs. manifest honey is deliberate — do not unify.
- Type: Mitr (headings) + IBM Plex Sans Thai Looped (body).
- Voice: warm, honest, plain Thai business language; first person; no hype. **Thai edition only** — the English edition's voice is defined in "English edition carve-out" and deliberately diverges (ADR 0001).

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
