import React from 'react';
import { Compass, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface WelcomeScreenProps {
  onStart: (guardianName: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = React.useState('Guardião');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playChime();
    onStart(name.trim() || 'Guardião');
  };

  return (
    <div className="paper-card" style={{ maxWidth: '820px', margin: '20px auto', textAlign: 'center' }}>
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(60, 45, 30, 0.15)',
        marginBottom: '24px',
        border: '3px solid #dfd5c2'
      }}>
        <img 
          src="/concept_vale_das_sementes.jpg" 
          alt="Paisagem viva do Vale das Sementes: o vilarejo, o mercado da raposa, a horta com o Professor Cornélio, o Silo da Reserva e a ponte sobre o rio" 
          style={{
            width: '100%',
            maxHeight: '380px',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(30, 20, 10, 0.75), transparent)',
          padding: '24px 20px 12px',
          color: 'white',
          textAlign: 'left'
        }}>
          <span style={{ 
            background: 'rgba(255, 255, 255, 0.25)', 
            backdropFilter: 'blur(4px)', 
            padding: '3px 10px', 
            borderRadius: '999px', 
            fontSize: '0.8rem', 
            fontWeight: 700 
          }}>
            Arte Conceitual Oficial do Vale
          </span>
          <p style={{ margin: '6px 0 0', fontSize: '0.95rem', opacity: 0.95, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
            O Professor Cornélio, a Raposa do Mercado e os moradores cuidam juntos da terra, da ponte e da vida cotidiana.
          </p>
        </div>
      </div>

      <h1 style={{ color: 'var(--color-nature-green)', margin: '0 0 10px', fontSize: '2.2rem' }}>
        O Vale das Sementes
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', margin: '0 auto 24px', maxWidth: '620px', lineHeight: 1.5 }}>
        Um jogo de escolhas, cuidado, planejamento e autonomia para aprender a cuidar dos recursos da vida com tranquilidade.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        textAlign: 'left',
        margin: '24px 0'
      }}>
        <div style={{ background: '#fcf9f2', border: '1px solid #e8dec8', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b78103', fontWeight: 700, marginBottom: '6px' }}>
            <Compass size={18} />
            <span>Recursos Limitados</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
            Recebemos sementes a cada estação. Elas ensinam que não podemos fazer tudo ao mesmo tempo.
          </p>
        </div>

        <div style={{ background: '#f5faf5', border: '1px solid #cce5cc', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-nature-green)', fontWeight: 700, marginBottom: '6px' }}>
            <ShieldCheck size={18} />
            <span>O Silo da Reserva</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
            Guardar não é deixar de viver: é ter calma e opções quando o inesperado bate à nossa porta.
          </p>
        </div>

        <div style={{ background: '#f6f9fc', border: '1px solid #d0e1fd', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1976d2', fontWeight: 700, marginBottom: '6px' }}>
            <Heart size={18} />
            <span>Sem Competição</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#555' }}>
            Prosperidade não é ter a montanha mais alta de sementes, mas aprender a fazer escolhas conscientes.
          </p>
        </div>
      </div>

      <form onSubmit={handleStart} style={{ marginTop: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="guardian-name" style={{ display: 'block', fontWeight: 700, marginBottom: '8px', fontSize: '1.05rem' }}>
            Como você gostaria de se chamar no Vale?
          </label>
          <input
            id="guardian-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={25}
            style={{
              padding: '12px 18px',
              fontSize: '1.1rem',
              borderRadius: '12px',
              border: '2px solid #d4c8b2',
              textAlign: 'center',
              width: '100%',
              maxWidth: '320px',
              fontFamily: 'inherit'
            }}
            placeholder="Seu nome ou apelido"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.25rem' }}>
          <span>Entrar no Vale das Sementes</span>
          <ArrowRight size={22} />
        </button>
      </form>
    </div>
  );
};
