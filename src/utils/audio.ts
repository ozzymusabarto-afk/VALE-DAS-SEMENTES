// Sistema de Áudio Mágico e Acolhedor para O Vale das Sementes
// Síntese de Celesta, Glockenspiel e Caixinha de Música com harmônicos mágicos

class MagicSoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopGentleMusic();
    }
  }

  // Toca uma nota mágica de Celesta/Sino Estelar com harmônicos cintilantes
  private playBellNote(freq: number, startTime: number, duration: number, gainVolume = 0.12) {
    if (!this.ctx) return;

    // Oscilador fundamental (onda senoidal pura)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmônico de sino cintilante (quinta acima com oitava / 2.7x)
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.76, startTime);

    // Envelope suave e cristalino
    gain1.gain.setValueAtTime(0.001, startTime);
    gain1.gain.linearRampToValueAtTime(gainVolume, startTime + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

    gain2.gain.setValueAtTime(0.001, startTime);
    gain2.gain.linearRampToValueAtTime(gainVolume * 0.35, startTime + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.0005, startTime + (duration * 0.6));

    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);

    osc1.start(startTime);
    osc1.stop(startTime + duration);
    osc2.start(startTime);
    osc2.stop(startTime + (duration * 0.6));
  }

  // Som mágico de semente sendo plantada ou caindo no cesto (gota de orvalho brilhante)
  public playSeedDrop(pitchOffset = 0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
    const note = baseNotes[Math.abs(pitchOffset) % baseNotes.length];
    const now = this.ctx.currentTime;

    // Duas notinhas mágicas em cascata rápida (plim-plim)
    this.playBellNote(note, now, 0.45, 0.14);
    this.playBellNote(note * 1.5, now + 0.06, 0.35, 0.08);
  }

  // Brilho mágico de pólen e estrelas (Magic Sparkle)
  public playMagicSparkle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [659.25, 783.99, 987.77, 1174.66, 1318.51]; // E5, G5, B5, D6, E6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      this.playBellNote(freq, now + idx * 0.045, 0.5, 0.09);
    });
  }

  // Toque de confirmação mágica (acorde de fada)
  public playChime() {
    this.playMagicSparkle();
  }

  // Som suave de virar página com pó mágico
  public playPageFlip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Ruído suave de papel
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.linearRampToValueAtTime(300, now + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);

    // Pequeno brilhinho na virada
    this.playBellNote(880, now + 0.03, 0.3, 0.04);
  }

  // Brisa suave mágica da floresta
  public playGentleBreeze() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.exponentialRampToValueAtTime(392.00, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(329.63, now + 1.4);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.4);

    // Pequeno sussurro estelar
    this.playBellNote(1046.50, now + 0.3, 0.8, 0.05);
    this.playBellNote(1318.51, now + 0.5, 0.8, 0.04);
  }

  // Música de caixinha de música pastoral mágica (Celesta + Harpa suave)
  public startGentleMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;

    // Frases melódicas ternas estilo Studio Ghibli / Caixinha de Música
    const melodyPhrases = [
      [523.25, 659.25, 783.99, 1046.50, 783.99], // C - E - G - C6 - G
      [440.00, 523.25, 659.25, 880.00, 659.25],  // A - C - E - A5 - E
      [349.23, 440.00, 523.25, 698.46, 523.25],  // F - A - C - F5 - C
      [392.00, 493.88, 587.33, 783.99, 987.77]   // G - B - D - G5 - B5
    ];

    let currentPhrase = 0;

    const playPhrase = () => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx) return;
      const notes = melodyPhrases[currentPhrase % melodyPhrases.length];
      currentPhrase++;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = this.ctx.currentTime + idx * 0.52;
        this.playBellNote(freq, noteTime, 1.4, 0.05);
        // Harmônico de ressonância de caixinha de música
        this.playBellNote(freq * 0.5, noteTime, 1.6, 0.03);
      });
    };

    playPhrase();
    this.musicInterval = window.setInterval(playPhrase, 3600);
  }

  public stopGentleMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopGentleMusic();
      return false;
    } else {
      this.startGentleMusic();
      return true;
    }
  }
}

export const soundManager = new MagicSoundManager();
