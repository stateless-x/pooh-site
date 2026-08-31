import workForgio from "../assets/images/illustrations/work-forgio.webp";
import workPawjai from "../assets/images/illustrations/work-pawjai.webp";
import workPscm from "../assets/images/illustrations/work-pscm.webp";
import workSaimu from "../assets/images/illustrations/work-saimu.webp";
import workVala from "../assets/images/illustrations/work-vala.webp";

export interface Work {
	/** Display name, also the visible link label context. */
	name: string;
	/**
	 * Live site. Thai IDN domains are written directly; browsers resolve them.
	 * Omitted for work that is built but not published yet: without a URL the
	 * card shows no "open the site" link and the entry stays out of the
	 * `sameAs` list, so the site never points at a domain that is not serving.
	 */
	url?: string;
	/**
	 * Short Thai note shown in place of the link when there is no live URL.
	 * States plainly that the work is not open to the public yet, so a reader
	 * is never left thinking a link failed.
	 */
	status?: string;
	/** Small accent label above the card. */
	kind: string;
	/** Descriptive Thai alt text, stays correct once a real image is dropped in. */
	alt: string;
	/** Visible Thai label telling the owner which image belongs in the slot. */
	label: string;
	/** Source-specific visual; BrowserFrame falls back to the generic portfolio art. */
	image?: ImageMetadata;
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
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอผลงาน pawjai.co",
		label: "ภาพประกอบผลงาน pawjai.co",
		image: workPawjai,
		short: "แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยงที่พัฒนาและดูแลเองทั้งหมด",
		long: "แพลตฟอร์มเกี่ยวกับสัตว์เลี้ยงที่ผมพัฒนาและดูแลเองทั้งหมด ตั้งแต่คิดว่าจะทำอะไร ออกแบบหน้าตา ไปจนถึงการปรับปรุงหลังเปิดใช้งาน",
		tint: "default",
		teaser: 3,
	},
	{
		name: "padthaiproperty.com",
		kind: "แพลตฟอร์มอสังหาริมทรัพย์",
		status: "สร้างเสร็จแล้ว ยังไม่เปิดให้คนนอกใช้",
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอแพลตฟอร์มอสังหาริมทรัพย์ padthaiproperty.com",
		label: "ภาพประกอบผลงาน padthaiproperty.com",
		short: "แพลตฟอร์มอสังหาริมทรัพย์สามภาษา ทั้งฝั่งลูกค้าและฝั่งหลังบ้าน",
		long: "แพลตฟอร์มอสังหาริมทรัพย์สำหรับลูกค้าต่างชาติและคนไทย ทำครบทั้งเว็บฝั่งลูกค้า ระบบหลังบ้านของทีม และส่วนของนายหน้าที่ต้องรออนุมัติก่อนลิสต์ทรัพย์ขึ้นจริง รองรับสามภาษาคือ อังกฤษ ไทย และญี่ปุ่น ตอนนี้พัฒนาเสร็จแล้ว แต่ยังไม่ได้เปิดให้คนนอกเข้าใช้",
		tint: "amber",
	},
	{
		name: "สายมู.com",
		url: "https://สายมู.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอผลงาน สายมู.com",
		label: "ภาพประกอบผลงาน สายมู.com",
		image: workSaimu,
		short: "เว็บดูดวงออนไลน์ที่ผมทำให้ ตอบคำถามให้แต่ละคนได้ไม่ซ้ำกัน",
		long: "เว็บดูดวงออนไลน์ที่ผมออกแบบและพัฒนาให้ รวมโหราศาสตร์ไทยเข้ากับศาสตร์จีนและแบบทดสอบบุคลิกภาพ ให้คำตอบที่ต่างกันไปตามข้อมูลของแต่ละคน พร้อมหน้ารวมคำถามที่พบบ่อยและคำอธิบายศัพท์ให้คนอ่านเข้าใจได้เอง",
		tint: "amber",
	},
	{
		name: "valasauna.com",
		url: "https://valasauna.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอผลงาน valasauna.com",
		label: "ภาพประกอบผลงาน valasauna.com",
		image: workVala,
		short: "เว็บไซต์ร้านซาวน่าที่หาดใหญ่ รองรับลูกค้าไทยและต่างชาติในเว็บเดียว",
		long: "เว็บไซต์ร้านซาวน่าที่หาดใหญ่ ซึ่งมีลูกค้าทั้งคนไทยและคนต่างชาติที่ข้ามมาเที่ยว จึงทำให้เลือกอ่านได้หลายภาษาในเว็บเดียว บอกให้ชัดว่ามีบริการอะไร เปิดกี่โมง และเดินทางมายังไง",
		tint: "clay",
	},
	{
		name: "forgio.co",
		url: "https://forgio.co",
		kind: "งานออกแบบและพัฒนา",
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอผลงาน forgio.co",
		label: "ภาพประกอบผลงาน forgio.co",
		image: workForgio,
		short: "เว็บไซต์ของระบบจัดการงานขาย สต๊อก และการผลิตสำหรับโรงงาน",
		long: "เว็บไซต์แนะนำระบบจัดการงานขาย สต๊อก และการผลิตสำหรับโรงงานไทย รวมข้อมูลที่เคยกระจายอยู่หลายที่ให้ดูรวมกันได้ในหน้าเดียว",
		tint: "default",
		teaser: 1,
	},
	{
		name: "pscmceramic.com",
		url: "https://pscmceramic.com",
		kind: "งานออกแบบและพัฒนา",
		alt: "ภาพประกอบสามมิติของมาสคอต Pooh นำเสนอผลงาน pscmceramic.com",
		label: "ภาพประกอบผลงาน pscmceramic.com",
		image: workPscm,
		short: "เว็บไซต์ของโรงงานที่สร้างและซ่อมเครื่องจักรเซรามิก",
		long: "เว็บไซต์ของโรงงานที่สร้างและซ่อมเครื่องจักรเซรามิก บอกให้ชัดว่ารับงานแบบไหนและติดต่อเข้ามาได้อย่างไร รองรับทั้งภาษาไทยและอังกฤษ",
		tint: "amber",
		teaser: 2,
	},
];
