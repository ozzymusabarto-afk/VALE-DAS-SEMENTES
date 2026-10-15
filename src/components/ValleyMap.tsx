import React, { useState } from 'react';
import { Home, Sprout, ShoppingBag, ShieldAlert, Wrench, Trees, ArrowRight, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ValleyMapProps {
  onStartRound: () => void;
  activeRoundTitle: string;
}

interface Hotspot {
  id: string;
  name: string;
  character: string;
  role: string;
  x: number; // Porcentagem horizontal
  y: number; // Porcentagem vertical
  icon: React.ReactNode;
  color: string;
  description: string;
  lesson: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'market',
    name: 'O Mercado da Raposa',
    character: 'Raposa Comerciante',
    role: 'Consumo Consciente & Comparação',
    x: 8,
    y: 52,
    icon: <ShoppingBag size={20} />,
    color: '#e65100',
    description: 'A Raposa sempre tem novidades e frutas frescas. Aqui aprendemos a diferença entre o que realmente precisamos agora e o que é só um desejo de momento.',
    lesson: 'Comprar com calma e perguntar: "Eu preciso disso hoje ou posso esperar?"'
  },
  {
    id: 'workshop',
    name: 'A Oficina de Ferramentas',
    character: 'Mestre Tomás, o Marceneiro',
    role: 'Habilidades & Manutenção',
    x: 23,
    y: 53,
    icon: <Wrench size={20} />,
    color: '#5d4037',
    description: 'Aqui Tomás conserta arados, enxadas e mesas. Mostra que consertar algo antes que quebre de vez economiza muitas sementes no futuro.',
    lesson: 'Trabalho, aprendizado e cuidado com ferramentas geram valor duradouro.'
  },
  {
    id: 'house',
    name: 'A Casa da Fazenda',
    character: 'A Criança Guardiã e sua Família',
    role: 'Necessidades & Bem-Estar',
    x: 48,
    y: 47,
    icon: <Home size={20} />,
    color: '#c62828',
    description: 'O coração da propriedade. É onde cuidamos do alimento diário, do descanso e do conforto da rotina.',
    lesson: 'Parte dos nossos recursos é usada para viver bem hoje, não apenas para guardar.'
  },
  {
    id: 'silo',
    name: 'O Silo da Reserva',
    character: 'A Torre Protetora do Vale',
    role: 'Segurança contra Imprevistos',
    x: 63,
    y: 38,
    icon: <ShieldAlert size={20} />,
    color: '#6a1b9a',
    description: 'Construído em pedras fortes com o símbolo da semente. Guarda reservas para tempestades, geadas e emergências.',
    lesson: 'Quem tem reserva não é melhor que ninguém, mas tem mais tempo e opções para escolher com calma.'
  },
  {
    id: 'field',
    name: 'A Horta do Professor Cornélio',
    character: 'Professor Cornélio',
    role: 'Trabalho, Paciência & Colheita',
    x: 58,
    y: 70,
    icon: <Sprout size={20} />,
    color: '#2e7d32',
    description: 'O sábio Cornélio ensina a semear, regar e respeitar o tempo das plantas crescerem sem pressa.',
    lesson: 'Plantar hoje pede esforço e paciência; o fruto vem na estação certa.'
  },
  {
    id: 'bridge',
    name: 'A Ponte do Vilarejo',
    character: 'Moradores em Cooperação',
    role: 'Metas Comunitárias & Conexão',
    x: 84,
    y: 65,
    icon: <Sparkles size={20} />,
    color: '#00838f',
    description: 'A ponte de pedra que liga o Vale ao outro lado do rio. Precisa de reforço antes das grandes chuvas.',
    lesson: 'Projetos comunitários beneficiam a todos e pedem colaboração de sementes.'
  },
  {
    id: 'woods',
    name: 'O Bosque & As Montanhas',
    character: 'A Natureza do Vale',
    role: 'Metas de Longo Prazo',
    x: 80,
    y: 20,
    icon: <Trees size={20} />,
    color: '#1b5e20',
    description: 'Onde as árvores centenárias crescem devagar ao longo dos anos.',
    lesson: 'Sonhos grandes exigem prazos longos e constância.'
  }
];

export const ValleyMap: React.FC<ValleyMapProps> = ({ onStartRound, activeRoundTitle }) => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const handleOpenSpot = (spot: Hotspot) => {
    soundManager.playChime();
    setActiveHotspot(spot);
  };

  return (
    <div className="interactive-map-wrapper">
      {/* Faixa Superior de Missão do Vale */}
      <div className="map-mission-banner">
        <div className="mission-info">
          <span className="mission-pill">Missão da Estação</span>
          <h2 className="mission-title">{activeRoundTitle}</h2>
          <p className="mission-subtitle">
            Dona Clara e o Professor Cornélio precisam da sua sabedoria para organizar as 12 sementes desta primavera.
          </p>
        </div>

        <button 
          onClick={() => {
            soundManager.playChime();
            onStartRound();
          }}
          className="btn-mission-play"
          aria-label="Abrir Carta da Estação"
        >
          <span>Abrir História da Rodada</span>
          <ArrowRight size={22} />
        </button>
      </div>

      {/* O Cenário Pintado Interativo */}
      <div className="map-canvas-container">
        <img 
          src="/concept_vale_das_sementes.jpg" 
          alt="Mapa Interativo do Vale das Sementes" 
          className="map-landscape-image"
        />

        {/* Hotspots posicionados diretamente sobre os locais da pintura */}
        {HOTSPOTS.map((spot) => {
          const isSelected = activeHotspot?.id === spot.id;
          return (
            <div
              key={spot.id}
              className={`map-hotspot-pin ${isSelected ? 'active' : ''}`}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`
              }}
            >
              <button
                onClick={() => handleOpenSpot(spot)}
                className="hotspot-bubble-btn"
                style={{ backgroundColor: spot.color }}
                title={`Explorar ${spot.name}`}
                aria-label={`Explorar ${spot.name}`}
              >
                {spot.icon}
                <span className="hotspot-ping-wave" style={{ borderColor: spot.color }}></span>
              </button>

              <span className="hotspot-tag-label">{spot.name}</span>
            </div>
          );
        })}

        {/* Modal/Balão Informativo do Local Selecionado */}
        {activeHotspot && (
          <div className="hotspot-dialog-overlay" onClick={() => setActiveHotspot(null)}>
            <div 
              className="hotspot-dialog-card" 
              onClick={(e) => e.stopPropagation()}
              style={{ borderTop: `6px solid ${activeHotspot.color}` }}
            >
              <div className="dialog-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="dialog-icon-circle" style={{ background: activeHotspot.color }}>
                    {activeHotspot.icon}
                  </div>
                  <div>
                    <h3 className="dialog-title">{activeHotspot.name}</h3>
                    <span className="dialog-character">Quem vive aqui: {activeHotspot.character}</span>
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

              <p className="dialog-desc">{activeHotspot.description}</p>

              <div className="dialog-lesson-box">
                <strong>💡 O que aprendemos aqui:</strong> {activeHotspot.lesson}
              </div>

              <div className="dialog-actions">
                <button 
                  onClick={() => {
                    setActiveHotspot(null);
                    onStartRound();
                  }}
                  className="btn-dialog-proceed"
                >
                  <span>Cuidar do Vale nesta Rodada</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="map-footer-hint">
        <span>🌾 <strong>Dica de Guardião:</strong> Toque ou passe o mouse nos símbolos brilhantes da pintura para conhecer cada morador e seus ensinamentos!</span>
      </div>
    </div>
  );
};
