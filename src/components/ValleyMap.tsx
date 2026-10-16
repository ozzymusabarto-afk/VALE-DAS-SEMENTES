import React, { useState } from 'react';
import { Home, Sprout, ShoppingBag, ShieldAlert, Wrench, Trees, ArrowRight, X, Sparkles } from 'lucide-react';
import type { LocationId } from '../types/game';
import { soundManager } from '../utils/audio';

import imgMarket from '../assets/cena-mercado-raposa.webp';
import imgWorkshop from '../assets/cena-oficina-ferramentas.webp';
import imgHouse from '../assets/cena-casa-fazenda.webp';
import imgSilo from '../assets/cena-silo-reserva.webp';
import imgField from '../assets/cena-horta-cornelio.webp';
import imgBridge from '../assets/cena-ponte-primavera.webp';
import imgWoods from '../assets/cena-bosque-montanhas.webp';

interface ValleyMapProps {
  onStartRound: (locationId?: LocationId) => void;
  activeRoundTitle: string;
  onOpenJournal?: () => void;
}

interface Hotspot {
  id: LocationId;
  name: string;
  character: string;
  role: string;
  category: string;
  x: number; // Porcentagem horizontal no mapa
  y: number; // Porcentagem vertical no mapa
  icon: React.ReactNode;
  color: string;
  image: string;
  actionVerb: string;
  tagline: string; // Máximo 8 palavras
  description: string;
  lesson: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'market',
    name: 'O Mercado da Raposa',
    character: 'Raposa Comerciante',
    role: 'Consumo Consciente',
    category: 'Escolhas',
    x: 8,
    y: 52,
    icon: <ShoppingBag size={20} />,
    color: '#e65100',
    image: imgMarket,
    actionVerb: 'Comparar',
    tagline: 'Distinga o que precisa agora do impulso.',
    description: 'A Raposa sempre tem novidades e frutas frescas. Aqui aprendemos a diferença entre o que realmente precisamos agora e o que é só um desejo de momento.',
    lesson: 'Comprar com calma e perguntar: "Eu preciso disso hoje ou posso esperar?"'
  },
  {
    id: 'workshop',
    name: 'A Oficina de Ferramentas',
    character: 'Mestre Tomás, o Marceneiro',
    role: 'Manutenção Preventiva',
    category: 'Ofício',
    x: 23,
    y: 53,
    icon: <Wrench size={20} />,
    color: '#5d4037',
    image: imgWorkshop,
    actionVerb: 'Consertar',
    tagline: 'Consertar a tempo economiza sementes no futuro.',
    description: 'Aqui Tomás conserta arados, enxadas e mesas. Mostra que consertar algo antes que quebre de vez economiza muitas sementes no futuro.',
    lesson: 'Trabalho, aprendizado e cuidado com ferramentas geram valor duradouro.'
  },
  {
    id: 'house',
    name: 'A Casa da Fazenda',
    character: 'A Criança Guardiã e Família',
    role: 'Necessidades & Bem-Estar',
    category: 'Família',
    x: 48,
    y: 47,
    icon: <Home size={20} />,
    color: '#c62828',
    image: imgHouse,
    actionVerb: 'Acolher',
    tagline: 'Viver bem hoje traz paz à família.',
    description: 'O coração da propriedade. É onde cuidamos do alimento diário, do descanso e do conforto da rotina.',
    lesson: 'Parte dos nossos recursos é usada para viver bem hoje, não apenas para guardar.'
  },
  {
    id: 'silo',
    name: 'O Silo da Reserva',
    character: 'A Torre Protetora do Vale',
    role: 'Reserva de Emergência',
    category: 'Proteção',
    x: 63,
    y: 38,
    icon: <ShieldAlert size={20} />,
    color: '#6a1b9a',
    image: imgSilo,
    actionVerb: 'Proteger',
    tagline: 'Uma reserva traz calma em dias difíceis.',
    description: 'Construído em pedras fortes com o símbolo da semente. Guarda reservas para tempestades, geadas e emergências.',
    lesson: 'Quem tem reserva não é melhor que ninguém, mas tem mais tempo e opções para escolher com calma.'
  },
  {
    id: 'field',
    name: 'A Horta do Professor Cornélio',
    character: 'Professor Cornélio',
    role: 'Cultivo e Tempo',
    category: 'Paciência',
    x: 58,
    y: 70,
    icon: <Sprout size={20} />,
    color: '#2e7d32',
    image: imgField,
    actionVerb: 'Cultivar',
    tagline: 'Paciência e dedicação diária geram boa colheita.',
    description: 'O sábio Cornélio ensina a semear, regar e respeitar o tempo das plantas crescerem sem pressa.',
    lesson: 'Plantar hoje pede esforço e paciência; o fruto vem na estação certa.'
  },
  {
    id: 'bridge',
    name: 'A Ponte do Vilarejo',
    character: 'Dona Clara e Moradores',
    role: 'Projetos Comunitários',
    category: 'Cooperação',
    x: 84,
    y: 65,
    icon: <Sparkles size={20} />,
    color: '#00838f',
    image: imgBridge,
    actionVerb: 'Investigar',
    tagline: 'Cuidar da ponte mantém a comunidade unida.',
    description: 'A ponte de pedra que liga o Vale ao outro lado do rio. Precisa de reforço antes das grandes chuvas.',
    lesson: 'Projetos comunitários beneficiam a todos e pedem colaboração de sementes.'
  },
  {
    id: 'woods',
    name: 'O Bosque & As Montanhas',
    character: 'A Guia das Trilhas',
    role: 'Metas de Longo Prazo',
    category: 'Constância',
    x: 80,
    y: 20,
    icon: <Trees size={20} />,
    color: '#1b5e20',
    image: imgWoods,
    actionVerb: 'Explorar',
    tagline: 'Sonhos de longo prazo pedem constância diária.',
    description: 'Onde as árvores centenárias crescem devagar ao longo dos anos, ensinando a ter visão de futuro.',
    lesson: 'Sonhos grandes exigem prazos longos, raízes fundas e constância.'
  }
];

