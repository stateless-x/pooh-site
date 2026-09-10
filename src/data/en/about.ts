/**
 * Content for the English home page "About me" section.
 *
 * A native rewrite, not a translation of src/data/about.ts: the English reader
 * is colder traffic hiring across a distance, and the carve-out in PRODUCT.md
 * allows technical vocabulary where it builds trust. English pages skip
 * the ThaiText display component entirely.
 */

export const aboutParagraphs = [
	"I am Purin Buriwong, though most people call me Pooh. I am a freelance developer in Bangkok, Thailand, and I have been building software for over seven years. That means I started before AI could write code, and I use it now the way a developer does rather than as a shortcut around understanding things.",
	"I also run pawjai.co myself, so I know what it is like to still be looking after something two years after launch.",
	"Work arrives in stages you can see, and everything is yours at the end. If you ever want someone else to take it over, nothing stops you.",
] as const;

/** Link that follows the second paragraph. */
export const aboutLink = {
	href: "/en/about/",
	label: "A bit more about how I work",
} as const;

/**
 * The same belief as the Thai quote, written for this reader rather than
 * translated. Not a testimonial: the site carries no client quotes.
 */
export const aboutQuote = {
	text: "AI can do almost anything now. But putting up a cathedral and keeping one standing are two different problems, and if the foundation is wrong, it comes down eventually. That is the part I want you to be sure about before we build anything.",
	attribution: "Purin Buriwong",
} as const;

export const portraitAlt = "Purin Buriwong at his desk in Bangkok, Thailand";
