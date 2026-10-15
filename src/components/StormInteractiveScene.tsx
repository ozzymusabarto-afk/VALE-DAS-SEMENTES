import React, { useState, useEffect } from 'react';
import { CloudRain, Wind, ArrowRight, ShieldCheck, Home, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

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

  const handleListen = () => {
    speechHelper.speak(
      "Atenção no Vale! A ventania da virada de estação chegou com nuvens carregadas e chuva forte. Toque no botão para trancar as janelas da casa e proteger a colheita antes que o vento aumente!"
    );
  };

  return (
    <div className={`storm-interactive-card ${stormStage}`}>
      <div className="storm-vignette-effect"></div>

      {/* Faixa de Notícia da Natureza */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="storm-alert-badge">
          <Wind size={20} className="wind-spin-icon" />
          <span>O Clima Muda no Vale • Virada para o Verão</span>
        </div>

        <button 
          onClick={handleListen}
          className="btn-icon"
          style={{ background: 'rgba(255,255,255,0.15)', color: '#e0f2fe', borderColor: '#38bdf8' }}
          title="Ouvir aviso da tempestade"
        >
          <Volume2 size={16} />
          <span>Ouvir Aviso</span>
        </button>
      </div>

      <div className="storm-stage-viewport" style={{ height: '400px' }}>
        <img 
          src="/cena-tempestade-vale.webp" 
          alt="Pintura completa da tempestade sobre o Vale das Sementes" 
          className={`storm-image-effect ${stormStage}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
            <Home size={28} />
            <div>
              <strong>{hasClosedWindows ? "✓ Casa e Celeiro Fechados e Protegidos!" : "👆 Toque aqui para trancar as janelas!"}</strong>
              <span style={{ fontSize: '0.85rem', display: 'block', opacity: 0.9 }}>
                {hasClosedWindows ? "Os animais e os mantimentos estão em segurança lá dentro" : "Proteja o interior da casa antes do vento atingir o pico"}
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
          O vento forte soprou veloz sobre o rio e fez as vigas da ponte vibrarem! Algumas telhas da Casa se soltaram com a força das rajadas. Mas com a casa trancada e o Vale alerta, todos estão em segurança.
        </p>

        {hasClosedWindows ? (
          <div className="callout-gentle" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
            <ShieldCheck size={24} color="#166534" />
            <span>
              <strong>Excelente reflexo de Guardião!</strong> Você fechou as janelas a tempo. Agora vamos ao Silo para ver como a nossa reserva de sementes vai nos ajudar a consertar o telhado!
            </span>
          </div>
        ) : (
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '12px 16px', color: '#92400e', fontSize: '0.95rem' }}>
            🌾 O vento já está amainando. Vamos abrir o Silo da Reserva e ver nossas opções para reparar os danos da ventania.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '18px' }}>
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
