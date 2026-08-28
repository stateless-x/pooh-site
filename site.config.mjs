/**
 * Single source of truth for site-wide constants.
 *
 * Imported by astro.config.mjs AND by pages/layout, so one edit here
 * propagates to canonical URLs, Open Graph, the sitemap, JSON-LD, and every
 * visible mention.
 *
 * MANUAL TOUCHPOINT: `public/robots.txt` is served as static text and cannot
 * import this file. Its `Sitemap:` line must be edited by hand alongside
 * SITE_URL. That is the only place a domain is duplicated.
 */

/** TODO (owner, before deploy): the owner is deciding between pooh.fyi and pooh.me. */
export const SITE_URL = "https://REPLACE-WITH-DOMAIN.example";

export const SITE_NAME = "Pooh";

export const PERSON_NAME = "ภูรินท์";
export const PERSON_TITLE = "Business Technology Engineer";
export const IDENTITY_PHRASE = "นักพัฒนาเทคโนโลยีเพื่อธุรกิจ";
export const EXPERIENCE = "มากกว่า 7 ปี";

export const LINE_ID = "bobroach";
export const LINE_URL = `https://line.me/ti/p/~${LINE_ID}`;

export const GITHUB_URL = "https://github.com/stateless-x";
