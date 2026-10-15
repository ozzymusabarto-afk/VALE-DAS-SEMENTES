import React from 'react';
import { Home, Sprout, ShoppingBag, ShieldAlert, Wrench, Users, Trees, ArrowRight, Info } from 'lucide-react';
import type { ValleyLocation } from '../types/game';
import { soundManager } from '../utils/audio';

interface ValleyMapProps {
  onStartRound: () => void;
  activeRoundTitle: string;
}

const locations: ValleyLocation[] = [
  {
    id: 'house',
    name: 'A Casa',
    title: 'Necessidades & Cotidiano',
    roleDescription: 'Onde cuidamos da alimentação, manutenção e do bem-estar diário.',
    iconName: 'home'
  },
  {
    id: 'field',
    name: 'O Campo & Fazenda',
    title: 'Trabalho & Produção',
    roleDescription: 'Onde plantamos sementes, dedicamos esforço e esperamos o tempo de colheita.',
    iconName: 'sprout'
  },
  {
    id: 'market',
    name: 'O Mercado',
    title: 'Consumo & Escolhas',
    roleDescription: 'Onde comparamos preços, distinguimos necessidades de impulsos e negociamos.',
    iconName: 'market'
  },
  {
    id: 'silo',
    name: 'O Silo',
    title: 'Proteção & Reserva',
    roleDescription: 'Onde guardamos sementes para imprevistos e emergências que não podemos prever.',
    iconName: 'silo'
  },
  {
    id: 'square',
    name: 'A Praça da Comunidade',
    title: 'Cooperação & Ajuda',
    roleDescription: 'Onde os vizinhos cooperam, dividem ferramentas e se apoiam mutuamente.',
    iconName: 'square'
  },
  {
    id: 'woods',
    name: 'O Bosque',
    title: 'Metas & Futuro',
    roleDescription: 'Onde cuidamos de objetivos que levam mais tempo para florescer.',
    iconName: 'woods',
    badge: 'Longo Prazo'
  }
];

export const ValleyMap: React.FC<ValleyMapProps> = ({ onStartRound, activeRoundTitle }) => {
  const [selectedLoc, setSelectedLoc] = React.useState<ValleyLocation | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'house': return <Home size={24} />;
      case 'field': return <Sprout size={24} />;
      case 'market': return <ShoppingBag size={24} />;
      case 'silo': return <ShieldAlert size={24} />;
      case 'square': return <Users size={24} />;
      case 'woods': return <Trees size={24} />;
      default: return <Wrench size={24} />;
    }
  };

  const handleSelectLocation = (loc: ValleyLocation) => {
    soundManager.playPageFlip();
    setSelectedLoc(loc);
  };

  return (
    <div className="valley-map-container" role="region" aria-label="Mapa do Vale das Sementes">
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 6px', color: 'var(--color-nature-green)' }}>
          Bem-vindo ao Mapa do Vale
        </h2>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Explore as áreas do Vale ou abra a história da estação para começar suas escolhas.
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #fff8e1 100%)',
        border: '3px solid #c8e6c9',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ 
            background: '#ffb74d', 
            color: '#5d4037', 
            fontWeight: 800, 
            fontSize: '0.8rem', 
            padding: '3px 10px', 
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}>
            Desafio da Estação
          </span>
          <h3 style={{ margin: '8px 0 4px', fontSize: '1.35rem' }}>{activeRoundTitle}</h3>
          <p style={{ margin: 0, color: '#4a5568' }}>
            Dona Clara trouxe uma nova situação para você cuidar junto com o Vale.
          </p>
        </div>
        <button 
          onClick={() => {
            soundManager.playChime();
            onStartRound();
          }}
          className="btn-primary"
          aria-label="Abrir Carta da Estação"
        >
          <span>Abrir História da Rodada</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="valley-map-grid">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => handleSelectLocation(loc)}
            className={`location-card ${loc.id}`}
            style={{
              cursor: 'pointer',
              borderWidth: selectedLoc?.id === loc.id ? '3px' : '2px',
              borderColor: selectedLoc?.id === loc.id ? 'var(--color-nature-green)' : '#dfd5c2'
            }}
            aria-label={`Ver informações sobre ${loc.name}`}
          >
            {loc.badge && <span className="location-badge">{loc.badge}</span>}
            <div className="loc-header">
              <div className="loc-icon-bubble">
                {getIcon(loc.id)}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '1.1rem' }}>{loc.name}</strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{loc.title}</span>
              </div>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
              {loc.roleDescription}
            </p>
          </button>
        ))}
      </div>

      {selectedLoc && (
        <div className="callout-gentle" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
          <Info size={24} color="var(--color-nature-green)" style={{ flexShrink: 0 }} />
          <div>
            <strong>O que {selectedLoc.name} ensina:</strong> {selectedLoc.roleDescription} No Vale, cuidar de cada área no momento certo traz tranquilidade, sem necessidade de pressa ou competição.
          </div>
        </div>
      )}
    </div>
  );
};
