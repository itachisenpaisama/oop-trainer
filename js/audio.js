/**
 * Python OOP & UML Trainer - Web Audio API Synthesizer
 * Zero external audio files, pure browser synthesis, configurable sound profiles.
 */
(function() {
  class SoundEngine {
    constructor(storage) {
      this.storage = storage;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    get isEnabled() {
      return this.storage.data.settings.soundEnabled;
    }

    get volume() {
      return this.storage.data.settings.soundVolume ?? 0.7;
    }

    get profile() {
      return this.storage.data.settings.soundProfile || 'synth';
    }

    playNote(freq, startTime, duration, type = 'sine', gainMultiplier = 0.2) {
      if (!this.isEnabled) return;
      try {
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const baseGain = this.volume * gainMultiplier;

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(baseGain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch(e) {}
    }

    playCorrect() {
      if (!this.isEnabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (this.profile === 'retro') {
        // 8-bit gameboy style ascending arpeggio
        this.playNote(261.63, t, 0.08, 'square', 0.15); // C4
        this.playNote(329.63, t + 0.07, 0.08, 'square', 0.18); // E4
        this.playNote(392.00, t + 0.14, 0.08, 'square', 0.2); // G4
        this.playNote(523.25, t + 0.21, 0.22, 'square', 0.25); // C5
      } else {
        // Modern chime (sine / triangle harmonic)
        this.playNote(523.25, t, 0.16, 'triangle', 0.25); // C5
        this.playNote(659.25, t + 0.08, 0.18, 'sine', 0.3); // E5
        this.playNote(783.99, t + 0.16, 0.35, 'sine', 0.35); // G5
        this.playNote(1046.50, t + 0.24, 0.45, 'triangle', 0.2); // C6
      }
    }

    playIncorrect() {
      if (!this.isEnabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (this.profile === 'retro') {
        this.playNote(185.00, t, 0.14, 'sawtooth', 0.2); // F#3
        this.playNote(130.81, t + 0.12, 0.28, 'square', 0.25); // C3
      } else {
        this.playNote(293.66, t, 0.18, 'sawtooth', 0.15); // D4
        this.playNote(233.08, t + 0.14, 0.32, 'sawtooth', 0.18); // Bb3
      }
    }

    playClick() {
      if (!this.isEnabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      this.playNote(850, t, 0.035, 'triangle', 0.08);
    }

    playStreakBonus() {
      if (!this.isEnabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        this.playNote(freq, t + (idx * 0.06), 0.18, 'triangle', 0.2);
      });
    }

    playLevelUp() {
      if (!this.isEnabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        this.playNote(freq, t + (idx * 0.08), 0.3, 'sine', 0.3);
      });
    }
  }

  window.SoundEngine = SoundEngine;
})();
