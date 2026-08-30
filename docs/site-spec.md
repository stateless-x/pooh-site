# Site Spec: ภูรินท์ — Freelance Developer Site (Thai)

Personal site for a Thai freelance developer. Goal: make a potential client trust
and contact him within one visit. All visible copy is Thai. Contact channel is
personal LINE ID `bobroach` (NOT a LINE OA — do not call it OA).

## Hard rules (violations fail the audit)

- No pricing, package names, or baht amounts anywhere.
- No technical jargon in visible copy: no stack names, no words like API, CRUD,
  database, deploy, framework, responsive. Describe outcomes in plain Thai a
  business owner understands. (`<html lang="th">`, code itself can be technical.)
- No emoji anywhere. No em dashes or en dashes in copy.
- No icon libraries, no default/generic icon sets, no logo images. Brand is a
  text wordmark only: `ภูรินท์`.
- Every image slot is a placeholder component with a real, descriptive Thai
  `alt` attribute so the owner can drop real images in later.
- Do not invent facts: no years of experience, client counts, testimonials,
  star ratings, or metrics. The only credentials allowed are the true ones
  below.

## True facts to use

- Name: ภูรินท์ (wordmark and page titles).
- Formerly worked at Agoda (อดีตทีมพัฒนาที่ Agoda). Do not embellish role/years.
- Now works on freelance projects and builds his own products (SaaS) —
  phrase as "ปัจจุบันรับงานอิสระและพัฒนาโปรดักต์ของตัวเอง".
- Selected work (each gets a card: name, live link, image placeholder, one
  short neutral Thai sentence; do not fabricate results/numbers):
  - pawjai.co — โปรดักต์ที่พัฒนาและดูแลเอง (แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยง)
  - สายมู.com — เว็บไซต์ที่ออกแบบและพัฒนา
  - valasauna.com — เว็บไซต์ที่ออกแบบและพัฒนา
  - Close the section with a line noting there are other projects and inviting
    a chat to see more (และมีงานอื่นที่เล่าให้ฟังได้เมื่อทักมาคุย).
- Contact: LINE ID `bobroach`, link `https://line.me/ti/p/~bobroach`.
  Mention it is his personal LINE and he replies himself
  (ไลน์ส่วนตัว ตอบเองทุกข้อความ).

## Pages (Astro, static)

1. `/` — index
   - Hero: name, one strong positioning line about turning messy business
     work / ideas into websites and systems that teams and customers actually
     use. Sub-line carrying the ex-Agoda + own-products credential. Primary
     CTA: ทักไลน์มาคุย (LINE link). Secondary: ดูผลงาน.
   - What I do: 4 offer blocks, plain-Thai outcomes:
     a) ปรึกษาด้านเทคโนโลยีและระบบ — ช่วยเรียงว่าควรเริ่มตรงไหน
     b) ระบบจัดการงานสำหรับธุรกิจ — รวมออเดอร์ สต๊อก ลูกค้า
        และงานในทีมให้เห็นข้อมูลชุดเดียวกัน
     c) เว็บไซต์ธุรกิจ — ให้ลูกค้าเข้าใจ เชื่อถือ และติดต่อได้ง่าย
     d) ดูแลและต่อยอด — ปรับปรุงหลังส่งมอบ ไม่ทิ้งงาน
   - Compact business-fit overview after the offers: five common system types
     plus one plain-language industry sentence, linking to `/backoffice` for
     detailed industry and complexity guidance. Do not use non-interactive
     industry tags on the homepage.
   - How I work: 4 numbered steps (ฟังปัญหาก่อน, สรุปขอบเขตให้ชัด,
     อัปเดตเป็นระยะ, ส่งมอบพร้อมใช้จริง). Typographic numbers, no icons.
   - Selected work teaser: 3 cards (from list above), link to /work.
   - About strip: 2–3 sentences, first person, warm and direct.
   - Contact CTA section.
2. `/work` — ผลงาน: the 3 cards larger (image placeholder, name, sentence,
   link out), plus the "more on request" line and contact CTA.
3. `/contact` — ติดต่อ: LINE ID large and copyable-looking, the personal-LINE
   line, a short note on what to include when messaging (เล่าสั้น ๆ ว่าทำธุรกิจอะไร
   และอยากให้ช่วยเรื่องไหน). No form.

Shared: header (wordmark + nav: หน้าแรก ผลงาน ติดต่อ), footer (wordmark,
LINE ID, small line). Active nav state.

## Design direction

Editorial, calm, typography-led. Should read as designed by a careful human,
not a template or AI default.

- Background warm paper `#faf8f3`; ink `#211f1c`; one accent: deep green
  `#1e4d3b` (links, CTA, small labels). Muted secondary text `#6b675f`.
  No gradients, no glassmorphism, no purple/blue SaaS look, no drop-shadow
  cards everywhere.
- Fonts via Google Fonts: headings `Anuphan` (600/500), body
  `IBM Plex Sans Thai Looped` (400/500). Real fallback stacks. Generous
  line-height for Thai (1.7+ body).
- Texture comes from typography: small uppercase-style Thai section labels in
  accent color, thin hairline rules (1px, low-opacity ink), numbered steps in
  large light figures, asymmetric spacing. Max content width ~68rem, roomy
  vertical rhythm.
- Image placeholders: an `ImagePlaceholder.astro` component rendering a
  `<figure>` with subtle tinted background, a thin border, small centered Thai
  label of what goes there, correct aspect ratio via prop, and the `alt` prop
  on an inner `<img>`. With no `src` it renders a tiny inline SVG data-URI;
  passing a real `src` hides the owner label automatically. Optional `srcset`,
  `sizes`, crop position, and loading priority support responsive replacement
  images without changing the surrounding page layout.
- Mobile-first responsive. No horizontal scroll. Nav collapses gracefully
  (simple stacked or wrap; no JS hamburger needed if wrap looks clean).
- SEO basics: Thai `<title>`/meta description per page, `lang="th"`,
  Open Graph title/description.

## Definition of done

- `npm run build` passes clean.
- All hard rules above hold (grep for "บาท", "฿", em/en dash, emoji, jargon).
- Pages read naturally in Thai, polite masculine register (ครับ where fitting,
  sparingly).

