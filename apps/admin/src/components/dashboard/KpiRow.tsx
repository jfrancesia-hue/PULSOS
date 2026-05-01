import { Stat } from '@pulso/ui';
import { Users, Stethoscope, Building2, QrCode } from 'lucide-react';

export function KpiRow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        label="Ciudadanos registrados"
        value="5.842.193"
        delta={{ value: '+8,2% último mes', trend: 'up' }}
        icon={<Users size={16} />}
      />
      <Stat
        label="Profesionales verificados"
        value="48.731"
        delta={{ value: '+312 esta semana', trend: 'up' }}
        icon={<Stethoscope size={16} />}
      />
      <Stat
        label="Instituciones activas"
        value="2.153"
        delta={{ value: '+12 nuevas', trend: 'up' }}
        icon={<Building2 size={16} />}
      />
      <Stat
        label="Accesos QR (24h)"
        value="1.248"
        delta={{ value: '−4% vs ayer', trend: 'down' }}
        icon={<QrCode size={16} />}
      />
    </div>
  );
}
