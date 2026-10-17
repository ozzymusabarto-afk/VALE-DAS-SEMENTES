import React from 'react';
import { HelpCircle, ArrowRight, ArrowLeft, Check, Volume2 } from 'lucide-react';
import type { LocationId } from '../types/game';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface PredictionStageProps {
  locationId?: LocationId;
  onConfirmPrediction: (selectedCards: string[], customText: string) => void;
  onBack: () => void;
}

interface LocationPredictionConfig {
  locationTitle: string;
  themeTitle: string;
  subtitle: string;
  audioSpeech: string;
  cards: Array<{ id: string; icon: string; text: string }>;
  defaultCardId: string;
}

const LOCATION_PREDICTIONS: Record<LocationId, LocationPredictionConfig> = {
  market: {
    locationTitle: 'O Mercado da Raposa',
    themeTitle: 'O que você prevê no Mercado da Raposa?',
    subtitle: 'A Raposa tem bancas cheias de frutas e doces tentadores. Antes de mexer nas sementes, pense no que realmente vale a pena!',
    audioSpeech: 'Hora da previsão no Mercado da Raposa! Antes de gastar ou guardar suas sementes na feira, o que você acha mais sábio fazer? Escolha as ideias que combinam com seu plano!',
    defaultCardId: 'market_compare',
    cards: [
      {
        id: 'market_food',
        icon: '🍎',
        text: 'Quero comprar frutas frescas e alimentos essenciais para a despensa da nossa casa.'
      },
      {
        id: 'market_compare',
        icon: '🧺',
        text: 'Quero pesquisar e comparar as cestas com calma para não gastar sementes por impulso.'
      },
      {
        id: 'market_reserve',
        icon: '🛡️',
        text: 'Vou guardar sementes de reserva no Silo caso os preços subam na próxima feira.'
      },
      {
        id: 'market_treat',
        icon: '🍯',
        text: 'Quero separar uma pequena parte para uma fruta doce especial com moderação.'
      }
    ]
  },
  workshop: {
    locationTitle: 'A Oficina de Ferramentas',
    themeTitle: 'O que você prevê na Oficina de Ferramentas?',
    subtitle: 'Mestre Tomás ensinou que ferramentas afiadas e bem cuidadas hoje evitam quebras caras no meio da colheita.',
    audioSpeech: 'Hora da previsão na Oficina de Ferramentas! Como você planeja cuidar das ferramentas da fazenda para não passar apuros?',
    defaultCardId: 'tool_repair',
    cards: [
      {
        id: 'tool_repair',
        icon: '🔨',
        text: 'Quero consertar e afiar as enxadas velhas antes que quebrem de vez no plantio.'
      },
      {
        id: 'tool_reserve',
        icon: '🛡️',
        text: 'Vou guardar sementes no Silo para peças de reposição se algo emperrar de repente.'
      },
      {
        id: 'tool_future',
        icon: '⚙️',
        text: 'Quero encomendar cabos de madeira reforçados para o trabalho dos próximos anos.'
      },
      {
        id: 'tool_balance',
        icon: '🌱',
        text: 'Vou separar com calma: cuidar do trabalho de hoje sem esquecer da segurança de amanhã.'
      }
    ]
  },
  house: {
    locationTitle: 'A Casa da Fazenda',
    themeTitle: 'O que você prevê para o Bem-Estar da Casa?',
    subtitle: 'A casa é o refúgio da família. Cuidar do alimento diário e da dignidade da rotina é a própria razão pela qual trabalhamos.',
    audioSpeech: 'Hora da previsão na Casa da Fazenda! O que suas sementes devem garantir para trazer paz e saúde à sua família?',
    defaultCardId: 'house_now',
    cards: [
      {
        id: 'house_now',
        icon: '🍞',
        text: 'Garantir alimento saudável, pão fresco e conforto para o dia a dia da família.'
      },
      {
        id: 'house_protection',
        icon: '🪵',
        text: 'Guardar sementes no Silo para lenha seca e telhas novas caso o clima mude.'
      },
      {
        id: 'house_future',
        icon: '🪟',
        text: 'Fazer pequenas reformas na janela e canteiros do quintal para os próximos meses.'
      },
      {
        id: 'house_balance',
        icon: '🌱',
        text: 'Viver bem hoje sem desperdício, mantendo a tranquilidade no coração.'
      }
    ]
  },
  silo: {
    locationTitle: 'O Silo da Reserva',
    themeTitle: 'O que você prevê ao reforçar o Silo da Reserva?',
    subtitle: 'A torre de pedra protege o vilarejo contra secas, geadas e tempestades. Quem tem reserva tem tempo para escolher com calma.',
    audioSpeech: 'Hora da previsão no Silo da Reserva! Como você vai preparar a segurança do Vale contra os imprevistos da natureza?',
    defaultCardId: 'silo_security',
    cards: [
      {
        id: 'silo_security',
        icon: '🛡️',
        text: 'Guardar uma boa reserva no Silo para termos calma se o tempo mudar ou algo quebrar.'
      },
      {
        id: 'silo_daily',
        icon: '🌾',
        text: 'Separar o alimento diário com cuidado e deixar o restante bem guardado e seco.'
      },
      {
        id: 'silo_future',
        icon: '🔒',
        text: 'Proteger sementes raras para que durem até os anos futuros de estiagem.'
      },
      {
        id: 'silo_calm',
        icon: '🌱',
        text: 'Lembrar que ter reserva nos dá liberdade e tempo para escolher com serenidade.'
      }
    ]
  },
  field: {
    locationTitle: 'A Horta do Professor Cornélio',
    themeTitle: 'O que você prevê na Horta do Professor Cornélio?',
    subtitle: 'Professor Cornélio ensina que não adianta puxar a folha para ela crescer mais depressa. O que esperar da terra?',
    audioSpeech: 'Hora da previsão na Horta! O que você espera semear e colher com dedicação diária nesta estação?',
    defaultCardId: 'field_patient',
    cards: [
      {
        id: 'field_fast',
        icon: '🥕',
        text: 'Semear verduras de colheita rápida para termos alimentos frescos logo.'
      },
      {
        id: 'field_protection',
        icon: '💧',
        text: 'Guardar sementes e água no Silo para proteger os canteiros se o sol for forte demais.'
      },
      {
        id: 'field_patient',
        icon: '🌻',
        text: 'Cultivar mudas de crescimento lento que darão frutos doces e fartos no final do ano.'
      },
      {
        id: 'field_care',
        icon: '🌱',
        text: 'Dedicar cuidado diário e rega constante, sem querer apressar o tempo da natureza.'
      }
    ]
  },
  bridge: {
    locationTitle: 'A Ponte do Vilarejo',
    themeTitle: 'O que você prevê para a Ponte do Vilarejo?',
    subtitle: 'Dona Clara alertou sobre as chuvas da virada de estação e a festa na praça. O que é prioridade?',
    audioSpeech: 'Hora da previsão na Ponte do Vilarejo! O que é mais importante para conectar a comunidade e cuidar do futuro?',
    defaultCardId: 'bridge_connect',
    cards: [
      {
        id: 'bridge_connect',
        icon: '🌉',
        text: 'A ponte é o mais importante para o futuro do vilarejo continuar conectado.'
      },
      {
        id: 'bridge_party',
        icon: '🍎',
        text: 'Quero garantir que a nossa casa e a festa na praça tenham tudo o que precisamos agora.'
      },
      {
        id: 'bridge_silo',
        icon: '🛡️',
        text: 'Acho que posso precisar de sementes no Silo se o tempo mudar ou algo quebrar.'
      },
      {
        id: 'bridge_balance',
        icon: '🌱',
        text: 'Ainda não tenho certeza, quero colocar um pouquinho em cada cesto para ver o que acontece.'
      }
    ]
  },
  woods: {
    locationTitle: 'O Bosque & As Montanhas',
    themeTitle: 'O que você prevê no Bosque & Montanhas?',
    subtitle: 'O mirante ensina que grandes objetivos exigem visão de futuro e raízes profundas. Qual é o seu plano de longo prazo?',
    audioSpeech: 'Hora da previsão no Bosque e Montanhas! Como você planeja seus sonhos de longo prazo e sua jornada?',
    defaultCardId: 'woods_future',
    cards: [
      {
        id: 'woods_future',
        icon: '🌲',
        text: 'Investir sementes em projetos de longo prazo que levarão várias estações para florescer.'
      },
      {
        id: 'woods_supplies',
        icon: '🎒',
        text: 'Garantir bons suprimentos para a jornada do dia a dia sem passar apuros.'
      },
      {
        id: 'woods_reserve',
        icon: '🛡️',
        text: 'Manter uma boa reserva no Silo para apoiar expedições e novos caminhos.'
      },
      {
        id: 'woods_patience',
        icon: '🌱',
        text: 'Praticar a constância de caminhar um passo a cada dia com foco no futuro.'
      }
    ]
  }
};

