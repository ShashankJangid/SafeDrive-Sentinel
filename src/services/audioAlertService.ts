// Web Audio API procedural sound synthesizer for safety chimes and emergency sirens

class SoundAlertService {
  private ctx: AudioContext | null = null;
  private sirenIntervalId: number | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Pleasant double-beep when driver confirms "Yes, I am safe"
  playSafeConfirmChime(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Note 1: E5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Note 2: B5 (higher, pleasant harmony)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.12);
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn("Audio chime prevented by autoplay policy:", e);
    }
  }

  // Attention-getting welfare check chime when interval prompt pops up
  playWelfarePromptAlert(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Double pulse tone
      [0, 0.25].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 520 : 650, now + offset);
        gain.gain.setValueAtTime(0.22, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.2);
      });
    } catch (e) {
      console.warn("Welfare prompt audio error:", e);
    }
  }

  // Emergency siren when driver presses "No" or times out
  playEmergencySiren(): void {
    try {
      this.stopEmergencySiren();
      const ctx = this.getContext();

      let toggle = false;
      const playTone = () => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        // Alternating European Police / Ambulance frequencies 700Hz and 950Hz
        osc.frequency.setValueAtTime(toggle ? 960 : 720, now);
        toggle = !toggle;

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.02, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
      };

      playTone();
      this.sirenIntervalId = window.setInterval(playTone, 500);
    } catch (e) {
      console.warn("Emergency siren audio error:", e);
    }
  }

  stopEmergencySiren(): void {
    if (this.sirenIntervalId !== null) {
      clearInterval(this.sirenIntervalId);
      this.sirenIntervalId = null;
    }
  }
}

export const soundAlertService = new SoundAlertService();
