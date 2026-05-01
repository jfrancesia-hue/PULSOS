'use client';

import { useState } from 'react';

interface Provincia {
  id: string;
  nombre: string;
  /** Paths SVG simplificados por provincia (proyección Mercator aproximada). */
  d: string;
  centroid: [number, number];
  /** Métrica visualizada: ciudadanos activos por provincia. */
  ciudadanos: number;
  accesosQR: number;
}

const PROVINCIAS: Provincia[] = [
  { id: 'jujuy',      nombre: 'Jujuy',           d: 'M120,40 L160,40 L165,75 L130,80 Z', centroid: [142, 60],  ciudadanos: 64_232,  accesosQR: 213 },
  { id: 'salta',      nombre: 'Salta',           d: 'M105,80 L165,75 L180,130 L120,140 Z', centroid: [142, 110], ciudadanos: 187_321, accesosQR: 612 },
  { id: 'formosa',    nombre: 'Formosa',         d: 'M180,90 L260,80 L265,120 L185,125 Z', centroid: [222, 105], ciudadanos: 32_440,  accesosQR: 86 },
  { id: 'chaco',      nombre: 'Chaco',           d: 'M180,125 L265,125 L270,170 L185,170 Z', centroid: [225, 148], ciudadanos: 89_560,  accesosQR: 232 },
  { id: 'misiones',   nombre: 'Misiones',        d: 'M275,80 L330,90 L325,150 L280,140 Z', centroid: [302, 115], ciudadanos: 71_889,  accesosQR: 312 },
  { id: 'tucuman',    nombre: 'Tucumán',         d: 'M120,140 L155,140 L160,170 L125,170 Z', centroid: [140, 155], ciudadanos: 201_432, accesosQR: 540 },
  { id: 'catamarca',  nombre: 'Catamarca',       d: 'M85,140 L120,140 L125,200 L90,200 Z', centroid: [102, 170], ciudadanos: 38_900,  accesosQR: 82 },
  { id: 'santiago',   nombre: 'Sgo. del Estero', d: 'M155,140 L210,150 L215,210 L160,205 Z', centroid: [187, 178], ciudadanos: 54_120,  accesosQR: 138 },
  { id: 'corrientes', nombre: 'Corrientes',      d: 'M260,150 L320,155 L315,215 L255,210 Z', centroid: [288, 183], ciudadanos: 62_440,  accesosQR: 175 },
  { id: 'la-rioja',   nombre: 'La Rioja',        d: 'M75,200 L125,200 L130,260 L80,260 Z', centroid: [102, 230], ciudadanos: 28_550,  accesosQR: 70 },
  { id: 'san-juan',   nombre: 'San Juan',        d: 'M55,250 L100,250 L105,310 L60,310 Z', centroid: [80, 280], ciudadanos: 33_620,  accesosQR: 95 },
  { id: 'cordoba',    nombre: 'Córdoba',         d: 'M130,210 L215,215 L220,280 L135,275 Z', centroid: [175, 245], ciudadanos: 612_345, accesosQR: 1840 },
  { id: 'santa-fe',   nombre: 'Santa Fe',        d: 'M220,210 L290,215 L295,290 L225,285 Z', centroid: [257, 250], ciudadanos: 534_829, accesosQR: 1612 },
  { id: 'entre-rios', nombre: 'Entre Ríos',      d: 'M295,225 L340,235 L335,295 L290,295 Z', centroid: [315, 262], ciudadanos: 165_872, accesosQR: 482 },
  { id: 'mendoza',    nombre: 'Mendoza',         d: 'M55,310 L130,300 L135,370 L60,370 Z', centroid: [95, 335],  ciudadanos: 312_875, accesosQR: 845 },
  { id: 'san-luis',   nombre: 'San Luis',        d: 'M130,290 L180,290 L185,360 L135,360 Z', centroid: [157, 325], ciudadanos: 38_120,  accesosQR: 92 },
  { id: 'buenos-aires', nombre: 'Buenos Aires',  d: 'M180,290 L320,300 L330,420 L185,420 Z', centroid: [253, 360], ciudadanos: 2_147_832, accesosQR: 6420 },
  { id: 'caba',       nombre: 'CABA',            d: 'M275,295 L292,295 L292,310 L275,310 Z', centroid: [284, 302], ciudadanos: 894_231, accesosQR: 3215 },
  { id: 'la-pampa',   nombre: 'La Pampa',        d: 'M75,360 L180,365 L185,430 L80,430 Z', centroid: [130, 395], ciudadanos: 22_440,  accesosQR: 58 },
  { id: 'neuquen',    nombre: 'Neuquén',         d: 'M55,375 L90,380 L95,440 L60,440 Z', centroid: [75, 408],  ciudadanos: 41_220,  accesosQR: 110 },
  { id: 'rio-negro',  nombre: 'Río Negro',       d: 'M55,440 L185,445 L190,500 L60,500 Z', centroid: [122, 470], ciudadanos: 48_770,  accesosQR: 132 },
  { id: 'chubut',     nombre: 'Chubut',          d: 'M55,505 L185,505 L190,580 L60,580 Z', centroid: [122, 540], ciudadanos: 31_550,  accesosQR: 78 },
  { id: 'santa-cruz', nombre: 'Santa Cruz',      d: 'M55,585 L175,585 L180,680 L60,680 Z', centroid: [120, 630], ciudadanos: 19_440,  accesosQR: 44 },
  { id: 'tdf',        nombre: 'Tierra del Fuego', d: 'M65,690 L165,690 L170,750 L70,750 Z', centroid: [115, 720], ciudadanos: 12_120,  accesosQR: 30 },
];

