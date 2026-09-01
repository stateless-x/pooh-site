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
		body: "A single page and a forty page site are not the same job, and neither is a screen that displays a list and a system that runs your orders. This affects the cost more than everything else on this page combined, which is why it comes first.",
	},
	{
		title: "How many people use it, and who sees what",
		body: "If everyone sees the same thing, that is straightforward. If your staff see one view, you see another, and a customer must never see either, that separation has to be built carefully and then tested. It is real work and it takes real time.",
	},
	{
		title: "What it has to talk to",
		body: "Something that stands on its own is quicker. If it has to talk to tools you already use, like your accounting or your sales channels, we have to build that connection and then test that both sides agree. The testing usually takes longer than the connecting.",
	},
	{
		title: "Whether your words and data are ready",
		body: "If your text, images, and existing records are ready to go, the work moves quickly. If someone has to write the copy first, or clean up years of accumulated records, that is a second job sitting inside the first one.",
	},
	{
		title: "How fast you need it",
		body: "A normal timeline works out lower than a rushed one. Compressing a schedule means rearranging other work and putting in longer days. If your deadline has some give in it, that flexibility is worth more to you than it might sound.",
	},
	{
		title: "What happens after launch",
		body: "Some customers take the keys and run it themselves from day one. Others would rather I keep an eye on it. Those work out differently, and it is easier if we decide which one you want at the start rather than the week after launch.",
	},
];

export const enBudgetFaq: QA[] = [
	{
		q: "What does a website or a system cost?",
		a: "I cannot honestly give you a single number, because a small, tightly scoped job and a system your whole company depends on are wildly different sizes of work. What I can usually do in one conversation is tell you which end of that range your project sits at, and what would bring it down. Email me at askpurin@pm.me with what you have in mind.",
	},
	{
		q: "Can I keep the budget under control?",
		a: "Yes, and the approach is simple enough. Build the smallest version that genuinely works, launch it, then add to it once the business has shown you what it actually needs. In my experience that beats one big build most of the time. You spend less, you find out sooner whether you were right, and you are up and running months earlier.",
	},
	{
		q: "Why do quotes for the same thing differ so much?",
		a: "Because \"a website\" covers an enormous range of work. One quote might cover the look of it and little else. Another covers where your data lives, how your team reaches it, a written handover, and support after launch. Ask both sides to list exactly what is included before you compare the numbers. Otherwise it is impossible to tell whether one is better value or simply leaving more out.",
	},
	{
		q: "Does hiring a developer in Thailand cost less than hiring at home?",
		a: "Yes. Hiring me in Bangkok costs less than hiring a developer in London, Sydney, or San Francisco. The work is the same standard. What changes is what a workday costs in each city. Going direct also means no agency is taking a cut in between. That said, I would not choose a developer on cost alone. Look at what they have actually finished and shipped, and at whether they answer your questions clearly. If both hold up, the cost difference is a bonus rather than the argument.",
	},
	{
		q: "How do payments work?",
		a: "In stages tied to progress, never the whole amount before I start. We agree at the beginning what each stage covers and when it is paid, so you see working software before you release the next one. You are never paying into a black box and hoping.",
	},
];
