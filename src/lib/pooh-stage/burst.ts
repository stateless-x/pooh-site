import {
	CapsuleGeometry,
	ExtrudeGeometry,
	Group,
	type Color,
	Mesh,
	MeshBasicMaterial,
	MeshStandardMaterial,
	RingGeometry,
	Shape,
	SphereGeometry,
	Vector3,
	type BufferGeometry,
} from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Mood } from "./moods";
import { CLAY, CREAM, HONEY, RED } from "./palette";

/**
 * The click effects: each mood throws its own kind of particle from the hit
 * point, and a ring ripples out from the bear's feet. Everything lives in a
 * fixed pool built up front (geometries and materials shared, no per-frame or
 * per-click allocation), so fifty rapid clicks cost the same as one and the
 * oldest particle is simply reused when the pool is full. Every shape is
 * smooth: spheres, or outlines made of curves and extruded with a bevel.
 */

/** Room for a click burst and the numeral's blast (40 chunks) at the same time. */
const POOL_SIZE = 100;
const SHRINK = 0.3;
/** A blast chunk lives this long, shrinking over the last SHRINK seconds of it. */
const BLAST_LIFE = 0.8;
/** Share of speed kept after hitting the floor. */
const RESTITUTION = 0.55;
/** Below this downward speed a ball stops bouncing and rolls to rest. */
const REST_SPEED = 0.9;
const SQUASH_RECOVERY = 7;

const RING_LENGTH = 0.5;
const RING_FROM = 0.5;
const RING_TO = 1.1;
const RING_OPACITY = 0.18;

type Kind = "ball" | "heart" | "star" | "note" | "puff";
type Brand = 0 | 1 | 2 | 3 | 4;
const BRANDS = [HONEY, RED, CREAM, CLAY];
const [HONEY_AT, RED_AT, CREAM_AT, CLAY_AT, TINT_AT] = [0, 1, 2, 3, 4] as const;

const RING_TINT: Record<Mood, string> = {
	boing: CLAY,
	love: RED,
	sparkle: HONEY,
	bloop: HONEY,
	sing: CLAY,
	poof: CLAY,
};

interface Particle {
	mesh: Mesh;
	kind: Kind;
	velocity: Vector3;
	radius: number;
	age: number;
	/** Total time on screen; the last SHRINK seconds are spent shrinking away. */
	life: number;
	squash: number;
	squashAmount: number;
	/** Vertical stretch of a drop in flight; 1 for everything else. */
	stretch: number;
	gravity: number;
	drag: number;
	/** Sideways wobble speed, rate and phase, for things that float. */
	sway: number;
	swayRate: number;
	phase: number;
	tilt: number;
	spin: number;
	/** -1 ignores the floor; otherwise how many times it may bounce. */
	bounces: number;
	/** Height of the floor this particle bounces on: 0 for the stage floor, the viewport's bottom edge for a blast. */
	floor: number;
	/** A chunk of the numeral's blast: bright, and cleared when the dance's finale begins. */
	blast: boolean;
	restitution: number;
	/** Puffs start small and swell. */
	swell: boolean;
	live: boolean;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

/** Weld an extrusion's vertices and recompute normals, so the bevel shades as one smooth surface. */
function smooth(geometry: ExtrudeGeometry): BufferGeometry {
	geometry.deleteAttribute("uv");
	geometry.deleteAttribute("normal");
	const welded = mergeVertices(geometry);
	welded.computeVertexNormals();
	geometry.dispose();
	welded.center();
	return welded;
}

function extrude(outline: Shape): BufferGeometry {
	return smooth(
		new ExtrudeGeometry(outline, {
			depth: 0.2,
			bevelEnabled: true,
			bevelThickness: 0.18,
			bevelSize: 0.16,
			bevelSegments: 5,
			curveSegments: 16,
		}),
	);
}

function heartGeometry(): BufferGeometry {
	const heart = new Shape();
	heart.moveTo(0, -0.8);
	heart.bezierCurveTo(-0.2, -0.62, -0.9, -0.22, -0.9, 0.22);
	heart.bezierCurveTo(-0.9, 0.68, -0.32, 0.9, 0, 0.5);
	heart.bezierCurveTo(0.32, 0.9, 0.9, 0.68, 0.9, 0.22);
	heart.bezierCurveTo(0.9, -0.22, 0.2, -0.62, 0, -0.8);
	return extrude(heart);
}

function starGeometry(): BufferGeometry {
	// Ten points, alternating tip and notch. Drawing curves through the edge midpoints with
	// the points as control points rounds every corner, so the star has no sharp tip.
	const points: [number, number][] = [];
	for (let i = 0; i < 10; i += 1) {
		const angle = Math.PI / 2 + (i * Math.PI) / 5;
		const reach = i % 2 === 0 ? 0.95 : 0.45;
		points.push([Math.cos(angle) * reach, Math.sin(angle) * reach]);
	}
	const middle = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
	const star = new Shape();
	const start = middle(points[9], points[0]);
	star.moveTo(start[0], start[1]);
	for (let i = 0; i < 10; i += 1) {
		const end = middle(points[i], points[(i + 1) % 10]);
		star.quadraticCurveTo(points[i][0], points[i][1], end[0], end[1]);
	}
	return extrude(star);
}

function noteGeometry(): BufferGeometry {
	// A ball with a short stem, merged into one geometry so a note is one mesh. The stem is
	// a capsule so its ends are round too.
	const head = new SphereGeometry(0.8, 14, 10);
	const stem = new CapsuleGeometry(0.17, 1.8, 4, 8);
	stem.translate(0.68, 1.0, 0);
	const note = mergeGeometries([head, stem]);
	head.dispose();
	stem.dispose();
	if (!note) throw new Error("Could not merge the music note geometry");
	return note.center();
}

export class Burst {
	readonly group = new Group();

