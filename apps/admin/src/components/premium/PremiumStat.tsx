'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Accent = 'turquesa' | 'cobre' | 'success' | 'warning' | 'danger';

export interface PremiumStatProps {
  label: string;
  value: number;
  display?: string;
  delta?: { value: string; trend: 'up' | 'down' | 'flat' };
  spark?: number[];
  icon?: ReactNode;
  accent?: Accent;
  format?: 'number' | 'percent';
  span?: 'sm' | 'md' | 'lg';
}

const ACCENT_STYLES: Record<Accent, { text: string; bg: string; ring: string; gradFrom: string; gradTo: string; svgFrom: string; svgTo: string }> = {
  turquesa: { text: 'text-pulso-turquesa', bg: 'bg-pulso-turquesa/10', ring: 'ring-pulso-turquesa/30', gradFrom: 'from-pulso-turquesa/30', gradTo: 'to-pulso-turquesa/5', svgFrom: '#2BD4C9', svgTo: '#5EE7DE' },
  cobre:    { text: 'text-pulso-cobre',    bg: 'bg-pulso-cobre/10',    ring: 'ring-pulso-cobre/30',    gradFrom: 'from-pulso-cobre/30',    gradTo: 'to-pulso-cobre/5',    svgFrom: '#D97847', svgTo: '#ec9966' },
  success:  { text: 'text-success',        bg: 'bg-success/10',        ring: 'ring-success/30',        gradFrom: 'from-success/30',        gradTo: 'to-success/5',        svgFrom: '#2BD49A', svgTo: '#5EE7BC' },
  warning:  { text: 'text-warning',        bg: 'bg-warning/10',        ring: 'ring-warning/30',        gradFrom: 'from-warning/30',        gradTo: 'to-warning/5',        svgFrom: '#F5B647', svgTo: '#fbd382' },
  danger:   { text: 'text-danger',         bg: 'bg-danger/10',         ring: 'ring-danger/30',         gradFrom: 'from-danger/30',         gradTo: 'to-danger/5',         svgFrom: '#E55A4C', svgTo: '#f08e7e' },
};

export function PremiumStat({
  label,
  value,
  display,
  delta,
  spark,
  icon,
  accent = 'turquesa',
  format = 'number',
  span = 'sm',
}: PremiumStatProps) {
  const styles = ACCENT_STYLES[accent];
  const displayed = useCountUp(value);
  const formatted = display ?? (format === 'percent' ? `${displayed}%` : displayed.toLocaleString('es-AR'));

  const colSpan = span === 'lg' ? 'col-span-12 md:col-span-6 lg:col-span-6' : span === 'md' ? 'col-span-12 sm:col-span-6 lg:col-span-4' : 'col-span-6 sm:col-span-3';

  return (
    <article
      className={`glow-hover group relative cursor-default overflow-hidden rounded-2xl border border-white/5 bg-pulso-azul-noche/80 p-5 transition-all hover:-translate-y-1 ${colSpan}`}
    >
      <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${styles.gradFrom} ${styles.gradTo} opacity-50 blur-2xl transition-opacity group-hover:opacity-80`} />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="text-2xs font-semibold uppercase tracking-[0.14em] text-pulso-niebla">
            {label}
          </div>
          {icon ? (
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${styles.gradFrom} ${styles.gradTo} ring-1 ${styles.ring} ${styles.text} icon-bounce-hover`}>
              {icon}
            </div>
          ) : null}
        </div>

        <div className="mt-3 font-display text-3xl font-bold leading-none tracking-tight text-pulso-blanco-calido">
          {formatted}
        </div>

        <div className="mt-2 flex items-center justify-between gap-3">
          {delta ? (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${
                delta.trend === 'up' ? 'text-success' : delta.trend === 'down' ? 'text-danger' : 'text-pulso-niebla'
              }`}
            >
              {delta.trend === 'up' ? (
                <TrendingUp size={12} />
              ) : delta.trend === 'down' ? (
                <TrendingDown size={12} />
              ) : (
                <Minus size={12} />
              )}
              {delta.value}
            </span>
          ) : (
            <span />
          )}

          {spark && spark.length > 1 ? (
            <Sparkline data={spark} from={styles.svgFrom} to={styles.svgTo} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

function Sparkline({ data, from, to }: { data: number[]; from: string; to: string }) {
  const W = 80;
  const H = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = W / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${H - ((v - min) / range) * H}`).join(' ');

  const areaPoints = `0,${H} ${points} ${W},${H}`;
  const id = `sl-${from.replace('#', '')}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0.6" />
          <stop offset="100%" stopColor={from} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${id})`} />
      <polyline
        points={points}
        fill="none"
        stroke={from}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={W}
        cy={H - ((data[data.length - 1]! - min) / range) * H}
        r="2"
        fill={to}
      />
    </svg>
  );
}

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setValue(target);
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease out
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
