import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { RemindersPanel } from './RemindersPanel';

interface Reminder {
  id: string;
  medicacion: string;
  presentacion: string | null;
  posologia: string | null;
  frequency: string;
  hours: string[];
  startDate: string;
  endDate: string | null;
  active: boolean;
  lastFiredAt: string | null;
}

export default async function RecordatoriosPage() {
  await requireUser();
  const res = await apiFetchAuthed<Reminder[]>('/reminders/me');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Recordatorios
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tu medicación habitual</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Configurá horarios para que Pulso te recuerde tomar tu medicación. Las notificaciones se
          envían por email y push (cuando esté disponible).
        </p>
      </header>

      <RemindersPanel initial={items} />

      <Card>
        <CardHeader>
          <CardTitle>Cómo funciona</CardTitle>
          <CardDescription>
            Pulso revisa cada 5 minutos los horarios programados y dispara notificaciones a la hora
            indicada. Si Mica te ayuda a explicar tu medicación, podés crear el recordatorio
            directamente desde el chat.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