export const ValleyMap: React.FC<ValleyMapProps> = ({ onStartRound, activeRoundTitle, onOpenJournal }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const handleOpenSpot = (spot: Hotspot) => {
    soundManager.playChime();
    setActiveHotspot(spot);
  };

  const handleEnterLocation = (locationId: LocationId) => {
    soundManager.playPageFlip();
    setActiveHotspot(null);
    onStartRound(locationId);
  };

  return (
    <div className="interactive-map-wrapper card-board-screen">
      {/* Cabeçalho do tabuleiro */}
      <div className="map-mission-banner">
        <div className="mission-info">
          <div className="board-kicker-row">
            <span className="mission-pill">Baralho da Primavera</span>
            <span className="board-turn-chip">Rodada 1 • 12 sementes</span>
          </div>
          <h2 className="mission-title">{activeRoundTitle}</h2>
          <p className="mission-subtitle">
            Explore as cartas do Vale, converse com os moradores e escolha por onde começar. Cada lugar ensina uma sabedoria prática sobre suas sementes!
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playMagicSparkle();
            handleEnterLocation('bridge');
          }}
          className="btn-mission-play"
          aria-label="Comprar carta da missão da ponte"
        >
          <span>Comprar carta da missão</span>
          <ArrowRight size={22} />
        </button>
      </div>

      <div className="card-board-table">
        {/* Coluna Esquerda: Baralho e Regras */}
        <aside className="board-side-rail" aria-label="Baralho da missão">
          <div 
            className="board-deck mission-deck" 
            onClick={() => handleEnterLocation('bridge')}
            style={{ cursor: 'pointer' }}
            title="Clique para ir à missão da ponte"
          >
            <span className="deck-label">CARTA NO TOPO</span>
            <div className="deck-icon">🌼</div>
            <strong>A Ponte e a Festa</strong>
            <span>Uma decisão da estação espera por você.</span>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#e65100' }}>
              <span>Jogar agora</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="board-rule-card">
            <span className="deck-label">COMO JOGAR</span>
            <p>Escolha uma carta, faça uma ação no Vale e observe o que muda.</p>
            <div className="rule-dots"><span>1</span><span>2</span><span>3</span></div>
          </div>
        </aside>

        {/* Centro: O Cenário Pintado Interativo */}
        <div className="map-canvas-container">
          <img 
            src="/concept_vale_das_sementes.jpg" 
            alt="Mapa Interativo do Vale das Sementes" 
            className="map-image-base"
          />

          {/* Hotspots sobre a pintura panorâmica */}
          {HOTSPOTS.map((spot) => (
            <button
              key={spot.id}
              onClick={() => handleOpenSpot(spot)}
              className="map-hotspot-pin"
              style={{
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                '--pin-accent': spot.color
              } as React.CSSProperties}
              aria-label={`Explorar ${spot.name}`}
              title={`${spot.name} (${spot.character})`}
            >
              <div className="pin-pulse-wave" style={{ borderColor: spot.color }}></div>
              <div className="pin-circle-badge" style={{ background: `linear-gradient(135deg, ${spot.color} 0%, #1c1917 140%)` }}>
                {spot.icon}
              </div>
              <span className="pin-tooltip-label">
                <strong className="pin-spot-name">{spot.name}</strong>
                <span className="pin-spot-action" style={{ color: spot.color }}>{spot.actionVerb} ➔</span>
              </span>
            </button>
          ))}

          {/* Modal ilustrado do Hotspot quando clicado */}
          {activeHotspot && (
            <div className="hotspot-dialog-overlay" onClick={() => setActiveHotspot(null)}>
              <div 
                className="hotspot-dialog-card" 
                onClick={(e) => e.stopPropagation()}
                style={{ borderTop: `6px solid ${activeHotspot.color}` }}
              >
                <div className="dialog-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className="dialog-icon-circle" style={{ background: activeHotspot.color }}>
                      {activeHotspot.icon}
                    </div>
                    <div>
                      <h3 className="dialog-title">{activeHotspot.name}</h3>
                      <span className="dialog-character">Quem vive aqui: {activeHotspot.character} • {activeHotspot.role}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveHotspot(null)} 
                    className="dialog-close-btn"
                    aria-label="Fechar"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ borderRadius: '14px', overflow: 'hidden', height: '180px', marginBottom: '14px', border: '2px solid #e7dfd5' }}>
                  <img 
                    src={activeHotspot.image} 
                    alt={activeHotspot.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/concept_vale_das_sementes.jpg'; }}
                  />
                </div>

                <p className="dialog-desc">{activeHotspot.description}</p>

                <div className="dialog-lesson-box">
                  <strong>💡 O que aprendemos aqui:</strong> {activeHotspot.lesson}
                </div>

                <div className="dialog-actions">
                  <button 
                    onClick={() => handleEnterLocation(activeHotspot.id)}
                    className="btn-dialog-proceed"
                    style={{ background: activeHotspot.color }}
                  >
                    <span>Entrar neste local ({activeHotspot.actionVerb})</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Estado da Estação e Diário */}
        <aside className="board-side-rail board-side-rail-right" aria-label="Estado da estação">
          <div className="board-status-card">
            <span className="deck-label">ESTAÇÃO</span>
            <strong>Primavera</strong>
            <span>As flores abriram. A ponte precisa de cuidado.</span>
            <div className="season-progress"><span style={{ width: '25%' }}></span></div>
            <small>1 de 4 estações</small>
          </div>

          <div 
            className="board-journal-card"
            onClick={onOpenJournal}
            role={onOpenJournal ? "button" : undefined}
            tabIndex={onOpenJournal ? 0 : undefined}
            style={onOpenJournal ? { cursor: 'pointer' } : undefined}
            title="Abrir o Diário de Bordo"
          >
            <span className="deck-label">CARTA DE PAUSA</span>
            <strong>Diário de Bordo</strong>
            <span>Registre uma descoberta depois da rodada.</span>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: '#2e7d32' }}>
              <span>Abrir caderno</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </aside>
      </div>

      {/* MÃO DE CARTAS REAIS DE JOGO */}
      <section className="card-hand-section" aria-label="Cartas de locais do Vale">
        <div className="card-hand-heading">
          <div>
            <span className="mission-pill">Sua mão de cartas</span>
            <h3>Escolha um lugar para explorar</h3>
          </div>
          <span className="hand-hint">👆 Toque em uma carta para entrar e vivenciar a cena</span>
        </div>

        <div className="card-hand">
          {HOTSPOTS.map((spot, index) => (
            <div
              key={spot.id}
              onClick={() => handleEnterLocation(spot.id)}
              className={`location-card real-game-card ${activeHotspot?.id === spot.id ? 'selected' : ''}`}
              style={{ '--card-accent': spot.color } as React.CSSProperties}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEnterLocation(spot.id); }}
            >
              {/* Fita de Estação e Número */}
              <div className="card-top-ribbon">
                <span className="card-season-tag">🌸 Primavera</span>
                <span className="location-card-number">#{String(index + 1).padStart(2, '0')}</span>
              </div>

              {/* Imagem Grande Ocupando o Topo da Carta */}
              <div className="card-artwork-frame">
                <img 
                  src={spot.image} 
                  alt={spot.name} 
                  className="card-artwork-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/concept_vale_das_sementes.jpg'; }}
                />
                <span className="card-category-seal">{spot.category}</span>
              </div>

              {/* Informações da Carta: Título, Ícone e Frase Curta */}
              <div className="card-text-body">
                <div className="card-title-row">
                  <span className="location-card-icon">{spot.icon}</span>
                  <strong className="card-main-title">{spot.name}</strong>
                </div>

                <p className="card-tagline-text">
                  {spot.tagline}
                </p>

                {/* Botão de Ação Interativo com Cor Destacada */}
                <button 
                  className="card-action-btn"
                  style={{ background: `linear-gradient(135deg, ${spot.color} 0%, color-mix(in srgb, ${spot.color} 75%, black) 100%)` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterLocation(spot.id);
                  }}
                  aria-label={`Entrar no local: ${spot.name}`}
                >
                  <span className="card-action-verb">{spot.actionVerb}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="map-footer-hint">
        <span>🌾 <strong>Dica de Guardião:</strong> As cartas são lugares vivos. Ao escolher o Bosque, você vai ao Bosque; ao escolher o Mercado, você vai ao Mercado. Cada local tem sua própria atividade antes de distribuir as sementes!</span>
      </div>
    </div>
  );
};
