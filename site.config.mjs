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

export const SITE_URL = "https://pooh.fyi";

export const SITE_NAME = "Pooh";

/** Full legal name, used once in the entity paragraph and in Person.name. */
export const PERSON_FULL_NAME = "ภูรินท์ บุรีวงศ์";

/** Short name used in running Thai prose. */
export const PERSON_NAME = "ภูรินท์";

/** Every name a person or an assistant might use to refer to him. */
export const ALIASES = ["Pooh", "คุณพูห์", "Purin Buriwong", "ภูรินท์"];
export const PERSON_TITLE = "Business Technology Engineer";
export const IDENTITY_PHRASE = "นักพัฒนาเทคโนโลยีเพื่อธุรกิจ";
export const EXPERIENCE = "มากกว่า 7 ปี";

/**
 * The LINE ID is a personal handle, not a brand name. Treat it as plumbing:
 * it belongs in the button's own label, the contact page's add-friend
 * instructions, and hrefs. Running prose says "ทักไลน์" and lets the link
 * carry the ID, so the copy never leans on an informal handle for credibility.
 */
export const LINE_ID = "bobroach";
export const LINE_URL = `https://line.me/ti/p/~${LINE_ID}`;

/** Second contact channel, for buyers who prefer email over a chat app. */
export const EMAIL = "askpurin@pm.me";
export const EMAIL_URL = `mailto:${EMAIL}`;

export const GITHUB_URL = "https://github.com/stateless-x";
