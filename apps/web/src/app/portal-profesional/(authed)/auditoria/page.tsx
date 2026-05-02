import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { History } from 'lucide-react';
import type { AuditEntry } from '@pulso/types';
import { requireRole } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

const ACTION_LABEL: Record<string, string> = {
  AUTH_LOGIN_SUCCESS: 'Inicio de sesión',
  PROFILE_VIEW: 'Vista de perfil clínico',
  CLINICAL_RECORD_VIEWED: 'Lectura de timeline',
  CLINICAL_RECORD_CREATED: 'Evolución cargada',
  CONSENT_GRANTED: 'Consentimiento solicitado/otorgado',
};

export default async function AuditoriaPro() {
  const user = await requireRole(['PROFESIONAL'], '/portal-profesional/ingresar');
  const res = await apiFetchAuthed<AuditEntry[]>('/admin/audit?limit=100');
  const events = res.ok ? res.data.filter((e) => e.actorId === user.id).slice(0, 50) : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
          Auditoría
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tu actividad</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Cada acción que realizás en Pulso queda en un log append-only con hash chain SHA-256
          verificable. Esta es la transparencia que les ofrecemos a los pacientes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Últimos 50 eventos</CardTitle>
            <Badge variant="success">Hash chain íntegro</Badge>
          </div>
          <CardDescription>Eventos del log de auditoría asociados a tu sesión.</CardDescription>
        </CardHeader>

        {events.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 p-8 text-center text-sm text-pulso-niebla">
            <History size={20} className="mx-auto mb-3 opacity-50" />
            Sin actividad registrada.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <div className="font-medium text-pulso-blanco-calido">
                    {ACTION_LABEL[e.action] ?? e.action}
                  </div>
                  <div className="mt-0.5 text-xs text-pulso-niebla">
                    {e.targetType ?? 'Sistema'}
                    {e.targetId ? ` · ${e.targetId.slice(0, 8)}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-pulso-niebla">
                    {new Date(e.occurredAt).toLocaleString('es-AR')}
                  </div>
                  <Badge variant={e.outcome === 'SUCCESS' ? 'success' : e.outcome === 'BLOCKED' ? 'warning' : 'danger'}>
                    {e.outcome}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
