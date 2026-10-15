// Narração de Acessibilidade com Web Speech API em Português do Brasil

class SpeechHelper {
  private isSpeaking: boolean = false;

  public speak(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Síntese de voz não suportada pelo navegador.');
      return;
    }

    this.stop();

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Leitura calma e articulada
    utterance.pitch = 1.05; // Tom amigável e acolhedor

    // Tentar selecionar uma voz em pt-BR se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    this.isSpeaking = true;
    window.speechSynthesis.speak(utterance);
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }

  public getSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechHelper = new SpeechHelper();
