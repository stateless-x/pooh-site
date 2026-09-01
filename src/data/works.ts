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
	/**
	 * The English edition of everything a reader or a machine can see on the
	 * card. Not a translation of the Thai: the English reader is a foreign
	 * owner or a remote client, so the same project is described by the proof
	 * it offers them.
	 *
	 * All five visible or machine-read strings are here on purpose. Leaving
	 * `kind`, `alt`, or `label` out would ship a Thai tag chip and Thai alt
	 * text onto an English page.
	 */
	en: {
		kind: string;
		alt: string;
		label: string;
		short: string;
		long: string;
		/** English wording of the not-yet-public note. */
		status?: string;
	};
	/**
	 * Position in the English home teaser. Deliberately its own rank: the
	 * English buyer is a foreign owner or a remote client, so the multilingual
	 * and cross-border work leads instead of the Thai factory systems.
	 */
	teaserEn?: 1 | 2 | 3;
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
		teaserEn: 3,
		en: {
			kind: "My own product",
			alt: "Three dimensional illustration of the Pooh mascot presenting the pawjai.co pet platform",
			label: "Illustration for the pawjai.co project",
			short: "A pet platform I built, launched, and still run every day.",
			long: "A pet platform I own end to end. I decided what to build, designed it, shipped it, and I still run it today. It is the clearest proof I do not hand a project over and disappear: when something breaks here, the person who fixes it is me.",
		},
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
		teaserEn: 2,
		en: {
			kind: "Property platform",
			alt: "Three dimensional illustration of the Pooh mascot presenting the padthaiproperty.com property platform",
			label: "Illustration for the padthaiproperty.com project",
			status: "Built and finished. Not open to the public yet.",
			short: "A property platform in three languages, for buyers abroad and at home.",
			long: "A property platform built for foreign buyers and Thai buyers at once. I built all of it: the public site, the team's internal system, and an agent area where a listing waits for approval before it goes live. It runs in English, Thai, and Japanese. The build is finished; the owner has not opened it to the public yet.",
		},
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
		en: {
			kind: "Design and build",
			alt: "Three dimensional illustration of the Pooh mascot presenting an online fortune telling site",
			label: "Illustration for the fortune telling site project",
			short: "An online fortune telling site that gives every visitor a different answer.",
			long: "An online fortune telling site I designed and built for a client. It blends Thai astrology, Chinese Bazi, and a personality test, then gives each visitor an answer based on their own details. It also carries a plain-language glossary and a question page, so a first-time visitor never has to guess what a term means.",
		},
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
		teaserEn: 1,
		en: {
			kind: "Design and build",
			alt: "Three dimensional illustration of the Pooh mascot presenting the valasauna.com sauna website",
			label: "Illustration for the valasauna.com project",
			short: "A sauna in Hat Yai, serving Thai locals and visitors from across the border in one site.",
			long: "A sauna business in Hat Yai. Its customers are Thai locals and visitors who cross the border to get there, so one site had to serve both without either side feeling like an afterthought. It reads in more than one language and answers the three things a visitor actually wants: what you offer, when you are open, and how to get there.",
		},
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
		en: {
			kind: "Design and build",
			alt: "Three dimensional illustration of the Pooh mascot presenting the forgio.co factory system website",
			label: "Illustration for the forgio.co project",
			short: "The site for a sales, stock, and production system built for factories.",
			long: "The site for a system that handles sales, stock, and production for Thai factories. The job was to take work that lived in several places at once and put it on one screen a manager can read without asking three people first.",
		},
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
		en: {
			kind: "Design and build",
			alt: "Three dimensional illustration of the Pooh mascot presenting the pscmceramic.com factory website",
			label: "Illustration for the pscmceramic.com project",
			short: "A factory that builds and repairs ceramic machinery, in Thai and English.",
			long: "A factory that builds and repairs ceramic machinery. Their buyers are not all Thai, so the site runs in Thai and English and says plainly what work they take on and how to reach them. Industrial buyers decide fast when the answer is on the page and walk away when it is not.",
		},
	},
];
