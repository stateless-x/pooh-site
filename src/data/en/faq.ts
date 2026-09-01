/**
 * Single source for the English contact page FAQ. Rendered as visible copy
 * AND serialised into FAQPage structured data from the same array, so the two
 * can never drift apart.
 *
 * These are not translations of the Thai FAQ. The English reader is either a
 * foreign owner operating in or around Thailand or a remote client abroad, so
 * the questions they actually ask are different: distance, time zones, who
 * owns the work, and whether hiring an engineer here is a real decision or a
 * compromise. Answers stay free of figures, counts, and invented proof.
 */
export interface FaqItem {
	q: string;
	a: string;
}

export const enFaq: FaqItem[] = [
	{
		q: "I am not in Thailand. Can we still work together?",
		a: "Yes. Most of my work happens over email and calls anyway, and that does not change with an ocean in between. I am in Bangkok, which overlaps a working morning in Europe and a working evening in Australia. If you are in the Americas we settle on a fixed window that works for both of us and stick to it. Distance has never been the hard part; being unclear about scope is.",
	},
	{
		q: "Why hire an engineer in Thailand rather than at home?",
		a: "Because the good ones are here and have been for years. Serious companies have run engineering teams across Asia for two decades, and they did not do it as charity. You get senior work, and your budget covers more of it than it would at home, because you are not also paying for a Western office and a sales team. If the work is good, where it was written stops mattering the day you launch.",
	},
	{
		q: "I started this with AI and got stuck. Will you take it?",
		a: "Send it. I use AI every day myself, so there is nothing here to be embarrassed about. I will look at what you actually have and tell you which parts are worth keeping and which parts need rebuilding before they cost you more. Sometimes the honest answer is that finishing it is cheaper than starting over. Sometimes it is not. Either way you will know before you spend anything.",
	},
	{
		q: "Does the first conversation cost anything?",
		a: "No, and there is no obligation attached to it. Email me what you are trying to do and I will tell you whether it is worth building, what I would do first, and what I would leave alone for now. Money only enters the conversation once we agree on a scope. If I think you do not need me, I will say so.",
	},
	{
		q: "Who owns the code when we are done?",
		a: "You do. All of it, plus a written handover so your team or your next developer can pick it up without calling me. Nothing is locked to me and nothing is held back as leverage. If you want to move it elsewhere in a year, you can, and that is the point: you should be working with me because it is working, not because leaving is expensive.",
	},
	{
		q: "How do payments work? Do I pay everything up front?",
		a: "No. Payment is staged against progress, agreed at the start, so you see working software before you release the next stage. You are never handing over a lump sum and waiting to find out what comes back.",
	},
	{
		q: "How long will it take?",
		a: "It depends on the size of the job and what you already have ready. After we talk I give you a real estimate, then split the work into stages so you see something working early instead of waiting until the end to find out we understood each other differently.",
	},
	{
		q: "Can I change my mind partway through?",
		a: "Yes, and early is much better than late. I show you work as it goes so you can say \"not that\" while it is still cheap to change. We agree up front what this round covers; anything outside it we talk about and schedule rather than quietly absorbing it into the timeline.",
	},
	{
		q: "What happens after launch? Do you disappear?",
		a: "No. I still run pawjai.co myself, which means I live with my own decisions long after launch and build accordingly. After I hand over, I stay available for changes and additions as your business grows, and I write down how everything works so your team can handle the small things without waiting on me.",
	},
	{
		q: "What do you need from me to start?",
		a: "Almost nothing. Tell me what your business does, what is going wrong now, and what you want people to be able to do. If you have a site, files, or notes already, send them. If you do not, that is fine too. You do not need a specification to email me; that is what the first conversation is for.",
	},
];
