/*
 * Synthesized sound design — no audio files, everything is generated
 * with WebAudio oscillators and filtered noise.
 *
 *  - ambient: low sci-fi drone that breathes via a slow LFO
 *  - blip:    UI hover tick
 *  - whoosh:  menu open/close noise sweep
 *  - roar:    distorted sub-bass growl when the hologram is clicked
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  enabled = false;

  /* Must be called from a user gesture (autoplay policy). */
  init() {
    if (this.ctx) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);
    this.startAmbient();
  }

  private startAmbient() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.value = 0;
    this.ambientGain.connect(this.master);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 190;
    filter.Q.value = 6;
    filter.connect(this.ambientGain);

    const oscA = ctx.createOscillator();
    oscA.type = "sawtooth";
    oscA.frequency.value = 55;
    const oscB = ctx.createOscillator();
    oscB.type = "sawtooth";
    oscB.frequency.value = 55.7; // slight detune = slow beating
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 27.5;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.12;
    oscA.connect(oscGain);
    oscB.connect(oscGain);
    sub.connect(oscGain);
    oscGain.connect(filter);

    // breathing filter sweep
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 60;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    oscA.start();
    oscB.start();
    sub.start();
    lfo.start();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!this.ctx || !this.ambientGain) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const t = this.ctx.currentTime;
    this.ambientGain.gain.cancelScheduledValues(t);
    this.ambientGain.gain.linearRampToValueAtTime(on ? 0.5 : 0, t + 0.8);
  }

  blip(freq = 1650) {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.045, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  whoosh() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const dur = 0.45;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 1.2;
    const t = ctx.currentTime;
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + dur * 0.6);
    filter.frequency.exponentialRampToValueAtTime(400, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(t);
    noise.stop(t + dur);
  }

  roar() {
    if (!this.enabled || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const dur = 1.3;
    const t = ctx.currentTime;

    // sub growl: falling distorted sawtooth
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(85, t);
    osc.frequency.exponentialRampToValueAtTime(32, t + dur);

    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      curve[i] = Math.tanh(x * 4);
    }
    shaper.curve = curve;

    // breathy top layer: falling bandpassed noise
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.Q.value = 0.8;
    noiseFilter.frequency.setValueAtTime(900, t);
    noiseFilter.frequency.exponentialRampToValueAtTime(120, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(shaper);
    shaper.connect(gain);
    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(this.master);

    osc.start(t);
    osc.stop(t + dur);
    noise.start(t);
    noise.stop(t + dur);
  }
}

export const sound = new SoundManager();
