import React from 'react';
import { Award, RotateCcw, Map, BookOpen, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StageCompletedScreenProps {
  guardianName: string;
  summaryText: string;
  onRestart: () => void;
  onExploreMap: () => void;
  onOpenJournal: () => void;
}

export const StageCompletedScreen: React.FC<StageCompletedScreenProps> = ({
  guardianName,
  summaryText,
  onRestart,
  onExploreMap,
  onOpenJournal
}) => {
  React.useEffect(() => {
    soundManager.playChime();
  }, []);

  return (
    <div className="paper-card" style={{ maxWidth: '750px', margin: '30px auto', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '76px',
        height: '76px',
        borderRadius: '50%',
        background: '#e8f5e9',
        color: '#2e7d32',
        marginBottom: '16px'
      }}>
        <Award size={44} />
      </div>

      <span style={{ 
        background: 'var(--color-nature-light)', 
        color: 'var(--color-nature-green)', 
        fontWeight: 800, 
        padding: '4px 14px', 
        borderRadius: '999px',
        fontSize: '0.85rem'
      }}>
        Ciclo Completo com Sucesso
      </span>

      <h2 style={{ margin: '14px 0 10px', fontSize: '2rem', color: 'var(--text-main)' }}>
        Parabéns pela jornada, {guardianName}!
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.6' }}>
        Você completou o primeiro ciclo no Vale das Sementes. Aqui nós não medimos o sucesso por quem tem mais sementes, mas pela capacidade de planejar, refletir e cuidar da vida com calma.
      </p>

      <div style={{
        background: '#fcf9f2',
        border: '2px solid #e8dec8',
        borderRadius: '16px',
        padding: '20px 24px',
        textAlign: 'left',
        margin: '0 auto 28px',
        maxWidth: '560px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b45309', fontWeight: 800, marginBottom: '8px' }}>
          <Sparkles size={20} />
          <span>Sua Descoberta Fundamental:</span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '1.05rem', color: '#451a03', fontStyle: 'italic', lineHeight: '1.5' }}>
          "Você observou uma surpresa da natureza, cuidou do presente, pensou no futuro e descobriu como uma reserva pode ampliar suas escolhas sem medo de errar."
        </p>
        <div style={{ fontSize: '0.9rem', color: '#78350f' }}>
          {summaryText}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
        <button onClick={onOpenJournal} className="btn-secondary">
          <BookOpen size={18} />
          <span>Rever Diário de Bordo</span>
        </button>

        <button onClick={onExploreMap} className="btn-secondary">
          <Map size={18} />
          <span>Explorar o Mapa</span>
        </button>

        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onRestart();
          }} 
          className="btn-primary"
        >
          <RotateCcw size={18} />
          <span>Jogar Nova Rodada</span>
        </button>
      </div>
    </div>
  );
};
