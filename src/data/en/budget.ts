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
		title: "How much it has to do",
		body: "One page and a forty page site are not the same job, and neither is a screen that shows a list and a system that runs your orders. This affects the cost more than everything else on this page put together, which is why it comes first.",
	},
	{
		title: "How many people use it, and who sees what",
		body: "If everyone sees the same thing, that is simple. If your staff see one view and you see another, and a customer must never see either, that separation has to be built carefully and checked. It is real work and it takes real time.",
	},
	{
		title: "What it has to talk to",
		body: "Something that stands on its own is quicker. If it has to talk to tools you already use, like your accounting or your sales channels, we have to build that connection and then test that both sides agree. The testing usually takes longer than the connecting.",
	},
	{
		title: "Whether your words and data are ready",
		body: "If your text, images, and existing records are ready to go, the work moves fast. If someone has to write the copy, or clean up years of records first, that is a second job sitting inside the first one.",
	},
	{
		title: "How fast you need it",
		body: "A normal timeline works out lower than a rushed one. Going faster means moving other work around and putting in longer days. If your date has a little room in it, that flexibility is worth quite a lot to you.",
	},
	{
		title: "What happens after launch",
		body: "Some customers take the keys and run it themselves from day one. Others would rather I keep an eye on it. Those work out differently, and it is easier if we decide which one you want at the start rather than the week after launch.",
	},
];

export const enBudgetFaq: QA[] = [
	{
		q: "What does a website or a system cost?",
		a: "I cannot give you one number honestly, because a small, tightly scoped job and a system your whole company runs on are very different sizes of work. What I can usually do in one conversation is tell you roughly which end of that range your project sits at, and what would make it smaller. Email me at askpurin@pm.me with what you have in mind.",
	},
	{
		q: "Can I keep the budget under control?",
		a: "Yes, and the approach is simple: build the smallest version that actually works, launch it, then add to it once the business has told you what it really needs. In my experience that usually works out better than one big build. You spend less, you find out sooner whether you were right, and you are up and running much earlier.",
	},
	{
		q: "Why do quotes for the same thing differ so much?",
		a: "Because \"a website\" covers an enormous range of work. One quote might cover the look of it. Another covers where your data lives, how your team gets at it, a written handover, and support after launch. It helps to ask both sides to list exactly what is included before you compare the numbers, otherwise it is hard to tell whether one is better value or simply leaving more out.",
	},
	{
		q: "Does hiring a developer in Thailand cost less than hiring at home?",
		a: "Usually, yes. A budget tends to go further in Bangkok than it would in London, Sydney, or San Francisco, and hiring me directly means there is no agency taking a share in the middle. I would not pick a developer on that basis alone though. Look at work they have finished, and at whether they answer your questions clearly. If the answer to both is good, the rest is a bonus.",
	},
	{
		q: "How do payments work?",
		a: "In stages tied to progress, never the whole amount before I start. We agree at the beginning what each stage covers and when it is paid, so you see working software before you release the next one. You are never paying into a black box and hoping.",
	},
];
