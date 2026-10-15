import React, { useState } from 'react';
import { Compass, ShieldCheck, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeScreenProps {
  onStart: (guardianName: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('Guardião');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChime();
    onStart(name.trim() || 'Guardião');
  };

  return (
    <div className="storybook-hero-container">
      {/* Moldura da Pintura */}
      <div className="storybook-painting-frame">
        <img 
          src="/concept_vale_das_sementes.jpg" 
          alt="Paisagem viva do Vale das Sementes" 
          className="storybook-hero-image"
        />
        <div className="painting-vignette"></div>

        {/* Título e Faixa Mágica sobre a pintura */}
        <div className="painting-overlay-content">
          <div className="storybook-tag">
            <Sparkles size={16} color="#ffe082" />
            <span>Uma Aventura Educativa em 2D</span>
          </div>

          <h1 className="storybook-main-title">
            O Vale das Sementes
          </h1>

          <p className="storybook-subtitle">
            Cuidar, planejar e florescer: aprenda a lidar com os recursos da vida em um vale acolhedor onde prosperidade é viver com consciência e liberdade.
          </p>
        </div>
      </div>

      {/* Cartão de Entrada e Criação do Personagem */}
      <div className="storybook-entry-card">
        <div className="pillar-cards-row">
          <div className="pillar-badge">
            <div className="pillar-icon amber">
              <Compass size={20} />
            </div>
            <div>
              <strong>Recursos Limitados</strong>
              <p>Sementes ensinam que não podemos fazer tudo ao mesmo tempo, mas cada escolha consciente tem valor.</p>
            </div>
          </div>

          <div className="pillar-badge">
            <div className="pillar-icon green">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>O Silo da Reserva</strong>
              <p>Guardar para o inesperado cria calma, tempo e mais opções quando as surpresas acontecem.</p>
            </div>
          </div>

          <div className="pillar-badge">
            <div className="pillar-icon blue">
              <Heart size={20} />
            </div>
            <div>
              <strong>Sem Competição</strong>
              <p>Trabalhar para alguém, empreender, alugar, comprar ou viver com simplicidade: todos são caminhos nobres.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleStart} className="storybook-start-form">
          <div className="form-group-hero">
            <label htmlFor="guardian-name-input" className="hero-label">
              Como você gostaria de ser chamado(a) no Vale?
            </label>
            <div className="hero-input-wrapper">
              <input
                id="guardian-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={25}
                className="hero-input"
                placeholder="Digite seu nome de Guardião(ã)"
                autoFocus
              />
            </div>
          </div>

          <button type="submit" className="btn-hero-start">
            <span>Começar Minha Jornada no Vale</span>
            <ArrowRight size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};
