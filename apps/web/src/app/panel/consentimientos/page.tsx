import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { ShieldCheck, ShieldOff, Bell } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { PendingConsentActions, RevokeConsentButton } from './ConsentActions';

interface ConsentItem {
  id: string;
  scopes: string[];
  motivo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED' | 'EXPIRED';
  requestedAt: string;
  grantedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  rejectionReason: string | null;
  profesional: { nombre: string; apellido: string; matriculaNacional: string | null } | null;
  institucion: { razonSocial: string; fantasyName: string | null } | null;
}

const SCOPE_LABEL: Record<string, string> = {
  PERFIL_BASICO: 'Perfil básico',
  PERFIL_COMPLETO: 'Perfil completo',
  TIMELINE_CLINICO: 'Historia clínica',
  CARGA_EVOLUCION: 'Cargar evoluciones',
  EMERGENCIA: 'Emergencia',
};

export default async function ConsentimientosPage() {
  await requireUser();
  const res = await apiFetchAuthed<ConsentItem[]>('/pulso-id/me/consentimientos');
  const consents = res.ok ? res.data : [];

  const pendientes = consents.filter((c) => c.status === 'PENDING');
  const vigentes = consents.filter((c) => c.status === 'APPROVED' && isStillValid(c));
  const inactivos = consents.filter(
    (c) => c.status !== 'PENDING' && (c.status !== 'APPROVED' || !isStillValid(c)),
  );

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Consentimientos
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          A quién autorizaste a ver tu información
        </h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Vos controlás quién accede a tu Pulso ID, qué partes puede ver y por cuánto tiempo. Todo
          consentimiento es granular, temporal y revocable.
        </p>
      </header>

      {pendientes.length > 0 ? (
        <Card variant="elevated" className="border-pulso-cobre/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell size={16} className="text-pulso-cobre" />
                Solicitudes pendientes
              </CardTitle>
              <Badge variant="cobre">{pendientes.length}</Badge>
            </div>
            <CardDescription>
              Profesionales que están esperando tu aprobación para ver tu perfil.
            </CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {pendientes.map((c) => (
              <ConsentCard key={c.id} consent={c} state="pending" />
            ))}
          </ul>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Consentimientos vigentes</CardTitle>
            <Badge variant="success">{vigentes.length}</Badge>
          </div>
          <CardDescription>Profesionales e instituciones que pueden ver tu perfil hoy.</CardDescription>
        </CardHeader>
        {vigentes.length === 0 ? (
          <Empty>No tenés consentimientos activos.</Empty>
        ) : (
          <ul className="space-y-3">
            {vigentes.map((c) => (
              <ConsentCard key={c.id} consent={c} state="approved" />
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Histórico</CardTitle>
            <Badge variant="neutral">{inactivos.length}</Badge>
          </div>
          <CardDescription>Consentimientos vencidos, rechazados o revocados.</CardDescription>
        </CardHeader>
        {inactivos.length === 0 ? (
          <Empty>Sin histórico todavía.</Empty>
        ) : (
          <ul className="space-y-3">
            {inactivos.map((c) => (
              <ConsentCard key={c.id} consent={c} state="inactive" />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function ConsentCard({
  consent,
  state,
}: {
  consent: ConsentItem;
  state: 'pending' | 'approved' | 'inactive';
}) {
  const titular = consent.profesional
    ? `Dr/a. ${consent.profesional.nombre} ${consent.profesional.apellido}${consent.profesional.matriculaNacional ? ` · ${consent.profesional.matriculaNacional}` : ''}`
    : consent.institucion
      ? consent.institucion.fantasyName ?? consent.institucion.razonSocial
      : 'Acceso anónimo';

  return (
    <li className="rounded-md border border-white/5 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {state === 'approved' ? <ShieldCheck size={14} className="text-success" /> : <ShieldOff size={14} className="text-pulso-niebla" />}
            <div className="font-medium text-pulso-blanco-calido">{titular}</div>
          </div>
          <div className="mt-1 text-xs text-pulso-niebla">{consent.motivo}</div>
        </div>
        <StatusBadge status={consent.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {consent.scopes.map((s) => (
          <Badge key={s} variant="turquesa">
            {SCOPE_LABEL[s] ?? s}
          </Badge>
        ))}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-pulso-niebla sm:grid-cols-3">
        <div>Solicitado: {new Date(consent.requestedAt).toLocaleString('es-AR')}</div>
        {consent.grantedAt ? <div>Aprobado: {new Date(consent.grantedAt).toLocaleString('es-AR')}</div> : null}
        {consent.expiresAt ? <div>Vence: {new Date(consent.expiresAt).toLocaleString('es-AR')}</div> : null}
        {consent.revokedAt ? <div>Cerrado: {new Date(consent.revokedAt).toLocaleString('es-AR')}</div> : null}
      </div>
      {consent.rejectionReason ? (
        <div className="mt-2 text-xs text-pulso-niebla">
          <span className="text-pulso-cobre">Motivo del rechazo: </span>
          {consent.rejectionReason}
        </div>
      ) : null}

      {state === 'pending' ? <PendingConsentActions id={consent.id} /> : null}
      {state === 'approved' ? <RevokeConsentButton id={consent.id} /> : null}
    </li>
  );
}

function StatusBadge({ status }: { status: ConsentItem['status'] }) {
  const map: Record<ConsentItem['status'], { label: string; v: 'success' | 'warning' | 'danger' | 'neutral' | 'cobre' }> = {
    PENDING: { label: 'Pendiente', v: 'cobre' },
    APPROVED: { label: 'Vigente', v: 'success' },
    REJECTED: { label: 'Rechazado', v: 'danger' },
    REVOKED: { label: 'Revocado', v: 'danger' },
    EXPIRED: { label: 'Vencido', v: 'neutral' },
  };
  const { label, v } = map[status];
  return <Badge variant={v}>{label}</Badge>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-sm text-pulso-niebla">
      {children}
    </div>
  );
}

function isStillValid(c: ConsentItem): boolean {
  if (c.status !== 'APPROVED') return false;
  if (c.revokedAt) return false;
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) return false;
  return true;
}
