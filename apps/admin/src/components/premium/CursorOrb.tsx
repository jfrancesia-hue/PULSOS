'use client';

import { useEffect, useRef } from 'react';

/**
 * Orb que sigue al cursor de forma global con un retraso suave.
 * No bloquea clicks (pointer-events: none) y respeta prefers-reduced-motion.
 */
export function CursorOrb() {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const orb = orbRef.current;
    if (!orb) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let orbX = mouseX;
    let orbY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      orb.style.opacity = '1';
    };
    const onLeave = () => {
      orb.style.opacity = '0';
    };

    const tick = () => {
      orbX += (mouseX - orbX) * 0.18;
      orbY += (mouseY - orbY) * 0.18;
      orb.style.transform = `translate(${orbX}px, ${orbY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    document.body.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={orbRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-12 w-12 rounded-full opacity-0 transition-opacity duration-300"
      style={{
        background:
          'radial-gradient(circle, rgba(43,212,201,0.45) 0%, rgba(43,212,201,0.15) 40%, transparent 70%)',
        mixBlendMode: 'screen',
        filter: 'blur(2px)',
      }}
    />
  );
}
