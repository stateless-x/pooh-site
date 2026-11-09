/**
 * Content for the home page "เกี่ยวกับผม" section.
 *
 * Strings render through ThaiText, so loanwords are guarded by the shared word
 * list rather than by hand-written <span class="nb"> markup in the page.
 */

export const aboutParagraphs = [
	"ผมภูรินท์ครับ ทำซอฟต์แวร์มากว่า 7 ปี ตอนนี้รับงานอิสระควบคู่กับการดูแลโปรดักต์ของตัวเอง",
	"คุณค่าไม่ได้อยู่ที่เครื่องมือ แต่อยู่ที่การเลือกใช้ให้ถูกจุดจนเกิดผลกับธุรกิจจริง",
	"งานแบ่งเป็นช่วงให้เห็นความคืบหน้าตลอด และหลังส่งมอบ ของทั้งหมดเป็นของลูกค้า เอาไปให้คนอื่นดูแลต่อได้เสมอครับ",
] as const;

/** Link that follows the second paragraph. */
export const aboutLink = {
	href: "/about/",
	label: "รู้จักผมให้มากขึ้น",
} as const;

/**
 * His own stated belief. Not a testimonial: the site carries no client quotes
 * and must not invent any, so this is a first-person principle instead.
 */
export const aboutQuote = {
	text: "ยุคนี้ AI ทำได้เกือบทุกอย่างครับ แต่สร้างมหาวิหารขึ้นมากับทำให้มันตั้งอยู่ได้ เป็นคนละเรื่องกัน ถ้าฐานรากไม่แน่น สุดท้ายก็ทรุด ผมเลยอยากให้แน่ใจตั้งแต่แรกว่าของที่ทำจะอยู่กับธุรกิจไปได้จริง",
	attribution: "ภูรินท์ บุรีวงศ์",
} as const;

/** Alt text stays raw rather than passing through the display-only component. */
export const portraitAlt = "ภูรินท์ บุรีวงศ์ นั่งอยู่ที่โต๊ะทำงาน";
