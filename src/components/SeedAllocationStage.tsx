import React, { useState } from 'react';
import { Plus, Minus, ArrowRight, ArrowLeft, Shield, Sun, Flag, Volume2, RefreshCw } from 'lucide-react';
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
  const [allocation, setAllocation] = useState<SeedAllocation>(initialAllocation);
  const [selectedSeedIndex, setSelectedSeedIndex] = useState<number | null>(null);

  const usedSeeds = allocation.now + allocation.protection + allocation.future;
  const remainingSeeds = Math.max(0, totalSeeds - usedSeeds);

  const handleAdjust = (category: keyof SeedAllocation, delta: number) => {
    if (delta > 0 && remainingSeeds <= 0) return;
    if (delta < 0 && allocation[category] <= 0) return;

    const newCount = allocation[category] + delta;
    soundManager.playSeedDrop(newCount);
    setAllocation(prev => ({
      ...prev,
      [category]: Math.max(0, newCount)
    }));
    setSelectedSeedIndex(null);
  };

  const handleDepositTo = (category: keyof SeedAllocation) => {
    if (remainingSeeds > 0) {
      handleAdjust(category, 1);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'seed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnBasket = (e: React.DragEvent, category: keyof SeedAllocation) => {
    e.preventDefault();
    if (remainingSeeds > 0) {
      handleAdjust(category, 1);
    }
  };

  const handleReset = () => {
    soundManager.playPageFlip();
    setAllocation({ now: 0, protection: 0, future: 0 });
    setSelectedSeedIndex(null);
  };

  const handleHearInstructions = () => {
    speechHelper.speak(
      `Você tem ${totalSeeds} sementes douradas para distribuir. Arraste ou toque nas sementes para colocar nas três cestas: Agora para viver o presente, Proteção no Silo para os imprevistos, e Depois para plantar um plano de futuro.`
    );
  };

  const getBasketStateClass = (count: number) => {
    if (count === 0) return 'seed-basket--empty';
    if (count <= 3) return 'seed-basket--starter';
    if (count <= 7) return 'seed-basket--growing';
    return 'seed-basket--full';
  };

  const canProceed = remainingSeeds === 0;

  return (
    <div className="paper-card seed-allocation-board" style={{ maxWidth: '940px', margin: '20px auto' }}>
      {/* Topo com Etapa e Acessibilidade */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ 
          background: 'var(--color-nature-light)', 
          color: 'var(--color-nature-green)', 
          fontWeight: 800, 
          padding: '6px 16px', 
          borderRadius: '999px',
          fontSize: '0.88rem'
        }}>
          Passo 2 de 4 • A Mesa das Três Cestas de Vime
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            title="Recomeçar distribuição"
          >
            <RefreshCw size={14} />
            <span>Recomeçar</span>
          </button>

          <button 
            onClick={handleHearInstructions}
            className="btn-icon"
            title="Ouvir instruções por voz"
          >
            <Volume2 size={16} />
            <span>Ouvir</span>
          </button>
        </div>
      </div>

      {/* Título Pedagógico */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <h2 style={{ margin: '0 0 6px', fontSize: '1.85rem', color: 'var(--text-main)' }}>
          Como você quer organizar suas 12 sementes?
        </h2>
        <p style={{ margin: '0', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Toque ou arraste as sementes da bandeja para as cestas de vime.
        </p>

        {/* Bandeja de Sementes na Mão */}
        <div className="seed-tray-container">
          <div className="seed-tray-header">
            <span style={{ fontWeight: 800, color: '#6f4b31', fontSize: '0.95rem' }}>
              🧺 Sua Bandeja de Sementes: {remainingSeeds} semente{remainingSeeds === 1 ? '' : 's'} livre{remainingSeeds === 1 ? '' : 's'}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#8c6b4f' }}>
              {remainingSeeds > 0 ? '👆 Toque em uma cesta abaixo para depositar' : '✓ Todas as 12 sementes foram acolhidas!'}
            </span>
          </div>

          <div className="seed-tray-tokens">
            {Array.from({ length: totalSeeds }).map((_, idx) => {
              const isUsed = idx >= remainingSeeds;
              const isSelected = selectedSeedIndex === idx;
              return (
                <div
                  key={idx}
                  draggable={!isUsed}
                  onDragStart={handleDragStart}
                  onClick={() => !isUsed && setSelectedSeedIndex(idx)}
                  className={`seed-token-item ${isUsed ? 'used' : ''} ${isSelected ? 'selected' : ''}`}
                  title={isUsed ? 'Semente já alocada em uma cesta' : 'Semente disponível (arraste ou clique)'}
                >
                  <span className="seed-graphic" aria-hidden="true" />
                  <span className="seed-num">{idx + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AS TRÊS CESTAS DE VIME GRANDES */}
      <div className="wicker-baskets-row">
        {/* CESTA 1: AGORA */}
        <div 
          className={`wicker-basket-card basket-now ${getBasketStateClass(allocation.now)}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBasket(e, 'now')}
          onClick={() => handleDepositTo('now')}
        >
          <div className="basket-cloth-ribbon now-ribbon">
            <Sun size={18} />
            <span>Viver o Presente</span>
          </div>

          <div className="basket-visual-scene">
            <img 
              src="/cena-casa-fazenda.webp" 
              alt="Casa e família"
              onError={(e) => { (e.target as HTMLImageElement).src = '/mapa-vale-vivo.webp'; }}
              className="basket-mini-preview"
            />
            <div className="basket-wicker-weave">
              <span className="basket-tagline">Alimento, calor e bem-estar hoje</span>
            </div>
          </div>

          <div className="basket-body">
            <h3 className="basket-name">Agora</h3>
            <span className="basket-subtitle">Casa & Festa das Flores</span>

            {/* Conteúdo visual das sementes depositadas */}
            <div className="basket-interior-reservoir">
              <div className="basket-seeds-pile">
                {Array.from({ length: allocation.now }).map((_, i) => (
                  <span key={i} className="pile-seed" title="Semente no Agora" aria-label="Semente no Agora" />
                ))}
                {allocation.now === 0 && (
                  <span className="basket-empty-hint">Cesta vazia (toque para adicionar)</span>
                )}
              </div>
            </div>

            <div className="basket-counter-display">
              <span className="counter-val" style={{ color: '#c2410c' }}>{allocation.now}</span>
              <span className="counter-label">sementes</span>
            </div>

            <div className="basket-controls" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleAdjust('now', -1)}
                disabled={allocation.now <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente do Agora"
                title="Retirar 1 semente para a bandeja"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('now', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente ao Agora"
                title="Adicionar 1 semente a esta cesta"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CESTA 2: PROTEÇÃO */}
        <div 
          className={`wicker-basket-card basket-protection ${getBasketStateClass(allocation.protection)}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBasket(e, 'protection')}
          onClick={() => handleDepositTo('protection')}
        >
          <div className="basket-cloth-ribbon protection-ribbon">
            <Shield size={18} />
            <span>Cuidar dos Imprevistos</span>
          </div>

          <div className="basket-visual-scene">
            <img 
              src="/cena-silo-reserva.webp" 
              alt="O Silo da Reserva"
              className="basket-mini-preview"
            />
            <div className="basket-wicker-weave">
              <span className="basket-tagline">O Silo que protege contra tempestades</span>
            </div>
          </div>

          <div className="basket-body">
            <h3 className="basket-name">Proteção</h3>
            <span className="basket-subtitle">O Silo da Reserva</span>

            {/* Conteúdo visual das sementes depositadas */}
            <div className="basket-interior-reservoir">
              <div className="basket-seeds-pile">
                {Array.from({ length: allocation.protection }).map((_, i) => (
                  <span key={i} className="pile-seed protection-seed" title="Semente no Silo" aria-label="Semente no Silo" />
                ))}
                {allocation.protection === 0 && (
                  <span className="basket-empty-hint">Silo vazio (toque para reservar)</span>
                )}
              </div>
            </div>

            <div className="basket-counter-display">
              <span className="counter-val" style={{ color: '#15803d' }}>{allocation.protection}</span>
              <span className="counter-label">sementes</span>
            </div>

            <div className="basket-controls" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleAdjust('protection', -1)}
                disabled={allocation.protection <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente da Proteção"
                title="Retirar 1 semente para a bandeja"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('protection', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente à Proteção"
                title="Adicionar 1 semente a esta cesta"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CESTA 3: DEPOIS */}
        <div 
          className={`wicker-basket-card basket-future ${getBasketStateClass(allocation.future)}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDropOnBasket(e, 'future')}
          onClick={() => handleDepositTo('future')}
        >
          <div className="basket-cloth-ribbon future-ribbon">
            <Flag size={18} />
            <span>Plantar um Plano</span>
          </div>

          <div className="basket-visual-scene">
            <img 
              src="/cena-bosque-montanhas.webp" 
              alt="Bosque e montanhas, representando planos de futuro"
              className="basket-mini-preview"
            />
            <div className="basket-wicker-weave">
              <span className="basket-tagline">Projetos de longo prazo e pequenos passos</span>
            </div>
          </div>

          <div className="basket-body">
            <h3 className="basket-name">Depois</h3>
            <span className="basket-subtitle">Metas & O Futuro do Vale</span>

            {/* Conteúdo visual das sementes depositadas */}
            <div className="basket-interior-reservoir">
              <div className="basket-seeds-pile">
                {Array.from({ length: allocation.future }).map((_, i) => (
                  <span key={i} className="pile-seed future-seed" title="Semente no Depois" aria-label="Semente no Depois" />
                ))}
                {allocation.future === 0 && (
                  <span className="basket-empty-hint">Cesta vazia (toque para planejar)</span>
                )}
              </div>
            </div>

            <div className="basket-counter-display">
              <span className="counter-val" style={{ color: '#1d4ed8' }}>{allocation.future}</span>
              <span className="counter-label">sementes</span>
            </div>

            <div className="basket-controls" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => handleAdjust('future', -1)}
                disabled={allocation.future <= 0}
                className="btn-basket-adjust"
                aria-label="Diminuir 1 semente do Depois"
                title="Retirar 1 semente para a bandeja"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={() => handleAdjust('future', 1)}
                disabled={remainingSeeds <= 0}
                className="btn-basket-adjust"
                aria-label="Adicionar 1 semente ao Depois"
                title="Adicionar 1 semente a esta cesta"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo e Ação de Avançar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '28px',
        borderTop: '2px dashed #ded3be',
        paddingTop: '20px',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onBack();
          }}
          className="btn-secondary"
        >
          <ArrowLeft size={18} />
          <span>Voltar à Previsão</span>
        </button>

        <div style={{ textAlign: 'right' }}>
          {!canProceed && (
            <span style={{ fontSize: '0.92rem', color: '#b45309', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              ⚠️ Distribua as {remainingSeeds} semente{remainingSeeds === 1 ? '' : 's'} restantes para continuar.
            </span>
          )}

          <button 
            onClick={() => {
              soundManager.playMagicSparkle();
              onConfirmAllocation(allocation);
            }}
            disabled={!canProceed}
            className="btn-primary"
            style={{ padding: '14px 34px', fontSize: '1.15rem' }}
          >
            <span>Ver a Virada da Estação</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
