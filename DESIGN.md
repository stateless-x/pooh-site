---
name: Pooh
description: Warm honey-and-cocoa Thai brand system for a solo developer's client site, built to earn one LINE message.
colors:
  honey: "#F3B21A"
  honey-ink: "#8F6207"
  scarf: "#D92731"
  scarf-ink: "#A81B24"
  line-green: "#06C755"
  line-fill: "#04893F"
  line-fill-dark: "#037A37"
  cream: "#FFF9ED"
  paper: "#FFF9ED"
  warm: "#FDF0D2"
  cocoa: "#33241A"
  accent: "#33241A"
  ink: "#2A211A"
  muted: "#6B5D4F"
  rule: "rgba(42, 33, 26, 0.14)"
  rule-soft: "rgba(42, 33, 26, 0.08)"
  tint: "rgba(243, 178, 26, 0.06)"
  tint-honey: "rgba(243, 178, 26, 0.1)"
  tint-strong: "rgba(243, 178, 26, 0.18)"
  tint-scarf: "rgba(217, 39, 49, 0.1)"
  white: "#fff"
  edge-dark: "rgba(0, 0, 0, 0.06)"
typography:
  display:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.75rem, 1.25rem + 2.5vw, 3.125rem)"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  headline:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 2vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  title:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.375rem, 1.15rem + 1.2vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  subtitle:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "IBM Plex Sans Thai Looped, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "0"
  body-small:
    fontFamily: "IBM Plex Sans Thai Looped, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.78
    letterSpacing: "0"
  label:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  display-id:
    fontFamily: "Mitr, Noto Sans Thai, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 3.2vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "0.01em"
rounded:
  dash: "2px"
  ring: "4px"
  sweep: "6px"
  control: "10px"
  button: "12px"
  card: "14px"
  pill: "999px"
spacing:
  shell: "68rem"
  gutter-mobile: "1.375rem"
  gutter-desktop: "2.5rem"
  card-mobile: "1.25rem"
  card-desktop: "1.75rem"
  section-mobile: "3.5rem"
  section-desktop: "5.5rem"
components:
  button-line:
    backgroundColor: "{colors.line-fill}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "0.8125rem 1.375rem"
  button-line-hover:
    backgroundColor: "{colors.line-fill-dark}"
    textColor: "#FFFFFF"
  button-line-lg:
    backgroundColor: "{colors.line-fill}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "1rem 1.75rem"
  button-quiet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.accent}"
    rounded: "{rounded.button}"
    padding: "0.8125rem 1.375rem"
  button-quiet-on-dark:
    backgroundColor: "transparent"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "0.8125rem 1.375rem"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.5rem"
  chip-icon:
    backgroundColor: "{colors.tint-strong}"
    textColor: "{colors.accent}"
    rounded: "{rounded.card}"
    size: "3.25rem"
  chip-icon-amber:
    backgroundColor: "{colors.tint-honey}"
    textColor: "{colors.honey-ink}"
  chip-icon-clay:
    backgroundColor: "{colors.tint-scarf}"
    textColor: "{colors.scarf-ink}"
  tag:
    backgroundColor: "{colors.tint-strong}"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "0.3125rem 0.75rem"
  tag-amber:
    backgroundColor: "{colors.tint-honey}"
    textColor: "{colors.honey-ink}"
  tag-clay:
    backgroundColor: "{colors.tint-scarf}"
    textColor: "{colors.scarf-ink}"
  chip-greeting:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.875rem 0.375rem 0.4375rem"
  chip-identity:
    backgroundColor: "{colors.tint-honey}"
    textColor: "{colors.honey-ink}"
    rounded: "{rounded.pill}"
    padding: "0.375rem 0.875rem"
  section-label:
    textColor: "{colors.honey-ink}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.muted}"
    typography: "{typography.body-small}"
  nav-link-active:
    textColor: "{colors.accent}"
  drawer-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.25rem 0.5rem"
    height: "48px"
  drawer-link-active:
    backgroundColor: "{colors.tint-strong}"
    textColor: "{colors.cocoa}"
---

# Design System: Pooh

## Overview

**Creative North Star: "The Honey Jar Workshop"**

This is a craftsman's shop with the lights on and the door open. Every colour in the system was lifted directly out of the Pooh bear mark's own SVG source rather than sampled by eye, so the palette is not a theme applied to a logo, it is the logo spread across a page. Cream paper, cocoa ink, a jar of honey used sparingly, and one red scarf. The result is warm and domestic where a developer's site usually goes cold and technical, because the visitor is a Thai business owner deciding whether one human can be trusted with their business, not an engineer evaluating a stack.