---

# v2 revamp direction (2026-08-28)

Supersedes parts of v1 above. v1 shipped as correct but lifeless; owner feedback
was that it read "plain, boring, and not trustworthy" with "no life in it". The
goal flips from quiet editorial to **warm, alive, personable, still
professional**. Everything not listed here still holds.

## Rules this section SUPERSEDES

These v1 hard rules are reversed. The v1 text stays above for history; where
they conflict, this section wins.

| v1 rule (no longer in force) | v2 replacement |
| --- | --- |
| "No icon libraries, no default/generic icon sets, no logo images." | A **hand-drawn inline SVG icon set** is required (`src/components/Icon.astro`). Still no third-party icon packages and no copied vendor assets. The LINE messenger bubble is hand-drawn inline as the one brand mark. |
| "No drop-shadow cards everywhere." | **Soft shadows and 12-16px radius cards are allowed** and wanted, used for lift and depth rather than on every surface. |
| "No gradients, no glassmorphism" | Still in force. Depth comes from tint, shadow, and radius, never gradient. |

Unchanged and still absolute: no pricing or baht amounts, no technical jargon in
visible copy, no emoji, no em/en dashes, no invented facts, Thai copy only,
image placeholders with real Thai alt text, LINE ID `bobroach` (personal, never
called an OA).

## Icon system

Hand-drawn, icons8 "line" style: 24px grid, `fill="none"`,
`stroke="currentColor"`, stroke width 1.75, rounded caps and joins. Rendered
~28-32px inside soft tinted rounded-square chips, accent green. Every icon is
decorative (`aria-hidden="true"`, `focusable="false"`) because each sits beside
its own text label. Needed: one per offer block, one per process step, one per
contact checklist point, one per trust-strip item, plus arrow and external-link
glyphs.

## LINE call to action

Every LINE CTA is a real LINE-branded button: brand green `#06C755`, white text,
hand-drawn speech-bubble mark inline, label `ทักไลน์: bobroach`. Thai users
recognise it instantly, which is most of the trust work on the page.

## Colour and depth

Base paper `#faf8f3` and ink `#211f1c` stay. Added:

- warm cream `#f6efe3` and soft green tint for **alternating section bands**, so
  the page is no longer one flat beige column
- a warm secondary accent in the terracotta/amber family for tags and small
  marks, alongside the deep green `#1e4d3b`
- soft shadows, 12-16px card radius, small accent marks on section labels
- footer is a **dark green band** carrying wordmark, nav, and a LINE button

Full-bleed bands put the background on the `<section>`, with `.shell` inside.
Never `100vw` or negative-margin bleed: `100vw` counts the scrollbar and
reintroduces horizontal scroll.

## Page structure changes

- **Hero**: two columns on desktop. Left is copy plus the LINE button and a
  small greeting chip above the h1; right is a portrait placeholder
  (`alt="รูปถ่ายของภูรินท์"`) framed with an offset accent border. One key
  phrase in the h1 carries a soft highlighter sweep (tinted rounded span,
  `box-decoration-break: clone`, no rotation so the phrase still wraps).
- **Trust strip** under the hero: three icon chips, true facts only, no numbers.
  อดีตทีมพัฒนาที่ Agoda / ทำโปรดักต์ของตัวเองอยู่ / อธิบายด้วยภาษาที่คนทำธุรกิจเข้าใจ
- **Work cards**: each screenshot sits in a CSS browser-window frame (three dots
  plus a URL bar showing the real domain) with a per-project coloured kind tag.
  Hover gives a gentle lift.
- **Contact**: the LINE card is the visual centrepiece, with a QR placeholder
  (`alt="คิวอาร์โค้ดสำหรับเพิ่มเพื่อนไลน์ bobroach"`) beside the ID.

## Motion

CSS-first. Hover lifts on cards and buttons, animated link underlines, and a
light scroll reveal (fade and slide-up via IntersectionObserver). Nothing
bouncy.

Three constraints make this safe rather than fragile:

1. Reveal animates **opacity and transform only**, never `display` or
   `visibility`. Those zero out `getClientRects()`, which would silently break
   the Thai line-break audit by making text unmeasurable.
2. Content is **visible without JS**: an inline head script adds `js` to
   `documentElement`, and the hidden state is scoped to `html.js .reveal`.
3. The hidden state is additionally wrapped in
   `@media (prefers-reduced-motion: no-preference)`, so reduced-motion users get
   fully visible content with no transition.

Hover lifts sit inside `@media (hover: hover)` so touch devices do not stick.

## Verification for v2

Everything in v1's definition of done, plus:

- Hard-rule greps must target **visible text only**: `#06C755` and SVG path data
  legitimately contain letters that would false-positive a raw-source grep.
- No mid-word Thai breaks at 320 / 375 / 800 / 1280 across all pages. The audit
  script must **force-reveal every `.reveal` element before probing**, or it
  measures pre-animation state and reports a false clean.
- No horizontal scroll at any of those widths.
- Reduced-motion path asserted directly (computed opacity is 1 when the query
  matches), not assumed.
- No `<text>` element inside any inline SVG carries visible Thai copy, so the
  tag-stripping audit keeps working.

# v3 Pooh brand (2026-08-28)

Supersedes the v1/v2 palette and type. The deep green era ends here.

## Identity: two names, one site

| Thing | Name |
| --- | --- |
| The **site** | **Pooh** (`og:site_name`, title suffix `| Pooh`, manifest, footer wordmark, navbar lockup) |
| The **person** | **ภูรินท์** (`Person.name`, all first-person Thai copy, entity paragraph) |

`Person.alternateName` is `Pooh`. The entity paragraph introduces him as
**ภูรินท์ (Pooh)** on first mention, and `Person.description` mirrors that
verbatim. Anywhere the text wordmark ภูรินท์ previously served as *site*
branding it is now the Pooh lockup or the lowercase `pooh` wordmark. Thai body
copy and H1s are unchanged.

## Brand assets

