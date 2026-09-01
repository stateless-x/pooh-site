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
		q: "Can I hire a freelance developer in Thailand for remote work?",
		a: "Yes, and a good part of my work is exactly that. I am based in Bangkok, Thailand, and I take remote projects with clients abroad alongside customers here. Bangkok is six or seven hours ahead of London, and close to the working day in Australia and Singapore. For clients in the Americas we agree one time each week that suits us both. What makes it work is the same anywhere: the scope written down, and you seeing the work as it goes rather than only at the end.",
	},
	{
		q: "I started this with AI and got stuck. Will you take it?",
		a: "Please do send it. I use AI every day myself, so there is really nothing to be embarrassed about here. I will look at what you have and tell you which parts are worth keeping and which parts are better rebuilt. Sometimes finishing what you have is the shorter road, sometimes it is not. Either way you will know before you spend anything.",
	},
	{
		q: "Does the first conversation cost anything?",
		a: "No, and there is no obligation attached to it. Email me what you are trying to do and I will tell you whether it is worth building, what I would do first, and what I would leave alone for now. Money only enters the conversation once we agree on a scope. If I think you do not need me, I will say so.",
	},
	{
		q: "Who owns the code when we are done?",
		a: "You do. All of it, plus a written handover so your own team or another developer can pick it up without needing to call me. Nothing is tied to me and nothing is held back. If you want to move it somewhere else in a year, that is fine and it should be easy.",
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
		a: "Yes, and early is much better than late. I show you work as it goes so you can say \"not that\" while changing it still takes an afternoon rather than a rebuild. We agree up front what this round covers. Anything outside it we talk about and schedule, rather than quietly absorbing it into the timeline.",
	},
	{
		q: "What happens after launch? Do you disappear?",
		a: "No. I still run pawjai.co myself, so I know what it is like to be looking after something long after it launched, and I build with that in mind. After I hand over, I am still around for changes and additions as your business grows. I also write down how everything works, so your team can handle the small things without waiting on me.",
	},
	{
		q: "What do you need from me to start?",
		a: "Almost nothing. Tell me what your business does, what is going wrong now, and what you want people to be able to do. If you have a site, files, or notes already, send them. If you do not, that is fine too. You do not need a specification to email me. That is what the first conversation is for.",
	},
];
