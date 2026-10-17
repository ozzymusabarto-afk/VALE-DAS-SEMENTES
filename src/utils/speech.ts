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

const CURRENT_VOICE_VERSION = 'male-narrator-v2';
const STORAGE_KEY_VOICE_VERSION = 'vale-das-sementes-voice-version';
const STORAGE_KEY_VOICE = 'vale-das-sementes-voice';
const STORAGE_KEY_PACE = 'vale-das-sementes-speech-pace';
const STORAGE_KEY_MUTED = 'vale-das-sementes-speech-muted';

const AUDIO_CACHE_TAG = '?v=male-v2';

function audioWithVersion(path: string): string {
  return `${path}${AUDIO_CACHE_TAG}`;
}

function getRawAudioPath(t: string): string | null {
  // 1. Demonstração / Teste Oficial (Áudio genuíno do Vovô Narrador)
  if (t.includes('caminhar com calma pelo vale') || t.includes('olá, guardião. vamos caminhar') || t.includes('ola, guardiao. vamos caminhar')) {
    return '/audio/narration/teste-narrador.mp3';
  }

  // 2. Fases Principais
  if (t.includes('mapa do vale das sementes')) {
    return '/audio/narration/map_overview.mp3';
  }
  if (t.includes('investigação no vale') || t.includes('investigacao no vale')) {
    return '/audio/narration/location_scene.mp3';
  }
  if (t.includes('ponte de madeira e a festa das flores') && (t.includes('primavera') || t.includes('chegou ao vale') || t.includes('doze sementes') || t.includes('12 sementes'))) {
    return '/audio/narration/narrative_card.mp3';
  }
  if (t.includes('hora da previsão!') || t.includes('hora da previsao!') || t.includes('o que você acha que pode acontecer antes de distribuir as sementes')) {
    return '/audio/narration/prediction.mp3';
  }
  if (t.includes('sementes douradas para distribuir') || t.includes('arraste ou toque nas sementes para colocar nas três cestas')) {
    return '/audio/narration/seed_allocation_instructions.mp3';
  }
  if (t.includes('distribua suas') || (t.includes('sementes entre agora') && t.includes('proteção no silo'))) {
    return '/audio/narration/seed_allocation.mp3';
  }
  if (t.includes('trancar as janelas da casa e proteger a colheita') || t.includes('nuvens carregadas e chuva forte')) {
    return '/audio/narration/storm_alert.mp3';
  }
  if (t.includes('ventania da virada de estação') || t.includes('ventania da virada de estacao')) {
    return '/audio/narration/season_transition.mp3';
  }
  if (t.includes('compreendendo o resultado') || t.includes('vento soprou e soltou')) {
    return '/audio/narration/consequence.mp3';
  }
  if (t.includes('excelente decisão de proteção') || t.includes('excelente decisao de protecao') || t.includes('comunidade permaneceu segura e confiante')) {
    return '/audio/narration/consequence_protected.mp3';
  }
  if (t.includes('toda escolha traz um aprendizado valioso') || t.includes('reserva no silo faz falta')) {
    return '/audio/narration/consequence_learning.mp3';
  }
  if (t.includes('diário de bordo') || t.includes('diario de bordo')) {
    return '/audio/narration/introducao_diario.mp3';
  }

  // 3. Metas dos Locais
  if (t.includes('o mercado e o consumo consciente') || t.includes('mercado da raposa. no mercado')) {
    return '/audio/narration/loc_market.mp3';
  }
  if (t.includes('a oficina e a manutenção preventiva') || t.includes('oficina de tomás. cuidar e fazer')) {
    return '/audio/narration/loc_workshop.mp3';
  }
  if (t.includes('a casa e o alimento em família') || t.includes('casa da fazenda. o bem-estar')) {
    return '/audio/narration/loc_house.mp3';
  }
  if (t.includes('o silo e a reserva de proteção') || t.includes('silo da reserva. guardar sementes')) {
    return '/audio/narration/loc_silo.mp3';
  }
  if (t.includes('a horta e a paciência do tempo') || t.includes('horta de cornélio. cada semente precisa')) {
    return '/audio/narration/loc_field.mp3';
  }
  if (t.includes('o bosque e os sonhos de longo prazo') || t.includes('bosque das montanhas. olhar para o horizonte')) {
    return '/audio/narration/loc_woods.mp3';
  }
  if (t.includes('a ponte e a cooperação comunitária') || t.includes('ponte de madeira e a festa. a ponte é o caminho')) {
    return '/audio/narration/loc_bridge.mp3';
  }

  // 4. Falas de Introdução das Cenas dos Moradores
  if (t.includes('banca parece delicioso e urgente') || t.includes('compare as cestas antes de decidir')) {
    return '/audio/narration/intro_scene_market.mp3';
  }
  if (t.includes('quem cuida da ferramenta hoje') || t.includes('consertar antes de quebrar de vez')) {
    return '/audio/narration/intro_scene_workshop.mp3';
  }
  if (t.includes('a casa é o nosso refúgio') || t.includes('a casa e o nosso refugio') || t.includes('viver com saúde, afeto e dignidade')) {
    return '/audio/narration/intro_scene_house.mp3';
  }
  if (t.includes('silo não serve para nos tornar mais ricos') || t.includes('silo nao serve para nos tornar mais ricos') || t.includes('comprar tempo e liberdade de escolha')) {
    return '/audio/narration/intro_scene_silo.mp3';
  }
  if (t.includes('não adianta puxar a folha') || t.includes('nao adianta puxar a folha') || t.includes('dedicação diária é o maior segredo')) {
    return '/audio/narration/intro_scene_field.mp3';
  }
  if (t.includes('ponte ainda aguenta nossos passos') || t.includes('veja a ponte da primavera')) {
    return '/audio/narration/intro_scene_bridge.mp3';
  }
  if (t.includes('bosque nos ensina a olhar longe') || t.includes('raízes fundas e constância')) {
    return '/audio/narration/intro_scene_woods.mp3';
  }

  // 5. Previsões de Cada Local
  if (t.includes('previsão no mercado da raposa') || t.includes('previsao no mercado da raposa')) {
    return '/audio/narration/pred_market.mp3';
  }
  if (t.includes('previsão na oficina de ferramentas') || t.includes('previsao na oficina de ferramentas')) {
    return '/audio/narration/pred_workshop.mp3';
  }
  if (t.includes('previsão na casa da fazenda') || t.includes('previsao na casa da fazenda') || t.includes('bem-estar da casa')) {
    return '/audio/narration/pred_house.mp3';
  }
  if (t.includes('previsão no silo da reserva') || t.includes('previsao no silo da reserva')) {
    return '/audio/narration/pred_silo.mp3';
  }
  if (t.includes('previsão na horta de cornélio') || t.includes('previsao na horta de cornelio')) {
    return '/audio/narration/pred_field.mp3';
  }
  if (t.includes('previsão na ponte de madeira') || t.includes('previsao na ponte de madeira')) {
    return '/audio/narration/pred_bridge.mp3';
  }
  if (t.includes('previsão no bosque das montanhas') || t.includes('previsao no bosque das montanhas')) {
    return '/audio/narration/pred_woods.mp3';
  }

  // 6. Consequências de Cada Local
  if (t.includes('no mercado da raposa, você comprou o que era necessário') || t.includes('mercado da raposa, voce comprou')) {
    return '/audio/narration/csq_market_pos.mp3';
  }
  if (t.includes('no mercado, muitas coisas chamavam a atenção') || t.includes('muitas coisas chamavam a atencao')) {
    return '/audio/narration/csq_market_lea.mp3';
  }
  if (t.includes('suas ferramentas estão prontas e a fazenda tem reserva') || t.includes('suas ferramentas estao prontas')) {
    return '/audio/narration/csq_workshop_pos.mp3';
  }
  if (t.includes('na oficina, vimos que ferramentas quebram sem avisar')) {
    return '/audio/narration/csq_workshop_lea.mp3';
  }
  if (t.includes('a despensa da casa está cheia e a família protegida') || t.includes('despensa da casa esta cheia')) {
    return '/audio/narration/csq_house_pos.mp3';
  }
  if (t.includes('a casa precisou de reparos extras')) {
    return '/audio/narration/csq_house_lea.mp3';
  }
  if (t.includes('o silo da reserva cumpriu seu papel')) {
    return '/audio/narration/csq_silo_pos.mp3';
  }
  if (t.includes('o silo precisava de mais suprimentos')) {
    return '/audio/narration/csq_silo_lea.mp3';
  }
  if (t.includes('que colheita abençoada! a paciência do tempo') || t.includes('que colheita abencoada')) {
    return '/audio/narration/csq_field_pos.mp3';
  }
  if (t.includes('a terra pede tempo e cuidado contínuo') || t.includes('cuidado continuo')) {
    return '/audio/narration/csq_field_lea.mp3';
  }
  if (t.includes('a ponte ficou firme e segura! a festa das flores')) {
    return '/audio/narration/csq_bridge_pos.mp3';
  }
  if (t.includes('o vento abalou a ponte de madeira')) {
    return '/audio/narration/csq_bridge_lea.mp3';
  }
  if (t.includes('que visão magnífica do alto do bosque') || t.includes('que visao magnifica')) {
    return '/audio/narration/csq_woods_pos.mp3';
  }
  if (t.includes('o mirante nos mostrou o valor da constância') || t.includes('valor da constancia')) {
    return '/audio/narration/csq_woods_lea.mp3';
  }

  // 7. Diálogos Explicativos dos Moradores
  if (t.includes('necessidades são coisas essenciais para nossa saúde') || t.includes('necessidades sao coisas essenciais')) {
    return '/audio/narration/diag_market_q1.mp3';
  }
  if (t.includes('muitas vezes as placas dizem só hoje') || t.includes('placas dizem so hoje')) {
    return '/audio/narration/diag_market_q2.mp3';
  }
  if (t.includes('quando não gastamos tudo por impulso') || t.includes('quando nao gastamos tudo por impulso')) {
    return '/audio/narration/diag_market_q3.mp3';
  }
  if (t.includes('quase sempre o conserto a tempo custa apenas uma fração') || t.includes('apenas uma fracao')) {
    return '/audio/narration/diag_workshop_q1.mp3';
  }
  if (t.includes('uma telha frouxa derruba o telhado')) {
    return '/audio/narration/diag_workshop_q2.mp3';
  }
  if (t.includes('quem sabe consertar, plantar ou construir')) {
    return '/audio/narration/diag_workshop_q3.mp3';
  }
  if (t.includes('poupar não significa passar necessidade') || t.includes('poupar nao significa passar necessidade')) {
    return '/audio/narration/diag_house_q1.mp3';
  }
  if (t.includes('pagar as trocas combinadas na data certa')) {
    return '/audio/narration/diag_house_q2.mp3';
  }
  if (t.includes('prosperidade não é ter luxos caros') || t.includes('prosperidade nao e ter luxos caros')) {
    return '/audio/narration/diag_house_q3.mp3';
  }
  if (t.includes('quem guarda para ostentar quer ser maior')) {
    return '/audio/narration/diag_silo_q1.mp3';
  }
  if (t.includes('sem reserva, qualquer chuva forte nos obriga')) {
    return '/audio/narration/diag_silo_q2.mp3';
  }
  if (t.includes('quando você tem sementes guardadas') || t.includes('voce nao aceita ofertas enganosas')) {
    return '/audio/narration/diag_silo_q3.mp3';
  }
  if (t.includes('promessas de crescimento rápido e milagroso') || t.includes('crescimento rapido e milagroso')) {
    return '/audio/narration/diag_field_q1.mp3';
  }
  if (t.includes('se colhermos a muda pequenininha')) {
    return '/audio/narration/diag_field_q2.mp3';
  }
  if (t.includes('colocar uma única semente no silo') || t.includes('colocar uma unica semente no silo')) {
    return '/audio/narration/diag_field_q3.mp3';
  }
  if (t.includes('natureza nunca dá certeza absoluta') || t.includes('natureza nunca da certeza absoluta')) {
    return '/audio/narration/diag_bridge_q1.mp3';
  }
  if (t.includes('três a quatro sementes reservadas para o depois') || t.includes('3 a 4 sementes reservadas para o depois')) {
    return '/audio/narration/diag_bridge_q2.mp3';
  }
  if (t.includes('o silo é a proteção do vale. se o vento soltar telhas') || t.includes('o silo e a protecao do vale')) {
    return '/audio/narration/diag_bridge_q3.mp3';
  }
  if (t.includes('aprender uma profissão, reflorestar uma colina') || t.includes('aprender uma profissao')) {
    return '/audio/narration/diag_woods_q1.mp3';
  }
  if (t.includes('guardar todas as suas sementes para o futuro distante')) {
    return '/audio/narration/diag_woods_q2.mp3';
  }
  if (t.includes('olhe para trás e veja o quanto você já aprendeu') || t.includes('olhe para tras e veja o quanto voce')) {
    return '/audio/narration/diag_woods_q3.mp3';
  }

  return null;
}

