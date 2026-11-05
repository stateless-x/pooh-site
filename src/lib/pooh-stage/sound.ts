import type { Mood } from "./moods";

/**
 * Synthesised sound for the stage: no audio files, everything is an oscillator
 * or a burst of noise. One shared engine (context, master gain, limiter) serves
 * both the 67 dance and the click voices, so they can never add up past
 * clipping. The engine is created on the first click, inside the handler, which
 * is what lets the browser start audio; nothing can play before that.
 */

const MASTER_GAIN = 0.16;
/** Pitch of the low dance blip at the start; it drifts up by an octave over the dance. */
const BASE_FREQUENCY = 220;
const WHOLE_TONE = 2 ** (2 / 12);
/** How long the dance's last chord and its noise tail ring before its bus is released. */
const FINALE_TAIL = 1.4;

class AudioEngine {
	readonly context = new AudioContext();
	readonly master = this.context.createGain();
	readonly noise: AudioBuffer;

	constructor() {
		// The limiter is a safety net: blips, kicks, chords and voices can overlap.
		const limiter = this.context.createDynamicsCompressor();
		this.master.gain.value = MASTER_GAIN;
		this.master.connect(limiter).connect(this.context.destination);

		const length = Math.floor(this.context.sampleRate * 0.6);
		this.noise = this.context.createBuffer(1, length, this.context.sampleRate);
		const samples = this.noise.getChannelData(0);
		for (let i = 0; i < length; i += 1) samples[i] = Math.random() * 2 - 1;
	}
}

let engine: AudioEngine | null = null;

/** Create the engine on first use and make sure it is running. Call it from a click handler. */
function unlock(): AudioEngine {
	engine ??= new AudioEngine();
	if (engine.context.state !== "running") void engine.context.resume();
	return engine;
}

/** Free a chain of nodes as soon as its source has finished, so repeated clicks never pile them up. */
function releaseWhenEnded(source: AudioScheduledSourceNode, nodes: AudioNode[]): void {
	source.onended = () => {
		for (const node of nodes) node.disconnect();
	};
}

/** The 67 dance's sound. One instance is one dance, created inside the button's click. */
export class DanceSound {
	private readonly audio = unlock();
	private readonly bus = this.audio.context.createGain();
	private releaseTimer = 0;
	private closed = false;

	constructor() {
		this.bus.connect(this.audio.master);
	}

	/** One hand: "six" is the low note, "seven" a whole tone above, both climbing with `progress` (0 to 1). */
	blip(high: boolean, progress: number): void {
		if (this.closed) return;
		const frequency = BASE_FREQUENCY * 2 ** progress * (high ? WHOLE_TONE : 1);
		this.tone("triangle", frequency, 0.55, 0.005, 0.13);
	}

	/** Soft kick on every full cycle. */
	kick(): void {
		if (this.closed) return;
		const { context } = this.audio;
		const now = context.currentTime;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.frequency.setValueAtTime(130, now);
		oscillator.frequency.exponentialRampToValueAtTime(45, now + 0.14);
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(0.8, now + 0.006);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
		oscillator.connect(gain).connect(this.bus);
		oscillator.start(now);
		oscillator.stop(now + 0.22);
		releaseWhenEnded(oscillator, [oscillator, gain]);
	}

	/** The blast that ends the numeral: a low boom with a soft noise tail. */
	boom(): void {
		if (this.closed) return;
		const { context, noise } = this.audio;
		const now = context.currentTime;
		const oscillator = context.createOscillator();
		const body = context.createGain();
		oscillator.frequency.setValueAtTime(110, now);
		oscillator.frequency.exponentialRampToValueAtTime(32, now + 0.45);
		body.gain.setValueAtTime(0.0001, now);
		body.gain.linearRampToValueAtTime(0.9, now + 0.01);
		body.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
		oscillator.connect(body).connect(this.bus);
		oscillator.start(now);
		oscillator.stop(now + 0.62);
		releaseWhenEnded(oscillator, [oscillator, body]);

		const source = context.createBufferSource();
		const lowpass = context.createBiquadFilter();
		const tail = context.createGain();
		source.buffer = noise;
		lowpass.type = "lowpass";
		lowpass.frequency.setValueAtTime(1800, now);
		lowpass.frequency.exponentialRampToValueAtTime(200, now + 0.5);
		tail.gain.setValueAtTime(0.0001, now);
		tail.gain.linearRampToValueAtTime(0.5, now + 0.008);
		tail.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
		source.connect(lowpass).connect(tail).connect(this.bus);
		source.start(now);
		releaseWhenEnded(source, [source, lowpass, tail]);
	}

