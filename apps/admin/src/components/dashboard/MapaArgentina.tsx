import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@pulso/ui';

interface ProvinciaData {
  nombre: string;
  pacientes: number;
  intensidad: number;
}

const PROVINCIAS: ProvinciaData[] = [
  { nombre: 'Buenos Aires', pacientes: 2147832, intensidad: 1 },
  { nombre: 'CABA', pacientes: 894231, intensidad: 0.95 },
  { nombre: 'Córdoba', pacientes: 612345, intensidad: 0.78 },
  { nombre: 'Santa Fe', pacientes: 534829, intensidad: 0.72 },
  { nombre: 'Mendoza', pacientes: 312875, intensidad: 0.55 },
  { nombre: 'Tucumán', pacientes: 201432, intensidad: 0.42 },
  { nombre: 'Salta', pacientes: 187321, intensidad: 0.38 },
  { nombre: 'Entre Ríos', pacientes: 165872, intensidad: 0.34 },
];

export function MapaArgentina() {
  return (
    <Card variant="default" className="h-full">
      <CardHeader>
        <CardTitle>Mapa epidemiológico</CardTitle>
        <CardDescription>Pacientes activos por provincia · últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <ArgentinaSilhouette />
          </div>
          <ul className="flex-1 space-y-2 text-sm">
            {PROVINCIAS.map((p) => (
              <li key={p.nombre} className="flex items-center gap-3">
                <div className="h-2 w-12 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pulso-turquesa-deep to-pulso-turquesa"
                    style={{ width: `${p.intensidad * 100}%` }}
                  />
                </div>
                <span className="flex-1 text-pulso-blanco-calido">{p.nombre}</span>
                <span className="font-mono text-xs text-pulso-niebla">
                  {p.pacientes.toLocaleString('es-AR')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ArgentinaSilhouette() {
  return (
    <svg
      viewBox="0 0 160 280"
      width="160"
      height="280"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Silueta de Argentina"
    >
      <defs>
        <linearGradient id="argGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(43,212,201,0.45)" />
          <stop offset="50%" stopColor="rgba(43,212,201,0.30)" />
          <stop offset="100%" stopColor="rgba(217,120,71,0.30)" />
        </linearGradient>
      </defs>
      <path
        d="M80 12 L92 24 L98 38 L96 52 L102 64 L106 78 L102 92 L108 106 L106 122 L112 138 L108 154 L102 170 L96 186 L88 200 L82 216 L76 232 L70 246 L62 258 L52 268 L46 274 L40 268 L46 254 L52 240 L58 226 L62 210 L68 196 L72 180 L70 164 L66 148 L60 132 L56 116 L58 100 L62 84 L68 70 L72 56 L74 42 L76 28 Z"
        fill="url(#argGradient)"
        stroke="rgba(43,212,201,0.6)"
        strokeWidth="0.8"
      />
      <circle cx="80" cy="80" r="3" fill="#2BD4C9" />
      <circle cx="68" cy="120" r="2.4" fill="#2BD4C9" opacity="0.8" />
      <circle cx="74" cy="150" r="2" fill="#5EE7DE" opacity="0.7" />
      <circle cx="62" cy="180" r="1.8" fill="#5EE7DE" opacity="0.6" />
    </svg>
  );
}