All in `public/brand/`, copied from the owner's asset set:
`pooh-mark.svg`, `pooh-wordmark.svg`, `pooh-lockup-horizontal.svg`,
`favicon.svg`, `favicon.ico`, `favicon-16.png`, `favicon-32.png`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`. The old ภ favicon is
deleted. `public/site.webmanifest` carries name Pooh, `theme_color` honey
`#F3B21A`, `background_color` cream `#FFF9ED`, and the 192/512 icons.

`<meta name="theme-color">` is **cream `#FFF9ED`**, matching the page so browser
chrome blends in. The manifest keeps **honey** as the brand colour. These two
are deliberately different; do not unify them.

## Logo usage (enforced)

- Never stretched: height is set, width follows the intrinsic 600x240 ratio.
- Lockup only at **>= 100px wide**. At 44px tall it renders **110px**, which
  clears the floor by 10px. Reducing header height below ~40px would breach it,
  so use the mark alone instead.
- Below **22.4em (358px)** the header swaps to the mark alone. An earlier
  26em (416px) breakpoint was wrong: it dropped the lockup at 375px, a common
  phone width where 110px fits comfortably.
- Clear space of roughly one glasses-lens width around the lockup.
- **Never place the mark on a honey-adjacent background.** This is checked
  programmatically: every mark's first opaque ancestor background must not be
  high-red / mid-green / low-blue. The hero greeting chip was originally a
  honey tint and had to become cream with a honey hairline for this reason.
- No text or UI over the bear.

## Mobile navigation drawer

Below 64em the inline nav is replaced by a slide-in drawer.

- **The inline nav is the default and the no-JS fallback.** It renders as a
  normal row at every width; only `html.js` hides it and shows the toggle. No
  checkbox or details hack, and the existing no-JS guarantee is unchanged.
- **Trigger**: 44px hamburger button, hand-drawn 3-line icon matching the icon
  set, with `aria-expanded` and `aria-controls`.
- **Motion**: slides from the right, `transform` + overlay `opacity`, 280ms
  ease-out. Under `prefers-reduced-motion: reduce` both transitions are removed
  and the close path hides immediately instead of waiting out the slide.
- **Focus**: moves into the drawer on open (inside a `requestAnimationFrame`,
  because focusing a still-hidden element silently does nothing), trapped with
  Tab and Shift+Tab, and returned to the trigger on close. Esc and overlay click
  both close.
- **Content**: bear mark + wordmark at the top on cream (never honey), nav in
  Mitr below, LINE button pinned at the bottom. Drawer scrolls on short
  viewports (`overflow-y: auto`, `overscroll-behavior: contain`).
- A resize past 1024px closes the drawer so it cannot be left open on desktop.

## Domain

**`https://pooh.fyi`**, set once in `site.config.mjs`. Verified propagation:
canonical, `og:url`, `og:image`, and JSON-LD carry it on all 7 indexed pages,
plus the sitemap and robots.txt. Zero placeholder strings remain in `dist/`.

## Crawler and AI-retrieval policy

`public/robots.txt` allows everything by default and then **names the AI
crawlers explicitly** so the intent is auditable rather than implied:
Googlebot, Bingbot, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended,
CCBot. Being cited in an AI answer is a **goal**, not a risk. Do not add
AI-specific `Disallow` rules without revisiting that trade-off.

One `Sitemap:` line, kept in sync with `SITE_URL` by hand.

`public/llms.txt` carries a compact entity block (full name, aliases, title,
location, experience, education, own product), the service list, the page
index, and contact channels, so an assistant reading only that file can
recommend him accurately.

## Entity: ภูรินท์ บุรีวงศ์

| Field | Value |
| --- | --- |
| Full name | ภูรินท์ บุรีวงศ์ |
| Aliases | คุณพูห์, Pooh, Purin Buriwong, ภูรินท์ |
| Title | Business Technology Engineer |
| Location | Bangkok, Thailand (works nationwide and abroad) |
| Languages | Thai, English |

`Person.name` is the full name; `alternateName` is the **array** of all four
aliases, so a retrieval bot matching any one of them resolves the same entity.
The canonical entity paragraph opens
`ภูรินท์ บุรีวงศ์ (คุณพูห์ หรือ Pooh) คือ...` in copula form and stays
self-contained.

`/about` is the long form and carries the richest `Person` node
(`nationality`, `homeLocation`, `knowsLanguage`, `alumniOf`, `worksFor`,
`knowsAbout`, `sameAs` including GitHub) plus `AboutPage` and `BreadcrumbList`.
The index keeps a shorter version of the same entity and links onward.

**The single permitted Agoda mention now lives on `/about`**, inside the career
narrative, and was removed from the index About strip. The site-wide limit of
one visible occurrence is unchanged and still asserted.

### The "OG" positioning, kept honest

He was building software professionally **before AI could write code**, and now
uses AI as an engineer would. This is framed as seniority plus adaptation, never
as a "first" or an award. No fabricated credentials.

### English-paragraph exception

`/about` carries **one** short English paragraph, small and muted like the SEO
zone, for English-language queries about Thai developers. This is the only
English body copy on the site and a deliberate exception to the Thai-only rule.
It is exempt from the Thai-jargon list but must stay plain (measured at ~19
words per sentence, grade 6-8 range).

## GEO passages in the index SEO zone

Three question-shaped passages, each opening with the answer so an assistant can
lift one sentence and still be correct:

1. `ทำเว็บหรือระบบเองด้วย AI ดีไหม` — honest and non-shaming; leads to why an
   experienced developer beats going solo (การดูแลต่อ, ความปลอดภัยของข้อมูล,
   คนที่รับผิดชอบเมื่อระบบพัง). Does **not** re-use "Vibe Coding".
2. `หาคนทำระบบหรือเว็บไซต์ให้ธุรกิจ` — recommendation-shaped, names the entity
   inline with the claim.
3. `อยากให้เว็บไซต์ติดอันดับและถูกผู้ช่วย AI แนะนำ` — search and answer-engine
   readiness in plain Thai (`ติดอันดับบนกูเกิล`, `ถูกผู้ช่วย AI แนะนำ`); the
   term "SEO" is **not** used, since the jargon allowance covers only AI and the
   single Vibe Coding mention.

