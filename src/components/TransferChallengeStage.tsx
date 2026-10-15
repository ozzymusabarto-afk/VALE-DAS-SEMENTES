import React from 'react';
import { Sprout, Shield, Sun, Wrench, CheckCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TransferChallengeStageProps {
  onCompleteTransfer: (summary: string) => void;
}

export const TransferChallengeStage: React.FC<TransferChallengeStageProps> = ({
  onCompleteTransfer
}) => {
  const [nowSeeds, setNowSeeds] = React.useState(4);
  const [protectionSeeds, setProtectionSeeds] = React.useState(3);
  const [futureSeeds, setFutureSeeds] = React.useState(3);

  const total = 10;
  const currentTotal = nowSeeds + protectionSeeds + futureSeeds;
  const diff = total - currentTotal;

  const handleAdjust = (type: 'now' | 'prot' | 'fut', val: number) => {
    if (val > 0 && diff <= 0) return;
    soundManager.playSeedDrop();

    if (type === 'now') setNowSeeds(Math.max(0, nowSeeds + val));
    if (type === 'prot') setProtectionSeeds(Math.max(0, protectionSeeds + val));
    if (type === 'fut') setFutureSeeds(Math.max(0, futureSeeds + val));
  };

  const handleFinish = () => {
    soundManager.playChime();
    onCompleteTransfer(
      `Você distribuiu com sabedoria suas 10 sementes no Verão: ${nowSeeds} para as mudas da horta, ${protectionSeeds} guardadas no Silo para o arado, e ${futureSeeds} para a cisterna de água.`
    );
  };

  return (
    <div className="paper-card" style={{ maxWidth: '780px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ 
          background: '#e0f2fe', 
          color: '#0284c7', 
          fontWeight: 800, 
          padding: '4px 12px', 
          borderRadius: '999px',
          fontSize: '0.85rem'
        }}>
          Passo 4 de 4 • Transferência do Aprendizado
        </span>
      </div>

      <h2 style={{ margin: '0 0 10px', fontSize: '1.75rem', color: 'var(--text-main)' }}>
        Nova Estação: A Horta do Vilarejo e o Arado Antigo
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 20px', lineHeight: '1.5' }}>
        Para ver se você consegue usar o que aprendeu em uma nova situação: agora é Verão! A horta precisa de sementes para novas mudas, o arado antigo está rangendo e pode quebrar a qualquer momento, e a Praça quer juntar para comprar uma cisterna de chuva.
      </p>

      <div className="callout-gentle" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Sprout size={28} color="var(--color-nature-green)" style={{ flexShrink: 0 }} />
        <div>
          <strong>Você tem 10 sementes disponíveis no Verão.</strong> Como você divide entre o presente, o imprevisto do arado e a cisterna do futuro?
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '14px',
        margin: '24px 0'
      }}>
        {/* Agora */}
        <div style={{ border: '2px solid #fed7aa', borderRadius: '14px', padding: '16px', background: '#fffbeb', textAlign: 'center' }}>
          <strong style={{ color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sun size={18} />
            Mudas da Horta (Agora)
          </strong>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c2410c', margin: '8px 0' }}>{nowSeeds}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => handleAdjust('now', -1)} disabled={nowSeeds <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>-</button>
            <button onClick={() => handleAdjust('now', 1)} disabled={diff <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>+</button>
          </div>
        </div>

        {/* Silo */}
        <div style={{ border: '2px solid #bbf7d0', borderRadius: '14px', padding: '16px', background: '#f0fdf4', textAlign: 'center' }}>
          <strong style={{ color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Shield size={18} />
            Conserto do Arado (Silo)
          </strong>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#15803d', margin: '8px 0' }}>{protectionSeeds}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => handleAdjust('prot', -1)} disabled={protectionSeeds <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>-</button>
            <button onClick={() => handleAdjust('prot', 1)} disabled={diff <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>+</button>
          </div>
        </div>

        {/* Cisterna */}
        <div style={{ border: '2px solid #bfdbfe', borderRadius: '14px', padding: '16px', background: '#eff6ff', textAlign: 'center' }}>
          <strong style={{ color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Wrench size={18} />
            Cisterna Comunitária (Depois)
          </strong>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1d4ed8', margin: '8px 0' }}>{futureSeeds}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => handleAdjust('fut', -1)} disabled={futureSeeds <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>-</button>
            <button onClick={() => handleAdjust('fut', 1)} disabled={diff <= 0} className="btn-basket-adjust" style={{ width: '36px', height: '36px' }}>+</button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.95rem', color: '#64748b', marginBottom: '20px' }}>
        {diff === 0 ? "✨ Perfeito! Todas as 10 sementes foram distribuídas com atenção." : `Faltam ${diff} sementes para distribuir.`}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '2px dashed #e5dcce', paddingTop: '20px' }}>
        <button 
          onClick={handleFinish} 
          disabled={diff !== 0} 
          className="btn-primary"
          style={{ opacity: diff === 0 ? 1 : 0.5, cursor: diff === 0 ? 'pointer' : 'not-allowed' }}
        >
          <CheckCircle size={20} />
          <span>Confirmar e Concluir a Rodada</span>
        </button>
      </div>
    </div>
  );
};