	/** The last note: a bright chord with a noise tail, then the bus is released once it has rung out. */
	finish(): void {
		if (this.closed) return;
		const { context, noise } = this.audio;
		const top = BASE_FREQUENCY * 2;
		for (const ratio of [1, 1.25, 1.5, 2]) this.tone("triangle", top * ratio, 0.35, 0.01, 0.9);

		const now = context.currentTime;
		const source = context.createBufferSource();
		const brighten = context.createBiquadFilter();
		const gain = context.createGain();
		source.buffer = noise;
		brighten.type = "highpass";
		brighten.frequency.value = 4000;
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
		source.connect(brighten).connect(gain).connect(this.bus);
		source.start(now);
		releaseWhenEnded(source, [source, brighten, gain]);

		this.releaseTimer = window.setTimeout(() => this.release(), FINALE_TAIL * 1000);
	}

	/** Early exit: fade this dance's bus to silence at once, then drop it. The context stays for the click voices. */
	silence(): void {
		if (this.closed) return;
		window.clearTimeout(this.releaseTimer);
		const now = this.audio.context.currentTime;
		this.bus.gain.cancelScheduledValues(now);
		this.bus.gain.setTargetAtTime(0, now, 0.025);
		this.closed = true;
		this.releaseTimer = window.setTimeout(() => this.bus.disconnect(), 250);
	}

	private tone(type: OscillatorType, frequency: number, peak: number, attack: number, decay: number): void {
		const { context } = this.audio;
		const now = context.currentTime;
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		oscillator.type = type;
		oscillator.frequency.value = frequency;
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.linearRampToValueAtTime(peak, now + attack);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
		oscillator.connect(gain).connect(this.bus);
		oscillator.start(now);
		oscillator.stop(now + attack + decay + 0.02);
		releaseWhenEnded(oscillator, [oscillator, gain]);
	}

	private release(): void {
		this.closed = true;
		this.bus.disconnect();
	}
}

/** Formant pairs (Hz) for the vowels the voices use; they are what makes a buzz sound like "a" or "u". */
const VOWELS = {
	a: [800, 1200],
	i: [300, 2300],
	u: [350, 1200],
	o: [500, 900],
} as const;
type Vowel = keyof typeof VOWELS;

interface Syllable {
	vowel: Vowel;
	/** Start and end pitch of the glide, in Hz (before the per-play randomising). */
	from: number;
	to: number;
	/** Seconds after the start of the voice. */
	at: number;
	length: number;
	/** Vibrato depth as a share of the pitch and its rate in Hz. */
	vibrato?: [number, number];
	wave?: OscillatorType;
	level?: number;
}

/** Bell strikes, as [frequency, start, length]. */
type Bell = [number, number, number];

/**
 * The cute click voices: a small buzzy oscillator shaped by two vowel formants,
 * with a pitch glide and light vibrato per syllable. Every play is randomised
 * (pitch about 12 percent, glide a little) so no two clicks sound the same. At
 * most one voice plays at a time: a new one cuts the old with a 30 ms fade.
 */
export class MoodVoice {
	private current: GainNode | null = null;

