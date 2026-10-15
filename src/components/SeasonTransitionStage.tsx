import React from 'react';
import { CloudRain, Wind, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SeasonTransitionStageProps {
  onContinue: () => void;
}

export const SeasonTransitionStage: React.FC<SeasonTransitionStageProps> = ({ onContinue }) => {
  React.useEffect(() => {
    soundManager.playGentleBreeze();
  }, []);

  return (
    <div className="paper-card" style={{ maxWidth: '680px', margin: '40px auto', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#e1f5fe',
        color: '#0288d1',
        marginBottom: '20px',
        animation: 'pulse 2s infinite'
      }}>
        <Wind size={44} />
      </div>

      <span style={{ 
        background: '#e0f2fe', 
        color: '#0369a1', 
        fontWeight: 800, 
        padding: '4px 12px', 
        borderRadius: '999px',
        fontSize: '0.85rem'
      }}>
        O Tempo Passa no Vale
      </span>

      <h2 style={{ margin: '14px 0 10px', fontSize: '1.9rem', color: 'var(--text-main)' }}>
        As semanas passaram e o vento soprou...
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '520px', margin: '0 auto 24px', lineHeight: '1.6' }}>
        A primavera seguiu seu curso com flores e trabalho. Mas, no fim da estação, uma ventania inesperada passou pelo Vale e algumas telhas da Casa se soltaram!
      </p>

      <div style={{
        background: '#fff8e1',
        border: '2px solid #ffe082',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '14px',
        textAlign: 'left',
        margin: '0 auto 30px',
        maxWidth: '520px'
      }}>
        <CloudRain size={32} color="#f57f17" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ display: 'block', color: '#e65100', fontSize: '1.05rem' }}>
            Imprevisto da Natureza:
          </strong>
          <span style={{ fontSize: '0.95rem', color: '#4a5568' }}>
            O conserto imediato das telhas precisa de 3 sementes para a casa não molhar nas próximas chuvas.
          </span>
        </div>
      </div>

      <div>
        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onContinue();
          }}
          className="btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.2rem' }}
        >
          <span>Observar o que aconteceu com nossas escolhas</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};
