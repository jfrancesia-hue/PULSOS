'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const DATA = [
  { tipo: 'Estudio lab', cantidad: 24531 },
  { tipo: 'Imagen', cantidad: 18432 },
  { tipo: 'Receta', cantidad: 12873 },
  { tipo: 'Indicación', cantidad: 9421 },
  { tipo: 'Informe', cantidad: 6829 },
  { tipo: 'Cert.', cantidad: 3214 },
];

export function DocumentosBar() {
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Documentos cargados</CardTitle>
        <CardDescription>Por tipo · últimos 30 días</CardDescription>
      </CardHeader>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              stroke="#6B7A93"
              fontSize={11}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="tipo"
              stroke="#6B7A93"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={70}
            />
            <Tooltip
              contentStyle={{
                background: '#0F1F3D',
                border: '1px solid rgba(43,212,201,0.2)',
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="cantidad" fill="#2BD4C9" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
