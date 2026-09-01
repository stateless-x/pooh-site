/**
 * Content for /en/backoffice.
 *
 * Same offer as the Thai page, argued for a different buyer. A foreign owner
 * running a business in or around Thailand, or a remote client abroad, does
 * not need to be persuaded that spreadsheets fail; they already know. What
 * they need is confidence that the person building it will still be reachable
 * afterwards and that the scope will not run away from them.
 *
 * Icon keys are the shared ones in src/components/Icon.astro. No new icons.
 */
export interface QA {
	q: string;
	a: string;
}

/** The problem as the owner experiences it, paired with what replaces it. */
export const enWorkflow: {
	icon: string;
	problem: { title: string; body: string };
	answer: { title: string; body: string };
}[] = [
	{
		icon: "orders",
		problem: {
			title: "Orders arrive in five different places",
			body: "Some come by message, some by phone, some over the counter. Someone copies them into one list at the end of the day, and that is where things go missing.",
		},
		answer: {
			title: "One order list",
			body: "Every order lands in the same place regardless of how it came in, and you can see where each one is from the moment it arrives to the moment it ships.",
		},
	},
	{
		icon: "inventory",
		problem: {
			title: "The stock count is a work of fiction",
			body: "The number in the file and the number on the shelf stopped matching days ago, and nobody trusts either one.",
		},
		answer: {
			title: "Stock people believe",
			body: "What came in, what went out, what is left. Your sales team and your warehouse look at the same number instead of arguing about whose is right.",
		},
	},
	{
		icon: "customers",
		problem: {
			title: "Customer history is scattered",
			body: "Names in one place, phone numbers in another, what they bought last time in someone's head. A returning customer asks about a past order and nobody can find it.",
		},
		answer: {
			title: "One customer record",
			body: "Contact details, order history, their agreed pricing, and anything outstanding, all in one place your team can search.",
		},
	},
	{
		icon: "teamwork",
		problem: {
			title: "You find out who is doing what by asking",
			body: "Every status update costs someone an interruption, and the answer is out of date by the afternoon.",
		},
		answer: {
			title: "Work you can see",
			body: "Who owns each job, what stage it is at, what happens next. Nobody has to interrupt anybody to find out.",
		},
	},
	{
		icon: "report",
		problem: {
			title: "You wait on someone to tell you how the business is doing",
			body: "You want to know what sold and what is running low, and you have to ask a person to build a file first.",
		},
		answer: {
			title: "Numbers you open yourself",
			body: "Sales, what is outstanding, what is running low, and the overview you actually decide from. Open it whenever you want, without asking anyone.",
		},
	},
];

/** Three honest sizes of engagement, so a reader can place themselves. */
export const enLevels: { icon: string; title: string; body: string }[] = [
	{
		icon: "focus",
		title: "Fix the one thing that keeps costing you",
		body: "Right for a single job that eats hours or goes wrong often. Taking orders, producing a document, chasing a status. Solve that properly first. You do not need a system to fix one broken habit.",
	},
	{
		icon: "teamwork",
		title: "Get the team working off the same information",
		body: "Right when several people need the same facts, hand work between each other, and want to see where something stands without asking.",
	},
	{
		icon: "overview",
		title: "Connect the parts so you can see the whole business",
		body: "Right when orders, stock, customers, and reporting have started to depend on each other, so the information has to flow between them and you need the view over the top.",
	},
];

/** Ways of working together, not packages. */
export const enEngagements: { icon: string; title: string; body: string }[] = [
	{
		icon: "scope",
		title: "Build it as a project",
		body: "Right when you already know the problem and want a defined scope, a defined deliverable, and a timeline agreed before anyone starts.",
	},
	{
		icon: "help",
		title: "Plan it with me first",
		body: "Right when you are not yet sure what should exist. I look at how the work actually happens, put the pieces in order, and tell you honestly which parts you do not need to build at all.",
	},
	{
		icon: "contract",
		title: "Join your team on contract",
		body: "Right for a company that already has a team and a clear roadmap but needs another senior pair of hands for a defined stretch of time.",
	},
];

export const enBackofficeFaq: QA[] = [
	{
		q: "Everything is in spreadsheets right now. Can that move across?",
		a: "Yes, and honestly it is the best possible starting point. Your spreadsheets are a record of how your business actually works, which is worth more than any specification anyone could write for you. Send me a sample, I design around how you already work, and I bring the old records over. Nobody retypes years of data.",
	},
	{
		q: "My team is not good with computers. Will they use it?",
		a: "They will if it is built for them, and that is a design decision, not a training problem. Fewer things on screen, the important buttons where the eye already goes, and the steps in the order your team actually does them. Before handover we run it on real work together, and I leave written instructions they can go back to.",
	},
	{
		q: "I do not know what I need yet. Where do I start?",
		a: "By telling me what today looks like. What people do, where it goes wrong, who has to chase whom. You do not need answers before you email me. Some of what you describe will not need software at all, and I will tell you that rather than quietly building it.",
	},
	{
		q: "Can we add to it later?",
		a: "Yes, and it is built expecting you will. I keep the pieces separate so a new one can be added without disturbing what already works. You do not have to build everything at once, and you should not.",
	},
	{
		q: "I run a business in Thailand but I am not Thai. Does that complicate things?",
		a: "It makes it easier, not harder. I work in English and Thai, so I can build you an owner's view in English and a staff view in Thai from the same system, and you are not relying on a translator standing between you and your own software. I have built multilingual work before, including a site serving Thai and cross-border customers at once.",
	},
];
