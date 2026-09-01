/**
 * Shared structured data for the English edition.
 *
 * The English pages describe the SAME person as the Thai pages, so the alias
 * list stays the site-wide one from site.config.mjs: a retrieval bot matching
 * "Pooh", "ภูรินท์", or "Purin Buriwong" must resolve to one entity, not two.
 * What changes is the register: `name` leads with the Latin spelling and the
 * descriptions are written for an English-language query.
 *
 * Only facts already stated in visible copy appear here. No client counts, no
 * ratings, no metrics.
 */
import {
	ALIASES,
	PERSON_FULL_NAME,
	PERSON_TITLE,
	EMAIL,
	GITHUB_URL,
} from "../../site.config.mjs";
import { works } from "../data/works";

/** Absolute URL for a path, given the configured site origin. */
function abs(path: string, site: URL | undefined): string {
	return new URL(path, site).href;
}

/**
 * The English Person node. `description` is written to survive being quoted
 * alone: it says who he is, what he does, and how to reach him in one
 * self-contained passage.
 */
export function enPerson(site: URL | undefined) {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Purin Buriwong",
		// Thai full name included so the two editions describe one entity.
		alternateName: [...ALIASES, PERSON_FULL_NAME],
		jobTitle: PERSON_TITLE,
		description:
			"Purin Buriwong, who goes by Pooh, is a senior software engineer in Bangkok, Thailand. He has more than seven years of experience, he worked on the developer team at Agoda, and he founded and still runs pawjai.co. He builds business websites and internal work systems for owners in Thailand and for remote clients abroad, and he maintains what he ships. Reach him by email at askpurin@pm.me.",
		email: EMAIL,
		url: abs("/en/", site),
		address: {
			"@type": "PostalAddress",
			addressLocality: "Bangkok",
			addressCountry: "TH",
		},
		knowsLanguage: [
			{ "@type": "Language", name: "Thai", alternateName: "th" },
			{ "@type": "Language", name: "English", alternateName: "en" },
		],
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: "Mahidol University International College",
		},
		worksFor: {
			"@type": "Organization",
			name: "pawjai.co",
			url: "https://pawjai.co",
		},
		knowsAbout: [
			"Business websites",
			"Internal business systems and back office software",
			"Order, inventory, customer and team workflow systems",
			"Technology consulting for business owners",
			"Repairing AI generated websites",
			"TypeScript",
			"React",
			"Next.js",
			"Node.js",
			"Astro",
			"Python",
			"Ruby on Rails",
			"PostgreSQL",
			"Web performance and technical SEO",
			"Software architecture and system design",
		],
		// Only work that is actually serving on its domain, matching the Thai
		// side's rule: an unpublished entry would point at a dead host.
		sameAs: [
			...works.flatMap((w) => (w.url ? [new URL(w.url).href] : [])),
			GITHUB_URL,
		],
	};
}

/** Two-level breadcrumb, English labels, rooted at the English home. */
export function enBreadcrumb(
	site: URL | undefined,
	name: string,
	path: string
) {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: abs("/en/", site),
			},
			{
				"@type": "ListItem",
				position: 2,
				name,
				item: abs(path, site),
			},
		],
	};
}

/** FAQPage built from the same array the visible list renders. */
export function enFaqPage(items: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.q,
			acceptedAnswer: { "@type": "Answer", text: item.a },
		})),
	};
}