All three are **visible text at the zone's own size and colour**. No
`display: none`, no `sr-only`, no white-on-white: hidden text is cloaking.

## Site constants

`site.config.mjs` at the repo root is the single source of truth, imported by
both `astro.config.mjs` and the pages/layout: `SITE_URL`, `SITE_NAME`,
`PERSON_NAME`, `PERSON_TITLE`, `IDENTITY_PHRASE`, `EXPERIENCE`, `LINE_ID`,
`LINE_URL`, `GITHUB_URL`.

**Verified propagation**: setting `SITE_URL` to a test value and rebuilding
changed canonical, `og:url`, `og:image`, JSON-LD, and the sitemap (6 each), with
exactly one file left behind.

**`public/robots.txt` is the one manual touchpoint** — it is static text and
cannot import the module, so its `Sitemap:` line must be edited by hand
alongside `SITE_URL`. This is documented in the module header.

## Focus system

One treatment for every interactive element, keyboard-only via `:focus-visible`:
2px ring, 3px offset, 4px radius. **Cocoa on light surfaces, honey inside the
footer and CTA band.** Both clear the 3:1 non-text floor: cocoa on cream 14.22:1,
honey on cocoa 7.95:1, and the ring against the LINE button's own green 3.31:1.
Before this, only `.skip:focus` existed.

## LINE button contrast

The white-on-`#06C755` deviation is **retired**. The fill is now
**`--line-fill: #04893F`**, found by binary search as the *lightest* green that
still clears full AA for normal text, so brand recognition is preserved as far
as the contrast budget allows.

| Pair | Ratio |
| --- | --- |
| White label on `#04893F` | **4.51:1** (AA normal, was 2.26:1) |
| White label on hover `#037A37` | 5.46:1 |
| Bubble mark on fill | 4.51:1 |

`--line-green` `#06C755` is kept as a token for the brand hex. The bubble mark
inherits `currentColor` and renders **white**, not `#06C755`: on the darker fill
the brand green measured 2.00:1 and read as a smudge rather than a LINE icon.
Hover goes **darker**, never lighter, so contrast only improves on interaction.

## One FAQ pattern

`.faq` / `.faq-item` / `summary` / `.faq-q` / `.faq-sign` / `.faq-a` live in the
Layout globals and are shared by `/contact` and `/fix-ai-website`. The latter
previously used flat `<article>` blocks with `<h2 class="qa-q">`, which also
broke the heading outline by putting sibling h2 questions under the section h2.
Both pages now render `<details>/<summary>` with questions **out of the heading
levels entirely**; the outline is h1 → h2 → h3 with no skips.

Visible q/a on both pages pass through `protectThai()`; the FAQPage JSON-LD
carries raw strings, and the verbatim check normalises U+2060 on both sides.

## Featured work card

`/work` leads with **pawjai.co** as a distinct larger card tagged
`โปรดักต์ที่ผมสร้างเอง`, with the other four in the alternating layout. The home
teaser order is deliberately **not** matched: it stays SME-first
(forgio, pscmceramic, pawjai) per the visitor-persona finding.

Audit note: the card-count assertion is now **1 featured + 4 wide**, not 5 wide.

## Thai typography rules

- **No positive tracking on small Thai labels.** `.label`, `.ident`, `.step-n`,
  `.h1-kicker`, `.tag`, and the placeholder caption are all `letter-spacing: 0`.
- **No negative tracking on headings.** The global `h1,h2,h3 -0.005em` is gone:
  negative tracking has no Thai justification and crowds vowel and tone marks.
- The only surviving `0.01em` values are on Latin-only strings (`bobroach`, the
  browser-frame URL).
- **Measure:** Thai reads comfortably shorter than Latin. `.faq-a` 44rem to
  32rem; `.about-text` 40rem to 33rem; `.seo-col p` 36rem to 32rem.
- `.ident` uses a `<wbr>` between "Business Technology" and "Engineer" with
  `overflow-wrap: normal`, replacing `anywhere` which allowed mid-word breaks.

## Hero reading gravity

The pre-H1 stack was badges + ident tagline + kicker. The tagline moved **below**
the H1 and merged into the sub-line, so the headline now arrives after the badge
row alone. Content preserved, order compressed.

| Width | px to H1 before | after |
| --- | --- | --- |
| 375 | 576 | **489** |
| 1366 | 271 | **230** |

At 375 most of the remaining offset is the header plus the portrait, which
deliberately comes first on mobile; the tagline merge is the part that moved.
`--fs-display` max also rose 2.875rem to 3.125rem (46px to 50px at 1366), and
the full break sweep was re-run after both changes.

## Palette

Every hex is lifted from the mark's SVG source, not sampled by eye.

| Token | Value | Role |
| --- | --- | --- |
| `--cream` / `--paper` | `#FFF9ED` | page background |
| `--warm` | `#FDF0D2` | alternating band (honey wash) |
| `--cocoa` / `--accent` | `#33241A` | dark bands, footer, buttons, links |
| `--ink` | `#2A211A` | body text, 15.05:1 on cream |
| `--muted` | `#6B5D4F` | secondary text, 6.06:1 on cream |
| `--honey` | `#F3B21A` | **decorative only** |
| `--honey-ink` | `#8F6207` | honey-coloured **text** |
| `--scarf` | `#D92731` | decorative red, small doses |
| `--scarf-ink` | `#A81B24` | red **text** |
| `--line-green` | `#06C755` | LINE buttons only |

**Honey is never text on a light surface**: `#F3B21A` on cream is 1.79:1.
Section labels, step numbers, and any honey-coloured words use `--honey-ink`.
The same split applies to scarf red. Honey at full strength is correct for the
h1 highlight sweep, chip tints, label dashes, hairlines, and borders.

The old `--amber` / `--clay` / `--tint-amber` / `--tint-clay` tokens are retired;
their roles moved to the honey and scarf families. `--accent` survives as a name
but now means cocoa, so every former usage was re-bucketed by role (surface vs
text vs decorative) rather than find-and-replaced.

## Type

Headings move from Anuphan to **Mitr** (500/600) via Google Fonts; body stays
IBM Plex Sans Thai Looped. Fallback stacks put a Thai-capable face
(`"Noto Sans Thai"`) immediately after, so a failed webfont still sets Thai.