The density is generous and unhurried. Text sits on a short Thai measure, body copy breathes at a 1.78 line-height that most Latin-first systems would consider loose, and sections separate with a lot of vertical air rather than with lines and boxes. Depth is almost entirely absent at rest: cards are flat, held together by hairline borders and the faintest shadow, and lift only when a pointer that can hover actually hovers. Nothing shouts. The one loud object on any page is the LINE button, and it is loud on purpose because it is the only thing the site is asking anyone to do.

The aesthetic rejects the two easy defaults for this category. There is no cool grey-and-blue SaaS surface, and there is no dark-mode developer aesthetic; this site is warm-light only. It also rejects decorative shortcuts that would cheapen a hand-built impression: no gradients anywhere, no GIFs, no stock icon set. Every icon in the system was drawn by hand on a 24px grid, and the highlighter sweep behind the hero headline is a flat tint that scales in, never a gradient wash.

**Key Characteristics:**
- Warm honey-on-cream light surface, cocoa as the only dark ground
- Flat at rest, lift on hover; hairlines carry structure, not shadows
- Honey is seen and never spoken: decorative at full strength, `#8F6207` when it must carry words
- Thai-first typography: generous leading, zero tracking, shorter measure than Latin
- Hand-drawn 24px line icons, 1.75 stroke, no icon package anywhere
- One recognisable green button as the single loud element on any page

## Colors

A jar of honey, a bear's cocoa fur, and a red scarf, spread thin across cream paper, with LINE's green quarantined to the one button that must be instantly recognisable.

### Primary
- **Signal Honey** (`#F3B21A`): The brand's decorative voice at full strength. It appears as the label dash before every section kicker, the hero highlight sweep tint, chip and tag backgrounds at 6-18% opacity, the identity chip's hairline border, the warm edges of the conversion band, and the focus ring on dark surfaces. It is never used for words on a light surface.
- **Spoken Honey** (`#8F6207`): The text-safe half of the honey family and the only way honey-coloured words may appear. It carries section labels, step numbers, and the amber chip and tag variants, measuring 5.58:1 to 7.85:1 against the tints it sits on.

### Secondary
- **Scarf Red** (`#D92731`): Decorative red in very small doses, lifted from the bear's scarf. It exists mainly as its 10% tint behind clay-variant chips and tags.
- **Spoken Scarf** (`#A81B24`): The text-safe half of the red family, used for words and icon strokes on the scarf tint.

### Tertiary
- **LINE Green** (`#06C755`): LINE's own recognisable brand hex, kept as a token for brand fidelity only. It is never used as a fill behind text.
- **LINE Fill** (`#04893F`): The actual button ground, found by binary search as the lightest green that still clears full AA for normal text: white on this measures 4.51:1. Brand recognition is preserved as far as the contrast budget allows.
- **LINE Fill Deep** (`#037A37`): The hover ground, at 5.46:1. Interaction only ever makes the button darker.

### Neutral
- **Warm Cream** (`#FFF9ED`): The page background everywhere, and the same value serves both the `cream` and `paper` roles. Also the `theme-color` so browser chrome blends into the page.
- **Honey Wash** (`#FDF0D2`): The alternating band background. Because cream and paper are identical, this warmer wash is what actually carries section alternation.
- **Cocoa** (`#33241A`): The only dark ground. It is the footer, the contact band, and (as the `accent` role) the colour of links, primary text on buttons, nav underlines, and the FAQ plus-sign. Despite legacy CSS comments calling these bands "green", the value is brown.
- **Deep Ink** (`#2A211A`): Body text, warmed toward cocoa but still 15.05:1 on cream.
- **Muted Ink** (`#6B5D4F`): Secondary text, ledes, card body copy, and nav links at rest, 6.06:1 on cream and 5.30:1 on the SEO zone's paper.
- **Hairline** (`rgba(42, 33, 26, 0.14)`) and **Soft Hairline** (`rgba(42, 33, 26, 0.08)`): The structural vocabulary. The stronger rule divides the header, footer, and closing notes; the softer one outlines cards.
- **Honey Tints** (`rgba(243, 178, 26, 0.06)` / `0.1` / `0.18`): The washed backgrounds for tinted bands, amber chips, and default chips and tags respectively.
- **Scarf Tint** (`rgba(217, 39, 49, 0.1)`): The clay chip and tag background.

### Named Rules

