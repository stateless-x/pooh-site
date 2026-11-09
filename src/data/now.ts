/**
 * Content for the dated update notice at the top of every Thai page. When the
 * month changes, edit `strip`, `when`, and the items here; nothing else needs
 * touching. English lives in src/data/en/now.ts.
 *
 * Strings render through ThaiText, so loanwords are guarded by the shared word
 * list rather than by hand-written <span class="nb"> markup.
 */

export interface NowItem {
	name: string;
	note?: string;
	/** Where the name links to: a live site, or a page on this site. */
	url?: string;
}

export interface NowGroup {
	label: string;
	items: NowItem[];
}

export interface Now {
	/** The strip's own label, short enough to hold one line at 320px. */
	strip: string;
	title: string;
	when: string;
	close: string;
	groups: NowGroup[];
}

export const now: Now = {
	strip: "อัปเดตล่าสุด พ.ย. ถึง ธ.ค. 2026",
	title: "อัปเดตล่าสุด",
	when: "พฤศจิกายน ถึง ธันวาคม 2026",
	close: "ปิด",
	groups: [
		{
			label: "กำลังทำ",
			items: [
				{
					name: "Summon a Ghost Army",
					note: "เปิดตัวเกม Roblox ที่ทำสนุก ๆ เป็นแนว RNG",
				},
				{
					name: "สายมู.com",
					note: "ปรับ UX แก้ปัญหาข้อมูลรกเกินไป",
					url: "https://สายมู.com",
				},
				{
					name: "pawjai.co",
					note: "ย้ายแอปไป React Native และแก้บั๊กหลายอย่าง",
					url: "https://pawjai.co",
				},
			],
		},
		{
			label: "กำลังเรียนรู้",
			items: [{ name: "ชีวิตและปรัชญา", url: "/philosophy/" }],
		},
	],
};
