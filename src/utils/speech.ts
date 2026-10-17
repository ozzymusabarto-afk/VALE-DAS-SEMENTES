// Narração Acolhedora em Português do Brasil — O Vale das Sementes
// Configurado com tom maduro, calmo e acolhedor (estilo vovô amoroso)

export type SpeechPace = 'slow' | 'calm' | 'normal';

const PACE_RATES: Record<SpeechPace, number> = {
  slow: 0.74,   // Mais devagar para crianças menores
  calm: 0.84,   // Ritmo padrão sereno e acolhedor
  normal: 0.96  // Ritmo normal de conversa
};

const TEST_SAMPLE_PHRASE = 
  "Olá, guardião. Vamos caminhar com calma pelo Vale. Cada semente que você cuida pode ajudar a construir uma escolha mais tranquila.";

const STORAGE_KEY_VOICE = 'vale-das-sementes-voice';
const STORAGE_KEY_PACE = 'vale-das-sementes-speech-pace';
const STORAGE_KEY_MUTED = 'vale-das-sementes-speech-muted';

export function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  let score = 0;

  // Prioridade absoluta para português brasileiro
  if (lang === 'pt-br') {
    score += 100;
  } else if (lang.startsWith('pt')) {
    score += 30;
  } else {
    return -1000; // Descartar outros idiomas
  }

  // Vozes masculinas e naturais de alta qualidade no Windows, Edge e Chrome
  if (name.includes('antonio')) score += 80; // Microsoft Antonio (Natural)
  if (name.includes('natural')) score += 45;
  if (name.includes('online')) score += 25;
  if (name.includes('google')) score += 20; // Google português do Brasil
  if (name.includes('brasil') || name.includes('brazil')) score += 20;
  if (name.includes('francisco') || name.includes('thiago') || name.includes('felipe')) score += 30;

  // Penalizar vozes conhecidas por soar robóticas, femininas ou de Portugal
  if (name.includes('portugal') || lang === 'pt-pt') score -= 50;
  if (name.includes('female')) score -= 25;
  if (name.includes('zira')) score -= 25;
  if (name.includes('helena')) score -= 20;
  if (name.includes('maria')) score -= 20;
  if (name.includes('leticia')) score -= 20;
  if (name.includes('francisca')) score -= 20;

  return score;
}

class SpeechHelper {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoiceURI: string | null = null;
  private pace: SpeechPace = 'calm';
  private muted: boolean = false;
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadPreferences();
    this.initVoices();
  }

  private loadPreferences() {
    try {
      const savedVoice = localStorage.getItem(STORAGE_KEY_VOICE);
      if (savedVoice) this.selectedVoiceURI = savedVoice;

      const savedPace = localStorage.getItem(STORAGE_KEY_PACE) as SpeechPace;
      if (savedPace && (savedPace === 'slow' || savedPace === 'calm' || savedPace === 'normal')) {
        this.pace = savedPace;
      }

      const savedMuted = localStorage.getItem(STORAGE_KEY_MUTED);
      if (savedMuted !== null) {
        this.muted = savedMuted === 'true';
      }
    } catch {
      // LocalStorage pode estar desativado em modo anônimo estrito
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.notifyListeners();
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(fn => fn());
  }

  public getAvailablePtVoices(): SpeechSynthesisVoice[] {
    if (!this.voices || this.voices.length === 0) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    }

    const ptVoices = this.voices.filter(v => {
      const lang = v.lang.toLowerCase();
      return lang === 'pt-br' || lang.startsWith('pt');
    });

    // Ordena da melhor pontuação para a menor
    return ptVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  }

  public getSelectedVoice(): SpeechSynthesisVoice | null {
    const ptVoices = this.getAvailablePtVoices();
    if (ptVoices.length === 0) return null;

    if (this.selectedVoiceURI) {
      const found = ptVoices.find(v => v.voiceURI === this.selectedVoiceURI || v.name === this.selectedVoiceURI);
      if (found) return found;
    }

    // Retorna a melhor voz pontuada pelo catálogo
    return ptVoices[0] || null;
  }

  public setSelectedVoice(voiceURI: string) {
    this.selectedVoiceURI = voiceURI;
    try {
      localStorage.setItem(STORAGE_KEY_VOICE, voiceURI);
    } catch {
      // Silencioso
    }
    this.notifyListeners();
  }

  public getPace(): SpeechPace {
    return this.pace;
  }

  public setPace(pace: SpeechPace) {
    this.pace = pace;
    try {
      localStorage.setItem(STORAGE_KEY_PACE, pace);
    } catch {
      // Silencioso
    }
    this.notifyListeners();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(muted));
    } catch {
      // Silencioso
    }
    this.notifyListeners();
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }

    // Cancela qualquer fala anterior imediatamente antes de iniciar nova
    this.stop();

    // Limpeza de marcações markdown e ajustes de pontuação para pausas naturais
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    
    // Ritmo sereno e pausado
    utterance.rate = PACE_RATES[this.pace] || 0.84;

    // Tom acolhedor e maduro (vovô ensinando com paciência)
    utterance.pitch = 0.84;
    utterance.volume = 0.95;

    // Seleciona a melhor voz disponível
    const bestVoice = this.getSelectedVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // Se foi cancelamento intencional, não loga erro
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Síntese de fala interrompida:', e.error);
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    this.currentUtterance = utterance;

    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  public playTestSample(onEnd?: () => void) {
    this.speak(TEST_SAMPLE_PHRASE, onEnd);
  }
}

export const speechHelper = new SpeechHelper();