	play(mood: Mood): void {
		const audio = unlock();
		const pitch = 1 + rand(-0.12, 0.12);
		const glide = 1 + rand(-0.08, 0.08);
		const voice = this.begin(audio);
		const say = (syllable: Syllable) => this.say(audio, voice, syllable, pitch, glide);

		switch (mood) {
			case "boing":
				// A springy squeak that climbs, with a fast wobble.
				say({ vowel: "o", from: 480, to: 980, at: 0, length: 0.3, vibrato: [0.05, 16], wave: "sawtooth" });
				break;
			case "love":
				// "pyu~": two soft notes, the second held and sinking.
				say({ vowel: "i", from: 700, to: 800, at: 0, length: 0.12, wave: "triangle" });
				say({ vowel: "u", from: 880, to: 760, at: 0.1, length: 0.34, vibrato: [0.03, 6], wave: "triangle" });
				break;
			case "sparkle":
				// A bright bell "ting ting", then a short "ta-da".
				this.bells(audio, voice, pitch, [
					[1318, 0, 0.5],
					[1568, 0.16, 0.6],
				]);
				say({ vowel: "a", from: 640, to: 660, at: 0.42, length: 0.09, wave: "triangle" });
				say({ vowel: "a", from: 840, to: 900, at: 0.54, length: 0.2, vibrato: [0.02, 6], wave: "triangle" });
				break;
			case "bloop":
				// Low, playful "bloop bloop": each one rises fast and falls back.
				say({ vowel: "o", from: 430, to: 760, at: 0, length: 0.14, wave: "triangle" });
				say({ vowel: "o", from: 760, to: 520, at: 0.12, length: 0.12, wave: "triangle" });
				say({ vowel: "o", from: 450, to: 800, at: 0.3, length: 0.14, wave: "triangle" });
				say({ vowel: "o", from: 800, to: 540, at: 0.42, length: 0.12, wave: "triangle" });
				break;
			case "sing":
				// "la la la": three held notes up a major triad, with a gentle vibrato.
				for (const [index, ratio] of [1, 1.25, 1.5].entries()) {
					say({ vowel: "a", from: 560 * ratio, to: 560 * ratio, at: index * 0.22, length: 0.2, vibrato: [0.025, 5.5], wave: "triangle" });
				}
				break;
			case "poof":
				// A soft noise puff, then a tiny "kya!".
				this.puff(audio, voice);
				say({ vowel: "a", from: 760, to: 1000, at: 0.13, length: 0.13, wave: "sawtooth", level: 0.7 });
				break;
		}
		this.finish(voice, 0.9);
	}

	/** One tiny chirp for a click on a prop. */
	chirp(): void {
		const audio = unlock();
		const voice = this.begin(audio);
		this.say(audio, voice, { vowel: "i", from: 880, to: 1150, at: 0, length: 0.08, wave: "triangle", level: 0.6 }, 1 + rand(-0.12, 0.12), 1);
		this.finish(voice, 0.2);
	}

	/** Stop whatever is sounding, for instance when the dance takes over. */
	stop(): void {
		this.cut();
	}

	/** Cut the previous voice and open a fresh bus for the new one. */
	private begin(audio: AudioEngine): GainNode {
		this.cut();
		const voice = audio.context.createGain();
		voice.connect(audio.master);
		this.current = voice;
		return voice;
	}

	private cut(): void {
		if (!this.current) return;
		const old = this.current;
		this.current = null;
		const now = old.context.currentTime;
		old.gain.cancelScheduledValues(now);
		old.gain.setValueAtTime(old.gain.value, now);
		old.gain.linearRampToValueAtTime(0, now + 0.03);
		// Disconnecting after the fade frees the bus; the oscillators free themselves when they end.
		window.setTimeout(() => old.disconnect(), 80);
	}

	/** Free the voice bus once its last syllable has finished. */
	private finish(voice: GainNode, seconds: number): void {
		window.setTimeout(() => {
			voice.disconnect();
			if (this.current === voice) this.current = null;
		}, seconds * 1000 + 100);
	}

