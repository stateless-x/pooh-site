/**
 * Content for /en/fix-ai-website.
 *
 * The English audience for this page is the global wave of half-finished
 * AI-generated sites: someone got roughly to the end with a tool, cannot get
 * over the line, and has no idea whether what they have is salvageable. The
 * angle is "you got most of the way, I get you launched" - never shaming,
 * because he uses AI daily himself.
 *
 * This is a ONE ROUND inspection and repair offer, not ongoing maintenance
 * and not emergency support. The page says so plainly, because the wrong
 * enquiry costs both sides time.
 */
export interface QA {
	q: string;
	a: string;
}

/**
 * The six bounded symptom groups, named the way an owner sees them on screen
 * rather than in implementation terms.
 */
export const enRepairCategories: { title: string; body: string }[] = [
	{
		title: "You hit publish and nothing happened",
		body: "The site works in the builder and dies in the real world. Usually the domain is not pointing where it should, or the thing only ever existed in a preview. Boring to fix once you know which one it is.",
	},
	{
		title: "It looks right on a laptop and falls apart on a phone",
		body: "Text running off the edge, buttons too small to hit, a menu that will not open. Most of your visitors are on a phone, so this is not a cosmetic issue. It is the whole shop window.",
	},
	{
		title: "Forms submit into nowhere",
		body: "Someone fills in your contact form, hits send, and it goes nowhere. You never find out, and neither do they. This is the most expensive bug on this list because you cannot see it happening.",
	},
	{
		title: "Logins are wrong, or people see things they should not",
		body: "Accounts that will not let the right person in, or worse, let the wrong person see the owner's screens. I sort out who can reach what before it becomes the kind of problem you have to write an apology about.",
	},
	{
		title: "It is slow, or fixing one thing breaks another",
		body: "The classic sign that the inside is tangled. I find what is actually causing it, keep the parts that work, and rebuild only the parts that keep biting you, so the next change stops being a gamble.",
	},
	{
		title: "Google cannot read it, or has not found it",
		body: "Page titles, descriptions, the real content, and what shows up when someone shares a link. If search engines cannot make sense of your site, you are invisible no matter how good it looks.",
	},
];

export const enFixAiFaq: QA[] = [
	{
		q: "What kind of AI built sites do you take on?",
		a: "Business sites, service and landing pages, and small systems with a clear purpose. The best fit is a site that is nearly there but stuck on publishing, phones, forms, logins, speed, or search. I look at the real thing before I say yes to anything, then tell you exactly which parts I will fix.",
	},
	{
		q: "What will you turn down?",
		a: "Work with no source files and no access, because I cannot fix what I cannot open. Anything needing someone on call around the clock, because this is one job at a time, not a support contract. And large systems so tangled together that no one can draw a line around a piece of it yet. If repairing it is not worth your money, I will tell you that before you spend any.",
	},
	{
		q: "Do I have to scrap it and start over?",
		a: "Usually not, and I cannot tell you either way until I have seen it. Plenty of these keep their look and their content and only need the parts blocking launch fixed. Some need a section rebuilt because propping it up costs more than replacing it. I lay out the options with the reasoning and you decide, not me.",
	},
	{
		q: "Is this a monthly retainer?",
		a: "No. This is one job at a time. Before I start we agree what gets fixed, what gets delivered, and what counts as finished. When it is done, it is done. If something new comes up later, we look at it as a new job. I would rather be clear about that than have you expecting cover I am not providing.",
	},
	{
		q: "What should I send you?",
		a: "The link, the tool you built it with, and a sentence about what is going wrong. If you have the files or an admin login, mention it. Do not tidy anything up first. I want to see the actual state of it, because the mess is the information I need to give you a real answer.",
	},
	{
		q: "I feel stupid asking. Is this a normal thing to need help with?",
		a: "It is extremely normal, and no, you did nothing wrong. These tools genuinely get you most of the way, and then the last stretch turns out to need someone who has shipped things before. I use AI every day myself. Getting stuck at this exact point is the rule, not the exception.",
	},
];
