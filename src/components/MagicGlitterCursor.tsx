import React, { useEffect, useRef } from 'react';

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  rotation: number;
  speedX: number;
  speedY: number;
  life: number;
}

export const MagicGlitterCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId: number;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: SparkleParticle[] = [];
    const colors = ['#ffd700', '#fff3a8', '#ffeb3b', '#80e27e', '#81d4fa', '#ffffff'];

    // Adiciona uma faísca mágica estrelada
    const addSparkle = (x: number, y: number, count = 2) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          size: Math.random() * 8 + 6,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5 - 0.8, // Sobe de leve
          life: 0.95
        });
      }
    };

    // Rastro do mouse / toque da criança
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      addSparkle(clientX, clientY, 2);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Desenha estrela de 4 pontas mágica (✨)
    const drawFourPointStar = (x: number, y: number, radius: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(Math.cos((i * Math.PI) / 2) * radius, Math.sin((i * Math.PI) / 2) * radius);
        ctx.lineTo(
          Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.28),
          Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (radius * 0.28)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // Loop de renderização
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Esporadicamente gerar estrelinhas cintilantes aleatórias na tela para o ambiente parecer mágico
      if (Math.random() < 0.1) {
        addSparkle(Math.random() * width, Math.random() * height, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity *= p.life;
        p.rotation += 0.05;

        if (p.opacity < 0.03) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        drawFourPointStar(p.x, p.y, p.size, p.rotation);
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};
