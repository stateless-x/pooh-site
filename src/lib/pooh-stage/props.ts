import {
	CylinderGeometry,
	ExtrudeGeometry,
	Euler,
	Group,
	Mesh,
	MeshStandardMaterial,
	Quaternion,
	Shape,
	SphereGeometry,
	Vector3,
	type BufferGeometry,
	type Material,
	type Object3D,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { DanceState } from "./dance";
import { CLAY, CREAM, HONEY, RED } from "./palette";
import { Spring, clamp } from "./spring";

const TAU = Math.PI * 2;

/** The ring circles the belly, so a prop in front passes below the scarf and clear of the glasses. */
const RING_RADIUS = 0.8;
const RING_CENTRE = new Vector3(0, 0.5, 0);
/** Rolled about Z so the viewer's left side of the ring is the higher one. */
const RING_ROLL = -(10 * Math.PI) / 180;
const SECONDS_PER_TURN = 16;
const POP_GAP = 0.12;
/** The poster shows the bear alone, so the props wait for the fade to finish before they pop in. */
const POP_DELAY = 0.3;
const SCATTER_LENGTH = 0.35;
/** How far the ring widens on a poke; small enough that a scattered prop stays inside the frame. */
const SCATTER_KICK = 0.12;

const AXIS_Y = new Vector3(0, 1, 0);
const AXIS_Z = new Vector3(0, 0, 1);

interface Prop {
	group: Group;
	scale: Spring;
	spin: Spring;
	/** Individual offsets so the four never wobble or bob in step. */
	phase: number;
}

export class Props {
	readonly group = new Group();
	readonly meshes: Mesh[] = [];

	private readonly props: Prop[];
	private readonly glow: { material: MeshStandardMaterial; strength: number }[];
	private readonly materials: Record<"honey" | "cream" | "clay" | "red", MeshStandardMaterial>;
	private readonly radius = new Spring(0, 60, 9);
	private readonly speed = new Spring(1, 70, 10);
	private angle = 0;
	private scatterLeft = 0;
	private startedAt: number | null = null;
	private clock = 0;

	private readonly place = new Vector3();
	private readonly wobble = new Euler();
	private readonly wobbleQ = new Quaternion();
	private readonly spinQ = new Quaternion();

	constructor() {
		const paint = (color: string) =>
			new MeshStandardMaterial({ color, roughness: 0.88, metalness: 0 });
		this.materials = { honey: paint(HONEY), cream: paint(CREAM), clay: paint(CLAY), red: paint(RED) };
		// During the dance the room goes nearly dark, and dark clay would vanish into it, so
		// each material gets a glow in its own colour. The dark clay needs far more than
		// the light colours to stay readable. It is 0 outside the dance.
		this.glow = [
			{ material: this.materials.honey, strength: 0.3 },
			{ material: this.materials.cream, strength: 0.3 },
			{ material: this.materials.red, strength: 0.3 },
			{ material: this.materials.clay, strength: 0.9 },
		];
		for (const { material } of this.glow) material.emissive.copy(material.color);

		this.props = [this.stickyNote(), this.chatBubble(), this.honeyJar(), this.checklist()].map(
			(built, index) => {
				built.userData.propIndex = index;
				built.traverse((child) => {
					if (child instanceof Mesh) {
						child.userData.propIndex = index;
						this.meshes.push(child);
					}
				});
				built.visible = false;
				built.scale.setScalar(0);
				this.group.add(built);
				return {
					group: built,
					scale: new Spring(0, 170, 10),
					spin: new Spring(0, 160, 16),
					phase: index * 1.7,
				};
			},
		);
	}

	/** Start the pop-in. Called once the canvas is showing. */
	start(): void {
		this.startedAt = this.clock;
	}

	/** A poke: the ring kicks outward and runs fast, then both ease back. */
	scatter(): void {
		this.scatterLeft = SCATTER_LENGTH;
	}

	/** One quick full spin and a small pop for the prop that was hit. */
	spinProp(index: number): void {
		const prop = this.props[index];
		if (!prop || prop.scale.target === 0) return;
		prop.spin.target = prop.spin.value + TAU;
		prop.scale.velocity += 4;
	}

	/** Index of the prop a mesh belongs to, or null if it is not one of ours. */
	indexOf(object: Object3D): number | null {
		const index = object.userData.propIndex;
		return typeof index === "number" ? index : null;
	}

	update(dt: number, elapsed: number, facing: Quaternion, dance: DanceState): void {
		this.clock += dt;
		for (const { material, strength } of this.glow) material.emissiveIntensity = strength * dance.weight;
		this.scatterLeft = Math.max(0, this.scatterLeft - dt);
		this.radius.target = this.scatterLeft > 0 ? SCATTER_KICK : 0;
		// The orbit keeps pace with the dance tempo, and a poke still wins if it is faster.
		const danceSpeed = 1 + 2.2 * clamp((dance.tempo - 1.4) / 3.6, 0, 1) * dance.weight;
		this.speed.target = Math.max(this.scatterLeft > 0 ? 3 : 1, danceSpeed);
		this.angle += (TAU / SECONDS_PER_TURN) * this.speed.update(dt) * dt;
		const radius = RING_RADIUS + this.radius.update(dt);

		this.props.forEach((prop, index) => {
			if (
				this.startedAt !== null &&
				this.clock - this.startedAt >= POP_DELAY + index * POP_GAP
			) {
				prop.scale.target = 1;
			}
			const scale = prop.scale.update(dt);
			prop.group.visible = scale > 0.001;
			if (!prop.group.visible) return;
			prop.group.scale.setScalar(scale);

			// Evenly spaced around the ring: angle 0 is the front, so a prop passes in
			// front of the belly and then goes behind the body.
			const around = this.angle + (index * TAU) / this.props.length;
			this.place
				.set(Math.sin(around) * radius, 0, Math.cos(around) * radius)
				.applyAxisAngle(AXIS_Z, RING_ROLL)
				.add(RING_CENTRE);
			this.place.y += 0.03 * Math.sin(elapsed * 1.1 + prop.phase);
			prop.group.position.copy(this.place);

			// Props keep facing the camera instead of turning with the orbit.
			this.wobble.set(
				0.08 * Math.sin(elapsed * 0.9 + prop.phase * 2),
				0.15 * Math.sin(elapsed * 1.1 + prop.phase * 3),
				0.12 * Math.sin(elapsed * 1.3 + prop.phase),
			);
			this.wobbleQ.setFromEuler(this.wobble);
			this.spinQ.setFromAxisAngle(AXIS_Y, prop.spin.update(dt));
			prop.group.quaternion.copy(facing).multiply(this.wobbleQ).multiply(this.spinQ);

			if (prop.spin.target !== 0 && prop.spin.settled) {
				// Whole turn done: fold it away so the angle stays small.
				prop.spin.value -= prop.spin.target;
				prop.spin.target = 0;
			}
		});
	}

	private part(geometry: BufferGeometry, material: Material, x = 0, y = 0, z = 0): Mesh {
		const mesh = new Mesh(geometry, material);
		mesh.position.set(x, y, z);
		return mesh;
	}

	private slab(width: number, height: number, depth: number, radius: number) {
		return new RoundedBoxGeometry(width, height, depth, 6, radius);
	}

	/** Honey sticky note, three clay lines of text and a red pin. */
	private stickyNote(): Group {
		const { honey, clay, red } = this.materials;
		const group = new Group();
		group.add(this.part(this.slab(0.28, 0.28, 0.04, 0.02), honey));
		const lines: [number, number][] = [
			[0.17, 0.045],
			[0.17, 0.005],
			[0.1, -0.035],
		];
		for (const [width, y] of lines) {
			group.add(this.part(this.slab(width, 0.024, 0.014, 0.007), clay, (width - 0.17) / 2, y, 0.026));
		}
		const pin = this.part(new SphereGeometry(0.032, 20, 14), red, 0, 0.1, 0.034);
		pin.scale.z = 0.7;
		group.add(pin);
		return group;
	}

	/**
	 * Clay chat bubble: a soft pillow. Body and tail are one outline, extruded with a
	 * generous bevel, so there is no seam and no hard edge anywhere on it.
	 */
	private chatBubble(): Group {
		const { clay, cream } = this.materials;
		const group = new Group();
		// The outline is drawn a little smaller than the finished bubble because the bevel
		// grows it by its size on every side (about 0.32 by 0.22 in the end).
		const halfWidth = 0.135;
		const halfHeight = 0.085;
		const corner = 0.085;
		const outline = new Shape();
		outline.moveTo(-halfWidth + corner, halfHeight);
		outline.lineTo(halfWidth - corner, halfHeight);
		outline.quadraticCurveTo(halfWidth, halfHeight, halfWidth, halfHeight - corner);
		outline.lineTo(halfWidth, -halfHeight + corner);
		outline.quadraticCurveTo(halfWidth, -halfHeight, halfWidth - corner, -halfHeight);
		outline.lineTo(-halfWidth + 0.15, -halfHeight);
		// The tail flows out of the bottom left corner and curls back into the left edge.
		outline.quadraticCurveTo(-halfWidth + 0.07, -halfHeight - 0.01, -halfWidth + 0.01, -halfHeight - 0.07);
		outline.quadraticCurveTo(-halfWidth - 0.005, -halfHeight - 0.01, -halfWidth, -halfHeight + corner);
		outline.lineTo(-halfWidth, halfHeight - corner);
		outline.quadraticCurveTo(-halfWidth, halfHeight, -halfWidth + corner, halfHeight);

		const depth = 0.03;
		const bevel = 0.025;
		const raw = new ExtrudeGeometry(outline, {
			depth,
			bevelEnabled: true,
			bevelThickness: bevel,
			bevelSize: bevel,
			bevelSegments: 6,
			curveSegments: 24,
		});
		// Extrusion gives every face its own flat normals. Welding the vertices (UVs go
		// first, they would keep the seams apart) and recomputing normals shades the
		// whole bubble as one smooth surface.
		raw.deleteAttribute("uv");
		raw.deleteAttribute("normal");
		const pillow = mergeVertices(raw);
		pillow.computeVertexNormals();
		raw.dispose();
		// Centre it front to back; the body stays centred on the origin, tail hanging below.
		pillow.translate(0, 0, -depth / 2);
		group.add(this.part(pillow, clay));

		for (const x of [-0.075, 0, 0.075]) {
			const dot = this.part(new SphereGeometry(0.022, 16, 12), cream, x, 0, depth / 2 + bevel);
			dot.scale.z = 0.5;
			group.add(dot);
		}
		return group;
	}

	/** Squat honey jar, cream lid, small clay knob. */
	private honeyJar(): Group {
		const { honey, cream, clay } = this.materials;
		const group = new Group();
		const body = this.part(new SphereGeometry(0.125, 28, 20), honey, 0, -0.02, 0);
		body.scale.set(1, 0.9, 1);
		group.add(body);
		group.add(this.part(new CylinderGeometry(0.075, 0.08, 0.045, 24), cream, 0, 0.1, 0));
		group.add(this.part(new SphereGeometry(0.026, 16, 12), clay, 0, 0.14, 0));
		return group;
	}

	/** Cream checklist card on a clay backing, three honey checkboxes each with a line. */
	private checklist(): Group {
		const { cream, clay, honey } = this.materials;
		const group = new Group();
		group.add(this.part(this.slab(0.3, 0.36, 0.03, 0.015), clay, 0, 0, -0.004));
		group.add(this.part(this.slab(0.26, 0.32, 0.03, 0.015), cream, 0, 0, 0.012));
		for (const y of [0.09, 0, -0.09]) {
			group.add(this.part(this.slab(0.05, 0.05, 0.014, 0.012), honey, -0.07, y, 0.032));
			group.add(this.part(this.slab(0.11, 0.022, 0.014, 0.007), clay, 0.04, y, 0.032));
		}
		return group;
	}
}
