import {
	CircleGeometry,
	DirectionalLight,
	HemisphereLight,
	Mesh,
	MeshBasicMaterial,
	NoToneMapping,
	PerspectiveCamera,
	Raycaster,
	SRGBColorSpace,
	Scene,
	Vector2,
	Vector3,
	WebGLRenderer,
} from "three";
import { Bear } from "./bear";
import { Burst } from "./burst";
import { Dance } from "./dance";
import { MoodBag } from "./moods";
import { Numeral, type NumeralView } from "./numeral";
import { Gaze, type GazeState } from "./gaze";
import { Props } from "./props";
import { MoodVoice } from "./sound";
import { clamp } from "./spring";

/** Longest frame step the simulation accepts, so a stalled tab does not fling the springs. */
const MAX_DT = 1 / 30;
/** Pointer travel, in pixels, before a press on the bear becomes a spin instead of a poke. */
const DRAG_THRESHOLD = 8;
/** The hop height at which the contact shadow is fully shrunk. */
const SHADOW_FULL_LIFT = 0.35;

/** The full-screen canvas never draws more pixels than this, so a big retina screen keeps its frame rate. */
const MAX_PIXELS = 3_200_000;

/** The page-level veil takes this long to clear once the dance is over. */
const VEIL_FADE_OUT = 400;

/** Where the bear looks while it dances: straight ahead, no glance, no cheering. */
const FACING_FRONT: GazeState = { yaw: 0, pitch: 0, point: null, excited: false };

type Press =
	| { kind: "bear"; x: number; lastX: number; spinning: boolean; point: Vector3 }
	| { kind: "prop"; index: number; x: number; point: Vector3 };

/**
 * Builds the live scene inside `stage` and runs it while the stage is on
 * screen. The poster is only hidden (`is-live`) after the first frame with the
 * bear in it has been drawn, so the hand-over from poster to canvas never
 * shows an empty frame. Throws if anything it needs is missing; the caller
 * reports that and the poster stays.
 */
