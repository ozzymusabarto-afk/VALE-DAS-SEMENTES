import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, AlertTriangle, Check, Volume2, HelpCircle, Droplets, Shield } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface BridgeInspectionSceneProps {
  guardianName: string;
  onProceedToDecision: () => void;
  onBackToMap: () => void;
}

interface DialogueItem {
  id: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
  icon: string;
}

const DIALOGUES: DialogueItem[] = [
  {
    id: 'rain',
    question: 'A chuva forte é uma certeza?',
    icon: '🌦️',
    shortAnswer: 'A natureza nunca avisa o dia exato!',
    fullAnswer: 'A natureza nunca dá certeza absoluta. Pode ser apenas uma garoa passageira, ou uma ventania com cheia do rio. Por isso quem guarda uma reserva no Silo não precisa tentar adivinhar o futuro: fica tranquilo de qualquer jeito!'
  },
  {
    id: 'cost',
    question: 'Quanto custa consertar a ponte?',
    icon: '🪵',
    shortAnswer: 'Com 3 a 4 sementes no Futuro reforçamos a estrutura.',
    fullAnswer: 'Com 3 a 4 sementes reservadas para o Depois, conseguimos vigas de carvalho firmes com o Mestre Tomás na Oficina. Se a ponte ruir de vez, custará mais que o dobro para reconstruir!'
  },
  {
    id: 'silo',
    question: 'Para que serve o Silo da Reserva nesta estação?',
    icon: '🌾',
    shortAnswer: 'O Silo é o nosso escudo de paz e autonomia.',
    fullAnswer: 'O Silo é a proteção do Vale. Se o vento soltar telhas da casa ou se a colheita atrasar, ter sementes no Silo nos dá tempo e calma para consertar as coisas sem precisar passar aperto ou tirar comida da mesa.'
  }
];

