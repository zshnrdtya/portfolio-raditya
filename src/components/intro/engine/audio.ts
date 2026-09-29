/**
 * Procedural Web Audio Engine for "Walk to the House" 3D Intro
 * 100% Code-Driven — Zero External Audio Assets
 * Generates an ambient, peaceful lofi pentatonic melody with soft synth pads.
 */

export class ProceduralAudio {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private padGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];

  constructor() {
    // AudioContext will be initialized on first user interaction due to browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  public start() {
    if (this.isPlaying) return;

    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      this.isPlaying = true;

      // Smoothly fade in master volume
      const targetGain = this.isMuted ? 0.001 : 0.28;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 2.0);

      this.startDronePad();
      this.startMelodyLoop();
    } catch (err) {
      console.warn("[ProceduralAudio] Failed to start audio:", err);
    }
  }

  private startDronePad() {
    if (!this.ctx || !this.masterGain) return;

    // Filtered Warm Drone Chord (D major 9 / soft airy mood)
    // Frequencies: D3 (146.83Hz), A3 (220.00Hz), F#4 (369.99Hz)
    const baseFreqs = [146.83, 220.0, 369.99];

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.padGain = this.ctx.createGain();
    this.padGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    this.droneOscs = baseFreqs.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
      // Detune slightly for lush warmth
      osc.detune.setValueAtTime((idx - 1) * 6, this.ctx!.currentTime);

      osc.connect(filter);
      osc.start();
      return osc;
    });

    // LFO to gently breathe filter cutoff (0.15 Hz)
    this.lfoOsc = this.ctx.createOscillator();
    this.lfoOsc.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    this.lfoOsc.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    this.lfoOsc.start();

    filter.connect(this.padGain);
    this.padGain.connect(this.masterGain);
  }

  private startMelodyLoop() {
    if (!this.ctx || !this.masterGain) return;

    // Peaceful Pentatonic Scale in D Major (D4, E4, F#4, A4, B4, D5)
    const scale = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];

    // Sparse, calming pattern
    const pattern = [0, 2, 4, 3, 5, 2, 4, 1];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const freq = scale[pattern[noteIndex % pattern.length]];
      noteIndex++;

      this.triggerBell(freq);
    };

    // Trigger note every 1.6 - 2.4 seconds with gentle human variation
    const scheduleNext = () => {
      if (!this.isPlaying) return;
      playNextNote();
      const nextDelay = 1800 + Math.random() * 800;
      this.intervalId = window.setTimeout(scheduleNext, nextDelay);
    };

    this.intervalId = window.setTimeout(scheduleNext, 800);
  }

  private triggerBell(freq: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Envelope: Quick attack, soft warm decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 2.3);

    setTimeout(() => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Disconnect silently
      }
    }, 2400);
  }

  /**
   * Sound effect: Soft footstep
   */
  public playStep() {
    if (!this.ctx || !this.masterGain || this.isMuted || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(110 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Ignore audio glitch
    }
  }

  /**
   * Sound effect: Door squeak / warm chime when entering
   */
  public playDoorOpen() {
    if (!this.ctx || !this.masterGain || this.isMuted || !this.isPlaying) return;

    try {
      const now = this.ctx.currentTime;
      // Dual chime chord (D5 + A5)
      [587.33, 880.0].forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.15, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 2.6);
      });
    } catch {
      // Ignore
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      const target = muted ? 0.0001 : 0.28;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(target, this.ctx.currentTime + 0.3);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public fadeOutAndStop(durationSec: number = 1.5): Promise<void> {
    return new Promise((resolve) => {
      this.isPlaying = false;
      if (this.intervalId !== null) {
        clearTimeout(this.intervalId);
        this.intervalId = null;
      }

      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
      }

      setTimeout(() => {
        this.dispose();
        resolve();
      }, durationSec * 1000 + 100);
    });
  }

  public dispose() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    try {
      this.droneOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.droneOscs = [];

      if (this.lfoOsc) {
        try {
          this.lfoOsc.stop();
          this.lfoOsc.disconnect();
        } catch {}
        this.lfoOsc = null;
      }

      if (this.padGain) {
        this.padGain.disconnect();
        this.padGain = null;
      }

      if (this.masterGain) {
        this.masterGain.disconnect();
        this.masterGain = null;
      }

      if (this.ctx) {
        const ctxToClose = this.ctx;
        this.ctx = null;
        if (ctxToClose.state !== "closed") {
          ctxToClose.close().catch(() => {});
        }
      }
    } catch (e) {
      console.warn("[ProceduralAudio] Error during dispose:", e);
    } finally {
      this.ctx = null;
    }
  }
}