	private readonly particles: Particle[];
	private readonly geometries: Record<Kind, BufferGeometry>;
	/** The four brand materials, then one more that takes the numeral's colour for its blast. */
	private readonly materials = [...BRANDS, HONEY].map(
		(color) => new MeshStandardMaterial({ color, roughness: 0.88, metalness: 0 }),
	);
	/**
	 * The same colours with a glow of their own, for the blast chunks: the page is dark
	 * and the room is dim then, and dull chunks would read grey. The clay needs the most.
	 */
	private readonly glowMaterials = [HONEY, RED, CREAM, CLAY, HONEY].map(
		(color, index) =>
			new MeshStandardMaterial({
				color,
				emissive: color,
				emissiveIntensity: [0.6, 0.6, 0.5, 0.9, 0.7][index],
				roughness: 0.88,
				metalness: 0,
			}),
	);
	private readonly ring: Mesh;
	private readonly ringMaterial = new MeshBasicMaterial({
		color: CLAY,
		transparent: true,
		opacity: 0,
		depthWrite: false,
	});
	private ringAge = RING_LENGTH;
	private next = 0;

	constructor() {
		this.geometries = {
			ball: new SphereGeometry(1, 14, 10),
			heart: heartGeometry(),
			star: starGeometry(),
			note: noteGeometry(),
			puff: new SphereGeometry(1, 14, 10),
		};
		this.particles = Array.from({ length: POOL_SIZE }, () => {
			const mesh = new Mesh(this.geometries.ball, this.materials[0]);
			mesh.visible = false;
			this.group.add(mesh);
			return {
				mesh,
				kind: "ball",
				velocity: new Vector3(),
				radius: 0,
				age: 0,
				life: 1,
				squash: 0,
				squashAmount: 0.35,
				stretch: 1,
				gravity: 0,
				drag: 0,
				sway: 0,
				swayRate: 0,
				phase: 0,
				tilt: 0,
				spin: 0,
				bounces: -1,
				floor: 0,
				blast: false,
				restitution: RESTITUTION,
				swell: false,
				live: false,
			};
		});

		this.ring = new Mesh(new RingGeometry(0.94, 1, 64), this.ringMaterial);
		this.ring.rotation.x = -Math.PI / 2;
		this.ring.position.y = 0.004;
		this.ring.visible = false;
		this.group.add(this.ring);
	}

