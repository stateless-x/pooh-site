# Blog plan

status: planned, not built · owner decision pending on subdomain vs subfolder
updated: 2026-08-28

Plan for adding a blog to the Pooh site, optimized for: easy posting,
writing from Obsidian, and SEO. Nothing here is implemented yet.

## Decision 1: URL — recommend /blog, not blog.pooh.xxx

The owner asked about `blog.<domain>`. Recommendation: **serve the blog at
`<domain>/blog` instead.**

- The domain is brand-new with zero authority. A subdomain is treated as a
  largely separate site by search engines; a subfolder pours every blog
  backlink and ranking signal into the same domain the service pages need.
  With no other authority source (owner chose no big content push), this
  matters more than usual.
- Operationally simpler: same repo, same build, same deploy, shared layout,
  shared `site.config.mjs`.
- If the blog someday needs to be a different product (different design,
  different audience), migrating /blog to a subdomain with redirects is easy;
  the reverse move loses accumulated authority.

If the owner still prefers the subdomain: same content structure below moves
to a second Astro app (`apps/blog/`) deployed as its own Cloudflare Pages
project with `BLOG_URL` added to `site.config.mjs`. Everything else in this
plan is unchanged.

## Decision 2: CMS — recommend git-based markdown, add Keystatic only if wanted

Ranked for this owner (lives in Obsidian, technical, solo):

1. **Plain markdown in the repo (recommended start).** Posts are `.md`
   files in `src/content/blog/`. Publishing = add file, commit, push; the
   host auto-deploys. Zero cost, zero lock-in, and Obsidian can open the
   folder directly. A CMS can be layered on later without moving content.
2. **Keystatic** (add when browser editing is wanted): git-based CMS that
   commits to this same repo, first-class Astro support, free. Gives a
   friendly editing UI (e.g. posting from a phone) without changing the
   storage format.
3. Not recommended: Decap (dated UX), Sanity/Contentful (hosted, costs,
   overkill for one writer, and content leaves the repo).

## Folder structure (in this repo)

```
purin-dev-site/
├─ site.config.mjs               # add BLOG_TITLE, POSTS_PER_PAGE
├─ scripts/
│  └─ publish-from-obsidian.mjs  # optional vault sync, see below
└─ src/
   ├─ content.config.ts          # zod schema for the blog collection
   ├─ content/
   │  └─ blog/
   │     ├─ 2026/
   │     │  └─ my-first-post.md  # slug = filename
   │     └─ _drafts/             # draft: true or underscore-prefixed = unpublished
   ├─ layouts/
   │  └─ BlogPost.astro          # Article JSON-LD, OG tags, author block
   └─ pages/
      └─ blog/
         ├─ index.astro          # list + tag filter, paginated
         ├─ [slug].astro         # renders the collection entry
         └─ rss.xml.ts           # RSS via @astrojs/rss
```

Post frontmatter schema (enforced in `content.config.ts`):

```yaml
title: ""            # required
description: ""      # required, becomes meta description
pubDate: 2026-08-28  # required
updatedDate:         # optional
tags: []             # optional
cover: ""            # optional, /public path
draft: false         # true = excluded from build
```

Existing site rules that carry over: Thai copy conventions, `protectThai()`
on rendered titles/body where loanwords appear, the no-emoji/no-dash rule,
and design tokens from `Layout.astro`. Blog pages get `Article` JSON-LD with
`Person` author pulled from `site.config.mjs`, and posts join `sitemap` and
`llms.txt` automatically at build.

## Obsidian workflow

Two supported modes; both can coexist:

- **Direct**: open `src/content/blog/` as an Obsidian vault folder and write
  there. Frontmatter template saved as an Obsidian template. Wikilinks must
  not be used in this folder (plain markdown links only).
- **Vault sync (optional script)**: notes in the Mindpalace vault gain
  `publish: true` frontmatter; `scripts/publish-from-obsidian.mjs` copies
  them into `src/content/blog/`, converting `[[wikilinks]]` to plain text or
  resolved links, copying referenced images into `public/blog/`, and
  stripping vault-only callouts. The vault stays the source of truth for
  thinking; the repo holds the published artifact. Never sync automatically;
  run by hand so nothing private ships by accident.

## SEO notes (applies when built)

- Blog exists to win informational queries (วิธี..., ...ดีไหม) and funnel to
  the service pages; every post ends with one contextual link to a service
  page plus the LINE CTA, per the wolf-skill ladder.
- Titles/descriptions follow the same measured-length process as the site;
  question-shaped H2s with 40-55 word self-contained answers for snippet and
  AI-citation extraction.
- RSS + `Article` schema + consistent author entity (ภูรินท์ (Pooh),
  Business Technology Engineer) reinforce the GEO identity work.

## Done-conditions for the build task (when the owner says go)

1. `npm run build` emits /blog index, N post pages, RSS; sitemap includes them.
2. A sample post written in Obsidian renders correctly with Thai typography
   (no mid-word loanword breaks at 320-1366).
3. Blog pages pass the site's standing greps (pricing, dashes, emoji).
4. Nav decision applied (likely: บทความ added to footer, header unchanged).
