import { Stat, Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { Users, Stethoscope, Building2, QrCode, ShieldCheck } from 'lucide-react';
import { apiAuthed } from '@/lib/api';
import { MapaArgentina } from '@/components/dashboard/MapaArgentina';
import { TendenciasChart } from '@/components/dashboard/TendenciasChart';
import { DistribucionDonut } from '@/components/dashboard/DistribucionDonut';

interface Metrics {
  users: number;
  citizens: number;
  professionals: number;
  institutions: number;
  qrs: number;
  audits: number;
}

interface ChainResult {
  ok: boolean;
  totalChecked: number;
}

interface AuditEntry {
  id: string;
  occurredAt: string;
  action: string;
  outcome: string;
  actorRole: string | null;
  targetType: string | null;
}

export default async function AdminHome() {
  const [metricsRes, chainRes, auditRes] = await Promise.all([
    apiAuthed<Metrics>('/admin/metrics'),
    apiAuthed<ChainResult>('/admin/audit/verify'),
    apiAuthed<AuditEntry[]>('/admin/audit?limit=8'),
  ]);

  const metrics = metricsRes.ok ? metricsRes.data : null;
  const chain = chainRes.ok ? chainRes.data : null;
  const audit = auditRes.ok ? auditRes.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Bienvenido, equipo Pulso
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Resumen institucional</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Datos reales de la base de datos. Hash chain verificado en cada carga.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Ciudadanos" value={metrics?.citizens.toLocaleString('es-AR') ?? '—'} icon={<Users size={16} />} />
        <Stat label="Profesionales" value={metrics?.professionals.toLocaleString('es-AR') ?? '—'} icon={<Stethoscope size={16} />} />
        <Stat label="Instituciones" value={metrics?.institutions.toLocaleString('es-AR') ?? '—'} icon={<Building2 size={16} />} />
        <Stat label="QR de emergencia" value={metrics?.qrs.toLocaleString('es-AR') ?? '—'} icon={<QrCode size={16} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Integridad del audit log</CardTitle>
              {chain ? (
                <Badge variant={chain.ok ? 'success' : 'danger'}>
                  <ShieldCheck size={12} />
                  {chain.ok ? 'Hash chain íntegro' : 'Quebrado'}
                </Badge>
              ) : (
                <Badge variant="warning">Sin verificar</Badge>
              )}
            </div>
            <CardDescription>
              Se verifican las últimas 1.000 filas del audit log con SHA-256 secuencial.
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-3 gap-4 text-center">
            <Mini label="Filas verificadas" value={chain?.totalChecked.toLocaleString('es-AR') ?? '0'} />
            <Mini label="Total eventos" value={metrics?.audits.toLocaleString('es-AR') ?? '0'} />
            <Mini label="Estado" value={chain?.ok ? 'OK' : '?'} accent={chain?.ok ? 'success' : 'danger'} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimos 8 eventos del log.</CardDescription>
          </CardHeader>
          {audit.length === 0 ? (
            <Empty>Sin actividad registrada.</Empty>
          ) : (
            <ul className="divide-y divide-white/5">
              {audit.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <div className="font-medium text-pulso-blanco-calido">{e.action.replace(/_/g, ' ')}</div>
                    <div className="text-xs text-pulso-niebla">
                      {e.actorRole ?? 'Sistema'} · {e.targetType ?? '—'}
                    </div>
                  </div>
                  <div className="text-right text-xs text-pulso-niebla">
                    {new Date(e.occurredAt).toLocaleString('es-AR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <MapaArgentina />
        <DistribucionDonut />
      </div>

      <TendenciasChart />
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: 'success' | 'danger' }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-4">
      <div className="text-2xs uppercase tracking-wider text-pulso-niebla">{label}</div>
      <div
        className={`mt-1 font-display text-2xl font-bold ${
          accent === 'success' ? 'text-success' : accent === 'danger' ? 'text-danger' : 'text-pulso-blanco-calido'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-sm text-pulso-niebla">
      {children}
    </div>
  );
}
