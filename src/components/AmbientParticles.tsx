import React, { useEffect, useRef } from 'react';
import type { Season } from '../types/game';

interface AmbientParticlesProps {
  season?: Season;
}

interface SeasonalParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'spring_flower' | 'summer_glow' | 'autumn_leaf' | 'winter_snow';
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({ season = 'Primavera' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Configurações e cores por estação
    const getSeasonalConfig = (s: Season) => {
      switch (s) {
        case 'Primavera':
          return {
            type: 'spring_flower' as const,
            colors: ['#fbcfe8', '#f472b6', '#fce7f3', '#fef08a', '#e9d5ff', '#ffffff'],
            count: 24,
            speedX: 0.6,
            speedY: 0.5
          };
        case 'Verão':
          return {
            type: 'summer_glow' as const,
            colors: ['#fde047', '#facc15', '#f59e0b', '#fbbf24', '#ffffff'],
            count: 28,
            speedX: 0.3,
            speedY: -0.4 // Sobe como pólen e vaga-lumes solares
          };
        case 'Outono':
          return {
            type: 'autumn_leaf' as const,
            colors: ['#ea580c', '#c2410c', '#d97706', '#b45309', '#f59e0b', '#78350f'],
            count: 22,
            speedX: 0.9,
            speedY: 0.7
          };
        case 'Inverno':
          return {
            type: 'winter_snow' as const,
            colors: ['#ffffff', '#f8fafc', '#e0f2fe', '#bae6fd'],
            count: 32,
            speedX: 0.2,
            speedY: 0.6
          };
      }
    };

    const config = getSeasonalConfig(season);

    const particles: SeasonalParticle[] = Array.from({ length: config.count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: (Math.random() * 0.6 + 0.2) * config.speedX,
      speedY: (Math.random() * 0.6 + 0.3) * config.speedY,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.6 + 0.3,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      type: config.type
    }));

    // Desenhar florzinha de primavera (5 pétalas arredondadas)
    const drawSpringFlower = (size: number) => {
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const px = Math.cos(angle) * (size * 0.55);
        const py = Math.sin(angle) * (size * 0.55);
        ctx.beginPath();
        ctx.arc(px, py, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Miolinho amarelo
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
    };

    // Desenhar brilho dourado de verão (sol cintilante / vaga-lume)
    const drawSummerGlow = (size: number) => {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Halo de luz dourada
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.9, 0, Math.PI * 2);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };

    // Desenhar folhinha de outono
    const drawAutumnLeaf = (size: number) => {
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Cabinho da folha
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(-size * 1.3, -size * 0.2);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    // Desenhar floco de neve de inverno
    const drawWinterSnow = (size: number) => {
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x > width + 25) p.x = -25;
        if (p.x < -25) p.x = width + 25;
        if (p.y > height + 25) p.y = -25;
        if (p.y < -25) p.y = height + 25;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        switch (p.type) {
          case 'spring_flower':
            drawSpringFlower(p.size);
            break;
          case 'summer_glow':
            drawSummerGlow(p.size);
            break;
          case 'autumn_leaf':
            drawAutumnLeaf(p.size);
            break;
          case 'winter_snow':
            drawWinterSnow(p.size);
            break;
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85
      }}
    />
  );
};
