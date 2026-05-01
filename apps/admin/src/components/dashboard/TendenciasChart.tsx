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
  { mes: 'Ene', registros: 412000, accesos: 184000, recetas: 23400 },
  { mes: 'Feb', registros: 489000, accesos: 211000, recetas: 28100 },
  { mes: 'Mar', registros: 562000, accesos: 240000, recetas: 31500 },
  { mes: 'Abr', registros: 631000, accesos: 268000, recetas: 35800 },
  { mes: 'May', registros: 712000, accesos: 295000, recetas: 41200 },
  { mes: 'Jun', registros: 803000, accesos: 322000, recetas: 47600 },
];

export function TendenciasChart() {
  return (
    <Card variant="default">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Tendencia de adopción</CardTitle>
            <CardDescription>Registros, accesos y recetas · últimos 6 meses</CardDescription>
          </div>
          <div className="flex items-center gap-3 text-2xs">
            <Legend2 color="#2BD4C9" label="Registros" />
            <Legend2 color="#D97847" label="Accesos" />
            <Legend2 color="#5EE7DE" label="Recetas" />
          </div>
        </div>
      </CardHeader>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRegistros" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2BD4C9" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#2BD4C9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAccesos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D97847" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#D97847" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradRecetas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5EE7DE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#5EE7DE" stopOpacity={0} />
              </linearGradient>
              <filter id="glowTurquesa" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="mes" stroke="#6B7A93" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#6B7A93"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(43,212,201,0.3)', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{
                background: 'rgba(15,31,61,0.95)',
                border: '1px solid rgba(43,212,201,0.3)',
                borderRadius: 12,
                fontSize: 12,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
              }}
              labelStyle={{ color: '#F5F1EA', fontWeight: 600 }}
            />
            <Area type="monotone" dataKey="registros" stroke="#2BD4C9" strokeWidth={2.5} fill="url(#gradRegistros)" filter="url(#glowTurquesa)" animationDuration={900} animationEasing="ease-out" />
            <Area type="monotone" dataKey="accesos" stroke="#D97847" strokeWidth={2.5} fill="url(#gradAccesos)" animationDuration={1100} animationEasing="ease-out" />
            <Area type="monotone" dataKey="recetas" stroke="#5EE7DE" strokeWidth={2} fill="url(#gradRecetas)" animationDuration={1300} animationEasing="ease-out" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function Legend2({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-pulso-niebla">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </span>
  );
}
