import React from 'react';
import { Plus, Minus, ArrowRight, ArrowLeft, Shield, Sun, Flag, Volume2, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';
import type { SeedAllocation } from '../types/game';

interface SeedAllocationStageProps {
  totalSeeds: number;
  initialAllocation: SeedAllocation;
  onConfirmAllocation: (allocation: SeedAllocation) => void;
  onBack: () => void;
}

export const SeedAllocationStage: React.FC<SeedAllocationStageProps> = ({
  totalSeeds,
  initialAllocation,
  onConfirmAllocation,
  onBack
}) => {
  const [allocation, setAllocation] = React.useState<SeedAllocation>(initialAllocation);

  const usedSeeds = allocation.now + allocation.protection + allocation.future;
  const remainingSeeds = totalSeeds - usedSeeds;

  const handleAdjust = (category: keyof SeedAllocation, delta: number) => {
    if (delta > 0 && remainingSeeds <= 0) return;
    if (delta < 0 && allocation[category] <= 0) return;

    soundManager.playSeedDrop(allocation[category] + delta);
    setAllocation(prev => ({
      ...prev,
      [category]: Math.max(0, prev[category] + delta)
    }));
  };

  const handleHearInstructions = () => {
    speechHelper.speak(
      `Você tem ${totalSeeds} sementes. Distribua entre Agora para as necessidades da casa e festa, Proteção no Silo para imprevistos, e Depois para o conserto da ponte.`
    );
  };

  const renderVisualSeeds = (count: number) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', minHeight: '34px', margin: '8px 0' }}>
        {Array.from({ length: count }).map((_, i) => (
          <span key={i} className="seed-token" title="1 semente"></span>
        ))}
      </div>
    );
  };

  const canProceed = remainingSeeds === 0;

  return (
    <div className="paper-card" style={{ maxWidth: '850px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          background: 'var(--color-nature-light)', 
          color: 'var(--color-nature-green)', 
          fontWeight: 800, 
          padding: '4px 12px', 
          borderRadius: '999px',
          fontSize: '0.85rem'
        }}>
          Passo 2 de 4 • Distribuição das Sementes
        </span>

        <button 
          onClick={handleHearInstructions}
          className="btn-icon"
          title="Ouvir instruções"
        >
          <Volume2 size={16} />
          <span>Ouvir</span>
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.75rem', color: 'var(--text-main)' }}>
          Como você quer organizar suas 12 sementes?
        </h2>
        <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Divida seus recursos entre o que precisa agora, o que guarda para proteção e o que reserva para o futuro.
        </p>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: remainingSeeds === 0 ? '#e8f5e9' : '#fff3e0',
          border: `2px solid ${remainingSeeds === 0 ? '#81c784' : '#ffb74d'}`,
          borderRadius: '999px',
          padding: '8px 24px',
          marginTop: '16px',
          fontWeight: 800,
          fontSize: '1.15rem'
        }}>
          <Sparkles size={20} color={remainingSeeds === 0 ? '#2e7d32' : '#e65100'} />
          <span>
            {remainingSeeds > 0
              ? `Você ainda tem ${remainingSeeds} semente${remainingSeeds > 1 ? 's' : ''} na mão`
              : 'Todas as 12 sementes foram distribuídas!'}
          </span>
        </div>
      </div>

      <div className="allocation-baskets">
        {/* Cesto Agora */}
        <div className="basket-card now">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#e65100', fontWeight: 800 }}>
              <Sun size={22} />
              <span style={{ fontSize: '1.2rem' }}>Agora</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
              Comida em Casa & Festa das Flores
            </div>
          </div>

          <div>
            <div className="basket-count" style={{ color: '#e65100' }}>
              {allocation.now}
            </div>
            {renderVisualSeeds(allocation.now)}
          </div>

          <div>
            <div className="basket-controls">
              <button 
                onClick={() => handleAdjust('now', -1)}
                disabled={allocation.now <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente do Agora"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('now', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente ao Agora"
              >
                <Plus size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '8px' }}>
              Bem-estar e compromissos presentes
            </div>
          </div>
        </div>

        {/* Cesto Proteção (O Silo) */}
        <div className="basket-card protection">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#2e7d32', fontWeight: 800 }}>
              <Shield size={22} />
              <span style={{ fontSize: '1.2rem' }}>Proteção</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
              O Silo da Fazenda (Imprevistos)
            </div>
          </div>

          <div>
            <div className="basket-count" style={{ color: '#2e7d32' }}>
              {allocation.protection}
            </div>
            {renderVisualSeeds(allocation.protection)}
          </div>

          <div>
            <div className="basket-controls">
              <button 
                onClick={() => handleAdjust('protection', -1)}
                disabled={allocation.protection <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente da Proteção"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('protection', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente à Proteção"
              >
                <Plus size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '8px' }}>
              Reserva para tempestades e acasos
            </div>
          </div>
        </div>

        {/* Cesto Depois (Metas) */}
        <div className="basket-card future">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#1565c0', fontWeight: 800 }}>
              <Flag size={22} />
              <span style={{ fontSize: '1.2rem' }}>Depois</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
              Conserto da Ponte Comunitária
            </div>
          </div>

          <div>
            <div className="basket-count" style={{ color: '#1565c0' }}>
              {allocation.future}
            </div>
            {renderVisualSeeds(allocation.future)}
          </div>

          <div>
            <div className="basket-controls">
              <button 
                onClick={() => handleAdjust('future', -1)}
                disabled={allocation.future <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente do Futuro"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('future', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente ao Futuro"
              >
                <Plus size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '8px' }}>
              Objetivo de longo prazo do Vale
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '24px', 
        borderTop: '2px dashed #e5dcce', 
        paddingTop: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={18} />
          <span>Voltar à Previsão</span>
        </button>

        <button 
          onClick={() => {
            soundManager.playChime();
            onConfirmAllocation(allocation);
          }} 
          disabled={!canProceed}
          className="btn-primary"
          style={{ opacity: canProceed ? 1 : 0.5, cursor: canProceed ? 'pointer' : 'not-allowed' }}
        >
          <span>Revisar e Confirmar Escolha</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
