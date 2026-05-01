'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const DATA = [
  { name: 'Obra social', value: 58, color: '#2BD4C9' },
  { name: 'Prepaga', value: 22, color: '#5EE7DE' },
  { name: 'Pública', value: 16, color: '#D97847' },
  { name: 'Sin cobertura', value: 4, color: '#475873' },
];

export function DistribucionDonut() {
  const total = DATA.reduce((s, d) => s + d.value, 0);
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Distribución por cobertura</CardTitle>
        <CardDescription>Sobre 5,8M ciudadanos</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
        <div className="relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {DATA.map((d) => (
                  <radialGradient key={d.name} id={`grad-${d.name.replace(/\s+/g, '')}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={d.color} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={d.color} stopOpacity="0.7" />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={DATA}
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                animationDuration={900}
                animationEasing="ease-out"
              >
                {DATA.map((d) => (
                  <Cell key={d.name} fill={`url(#grad-${d.name.replace(/\s+/g, '')})`} stroke={d.color} strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,31,61,0.95)',
                  border: '1px solid rgba(43,212,201,0.3)',
                  borderRadius: 12,
                  fontSize: 12,
                  backdropFilter: 'blur(8px)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-display text-2xl font-bold">{total}%</div>
            <div className="text-2xs uppercase tracking-wider text-pulso-niebla">cobertura</div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          {DATA.map((d) => (
            <li key={d.name} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }} />
              <span className="flex-1 text-pulso-niebla">{d.name}</span>
              <span className="font-mono font-semibold text-pulso-blanco-calido">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
