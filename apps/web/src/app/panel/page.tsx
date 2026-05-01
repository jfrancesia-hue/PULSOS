import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Stat, Badge, Button } from '@pulso/ui';
import { ArrowRight, AlertTriangle, Heart, Pill, Sparkles } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

interface CitizenProfile {
  id: string;
  nombre: string;
  apellido: string;
  grupoSanguineo: string;
  alergias: Array<{ sustancia: string; severidad: string }>;
  condicionesCriticas: Array<{ nombre: string }>;
  medicacionHabitual: Array<{ nombre: string; presentacion?: string; posologia?: string }>;
}

interface QrSummary {
  id: string;
  token: string;
  expiresAt: string | null;
  revokedAt: string | null;
  _count: { logs: number };
}

export default async function PanelHome() {
  const user = await requireUser();
  const profileRes = await apiFetchAuthed<CitizenProfile>('/pulso-id/me');
  const qrsRes = await apiFetchAuthed<QrSummary[]>('/emergency/me');

  const profile = profileRes.ok ? profileRes.data : null;
  const activeQr = qrsRes.ok
    ? qrsRes.data.find((q) => !q.revokedAt && (!q.expiresAt || new Date(q.expiresAt) > new Date()))
    : null;

  const greeting = profile
    ? `Hola, ${profile.nombre.split(' ')[0]}`
    : `Hola, ${user.email.split('@')[0]}`;

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Pulso ID
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{greeting}</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Grupo sanguíneo"
          value={profile?.grupoSanguineo?.replace('_POSITIVO', '+').replace('_NEGATIVO', '-') ?? '?'}
          icon={<Heart size={16} />}
        />
        <Stat
          label="Alergias críticas"
          value={profile?.alergias.length ?? 0}
          icon={<AlertTriangle size={16} />}
        />
        <Stat
          label="Medicación habitual"
          value={profile?.medicacionHabitual.length ?? 0}
          icon={<Pill size={16} />}
        />
        <Stat
          label="QR de emergencia"
          value={activeQr ? 'Activo' : 'Inactivo'}
          icon={<Sparkles size={16} />}
          delta={activeQr ? { value: `${activeQr._count.logs} accesos`, trend: 'flat' } : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tus datos críticos</CardTitle>
            <CardDescription>
              Lo que un profesional ve cuando escaneás tu QR de emergencia.
            </CardDescription>
          </CardHeader>
          {profile ? (
            <div className="space-y-3">
              {profile.alergias.length === 0 && profile.condicionesCriticas.length === 0 && profile.medicacionHabitual.length === 0 ? (
                <Empty>
                  Todavía no cargaste alergias, condiciones ni medicación habitual.{' '}
                  <Link href="/panel/perfil" className="text-pulso-turquesa hover:underline">
                    Completar perfil →
                  </Link>
                </Empty>
              ) : null}

              {profile.alergias.map((a, i) => (
                <Row key={`a-${i}`} icon={<AlertTriangle size={14} />} accent="cobre">
                  <span className="font-medium">{a.sustancia}</span>{' '}
                  <span className="text-pulso-niebla">· {a.severidad.toLowerCase()}</span>
                </Row>
              ))}
              {profile.condicionesCriticas.map((c, i) => (
                <Row key={`c-${i}`} icon={<Heart size={14} />} accent="turquesa">
                  <span className="font-medium">{c.nombre}</span>
                </Row>
              ))}
              {profile.medicacionHabitual.map((m, i) => (
                <Row key={`m-${i}`} icon={<Pill size={14} />} accent="turquesa">
                  <span className="font-medium">{m.nombre}</span>
                  {m.presentacion ? <span className="text-pulso-niebla"> · {m.presentacion}</span> : null}
                  {m.posologia ? <span className="text-pulso-niebla"> · {m.posologia}</span> : null}
                </Row>
              ))}
            </div>
          ) : (
            <Empty>
              Para empezar, completá tu Pulso ID con tus datos personales y clínicos básicos.{' '}
              <Link href="/panel/perfil" className="text-pulso-turquesa hover:underline">
                Crear perfil →
              </Link>
            </Empty>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Lo más usado.</CardDescription>
          </CardHeader>
          <div className="space-y-2">
            <QuickLink href="/panel/qr" label="Ver mi QR de emergencia" />
            <QuickLink href="/panel/perfil" label="Editar mi perfil" />
            <QuickLink href="/panel/mica" label="Hablar con Mica" />
            <QuickLink href="/panel/consentimientos" label="Ver consentimientos" />
          </div>

          <div className="mt-6 rounded-md border border-pulso-turquesa/20 bg-pulso-turquesa/5 p-4 text-xs text-pulso-niebla">
            <Badge variant="turquesa" className="mb-2">Privacidad</Badge>
            <p>
              Cada acceso a tus datos clínicos queda registrado en un log auditable. Vos podés
              revocar permisos en cualquier momento.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({
  icon,
  accent,
  children,
}: {
  icon: React.ReactNode;
  accent: 'turquesa' | 'cobre';
  children: React.ReactNode;
}) {
  const isCobre = accent === 'cobre';
  return (
    <div className="flex items-start gap-3 rounded-md border border-white/5 bg-white/[0.02] px-3 py-2.5">
      <div
        className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
          isCobre ? 'bg-pulso-cobre/15 text-pulso-cobre' : 'bg-pulso-turquesa/15 text-pulso-turquesa'
        }`}
      >
        {icon}
      </div>
      <div className="text-sm text-pulso-blanco-calido">{children}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-md border border-white/5 px-3 py-2.5 text-sm text-pulso-blanco-calido transition-colors hover:border-pulso-turquesa/30 hover:bg-white/[0.02]"
    >
      <span>{label}</span>
      <ArrowRight size={14} className="text-pulso-niebla" />
    </Link>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-white/10 bg-white/[0.01] p-6 text-center text-sm text-pulso-niebla">
      {children}
    </div>
  );
}