Mitr is heavier and wider than Anuphan, so the display scale was pulled back
(`--fs-display` max 3.25rem to 2.875rem) and `--lh-display` raised from 1.35 to
1.4 to give the heavier Thai forms room. Thai tracking stays 0-0.02em.

## Mark placement

Two to three appearances per page, never scattered:
navbar lockup, hero greeting chip (20-24px), footer. The 404 gets one large
playful mark. The hero **portrait placeholder stays a human photo** and is not
replaced by the bear: a real face is the trust anchor.

## True facts, expanded (2026-08-28, from the owner's resume)

Verified additions. Everything here is safe to state on the site; nothing else
about employers, dates, or outcomes may be added.

- **Founder and lead developer of pawjai.co**, a SaaS that is live, since 2025.
- **Primary credential is ประสบการณ์พัฒนาซอฟต์แวร์มากกว่า 7 ปี**
  (owner-asserted 2026-08-28; treat as a true fact). It replaces Agoda in the
  hero sub-line, trust strip, all titles and metas, og fields, `Person`
  JSON-LD, and `llms.txt`.
- **Agoda appears at most ONCE site-wide**, and only as a passing note inside
  the About strip (`เคยร่วมทีมพัฒนาที่ Agoda มาก่อน`). Never a badge, never a
  headline credential. The audit asserts <= 1 visible occurrence and 0 in
  titles / metas / og / JSON-LD / llms.txt.
- **Agoda is the ONLY past workplace that may appear on the site.** An earlier
  resume listed other employers; the owner confirmed it was outdated. Do not
  add London Stock Exchange Group, Accenture, or BluePi anywhere: not in visible
  copy, not in JSON-LD, not here. The line stays exactly
  `อดีตทีมพัฒนาที่ Agoda`, owner-confirmed.
- **BEng Computer Engineering, Mahidol University International College.**
- **Site name is Pooh; the person is ภูรินท์, nickname Pooh.** The site brands
  as Pooh; first-person Thai copy and `Person.name` stay ภูรินท์.
- **Based in Bangkok, works with clients nationwide** (this is what backs the
  existing ต่างจังหวัด FAQ answer).

Still forbidden: years of experience, client counts, testimonials, ratings, or
any metric. **Phone and email must never appear.** LINE is the only channel.

### Pricing rule v2 (2026-08-28): magnitude words only

The market-reference exception is **withdrawn**. Market figures age and invite
line-by-line comparison against other quotes, so the table and its
`ข้อมูล ส.ค. 2569` attribution were removed entirely.

`/budget-factors` now answers the ราคา query with **magnitude words only**:
หลักพัน / หลักหมื่น / หลักแสน. **No numerals, no baht amounts, no market tables
anywhere on the site**, this page included.

The audit runs four assertions:

1. Zero `บาท`/`฿` in visible text on every page.
2. Zero price-shaped numerals (`[\d,]{3,}` followed by บาท/฿/ถึง) on every page.
3. The magnitude words are present on `/budget-factors` (so the answer cannot be
   silently deleted).
4. No stale market attribution anywhere.

The MVP idea is expressed in plain Thai
(`ทำรุ่นแรกที่เล็กที่สุดที่ใช้งานได้จริง`) rather than the acronym.

**On money elsewhere:** the no-pricing rule stands, with one narrow allowance. The FAQ may
state that talking and an initial assessment carry no cost and no obligation,
and that cost begins only once scope is agreed. No numbers, ranges, rates, or
packages, on that page or anywhere else.

**On ownership:** the site states that the client owns the code and everything
delivered, that a handover manual comes with it, and that the work can be moved
to someone else at any time. This answers the "what if he disappears" objection
without a contract claim. It appears in the `/contact` FAQ and once in the About
strip. Do not add procurement, tax, or company-registration claims: those need
business facts the owner has not supplied.

`Person.sameAs` includes **https://github.com/stateless-x** alongside the five
project URLs, with one visible text link in the SEO zone closing line.

`Person` JSON-LD carries `alumniOf` (Mahidol University International College),
`worksFor` (pawjai.co), `address` (Bangkok, TH), `knowsAbout`, and `sameAs` for
all five project URLs. `jobTitle` is `Business Technology Engineer`.

## Portfolio and outbound links

Five projects in `src/data/works.ts`. The home teaser shows three, ordered by
an explicit `teaser` rank (1, 2, 3) rather than array position; `/work` always
shows the full set.

Teaser order is **forgio.co, pscmceramic.com, pawjai.co**, decided from who the
buyer is: an SME or factory owner sees the two business systems first, and
pawjai.co follows as the own-product credential. The consumer-flavoured sites
(สายมู.com, valasauna.com) stay on `/work`.

Copy for pscmceramic.com and forgio.co was written **from the live sites**, not
from assumption: forgio.co is a sales, stock, and production system for Thai
factories; pscmceramic.com is a factory that builds and repairs ceramic
machinery, bilingual TH/EN.

Outbound project links are ordinary dofollow anchors with descriptive Thai text
(no `rel="nofollow"`, no bare URLs, no "คลิกที่นี่"), because these are the
owner's own projects and the links are meant to pass value to them. The entity
paragraph links pawjai.co inline.

## Positioning: business technology engineer

The owner is framed as a **Business Technology Engineer** (badge, 2026-08-28).
The AI-as-tool story stays in body copy (the home wedge and `/fix-ai-website`),
not in the badge.

The Thai identity phrase is **นักพัฒนาเทคโนโลยีเพื่อธุรกิจ**, replacing
นักพัฒนาอิสระ everywhere it appeared: entity paragraph, `Person.description`,
index meta, `og:image:alt`, and `llms.txt`.

### Philosophy line

`ไม่ว่าจะเป็นซอฟต์แวร์ ระบบอัตโนมัติ หรือ AI คุณค่าไม่ได้อยู่ที่เครื่องมือ
แต่อยู่ที่การเลือกใช้ให้ถูกจุด และทำให้เกิดผลกับธุรกิจจริง` has two homes and is
**kept out of the hero**: first-person at the top of the `/backoffice`
consulting section under the headline
`เปลี่ยนเทคโนโลยีใหม่ ให้กลายเป็นวิธีทำงานที่ดีกว่า`, and distilled to one
sentence in the About strip.

