# pooh-site

Thai-language freelance site for ภูรินท์ (Pooh), Business Technology Engineer.
Static Astro site in two editions (Thai at the root, English under `/en/`), no
client framework. three.js loads lazily in the home hero only. Live at pooh.fyi;
the domain is set in `site.config.mjs` and `public/robots.txt`.

## Commands

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm install`     | Install dependencies                      |
| `npm run dev`     | Dev server at `localhost:4321`            |
| `npm run build`   | Build to `./dist/` (19 pages + sitemap)   |
| `npm run preview` | Preview the production build              |
| `npm run model`   | Rebuild the 3D bear and its poster (Blender) |
| `npm run portrait` | Regenerate the portrait image set        |

## Structure

- `site.config.mjs` — single source of truth for site name, URL, LINE ID,
  GitHub, person identity. Edit here; propagates to canonical/OG/schema/
  sitemap/llms.txt on build. `public/robots.txt` is the one manual mirror.
- `src/pages/` — index, about, backoffice, budget-factors, fix-ai-website, work,
  contact, philosophy, blog, 404, each mirrored under `en/` except blog.
- `src/components/PoohStage.astro` + `src/lib/pooh-stage/` — the home hero's 3D
  bear; `scripts/build-pooh-model.py` is its editable master.
- `src/data/now.ts` + `src/data/en/now.ts` — the dated update notice at the top
  of every page. Edit these when the month changes.
- `src/data/` — page content (works, FAQs, budget factors) consumed by pages.
- `src/components/ThaiText.astro` + `src/utils/thai.ts` — whole-word Thai
  line-break protection without invisible characters.
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
- [docs/adr/](docs/adr/) — decisions: the English edition's voice (0001, 0002)
  and the lazy three.js hero (0003).
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