// Mapeamento de áudios masculinos do Vovô Narrador, versionados para evitar cache antigo.
export function findPreRecordedAudio(text: string): string | null {
  const t = text.toLowerCase();
  const rawPath = getRawAudioPath(t);
  if (!rawPath) return null;
  return audioWithVersion(rawPath);
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
    return -5000; // Descartar outros idiomas
  }

  // Filtragem e rejeição estrita de qualquer voz feminina ou de GPS robótica
  const femaleKeywords = [
    'maria', 'helena', 'zira', 'leticia', 'letícia', 'francisca', 'luciana', 
    'raquel', 'vitoria', 'vitória', 'fernanda', 'camila', 'female', 'mulher', 
    'feminina', 'woman', 'girl'
  ];
  if (femaleKeywords.some(keyword => name.includes(keyword))) {
    return -5000; // Descartar totalmente vozes femininas
  }

  // Penalizar vozes de Portugal quando o jogo é focado em pt-BR
  if (name.includes('portugal') || lang === 'pt-pt') {
    return -1000;
  }

  // Vozes masculinas e naturais de alta qualidade no Windows, Edge e Chrome
  if (name.includes('antonio') || name.includes('antônio')) score += 120; // Microsoft Antonio (Natural)
  if (name.includes('natural')) score += 45;
  if (name.includes('online')) score += 25;
  if (name.includes('francisco') || name.includes('thiago') || name.includes('felipe') || name.includes('ricardo')) score += 80;
  if (name.includes('male') || name.includes('homem') || name.includes('masculino')) score += 50;

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
      const savedVersion = localStorage.getItem(STORAGE_KEY_VOICE_VERSION);
      if (savedVersion !== CURRENT_VOICE_VERSION) {
        localStorage.removeItem(STORAGE_KEY_VOICE);
        localStorage.setItem(STORAGE_KEY_VOICE_VERSION, CURRENT_VOICE_VERSION);
        this.selectedVoiceURI = null;
      } else {
        const savedVoice = localStorage.getItem(STORAGE_KEY_VOICE);
        if (savedVoice) this.selectedVoiceURI = savedVoice;
      }

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

    // Ordena da melhor pontuação para a menor, descartando vozes inválidas
    return ptVoices
      .filter(v => scoreVoice(v) > -1000)
      .sort((a, b) => scoreVoice(b) - scoreVoice(a));
  }

  public hasNativeMaleVoice(): boolean {
    const ptVoices = this.getAvailablePtVoices();
    return ptVoices.some(v => scoreVoice(v) > 0);
  }

  public getSelectedVoiceDisplayName(): string {
    const v = this.getSelectedVoice();
    if (!v) return 'Nenhuma voz do sistema compatível';
    return v.name;
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
