# pooh-site

Thai-language freelance site for ภูรินท์ (Pooh), Business Technology Engineer.
Static Astro site, seven pages, no client framework. Live domain pending
(pooh.fyi vs pooh.me) — set once in `site.config.mjs` and `public/robots.txt`.

## Commands

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | Install dependencies                      |
| `npm run dev`     | Dev server at `localhost:4321`            |
| `npm run build`   | Build to `./dist/` (7 pages + sitemap)    |
| `npm run preview` | Preview the production build              |

## Structure

- `site.config.mjs` — single source of truth for site name, URL, LINE ID,
  GitHub, person identity. Edit here; propagates to canonical/OG/schema/
  sitemap/llms.txt on build. `public/robots.txt` is the one manual mirror.
- `src/pages/` — index, backoffice, budget-factors, fix-ai-website, work,
  contact, 404.
- `src/data/` — page content (works, FAQs, budget factors) consumed by pages.
- `src/utils/thai.ts` — Thai loanword line-break protection (U+2060).
- `public/brand/` — Pooh mark, lockup, wordmark, favicon set.

## Docs

- [PRODUCT.md](PRODUCT.md) — product truth for design tooling (Impeccable):
  users, positioning, hard rules, brand commitments. Update when facts change.
- [DESIGN.md](DESIGN.md) — the incumbent v3 visual system, machine-readable
  frontmatter + prose rules; sidecar in `.impeccable/design.json`. Code is
  canon; this documents it.
- [docs/site-spec.md](docs/site-spec.md) — the living spec: hard content
  rules, brand system (v3), page inventory, verification assertions. Read
  before changing copy or design.
- [docs/blog-plan.md](docs/blog-plan.md) — planned blog architecture
  (/blog vs subdomain, Obsidian workflow, CMS options). Not built yet.
- [docs/visitor-scoring-rubric.md](docs/visitor-scoring-rubric.md) — rubric
  for customer-persona site scoring.
- [docs/designer-scoring-rubric.md](docs/designer-scoring-rubric.md) — rubric
  for design-professional scoring.

## Before launch (owner checklist)

1. Real photos into the `ImagePlaceholder` slots (swap `src` only), LINE QR,
   `public/og.png` (1200x630).
2. Domain into `site.config.mjs` + `public/robots.txt`.
3. Deploy `dist/` (Cloudflare Pages or similar) with auto-deploy on push.