**The Honey Never Speaks Rule.** `#F3B21A` on cream measures 1.79:1. It may be a dash, a border, a tint, a sweep, or a focus ring, but the moment it must carry a word it becomes `#8F6207`. The same split governs scarf red: `#D92731` decorates, `#A81B24` speaks.

**The Green Belongs to LINE Rule.** Green appears on LINE buttons and nowhere else in the system. It is not an accent, not a success colour, and not available for reuse. Its hover state goes darker, never lighter, so contrast only improves on interaction.

**The Mark Never Sits on Honey Rule.** The bear mark must never be placed on a honey-adjacent background, which is why the hero greeting chip is cream with a honey hairline rather than a honey tint. Every mark's first opaque ancestor background is checked programmatically for this.

## Typography

**Display Font:** Mitr (with Noto Sans Thai, Helvetica Neue, sans-serif)
**Body Font:** IBM Plex Sans Thai Looped (with Noto Sans Thai, Helvetica Neue, sans-serif)

Both load from Google Fonts, Mitr at 500/600 and IBM Plex Sans Thai Looped at 400/500. A Thai-capable face sits immediately after each webfont in the stack rather than a Latin-only fallback, so a failed font load still sets Thai correctly instead of falling into a system serif.

**Character:** Mitr is a rounded, slightly geometric Thai display face that reads friendly rather than corporate; IBM Plex Sans Thai Looped keeps the traditional Thai loop, which is what makes long body copy feel native rather than translated. Together they read as a warm, literate Thai voice: approachable at the headline, unfussy and legible in the paragraph.

### Hierarchy
- **Display** (600, `clamp(1.75rem, 1.25rem + 2.5vw, 3.125rem)`, 1.4): The home hero headline only, carrying the emotional message. It is the single largest object on the site.
- **Headline** (600, `clamp(1.625rem, 1.2rem + 2vw, 2.5rem)`, 1.35): The `h1` on every inner page, with `text-wrap: balance`.
- **Title** (600, `clamp(1.375rem, 1.15rem + 1.2vw, 1.875rem)`, 1.35): Section `h2` headings and the contact band heading. A wider variant (`clamp(1.375rem, 1.1rem + 1.4vw, 2rem)`) exists for pages that want a slightly larger section head.
- **Subtitle** (600, 1.125rem, 1.35): The `h3` default; card headings run slightly larger at 1.0625-1.1875rem.
- **Body** (400, 1rem, 1.78): All running copy. Measure is deliberately short: 32rem for ledes and FAQ answers, 33-34rem for prose columns, 38rem for step bodies.
- **Body Small** (400, 0.9375rem, 1.78): Card copy, nav links, footer links, FAQ answers, and the whole SEO zone.
- **Label** (Mitr 500, 0.8125rem, tracking 0): Section kickers, the hero kicker, step numbers, and tags. Always paired with a 1.5rem honey dash before it in the `.label` pattern.

### Named Rules

**The Zero Tracking Rule.** Small Thai labels carry `letter-spacing: 0`, never positive. Wide tracking detaches Thai vowel and tone marks from their base consonants, which is the loudest sign a Thai page was designed by someone who does not read Thai. Headings carry no negative tracking either: it has no Thai justification and crowds the marks. The only surviving `0.01em` values in the system sit on Latin-only strings, such as the LINE ID and the browser-frame URL.

**The Thai Leading Rule.** Thai display type wants more leading, not less. Body sits at 1.78 and the display line at 1.4, both looser than a Latin equivalent would be, because stacked vowels and tone marks need vertical room. Never tighten display leading below the body-heading value of 1.35.

**The Word Joiner Rule.** Thai has no spaces and browsers break lines with a dictionary that omits loanwords, splitting words mid-syllable. No CSS property fixes this. Hand-written markup uses a `.nb` span (`white-space: nowrap`); text from data files passes through `protectThai()` in `src/utils/thai.ts`, which interleaves U+2060 WORD JOINER. Apply it only to text rendered for a reader, never to `alt`, `<title>`, meta, or structured data.

## Layout

A single centred column, `68rem` wide at most (`--shell`), with `1.375rem` side gutters on mobile widening to `2.5rem` from 48em. Full-bleed colour always comes from a section's own background with the shell nested inside, never from a `100vw` element, which would count the scrollbar and reintroduce horizontal scroll.

