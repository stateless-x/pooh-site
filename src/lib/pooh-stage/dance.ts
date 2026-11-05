import {
	CircleGeometry,
	Color,
	type DirectionalLight,
	type HemisphereLight,
	type Scene,
	Mesh,
	MeshBasicMaterial,
	PointLight,
} from "three";
import { HONEY, RED } from "./palette";
import { DanceSound } from "./sound";
import { Spring, clamp } from "./spring";

/**
 * The 67 dance: a sequencer that runs for exactly DURATION seconds, plus the
 * dance-floor lights. It outputs a DanceState that the bear and the props read
 * the same way they read the gaze, and it drives the sound from the very same
 * phase that moves the arms, so the two cannot drift apart.
 */

export const DURATION = 6.7;
const START_TEMPO = 1.4;
const TEMPO_GAIN = 3.6;
const BLUE = "#4C6FFF";
const DIM_HEMISPHERE = 0.35;
const DIM_SUN = 0.4;
/** Point lights are in candela with inverse-square falloff, so they need far more than the sun. */
const LIGHT_INTENSITY = 11;
/**
 * How long both arms stay up after the last cycle before they settle back to rest. The
 * page stays dark for all of it, so this must outlast the blast chunks (BLAST_LIFE in
 * burst.ts) or the last of them would be cleared in mid air.
 */
const FINALE_HOLD = 0.9;
/** The floor disc crossfades between colours at this many per second, never above 3. */
const FLOOR_RATE_START = 1;
const FLOOR_RATE_END = 2.5;
/**
 * The numeral reaches full size with one last pop here, glows briefly, and bursts at
 * BLAST_AT. The burst is the climax: it lands on the last hand beat, the same frame the
 * bear throws both arms up, so the hands are never left going after the numeral is gone.
 */
const LAST_POP_AT = 6.5;
const BLAST_AT = DURATION;

export interface DanceState {
	/** The sequencer is mid-dance or in its finale: input and gaze are suspended. */
	active: boolean;
	/** 0 to 1: how much of the dance is blended in. Eases in and out so nothing snaps. */
	weight: number;
	/** -1 to 1: the scales signal. Positive lifts the bear's left hand and lowers the right. */
	swing: number;
	/** 0 to 1: both arms up, for the last beat. */
	raise: number;
	/** Cycles per second. */
	tempo: number;
	/** Cycles since the start; sound and arms both read this. */
	phase: number;
	/** True for the single frame in which the finale begins, so the bear can hop. */
	finaleEdge: boolean;
	/** 0 to 1: how far the stage lights have faded in, for the shadow. */
	lights: number;
	/** The big 67 is showing: from the start of the dance until the blast (or an early exit). */
	numeral: boolean;
	/**
	 * 0 to 1 target size of the numeral. It steps up on every beat to the share of the
	 * growth that the elapsed time has earned, so the size at the blast is the same on
	 * every run whatever the frame rate.
	 */
	growth: number;
	/** 0 to 1: the short glow just before the blast. */
	glow: number;
	/** True for the single frame of a hand beat, for the numeral's pop. */
	beat: boolean;
	/** True for the single frame in which the numeral bursts. */
	blast: boolean;
	/** The colour the scene is shifting through right now: the floor disc and the numeral share it. */
	colour: Color;
}

interface Events {
	/** The dance is over: let the page go light again. */
	onRelease: () => void;
	/** Everything is back to rest: remove the page-level pieces. */
	onIdle: () => void;
}

