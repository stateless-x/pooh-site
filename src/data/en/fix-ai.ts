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
		body: "The site works in the builder but not on the real address. Usually the domain is not pointing where it should, or the site only ever existed in a preview. Once we know which of those it is, it is normally a small fix.",
	},
	{
		title: "It looks right on a laptop and falls apart on a phone",
		body: "Text running off the edge, buttons too small to tap, a menu that refuses to open. Most of your visitors arrive on a phone, so this is not a cosmetic problem. It is the whole shop window.",
	},
	{
		title: "Forms submit into nowhere",
		body: "Someone fills in your contact form, hits send, and it goes nowhere. You never find out, and neither do they. This one is worth checking early, because unlike the others there is nothing on screen to tell you it is happening.",
	},
	{
		title: "Logins are wrong, or people see things they should not",
		body: "Accounts that will not let the right person in, or that let the wrong person see the owner's screens. I sort out who can reach what, which is worth doing before a customer finds it first.",
	},
	{
		title: "It is slow, or fixing one thing breaks another",
		body: "That usually means things are tangled together underneath. I look for what is actually causing it, keep the parts that work, and rebuild only the parts that keep causing trouble, so the next change is less of a gamble.",
	},
	{
		title: "Google cannot read it, or has not found it yet",
		body: "Page titles, descriptions, the actual content, and what appears when someone shares a link. If search engines cannot make sense of your site, you are effectively invisible no matter how good it looks.",
	},
];

export const enFixAiFaq: QA[] = [
	{
		q: "What kind of AI built sites do you take on?",
		a: "Business sites, service and landing pages, and small systems with a clear purpose. The best fit is a site that is nearly there but stuck on publishing, phone layouts, forms, logins, speed, or search. I look at the real thing before agreeing to anything, then tell you exactly which parts I would fix.",
	},
	{
		q: "What would you turn down?",
		a: "Work where there are no source files and no access, because I cannot fix what I cannot open. Anything that needs someone on call around the clock, because I take these one job at a time rather than as a support contract. And large systems so tangled together that we cannot yet draw a line around one piece. If I do not think repairing it is worth your money, I will tell you that before you spend any.",
	},
	{
		q: "Do I have to scrap it and start over?",
		a: "Usually not, and I cannot tell you either way until I have seen it. Plenty of these keep their look and their content and only need the parts blocking launch fixed. Some need a section rebuilt because propping it up costs more than replacing it. I lay out the options with the reasoning and you decide, not me.",
	},
	{
		q: "Is this a monthly retainer?",
		a: "No, I take these one job at a time. Before I start we agree what gets fixed, what gets delivered, and what counts as finished. When that is done, it is done. If something new comes up later we look at it as a new job. I would rather be clear about that up front than have you expecting cover I am not actually providing.",
	},
	{
		q: "What should I send you?",
		a: "The link, the tool you built it with, and a sentence about what is going wrong. If you have the files or an admin login, mention it. Do not tidy anything up first. I want to see the actual state of it, because the mess is the information I need to give you a real answer.",
	},
	{
		q: "Can I keep editing my site while a developer is working on it?",
		a: "Better not to, and this applies to most developers rather than just me. When I start a job I take the latest version you hand over, and that becomes the single working copy. If you keep editing your own copy at the same time, the two drift apart, and merging them and resolving the conflicts falls to you. Far simpler to pause your edits for the duration, or tell me what you want changed so I can make it in the version I already have.",
	},
	{
		q: "What happens if I change something after you hand the work back?",
		a: "The site is yours, so you are free to change it. But once I have handed it back, changes you make yourself are outside what I am responsible for. If one of them breaks something and you would like me to fix it, that is separate work and is charged as new work, because I first have to investigate what changed and how far the effects reach before I can safely touch anything. If you are unsure whether a change is risky, ask me before you make it. That conversation costs nothing.",
	},
	{
		q: "I feel stupid asking. Is this a normal thing to need help with?",
		a: "It is extremely normal, and no, you did nothing wrong. These tools genuinely get you most of the way, and then the last stretch turns out to need someone who has shipped things before. I use AI every day myself. Getting stuck at this exact point is the rule, not the exception.",
	},
];
