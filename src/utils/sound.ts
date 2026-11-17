class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private ensureContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playClick(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(840, now + 0.045);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.055);
  }

  public playCorrect(streak = 1): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = Math.min(523.25 * (1 + (streak - 1) * 0.06), 880);
    const notes = [baseFreq, baseFreq * 1.2599, baseFreq * 1.4983, baseFreq * 2];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.055);

      gain.gain.setValueAtTime(0.13, now + idx * 0.055);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.055);
      osc.stop(now + idx * 0.055 + 0.22);
    });
  }

  public playWrong(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.linearRampToValueAtTime(115, now + 0.24);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.27);
  }

  public playTick(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(780, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playVictory(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.11 },
      { f: 659.25, d: 0.11 },
      { f: 783.99, d: 0.13 },
      { f: 1046.5, d: 0.36 },
    ];
    let offset = 0;
    melody.forEach((item) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + offset);

      gain.gain.setValueAtTime(0.16, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + item.d);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + item.d);
      offset += item.d * 0.85;
    });
  }

  public playGameOver(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [330, 311, 293, 261];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.13);

      gain.gain.setValueAtTime(0.11, now + idx * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.13 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.13);
      osc.stop(now + idx * 0.13 + 0.24);
    });
  }
}

export const soundManager = new SoundManager();
