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

interface MagicSparklesProps {
  onlyWelcome?: boolean;
}

export const MagicGlitterCursor: React.FC<MagicSparklesProps> = ({ onlyWelcome = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Se não for a tela inicial e estiver restrito, não ativa
    if (!onlyWelcome) return;

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
    const colors = ['#ffd700', '#fff3a8', '#fef08a', '#ffffff'];

    // Adiciona uma faísca mágica estrelada em cliques ou eventos
    const addSparkle = (x: number, y: number, count = 3) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          size: Math.random() * 8 + 5,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          speedX: (Math.random() - 0.5) * 1.8,
          speedY: (Math.random() - 0.5) * 1.8 - 0.5,
          life: 0.92
        });
      }
    };

    // Apenas ao clicar/tocar em botões na tela inicial, solta um brilhinho de celebração momentâneo
    const handleClick = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      addSparkle(clientX, clientY, 6);
    };

    window.addEventListener('click', handleClick);

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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Leve cintilação esporádica e sutil na tela inicial (sem seguir o mouse)
      if (Math.random() < 0.04) {
        addSparkle(Math.random() * width, Math.random() * (height * 0.4), 1);
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
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, [onlyWelcome]);

  if (!onlyWelcome) return null;

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
