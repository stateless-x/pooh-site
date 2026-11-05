/**
 * Decides where the bear is looking and what it is doing about it. Pure
 * page-space logic: it reads the pointer, the attention element and the stage
 * box, and outputs head angles plus two flags. Nothing here touches three.js,
 * so the bear and the scene stay free of DOM measurement.
 */

const YAW_LIMIT = 0.7;
const PITCH_UP_LIMIT = 0.3;
const PITCH_DOWN_LIMIT = 0.4;
/** Where the face sits inside the stage, measured from the top. */
const FACE_HEIGHT = 0.47;
const IDLE_AFTER = 4;
const GLANCE_LENGTH = 1.6;

export interface GazeState {
	yaw: number;
	pitch: number;
	/** The bear's arm that should point at the attention element, if any. */
	point: "armL" | "armR" | null;
	excited: boolean;
}

export class Gaze {
	private pointer: { x: number; y: number } | null = null;
	private lastMove = -Infinity;
	private hovered = false;
	private focused = false;
	private glanceUntil = 0;
	private nextGlance = 0;
	private readonly finePointer = matchMedia("(pointer: fine)").matches;
	/** Centre of the bear's face in client pixels, and how far away a target must be to saturate the turn. */
	private readonly face = { x: 0, y: 0 };
	private reach = 1;
	private readonly state: GazeState = { yaw: 0, pitch: 0, point: null, excited: false };

	constructor(
		private readonly stage: HTMLElement,
		private readonly attention: HTMLElement,
	) {
		window.addEventListener("pointermove", (event) => {
			// Touch has no hover, so a finger would drag the gaze to wherever it last landed.
			if (event.pointerType === "touch") return;
			this.pointer = { x: event.clientX, y: event.clientY };
			this.lastMove = performance.now() / 1000;
		});
		attention.addEventListener("pointerenter", () => (this.hovered = true));
		attention.addEventListener("pointerleave", () => (this.hovered = false));
		// Keyboard focus only: a mouse click leaves focus on the button, which would keep the bear cheering.
		attention.addEventListener("focusin", () => {
			this.focused = attention.matches(":focus-visible");
		});
		attention.addEventListener("focusout", () => (this.focused = false));
		this.scheduleGlance(performance.now() / 1000);
	}

	update(elapsed: number): GazeState {
		const now = performance.now() / 1000;
		const box = this.stage.getBoundingClientRect();
		// The face sits at a fixed spot inside the stage; the stage moves as the page scrolls.
		this.face.x = box.left + box.width / 2;
		this.face.y = box.top + box.height * FACE_HEIGHT;
		this.reach = box.width * 0.8;
		const state = this.state;
		const idle = !this.finePointer || now - this.lastMove > IDLE_AFTER;
		const target = this.attentionCentre();

		state.excited = this.hovered || this.focused;
		state.point = null;

		if (state.excited && target) {
			this.aim(target.x, target.y);
			return state;
		}

		if (idle && target && now < this.glanceUntil) {
			this.aim(target.x, target.y);
			state.point = target.x > this.face.x ? "armL" : "armR";
			return state;
		}

		if (now >= this.nextGlance) {
			// A glance only makes sense when nobody is steering and the button is actually in view.
			if (idle && target) this.glanceUntil = now + GLANCE_LENGTH;
			this.scheduleGlance(now);
		}

		if (!idle && this.pointer) {
			this.aim(this.pointer.x, this.pointer.y);
		} else {
			// Slow, incommensurate sines so the wander never visibly loops.
			state.yaw = 0.34 * Math.sin(elapsed * 0.5) + 0.14 * Math.sin(elapsed * 0.83);
			state.pitch = 0.07 * Math.sin(elapsed * 0.37) - 0.02;
		}
		return state;
	}

	/** Head angles that point the face at a client-space position. */
	private aim(x: number, y: number): void {
		this.state.yaw = YAW_LIMIT * Math.tanh((x - this.face.x) / this.reach);
		const lean = Math.tanh((y - this.face.y) / this.reach);
		this.state.pitch = (lean < 0 ? PITCH_UP_LIMIT : PITCH_DOWN_LIMIT) * lean;
	}

	/** Centre of the attention element, or null when it is outside the viewport. */
	private attentionCentre(): { x: number; y: number } | null {
		const box = this.attention.getBoundingClientRect();
		const view = document.documentElement;
		const visible =
			box.width > 0 &&
			box.bottom > 0 &&
			box.top < view.clientHeight &&
			box.right > 0 &&
			box.left < view.clientWidth;
		return visible ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null;
	}

	private scheduleGlance(now: number): void {
		this.nextGlance = now + 6 + Math.random() * 3;
	}
}
