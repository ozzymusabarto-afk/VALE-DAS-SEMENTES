import React from 'react';
import { ShieldCheck, ArrowRight, BookOpen, HeartHandshake, Volume2 } from 'lucide-react';
import type { SeedAllocation } from '../types/game';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

interface ConsequenceStageProps {
  allocation: SeedAllocation;
  onOpenJournal: () => void;
}

export const ConsequenceStage: React.FC<ConsequenceStageProps> = ({
  allocation,
  onOpenJournal
}) => {
  const hasEnoughProtection = allocation.protection >= 3;
  const neededForRepairs = 3;
  const difference = allocation.protection - neededForRepairs;

  const handleListen = () => {
    const textToSpeak = hasEnoughProtection
      ? "Você não podia controlar a tempestade de vento. Mas as sementes que guardou no Silo deram tranquilidade para consertar o telhado sem precisar cancelar outros planos. Essa é a força de uma reserva!"
      : "Você não podia controlar o vento. Como usou mais sementes no presente, agora o Silo não cobriu todo o conserto. Mas isso não é um fracasso: imprevistos acontecem com qualquer pessoa e nós sempre podemos pedir ajuda na Praça da Comunidade ou ajustar as prioridades.";
    speechHelper.speak(textToSpeak);
  };

  return (
    <div className="paper-card" style={{ maxWidth: '800px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          background: 'var(--color-nature-light)', 
          color: 'var(--color-nature-green)', 
          fontWeight: 800, 
          padding: '4px 12px', 
          borderRadius: '999px',
          fontSize: '0.85rem'
        }}>
          Passo 3 de 4 • Compreendendo o Resultado
        </span>

        <button 
          onClick={handleListen}
          className="btn-icon"
          title="Ouvir explicação da Guardiã"
        >
          <Volume2 size={16} />
          <span>Ouvir</span>
        </button>
      </div>

      <h2 style={{ margin: '0 0 12px', fontSize: '1.8rem', color: 'var(--text-main)' }}>
        O que as escolhas e as circunstâncias nos ensinaram?
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 20px', lineHeight: '1.5' }}>
        No Vale, nós sempre separamos o que dependeu de nós e o que foi um acontecimento da natureza:
      </p>

      {/* Os 3 elementos pedagógicos fundamentais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '4px' }}>
            1. O que estava sob seu controle:
          </strong>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            Decidir quantas sementes colocar no Agora ({allocation.now}), no Silo ({allocation.protection}) e no Futuro ({allocation.future}).
          </span>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', padding: '14px' }}>
          <strong style={{ display: 'block', color: '#991b1b', marginBottom: '4px' }}>
            2. O que foi incerteza / acaso:
          </strong>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            A ventania repentina que quebrou as telhas. Ninguém pode controlar o clima do mundo.
          </span>
        </div>

        <div style={{ background: hasEnoughProtection ? '#f0fdf4' : '#fffbeb', border: `1px solid ${hasEnoughProtection ? '#bbf7d0' : '#fde68a'}`, borderRadius: '12px', padding: '14px' }}>
          <strong style={{ display: 'block', color: hasEnoughProtection ? '#166534' : '#92400e', marginBottom: '4px' }}>
            3. Como sua preparação ajudou:
          </strong>
          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
            {hasEnoughProtection
              ? `O Silo tinha ${allocation.protection} sementes. As 3 necessárias foram usadas sem aperto!`
              : `O Silo tinha ${allocation.protection} sementes (faltaram ${Math.abs(difference)}). Teremos que reorganizar ou pedir cooperação.`}
          </span>
        </div>
      </div>

      {/* Caixa de Explicação Gentil sem Humilhação */}
      {hasEnoughProtection ? (
        <div className="callout-gentle" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <ShieldCheck size={32} color="#2e7d32" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#1b5e20', fontSize: '1.25rem' }}>
              A reserva deu tranquilidade ao seu plano!
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', color: '#2e7d32', lineHeight: '1.5' }}>
              Você não podia controlar o vento. Mas o Silo garantiu que a casa fosse consertada no mesmo dia, sem precisar mexer nas sementes que você já separou para a ponte ou para o presente.
            </p>
            <div style={{ fontSize: '0.9rem', color: '#15803d', fontStyle: 'italic' }}>
              "Guardar sementes cria mais tempo e calma para escolher quando a vida traz surpresas."
            </div>
          </div>
        </div>
      ) : (
        <div className="callout-pedagogical" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <HeartHandshake size={32} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '1.25rem' }}>
              Uma oportunidade acolhedora de aprender e pedir ajuda!
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', color: '#78350f', lineHeight: '1.5' }}>
              Você usou mais sementes no presente ou na ponte. Isso gerou frutos bons nessas áreas! Como o vento foi forte, o Silo não cobriu tudo sozinho. No Vale, quando isso acontece, nós não nos culpamos: nós conversamos com a Praça da Comunidade, pedimos auxílio ou combinamos o que pode esperar.
            </p>
            <div style={{ fontSize: '0.9rem', color: '#92400e', fontStyle: 'italic' }}>
              "Errar o tamanho de uma reserva faz parte do caminho. Saber pedir ajuda é uma sabedoria tão valiosa quanto guardar sementes."
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        marginTop: '28px', 
        borderTop: '2px dashed #e5dcce', 
        paddingTop: '20px',
        gap: '12px'
      }}>
        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onOpenJournal();
          }}
          className="btn-primary"
        >
          <BookOpen size={20} />
          <span>Registrar no Diário de Bordo</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
