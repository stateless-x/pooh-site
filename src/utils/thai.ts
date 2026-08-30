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
 * U+2060 WORD JOINER is the actual fix: a zero-width character that renders
 * nothing but forbids a break at that position.
 *
 * Apply this ONLY to text that is rendered for a reader. Structured data,
 * meta tags, and alt text must keep the raw string, so nothing invisible ends
 * up in a machine-read field. Hand-written markup can use the `.nb` class
 * instead; this exists for strings that come from the data files, where a
 * span would render as literal text.
 */
// Written as an escape on purpose: a literal invisible character in source is
// impossible to see and easy to delete by accident.
const WJ = "\u2060";

/**
 * Words the line-break audit has actually caught splitting, plus the ones
 * already protected with `.nb` in authored markup. Keep this list evidence-led:
 * add a word when the sweep flags it, not on suspicion.
 */
const LOANWORDS = [
	"ค่าใช้จ่าย",
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

/** Returns the string with breaks forbidden inside known-fragile loanwords. */
export function protectThai(input: string): string {
	return LOANWORDS.reduce(
		(acc, word) => acc.split(word).join([...word].join(WJ)),
		input
	);
}
