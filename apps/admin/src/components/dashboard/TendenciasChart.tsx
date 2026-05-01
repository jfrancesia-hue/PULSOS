'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const DATA = [
  { mes: 'Ene', registros: 412000, accesos: 184000 },
  { mes: 'Feb', registros: 489000, accesos: 211000 },
  { mes: 'Mar', registros: 562000, accesos: 240000 },
  { mes: 'Abr', registros: 631000, accesos: 268000 },
  { mes: 'May', registros: 712000, accesos: 295000 },
  { mes: 'Jun', registros: 803000, accesos: 322000 },
];

export function TendenciasChart() {
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Tendencia de adopción</CardTitle>
        <CardDescription>Registros y accesos · últimos 6 meses</CardDescription>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="colorRegistros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2BD4C9" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#2BD4C9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorAccesos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97847" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#D97847" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="mes"
              stroke="#6B7A93"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7A93"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#0F1F3D',
                border: '1px solid rgba(43,212,201,0.2)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#F5F1EA' }}
            />
            <Area
              type="monotone"
              dataKey="registros"
              stroke="#2BD4C9"
              strokeWidth={2}
              fill="url(#colorRegistros)"
            />
            <Area
              type="monotone"
              dataKey="accesos"
              stroke="#D97847"
              strokeWidth={2}
              fill="url(#colorAccesos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
