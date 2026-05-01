import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { History, MapPin, Monitor } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

interface QrItem {
  id: string;
  token: string;
  createdAt: string;
}
interface AccessLog {
  id: string;
  accessedAt: string;
  ip: string | null;
  userAgent: string | null;
  geoApprox: string | null;
}

export default async function HistorialPage() {
  await requireUser();
  const qrsRes = await apiFetchAuthed<QrItem[]>('/emergency/me');
  const qrs = qrsRes.ok ? qrsRes.data : [];

  const logsByQr: Array<{ qr: QrItem; logs: AccessLog[] }> = [];
  for (const qr of qrs) {
    const r = await apiFetchAuthed<AccessLog[]>(`/emergency/me/${qr.id}/logs`);
    if (r.ok) logsByQr.push({ qr, logs: r.data });
  }
  const allLogs = logsByQr
    .flatMap(({ qr, logs }) => logs.map((l) => ({ ...l, qrToken: qr.token })))
    .sort((a, b) => +new Date(b.accessedAt) - +new Date(a.accessedAt));

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Auditoría
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Historial de accesos a tu información
        </h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Cada vez que alguien escanea tu QR de emergencia o un profesional accede a tu perfil
          clínico (con tu consentimiento), queda registrado acá.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Accesos a tu QR de emergencia</CardTitle>
            <Badge variant="neutral">{allLogs.length} eventos</Badge>
          </div>
          <CardDescription>Últimos 100 accesos por QR.</CardDescription>
        </CardHeader>

        {allLogs.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 p-8 text-center text-sm text-pulso-niebla">
            <History size={20} className="mx-auto mb-3 opacity-50" />
            Todavía nadie escaneó tu QR. Cuando alguien lo haga, vas a verlo acá.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {allLogs.map((log) => (
              <li key={log.id} className="flex items-start gap-4 py-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-pulso-cobre/15 text-pulso-cobre">
                  <History size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-pulso-blanco-calido">
                      Acceso a QR de emergencia
                    </div>
                    <div className="text-xs text-pulso-niebla">
                      {new Date(log.accessedAt).toLocaleString('es-AR')}
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-pulso-niebla">
                    {log.ip ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        <span className="font-mono">{log.ip}</span>
                      </span>
                    ) : null}
                    {log.userAgent ? (
                      <span className="inline-flex items-center gap-1 truncate">
                        <Monitor size={11} />
                        <span className="truncate">{log.userAgent.slice(0, 60)}</span>
                      </span>
                    ) : null}
                    <span className="font-mono opacity-60">QR …{log.qrToken.slice(-8)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
