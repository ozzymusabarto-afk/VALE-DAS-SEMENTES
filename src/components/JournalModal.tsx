import React from 'react';
import { X, Check, PenTool, Palette, Eraser } from 'lucide-react';
import type { JournalEntry, SeedAllocation } from '../types/game';
import { soundManager } from '../utils/audio';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionCards: string[];
  predictionText: string;
  allocation: SeedAllocation;
  onSaveEntry?: (entry: JournalEntry) => void;
  onProceedToTransfer?: () => void;
  isPostRound?: boolean;
}

const FEELING_OPTIONS = [
  { id: 'calm', icon: '😌', label: 'Tranquilo' },
  { id: 'thoughtful', icon: '🤔', label: 'Pensativo' },
  { id: 'learned', icon: '💡', label: 'Aprendi algo novo' },
  { id: 'surprised', icon: '🌦️', label: 'Meio surpreso' },
  { id: 'happy', icon: '🌱', label: 'Confiante para a próxima' }
];

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  onClose,
  predictionCards,
  predictionText,
  allocation,
  onProceedToTransfer,
  isPostRound = false
}) => {
  const [reflection, setReflection] = React.useState('');
  const [feeling, setFeeling] = React.useState('calm');
  const [selectedToolColor, setSelectedToolColor] = React.useState('#2e7d32');
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const isDrawing = React.useRef(false);

  React.useEffect(() => {
    if (isOpen) {
      soundManager.playPageFlip();
    }
  }, [isOpen]);

  // Canvas simples para desenhos da criança
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = selectedToolColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="journal-modal" role="dialog" aria-modal="true" aria-label="Diário de Bordo do Explorador">
      <div className="journal-book">
        <div className="journal-tape">DIÁRIO DO GUARDIÃO • VALE DAS SEMENTES</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h2 style={{ margin: '0', fontSize: '1.65rem', color: '#5d4037', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenTool size={22} color="#795548" />
              <span>Meu Diário de Bordo</span>
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#8d6e63' }}>
              Aqui suas memórias, dúvidas e ideias se transformam em sabedoria.
            </span>
          </div>

          <button 
            onClick={onClose} 
            className="btn-icon" 
            style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
            aria-label="Fechar diário"
          >
            <X size={20} />
          </button>
        </div>

        {/* Bloco 1: O que previa antes */}
        <div style={{ background: '#f5efe3', border: '1px dashed #d7ccc8', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
          <strong style={{ display: 'block', color: '#5d4037', fontSize: '0.95rem', marginBottom: '6px' }}>
            🌾 O que imaginei antes de distribuir as 12 sementes:
          </strong>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#4e342e', fontStyle: 'italic' }}>
            {predictionText || "Dediquei atenção aos imprevistos e quis observar com calma o que aconteceria nesta estação."}
          </p>
          {predictionCards.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {predictionCards.map((c) => (
                <span key={c} style={{ fontSize: '0.75rem', background: '#e0d5c0', padding: '2px 8px', borderRadius: '999px', color: '#5d4037' }}>
                  {c === 'silo_care' ? '🛡️ Cuidado com o Silo' : c === 'now_care' ? '🍎 Garantir Presente' : c === 'bridge_care' ? '🌉 Foco na Ponte' : '🌱 Observar com calma'}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '0.85rem', color: '#6d4c41' }}>
            <span>Agora: <strong>{allocation.now}</strong></span>
            <span>Silo (Proteção): <strong>{allocation.protection}</strong></span>
            <span>Ponte (Futuro): <strong>{allocation.future}</strong></span>
          </div>
        </div>

        {/* Bloco 2: Como me sinto */}
        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontWeight: 700, color: '#5d4037', marginBottom: '8px', fontSize: '0.95rem' }}>
            Como você se sente com o resultado de hoje?
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {FEELING_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => setFeeling(opt.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '999px',
                  border: '2px solid',
                  borderColor: feeling === opt.id ? '#4caf50' : '#d7ccc8',
                  background: feeling === opt.id ? '#e8f5e9' : 'white',
                  fontWeight: feeling === opt.id ? 700 : 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bloco 3: O que você aprendeu com esta situação */}
        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="journal-reflection" style={{ display: 'block', fontWeight: 700, color: '#5d4037', marginBottom: '6px', fontSize: '0.95rem' }}>
            O que você faria igual ou diferente na próxima estação? (opcional)
          </label>
          <textarea
            id="journal-reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Exemplo: Gostei de ter sementes no Silo porque o vento nos pegou de surpresa..."
            rows={2}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              border: '2px solid #d7ccc8',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              background: '#fffdf9'
            }}
          />
        </div>

        {/* Bloco 4: Espaço de Desenho / Carimbos simples */}
        <div style={{ background: '#ffffff', border: '2px solid #e0d5c0', borderRadius: '14px', padding: '12px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#5d4037', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Palette size={16} />
              Desenhe um símbolo da sua estação (sementes, telhado, sol ou ponte):
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {['#2e7d32', '#e65100', '#1565c0', '#6a1b9a', '#8d6e63'].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedToolColor(color)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: color,
                    border: selectedToolColor === color ? '2px solid black' : '1px solid white',
                    cursor: 'pointer'
                  }}
                  aria-label={`Cor ${color}`}
                />
              ))}
              <button 
                onClick={clearCanvas} 
                className="btn-icon" 
                style={{ padding: '4px 8px', fontSize: '0.75rem', marginLeft: '6px' }}
                title="Limpar desenho"
              >
                <Eraser size={14} />
                <span>Limpar</span>
              </button>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={640}
            height={110}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onMouseMove={draw}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            style={{
              width: '100%',
              height: '110px',
              background: '#faf8f4',
              borderRadius: '8px',
              border: '1px dashed #d7ccc8',
              cursor: 'crosshair',
              touchAction: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
          <button onClick={onClose} className="btn-secondary">
            Guardar Diário
          </button>

          {isPostRound && onProceedToTransfer && (
            <button 
              onClick={() => {
                soundManager.playChime();
                onProceedToTransfer();
              }} 
              className="btn-primary"
            >
              <Check size={18} />
              <span>Concluir Reflexão & Nova Situação</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
