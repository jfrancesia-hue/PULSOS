'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  /** Si true aplica también un border glow trace en hover */
  borderGlow?: boolean;
  /** Si true aplica magnetic effect leve en el contenido */
  magnetic?: boolean;
}

/**
 * Card con tilt 3D según posición del cursor.
 * Pure CSS perspective + transform — performante.
 */
export function TiltCard({
  children,
  className = '',
  intensity = 8,
  borderGlow = false,
  magnetic = false,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg)`;
    if (magnetic) {
      el.style.setProperty('--mx', String(x));
      el.style.setProperty('--my', String(y));
    }
  }

  function onMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    if (magnetic) {
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
    }
  }

  const style: CSSProperties = {
    transformStyle: 'preserve-3d',
    transition: 'transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)',
    willChange: 'transform',
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`${borderGlow ? 'border-glow' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
