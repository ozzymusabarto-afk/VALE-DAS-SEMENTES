import React from 'react';
import { ArrowRight, BookOpen, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface NarrativeCardModalProps {
  guardianName: string;
  onProceedToPrediction: () => void;
  onClose: () => void;
}

export const NarrativeCardModal: React.FC<NarrativeCardModalProps> = ({
  guardianName,
  onProceedToPrediction,
  onClose
}) => {
  const storyText = `Olá, ${guardianName}! A primavera chegou ao Vale das Sementes. A velha ponte de madeira que liga nossas casas ao Mercado precisa de reforço antes da temporada de tempestades. Ao mesmo tempo, teremos a comemoração da estação na Praça e precisamos manter a comida da casa em ordem. Você recebeu 12 sementes para esta estação. Antes de distribuir seus recursos, vamos reservar um instante para pensar no que pode acontecer.`;

  const handleListen = () => {
    speechHelper.speak(storyText);
  };

  return (
    <div className="paper-card" style={{ maxWidth: '750px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          background: 'var(--color-nature-light)', 
          color: 'var(--color-nature-green)', 
          fontWeight: 800, 
          padding: '4px 12px', 
          borderRadius: '999px',
          fontSize: '0.85rem'
        }}>
          Capítulo 1 • Carta Narrativa da Estação
        </span>
        <button 
          onClick={handleListen}
          className="btn-icon"
          title="Ouvir Dona Clara lendo esta carta"
        >
          <Volume2 size={16} />
          <span>Ouvir</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '20px',
          background: '#fef3c7',
          border: '3px solid #fde68a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          flexShrink: 0
        }}>
          🦉
        </div>

        <div style={{ flex: 1, minWidth: '260px' }}>
          <h2 style={{ margin: '0 0 8px', color: 'var(--text-main)', fontSize: '1.6rem' }}>
            A Ponte de Madeira e a Festa das Flores
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--color-nature-green)', fontWeight: 700, marginBottom: '12px' }}>
            Dona Clara, a Guardiã Jardineira
          </div>
          <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#374151', margin: '0 0 16px' }}>
            "Olá, <strong>{guardianName}</strong>! A primavera chegou ao Vale. A ponte de madeira que liga nossas propriedades ao Mercado precisa de reforço nas vigas antes das tempestades da virada de estação. Ao mesmo tempo, teremos a festa na Praça da Comunidade e precisamos cuidar das nossas necessidades em Casa."
          </p>
          <div className="callout-gentle" style={{ margin: '14px 0' }}>
            <strong>Recursos da Rodada:</strong> Você recebeu exatamente <strong>12 sementes</strong>. Lembre-se: não dá para fazer tudo ao mesmo tempo, mas cada escolha traz um aprendizado valioso.
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '28px', 
        borderTop: '2px dashed #e5dcce', 
        paddingTop: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button onClick={onClose} className="btn-secondary">
          Voltar ao Mapa
        </button>

        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onProceedToPrediction();
          }} 
          className="btn-primary"
        >
          <BookOpen size={20} />
          <span>Passo 1: Fazer Minha Previsão</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
