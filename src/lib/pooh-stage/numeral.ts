import {
	Euler,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshStandardMaterial,
	Path,
	Quaternion,
	Shape,
	Vector3,
	type BufferGeometry,
	type PerspectiveCamera,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { DanceState } from "./dance";
import { HONEY } from "./palette";
import { Spring } from "./spring";

/**
 * The big "67" that floats above the bear during the dance. No font and no
 * model: both digits are drawn here as outlines (the 6 with a real hole), then
 * extruded with a generous bevel and welded into one smooth surface, so they
 * read as soft honey-coloured clay with no hard edges.
 */

const EXTRUDE_DEPTH = 0.22;
const BEVEL_THICKNESS = 0.1;

/**
 * Width and height of the pair at scale 1, in world units, measured on the finished
 * geometry: the outlines plus the bevel on every side.
 */
const WIDTH = 2.04;
const HEIGHT = 1.65;
/**
 * How far behind the bear the numeral sits. The bear spans about 0.6 either side of
 * the origin and the orbiting props reach 0.8 behind it, so this keeps the numeral
 * behind everything however it is rotated. Its scale is compensated for the extra
 * distance, so it still appears at the size it was asked for.
 */
const DEPTH = -2.5;
/** Start width as a share of the stage, about the width of the bear's head. */
const START_WIDTH = 0.42;
/** Share of the viewport the numeral may fill at its largest: about a 2 percent margin all round. */
const FILL = 0.98;
/** At large sizes the digits stay shallow, so their front face is not thrown far toward the camera. */
const MAX_DEPTH_SCALE = 0.9;
/** Half the extruded depth plus its bevel: how far the front face sits in front of the group origin. */
const FRONT = (EXTRUDE_DEPTH + 2 * BEVEL_THICKNESS) / 2;
/** A dash lasts this long: free flight, then the numeral eases home. */
const DASH_LENGTH = 1.2;
const DASH_FLIGHT = 0.8;

const EXTRUDE = {
	depth: EXTRUDE_DEPTH,
	bevelEnabled: true,
	bevelThickness: BEVEL_THICKNESS,
	bevelSize: 0.075,
	bevelSegments: 6,
	curveSegments: 28,
};

/**
 * Turn a polygon into a path with every corner rounded: each corner becomes a
 * quadratic curve that starts and ends `radius` away along its two edges.
 */
function roundedPolygon(points: [number, number][], radii: number[]): Shape {
	const shape = new Shape();
	const count = points.length;
	for (let i = 0; i < count; i += 1) {
		const previous = points[(i + count - 1) % count];
		const corner = points[i];
		const next = points[(i + 1) % count];
		const radius = radii[i];
		const toward = (from: [number, number], to: [number, number]): [number, number] => {
			const dx = to[0] - from[0];
			const dy = to[1] - from[1];
			const length = Math.hypot(dx, dy);
			return [from[0] + (dx / length) * radius, from[1] + (dy / length) * radius];
		};
		const entry = toward(corner, previous);
		const exit = toward(corner, next);
		if (i === 0) shape.moveTo(entry[0], entry[1]);
		else shape.lineTo(entry[0], entry[1]);
		shape.quadraticCurveTo(corner[0], corner[1], exit[0], exit[1]);
	}
	shape.closePath();
	return shape;
}

/** The 6: a ring with a tail that sweeps up and curls over to the right. Drawn around the origin. */
function sixOutline(): Shape {
	const six = new Shape();
	// Start at the top of the tail's rounded tip and run down its outer edge to the
	// left of the ring, around the ring's bottom and right and over its top, then back
	// up the tail's inner edge to the tip.
	six.moveTo(0.3, 0.7);
	six.bezierCurveTo(-0.05, 0.72, -0.44, 0.5, -0.44, -0.3);
	six.absellipse(0, -0.3, 0.44, 0.5, Math.PI, Math.PI * 2 + (Math.PI * 2) / 3, false);
	six.bezierCurveTo(-0.17, 0.3, 0.0, 0.45, 0.3, 0.43);
	six.absarc(0.3, 0.565, 0.135, -Math.PI / 2, Math.PI / 2, false);
	six.closePath();
	// The counter of the 6: a real hole, so the clay is open in the middle.
	const hole = new Path();
	hole.absellipse(0, -0.3, 0.19, 0.25, 0, Math.PI * 2, false);
	six.holes.push(hole);
	return six;
}

/** The 7: a bar across the top and a stem leaning down and to the left, all corners rounded. */
function sevenOutline(): Shape {
	return roundedPolygon(
		[
			[-0.42, 0.7],
			[0.42, 0.7],
			[0.05, -0.8],
			[-0.25, -0.8],
			[0.054, 0.43],
			[-0.42, 0.43],
		],
		[0.13, 0.13, 0.12, 0.12, 0.06, 0.13],
	);
}

function solid(outline: Shape): BufferGeometry {
	const raw = new ExtrudeGeometry(outline, EXTRUDE);
	// Extrusion gives every face flat normals. Welding the vertices (UVs go first, they keep
	// seams apart) and recomputing normals shades the digit as one soft surface.
	raw.deleteAttribute("uv");
	raw.deleteAttribute("normal");
	const welded = mergeVertices(raw);
	welded.computeVertexNormals();
	raw.dispose();
	// Centre it front to back, so scaling the numeral up never throws its front face toward the camera.
	welded.translate(0, 0, -EXTRUDE_DEPTH / 2);
	return welded;
}

/** How much bigger the whole scene is drawn at the peak of the dance. */
export const BEAR_GROW = 0.3;
/** Where the tips of the ears and the edge of the floor disc sit in the square frame, from its top. */
export const EARS_AT = 0.14;
export const FEET_AT = 0.95;
/** Below this width the hero stacks, the same as the 48em breakpoint in the pages. */
export const STACKED_BELOW = 768;
/** The clear space kept between the numeral and the ears when it floats above the bear, as a share of the screen. */
const GAP = 0.015;
const MARGIN = 0.02;
/** How far a beat's pop may overshoot on a phone, where its room above the bear is reserved in advance. */
const POP_ROOM = 1.12;

/** What the numeral needs to know about the screen, in CSS pixels of the canvas. */
export interface NumeralView {
	width: number;
	height: number;
	stageLeft: number;
	stageTop: number;
	stageSize: number;
	/** The frame as it is drawn right now: larger than the stage while the bear has grown. */
	drawTop: number;
	drawSize: number;
}

export class Numeral {
	readonly group = new Group();
	readonly meshes: Mesh[] = [];
	/** Where the numeral's centre is right now, in world units. */
	readonly centre = new Vector3();
	/**
	 * On a phone, where the tips of the ears need to be for the numeral to fit above them,
	 * in client pixels. Null when the bear can stay where it is.
	 */
	earTop: number | null = null;
	/** Its world scale on the last frame it was showing, for the blast. */
	lastScale = 1;
	/** Called on every wall bounce of a dash; `high` alternates so the blips ping-pong. */
	onBounce: (high: boolean) => void = () => {};

	private readonly material = new MeshStandardMaterial({
		color: HONEY,
		emissive: HONEY,
		emissiveIntensity: 0.5,
		roughness: 0.7,
		metalness: 0,
	});
	/** Width in pixels: it grows with the beats and pops when a beat lands. */
	private readonly width = new Spring(0, 170, 9);
	private readonly x = new Spring(0, 90, 16);
	private readonly y = new Spring(0, 90, 16);
	private readonly squashX = new Spring(0, 220, 12);
	private readonly squashY = new Spring(0, 220, 12);
	private readonly spin = new Spring(0, 40, 7);
	private readonly wobble = new Euler();
	private readonly wobbleQuaternion = new Quaternion();
	private readonly ray = new Vector3();
	private readonly local = new Vector3();
	private dashLeft = 0;
	private lastBounce = 0;
	private bounceHigh = false;
	private placed = false;

	constructor() {
		const pair = new Group();
		const six = new Mesh(solid(sixOutline()), this.material);
		six.position.set(-0.53, 0, 0);
		const seven = new Mesh(solid(sevenOutline()), this.material);
		seven.position.set(0.5, 0, 0);
		pair.add(six, seven);
		this.meshes.push(six, seven);
		// The digits are drawn around the origin with their middle a little below it: lift the
		// pair so the group's origin is its visual centre, which is what the screen position names.
		pair.position.set(0.025, 0.05, 0);
		this.group.add(pair);
		this.group.visible = false;
		this.group.scale.setScalar(0);
	}

	/** Launch the numeral across the screen. A second click mid-dash gives it a new kick. */
	kick(view: NumeralView): void {
		const angle = Math.random() * Math.PI * 2;
		const speed = Math.max(view.width, view.height) * 1.6;
		this.dashLeft = DASH_LENGTH;
		this.x.stiffness = 0;
		this.y.stiffness = 0;
		this.x.damping = 0.7;
		this.y.damping = 0.7;
		this.x.velocity = Math.cos(angle) * speed;
		this.y.velocity = Math.sin(angle) * speed;
		this.spin.velocity += (Math.random() < 0.5 ? -1 : 1) * 6;
		this.squashX.velocity -= 1.5;
		this.squashY.velocity += 1.5;
	}

	update(
		dt: number,
		elapsed: number,
		camera: PerspectiveCamera,
		dance: DanceState,
		view: NumeralView,
	): void {
		if (dance.blast) {
			// The burst: the numeral is simply gone, the chunks take over.
			this.width.value = 0;
			this.width.velocity = 0;
		}

		// Where the numeral lives on screen: it starts as wide as the bear's head, next to it,
		// and grows to fill the viewport, drifting away from the bear so the digits stay
		// readable. It takes whichever side has more room. On a phone it floats above the
		// bear's head instead, and earTop asks for the bear to slide down to make the room.
		const startWidth = START_WIDTH * view.stageSize;
		const aspect = HEIGHT / WIDTH;
		// The numeral is a little tilted by its sway, and more while it spins in a dash, so its
		// bounding box is larger than its width and height: size it by that box.
		const spinNow = this.spin.update(dt);
		const tilt = Math.min(0.05 + Math.abs(spinNow), 1);
		const boxWidth = Math.cos(tilt) + aspect * Math.sin(tilt);
		const boxHeight = aspect * Math.cos(tilt) + Math.sin(tilt);
		const restBoxWidth = Math.cos(0.05) + aspect * Math.sin(0.05);
		const restBoxHeight = aspect * Math.cos(0.05) + Math.sin(0.05);
		const stacked = view.width < STACKED_BELOW;
		const gap = GAP * view.height;
		const margin = MARGIN * view.height;
		const bearHeight = (FEET_AT - EARS_AT) * view.stageSize * (1 + BEAR_GROW);
		const roomAbove = view.height - 2 * margin - gap - bearHeight;
		let fitWidth = Math.min((FILL * view.width) / boxWidth, (FILL * view.height) / boxHeight);
		let finalWidth = Math.min((FILL * view.width) / restBoxWidth, (FILL * view.height) / restBoxHeight);
		if (stacked) {
			finalWidth = Math.max(START_WIDTH * view.stageSize, Math.min(finalWidth, roomAbove / restBoxHeight / POP_ROOM));
			const planned = startWidth + (finalWidth - startWidth) * dance.growth;
			fitWidth = Math.min(fitWidth, planned * POP_ROOM);
			const ears = view.stageTop + EARS_AT * view.stageSize;
			this.earTop = Math.min(
				Math.max(ears, margin + planned * restBoxHeight * POP_ROOM + gap),
				view.height - margin - (FEET_AT - EARS_AT) * view.drawSize,
			);
		} else {
			this.earTop = null;
		}
		const startHeight = startWidth * aspect;
		const stageCentre = view.stageLeft + view.stageSize / 2;
		const startX = stageCentre;
		const stageBottom = view.stageTop + view.stageSize;
		const roomBelow = view.height - stageBottom;
		const below = roomBelow > view.stageTop;
		const startY = below
			? stageBottom + startHeight / 2
			: view.stageTop + 0.15 * view.stageSize - startHeight / 2;
		const reach = (view.width - finalWidth * restBoxWidth) / 2;
		const awayFromBear = Math.max(-reach, Math.min(reach, view.width / 2 - stageCentre));
		const finalX = view.width / 2 + awayFromBear;
		const finalHeight = finalWidth * restBoxHeight;
		const finalY = below
			? Math.min(stageBottom + roomBelow / 2, 0.98 * view.height - finalHeight / 2)
			: 0.02 * view.height + finalHeight / 2;

		if (dance.numeral) {
			this.width.target = startWidth + (finalWidth - startWidth) * dance.growth;
			if (dance.beat) this.width.velocity += 1.2 * this.width.target;
		} else {
			this.width.target = 0;
		}
		// A pop can overshoot, but never past the edges of the screen: the width is capped
		// after the spring, on both axes, using the bounding box.
		const widthPx = Math.min(Math.max(this.width.update(dt), 0), fitWidth);
		this.group.visible = widthPx > 1;
		if (!this.group.visible) {
			this.placed = false;
			return;
		}
		const boxWidthPx = widthPx * boxWidth;
		const boxHeightPx = widthPx * boxHeight;
		const growth = Math.max(0, Math.min((widthPx - startWidth) / Math.max(finalWidth - startWidth, 1), 1));
		const homeX = stacked ? stageCentre : startX + (finalX - startX) * growth;
		const homeY = stacked
			? view.drawTop + EARS_AT * view.drawSize - gap - boxHeightPx / 2
			: startY + (finalY - startY) * growth;
		if (!this.placed) {
			// First frame: start at home, not in a corner.
			this.x.value = homeX;
			this.y.value = homeY;
			this.x.velocity = 0;
			this.y.velocity = 0;
			this.placed = true;
		}

		this.dash(dt, boxWidthPx, boxHeightPx, homeX, homeY, view);

		// Convert the screen position to a point behind the bear, and the pixel width to the
		// world scale that makes it look that wide from there.
		camera.updateMatrixWorld();
		this.ray
			.set((this.x.value / view.width) * 2 - 1, -((this.y.value / view.height) * 2 - 1), 0.5)
			.unproject(camera)
			.sub(camera.position)
			.normalize();
		const along = (DEPTH - camera.position.z) / this.ray.z;
		this.centre.copy(camera.position).addScaledVector(this.ray, along);
		this.local.copy(this.centre).applyMatrix4(camera.matrixWorldInverse);
		// Measure pixels per unit at the front face, which is the closest part and so the
		// largest on screen, not at the origin behind it.
		const halfFov = Math.tan((camera.fov * Math.PI) / 360);
		const roughScale = widthPx / (WIDTH * (view.drawSize / (2 * -this.local.z * halfFov)));
		const depthScale = Math.min(roughScale, MAX_DEPTH_SCALE);
		const frontDepth = -this.local.z - FRONT * depthScale;
		const scale = widthPx / (WIDTH * (view.drawSize / (2 * frontDepth * halfFov)));
		this.lastScale = scale;

		// A squash is a small bulge, never more than a quarter either way.
		const squashX = Math.max(-0.25, Math.min(0.25, this.squashX.update(dt)));
		const squashY = Math.max(-0.25, Math.min(0.25, this.squashY.update(dt)));
		// The depth stays modest however big the numeral gets.
		this.group.scale.set(scale * (1 + squashX), scale * (1 + squashY), depthScale);
		this.group.position.copy(this.centre);
		// Always facing the camera, with a gentle sway and a spin for a dash.
		this.wobble.set(
			0.04 * Math.sin(elapsed * 1.7),
			0.18 * Math.sin(elapsed * 1.3),
			0.05 * Math.sin(elapsed * 2.1) + spinNow,
		);
		this.wobbleQuaternion.setFromEuler(this.wobble);
		this.group.quaternion.copy(camera.quaternion).multiply(this.wobbleQuaternion);
		// Both digits share one material, so they are always the same colour at the same moment.
		this.material.color.copy(dance.colour);
		this.material.emissive.copy(dance.colour);
		this.material.emissiveIntensity = 0.5 + 0.9 * dance.glow;
	}

	/** Free flight with bounces off the viewport edges, then an ease back to the home position. */
	private dash(dt: number, widthPx: number, heightPx: number, homeX: number, homeY: number, view: NumeralView): void {
		if (this.dashLeft > 0) {
			this.dashLeft -= dt;
			if (this.dashLeft <= DASH_LENGTH - DASH_FLIGHT) {
				// Flight is over: a spring pulls it home.
				this.x.stiffness = 60;
				this.y.stiffness = 60;
				this.x.damping = 11;
				this.y.damping = 11;
			}
			if (this.dashLeft <= 0) {
				this.dashLeft = 0;
				this.x.stiffness = 90;
				this.y.stiffness = 90;
				this.x.damping = 16;
				this.y.damping = 16;
			}
		}
		// Home is always inside the same limits as a dash.
		this.x.target = Math.min(Math.max(homeX, widthPx / 2 + 0.01 * view.width), view.width - widthPx / 2 - 0.01 * view.width);
		this.y.target = Math.min(Math.max(homeY, heightPx / 2 + 0.01 * view.height), view.height - heightPx / 2 - 0.01 * view.height);
		this.x.update(dt);
		this.y.update(dt);

		// The numeral stays inside the viewport, bouncing off its edges while it flies. When it
		// is as wide as the screen there is nowhere to go on that axis, so it just stays put.
		const flying = this.dashLeft > DASH_LENGTH - DASH_FLIGHT;
		const marginX = 0.01 * view.width;
		const marginY = 0.01 * view.height;
		const limitX = [widthPx / 2 + marginX, view.width - widthPx / 2 - marginX] as const;
		const limitY = [heightPx / 2 + marginY, view.height - heightPx / 2 - marginY] as const;
		this.keepInside(this.x, limitX[0], limitX[1], flying, true);
		this.keepInside(this.y, limitY[0], limitY[1], flying, false);
	}

	private keepInside(axis: Spring, min: number, max: number, flying: boolean, horizontal: boolean): void {
		if (max - min < 8) {
			axis.value = (min + max) / 2;
			axis.velocity = 0;
			return;
		}
		const hitLow = axis.value < min;
		const hitHigh = axis.value > max;
		if (!hitLow && !hitHigh) return;
		axis.value = hitLow ? min : max;
		if (!flying) {
			axis.velocity = 0;
			return;
		}
		axis.velocity = -axis.velocity * 0.9;
		// Squash against the wall it hit, bulging along the other axis.
		const [along, across] = horizontal ? [this.squashX, this.squashY] : [this.squashY, this.squashX];
		along.velocity -= 2.5;
		across.velocity += 1.5;
		const now = performance.now();
		if (now - this.lastBounce > 80) {
			this.lastBounce = now;
			this.bounceHigh = !this.bounceHigh;
			this.onBounce(this.bounceHigh);
		}
	}

	/** Put everything back to rest after the dance. */
	reset(): void {
		for (const spring of [this.width, this.x, this.y, this.squashX, this.squashY, this.spin]) {
			spring.value = 0;
			spring.target = 0;
			spring.velocity = 0;
		}
		this.x.stiffness = 90;
		this.y.stiffness = 90;
		this.x.damping = 16;
		this.y.damping = 16;
		this.dashLeft = 0;
		this.placed = false;
		this.earTop = null;
		this.group.visible = false;
		this.group.scale.setScalar(0);
		this.material.color.set(HONEY);
		this.material.emissive.set(HONEY);
		this.material.emissiveIntensity = 0.5;
	}
}
