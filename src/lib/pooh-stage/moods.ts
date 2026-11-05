/**
 * The click moods. A poke plays one of six, drawn from a shuffled bag so a mood
 * never repeats until all six have played, and never twice in a row across a refill.
 */
export const MOODS = ["boing", "love", "sparkle", "bloop", "sing", "poof"] as const;
export type Mood = (typeof MOODS)[number];

export class MoodBag {
	private bag: Mood[] = [];
	private last: Mood | null = null;

	next(): Mood {
		if (this.bag.length === 0) this.refill();
		// Moods are taken from the end of the bag.
		const mood = this.bag.pop();
		if (!mood) throw new Error("Mood bag is empty after a refill");
		this.last = mood;
		return mood;
	}

	private refill(): void {
		this.bag = [...MOODS];
		for (let i = this.bag.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
		}
		// The next draw is the last element: keep it from repeating the previous bag's final mood.
		const end = this.bag.length - 1;
		if (this.bag[end] === this.last) {
			[this.bag[end], this.bag[0]] = [this.bag[0], this.bag[end]];
		}
	}
}
