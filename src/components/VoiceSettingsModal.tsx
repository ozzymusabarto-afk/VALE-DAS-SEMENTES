import React, { useState, useEffect } from 'react';
import { X, Volume2, Square, Play, Check, Sparkles, Mic, VolumeX } from 'lucide-react';
import { speechHelper, type SpeechPace, scoreVoice } from '../utils/speech';
import { soundManager } from '../utils/audio';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [pace, setPace] = useState<SpeechPace>('calm');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  useEffect(() => {
    const update = () => {
      const available = speechHelper.getAvailablePtVoices();
      setVoices(available);

      const current = speechHelper.getSelectedVoice();
      if (current) {
        setSelectedVoiceURI(current.voiceURI || current.name);
      }
      setPace(speechHelper.getPace());
      setIsMuted(speechHelper.isMuted());
    };

    update();
    const unsubscribe = speechHelper.subscribe(update);
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectVoice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    setSelectedVoiceURI(uri);
    speechHelper.setSelectedVoice(uri);
    soundManager.playClick();
  };

  const handleSelectPace = (newPace: SpeechPace) => {
    setPace(newPace);
    speechHelper.setPace(newPace);
    soundManager.playClick();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    speechHelper.setMuted(nextMuted);
    soundManager.playClick();
  };

  const handlePlayTest = () => {
    if (isMuted) {
      // Se estiver silenciado, ativa automaticamente para o teste
      handleToggleMute();
    }
    setIsPlayingTest(true);
    speechHelper.playTestSample(() => {
      setIsPlayingTest(false);
    });
  };

  const handleStopTest = () => {
    speechHelper.stop();
    setIsPlayingTest(false);
  };

  const handleClose = () => {
    speechHelper.stop();
    setIsPlayingTest(false);
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="hotspot-dialog-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-labelledby="voice-modal-title">
      <div 
        className="hotspot-dialog-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', borderTop: '6px solid #2e7d32' }}
      >
        {/* Cabeçalho */}
        <div className="dialog-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="dialog-icon-circle" style={{ background: '#2e7d32' }}>
              <Mic size={22} />
            </div>
            <div>
              <h3 id="voice-modal-title" className="dialog-title">Voz do Narrador do Vale</h3>
              <span className="dialog-character">Narração afetuosa e calma (Estilo Vovô Acolhedor)</span>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="dialog-close-btn"
            aria-label="Fechar configurações de voz"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status de Narração Ativa / Silenciada */}
        <div style={{
          background: isMuted ? '#fef2f2' : '#f0fdf4',
          border: `1.5px solid ${isMuted ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isMuted ? <VolumeX size={20} color="#b91c1c" /> : <Volume2 size={20} color="#15803d" />}
            <div>
              <strong style={{ display: 'block', color: isMuted ? '#991b1b' : '#166534', fontSize: '0.92rem' }}>
                {isMuted ? 'Narração por Voz Silenciada' : 'Narração por Voz Ativa'}
              </strong>
              <small style={{ color: '#64748b' }}>
                {isMuted ? 'Os textos continuam visíveis na tela.' : 'A voz lê os momentos de reflexão e botões "Ouvir".'}
              </small>
            </div>
          </div>

          <button
            onClick={handleToggleMute}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          >
            {isMuted ? 'Ativar Voz' : 'Silenciar'}
          </button>
        </div>

        {/* Banner da Voz do Vovô Narrador */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1.5px solid #86efac',
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '1.6rem' }} aria-hidden="true">👴🏼</div>
          <div>
            <strong style={{ display: 'block', color: '#166534', fontSize: '0.94rem' }}>
              Voz de Vovô Amoroso (Estúdio pt-BR Ativa)
            </strong>
            <span style={{ fontSize: '0.82rem', color: '#334155' }}>
              Tom firme, sereno e simpático gravado em estúdio com pausas naturais.
            </span>
          </div>
        </div>

        {/* Seletor de Vozes pt-BR (Fallback) */}
        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="voice-select" style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: '#292524', marginBottom: '6px' }}>
            Voz do Navegador (Para leitura livre):
          </label>

          {voices.length > 0 ? (
            <select
              id="voice-select"
              value={selectedVoiceURI}
              onChange={handleSelectVoice}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '2px solid #dfd5c2',
                background: '#faf8f3',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                color: '#292524'
              }}
            >
              {voices.map(v => {
                const score = scoreVoice(v);
                const isRecommended = score > 100;
                return (
                  <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                    {v.name} ({v.lang}) {isRecommended ? '★ Recomendada' : ''}
                  </option>
                );
              })}
            </select>
          ) : (
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic', padding: '10px', background: '#faf8f3', borderRadius: '10px' }}>
              Carregando vozes do sistema... Usando voz padrão em Português do Brasil.
            </div>
          )}

          <small style={{ display: 'block', color: '#78716c', marginTop: '6px', fontSize: '0.78rem' }}>
            ℹ️ As falas e introduções principais tocam automaticamente a voz acolhedora de estúdio do Vovô Narrador.
          </small>
        </div>

        {/* Ritmo da Fala */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', color: '#292524', marginBottom: '8px' }}>
            Ritmo da Narração:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button
              onClick={() => handleSelectPace('slow')}
              className={`prediction-option ${pace === 'slow' ? 'selected' : ''}`}
              style={{ padding: '10px 12px', textAlign: 'center', justifyContent: 'center' }}
            >
              <span>🐢 Mais devagar</span>
            </button>

            <button
              onClick={() => handleSelectPace('calm')}
              className={`prediction-option ${pace === 'calm' ? 'selected' : ''}`}
              style={{ padding: '10px 12px', textAlign: 'center', justifyContent: 'center' }}
            >
              <span>🌿 Calma (Padrão)</span>
            </button>

            <button
              onClick={() => handleSelectPace('normal')}
              className={`prediction-option ${pace === 'normal' ? 'selected' : ''}`}
              style={{ padding: '10px 12px', textAlign: 'center', justifyContent: 'center' }}
            >
              <span>⚡ Normal</span>
            </button>
          </div>
        </div>

        {/* Caixa de Teste de Voz */}
        <div style={{
          background: '#fffdf5',
          border: '2px dashed #e2d5c2',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#854d0e', fontWeight: 700, fontSize: '0.9rem' }}>
            <Sparkles size={16} />
            <span>Frase de Demonstração:</span>
          </div>

          <p style={{ margin: '0 0 14px', fontSize: '0.92rem', color: '#44403c', fontStyle: 'italic', lineHeight: '1.45' }}>
            "Olá, guardião. Vamos caminhar com calma pelo Vale. Cada semente que você cuida pode ajudar a construir uma escolha mais tranquila."
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePlayTest}
              className="btn-primary"
              style={{ padding: '9px 18px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              disabled={isPlayingTest}
            >
              <Play size={16} />
              <span>{isPlayingTest ? 'Ouvindo...' : 'Ouvir Teste'}</span>
            </button>

            {isPlayingTest && (
              <button
                onClick={handleStopTest}
                className="btn-secondary"
                style={{ padding: '9px 16px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Square size={14} />
                <span>Parar</span>
              </button>
            )}
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e7dfd5', paddingTop: '16px' }}>
          <button 
            onClick={handleClose}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Check size={18} />
            <span>Salvar e Fechar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
