/**
 * Damped spring. Every eased value in the stage goes through one of these, so
 * a change of target (a poke, a hover, the pointer leaving) bends the motion
 * instead of snapping it, and velocity carries over between targets.
 */

/** Largest step the integrator takes, so a stiff spring stays stable when a frame is long. */
const MAX_STEP = 1 / 120;

export class Spring {
	value: number;
	target: number;
	velocity = 0;

	constructor(
		initial = 0,
		public stiffness = 120,
		public damping = 14,
	) {
		this.value = initial;
		this.target = initial;
	}

	/** Semi-implicit Euler, sub-stepped: stable for the stiffness range used here. */
	update(dt: number): number {
		let remaining = dt;
		while (remaining > 0) {
			const step = Math.min(remaining, MAX_STEP);
			this.velocity +=
				(this.stiffness * (this.target - this.value) - this.damping * this.velocity) * step;
			this.value += this.velocity * step;
			remaining -= step;
		}
		return this.value;
	}

	/** True once the spring has effectively stopped at its target. */
	get settled(): boolean {
		return Math.abs(this.velocity) < 0.02 && Math.abs(this.target - this.value) < 0.002;
	}
}

export function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}