export const BridgeInspectionScene: React.FC<BridgeInspectionSceneProps> = ({
  guardianName,
  onProceedToDecision,
  onBackToMap
}) => {
  const [hasInspectedCrack, setHasInspectedCrack] = useState(false);
  const [hasCoveredSupplies, setHasCoveredSupplies] = useState(false);
  const [hasCheckedRiver, setHasCheckedRiver] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>('rain');

  const handleTouchCrack = () => {
    soundManager.playWoodCreak();
    setHasInspectedCrack(true);
  };

  const handleCoverBasket = () => {
    soundManager.playHammer();
    setHasCoveredSupplies(true);
  };

  const handleCheckRiver = () => {
    soundManager.playWaterSplash();
    setHasCheckedRiver(true);
  };

  const handleSelectQuestion = (id: string) => {
    soundManager.playPageFlip();
    setActiveQuestionId(id);
    const item = DIALOGUES.find(d => d.id === id);
    if (item) {
      speechHelper.speak(`Dona Clara explica: ${item.fullAnswer}`);
    }
  };

  const handleListenIntro = () => {
    speechHelper.speak(
      `Dona Clara diz: Olá, Guardião ${guardianName}! Veja a ponte da primavera. A água do rio está se movendo e a viga de madeira precisa de atenção. Toque nos elementos da cena para investigar e veja todas as respostas abaixo para planejar suas 12 sementes.`
    );
  };

  const totalCluesFound = (hasInspectedCrack ? 1 : 0) + (hasCoveredSupplies ? 1 : 0) + (hasCheckedRiver ? 1 : 0);

  return (
    <div className="interactive-scene-card">
      {/* Cabeçalho da Cena */}
      <div className="scene-top-bar">
        <button onClick={onBackToMap} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Voltar ao Mapa</span>
        </button>

        <span className="scene-badge">
          🔍 Investigação no Vale • A Ponte do Vilarejo na Primavera
        </span>

        <button onClick={handleListenIntro} className="btn-icon" title="Ouvir explicação da Guardiã Dona Clara">
          <Volume2 size={16} />
          <span>Ouvir Introdução</span>
        </button>
      </div>

      {/* Cenário Ilustrado Completo (sem cortes ou zoom distorcido) */}
      <div className="scene-stage-canvas" style={{ height: '420px', position: 'relative' }}>
        <img 
          src="/cena-ponte-primavera.webp" 
          alt="Pintura completa da Ponte do Vilarejo no Vale das Sementes durante a Primavera" 
          className="scene-full-artwork"
        />

        {/* Hotspot 1: Rachadura na Viga da Ponte */}
        <button
          onClick={handleTouchCrack}
          className={`bridge-hotspot crack-target ${hasInspectedCrack ? 'checked' : ''}`}
          title="Tocar na viga de madeira para examinar"
          style={{ top: '56%', left: '46%' }}
        >
          <div className="hotspot-pulse-circle">
            {hasInspectedCrack ? <Check size={18} color="#15803d" /> : <AlertTriangle size={18} color="#d97706" />}
          </div>
          <span className="hotspot-pill-tag">
            {hasInspectedCrack ? "✓ Viga estalou (precisa de reforço)" : "👆 Toque na madeira da ponte"}
          </span>
        </button>

        {/* Hotspot 2: Cesta de Mantimentos */}
        <button
          onClick={handleCoverBasket}
          className={`bridge-hotspot basket-target ${hasCoveredSupplies ? 'checked' : ''}`}
          title="Cobrir a cesta de suprimentos com lona"
          style={{ top: '78%', left: '22%' }}
        >
          <div className="hotspot-pulse-circle">
            {hasCoveredSupplies ? <Check size={18} color="#15803d" /> : <Shield size={18} color="#0369a1" />}
          </div>
          <span className="hotspot-pill-tag">
            {hasCoveredSupplies ? "✓ Mantimentos cobertos com lona!" : "👆 Proteger cesta de mantimentos"}
          </span>
        </button>

        {/* Hotspot 3: O Rio das Flores */}
        <button
          onClick={handleCheckRiver}
          className={`bridge-hotspot river-target ${hasCheckedRiver ? 'checked' : ''}`}
          title="Observar o fluxo do rio"
          style={{ top: '72%', left: '72%' }}
        >
          <div className="hotspot-pulse-circle">
            {hasCheckedRiver ? <Check size={18} color="#15803d" /> : <Droplets size={18} color="#0284c7" />}
          </div>
          <span className="hotspot-pill-tag">
            {hasCheckedRiver ? "✓ Rio calmo, mas com águas subindo" : "👆 Observar a correnteza do rio"}
          </span>
        </button>
      </div>

      {/* Painel de Descobertas: Mantém todas as observações visíveis lado a lado sem cobrir nada */}
      <div className="investigation-checklist-row">
        <div className={`clue-box ${hasInspectedCrack ? 'found' : ''}`}>
          <div className="clue-header">
            <span className="clue-num">{hasInspectedCrack ? '✓' : '1'}</span>
            <strong>Pilar de Madeira</strong>
          </div>
          <p className="clue-desc">
            {hasInspectedCrack 
              ? "A madeira emitiu um estalo. Se a chuva vier forte sem reforço, a travessia para o mercado pode fechar."
              : "Toque na madeira da ponte acima para sentir a firmeza da viga."}
          </p>
        </div>

        <div className={`clue-box ${hasCoveredSupplies ? 'found' : ''}`}>
          <div className="clue-header">
            <span className="clue-num">{hasCoveredSupplies ? '✓' : '2'}</span>
            <strong>Cesta de Alimentos</strong>
          </div>
          <p className="clue-desc">
            {hasCoveredSupplies 
              ? "Cesta protegida com lona! Os grãos da feira estarão secos caso chova repentinamente."
              : "Toque na cesta na margem para estender a lona protetora."}
          </p>
        </div>

        <div className={`clue-box ${hasCheckedRiver ? 'found' : ''}`}>
          <div className="clue-header">
            <span className="clue-num">{hasCheckedRiver ? '✓' : '3'}</span>
            <strong>Nível das Águas</strong>
          </div>
          <p className="clue-desc">
            {hasCheckedRiver 
              ? "O rio da montanha desce com volume constante. A primavera traz chuvas que fazem o leito subir."
              : "Toque no rio para verificar o fluxo e a força da correnteza."}
          </p>
        </div>
      </div>

      {/* Seção de Diálogo com Dona Clara: TODAS as 3 opções e respostas VISÍVEIS ao mesmo tempo */}
      <div className="character-dialogue-section">
        <div className="character-avatar-bubble">
          <span style={{ fontSize: '2.5rem' }}>🦉</span>
        </div>

        <div className="character-dialogue-body" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="character-name-tag">Dona Clara, Guardiã Anciã do Vale</div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              Você tem 12 sementes nesta rodada
            </span>
          </div>

          <p className="character-speech-text">
            "Olá, <strong>{guardianName}</strong>! Cuidar do Vale é como cuidar de um jardim: precisamos de equilíbrio entre o que comemos hoje, o que guardamos no Silo e o que consertamos para o amanhã. Veja todas as minhas orientações antes de decidir:"
          </p>

          {/* TODAS AS 3 RESPOSTAS VISÍVEIS EM CARDS SIMULTÂNEOS */}
          <div className="dialogue-cards-grid">
            {DIALOGUES.map((item) => {
              const isSelected = activeQuestionId === item.id;
              return (
                <div
                  key={item.id}
                  className={`dialogue-card-item ${isSelected ? 'highlighted' : ''}`}
                  onClick={() => handleSelectQuestion(item.id)}
                >
                  <div className="dialogue-card-top">
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <strong className="dialogue-card-q">{item.question}</strong>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speechHelper.speak(`Dona Clara explica: ${item.fullAnswer}`);
                      }}
                      className="btn-icon-subtle"
                      title="Ouvir esta resposta"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>

                  <div className="dialogue-card-summary">
                    💡 <em>{item.shortAnswer}</em>
                  </div>

                  <p className="dialogue-card-full">
                    {item.fullAnswer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de Ação Final */}
      <div className="scene-bottom-action">
        <div className="inspection-status-text">
          {totalCluesFound >= 2 ? (
            <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={20} />
              Excelente investigação! Você examinou a ponte e tem todas as informações de Dona Clara para decidir.
            </span>
          ) : (
            <span style={{ color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={18} />
              Dica: Você encontrou {totalCluesFound} de 3 pistas no cenário. Você já pode avançar ou tocar nas outras pistas!
            </span>
          )}
        </div>

        <button
          onClick={() => {
            soundManager.playMagicSparkle();
            onProceedToDecision();
          }}
          className="btn-hero-start"
          style={{ padding: '14px 32px', fontSize: '1.15rem' }}
        >
          <Sparkles size={20} />
          <span>Fazer Minha Previsão & Escolher Sementes</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
