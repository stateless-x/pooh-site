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
		a: "Yes, and a good share of my work is exactly that. I am based in Bangkok, Thailand, and I take on remote projects with clients abroad alongside customers here. Bangkok runs six or seven hours ahead of London depending on the season, and sits close to the working day in Australia and Singapore. For clients in the Americas we settle on one weekly slot that suits us both. I keep my own hours here, but I report progress at whatever time works in your time zone, so you are never the one staying up for an update. Beyond that, what makes remote work succeed is the same everywhere: the scope written down, and the work visible as it goes rather than only at the end.",
	},
	{
		q: "I started this with AI and got stuck. Will you take it?",
		a: "Please do send it over. I use AI every day myself, so there is genuinely nothing to be embarrassed about here. I will go through what you have and tell you which parts are worth keeping and which are better rebuilt. Sometimes finishing what exists is the shorter road, and sometimes it is not. Either way you will know before you spend anything.",
	},
	{
		q: "Does the first conversation cost anything?",
		a: "No, and there is no obligation attached to it. Email me what you are trying to do and I will tell you whether it is worth building, what I would do first, and what I would leave alone for now. Money only enters the conversation once we agree on a scope. If I think you do not need me, I will say so.",
	},
	{
		q: "Who owns the code when we are done?",
		a: "You do, all of it, along with a written handover so your own team or another developer can pick it up without having to call me. Nothing is tied to me and nothing is held back. If you decide to move it elsewhere in a year, that is entirely fine, and it should be straightforward.",
	},
	{
		q: "How do payments work? Do I pay everything up front?",
		a: "No. Payment is staged against progress and agreed at the outset, so you see working software before you release the next stage. You are never handing over a lump sum and waiting to discover what comes back.",
	},
	{
		q: "How long will it take?",
		a: "That depends on the size of the job and how much you already have ready. Once we have talked it through I give you a realistic estimate, then break the work into stages so you see something working early. Far better to catch a misunderstanding in week two than at handover.",
	},
	{
		q: "Can I change my mind partway through?",
		a: "Yes, and early is far better than late. I show you the work as it goes so you can say \"not that\" while changing it still takes an afternoon rather than a rebuild. We agree up front what this round covers, and anything outside it we discuss and schedule properly, rather than quietly absorbing it into the timeline.",
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