Two breakpoints carry the entire system so tiers never disagree: `48em` (tablet) and `64em` (desktop), giving three deliberate compositions rather than one layout that merely survives. Two further breakpoints exist for single mechanical reasons: `22.4em`, below which the header swaps the lockup for the mark alone and the nav steps its gap and size down so four Thai labels still hold one row at 320px, and `63.99em`, below which the inline nav is replaced by the slide-in drawer.

Grid behaviour by tier: offer cards run 1 column on mobile and 2x2 from 48em upward (four across was rejected because it squeezes each card under ~240px and crushes the Thai body line); work cards run 1 / 2 / 3; process steps run 1 / 2; the trust strip runs stacked then 3 across from 48em. The hero stacks in source order on mobile (greeting, credential, headline, CTA, then the portrait) so the LINE CTA lands inside the first viewport at 375px, then splits into `1.15fr 0.85fr` from 48em. An earlier rule put the portrait first (`order: -1`); it was retired because it pushed the CTA below the mobile fold and, until the owner supplies a real photo, spent the whole first screen on a placeholder.

Vertical rhythm: sections are `3.5rem` of block padding on mobile and `5.5rem` from 48em. Inner page heads run `3rem/3.5rem` then `4.5rem/5rem`. The footer is flush against whatever precedes it with no top margin, because a cream gap between a dark contact band and the dark footer read as two disconnected slabs.

Touch density is handled by pointer type, not by width: under `@media (pointer: coarse)` header nav, footer nav, work links, and other short text links take a 44px minimum height without changing the visual design. Drawer links are 48px, and icon buttons are a literal 44x44.

**The Shrinkable Column Rule.** Any grid track holding Thai text uses `minmax(0, 1fr)`, never a bare `1fr`. A bare `1fr` floors at min-content width, and one unbreakable Thai run then pushes the whole card past the viewport.

## Elevation & Depth

The system is flat at rest and layers by tone, not by shadow. Cards sit on the same cream as the page and are separated by a soft hairline; the only depth at rest is `--shadow-sm`, which is faint enough to read as paper texture rather than elevation. Real lift is reserved for interaction: hovering a card raises it 3-4px into `--shadow-md`. Cocoa bands provide the only strong figure-ground separation in the system, and they do it with colour, not depth.

### Shadow Vocabulary
- **Resting paper** (`box-shadow: 0 1px 2px rgba(42, 33, 26, 0.05), 0 4px 12px rgba(42, 33, 26, 0.05)`): Every card, FAQ item, work card, browser frame, and the trust strip, at rest.
- **Lifted** (`box-shadow: 0 2px 4px rgba(42, 33, 26, 0.06), 0 12px 28px rgba(42, 33, 26, 0.1)`): The hover state of any liftable card, the hero portrait, and the mobile drawer.
- **LINE button glow** (`box-shadow: 0 2px 6px rgba(4, 137, 63, 0.3)`, hover `0 8px 18px rgba(4, 137, 63, 0.34)`): The one coloured shadow in the system, tinted to its own green so the button reads as a physical control.

### Named Rules

**The Lift Costs Nothing Rule.** Every hover lift is wrapped in both `@media (hover: hover)` and a `prefers-reduced-motion: reduce` escape that removes the transition and the transform. A touch device never pays for a hover effect it cannot trigger, and a visitor who asked for less motion never sees one.

## Shapes

Rounded but never pill-soft, except where a shape is genuinely a token. The radius ladder is deliberate and each rung has one job:

- **14px** (`--radius`): Cards, offer and work items, steps, FAQ items, icon chips, the browser frame, and the hero portrait. This is the system's default corner.
- **12px**: Buttons, both the LINE button and the quiet outline button, so a control reads as slightly tighter than the card holding it.
- **10px**: Drawer nav items and the header's icon buttons.
- **999px**: True pills, reserved for small badge-like objects: kind tags, the hero greeting chip, the identity chip, and the browser-frame URL field.
- **6px**: The hero highlight sweep.
- **4px**: The focus ring.
- **2px**: The rounded ends of the label dash and the nav underline.

Borders are hairlines, either `rgba(42, 33, 26, 0.14)` for structure or `rgba(42, 33, 26, 0.08)` for card outlines, and they do the work that a heavier shadow would do in another system. Two borders in the system are deliberately thicker at 1.5px: the identity chip's honey outline and the offset accent frame sitting behind the hero portrait.

The recurring silhouette is a soft rectangle on cream with a hairline and almost no shadow, punctuated by a 3.25rem rounded-square icon chip. Nothing is clipped into a non-rectangular shape, and nothing is rotated in layout.

