export interface Work {
	/** Display name, also the visible link label context. */
	name: string;
	/** Live site. Thai IDN domains are written directly; browsers resolve them. */
	url: string;
	/** Small accent label above the card. */
	kind: string;
	/** Descriptive Thai alt text, stays correct once a real image is dropped in. */
	alt: string;
	/** Visible Thai label telling the owner which image belongs in the slot. */
	label: string;
	/** One line, used on the home page teaser. */
	short: string;
	/** Fuller sentence, used on the work page. */
	long: string;
	/**
	 * Soft tint for the kind tag chip, so the cards read as distinct.
	 * "default" renders the base honey-tint `.tag` with no modifier class.
	 * There is deliberately no green variant: green belongs to LINE only.
	 */
	tint: "default" | "amber" | "clay";
	/**
	 * Position in the home page teaser (1, 2, 3). Omitted means /work only.
	 * The home page leads with the two business systems because the buyer is
	 * an SME or factory owner; pawjai.co follows as the own-product credential.
	 */
	teaser?: 1 | 2 | 3;
}

export const works: Work[] = [
	{
		name: "pawjai.co",
		url: "https://pawjai.co",
		kind: "โปรดักต์ของตัวเอง",
		alt: "หน้าจอเว็บไซต์ pawjai.co แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยง",
		label: "ภาพหน้าจอเว็บไซต์ pawjai.co",
		short: "แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยงที่พัฒนาและดูแลเองทั้งหมด",
		long: "แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยงที่ผมพัฒนาและดูแลเองทั้งหมด ตั้งแต่คิดว่าจะทำอะไร ออกแบบหน้าตา ไปจนถึงการปรับปรุงหลังเปิดใช้งาน",
		tint: "default",
		teaser: 3,
	},
	{
		name: "สายมู.com",
		url: "https://สายมู.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "หน้าจอเว็บไซต์ สายมู.com ที่ออกแบบและพัฒนา",
		label: "ภาพหน้าจอเว็บไซต์ สายมู.com",
		short: "เว็บไซต์ที่ออกแบบและพัฒนาให้ ตั้งแต่หน้าตาไปจนถึงการใช้งานจริง",
		long: "เว็บไซต์ที่ผมออกแบบและพัฒนาให้ ดูแลทั้งหน้าตาและการใช้งานจริงบนหน้าจอทุกขนาด",
		tint: "amber",
	},
	{
		name: "valasauna.com",
		url: "https://valasauna.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "หน้าจอเว็บไซต์ valasauna.com ที่ออกแบบและพัฒนา",
		label: "ภาพหน้าจอเว็บไซต์ valasauna.com",
		short: "เว็บไซต์ที่ออกแบบและพัฒนาให้ ดูแลตั้งแต่โครงหน้าเว็บจนถึงรายละเอียดปลีกย่อย",
		long: "เว็บไซต์ที่ผมออกแบบและพัฒนาให้ ตั้งแต่วางโครงว่าอะไรควรอยู่ตรงไหน ไปจนถึงรายละเอียดปลีกย่อยของแต่ละหน้า",
		tint: "clay",
	},
	{
		name: "forgio.co",
		url: "https://forgio.co",
		kind: "งานออกแบบและพัฒนา",
		alt: "หน้าจอเว็บไซต์ forgio.co ระบบจัดการงานขายและการผลิตสำหรับโรงงาน",
		label: "ภาพหน้าจอเว็บไซต์ forgio.co",
		short: "เว็บไซต์ของระบบจัดการงานขาย สต๊อก และการผลิตสำหรับโรงงาน",
		long: "เว็บไซต์แนะนำระบบจัดการงานขาย สต๊อก และการผลิตสำหรับโรงงานไทย รวมข้อมูลที่เคยกระจายอยู่หลายที่ให้ดูรวมกันได้ในหน้าเดียว",
		tint: "default",
		teaser: 1,
	},
	{
		name: "pscmceramic.com",
		url: "https://pscmceramic.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "หน้าจอเว็บไซต์ pscmceramic.com โรงงานสร้างและซ่อมเครื่องจักรเซรามิก",
		label: "ภาพหน้าจอเว็บไซต์ pscmceramic.com",
		short: "เว็บไซต์ของโรงงานที่สร้างและซ่อมเครื่องจักรเซรามิก",
		long: "เว็บไซต์ของโรงงานที่สร้างและซ่อมเครื่องจักรเซรามิก บอกให้ชัดว่ารับงานแบบไหนและติดต่อเข้ามาได้อย่างไร รองรับทั้งภาษาไทยและอังกฤษ",
		tint: "amber",
		teaser: 2,
	},
];
