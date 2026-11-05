/**
 * Content for the dated update notice at the top of every English page. A
 * native rewrite of src/data/now.ts, not a translation of it.
 */

import type { Now } from "../now";

export const now: Now = {
	strip: "Latest update: Nov to Dec 2026",
	title: "Latest update",
	when: "November to December 2026",
	close: "Close",
	groups: [
		{
			label: "Making",
			items: [
				{
					name: "Summon a Ghost Army",
					note: "Launching my Roblox game, an RNG game I am making for fun.",
				},
				{
					name: "สายมู.com",
					note: "Improving the UX and clearing up information clutter.",
					url: "https://สายมู.com",
				},
				{
					name: "pawjai.co",
					note: "Moving the app to React Native and fixing a lot of bugs.",
					url: "https://pawjai.co",
				},
			],
		},
		{
			label: "Learning",
			items: [{ name: "Life and philosophy", url: "/en/philosophy/" }],
		},
	],
};