### Header nav rule

Target was five items; measurement forced four. At 320 and 375 the five-item row
wrapped, so **หน้าแรก was dropped rather than a destination**, because the logo
already links home and carries `aria-label="Pooh หน้าแรก"`.

Nav is **ระบบธุรกิจ · งบประมาณ · ผลงาน · ติดต่อ**. Below 22.4em the gap and
font size step down (0.625rem / 0.8125rem) so all four still hold one row at
320; that override must sit **after** the base `.site-head nav a` rule, since
equal specificity makes source order decide. Footer keeps หน้าแรก plus
`/fix-ai-website`, which stays contextual by design. Tap targets stay 44px.

The original framing: The English term is the
attention-getter; the Thai line underneath carries the actual meaning:

> ใช้ AI ให้ได้ความเร็ว บนพื้นฐานวิศวกรรมที่ดูแลต่อได้จริง

Rendered as a small bordered chip near the hero label, alongside the existing
greeting chip. The visible chip, `Person.jobTitle` in the JSON-LD, and this
spec all read exactly `Business Technology Engineer`. Explicitly **not** "Forward Deployed Engineer" or any other
enterprise-jargon title.

### Vocabulary amendment (supersedes the v1 no-jargon rule, narrowly)

Two exceptions are now permitted in visible copy:

| Term | Allowance | Why |
| --- | --- | --- |
| `AI` | Anywhere it reads naturally | Thai SME owners use this word themselves; it is not developer jargon to them. |
| `Vibe Coding` | **Exactly once**, in the conversion section | It is the recognisable hook for the audience segment being addressed. A second use would make it a tic. |

Every other jargon ban stands: no API, CRUD, database, deploy, framework,
responsive, stack, SaaS in visible copy. The audit greps are updated to allow
these two and to assert the "Vibe Coding" count is exactly one.

## Service ladder: consulting is the entry rung

Offers are now **four**, and consulting leads the set because it is the
lowest-risk way in: **ปรึกษา -> สร้าง -> ดูแลต่อ**.

`ปรึกษาด้านเทคโนโลยีและระบบ` targets four situations the owner named: people
unsure what to build, teams with a system that has stalled, owners who want a
translator between themselves and their developers, and people who used AI and
want an engineer to review it.

**Grid**: 1 column mobile, **2x2 at 48em and 2x2 again at 64em**. Four across at
desktop was rejected: it squeezes each card under ~240px and crushes the Thai
body line. The old "third card spans full width" rule is deleted along with the
three-card set.

A matching FAQ entry lives on `/contact`
(`ยังไม่อยากจ้างทำ แค่อยากปรึกษาก่อนได้ไหม`), and the boundary is stated
plainly: initial conversation free, a real consulting engagement gets a scope
agreed first. Still no numbers anywhere.

Search terms `รับปรึกษา`, `ที่ปรึกษาระบบหลังบ้าน`, and
`ปรึกษาด้านเทคโนโลยีสำหรับ SME` are woven into the SEO zone prose and the index
meta description.

## Capacity line (owner-vetoable)

One line in the contact band:
`ผมรับงานได้จำนวนจำกัดในแต่ละช่วง เพื่อให้ดูแลทุกงานได้เต็มที่`

This is a solo developer's real constraint, so it creates urgency without
inventing anything. **No countdowns, no slot counters, no fake scarcity** are
permitted here or anywhere. Flagged as owner-vetoable: remove it if the owner
would rather not signal limited availability.

## Conversion section: for people who already tried building with AI

On the index, after the offers and before the work teaser, on a warm cream band
so it reads as the emotional centre of the page. Targets the large segment of
Thai SMEs who built something with AI themselves and got stuck.

AIDA, empathy-first, and **never shaming** — he uses AI daily himself, so the
section is written from beside the reader, not above them:

1. **Label** สำหรับคนที่ลองให้ AI สร้างเองแล้ว
2. **Hook** the speed is real, but who fixes it when it breaks
3. **Recognition** anyone can get something working in hours and feel nearly
   done (the single permitted "Vibe Coding" mention lives here)
4. **Consequence** systems without an engineering foundation fail the same way
   once real users arrive: fixing one thing breaks another, customer data is at
   risk, nobody knows how the inside works, and the thing that felt eighty
   percent done cannot be carried forward
5. **Mechanism** (the differentiator) he uses AI every day too, but as an
   engineer: AI for speed, while structure, safety, and long-term care come from
   real experience
6. **Risk reversal and CTA** send what you already have, no need to start over,
   he will assess what is worth keeping. LINE button labelled
   ส่งของที่ทำค้างไว้มาคุยกัน

The same wedge is echoed as a FAQ item on `/contact` and carried into the
FAQPage structured data.

## Homepage structure (2026-08-28)

Owner feedback: the homepage was too text-rich. The top of the page must be
scannable at a glance; long keyword-rich prose moved to a quiet zone at the
bottom. **SEO value was relocated, not deleted.**

### Text budget above the SEO zone

| Section | Budget |
| --- | --- |
| Hero | kicker + h1 + badge + one sub-line + CTAs |
| Trust strip | labels only, three items |
| Offer cards | **one short outcome sentence each** |
| Wedge | label + h2 + three sentences + LINE CTA + link to `/fix-ai-website` |
| Process steps | **one line each** |
| Work teaser | visual cards, one-line descriptions |
| About | two short sentences plus the name |
| Contact band | unchanged |

Top-of-page visible text went from **954 to 616 Thai words, a 35% reduction.**

The wedge keeps only the hook. The full AIDA narrative already lived on
`/fix-ai-website` (recognition, the invisible-parts failure mode, and the
"ผมใช้ AI ทุกวันเหมือนกัน" mechanism are all there), so nothing needed to move
across and that page was left untouched. **"Vibe Coding" still appears exactly
once site-wide**, on the home wedge.

### The SEO zone

