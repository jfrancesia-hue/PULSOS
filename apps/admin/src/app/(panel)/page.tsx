import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import {
  Users,
  Stethoscope,
  Building2,
  QrCode,
  ShieldCheck,
  Activity,
  Bell,
} from 'lucide-react';
import { apiAuthed } from '@/lib/api';
import { PremiumStat } from '@/components/premium/PremiumStat';
import { ActivityHeatmap } from '@/components/premium/ActivityHeatmap';
import { ArgentinaMap } from '@/components/premium/ArgentinaMap';
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
    apiAuthed<AuditEntry[]>('/admin/audit?limit=10'),
  ]);

  const metrics = metricsRes.ok ? metricsRes.data : null;
  const chain = chainRes.ok ? chainRes.data : null;
  const audit = auditRes.ok ? auditRes.data : [];

  return (
    <div className="space-y-8">
      <span className="orb orb-1" aria-hidden="true" />
      <span className="orb orb-2" aria-hidden="true" />
      <span className="orb orb-3" aria-hidden="true" />

      {/* Hero institucional con foto Cordillera (Unsplash verificado) */}
      <header className="relative overflow-hidden rounded-3xl border border-white/5 bg-pulso-azul-noche">
        <div className="absolute inset-0 -z-0">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=2000&q=75"
            alt=""
            fill
            quality={70}
            sizes="100vw"
            priority
            unoptimized
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pulso-azul-medianoche via-pulso-azul-medianoche/85 to-pulso-azul-noche/40" />
        </div>
        <div className="pulso-topo absolute inset-0 -z-0 opacity-40" aria-hidden="true" />

        <div className="relative grid gap-6 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-10">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="text-2xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
                ⚡ Bienvenido, equipo Pulso
              </div>
              {chain ? (
                <Badge variant={chain.ok ? 'success' : 'danger'}>
                  <ShieldCheck size={12} />
                  {chain.ok ? 'Hash chain íntegro' : 'Quebrado'}
                </Badge>
              ) : null}
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Resumen <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-cobre bg-clip-text text-transparent">institucional</span>
            </h1>
            <p className="mt-3 max-w-lg text-sm text-pulso-niebla">
              Panel de control con datos en tiempo real de Supabase. Cada acción queda registrada
              en el log append-only con verificación SHA-256.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-pulso-niebla">
              <div className="flex items-center gap-2 rounded-md border border-white/5 bg-pulso-azul-medianoche/60 px-3 py-1.5">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-success" />
                <span>API operativa</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-white/5 bg-pulso-azul-medianoche/60 px-3 py-1.5">
                <Activity size={12} className="text-pulso-turquesa" />
                <span>{metrics?.audits.toLocaleString('es-AR') ?? '—'} eventos auditados</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-pulso-cobre/30 bg-pulso-cobre/10 px-3 py-1.5 text-pulso-cobre">
                <ShieldCheck size={12} />
                <span>{chain?.totalChecked ?? '—'} filas verificadas</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-pulso-turquesa/20 via-transparent to-pulso-cobre/20 blur-2xl" />
            <div className="rounded-2xl border border-pulso-turquesa/30 bg-pulso-azul-medianoche/80 p-5 backdrop-blur">
              <div className="flex items-center justify-between text-2xs uppercase tracking-wider text-pulso-niebla">
                <span className="flex items-center gap-1.5">
                  <Activity size={11} className="text-pulso-turquesa" />
                  Pulso del sistema
                </span>
                <span className="font-mono text-pulso-turquesa">72 bpm</span>
              </div>
              <svg viewBox="0 0 320 60" className="mt-3 h-14 w-full">
                <defs>
                  <linearGradient id="heroPulse" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2BD4C9" stopOpacity="0" />
                    <stop offset="50%" stopColor="#2BD4C9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#D97847" stopOpacity="0.7" />
                  </linearGradient>
                  <filter id="heroGlow">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <path
                  d="M0,30 L60,30 L70,15 L80,45 L90,5 L100,55 L110,30 L160,30 L170,18 L180,42 L190,10 L200,50 L210,30 L320,30"
                  stroke="url(#heroPulse)"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinejoin="round"
                  filter="url(#heroGlow)"
                  className="pulse-line"
                />
              </svg>
              <div className="mt-2 grid grid-cols-3 gap-2 text-2xs">
                <Mini label="Latencia" value="142ms" accent="success" />
                <Mini label="Uptime" value="99.98%" accent="turquesa" />
                <Mini label="Errors" value="0.02%" accent="success" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-12 gap-4 stagger">
        <PremiumStat label="Ciudadanos" value={metrics?.citizens ?? 0} icon={<Users size={16} strokeWidth={1.8} />} accent="turquesa" delta={{ value: '+8.2% último mes', trend: 'up' }} spark={[120, 132, 128, 145, 168, 175, 192, 211]} span="md" />
        <PremiumStat label="Profesionales" value={metrics?.professionals ?? 0} icon={<Stethoscope size={16} strokeWidth={1.8} />} accent="cobre" delta={{ value: '+312 esta semana', trend: 'up' }} spark={[8, 12, 15, 18, 24, 28, 32, 40]} span="md" />
        <PremiumStat label="Instituciones" value={metrics?.institutions ?? 0} icon={<Building2 size={16} strokeWidth={1.8} />} accent="cobre" delta={{ value: '+12 nuevas', trend: 'up' }} spark={[2, 3, 5, 6, 8, 9, 10, 12]} span="md" />
        <PremiumStat label="QR de emergencia" value={metrics?.qrs ?? 0} icon={<QrCode size={16} strokeWidth={1.8} />} accent="cobre" delta={{ value: '−4% vs ayer', trend: 'down' }} spark={[40, 38, 42, 35, 30, 28, 32, 26]} span="md" />
      </div>

      {/* Mapa + Heatmap */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ArgentinaMap />
        <div className="space-y-6">
          <ActivityHeatmap total={metrics?.audits} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={14} className="text-pulso-cobre" />
                Actividad reciente
              </CardTitle>
              <CardDescription>Últimos eventos del log auditable.</CardDescription>
            </CardHeader>
            {audit.length === 0 ? (
              <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-xs text-pulso-niebla">
                Sin actividad registrada todavía.
              </div>
            ) : (
              <ul className="divide-y divide-white/5 stagger">
                {audit.slice(0, 6).map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
                          e.action.includes('EMERGENCY') || e.action.includes('PRESCRIPTION')
                            ? 'bg-pulso-cobre/15 text-pulso-cobre'
                            : 'bg-pulso-turquesa/15 text-pulso-turquesa'
                        }`}
                      >
                        <Activity size={11} />
                      </div>
                      <div>
                        <div className="font-medium text-pulso-blanco-calido">
                          {e.action.replace(/_/g, ' ').toLowerCase()}
                        </div>
                        <div className="text-2xs text-pulso-niebla">
                          {e.actorRole ?? 'Sistema'} · {e.targetType ?? '—'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-2xs text-pulso-niebla">
                      {new Date(e.occurredAt).toLocaleString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TendenciasChart />
        <DistribucionDonut />
      </div>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent: 'success' | 'turquesa' | 'cobre' }) {
  const color = accent === 'success' ? 'text-success' : accent === 'cobre' ? 'text-pulso-cobre' : 'text-pulso-turquesa';
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5 text-center">
      <div className="text-2xs uppercase tracking-wider text-pulso-niebla">{label}</div>
      <div className={`mt-0.5 font-mono text-sm font-semibold ${color}`}>{value}</div>
    </div>
  );
}