**The Flat Colour Rule.** No gradients anywhere. Where a gradient would be the reflex, the system uses a flat tint instead: the highlight sweep is a solid `rgba(243, 178, 26, 0.18)` block that scales in from the left rather than an animated background wash.

## Components

### Buttons
- **Shape:** Tightly rounded (12px), with the focus ring's radius matched to it.
- **LINE button (primary):** LINE fill `#04893F` with a white label and a hand-drawn white speech-bubble mark, Mitr 600 at 1rem, `0.8125rem 1.375rem` padding, `0.625rem` gap, and its own green-tinted shadow. A `lg` size (`1rem 1.75rem`, 1.0625rem) serves the hero and the contact centrepiece. The label never wraps to `nowrap`: a longer Thai label cannot fit one line at 320px and would push the button past the viewport.
- **LINE hover / active:** Background deepens to `#037A37`, the button rises 2px and its glow expands; `:active` returns it to rest. Under reduced motion, neither transform runs.
- **Quiet button (secondary):** Paper ground, cocoa label, hairline border, same 12px and padding as the LINE button. On hover the border goes full cocoa and the button lifts 2px into the resting shadow. Inside a cocoa band it inverts: transparent ground, white label, `rgba(255, 249, 237, 0.42)` border, hovering to a white border over an 8% white wash.

**The One Loud Button Rule.** The LINE button is the only filled, coloured control in the system. Every other action is a quiet outline or a text link, so the single thing the site wants a visitor to do is never competing with a second thing that looks equally urgent.

### Chips
- **Icon chip:** A 3.25rem rounded square (14px) holding a 24px hand-drawn icon, in three variants: default honey tint at 18% with cocoa strokes, amber (`tint-honey` with `#8F6207`), and clay (`tint-scarf` with `#A81B24`). The `-ink` colours are used rather than the decorative tones because at a 1.75 stroke the lighter amber read washed out; the variants measure 5.58:1, 6.20:1, and 7.85:1 against their own tints.
- **State:** When the card containing it is hovered on a hover-capable pointer, the chip tilts `-4deg` and scales to 1.06. Removed entirely under reduced motion.
- **Tag:** A 999px pill in Mitr 500 at 0.75rem with zero tracking, in the same three tint-and-ink variants, one per project kind.
- **Greeting and identity chips:** Both 999px. The greeting chip is cream with a 55%-opacity honey hairline (never a honey tint, because it holds the bear mark). The identity chip is honey tint with a 1.5px honey border and `#8F6207` text, deliberately bordered rather than filled so it reads as a credential beside the softer greeting chip.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Paper `#FFF9ED`, the same value as the page, so the hairline and not the fill is what separates the card.
- **Shadow Strategy:** Resting paper shadow at rest, lifted on hover. See Elevation & Depth.
- **Border:** 1px soft hairline `rgba(42, 33, 26, 0.08)`.
- **Internal Padding:** `1.25-1.5rem` on mobile, `1.75rem` from 48em. Grid gaps run `1.25rem` mobile to `1.5-1.75rem` desktop.