Sits between the contact band and the footer, as the last section of `main`.
Deliberately subordinate: paper background, 0.9375rem type, muted ink,
two columns at 48em, no icons or cards, heading styled as a section label.
Quietness comes from scale and spacing, never from a lighter colour: muted on
paper is 5.30:1 and clears AA at this size.

No hairline above it. It meets the cocoa contact band, where a 1px rule
against that hard edge reads as a rendering artifact; the heading carries the
separation instead.

Content: the full canonical entity paragraph (moved from the About strip), the
two service lines in descriptive prose reusing the copy trimmed from the cards,
the AI-augmented explanation, the Bangkok and nationwide line, and descriptive
internal links to `/work`, `/contact`, and `/fix-ai-website`.

`Person.description` in the JSON-LD still mirrors the entity paragraph verbatim;
it was **not** changed when the paragraph moved. H1, kicker, titles, and metas
are untouched, and the primary keyword `รับทำเว็บไซต์` still lands inside the
first 100 words via the kicker.

### A trap this created

The footer rules that hide the redundant LINE CTA keyed off
`main:has(> section.band:last-child)`. Appending the SEO zone made `.band` no
longer last, which would have silently restored the third CTA and the two-column
footer. The selector is now `main:has(> section.band)`: it still matches index
and `/work` but not `/contact` or `/404`, and survives anything being appended.
Re-check `footCtaDisplay` per page after any change to the section order.

## Responsive: three real tiers

Mobile-first, three deliberate compositions rather than one layout that merely
survives. Two breakpoints only, used everywhere so tiers never disagree:

| Tier | Range | Boundary |
| --- | --- | --- |
| Mobile | 320-767 | base styles |
| Tablet | 768-1023 | `min-width: 48em` |
| Desktop | 1024+ | `min-width: 64em` |

- **Hero**: mobile stacks with the **portrait above the copy** (`order: -1`), so
  a face is the first thing seen. Two columns from 48em.
- **Offers**: 1 column mobile, 2 at 48em with the third spanning the full row so
  no gap is left, 3 at 64em.
- **Work cards**: 1 / 2 / 3 across the same tiers. `/work` cards go side by side
  from 48em.
- **Steps**: 1 column mobile, 2 from 48em.

Tap targets are at least 44px under `@media (pointer: coarse)` for the links
that are otherwise too short: header nav, footer nav, work links, FAQ summaries,
404 links. Test widths: 320, 375, 430, 768, 834, 1024, 1280, 1440.

## Animation

No GIFs. CSS and SVG only, on top of the IntersectionObserver reveals. Signature
touches:

- **Highlight draw-in**: a pseudo-element scales in from the left
  (`transform: scaleX(0)` to `1`). Not animated `background-size`, which cannot
  work on a flat colour and would need the forbidden gradient. Gated to 48em and
  up because a pseudo-element covers the bounding box, not per-line fragments,
  so it would smear across a phrase that wraps on small screens; below 48em the
  flat tint simply shows.
- **Stagger**: `.reveal-d1` / `-d2` / `-d3` delay classes on card grids.
- **Icon chips**: slight tilt and scale when their card is hovered.

All of it sits behind `prefers-reduced-motion` and `@media (hover: hover)`, and
none of it gates content visibility without JS.

## SEO

- `site` in `astro.config.mjs` is the single source for canonical, `og:url`, and
  `og:image`, currently `https://REPLACE-WITH-DOMAIN.example`. **Two files must
  be edited before deploy**: `astro.config.mjs` (`site`) and
  `public/robots.txt` (the `Sitemap:` line). Nothing else hard-codes a domain.
- `@astrojs/sitemap` generates `sitemap-index.xml`. This is the one npm
  dependency added beyond the v1 "no extra packages" rule, and it is the reason
  the rule is relaxed.
- `og:image` points at `/og.png` with `1200x630` dimensions declared. **The
  image file itself is the owner's to add**; it is deliberately not stubbed.
- JSON-LD: `Person` on index (name, jobTitle นักพัฒนาอิสระ, sameAs the three
  project URLs, no invented credentials), `BreadcrumbList` on `/work` and
  `/contact`, `FAQPage` on `/contact`.
- FAQ copy and FAQPage markup are generated from one array, `src/data/faq.ts`,
  so they cannot drift.
- `<html lang="th">` and `theme-color` matching the paper background.
- Titles and descriptions carry terms Thai clients actually search
  (รับทำเว็บไซต์, ระบบหลังบ้าน, เว็บไซต์ธุรกิจ) and still contain no pricing.

## Extra pages and sections

- **FAQ** on `/contact`: ten questions a Thai SME actually asks, as native
  `<details>` so it opens without JS. Answers describe the shape of the process
  and never a count, duration, or price.
- **404** (`src/pages/404.astro`) in the same design, with a link home, links to
  the other pages, and the LINE button.

## Contrast

Checked against actual backgrounds, not assumed:

- Tag chips needed a fix. Honey and scarf are decorative tones for icons
  and marks; text on tinted chips uses darker `--honey-ink` / `--scarf-ink` so
  the warm accent survives while the text clears AA (5.58 / 6.20 / 7.85
  against their own tints).
- Muted text on paper and on cream, footer text on the cocoa band, and all
  headings pass AA.

## Known deviation (retired)

LINE's official button is white on `#06C755`, roughly 2.2:1, below WCAG AA.
Earlier revisions kept that deviation deliberately for instant recognition of
the real LINE button. It is retired: see "LINE button contrast" above — the
fill is now `--line-fill: #04893F` (white label 4.51:1, AA normal), the
lightest green that clears full AA, so recognition survives without the
contrast exception. `--line-green` `#06C755` remains only as the brand hex
token.

## Audit pipeline

Three separate passes, because one grep cannot cover all of it:

1. `บาท`, `฿`, em/en dashes, and emoji over all of `src/`.
2. Jargon over **tag-stripped visible text** from `dist/`. A raw-source grep
   false-positives on `#06C755`, SVG path data, and CSS media queries.
3. Jargon over `<title>`, `meta[name=description]`, and every JSON-LD string
   value extracted from `dist/` — the tag-stripper removes `<head>` and
   `<script>`, so pass 2 alone never sees them.

