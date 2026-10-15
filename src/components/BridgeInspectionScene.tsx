import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, AlertTriangle, Check, Volume2, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface BridgeInspectionSceneProps {
  guardianName: string;
  onProceedToDecision: () => void;
  onBackToMap: () => void;
}

export const BridgeInspectionScene: React.FC<BridgeInspectionSceneProps> = ({
  guardianName,
  onProceedToDecision,
  onBackToMap
}) => {
  const [hasInspectedCrack, setHasInspectedCrack] = useState(false);
  const [hasCoveredSupplies, setHasCoveredSupplies] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleTouchCrack = () => {
    soundManager.playWoodCreak();
    setHasInspectedCrack(true);
  };

  const handleCoverBasket = () => {
    soundManager.playHammer();
    setHasCoveredSupplies(true);
  };

  const handleAsk = (q: string) => {
    soundManager.playPageFlip();
    setSelectedQuestion(q);
  };

  const handleListenSpeech = () => {
    speechHelper.speak(
      `Dona Clara diz: Olá, ${guardianName}! A ponte ainda aguenta a travessia, mas a água do rio está subindo e o pilar de madeira precisa de reforço antes das chuvas fortes. Toque na ponte para ver a rachadura e decida com calma.`
    );
  };

  return (
    <div className="interactive-scene-card">
      {/* Cabeçalho da Cena */}
      <div className="scene-top-bar">
        <button onClick={onBackToMap} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Voltar ao Mapa</span>
        </button>

        <span className="scene-badge">
          🔍 Investigação no Vale • A Ponte do Vilarejo
        </span>

        <button onClick={handleListenSpeech} className="btn-icon" title="Ouvir Dona Clara">
          <Volume2 size={16} />
          <span>Ouvir</span>
        </button>
      </div>

      {/* Cenário Interativo da Ponte */}
      <div className="scene-stage-canvas">
        <img 
          src="/concept_vale_das_sementes.jpg" 
          alt="Cena da Ponte de Pedra e Madeira" 
          className="scene-background-zoom"
          style={{
            transform: 'scale(1.8) translate(-18%, -10%)',
            filter: 'contrast(1.05)'
          }}
        />

        {/* Hotspot da Rachadura na Ponte */}
        <button
          onClick={handleTouchCrack}
          className={`crack-interactive-target ${hasInspectedCrack ? 'discovered' : ''}`}
          title="Tocar para inspecionar a madeira"
          aria-label="Inspecionar rachadura na ponte"
        >
          <div className="crack-pulse-icon">
            {hasInspectedCrack ? <Check size={20} color="#2e7d32" /> : <AlertTriangle size={22} color="#e65100" />}
          </div>
          <span className="crack-label">
            {hasInspectedCrack ? "✓ Rachadura Encontrada!" : "👆 Toque na madeira!"}
          </span>
        </button>

        {/* Ação de cuidado: Proteger a cesta de mantimentos */}
        <button
          onClick={handleCoverBasket}
          className={`supplies-target ${hasCoveredSupplies ? 'protected' : ''}`}
          title="Cobrir alimentos contra a chuva"
        >
          <span style={{ fontSize: '1.4rem' }}>{hasCoveredSupplies ? '🛡️' : '🧺'}</span>
          <span className="supplies-label">
            {hasCoveredSupplies ? 'Comida protegida com lona!' : 'Proteger mantimentos'}
          </span>
        </button>

        {/* Feedback visual após tocar na rachadura */}
        {hasInspectedCrack && (
          <div className="crack-discovery-bubble">
            <AlertTriangle size={24} color="#d97706" style={{ flexShrink: 0 }} />
            <div>
              <strong>Atenção do Guardião:</strong> A madeira estalou! As vigas de apoio estão frouxas. Se a chuva vier forte sem reforço, a travessia para o mercado pode fechar.
            </div>
          </div>
        )}
      </div>

      {/* Diálogo Vivo com Dona Clara (A Coruja Jardineira) */}
      <div className="character-dialogue-section">
        <div className="character-avatar-bubble">
          <span style={{ fontSize: '2.5rem' }}>🦉</span>
        </div>

        <div className="character-dialogue-body">
          <div className="character-name-tag">Dona Clara, a Guardiã do Vale</div>
          <p className="character-speech-text">
            "Olá, <strong>{guardianName}</strong>! O tempo está mudando. A ponte ainda aguenta nossos passos, mas as chuvas da virada de estação costumam ser imprevisíveis. Nós temos <strong>12 sementes</strong> para esta primavera. Faça suas perguntas antes de decidirmos!"
          </p>

          {/* Perguntas interativas que a criança pode fazer */}
          <div className="interactive-questions-row">
            <button
              onClick={() => handleAsk('rain')}
              className={`btn-dialog-question ${selectedQuestion === 'rain' ? 'active' : ''}`}
            >
              <HelpCircle size={16} />
              <span>A chuva é certeza?</span>
            </button>

            <button
              onClick={() => handleAsk('cost')}
              className={`btn-dialog-question ${selectedQuestion === 'cost' ? 'active' : ''}`}
            >
              <HelpCircle size={16} />
              <span>Quanto custa consertar?</span>
            </button>

            <button
              onClick={() => handleAsk('silo')}
              className={`btn-dialog-question ${selectedQuestion === 'silo' ? 'active' : ''}`}
            >
              <HelpCircle size={16} />
              <span>Para que serve o Silo agora?</span>
            </button>
          </div>

          {/* Resposta de Dona Clara */}
          {selectedQuestion === 'rain' && (
            <div className="character-answer-box">
              🌦️ <strong>Dona Clara explica:</strong> "A natureza nunca dá certeza absoluta. Pode ser só uma garoa, ou pode ser uma ventania forte. Por isso quem guarda uma reserva no Silo não precisa tentar adivinhar o futuro: fica tranquilo de qualquer jeito!"
            </div>
          )}

          {selectedQuestion === 'cost' && (
            <div className="character-answer-box">
              🪵 <strong>Dona Clara explica:</strong> "Com 3 a 4 sementes reservadas para o <em>Depois</em>, conseguimos comprar vigas de carvalho firmes com o Mestre Tomás na Oficina."
            </div>
          )}

          {selectedQuestion === 'silo' && (
            <div className="character-answer-box">
              🌾 <strong>Dona Clara explica:</strong> "O Silo é o nosso escudo. Se uma telha voar ou a horta for castigada pela ventania, ter sementes no Silo nos dá calma para consertar sem precisar tirar comida da mesa."
            </div>
          )}
        </div>
      </div>

      {/* Barra de Ação Final para Tomar Decisão */}
      <div className="scene-bottom-action">
        <div className="inspection-status-text">
          {hasInspectedCrack ? (
            <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={18} />
              Você investigou a ponte e entendeu o desafio com suas próprias mãos!
            </span>
          ) : (
            <span style={{ color: '#b45309', fontWeight: 600 }}>
              💡 Dica: Toque no símbolo piscando na madeira acima para inspecionar a rachadura antes de continuar!
            </span>
          )}
        </div>

        <button
          onClick={() => {
            soundManager.playMagicSparkle();
            onProceedToDecision();
          }}
          className="btn-hero-start"
          style={{ padding: '14px 30px', fontSize: '1.15rem' }}
        >
          <Sparkles size={20} />
          <span>Fazer Minha Previsão & Escolher Sementes</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
