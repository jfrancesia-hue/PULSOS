import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { QrCode } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { QrPanel } from './QrPanel';

interface QrItem {
  id: string;
  token: string;
  ttl: 'H_24' | 'D_7' | 'D_30' | 'NUNCA';
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  _count: { logs: number };
}

export default async function QrPage() {
  await requireUser();
  const res = await apiFetchAuthed<QrItem[]>('/emergency/me');
  const qrs = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
          Pulso Emergency
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tu QR de emergencia</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Cualquier profesional con tu QR puede ver datos críticos en una emergencia. Vos podés
          generar uno nuevo, revocar el actual y ver cada acceso.
        </p>
      </header>

      <QrPanel qrs={qrs} />

      <Card>
        <CardHeader>
          <CardTitle>Cómo funciona</CardTitle>
          <CardDescription>Tres garantías para que estés tranquilo/a.</CardDescription>
        </CardHeader>
        <ol className="space-y-4 text-sm text-pulso-niebla">
          <Step n="1" titulo="Acceso público controlado">
            El QR apunta a una página pública con tus datos críticos. No hay datos personales
            innecesarios — solo lo que un profesional necesita en una emergencia.
          </Step>
          <Step n="2" titulo="Cada acceso queda registrado">
            Quien escanee el QR queda en el log de auditoría con timestamp, IP aproximada y
            user-agent. Vos lo ves en tiempo real.
          </Step>
          <Step n="3" titulo="Vos controlás la vigencia">
            Definís el TTL (24 horas, 7 días, 30 días o sin expiración). Podés revocar el QR en
            cualquier momento.
          </Step>
        </ol>
      </Card>
    </div>
  );
}

function Step({ n, titulo, children }: { n: string; titulo: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-pulso-turquesa/10 font-display text-sm font-bold text-pulso-turquesa">
        {n}
      </div>
      <div>
        <div className="font-medium text-pulso-blanco-calido">{titulo}</div>
        <div className="mt-1">{children}</div>
      </div>
    </li>
  );
}