	private say(audio: AudioEngine, voice: GainNode, syllable: Syllable, pitch: number, glide: number): void {
		const { context } = audio;
		const start = context.currentTime + syllable.at;
		const end = start + syllable.length;
		const from = syllable.from * pitch;
		const to = from + (syllable.to * pitch - from) * glide;

		const source = context.createOscillator();
		source.type = syllable.wave ?? "triangle";
		source.frequency.setValueAtTime(from, start);
		source.frequency.exponentialRampToValueAtTime(Math.max(to, 40), end);

		const nodes: AudioNode[] = [source];
		if (syllable.vibrato) {
			const [depth, rate] = syllable.vibrato;
			const wobble = context.createOscillator();
			const wobbleDepth = context.createGain();
			wobble.frequency.value = rate;
			wobbleDepth.gain.value = from * depth;
			wobble.connect(wobbleDepth).connect(source.frequency);
			wobble.start(start);
			wobble.stop(end + 0.05);
			releaseWhenEnded(wobble, [wobble, wobbleDepth]);
		}

		// Two bandpass filters on the same buzz, set to the vowel's formants.
		const envelope = context.createGain();
		const peak = syllable.level ?? 1;
		envelope.gain.setValueAtTime(0.0001, start);
		envelope.gain.linearRampToValueAtTime(peak, start + 0.012);
		envelope.gain.exponentialRampToValueAtTime(0.0001, end + 0.05);
		for (const formant of VOWELS[syllable.vowel]) {
			const band = context.createBiquadFilter();
			const lift = context.createGain();
			band.type = "bandpass";
			band.frequency.value = formant;
			band.Q.value = 7;
			// A bandpass takes most of the energy away, so each band is lifted back up.
			lift.gain.value = 1.6;
			source.connect(band).connect(lift).connect(envelope);
			nodes.push(band, lift);
		}
		nodes.push(envelope);
		envelope.connect(voice);

		releaseWhenEnded(source, nodes);
		source.start(start);
		source.stop(end + 0.06);
	}

	/** Struck bells: a sine and its inharmonic overtone, with a long ring. */
	private bells(audio: AudioEngine, voice: GainNode, pitch: number, strikes: Bell[]): void {
		const { context } = audio;
		for (const [frequency, at, length] of strikes) {
			const start = context.currentTime + at;
			const envelope = context.createGain();
			envelope.gain.setValueAtTime(0.0001, start);
			envelope.gain.linearRampToValueAtTime(0.45, start + 0.004);
			envelope.gain.exponentialRampToValueAtTime(0.0001, start + length);
			envelope.connect(voice);
			const nodes: AudioNode[] = [envelope];
			let last: OscillatorNode | null = null;
			for (const partial of [1, 2.76]) {
				const source = context.createOscillator();
				const level = context.createGain();
				source.frequency.value = frequency * pitch * partial;
				level.gain.value = partial === 1 ? 1 : 0.25;
				source.connect(level).connect(envelope);
				source.start(start);
				source.stop(start + length + 0.05);
				nodes.push(source, level);
				last = source;
			}
			if (last) releaseWhenEnded(last, nodes);
		}
	}

	/** The "poof": a short burst of band-limited noise that sweeps down. */
	private puff(audio: AudioEngine, voice: GainNode): void {
		const { context, noise } = audio;
		const now = context.currentTime;
		const source = context.createBufferSource();
		const band = context.createBiquadFilter();
		const envelope = context.createGain();
		source.buffer = noise;
		band.type = "bandpass";
		band.Q.value = 1.2;
		band.frequency.setValueAtTime(2200, now);
		band.frequency.exponentialRampToValueAtTime(500, now + 0.2);
		envelope.gain.setValueAtTime(0.0001, now);
		envelope.gain.linearRampToValueAtTime(0.9, now + 0.015);
		envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
		source.connect(band).connect(envelope).connect(voice);
		releaseWhenEnded(source, [source, band, envelope]);
		source.start(now);
		source.stop(now + 0.24);
	}
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
