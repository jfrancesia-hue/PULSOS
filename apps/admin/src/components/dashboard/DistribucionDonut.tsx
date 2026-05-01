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
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Distribución por cobertura</CardTitle>
        <CardDescription>Sobre 5,8M ciudadanos</CardDescription>
      </CardHeader>
      <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {DATA.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0F1F3D',
                  border: '1px solid rgba(43,212,201,0.2)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2 text-sm">
          {DATA.map((d) => (
            <li key={d.name} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
              <span className="flex-1 text-pulso-niebla">{d.name}</span>
              <span className="font-mono text-pulso-blanco-calido">{d.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
