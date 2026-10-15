import React from 'react';
import { CheckCircle2, RotateCcw, ArrowRight, Sun, Shield, Flag } from 'lucide-react';
import { soundManager } from '../utils/audio';
import type { SeedAllocation } from '../types/game';

interface ConfirmationStageProps {
  allocation: SeedAllocation;
  onConfirm: () => void;
  onModify: () => void;
}

export const ConfirmationStage: React.FC<ConfirmationStageProps> = ({
  allocation,
  onConfirm,
  onModify
}) => {
  return (
    <div className="paper-card" style={{ maxWidth: '680px', margin: '30px auto', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: '#e8f5e9',
        color: '#2e7d32',
        marginBottom: '16px'
      }}>
        <CheckCircle2 size={36} />
      </div>

      <h2 style={{ margin: '0 0 10px', fontSize: '1.8rem', color: 'var(--text-main)' }}>
        Um resumo carinhoso da sua decisão
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: '0 0 24px' }}>
        Antes de o tempo passar, veja como você organizou seus recursos para esta estação:
      </p>

      <div style={{
        background: '#fcfaf5',
        border: '2px solid #e8dec8',
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'left',
        margin: '0 auto 28px',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sun size={20} color="#e65100" />
            <span style={{ fontWeight: 600 }}>Cuidar do presente (Agora):</span>
          </div>
          <strong style={{ fontSize: '1.2rem', color: '#e65100' }}>{allocation.now} sementes</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="#2e7d32" />
            <span style={{ fontWeight: 600 }}>Guardar no Silo (Proteção):</span>
          </div>
          <strong style={{ fontSize: '1.2rem', color: '#2e7d32' }}>{allocation.protection} sementes</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flag size={20} color="#1565c0" />
            <span style={{ fontWeight: 600 }}>Ponte do Vilarejo (Depois):</span>
          </div>
          <strong style={{ fontSize: '1.2rem', color: '#1565c0' }}>{allocation.future} sementes</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={onModify} className="btn-secondary">
          <RotateCcw size={18} />
          <span>Ajustar Sementes</span>
        </button>

        <button 
          onClick={() => {
            soundManager.playGentleBreeze();
            onConfirm();
          }} 
          className="btn-primary"
        >
          <span>Avançar Estação e Ver o que Acontece</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