	/** Throw the mood's particles from `point`. The oldest are reused when the pool is full. */
	spawn(point: Vector3, mood: Mood): void {
		const count = mood === "boing" ? 12 : mood === "sparkle" ? 12 : mood === "poof" ? 12 : 10;
		for (let i = 0; i < count; i += 1) {
			const p = this.particles[this.next];
			this.next = (this.next + 1) % POOL_SIZE;
			this.reset(p, point);
			switch (mood) {
				case "boing": {
					// Clay balls up and out; they fall and bounce on the floor.
					const angle = rand(0, Math.PI * 2);
					const speed = rand(0.6, 1.6);
					this.setup(p, "ball", pick([HONEY_AT, RED_AT, CREAM_AT, CLAY_AT]), rand(0.03, 0.055), 1.8);
					p.velocity.set(Math.cos(angle) * speed, rand(2.0, 3.2), Math.sin(angle) * speed + 0.5);
					p.gravity = 9;
					p.bounces = 3;
					break;
				}
				case "love": {
					// Hearts that float up and sway, then shrink away. They start at the sides of
					// the head and drift outward, so the glasses stay clear.
					this.setup(p, "heart", pick([RED_AT, CREAM_AT, RED_AT]), rand(0.07, 0.1), 1.8);
					const side = this.besideHead(p, i);
					p.velocity.set(side * rand(0.3, 0.7), rand(0.7, 1.2), rand(-0.1, 0.1));
					p.gravity = -0.35;
					p.drag = 1.4;
					p.sway = 0.25;
					p.swayRate = rand(3, 5);
					p.tilt = 0.35;
					break;
				}
				case "sparkle": {
					// A ring of stars bursting out in the plane facing the camera, then falling.
					const angle = (i / count) * Math.PI * 2 + rand(-0.15, 0.15);
					const speed = rand(1.2, 1.6);
					this.setup(p, "star", pick([HONEY_AT, CREAM_AT, HONEY_AT]), rand(0.06, 0.085), 1.5);
					p.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed + 0.6, rand(0, 0.3));
					p.gravity = 5;
					p.drag = 0.6;
					p.spin = rand(-4, 4);
					p.bounces = 1;
					p.restitution = 0.35;
					break;
				}
				case "bloop": {
					// Honey drops that arc, splash flat on the floor and bounce once.
					this.setup(p, "ball", HONEY_AT, rand(0.035, 0.05), 1.3);
					p.velocity.set(rand(-1, 1), rand(2.2, 3.4), rand(-0.8, 0.8) + 0.4);
					p.gravity = 11;
					p.stretch = 1.25;
					p.squashAmount = 0.6;
					p.bounces = 1;
					p.restitution = 0.35;
					break;
				}
				case "sing": {
					// Notes drifting up in a lazy wobble.
					this.setup(p, "note", CLAY_AT, rand(0.07, 0.1), 1.8);
					const side = this.besideHead(p, i);
					p.velocity.set(side * rand(0.3, 0.7), rand(0.7, 1.0), rand(-0.1, 0.1));
					p.gravity = -0.15;
					p.drag = 0.8;
					p.sway = 0.5;
					p.swayRate = rand(2.5, 3.5);
					p.tilt = 0.25;
					break;
				}
				case "poof": {
					// Cream puffs that swell as they drift apart and fade like smoke.
					const angle = rand(0, Math.PI * 2);
					const speed = rand(0.6, 1.0);
					this.setup(p, "puff", CREAM_AT, rand(0.07, 0.11), 1.3);
					p.velocity.set(Math.cos(angle) * speed, rand(0.1, 0.7), Math.sin(angle) * speed + 0.3);
					p.gravity = -0.1;
					p.drag = 2.5;
					p.swell = true;
					break;
				}
			}
		}
	}

	/**
	 * The numeral bursts: bright chunks in all four brand colours (and the numeral's own
	 * colour) fly out from its body, spin, fall to the bottom edge of the viewport, bounce
	 * there and shrink away. `floorY` is the world height of that edge at the numeral's
	 * depth. Gravity is strong and the life short, so they are all gone before the page
	 * lightens at the end of the dance.
	 */
	explode(centre: Vector3, scale: number, colour: Color, floorY: number): void {
		const tint = this.glowMaterials[TINT_AT];
		tint.color.copy(colour);
		tint.emissive.copy(colour);
		const reach = 0.7 + 0.3 * scale;
		for (let i = 0; i < 40; i += 1) {
			const p = this.particles[this.next];
			this.next = (this.next + 1) % POOL_SIZE;
			this.reset(p, centre);
			// Start somewhere inside the body of the numeral, then fly away from its centre.
			const dx = rand(-0.9, 0.9) * scale;
			const dy = rand(-0.6, 0.6) * scale;
			p.mesh.position.set(centre.x + dx, centre.y + dy, centre.z);
			const length = Math.hypot(dx, dy) || 1;
			const speed = rand(1.0, 2.2) * reach;
			this.setup(
				p,
				pick<Kind>(["ball", "ball", "star", "heart"]),
				pick([TINT_AT, TINT_AT, TINT_AT, CREAM_AT, RED_AT, CLAY_AT, CLAY_AT]),
				rand(0.07, 0.13) * (0.6 + 0.4 * scale),
				BLAST_LIFE,
				true,
			);
			p.blast = true;
			p.floor = floorY;
			// Strong enough gravity to reach the floor in about a third of a second, wherever the chunk starts.
			const drop = Math.max(p.mesh.position.y - floorY, 0.3);
			p.gravity = Math.min(Math.max((2 * drop) / 0.1, 30), 140);
			p.drag = 0.5;
			// Mostly outward: little upward speed, so the climb does not delay the fall.
			p.velocity.set((dx / length) * speed, (dy / length) * speed * 0.4, rand(-0.3, 0.6));
			p.spin = rand(-6, 6);
			p.bounces = 1;
			p.restitution = 0.45;
		}
	}

	/** Drop every blast chunk at once: none may be seen once the page lightens. */
	clearBlast(): void {
		for (const p of this.particles) {
			if (!p.blast) continue;
			p.live = false;
			p.mesh.visible = false;
		}
	}