export async function mountPoohStage(
	stage: HTMLElement,
	options: { attention: string },
): Promise<void> {
	const mount = stage.querySelector<HTMLElement>("[data-pooh-mount]");
	if (!mount) throw new Error("Pooh stage has no [data-pooh-mount] element");
	const danceButton = stage.querySelector<HTMLButtonElement>("[data-pooh-dance]");
	if (!danceButton) throw new Error("Pooh stage has no [data-pooh-dance] button");
	const attention = document.querySelector<HTMLElement>(options.attention);
	if (!attention) throw new Error(`Pooh stage attention element not found: ${options.attention}`);

	// Load before creating a GL context: a failed download then leaves nothing behind.
	const bear = await Bear.load();

	const renderer = new WebGLRenderer({ alpha: true, antialias: true });
	renderer.outputColorSpace = SRGBColorSpace;
	renderer.toneMapping = NoToneMapping;
	renderer.setClearColor(0x000000, 0);
	mount.append(renderer.domElement);

	// Camera, lights and contact shadow are the contract the poster was rendered with.
	const camera = new PerspectiveCamera(20, 1, 0.1, 50);
	camera.position.set(0, 1.9, 6.1);
	camera.lookAt(0, 0.9, 0);

	const scene = new Scene();
	const hemisphere = new HemisphereLight("#fffaf0", "#e8d2a8", 2.0);
	scene.add(hemisphere);
	const sun = new DirectionalLight("#ffffff", 1.8);
	sun.position.set(-2, 4, 3);
	scene.add(sun);

	const shadowMaterial = new MeshBasicMaterial({
		color: "#33241A",
		opacity: 0.1,
		transparent: true,
		depthWrite: false,
	});
	const shadow = new Mesh(new CircleGeometry(1, 48), shadowMaterial);
	shadow.rotation.x = -Math.PI / 2;
	shadow.position.y = 0.002;
	shadow.scale.set(0.62, 0.5, 1);
	scene.add(shadow);

	scene.add(bear.root);
	const props = new Props();
	scene.add(props.group);

	const numeral = new Numeral();
	scene.add(numeral.group);
	const burst = new Burst();
	const moods = new MoodBag();
	const voice = new MoodVoice();
	scene.add(burst.group);

	const gaze = new Gaze(stage, attention);
	numeral.onBounce = (high) => dance.blip(high);

	// The page-level half of the 67 dance: a dark veil over everything but the stage.
	// It is made when the dance starts and removed when it ends, so between dances
	// the DOM is exactly what the page shipped with.
	let veil: HTMLElement | null = null;
	let veilTimer = 0;
	let refocusButton = false;

	const showVeil = () => {
		window.clearTimeout(veilTimer);
		veil?.remove();
		veil = document.createElement("div");
		veil.className = "pooh-dance-veil";
		veil.setAttribute("aria-hidden", "true");
		veil.addEventListener("click", () => dance.stop(false));
		document.body.append(veil);
		// Reading layout commits the starting opacity so the class below runs as a transition.
		void veil.offsetWidth;
		veil.classList.add("is-on");
	};

	const dance = new Dance(scene, hemisphere, sun, {
		onRelease: () => {
			veil?.classList.remove("is-on");
			veilTimer = window.setTimeout(() => {
				veil?.remove();
				veil = null;
			}, VEIL_FADE_OUT + 50);
		},
		onIdle: () => {
			window.clearTimeout(veilTimer);
			veil?.remove();
			veil = null;
			stage.classList.remove("is-dancing");
			// Everything the dance added to the canvas goes back: the numeral, its chunks, the extra room.
			numeral.reset();
			burst.clear();
			setFull(false);
			danceButton.disabled = false;
			danceButton.setAttribute("aria-pressed", "false");
			// A disabled button drops focus; hand it back so keyboard users are not sent to the top of the page.
			if (refocusButton) danceButton.focus({ preventScroll: true });
		},
	});

	// Size comes from the stage box, never the window, so the canvas follows the layout.
	// While the dance runs the canvas instead covers the whole viewport (so the numeral can
	// fill the screen) and the camera's view offset keeps the stage's own frame on exactly
	// the same pixels, so the bear never moves.
	let full = false;
	const view: NumeralView = { width: 0, height: 0, stageLeft: 0, stageTop: 0, stageSize: 0 };
	const applied = { ratio: 0, width: 0, height: 0, left: 0, top: 0, size: 0 };

	const layout = () => {
		const { clientWidth: size, clientHeight: height } = stage;
		if (size === 0 || height === 0) return;
		camera.aspect = size / height;
		if (!full) {
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			renderer.setSize(size, height, false);
			camera.clearViewOffset();
			applied.width = 0;
		} else {
			const box = stage.getBoundingClientRect();
			const width = mount.clientWidth;
			const tall = mount.clientHeight;
			const ratio = Math.min(window.devicePixelRatio, 2, Math.sqrt(MAX_PIXELS / (width * tall)));
			view.width = width;
			view.height = tall;
			view.stageLeft = box.left;
			view.stageTop = box.top;
			view.stageSize = size;
			// Only touch the canvas when something moved: resizing clears it.
			if (
				ratio !== applied.ratio ||
				width !== applied.width ||
				tall !== applied.height ||
				box.left !== applied.left ||
				box.top !== applied.top ||
				size !== applied.size
			) {
				Object.assign(applied, { ratio, width, height: tall, left: box.left, top: box.top, size });
				renderer.setPixelRatio(ratio);
				renderer.setSize(width, tall, false);
				camera.setViewOffset(size, height, -box.left, -box.top, width, tall);
				renderer.render(scene, camera);
			}
		}
		camera.updateProjectionMatrix();
	};

	const setFull = (on: boolean) => {
		if (full === on) return;
		full = on;
		mount.classList.toggle("is-full", on);
		layout();
		// Resizing clears the canvas, so draw straight away: no blank flash.
		renderer.render(scene, camera);
	};

	layout();
	new ResizeObserver(layout).observe(stage);

	/**
	 * World height of the viewport's bottom edge on the plane at depth `z`, read from the
	 * camera (with its view offset), so it matches the screen however the page is scrolled.
	 */
	const floorRay = new Vector3();
	const floorAt = (z: number) => {
		camera.updateMatrixWorld();
		floorRay.set(0, -1, 0.5).unproject(camera).sub(camera.position).normalize();
		return camera.position.y + floorRay.y * ((z - camera.position.z) / floorRay.z);
	};

	let elapsed = 0;
	const advance = (dt: number) => {
		elapsed += dt;
		// The dance runs on the wall clock, so it lasts 6.7 s however many frames are dropped.
		const danceState = dance.update(dt, performance.now() / 1000);
		bear.update(dt, elapsed, danceState.active ? FACING_FRONT : gaze.update(elapsed), danceState);
		props.update(dt, elapsed, camera.quaternion, danceState);
		// The canvas follows the stage as the page scrolls or the window changes.
		if (full) layout();
		numeral.update(dt, elapsed, camera, danceState, view);
		if (danceState.blast) {
			burst.explode(numeral.centre, numeral.lastScale, danceState.colour, floorAt(numeral.centre.z));
		}
		// The page lightens at the finale: no blast chunk may still be on it.
		if (danceState.finaleEdge) burst.clearBlast();
		burst.update(dt);
		const lift = clamp(bear.lift / SHADOW_FULL_LIFT, 0, 1);
		shadow.scale.set(0.62 * (1 - 0.25 * lift), 0.5 * (1 - 0.25 * lift), 1);
		// The dance replaces the contact shadow with its glowing floor disc.
		shadowMaterial.opacity = 0.1 * (1 - 0.5 * lift) * (1 - danceState.lights);
	};

	// Input. A press is resolved by raycast against the bear and the props together,
	// nearest first, so a prop in front of the belly wins over the bear behind it.
	const raycaster = new Raycaster();
	const pointer = new Vector2();
	const targets = [...bear.meshes, ...props.meshes];
	const danceTargets = [...numeral.meshes, ...bear.meshes];
	let press: Press | null = null;

	const pick = (event: PointerEvent): Press | null => {
		const box = renderer.domElement.getBoundingClientRect();
		pointer.set(
			((event.clientX - box.left) / box.width) * 2 - 1,
			-((event.clientY - box.top) / box.height) * 2 + 1,
		);
		raycaster.setFromCamera(pointer, camera);
		const hit = raycaster.intersectObjects(targets, false)[0];
		if (!hit) return null;
		const index = props.indexOf(hit.object);
		const point = hit.point.clone();
		return index === null
			? { kind: "bear", x: event.clientX, lastX: event.clientX, spinning: false, point }
			: { kind: "prop", index, x: event.clientX, point };
	};

	const danceClick = (event: PointerEvent) => {
		const box = renderer.domElement.getBoundingClientRect();
		pointer.set(
			((event.clientX - box.left) / box.width) * 2 - 1,
			-((event.clientY - box.top) / box.height) * 2 + 1,
		);
		raycaster.setFromCamera(pointer, camera);
		// Nearest first: where the bear overlaps the numeral, the bear is in front and wins.
		const hit = raycaster.intersectObjects(danceTargets, false)[0];
		if (!hit) dance.stop(false);
		else if (numeral.meshes.some((mesh) => mesh === hit.object)) numeral.kick(view);
	};

	const release = () => {
		if (press?.kind === "bear" && press.spinning) bear.endSpin();
		press = null;
		mount.classList.remove("is-dragging");
	};

	mount.addEventListener("pointerdown", (event) => {
		if (event.pointerType === "mouse" && event.button !== 0) return;
		if (dance.running) {
			// The canvas covers the screen during the dance: a hit on the numeral sends it
			// dashing, a hit on the bear does nothing, and empty space ends the dance.
			danceClick(event);
			return;
		}
		press = pick(event);
		// Missing everything leaves the press to the page, so touch scrolling is untouched.
		if (press?.kind === "bear") mount.setPointerCapture(event.pointerId);
	});

	mount.addEventListener("pointermove", (event) => {
		if (press?.kind !== "bear") return;
		if (!press.spinning && Math.abs(event.clientX - press.x) > DRAG_THRESHOLD) {
			press.spinning = true;
			bear.beginSpin();
			mount.classList.add("is-dragging");
			bear.spinBy(event.clientX - press.x);
		} else if (press.spinning) {
			bear.spinBy(event.clientX - press.lastX);
		}
		press.lastX = event.clientX;
	});

	mount.addEventListener("pointerup", (event) => {
		const finished = press;
		release();
		if (!finished) return;
		if (finished.kind === "bear" && !finished.spinning) {
			// Each poke is a different mood: its own motion, particles and voice. The voice is
			// started here, inside the click, because that is what lets the browser play audio.
			const mood = moods.next();
			bear.poke(mood);
			props.scatter();
			burst.spawn(finished.point, mood);
			burst.pulse(mood);
			voice.play(mood);
		} else if (finished.kind === "prop" && Math.abs(event.clientX - finished.x) <= DRAG_THRESHOLD) {
			props.spinProp(finished.index);
			burst.spawn(finished.point, "boing");
			voice.chirp();
		}
	});

	// A vertical touch swipe hands the gesture to the browser as a cancel: not a poke.
	mount.addEventListener("pointercancel", release);

	// The 67 button. The dance has to be started here, inside the click, because that is
	// what allows the browser to start its audio.
	danceButton.addEventListener("click", () => {
		if (dance.running) return;
		release();
		refocusButton = document.activeElement === danceButton;
		// First click: the call-to-action pulse is done for this page view.
		danceButton.classList.remove("is-calling");
		// The dance owns the sound from here: let any click voice go.
		voice.stop();
		dance.start(performance.now() / 1000);
		// The canvas takes the whole screen for the numeral, drawn in the same tick so it
		// never shows a blank frame.
		setFull(true);
		danceButton.disabled = true;
		danceButton.setAttribute("aria-pressed", "true");
		stage.classList.add("is-dancing");
		showVeil();
	});
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && dance.running) dance.stop(false);
	});

	// The loop only runs while the stage is on screen and the tab is visible.
	let visible = false;
	let frame = 0;
	let last: number | null = null;
	const tick = (time: number) => {
		frame = requestAnimationFrame(tick);
		advance(last === null ? 0 : Math.min((time - last) / 1000, MAX_DT));
		last = time;
		renderer.render(scene, camera);
	};
	const sync = () => {
		const running = visible && !document.hidden;
		// No frames will come to finish an ease when the loop is off, so these exits are instant.
		if (!running) dance.stop(true);
		if (running && frame === 0) {
			frame = requestAnimationFrame(tick);
		} else if (!running && frame !== 0) {
			cancelAnimationFrame(frame);
			frame = 0;
			last = null;
		}
	};
	new IntersectionObserver((entries) => {
		visible = entries[entries.length - 1].isIntersecting;
		sync();
	}).observe(stage);
	document.addEventListener("visibilitychange", sync);

	// First frame, drawn once even if the stage is still below the fold, so the
	// poster hand-over is finished by the time anyone sees it. The props start
	// popping in now; their clock only advances while the loop runs, so the pop-in
	// plays when the stage is actually on screen.
	advance(0);
	renderer.render(scene, camera);
	stage.classList.add("is-live");
	danceButton.classList.add("is-calling");
	props.start();
}
