import React from 'react';
import { BookOpen, Volume2, VolumeX, Sparkles, Eye, Mic, Wind } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';
import type { AccessibilitySettings } from '../types/game';

interface HeaderProps {
  currentSeeds: number;
  totalSeeds: number;
  seasonText: string;
  goalText: string;
  onOpenJournal: () => void;
  accessibility: AccessibilitySettings;
  setAccessibility: React.Dispatch<React.SetStateAction<AccessibilitySettings>>;
  currentNarrationText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentSeeds,
  seasonText,
  goalText,
  onOpenJournal,
  accessibility,
  setAccessibility,
  currentNarrationText
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = React.useState(false);
  const [isNarrating, setIsNarrating] = React.useState(false);

  const toggleMusic = () => {
    const active = soundManager.toggleMusic();
    setIsPlayingMusic(active);
    setAccessibility(prev => ({ ...prev, musicEnabled: active }));
  };

  const toggleSoundEffects = () => {
    const nextState = !accessibility.soundEnabled;
    soundManager.setMuted(!nextState);
    setAccessibility(prev => ({ ...prev, soundEnabled: nextState }));
  };

  const handleReadAloud = () => {
    if (isNarrating) {
      speechHelper.stop();
      setIsNarrating(false);
    } else if (currentNarrationText) {
      setIsNarrating(true);
      speechHelper.speak(currentNarrationText, () => {
        setIsNarrating(false);
      });
    }
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => {
      const next = !prev.highContrast;
      if (next) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      return { ...prev, highContrast: next };
    });
  };

  const toggleLargeText = () => {
    setAccessibility(prev => {
      const next = !prev.largeText;
      if (next) {
        document.body.classList.add('large-text');
      } else {
        document.body.classList.remove('large-text');
      }
      return { ...prev, largeText: next };
    });
  };

  const toggleReducedMotion = () => {
    setAccessibility(prev => {
      const next = !prev.reducedMotion;
      if (next) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
      return { ...prev, reducedMotion: next };
    });
  };

  return (
    <header className="top-header" role="banner">
      <div className="season-badge" aria-label={`Estação: ${seasonText}`}>
        <Sparkles size={22} aria-hidden="true" />
        <div>
          <span>{seasonText}</span>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            Meta: {goalText}
          </div>
        </div>
      </div>

      <div className="seed-counter" aria-label={`Sementes disponíveis: ${currentSeeds}`}>
        <span className="seed-token" aria-hidden="true"></span>
        <span>{currentSeeds} sementes livres</span>
      </div>

      <nav className="header-controls" aria-label="Ações e Acessibilidade">
        <button 
          onClick={onOpenJournal}
          className="btn-icon"
          title="Abrir Diário de Bordo"
          aria-label="Diário de Bordo"
        >
          <BookOpen size={18} aria-hidden="true" />
          <span>Diário</span>
        </button>

        {currentNarrationText && (
          <button 
            onClick={handleReadAloud}
            className={`btn-icon ${isNarrating ? 'active' : ''}`}
            title="Ouvir leitura em voz alta"
            aria-label={isNarrating ? "Parar leitura" : "Ouvir leitura em voz alta"}
          >
            <Mic size={18} aria-hidden="true" />
            <span>{isNarrating ? 'Lendo...' : 'Ouvir'}</span>
          </button>
        )}

        <button 
          onClick={toggleMusic}
          className={`btn-icon ${isPlayingMusic ? 'active' : ''}`}
          title="Música ambiente suave"
          aria-label={isPlayingMusic ? "Desligar música" : "Ligar música suave"}
        >
          {isPlayingMusic ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
          <span>Música</span>
        </button>

        <button 
          onClick={toggleSoundEffects}
          className={`btn-icon ${accessibility.soundEnabled ? 'active' : ''}`}
          title="Efeitos sonoros"
          aria-label={accessibility.soundEnabled ? "Desativar efeitos sonoros" : "Ativar efeitos sonoros"}
        >
          <span>{accessibility.soundEnabled ? '🔔 Sons' : '🔕 Sons'}</span>
        </button>

        <button 
          onClick={toggleLargeText}
          className={`btn-icon ${accessibility.largeText ? 'active' : ''}`}
          title="Aumentar tamanho do texto"
          aria-label="Alternar texto grande"
        >
          <span style={{ fontWeight: 'bold' }}>A+</span>
        </button>

        <button 
          onClick={toggleHighContrast}
          className={`btn-icon ${accessibility.highContrast ? 'active' : ''}`}
          title="Alternar Alto Contraste"
          aria-label="Alto contraste"
        >
          <Eye size={18} aria-hidden="true" />
        </button>

        <button 
          onClick={toggleReducedMotion}
          className={`btn-icon ${accessibility.reducedMotion ? 'active' : ''}`}
          title="Reduzir movimentos e brilhos na tela"
          aria-label="Reduzir movimentos e brilhos"
        >
          <Wind size={18} aria-hidden="true" />
          <span>{accessibility.reducedMotion ? 'Movimento: Calmo' : 'Movimento'}</span>
        </button>
      </nav>
    </header>
  );
};