	/** Remove every particle at once, for the end of a dance. */
	clear(): void {
		for (const p of this.particles) {
			p.live = false;
			p.mesh.visible = false;
		}
		this.ringAge = RING_LENGTH;
		this.ring.visible = false;
	}

	/**
	 * Place a particle beside the head, alternating left and right, out past the
	 * glasses and a little behind the face. Returns -1 or 1, the side it is on, so the
	 * particle can drift further out.
	 */
	private besideHead(p: Particle, index: number): number {
		const side = index % 2 === 0 ? 1 : -1;
		p.mesh.position.set(side * rand(0.62, 0.95), rand(0.95, 1.5), rand(-0.1, 0.2));
		return side;
	}

	/** A ripple on the floor at the bear's feet, tinted for the mood. */
	pulse(mood: Mood): void {
		this.ringMaterial.color.set(RING_TINT[mood]);
		this.ringAge = 0;
	}

	update(dt: number): void {
		for (const p of this.particles) {
			if (p.live) this.step(p, dt);
		}

		if (this.ringAge < RING_LENGTH) {
			this.ringAge += dt;
			const progress = Math.min(this.ringAge / RING_LENGTH, 1);
			// Ease out so the ripple leaves quickly and lingers as it fades.
			const eased = 1 - (1 - progress) * (1 - progress);
			this.ring.scale.setScalar(RING_FROM + (RING_TO - RING_FROM) * eased);
			this.ringMaterial.opacity = RING_OPACITY * (1 - progress);
			this.ring.visible = progress < 1;
		}
	}

	/** Put a pooled particle back to a neutral state at `point`. */
	private reset(p: Particle, point: Vector3): void {
		p.age = 0;
		p.squash = 0;
		p.squashAmount = 0.35;
		p.stretch = 1;
		p.gravity = 0;
		p.drag = 0;
		p.sway = 0;
		p.swayRate = 0;
		p.phase = rand(0, Math.PI * 2);
		p.tilt = 0;
		p.spin = 0;
		p.bounces = -1;
		p.floor = 0;
		p.blast = false;
		p.restitution = RESTITUTION;
		p.swell = false;
		p.live = true;
		// A little scatter so a burst starts as a spray, not a single point.
		p.mesh.position.set(point.x + rand(-0.12, 0.12), point.y + rand(-0.06, 0.1), point.z);
		p.mesh.rotation.set(0, 0, 0);
		p.mesh.visible = true;
	}

	private setup(p: Particle, kind: Kind, brand: Brand, radius: number, life: number, glow = false): void {
		p.kind = kind;
		p.radius = radius;
		p.life = life;
		p.mesh.geometry = this.geometries[kind];
		p.mesh.material = (glow ? this.glowMaterials : this.materials)[brand];
		p.mesh.scale.setScalar(radius);
	}

	private step(p: Particle, dt: number): void {
		const { mesh, velocity, radius } = p;
		p.age += dt;
		if (p.age >= p.life) {
			p.live = false;
			mesh.visible = false;
			return;
		}

		velocity.y -= p.gravity * dt;
		if (p.drag > 0) velocity.multiplyScalar(Math.exp(-p.drag * dt));
		mesh.position.addScaledVector(velocity, dt);
		if (p.sway > 0) mesh.position.x += p.sway * Math.cos(p.age * p.swayRate + p.phase) * dt;

		if (p.bounces >= 0 && mesh.position.y <= p.floor + radius && velocity.y < 0) {
			mesh.position.y = p.floor + radius;
			if (p.bounces > 0 && velocity.y < -REST_SPEED) {
				velocity.y = -velocity.y * p.restitution;
				velocity.x *= 0.8;
				velocity.z *= 0.8;
				p.squash = 1;
				p.bounces -= 1;
			} else {
				// Resting: the ground drags the roll to a stop.
				velocity.y = 0;
				const drag = Math.exp(-6 * dt);
				velocity.x *= drag;
				velocity.z *= drag;
			}
		}

		if (p.tilt > 0) mesh.rotation.z = p.tilt * Math.sin(p.age * p.swayRate + p.phase);
		if (p.spin !== 0) mesh.rotation.z += p.spin * dt;

		// Flatten on impact, then recover; puffs swell; everything shrinks away at the end.
		p.squash = Math.max(0, p.squash - SQUASH_RECOVERY * dt);
		const flat = p.stretch * (1 - p.squashAmount * p.squash);
		const wide = 1 + p.squashAmount * 0.55 * p.squash;
		const remaining = p.life - p.age;
		const shrink = remaining < SHRINK ? remaining / SHRINK : 1;
		const grow = p.swell ? 0.35 + 1.15 * (p.age / p.life) : 1;
		const size = radius * shrink * grow;
		mesh.scale.set(size * wide, size * flat, size * wide);
	}
}
