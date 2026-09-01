/**
 * Content for /en/budget-factors.
 *
 * PRICING RULE, both editions: this page explains what moves the number and
 * never states one. No figures, no ranges, no rates, no currency. The English
 * edition is bound by the same rule as the Thai one, and it carries an extra
 * ban of its own: the words "cheap", "affordable", "low-cost",
 * "budget-friendly", and "inexpensive" never appear, because the argument is
 * that the buyer gets senior work for what they spend, not that the work is
 * discounted.
 *
 * Magnitude only, the way the Thai page uses หลักพัน / หลักหมื่น / หลักแสน:
 * "a small job", "a system the whole company runs on". Same idea, English
 * words, still no numbers.
 */
export interface QA {
	q: string;
	a: string;
}

/** What actually moves the number. Ordered by how much each one moves it. */
export const enFactors: { title: string; body: string }[] = [
	{
		title: "How much the thing has to do",
		body: "One page and a forty page site are not the same job. Neither is a screen that shows a list and a system that runs your orders. This moves the number more than everything else here put together, which is why it is first.",
	},
	{
		title: "How many people use it, and who sees what",
		body: "If everyone sees the same thing, that is simple. If your staff see one view and you see another, and a customer must never see either, that separation has to be built carefully and checked. It is real work and it takes real time.",
	},
	{
		title: "What it has to talk to",
		body: "Standing alone is quick. Talking to the tools you already run, like your accounting or your sales channels, means building the connection and then testing that both sides agree. Budget for the testing, not just the connecting.",
	},
	{
		title: "Whether your words and data are ready",
		body: "If your text, images, and existing records are ready to go, the work moves fast. If someone has to write the copy, or clean up years of records first, that is a second job sitting inside the first one.",
	},
	{
		title: "How fast you need it",
		body: "A normal timeline costs less than a compressed one. Speeding up means reordering other work and running at a higher intensity. If your date can move a little, that flexibility is worth real money to you.",
	},
	{
		title: "What happens after launch",
		body: "Some clients take the keys and run it themselves. Some want me checking in. These are priced differently, and the time to decide is at the start, not the week after you launch.",
	},
];

export const enBudgetFaq: QA[] = [
	{
		q: "What does a website or a system cost?",
		a: "There is no single number, and anyone who gives you one before seeing your job is guessing. A small, tightly scoped job is a different order of magnitude from a system your whole company runs on. What I can do is tell you which end of that range your job sits at, usually in one conversation. Email me what you need at askpurin@pm.me and I will tell you straight.",
	},
	{
		q: "Can I keep the budget under control?",
		a: "Yes, and the method is simple: build the smallest version that actually works, launch it, then add to it once the business tells you what it really needs. This beats one big build almost every time. You spend less, you find out sooner whether you were right, and you are live months earlier.",
	},
	{
		q: "Why do quotes for the same thing differ so much?",
		a: "Because \"a website\" covers an enormous range of work. One quote may cover the look of it. Another covers where your data lives, how you hand it to your team, a written handover, and support after launch. Before you compare two numbers, make both sides list exactly what is included. Otherwise you are comparing two different things and picking the one that left more out.",
	},
	{
		q: "Why does hiring an engineer in Asia work in my favour?",
		a: "It is the same reason serious companies have built engineering teams across Asia for two decades: the talent is senior, and the same budget reaches further than it does in London, Sydney, or San Francisco. You are not buying less. You are buying the same standard of engineering without paying for a Western office and a Western sales team on top of it.",
	},
	{
		q: "How do payments work?",
		a: "In stages tied to progress, never the whole amount before I start. We agree at the beginning what each stage covers and when it is paid, so you see working software before you release the next one. You are never paying into a black box and hoping.",
	},
];