export function ArgentinaMap() {
  const [hover, setHover] = useState<Provincia | null>(null);
  const max = PROVINCIAS.reduce((m, p) => Math.max(m, p.ciudadanos), 1);

  return (
    <div className="rounded-2xl border border-white/5 bg-pulso-azul-noche/80 p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-pulso-niebla">
            Mapa epidemiológico
          </div>
          <div className="mt-1 font-display text-lg font-semibold">Distribución por provincia</div>
        </div>
        <div className="rounded-md border border-pulso-cobre/30 bg-pulso-cobre/10 px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-pulso-cobre">
          24 provincias
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="relative">
          <svg viewBox="0 0 380 780" className="h-[420px] w-full">
            <defs>
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2BD4C9" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#2BD4C9" stopOpacity="0" />
              </radialGradient>
            </defs>

            <ellipse cx="180" cy="400" rx="180" ry="380" fill="url(#mapGlow)" />

            {PROVINCIAS.map((p) => {
              const intensity = p.ciudadanos / max;
              const fill = intensityColor(intensity);
              const isHover = hover?.id === p.id;
              return (
                <g key={p.id}>
                  <path
                    d={p.d}
                    fill={fill}
                    stroke={isHover ? '#5EE7DE' : 'rgba(43,212,201,0.30)'}
                    strokeWidth={isHover ? 1.5 : 0.6}
                    onMouseEnter={() => setHover(p)}
                    onMouseLeave={() => setHover(null)}
                    style={{ cursor: 'pointer', transition: 'stroke 0.2s, fill 0.2s' }}
                  />
                  {p.ciudadanos > 200_000 ? (
                    <circle cx={p.centroid[0]} cy={p.centroid[1]} r={3} fill="#D97847" opacity="0.9" />
                  ) : null}
                </g>
              );
            })}
          </svg>

          {hover ? (
            <div className="pointer-events-none absolute right-2 top-2 rounded-md border border-pulso-turquesa/30 bg-pulso-azul-medianoche/95 px-3 py-2 text-xs shadow-pulso-md backdrop-blur">
              <div className="font-semibold text-pulso-blanco-calido">{hover.nombre}</div>
              <div className="mt-1 font-mono text-pulso-turquesa">
                {hover.ciudadanos.toLocaleString('es-AR')} ciudadanos
              </div>
              <div className="font-mono text-pulso-cobre">
                {hover.accesosQR} accesos QR
              </div>
            </div>
          ) : null}
        </div>

        {/* Top 8 provincias */}
        <div className="space-y-1.5 text-xs">
          <div className="mb-1 text-2xs font-semibold uppercase tracking-wider text-pulso-niebla">
            Top provincias
          </div>
          {[...PROVINCIAS]
            .sort((a, b) => b.ciudadanos - a.ciudadanos)
            .slice(0, 8)
            .map((p) => {
              const ratio = p.ciudadanos / max;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHover(p)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer rounded px-1 py-1 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between text-pulso-blanco-calido">
                    <span className="font-medium">{p.nombre}</span>
                    <span className="font-mono text-2xs text-pulso-niebla">
                      {(p.ciudadanos / 1000).toFixed(1)}k
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pulso-turquesa to-pulso-cobre"
                      style={{ width: `${ratio * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function intensityColor(t: number): string {
  if (t < 0.05) return 'rgba(43,212,201,0.06)';
  if (t < 0.15) return 'rgba(43,212,201,0.15)';
  if (t < 0.30) return 'rgba(43,212,201,0.28)';
  if (t < 0.50) return 'rgba(43,212,201,0.45)';
  if (t < 0.75) return 'rgba(94,231,222,0.55)';
  return 'rgba(217,120,71,0.65)';
}