### Navigation
- **Header:** Sticky, paper ground, one hairline underneath, with the brand lockup at 44px tall (rendering 110px wide, clearing the brand's 100px lockup floor) opposite four Thai nav labels in muted 0.9375rem. Below 22.4em the lockup becomes the mark alone and the nav steps down to 0.8125rem with a tighter gap.
- **Link states:** Muted at rest, deep ink on hover, cocoa when current. A 2px cocoa underline grows from the left on hover (`scaleX(0)` to `1`, 260ms) and sits permanently expanded on the current page.
- **Mobile drawer:** Below 64em, and only once JS has marked the document, the inline nav is replaced by a 44px hamburger opening a `min(19rem, 82vw)` cream panel from the right, at 280ms with a `rgba(42, 33, 26, 0.45)` overlay. Inside: the bear mark and wordmark on cream, nav items as 48px 10px-radius rows in Mitr 500 with the current page marked by a honey tint, and the LINE button pinned to the bottom. It scrolls on short viewports and slides only when motion is allowed.

**The No-JS Nav Rule.** The inline nav is the default and the fallback: it renders as a normal row at every width, and only `html.js` hides it in favour of the drawer. Navigation never depends on JavaScript.

### FAQ Accordion
One pattern site-wide, built on native `<details>`/`<summary>` so it opens without JS. A 14px card with a soft hairline and the resting shadow, a 44px-minimum summary row in Mitr 500, a honey-tint hover wash, and a plus sign drawn from two 2px CSS bars where the vertical one rotates away on open. Questions sit outside the heading levels entirely so the outline stays h1 to h2 to h3 with no skips. Answers are muted 0.9375rem on a 32rem measure.

### Icons
A hand-drawn set in `src/components/Icon.astro`: a 24px grid, no fill, `currentColor` stroke at 1.75 with round caps and joins. Thirteen icons cover the site's actual needs. Every one is decorative, sits beside its own Thai label, and is hidden from assistive tech. Icons drawn here are drawn deliberately, not copied: the hamburger and the drawer close mark match the same grid and stroke, and the LINE speech bubble is drawn by hand rather than pulled from a downloaded brand asset.

### Image Placeholder
Every image slot on the site is a placeholder component carrying real descriptive Thai `alt` text plus a small visible Thai label telling the owner what image belongs there. The placeholder shows a hairline border over a 6% honey tint; the moment a real `src` replaces the data-URI, a `:has()` rule clears both the border and the label with no markup edit. Default aspect ratio is 16/10.

### Browser Frame
A signature component wrapping portfolio screenshots in browser chrome so work reads as a shipped site rather than a grey box: a 14px frame with a cream title bar, three 0.5rem dots at 16% cocoa, and a 999px URL pill in muted 0.75rem that ellipsises rather than forcing the row wider than 320px. The whole bar is `aria-hidden`, because the domain is already in the card heading and the link.

### Motion
CSS and SVG only, never GIFs. The system's signature easing is `cubic-bezier(0.22, 0.61, 0.36, 1)`, used for the scroll reveal (620ms), the drawer slide (280ms), the chip tilt (260ms), and the hero highlight sweep (720ms, delayed 240ms). Plain `ease` at 180-260ms covers hover lifts, the nav underline, and the FAQ sign. Grid children stagger via `.reveal-d1` / `-d2` / `-d3` at 90 / 180 / 270ms.

The scroll reveal is double-gated: the hidden start state applies only when JS is present and the visitor has not asked for reduced motion, so without JS or with reduced motion, content is simply visible. Only opacity and transform ever animate, never `display` or `visibility`.

### Focus System
One treatment everywhere, keyboard-only via `:focus-visible`: a 2px ring at 3px offset with a 4px radius. Cocoa on light surfaces and honey inside the footer and CTA band, both clearing the 3:1 non-text floor (cocoa on cream 14.22:1, honey on cocoa 7.95:1, and the ring against the LINE button's own green 3.31:1). The LINE button's ring takes a 12px radius to match its own corner.

## Do's and Don'ts

### Do:
- **Do** use `#8F6207` for any honey-coloured word and `#A81B24` for any red one. Full-strength `#F3B21A` and `#D92731` are for dashes, tints, borders, sweeps, and focus rings only.
- **Do** keep every hover lift, tilt, and slide behind both `@media (hover: hover)` and `prefers-reduced-motion: reduce`.
- **Do** draw any new icon by hand on the same 24px grid at 1.75 stroke with round caps and joins, in `src/components/Icon.astro`.
- **Do** run any Thai string that comes from a data file through `protectThai()` before rendering it for a reader, and leave `alt`, `<title>`, meta, and JSON-LD strings raw.
- **Do** keep Thai measures short: roughly 32-34rem for prose, 38rem for step bodies.
- **Do** use `minmax(0, 1fr)` for any grid track holding Thai text.
- **Do** give every image slot the placeholder component with real descriptive Thai `alt` text.
- **Do** use the two real breakpoints, 48em and 64em, for anything compositional.

### Don't:
- **Don't** put `#F3B21A` behind or on text. On cream it measures 1.79:1.
- **Don't** use green anywhere except a LINE button, and don't lighten a LINE button on hover.
- **Don't** place the bear mark on a honey-adjacent background. Use cream with a honey hairline instead.
- **Don't** add a gradient. The system is flat colour only, including the highlight sweep.
- **Don't** add positive tracking to small Thai labels or negative tracking to headings. `letter-spacing: 0`, except on Latin-only strings.
- **Don't** introduce an icon library, an icon font, or a generic icon set.
- **Don't** put emoji, em dashes, or en dashes in visible copy.
- **Don't** put technical vocabulary in visible copy. Outcomes go in plain Thai; the two narrow exceptions are recorded in the site spec.
- **Don't** add a GIF, an autoplaying animation, or motion that gates content visibility without JS.
- **Don't** use `100vw` for a full-bleed band. Let the section's own background bleed and nest the shell inside.
