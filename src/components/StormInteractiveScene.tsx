import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, ArrowRight, ShieldCheck, Home } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StormInteractiveSceneProps {
  onContinue: () => void;
}

export const StormInteractiveScene: React.FC<StormInteractiveSceneProps> = ({ onContinue }) => {
  const [hasClosedWindows, setHasClosedWindows] = useState(false);
  const [stormStage, setStormStage] = useState<'gathering' | 'peak' | 'calm'>('gathering');

  useEffect(() => {
    soundManager.playSoftThunder();
    soundManager.playGentleBreeze();

    const timer1 = setTimeout(() => {
      setStormStage('peak');
    }, 1800);

    return () => clearTimeout(timer1);
  }, []);

  const handleProtectHouse = () => {
    soundManager.playHammer();
    setHasClosedWindows(true);
  };

  return (
    <div className={`storm-interactive-card ${stormStage}`}>
      <div className="storm-vignette-effect"></div>

      {/* Faixa de Notícia da Natureza */}
      <div className="storm-alert-badge">
        <Wind size={20} className="wind-spin-icon" />
        <span>O Clima Muda no Vale • Virada de Estação</span>
      </div>

      <div className="storm-stage-viewport">
        <img 
          src="/concept_vale_das_sementes.jpg" 
          alt="Tempestade no Vale das Sementes" 
          className={`storm-image-effect ${stormStage}`}
        />

        {/* Efeito de Chuva em Camadas */}
        <div className="rain-layer"></div>

        {/* Ação Interativa: Fechar a Janela / Proteger Casa */}
        <div className="house-interactive-shelter">
          <button
            onClick={handleProtectHouse}
            className={`btn-protect-shelter ${hasClosedWindows ? 'secured' : ''}`}
            title="Fechar janelas e proteger a casa da ventania"
          >
            <Home size={24} />
            <div>
              <strong>{hasClosedWindows ? "✓ Casa e Celeiro Fechados!" : "👆 Toque aqui para fechar as janelas!"}</strong>
              <span style={{ fontSize: '0.8rem', display: 'block', opacity: 0.9 }}>
                {hasClosedWindows ? "Tudo quentinho e seguro por dentro" : "Proteja a casa antes da chuva aumentar"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Relato Vivo da Tempestade */}
      <div className="storm-narrative-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <CloudRain size={28} color="#0284c7" />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
            A Ventania da Virada de Estação!
          </h2>
        </div>

        <p style={{ margin: '0 0 14px', fontSize: '1.05rem', color: '#334155', lineHeight: '1.6' }}>
          O vento forte soprou sobre o rio e fez as vigas da ponte vibrarem! Algumas telhas da Casa se soltaram com a força do vento. Mas com as janelas trancadas e o Vale atento, os moradores estão em segurança.
        </p>

        {hasClosedWindows && (
          <div className="callout-gentle" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
            <ShieldCheck size={22} color="#166534" />
            <span>
              <strong>Excelente reflexo!</strong> Você protegeu a casa a tempo. Agora vamos ao Silo para ver como a nossa reserva de sementes vai nos ajudar a consertar o que quebrou!
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button
          onClick={() => {
            soundManager.playMagicSparkle();
            onContinue();
          }}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.2rem' }}
        >
          <span>Ir ao Silo e Ver Nossas Opções</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};