export const PredictionStage: React.FC<PredictionStageProps> = ({
  locationId = 'bridge',
  onConfirmPrediction,
  onBack
}) => {
  const config = LOCATION_PREDICTIONS[locationId] || LOCATION_PREDICTIONS.bridge;
  const [selected, setSelected] = React.useState<string[]>([config.defaultCardId]);
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
    speechHelper.speak(config.audioSpeech);
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
          Passo 1 de 4 • Pausa de Reflexão & Previsão — {config.locationTitle}
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
        {config.themeTitle}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 20px', lineHeight: '1.5' }}>
        {config.subtitle}
      </p>

      <div style={{ fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <HelpCircle size={18} color="var(--color-nature-green)" />
        <span>Escolha as ideias que mais combinam com o que você está pensando:</span>
      </div>

      <div className="prediction-cards">
        {config.cards.map(card => {
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
          Quer escrever ou completar com sua própria ideia sobre {config.locationTitle}? (opcional)
        </label>
        <input
          id="custom-prediction"
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Exemplo: Acho que se eu guardar sementes com sabedoria, vou ter tranquilidade..."
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
          <span>Voltar à Exploração</span>
        </button>

        <button onClick={handleProceed} className="btn-primary">
          <span>Avançar: Distribuir Minhas Sementes</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
