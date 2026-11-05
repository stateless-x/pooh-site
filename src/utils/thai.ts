/**
 * Thai line-break protection.
 *
 * Thai is written without spaces, so browsers decide line breaks with a
 * dictionary. Loanwords are often missing from it, and the browser then breaks
 * *inside* the word: "โปรดักต์" becomes "โป / รดักต์". No CSS property fixes
 * this: word-break, line-break, and overflow-wrap were all tested and none of
 * them affect Thai segmentation, because the browser believes the break is
 * legitimate.
 *
 * Wrap the whole fragile word in the shared `.nb` class. Do not inject
 * invisible characters between Thai code points: doing that can separate a
 * consonant from its vowel or tone mark in copied text, accessibility trees,
 * search indexes, and some renderers.
 */

/**
 * Words the line-break audit has actually caught splitting, plus the ones
 * already protected with `.nb` in authored markup. Keep this list evidence-led:
 * add a word when the sweep flags it, not on suspicion.
 */
const LOANWORDS = [
	"ค่าใช้จ่าย",
	"โยนิโสมนสิการ",
	"ตัวตน",
	"กลับมา",
	"สั้น ๆ",
	"ความคืบหน้า",
	"เซรามิก",
	"โปรดักต์",
	"แพลตฟอร์ม",
	"คิวอาร์โค้ด",
	"ออเดอร์",
	"แชท",
	"ฟรีแลนซ์",
	"หลักหมื่น",
	"หลักแสน",
	"หลักพัน",
	"บุรีวงศ์",
	"จำนวนจำกัด",
];

export interface ThaiTextSegment {
	text: string;
	noBreak: boolean;
}

const escapedLoanwords = LOANWORDS.map((word) =>
	word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
);
const loanwordPattern = new RegExp(`(${escapedLoanwords.join("|")})`, "g");
const loanwordSet = new Set<string>(LOANWORDS);

/** Splits reader-facing copy into plain text and whole words to keep together. */
export function segmentThai(input: string): ThaiTextSegment[] {
	return input
		.split(loanwordPattern)
		.filter(Boolean)
		.map((text) => ({ text, noBreak: loanwordSet.has(text) }));
}
