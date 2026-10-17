// Narração Acolhedora em Português do Brasil — O Vale das Sementes
// Modo Híbrido: Voz de Estúdio do Vovô Narrador (pt-BR-AntonioNatural) + Fallback Inteligente Web Speech API

export type SpeechPace = 'slow' | 'calm' | 'normal';

const PACE_RATES: Record<SpeechPace, number> = {
  slow: 0.74,   // Mais devagar para crianças menores
  calm: 0.84,   // Ritmo padrão sereno e acolhedor
  normal: 0.96  // Ritmo normal de conversa
};

const AUDIO_PLAYBACK_RATES: Record<SpeechPace, number> = {
  slow: 0.88,
  calm: 1.0,
  normal: 1.15
};

export const TEST_SAMPLE_PHRASE = 
  "Olá, guardião. Vamos caminhar com calma pelo Vale. Cada semente que você cuida pode ajudar a construir uma escolha mais tranquila.";

const STORAGE_KEY_VOICE = 'vale-das-sementes-voice';
const STORAGE_KEY_PACE = 'vale-das-sementes-speech-pace';
const STORAGE_KEY_MUTED = 'vale-das-sementes-speech-muted';

// Mapeamento de áudios de estúdio do Vovô Narrador
export function findPreRecordedAudio(text: string): string | null {
  const t = text.toLowerCase();
  
  if (t.includes('caminhar com calma pelo vale') || t.includes('olá, guardião. vamos caminhar') || t.includes('ola, guardiao. vamos caminhar')) {
    return '/audio/narration/teste-narrador.mp3';
  }
  if (t.includes('mapa do vale das sementes')) {
    return '/audio/narration/map_overview.mp3';
  }
  if (t.includes('investigação no vale') || t.includes('investigacao no vale')) {
    return '/audio/narration/location_scene.mp3';
  }
  if (t.includes('ponte de madeira e a festa das flores') && (t.includes('primavera') || t.includes('chegou ao vale') || t.includes('doze sementes') || t.includes('12 sementes'))) {
    return '/audio/narration/narrative_card.mp3';
  }
  if (t.includes('hora da previsão') || t.includes('hora da previsao')) {
    return '/audio/narration/prediction.mp3';
  }
  if (t.includes('distribua suas') || (t.includes('sementes entre agora') && t.includes('proteção no silo'))) {
    return '/audio/narration/seed_allocation.mp3';
  }
  if (t.includes('ventania da virada de estação') || t.includes('ventania da virada de estacao')) {
    return '/audio/narration/season_transition.mp3';
  }
  if (t.includes('compreendendo o resultado') || t.includes('vento soprou e soltou')) {
    return '/audio/narration/consequence.mp3';
  }
  if (t.includes('excelente decisão') || t.includes('excelente decisao') || t.includes('comunidade permaneceu segura')) {
    return '/audio/narration/consequence_protected.mp3';
  }
  if (t.includes('aprendizado valioso') || t.includes('reserva no silo faz falta')) {
    return '/audio/narration/consequence_learning.mp3';
  }
  if (t.includes('diário de bordo') || t.includes('diario de bordo')) {
    return '/audio/narration/introducao_diario.mp3';
  }
  if (t.includes('mercado da raposa') || t.includes('consumo consciente')) {
    return '/audio/narration/loc_market.mp3';
  }
  if (t.includes('oficina de tomás') || t.includes('oficina de tomas') || t.includes('manutenção preventiva')) {
    return '/audio/narration/loc_workshop.mp3';
  }
  if (t.includes('casa da fazenda') || t.includes('alimento em família')) {
    return '/audio/narration/loc_house.mp3';
  }
  if (t.includes('silo da reserva') || t.includes('reserva de proteção')) {
    return '/audio/narration/loc_silo.mp3';
  }
  if (t.includes('horta de cornélio') || t.includes('horta de cornelio') || t.includes('paciência do tempo')) {
    return '/audio/narration/loc_field.mp3';
  }
  if (t.includes('bosque das montanhas') || t.includes('sonhos de longo prazo')) {
    return '/audio/narration/loc_woods.mp3';
  }
  if (t.includes('ponte de madeira') || t.includes('cooperação comunitária')) {
    return '/audio/narration/loc_bridge.mp3';
  }
  return null;
}

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
  private currentAudio: HTMLAudioElement | null = null;
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
    if (this.currentAudio) {
      this.currentAudio.playbackRate = AUDIO_PLAYBACK_RATES[this.pace] || 1.0;
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
    if (this.muted) {
      if (onEnd) onEnd();
      return;
    }

    // Cancela qualquer fala anterior imediatamente antes de iniciar nova
    this.stop();

    // Limpeza de marcações markdown e ajustes de pontuação
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // 1. Tentar áudio pré-gravado com voz de estúdio do Vovô Narrador (Antonio Natural)
    const audioUrl = findPreRecordedAudio(cleanText);
    if (audioUrl && typeof window !== 'undefined') {
      try {
        const audio = new Audio(audioUrl);
        audio.playbackRate = AUDIO_PLAYBACK_RATES[this.pace] || 1.0;
        audio.volume = 1.0;
        this.currentAudio = audio;
        this.isSpeaking = true;

        audio.onended = () => {
          this.isSpeaking = false;
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.currentAudio = null;
          this.speakWithSynthesis(cleanText, onEnd);
        };

        audio.play().catch(() => {
          this.currentAudio = null;
          this.speakWithSynthesis(cleanText, onEnd);
        });
        return;
      } catch {
        this.currentAudio = null;
      }
    }

    // 2. Fallback para síntese local caso não haja áudio gravado
    this.speakWithSynthesis(cleanText, onEnd);
  }

  private speakWithSynthesis(cleanText: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = PACE_RATES[this.pace] || 0.84;
    utterance.pitch = 0.84;
    utterance.volume = 0.95;

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
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

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
