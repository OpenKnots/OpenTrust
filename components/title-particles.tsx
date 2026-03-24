"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  hue: number;
}

interface TitleParticlesProps {
  className?: string;
}

const PARTICLE_COUNT = 60;
const MAX_SPEED = 0.6;

export function TitleParticles({ className }: TitleParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const illuminatedRef = useRef(false);
  const fadeRef = useRef(0); // 0 = still, 1 = fully moving
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * MAX_SPEED * 2,
        vy: (Math.random() - 0.5) * MAX_SPEED * 2,
        size: Math.random() * 2 + 0.5,
        baseOpacity: Math.random() * 0.5 + 0.15,
        opacity: 0,
        hue: Math.random() * 20 - 10, // slight hue variation around red
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = rect.width;
      const h = rect.height;

      // Ease fade toward target
      const target = illuminatedRef.current ? 1 : 0;
      fadeRef.current += (target - fadeRef.current) * 0.04;
      const fade = fadeRef.current;

      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particlesRef.current) {
        // Move only when illuminated (scaled by fade)
        p.x += p.vx * fade;
        p.y += p.vy * fade;

        // Subtle attraction toward mouse when illuminated
        if (fade > 0.05) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 10 && dist < 300) {
            p.vx += (dx / dist) * 0.008 * fade;
            p.vy += (dy / dist) * 0.008 * fade;
          }
        }

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        // Wrap edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Opacity: dim when still, bright when moving
        p.opacity = p.baseOpacity * (0.15 + 0.85 * fade);

        // Draw particle
        const r = 220 + p.hue;
        const g = 60 + p.hue * 2;
        const b = 50 + p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();

        // Glow
        if (fade > 0.1 && p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.12 * fade})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  const handlePointerEnter = () => {
    illuminatedRef.current = true;
  };

  const handlePointerLeave = () => {
    illuminatedRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  return (
    <div
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "auto", zIndex: 0 }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