type Stage = "idle" | "dancing" | "finale" | "easing";

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export class Dance {
	readonly state: DanceState = {
		active: false,
		weight: 0,
		swing: 0,
		raise: 0,
		tempo: START_TEMPO,
		phase: 0,
		finaleEdge: false,
		lights: 0,
		numeral: false,
		growth: 0,
		glow: 0,
		beat: false,
		blast: false,
		colour: new Color(HONEY),
	};

	private stage: Stage = "idle";
	private startedAt = 0;
	private lastNow = 0;
	private finaleAt = 0;
	private lastHalf = 0;
	private lastFull = 0;
	private sound: DanceSound | null = null;
	private released = false;
	private lastPopped = false;
	private blasted = false;

	private readonly weight = new Spring(0, 90, 16);
	private readonly raise = new Spring(0, 200, 24);
	private readonly light = new Spring(0, 60, 14);
	private lightAngle = 0;
	private floorClock = 0;
	private lastTick = 0;

	private readonly baseHemisphere: number;
	private readonly baseSun: number;
	private readonly colours = [new Color(HONEY), new Color(RED), new Color(BLUE)];
	private readonly lamps: PointLight[];
	private readonly floorMaterial = new MeshBasicMaterial({
		transparent: true,
		opacity: 0,
		depthWrite: false,
	});
	private readonly floor = new Mesh(new CircleGeometry(1, 64), this.floorMaterial);

	constructor(
		scene: Scene,
		private readonly hemisphere: HemisphereLight,
		private readonly sun: DirectionalLight,
		private readonly events: Events,
	) {
		this.baseHemisphere = hemisphere.intensity;
		this.baseSun = sun.intensity;
		// The lamps always exist and are only switched by intensity: adding or hiding a
		// light would make three recompile every material in the middle of the dance.
		this.lamps = this.colours.map((colour) => {
			const lamp = new PointLight(colour, 0, 0, 2);
			scene.add(lamp);
			return lamp;
		});
		this.floor.rotation.x = -Math.PI / 2;
		this.floor.position.y = 0.003;
		// Full width but shallower than a circle, so its near edge stays inside the stage frame.
		this.floor.scale.set(1, 0.7, 1);
		this.floor.visible = false;
		scene.add(this.floor);
	}

	get running(): boolean {
		return this.stage !== "idle";
	}

	/** Must run inside the click handler: it creates the AudioContext. */
	start(now: number): void {
		if (this.stage !== "idle") return;
		this.stage = "dancing";
		this.released = false;
		this.state.active = true;
		this.startedAt = now;
		this.lastNow = now;
		this.lastHalf = 0;
		this.lastFull = 0;
		this.state.phase = 0;
		this.state.tempo = START_TEMPO;
		this.state.numeral = true;
		this.state.growth = 0;
		this.state.glow = 0;
		this.lastPopped = false;
		this.blasted = false;
		// Every run starts on honey, so every run looks the same.
		this.floorClock = 0;
		this.lastTick = now;
		this.sound = new DanceSound();
		this.weight.target = 1;
		this.light.target = 1;
		this.raise.target = 0;
	}

	/** A small blip for a wall bounce of the numeral, in the same voice as the hand beats. */
	blip(high: boolean): void {
		if (this.stage === "dancing") this.sound?.blip(high, this.state.growth);
	}

	/**
	 * Early exit. Eased when the loop is running (Escape, a click on the veil);
	 * instant when it is not (tab hidden, stage scrolled away), because no frames
	 * will come to finish an ease.
	 */
	stop(instant: boolean): void {
		if (this.stage === "idle") return;
		this.sound?.silence();
		this.sound = null;
		if (instant) {
			this.reset();
			return;
		}
		this.release();
		this.beginEasing();
	}

	update(dt: number, now: number): DanceState {
		const state = this.state;
		state.finaleEdge = false;
		state.beat = false;
		state.blast = false;

		if (this.stage === "dancing" || this.stage === "finale") this.advance(now);

		// Wall-clock `now` drives the sequence so it ends on time even if frames are slow;
		// `dt` only drives the springs.
		// The springs overshoot a little; the blend amounts must stay inside 0 to 1.
		state.weight = clamp(this.weight.update(dt), 0, 1);
		state.raise = clamp(this.raise.update(dt), 0, 1);
		state.lights = clamp(this.light.update(dt), 0, 1);
		// The colour clock runs on the wall clock, so the cycle does not depend on frame rate.
		const wall = clamp(now - this.lastTick, 0, 0.1);
		this.lastTick = now;
		if (this.stage !== "idle") this.applyLights(dt, wall);

		if (this.stage === "easing" && this.weight.settled && this.light.settled) this.reset();
		return state;
	}

	private advance(now: number): void {
		const state = this.state;
		const elapsed = Math.min(now - this.startedAt, DURATION);
		const step = clamp(now - this.lastNow, 0, 0.1);
		this.lastNow = now;

		if (this.stage === "dancing") {
			const progress = elapsed / DURATION;
			state.tempo = START_TEMPO + TEMPO_GAIN * progress * progress;
			state.phase += state.tempo * step;
			state.swing = Math.sin(state.phase * Math.PI * 2);
			state.active = true;

			// Blips fire on the half cycles of the same phase that swings the arms: even
			// halves are the left hand's "six", odd halves the right hand's "seven".
			const half = Math.floor(state.phase * 2);
			if (half > this.lastHalf) {
				this.sound?.blip(half % 2 === 1, progress);
				this.lastHalf = half;
				// The numeral steps up to the growth the clock has earned, not by a fixed amount
				// per beat: beats come faster as the tempo climbs, but the clock does not.
				if (state.numeral) {
					state.growth = Math.max(state.growth, Math.min(elapsed / LAST_POP_AT, 1));
					state.beat = true;
				}
			}
			if (state.numeral && !this.lastPopped && elapsed >= LAST_POP_AT) {
				this.lastPopped = true;
				state.growth = 1;
				state.beat = true;
			}
			if (this.lastPopped) state.glow = clamp((elapsed - LAST_POP_AT) / (BLAST_AT - LAST_POP_AT), 0, 1);
			if (state.numeral && !this.blasted && elapsed >= BLAST_AT) {
				this.blasted = true;
				state.numeral = false;
				state.blast = true;
				state.glow = 0;
				this.sound?.boom();
			}
			const full = Math.floor(state.phase);
			if (full > this.lastFull) {
				this.sound?.kick();
				this.lastFull = full;
			}

			if (elapsed >= DURATION) {
				this.stage = "finale";
				this.finaleAt = now;
				state.finaleEdge = true;
				this.raise.target = 1;
				// The sound keeps its reference so an early exit during the tail can still silence it.
				this.sound?.finish();
			}
		} else if (now - this.finaleAt >= FINALE_HOLD) {
			this.release();
			this.beginEasing();
		}
	}

	/** Tell the page once that the dance is over, however it ended. */
	private release(): void {
		if (this.released) return;
		this.released = true;
		this.events.onRelease();
	}

	private beginEasing(): void {
		this.stage = "easing";
		this.state.active = false;
		// An early exit takes the numeral with it.
		this.state.numeral = false;
		this.state.glow = 0;
		this.weight.target = 0;
		this.light.target = 0;
	}

	/** Back to exactly how it was: lights at their base, no lamps, no floor, no sound. */
	private reset(): void {
		this.stage = "idle";
		// A finished dance leaves its chord to ring out; early exits have already silenced it.
		this.sound = null;
		const state = this.state;
		state.active = false;
		state.numeral = false;
		state.growth = 0;
		state.glow = 0;
		state.swing = 0;
		state.phase = 0;
		state.tempo = START_TEMPO;
		for (const spring of [this.weight, this.raise, this.light]) {
			spring.value = 0;
			spring.target = 0;
			spring.velocity = 0;
		}
		state.weight = 0;
		state.raise = 0;
		state.lights = 0;
		this.floorClock = 0;
		this.applyLights(0, 0);
		this.events.onIdle();
	}

	/** Dim the room, circle three coloured lamps over the bear, and glow the floor disc. */
	private applyLights(dt: number, wall: number): void {
		const level = this.state.lights;
		this.hemisphere.intensity = this.baseHemisphere + (DIM_HEMISPHERE - this.baseHemisphere) * level;
		this.sun.intensity = this.baseSun + (DIM_SUN - this.baseSun) * level;

		const tempoNorm = clamp((this.state.tempo - START_TEMPO) / TEMPO_GAIN, 0, 1);
		// Continuous sweeping, never on and off: only the angle changes, and only smoothly.
		this.lightAngle += (0.9 + 2.4 * tempoNorm) * dt;
		this.lamps.forEach((lamp, index) => {
			const angle = this.lightAngle + (index * Math.PI * 2) / this.lamps.length;
			lamp.position.set(Math.cos(angle) * 1.5, 2.2 + 0.3 * Math.sin(angle * 1.3 + index), 0.6 + Math.sin(angle) * 1.5);
			lamp.intensity = LIGHT_INTENSITY * level;
		});

		// One colour for the whole scene: the floor disc and the numeral crossfade through
		// honey, red and blue together. At most FLOOR_RATE_END changes a second, never a cut.
		this.floorClock += (FLOOR_RATE_START + (FLOOR_RATE_END - FLOOR_RATE_START) * tempoNorm) * wall;
		const from = Math.floor(this.floorClock);
		const blend = smoothstep(this.floorClock - from);
		this.state.colour
			.copy(this.colours[from % this.colours.length])
			.lerp(this.colours[(from + 1) % this.colours.length], blend);

		this.floor.visible = level > 0.001;
		if (!this.floor.visible) return;
		this.floorMaterial.color.copy(this.state.colour);
		this.floorMaterial.opacity = 0.6 * level;
	}
}
