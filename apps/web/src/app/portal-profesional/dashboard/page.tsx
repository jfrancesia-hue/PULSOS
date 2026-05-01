import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Stat, Button, Badge } from '@pulso/ui';
import { Search, FileText, Users, Clock } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

interface AuditEntry {
  id: string;
  occurredAt: string;
  action: string;
  targetType: string | null;
  outcome: string;
}

export default async function DashboardPro() {
  const user = await requireRole(['PROFESIONAL'], '/portal-profesional/ingresar');

  // En real, esto sería /clinical/me/recent. Por ahora usamos el audit del actor.
  const auditRes = await apiFetchAuthed<AuditEntry[]>('/admin/audit?limit=10');
  const recentActivity = auditRes.ok
    ? auditRes.data.filter((e) => ['CLINICAL_RECORD_CREATED', 'PROFILE_VIEW', 'CLINICAL_RECORD_VIEWED'].includes(e.action))
    : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
          Portal profesional
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Bienvenido/a, Dr/a. {user.professionalProfile?.apellido ?? user.email.split('@')[0]}
        </h1>
        <p className="mt-2 text-pulso-niebla">
          Acceso clínico autorizado. Buscá un paciente para empezar.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Mi matrícula" value={user.professionalProfile?.matriculaNacional ?? '—'} icon={<Users size={16} />} />
        <Stat
          label="Especialidades"
          value={user.professionalProfile?.especialidades.length ?? 0}
          icon={<FileText size={16} />}
        />
        <Stat label="Pacientes con consent" value="2" icon={<Users size={16} />} />
        <Stat label="Última actividad" value="Hoy" icon={<Clock size={16} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Buscar paciente</CardTitle>
            <CardDescription>
              Por DNI. Si no tenés consent vigente, podés solicitarlo desde el resultado.
            </CardDescription>
          </CardHeader>
          <Link href="/portal-profesional/buscar">
            <Button variant="primary" size="lg" className="w-full">
              <Search size={14} />
              Ir a búsqueda
            </Button>
          </Link>

          <div className="mt-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-pulso-niebla">
              Reglas de acceso clínico
            </div>
            <ul className="mt-3 space-y-2 text-sm text-pulso-niebla">
              <li>· Necesitás consentimiento vigente del ciudadano para ver su perfil completo.</li>
              <li>· Cada lectura y escritura queda en el log de auditoría.</li>
              <li>· No expongas datos clínicos en chat, screenshots o reportes informales.</li>
            </ul>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mi actividad reciente</CardTitle>
            <CardDescription>Últimas lecturas y escrituras tuyas.</CardDescription>
          </CardHeader>
          {recentActivity.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-xs text-pulso-niebla">
              Sin actividad reciente.
            </div>
          ) : (
            <ul className="space-y-2">
              {recentActivity.slice(0, 5).map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
                >
                  <span className="text-pulso-blanco-calido">{labelAction(e.action)}</span>
                  <span className="text-pulso-niebla">{relTime(e.occurredAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

function labelAction(action: string): string {
  const map: Record<string, string> = {
    PROFILE_VIEW: 'Vista de perfil clínico',
    CLINICAL_RECORD_VIEWED: 'Lectura de timeline clínico',
    CLINICAL_RECORD_CREATED: 'Carga de evolución',
  };
  return map[action] ?? action;
}

function relTime(iso: string): string {
  const diff = Date.now() - +new Date(iso);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'recién';
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  return new Date(iso).toLocaleDateString('es-AR');
}
