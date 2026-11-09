import { Euler, Mesh, Quaternion, type Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import poohUrl from "../../assets/models/pooh.glb?url";
import type { DanceState } from "./dance";
import type { GazeState } from "./gaze";
import type { Mood } from "./moods";
import { Spring, clamp } from "./spring";

const TAU = Math.PI * 2;
const GRAVITY = 16;
/** Radians of turn per pixel dragged. */
const SPIN_PER_PX = 0.012;

const WAVE_LENGTH = 1.7;
const SHAKE_LENGTH = 1.0;

type Reaction = "wave" | "hop" | "shake" | "sing" | "boing" | "poof";
/** The model's arms lean about 35 degrees forward from the shoulder; this much roll about x brings them back into the plane of the chest. */
const DANCE_ARM_X = 0.61;

/** How long each reaction runs. */
const REACTION_LENGTH: Record<Reaction, number> = {
	wave: WAVE_LENGTH,
	hop: 0.8,
	shake: SHAKE_LENGTH,
	sing: 2.0,
	boing: 0.9,
	poof: 0.7,
};

/** Which reaction each click mood plays. */
const MOOD_REACTION: Record<Mood, Reaction> = {
	boing: "boing",
	love: "wave",
	sparkle: "hop",
	bloop: "shake",
	sing: "sing",
	poof: "poof",
};

/** Linear 0..1 ramp, for envelopes that fade in and out. */
const ramp = (x: number) => clamp(x, 0, 1);
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

/**
 * The 3D bear. Nodes are addressed by name because the GLB has every pivot at
 * its joint and every node at identity, so a pose is just a rotation per node.
 * Everything that moves does so through a spring.
 */
export class Bear {
	readonly meshes: Mesh[] = [];

	private readonly head: Object3D;
	private readonly armL: Object3D;
	private readonly armR: Object3D;
	private readonly tailA: Object3D;
	private readonly tailB: Object3D;

	private readonly headYaw = new Spring(0, 220, 22);
	private readonly headPitch = new Spring(0, 220, 22);
	/** The root turns a quarter as far as the head, and lazily. */
	private readonly follow = new Spring(0, 40, 9);
	private readonly spin = new Spring(0, 40, 7);
	private readonly hopSpin = new Spring(0, 90, 13);
	private readonly squash = new Spring(0, 220, 9);
	private readonly armLx = new Spring(0, 130, 12);
	private readonly armLz = new Spring(0, 130, 12);
	private readonly armRx = new Spring(0, 130, 12);
	private readonly armRz = new Spring(0, 130, 12);
	private readonly tailAz = new Spring(0, 70, 5);
	private readonly tailBz = new Spring(0, 70, 5);

	/** 0 to 1: how much of the falling flail is blended in. */
	private readonly fall = new Spring(0, 260, 26);
	/** Seconds since the fall began; it keeps running while the flail fades out after landing. */
	private flailTime = 0;
	private hopY = 0;
	private hopVy = 0;
	private nextExcitedHop = 0;
	private dragging = false;
	private reaction: Reaction | null = null;
	/** The current wave is a hello rather than a reaction to a poke, so it faces the visitor. */
	private greeting = false;
	private reactionAge = 0;
	private launched = false;
	private previousYaw = 0;
	private readonly poseEuler = new Euler();
	private readonly restQuaternion = new Quaternion();
	private readonly danceQuaternion = new Quaternion();

	private constructor(readonly root: Object3D) {
		const node = (name: string) => {
			const found = root.getObjectByName(name);
			if (!found) throw new Error(`Pooh model has no node named ${name}`);
			return found;
		};
		this.head = node("Head");
		this.armL = node("ArmL");
		this.armR = node("ArmR");
		this.tailA = node("ScarfTailA");
		this.tailB = node("ScarfTailB");
		// Yaw first, then pitch, so turning to look sideways never rolls the head.
		this.head.rotation.order = "YXZ";
		root.traverse((child) => {
			if (child instanceof Mesh) this.meshes.push(child);
		});
	}

	static async load(): Promise<Bear> {
		const gltf = await new GLTFLoader().loadAsync(poohUrl);
		const pooh = gltf.scene.getObjectByName("Pooh");
		if (!pooh) throw new Error("Pooh model has no Pooh root node");
		return new Bear(pooh);
	}

	/** Height above the ground, for the contact shadow. */
	get lift(): number {
		return this.hopY;
	}

	update(dt: number, elapsed: number, gaze: GazeState, dance: DanceState): void {
		// A poke reaction in flight would fight the dance for the arms.
		if (dance.active) this.reaction = null;
		if (dance.finaleEdge) this.hop(0.3);
		// The numeral bursts on the same frame as the finale, whose hop is already under way.
		if (dance.blast) this.squash.velocity = -5;
		this.stepHop(dt, elapsed, gaze.excited);
		this.stepReaction(dt);
		const reaction = this.reaction;
		const age = this.reactionAge;

		if (reaction !== "wave") this.greeting = false;
		this.headYaw.target = this.greeting ? 0 : gaze.yaw;
		this.headPitch.target = this.greeting ? 0 : gaze.pitch;
		this.follow.target = gaze.yaw * 0.25;

		// Arm targets, in rising priority: rest, point, wave, cheer.
		const sway = Math.sin(elapsed * 1.4) * 0.03;
		let lx = 0;
		let lz = sway;
		let rx = 0;
		let rz = -Math.sin(elapsed * 1.4 + 1.7) * 0.03;
		if (gaze.point === "armL") {
			lx = -0.5;
			lz = 1.9;
		} else if (gaze.point === "armR") {
			rx = -0.5;
			rz = -1.9;
		}
		if (reaction === "wave") {
			lx = -2.0;
			lz = 0.5;
		}
		if (gaze.excited) {
			// A V with the arms swung out and up, which reads from the front where arms raised forward would not.
			lx = rx = -0.3;
			lz = 2.5;
			rz = -2.5;
		}
		this.armLx.target = lx;
		this.armLz.target = lz;
		this.armRx.target = rx;
		this.armRz.target = rz;

		this.spin.update(dt);
		this.settleTurns();

		const yaw = this.follow.update(dt) + this.spin.value + this.hopSpin.update(dt);
		// Whole turns are folded away when things settle, so measure the step modulo one turn.
		const step = yaw - this.previousYaw;
		const yawVelocity = dt > 0 ? (step - TAU * Math.round(step / TAU)) / dt : 0;
		this.previousYaw = yaw;
		// Falling takes the body over from the dance until the bear has landed.
		const flail = clamp(this.fall.update(dt), 0, 1);
		this.flailTime += dt;
		const ft = this.flailTime;
		const dancing = dance.weight * (1 - flail);
		// Singing: a gentle sway with nods in time, fading in and out so nothing snaps.
		const singing =
			reaction === "sing" ? ramp(age / 0.3) * ramp((REACTION_LENGTH.sing - age) / 0.3) : 0;
		this.root.rotation.y = yaw;
		// The dance bounces on every half cycle, touching down as the hands cross, and
		// leans the body toward whichever hand is up (negative roll tips the top toward +X).
		this.root.position.y =
			this.hopY + dancing * 0.04 * Math.abs(Math.sin(dance.phase * TAU)) + singing * 0.015 * Math.abs(Math.sin(age * 4.5));
		this.root.rotation.z =
			-0.07 * dance.swing * dancing + singing * 0.1 * Math.sin(age * 4.5) + flail * 0.22 * Math.sin(ft * 10);

		const squash = this.squash.update(dt);
		const breath = 0.012 * Math.sin(elapsed * 1.6);
		const bulge = 1 / Math.sqrt(1 + squash);
		this.root.scale.set(bulge, (1 + squash) * (1 + breath), bulge);

		// Head: the shake is added after the spring so it can be faster than the spring is.
		const shake = reaction === "shake" ? Math.sin(age * 18) * 0.55 * ramp(age * 10) * (1 - age / SHAKE_LENGTH) : 0;
		this.head.rotation.y = this.headYaw.update(dt) + shake;
		this.head.rotation.x =
			this.headPitch.update(dt) +
			(reaction === "shake" ? 0.1 * Math.abs(shake) : 0) +
			singing * 0.16 * Math.sin(age * 9) -
			// Woah: the head snaps back to look up at where it fell from.
			flail * 0.3;
		this.head.rotation.z =
			0.12 * dance.swing * dancing - singing * 0.1 * Math.sin(age * 4.5) - flail * 0.15 * Math.sin(ft * 10);

		const waving =
			reaction === "wave" ? Math.sin(age * 11) * 0.4 * ramp((age - 0.25) / 0.25) * ramp((WAVE_LENGTH - age) / 0.15) : 0;
		// The dance drives the arms directly rather than through their springs: a spring this
		// soft would blur a five-cycle-a-second swing and put the hands out of step with the
		// sound. The springs keep tracking the rest pose underneath, and `dancing` blends
		// between the two, so entering and leaving the dance never snaps.
		// Both hands out to the sides like a pair of scales: one up while the other is down.
		const leftDance = lerp(1.45 + 0.6 * dance.swing, 2.7, dance.raise);
		const rightDance = lerp(-1.45 + 0.6 * dance.swing, -2.7, dance.raise);
		// The flail windmills both arms high and out of step, faster than a spring could follow.
		const leftX = lerp(this.armLx.update(dt), -0.4 + 0.5 * Math.sin(ft * 13), flail);
		const rightX = lerp(this.armRx.update(dt), -0.4 - 0.5 * Math.sin(ft * 13), flail);
		const leftZ = lerp(this.armLz.update(dt) + waving, 2.3 + 0.6 * Math.sin(ft * 16), flail);
		const rightZ = lerp(this.armRz.update(dt), -2.3 + 0.6 * Math.sin(ft * 16), flail);
		this.poseArm(this.armL, leftX, leftZ, leftDance, dancing);
		this.poseArm(this.armR, rightX, rightZ, rightDance, dancing);
		// The arms are short, so the dance enlarges them enough to read as a gesture.
		const armScale = 1 + 0.3 * dancing;
		this.armL.scale.setScalar(armScale);
		this.armR.scale.setScalar(armScale);

		// Tails hang from the knot and swing opposite to a turn, so they trail behind it.
		const flap =
			(reaction === "shake" ? Math.sin(age * 20) * 0.5 * (1 - age / SHAKE_LENGTH) : 0) + singing * 0.2 * Math.sin(age * 9);
		const lag = clamp(-0.05 * yawVelocity, -0.9, 0.9);
		this.tailAz.target = 0.12 + 0.1 * Math.sin(elapsed * 1.7) + lag + 0.06 * this.hopVy;
		this.tailBz.target = -0.1 + 0.08 * Math.sin(elapsed * 2.1 + 1) + lag * 0.8 - 0.04 * this.hopVy;
		this.tailA.rotation.z = this.tailAz.update(dt) + flap;
		this.tailB.rotation.z = this.tailBz.update(dt) - flap;
	}

	/**
	 * Blend an arm between its normal pose (x then y then z, as every other pose is
	 * written) and its dance pose. The dance needs the x lean cancelled first and the
	 * swing applied after it, which is the opposite Euler order, so the two poses are
	 * blended as quaternions: with `amount` at 0 the arm is exactly where the springs
	 * put it, and entering or leaving the dance never snaps.
	 */
	private poseArm(arm: Object3D, x: number, z: number, danceZ: number, amount: number): void {
		this.poseEuler.set(x, 0, z, "XYZ");
		this.restQuaternion.setFromEuler(this.poseEuler);
		this.poseEuler.set(DANCE_ARM_X, 0, danceZ, "ZYX");
		this.danceQuaternion.setFromEuler(this.poseEuler);
		arm.quaternion.slerpQuaternions(this.restQuaternion, this.danceQuaternion, amount);
	}

	/** Squash and stretch, then the reaction that belongs to the click mood. */
	/** A hello: the same wave as a poke but with no squash, inviting the visitor to touch. */
	wave(): void {
		if (this.reaction) return;
		this.reaction = "wave";
		this.reactionAge = 0;
		this.launched = false;
		this.greeting = true;
	}

	poke(mood: Mood): void {
		this.greeting = false;
		const reaction = MOOD_REACTION[mood];
		// The two jumps crouch harder first; the launch itself comes a moment later.
		this.squash.velocity = reaction === "poof" ? -7 : reaction === "boing" ? -5 : -4;
		this.reaction = reaction;
		this.reactionAge = 0;
		this.launched = false;
		if (reaction === "hop") {
			this.hop(0.35);
			this.hopSpin.target = TAU;
		}
	}

	/** Gathering for a jump the stage is about to move it through. */
	crouch(): void {
		this.squash.velocity -= 3;
	}

	/** Takeoff for that jump: a stretch up out of the crouch. */
	leap(): void {
		this.squash.velocity += 4;
	}

	/** The stage has dropped the bear: arms windmill and the body wobbles until it lands. */
	startFall(): void {
		this.flailTime = 0;
		this.fall.target = 1;
		// A startled stretch on the way up, before the drop.
		this.squash.velocity += 3;
	}

	/** Touchdown after a drop the stage moved it through: the harder it lands, the deeper it squashes. */
	land(speed: number): void {
		this.endFall();
		this.squash.velocity -= Math.min(speed * 1.6, 4.5);
	}

	/** The fall is over without a landing (the dance was stopped mid-air): just stop flailing. */
	endFall(): void {
		this.fall.target = 0;
	}

	beginSpin(): void {
		this.dragging = true;
		// Track the finger tightly while it is down.
		this.spin.stiffness = 300;
		this.spin.damping = 28;
	}

	spinBy(pixels: number): void {
		this.spin.target += pixels * SPIN_PER_PX;
	}

	/** Let go like a toy on a turntable: keep the momentum, then come to rest facing front. */
	endSpin(): void {
		this.dragging = false;
		this.spin.stiffness = 40;
		this.spin.damping = 7;
		this.spin.target = Math.round((this.spin.value + this.spin.velocity * 0.3) / TAU) * TAU;
	}

	private hop(height: number): void {
		if (this.hopY > 0) return;
		this.hopVy = Math.sqrt(2 * GRAVITY * height);
		this.squash.velocity += 2.5;
	}

	private stepHop(dt: number, elapsed: number, excited: boolean): void {
		if (excited && this.hopY === 0 && elapsed >= this.nextExcitedHop) {
			this.hop(0.12);
			this.nextExcitedHop = elapsed + 0.75;
		}
		if (this.hopY === 0 && this.hopVy === 0) return;
		this.hopVy -= GRAVITY * dt;
		this.hopY += this.hopVy * dt;
		if (this.hopY <= 0) {
			this.squash.velocity -= Math.min(Math.abs(this.hopVy) * 0.9, 4);
			this.hopY = 0;
			this.hopVy = 0;
		}
	}

	private stepReaction(dt: number): void {
		if (!this.reaction) return;
		this.reactionAge += dt;
		// A tall boing and a pop both crouch first and leave the ground a moment later,
		// with an extra stretch so the jump reads as springy.
		if (!this.launched && this.reaction === "boing" && this.reactionAge >= 0.1) {
			this.launched = true;
			// The camera is tight, so the jump is kept low and the stretch does the talking.
			this.hop(0.3);
			this.squash.velocity += 3;
		} else if (!this.launched && this.reaction === "poof" && this.reactionAge >= 0.18) {
			this.launched = true;
			this.hop(0.25);
			this.squash.velocity += 4;
		}
		if (this.reactionAge >= REACTION_LENGTH[this.reaction]) this.reaction = null;
	}

	/** Fold whole turns away once everything has stopped, so the angles never grow without bound. */
	private settleTurns(): void {
		if (!this.dragging && this.spin.settled) {
			this.spin.value -= this.spin.target;
			this.spin.target = 0;
		}
		if (this.hopSpin.target === TAU && this.hopSpin.settled) {
			this.hopSpin.value = 0;
			this.hopSpin.target = 0;
		}
	}
}