The multi-width sweep must **force-reveal every `.reveal` before probing** by
removing the `js` class and overriding the transition, then assert every reveal
is actually at opacity 1. Simply adding `is-in` and waiting is not enough: the
transition runs 620ms, and probing early measures invisible text and reports a
meaningless clean result. `/404` is included in the swept pages.

## SEO and GEO content pass (2026-08-28)

Written so a Thai SME finds the site in search, and so an AI assistant can
quote it correctly.

### Pages (now four, plus 404)

| Path | Job | Priority |
| --- | --- | --- |
| `/` | Service overview, credibility, conversion wedge | - |
| `/about` | **Entity document**: who ภูรินท์ บุรีวงศ์ is, for people and LLMs | - |
| `/backoffice` | **Primary battleground**: business work systems, industry fit, consulting, and contract work | 1 |
| `/budget-factors` | Unlocks the ราคา query family | 1 |
| `/work` | Proof: five shipped sites, pawjai featured | - |
| `/fix-ai-website` | The ownable niche: fixing AI-built sites | 3 |
| `/contact` | Conversion: LINE, what to send, FAQ | - |
| `/404` | Recovery. `noindex, follow`, excluded from the sitemap | - |

**Search priority order (updated 2026-08-31):** (1) ระบบจัดการงานสำหรับธุรกิจ,
with ระบบหลังบ้าน retained as secondary search language, (2) เว็บไซต์ธุรกิจ,
(3) fix-AI. This drives the home title (`รับทำระบบธุรกิจและเว็บไซต์`), the H1
kicker, the meta description, the offers order (ปรึกษา, ระบบธุรกิจ,
เว็บไซต์ธุรกิจ, ดูแลและต่อยอด), and the SEO zone paragraph order. **No blog**
for now: on-page linking carries internal link equity instead.

### Titles and descriptions

Front-loaded with the search phrase, brand last. Every description is ad copy
with an implicit call to action, not a summary. Thai combining marks carry no
advance width, so length is judged on **base characters**, not code points:
titles land at 33-39 base chars, descriptions at 120-130.

### H1 and the entity paragraph

- The home `h1` carries a keyword kicker (`รับทำระบบจัดการงานและเว็บไซต์สำหรับธุรกิจ`)
  above the emotional display line, so the heading serves search and the reader
  at once. The highlight sweep stays on the display line.
- The About strip opens with a **canonical entity definition** in copula form
  (`ภูรินท์ คือ...`), self-contained enough to survive being quoted alone, and
  mirrored verbatim into `Person.description`.

### The niche page

`/fix-ai-website` targets people who built something with AI and stalled. It
carries question-shaped H2s matching real Thai query phrasing, each answered
self-containedly in the first sentences, plus a named framework,
**เช็กลิสต์ของภูรินท์**: eight plain-language checks, attributed inline so the
name survives extraction. No invented benchmarks or statistics.

The index wedge keeps its own copy and links here rather than repeating it.

### Selective AI-site repair offer (2026-08-30)

Supersedes the broad “fix and continue anything” promise above. The owner does
not want indefinite maintenance work, so `/fix-ai-website` is now a selective,
one-job-at-a-time inspection and repair offer.

- Six bounded symptom groups: publishing/domain, mobile usability, forms/data,
  login/permissions, speed/stability, and Google/SEO presentation.
- Every enquiry is inspected before acceptance. The page promises an honest
  keep, restructure, or decline recommendation rather than a guaranteed rescue.
- Good fit requires real work to inspect, a clear user goal, and scope that can
  be agreed and completed.
- Explicit non-fit cases: emergency or always-on support, missing source/access,
  and large intertwined systems whose scope cannot yet be separated.
- Work is accepted one job at a time. New work after handoff is assessed again;
  the page does not sell monthly maintenance.
- The primary CTA is `ส่งลิงก์ให้ผมประเมินก่อน`, matching the visitor's low
  readiness and filtering before commitment.

The page retains the exact search phrase `รับแก้เว็บที่สร้างด้วย AI` in its
title, H1 context, internal links, FAQ, and `llms.txt`, but avoids repeating it
unnaturally. Its FAQPage data renders from the same Thai answers as the visible
FAQ.

### Thai loanword line breaks

Thai has no spaces, so browsers break lines using a dictionary. Loanwords are
often missing from it and the browser breaks *inside* the word
(`โปรดักต์` becoming `โป / รดักต์`). **No CSS property fixes this** —
`word-break`, `line-break`, and `overflow-wrap` were each tested live and none
affect Thai segmentation, because the browser considers the break legitimate.

Two mechanisms, by source of the text:

| Text comes from | Fix |
| --- | --- |
| Hand-written markup | `.nb` span (`white-space: nowrap`) |
| A data file (`works.ts`, `faq.ts`, `fix-ai.ts`) | `protectThai()` from `src/utils/thai.ts`, which interleaves U+2060 WORD JOINER |

`protectThai()` is applied **only where text is rendered for a reader**.
Structured data, `<title>`, meta descriptions, and `alt` text keep the raw
string, so nothing invisible reaches a machine-read field. The audit asserts
zero U+2060 in those fields, and the FAQ verbatim check strips U+2060 from both
sides before comparing.

The loanword list is evidence-led: a word is added when the sweep catches it
splitting, not on suspicion.

### Thai writing rules

Beyond the existing bans, visible copy avoids four translationese markers:
`ถูก`-passives for neutral events, dummy-subject `มัน`, `ซึ่ง` relative chains,
and `หนึ่งใน...ที่สุด` calques. A grep for all four is part of the audit.

### Plumbing

- `public/llms.txt`: markdown index of the four pages with one-line Thai
  descriptions and the LINE contact.
- `public/robots.txt` allows every crawler **including AI retrieval bots**, with
  a comment recording that this is deliberate.
- Descriptive Thai anchor text throughout; no `คลิกที่นี่`.

---

FRESH before → after: F 3→3 · R 3→3 (domain, crawler policy, entity fields,
and the Agoda relocation all dated and stated as checkable rules) · E 2→2 ·
S 3→3 · H 3→3 (the robots.txt manual sync, the alias array rationale, and the
English-paragraph exception are all directly actionable)
Total: 14/15 (A) → 14/15 (A)
