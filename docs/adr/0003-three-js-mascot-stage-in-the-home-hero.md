# 0003. The home hero is a lazy three.js mascot stage, as the one exception to CSS-and-SVG motion

Date: 2026-11-05
Status: accepted

## Context

The owner asked for a playful 3D mascot on the home page. The system said "CSS and SVG only", no autoplaying animation, and limited dependencies to `astro` and `@astrojs/sitemap`. The visitor is a Thai business owner on a phone deciding within one visit, so a slower first paint or a hidden call to action would cost more than the delight is worth.

## Decision

We will replace the home hero illustration, in both editions, with a three.js stage that loads behind a still poster. The poster is the first paint and the fallback. The up-front script stays about 2 KB and only decides whether to `import()` the scene, once the stage is near the viewport and the browser is idle. Reduced motion, data saver, and no WebGL2 all keep the poster and download nothing more. This is the only place three.js or a canvas may appear.

## Alternatives considered

- **Scroll-scrubbed pre-rendered frames, no three.js** — far lighter, but it cannot do the poke, the spin, or the moods, which are the point of the request.
- **A floating mascot on every page** — it would cover content on phones, compete with the LINE button, and spend the bundle on pages the visitor came to read.
- **Load three.js up front** — simpler code, but it puts about 180 KB of compressed script on the critical path of a site that otherwise ships almost none.

## Consequences

Easier: the mascot can react to the visitor, and the first load is unchanged in script weight apart from the 2 KB bootstrap and a 22 KB poster. Harder: there is now a 697 KB lazy chunk and a 224 KB model to keep small, a third runtime dependency, and an animation that cannot be checked by reading CSS. The poster must match the live first frame, so the camera, lights, and shadow are a contract between `scripts/build-pooh-model.py` and `src/lib/pooh-stage/index.ts`.

## Rollback

Put `ImagePlaceholder` with `pooh-at-work.webp` and the `.photo-frame` styles back in both home pages, delete `src/components/PoohStage.astro` and `src/lib/pooh-stage/`, and remove `three`, `@types/three`, and `chunkSizeWarningLimit`. No other page depends on any of it.
