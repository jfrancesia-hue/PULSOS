import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  delta?: { value: string; trend: 'up' | 'down' | 'flat' };
  icon?: React.ReactNode;
}

export function Stat({ label, value, delta, icon, className, ...props }: StatProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-lg border border-white/5 bg-pulso-azul-noche/80 p-5',
        'transition-shadow hover:shadow-pulso-md',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-pulso-niebla">
          {label}
        </span>
        {icon ? <span className="text-pulso-turquesa">{icon}</span> : null}
      </div>
      <span className="font-display text-3xl font-semibold tracking-tight text-pulso-blanco-calido">
        {value}
      </span>
      {delta ? (
        <span
          className={cn(
            'inline-flex items-center gap-1 text-xs font-medium',
            delta.trend === 'up' && 'text-success',
            delta.trend === 'down' && 'text-danger',
            delta.trend === 'flat' && 'text-pulso-niebla',
          )}
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
      ) : null}
    </div>
  );
}
