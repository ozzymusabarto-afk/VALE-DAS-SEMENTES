import React from 'react';
import { HelpCircle, ArrowRight, ArrowLeft, Check, Volume2 } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface PredictionStageProps {
  onConfirmPrediction: (selectedCards: string[], customText: string) => void;
  onBack: () => void;
}

const PREDICTION_CARDS = [
  {
    id: 'silo_care',
    icon: '🛡️',
    text: 'Acho que posso precisar de sementes no Silo se o tempo mudar ou algo quebrar.'
  },
  {
    id: 'now_care',
    icon: '🍎',
    text: 'Quero garantir que a nossa casa e a festa na praça tenham tudo o que precisamos agora.'
  },
  {
    id: 'bridge_care',
    icon: '🌉',
    text: 'A ponte é o mais importante para o futuro do vilarejo continuar conectado.'
  },
  {
    id: 'not_sure',
    icon: '🌱',
    text: 'Ainda não tenho certeza, quero colocar um pouquinho em cada lugar para ver o que acontece.'
  }
];

export const PredictionStage: React.FC<PredictionStageProps> = ({
  onConfirmPrediction,
  onBack
}) => {
  const [selected, setSelected] = React.useState<string[]>(['silo_care']);
  const [customText, setCustomText] = React.useState('');

  const toggleCard = (id: string) => {
    soundManager.playPageFlip();
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleHearInstructions = () => {
    speechHelper.speak(
      "Hora da previsão! Antes de gastar ou guardar suas sementes, o que você acha que pode acontecer nesta estação? Escolha um ou mais cartões, ou escreva com suas próprias palavras no Diário."
    );
  };

  const handleProceed = () => {
    soundManager.playChime();
    onConfirmPrediction(selected, customText);
  };

  return (
    <div className="paper-card" style={{ maxWidth: '780px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          background: '#fff3e0', 
          color: '#e65100', 
          fontWeight: 800, 
          padding: '4px 12px', 
          borderRadius: '999px',
          fontSize: '0.85rem'
        }}>
          Passo 1 de 4 • Pausa de Reflexão & Previsão
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

      <h2 style={{ margin: '0 0 10px', fontSize: '1.7rem', color: 'var(--text-main)' }}>
        O que você prevê para esta estação?
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 20px', lineHeight: '1.5' }}>
        Antes de mexer nas sementes, reserve um momento para imaginar. Não existe resposta certa ou errada — prever ajuda a nossa mente a se preparar para o futuro!
      </p>

      <div style={{ fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HelpCircle size={18} color="var(--color-nature-green)" />
        <span>Escolha as ideias que mais combinam com o que você está pensando:</span>
      </div>

      <div className="prediction-cards">
        {PREDICTION_CARDS.map(card => {
          const isChecked = selected.includes(card.id);
          return (
            <button
              key={card.id}
              onClick={() => toggleCard(card.id)}
              className={`prediction-option ${isChecked ? 'selected' : ''}`}
              role="checkbox"
              aria-checked={isChecked}
            >
              <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{card.icon}</span>
              <span style={{ flex: 1, fontSize: '0.95rem', lineHeight: '1.4' }}>{card.text}</span>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '6px',
                border: '2px solid',
                borderColor: isChecked ? 'var(--color-nature-green)' : '#cbd5e1',
                background: isChecked ? 'var(--color-nature-green)' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0
              }}>
                {isChecked && <Check size={14} />}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="custom-prediction" style={{ display: 'block', fontWeight: 700, marginBottom: '8px', fontSize: '1rem' }}>
          Quer escrever ou completar com sua própria ideia? (opcional)
        </label>
        <input
          id="custom-prediction"
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Exemplo: Acho que se eu guardar 4 sementes no Silo, vou ficar mais tranquilo se chover..."
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px solid #dfd5c2',
            fontSize: '1rem',
            fontFamily: 'inherit',
            background: '#faf8f3'
          }}
        />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '30px', 
        borderTop: '2px dashed #e5dcce', 
        paddingTop: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft size={18} />
          <span>Voltar à Carta</span>
        </button>

        <button onClick={handleProceed} className="btn-primary">
          <span>Avançar: Distribuir Minhas Sementes</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
