'use client';

import { useState } from 'react';

interface DayCell {
  date: string; // YYYY-MM-DD
  count: number;
}

/**
 * Heatmap GitHub-style: 53 semanas × 7 días.
 * `data` opcional — si falta, genera una grilla determinística para visualización demo.
 */
export function ActivityHeatmap({
  data,
  total,
  title = 'Actividad anual',
  subtitle = 'Eventos auditados por día — últimos 12 meses',
}: {
  data?: DayCell[];
  total?: number;
  title?: string;
  subtitle?: string;
}) {
  const cells = data ?? buildDeterministicGrid();
  const max = cells.reduce((m, c) => Math.max(m, c.count), 1);
  const computedTotal = total ?? cells.reduce((s, c) => s + c.count, 0);
  const [hover, setHover] = useState<DayCell | null>(null);

  return (
    <div className="rounded-2xl border border-white/5 bg-pulso-azul-noche/80 p-5">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pulso-niebla">
            {title}
          </div>
          <div className="mt-0.5 text-sm text-pulso-niebla/80">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="font-display text-2xl font-bold text-pulso-turquesa">
            {computedTotal.toLocaleString('es-AR')}
          </div>
          <div className="text-2xs uppercase tracking-wider text-pulso-niebla">eventos</div>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-grid grid-flow-col grid-rows-7 gap-[3px]">
          {cells.map((c) => {
            const intensity = c.count / max;
            const color = intensityColor(intensity);
            return (
              <button
                key={c.date}
                type="button"
                title={`${c.date} · ${c.count} eventos`}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                className="h-2.5 w-2.5 rounded-[2px] transition-transform hover:scale-150"
                style={{ background: color, outline: hover?.date === c.date ? '1px solid #2BD4C9' : undefined }}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-2xs text-pulso-niebla">
        <div>
          {hover ? (
            <span>
              <strong className="font-semibold text-pulso-blanco-calido">
                {new Date(hover.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
              <span className="ml-2">{hover.count} eventos</span>
            </span>
          ) : (
            <span className="opacity-70">Pasá el mouse sobre un cuadro para ver el detalle.</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-70">Menos</span>
          {[0.05, 0.25, 0.5, 0.75, 1].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ background: intensityColor(i) }}
            />
          ))}
          <span className="opacity-70">Más</span>
        </div>
      </div>
    </div>
  );
}

function intensityColor(t: number): string {
  if (t === 0) return 'rgba(255,255,255,0.04)';
  if (t < 0.15) return 'rgba(43,212,201,0.18)';
  if (t < 0.35) return 'rgba(43,212,201,0.40)';
  if (t < 0.6)  return 'rgba(43,212,201,0.65)';
  if (t < 0.85) return 'rgba(94,231,222,0.80)';
  // El pico bordea cobre (transición bonita en el extremo).
  return 'rgba(217,120,71,0.90)';
}

function buildDeterministicGrid(): DayCell[] {
  const out: DayCell[] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay()); // ajustar a domingo

  for (let i = 0; i < 371; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    if (d > today) continue;
    const seed = (d.getTime() / 86400000) | 0;
    const r = ((seed * 9301 + 49297) % 233280) / 233280;
    const noise = Math.pow(r, 1.6); // más zeros que peaks
    // Más actividad en días laborables, menos en fin de semana.
    const dow = d.getDay();
    const factor = dow === 0 || dow === 6 ? 0.4 : 1;
    const count = Math.floor(noise * factor * 80);
    out.push({ date: d.toISOString().slice(0, 10), count });
  }
  return out;
}
