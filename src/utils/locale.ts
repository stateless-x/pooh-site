/**
 * The one place that knows which Thai page pairs with which English page.
 *
 * Four consumers read this map and they must never disagree: the hreflang
 * alternate tags, the visible TH/EN switcher href, the browser-language
 * detection script in the Thai head, and the nav's aria-current matching.
 * Duplicating the pairing in any of them is how an hreflang ends up pointing
 * at a page that does not exist.
 *
 * The pairing is EXPLICIT, never a string prefix. `/blog` is Thai-only, so
 * "/en" + pathname would emit an alternate pointing at a 404 and would bounce
 * a detected English reader into nothing. A path absent from this map simply
 * has no counterpart, which every consumer handles by omitting the alternate
 * and hiding the switch.
 */
export type Lang = "th" | "en";

/** Thai path -> English path. Thai paths are the canonical keys. */
const TH_TO_EN: Record<string, string> = {
	"/": "/en/",
	"/about": "/en/about/",
	"/work": "/en/work/",
	"/contact": "/en/contact/",
	"/backoffice": "/en/backoffice/",
	"/fix-ai-website": "/en/fix-ai-website/",
	"/budget-factors": "/en/budget-factors/",
	// Both 404s are noindex; they are paired so the switcher still works if a
	// visitor lands on one, and so the alternates stay symmetric.
	"/404": "/en/404/",
	// Deliberately absent: /blog. The blog is Thai-only, so it carries a th
	// alternate and x-default but no en alternate, and its switcher is hidden.
};

const EN_TO_TH: Record<string, string> = Object.fromEntries(
	Object.entries(TH_TO_EN).map(([th, en]) => [normalize(en), th])
);

/**
 * One normalisation used everywhere: strip trailing slashes so "/work/" and
 * "/work" are the same key, but keep the root as "/".
 *
 * The layout previously normalised only for nav matching while canonical used
 * the raw pathname. Alternates and canonical must be built from the same
 * function or Google sees a mismatched URL pair (canonical "/work/" declaring
 * an alternate for "/work").
 */
export function normalize(pathname: string): string {
	return pathname.replace(/\/+$/, "") || "/";
}

/** Which edition a path belongs to, decided by the /en/ prefix alone. */
export function langOf(pathname: string): Lang {
	const p = normalize(pathname);
	return p === "/en" || p.startsWith("/en/") ? "en" : "th";
}

/**
 * The Thai and English paths for one page, as a pair. Either side is
 * undefined when that edition has no counterpart, which is the case the
 * callers branch on rather than guessing.
 *
 * Returned paths carry the trailing slash Astro's directory build serves
 * (except the 404, which is a file), so canonical and alternate agree.
 */
export function alternates(pathname: string): { th?: string; en?: string } {
	const p = normalize(pathname);

	if (langOf(p) === "en") {
		const th = EN_TO_TH[p];
		// An English page always knows its own URL; only the Thai counterpart
		// can be missing, and today every English page has one.
		return { th: th === undefined ? undefined : withSlash(th), en: withSlash(p) };
	}

	const en = TH_TO_EN[p];
	// The map's values are written with their trailing slash for readability,
	// so normalise before re-adding it rather than doubling it.
	return { th: withSlash(p), en: en ? withSlash(normalize(en)) : undefined };
}

/**
 * Astro's directory build serves routes as `path/index.html`, so links and
 * canonical URLs carry a trailing slash.
 *
 * The 404 routes are the odd case: they build as `404.html`, a file, yet the
 * Thai page has always emitted `https://pooh.fyi/404/` as its canonical
 * because the layout used the raw pathname. Both pages are `noindex`, so the
 * trailing slash costs nothing, and keeping it means the Thai output does not
 * change. Uniformity here is not worth a byte of churn in the Thai edition.
 */
function withSlash(path: string): string {
	return path === "/" ? "/" : `${path}/`;
}

/**
 * Where the language switcher points from the page currently being rendered.
 * Undefined means this page has no counterpart in the other edition, so the
 * switch renders as a disabled-looking current-only state rather than a link
 * into a 404.
 */
export function switchTarget(pathname: string, to: Lang): string | undefined {
	const pair = alternates(pathname);
	return to === "en" ? pair.en : pair.th;
}
