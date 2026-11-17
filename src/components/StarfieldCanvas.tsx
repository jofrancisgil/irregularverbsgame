import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
}

export function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let stars: Star[] = [];
    let rafId = 0;

    const buildStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = Math.min(90, Math.floor((width * height) / 14000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.6 + 0.6,
        color: Math.random() > 0.35 ? '#e2e8f0' : Math.random() > 0.5 ? '#7dd3fc' : '#fde68a',
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0015 + 0.0005,
      }));
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const alpha = prefersReduced ? 0.35 : 0.2 + 0.35 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!prefersReduced) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    buildStars();
    rafId = requestAnimationFrame(drawFrame);

    const onResize = () => {
      buildStars();
      if (prefersReduced) {
        drawFrame(0);
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
}
