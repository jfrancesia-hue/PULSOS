import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { Bell } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { NotificationsList } from './NotificationsList';

interface NotificationItem {
  id: string;
  channel: string;
  category: string;
  status: string;
  title: string;
  body: string;
  payload: Record<string, unknown> | null;
  createdAt: string;
  readAt: string | null;
}

export default async function NotificacionesPage() {
  await requireUser();
  const res = await apiFetchAuthed<NotificationItem[]>('/notifications/me?take=100');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Notificaciones
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tu bandeja</h1>
          <p className="mt-2 max-w-2xl text-pulso-niebla">
            Cada acceso a tu QR, evolución cargada y mensaje del sistema queda acá.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Últimas {items.length}</CardTitle>
            <Badge variant="neutral">{items.filter((i) => !i.readAt).length} sin leer</Badge>
          </div>
          <CardDescription>Hacé click en una notificación para abrirla.</CardDescription>
        </CardHeader>

        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-white/10 p-12 text-center text-sm text-pulso-niebla">
            <Bell size={24} className="mx-auto mb-3 opacity-50" />
            Todavía no tenés notificaciones.
          </div>
        ) : (
          <NotificationsList items={items} />
        )}
      </Card>
    </div>
  );
}
