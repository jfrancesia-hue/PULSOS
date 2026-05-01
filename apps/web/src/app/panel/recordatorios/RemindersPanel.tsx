'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, Button, Input, Badge } from '@pulso/ui';
import { Plus, X, Power, PowerOff, Clock } from 'lucide-react';
import { createReminderAction, updateReminderAction, deleteReminderAction } from './actions';

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
}

const FREQ_PRESETS: Array<{ value: string; label: string; suggestedHours: string[] }> = [
  { value: 'DAILY', label: '1 vez al día', suggestedHours: ['08:00'] },
  { value: 'TWICE_DAILY', label: '2 veces al día', suggestedHours: ['08:00', '20:00'] },
  { value: 'THREE_TIMES_DAILY', label: '3 veces al día', suggestedHours: ['08:00', '14:00', '20:00'] },
  { value: 'EVERY_8H', label: 'Cada 8 horas', suggestedHours: ['08:00', '16:00', '00:00'] },
  { value: 'EVERY_12H', label: 'Cada 12 horas', suggestedHours: ['08:00', '20:00'] },
  { value: 'WEEKLY', label: '1 vez por semana', suggestedHours: ['08:00'] },
];

export function RemindersPanel({ initial }: { initial: Reminder[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  function refresh() {
    router.refresh();
  }

  function add(form: HTMLFormElement) {
    const fd = new FormData(form);
    const payload = {
      medicacion: String(fd.get('medicacion') ?? '').trim(),
      presentacion: String(fd.get('presentacion') ?? '').trim() || undefined,
      posologia: String(fd.get('posologia') ?? '').trim() || undefined,
      frequency: String(fd.get('frequency') ?? 'DAILY'),
      hours: String(fd.get('hours') ?? '08:00')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      startDate: String(fd.get('startDate') ?? new Date().toISOString().slice(0, 10)),
      endDate: String(fd.get('endDate') ?? '') || undefined,
    };
    startTransition(async () => {
      const res = await createReminderAction(payload);
      if (res.ok) {
        setItems((prev) => [...prev, res.data as Reminder]);
        setShowForm(false);
        refresh();
      } else {
        alert(res.error.message);
      }
    });
  }

  function toggle(item: Reminder) {
    startTransition(async () => {
      const res = await updateReminderAction(item.id, { active: !item.active });
      if (res.ok) {
        setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, active: !p.active } : p)));
      }
    });
  }

  function remove(item: Reminder) {
    if (!confirm(`¿Borrar el recordatorio de ${item.medicacion}?`)) return;
    startTransition(async () => {
      const res = await deleteReminderAction(item.id);
      if (res.ok) {
        setItems((prev) => prev.filter((p) => p.id !== item.id));
      }
    });
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div className="text-sm text-pulso-niebla">{items.length} recordatorios configurados</div>
        <Button onClick={() => setShowForm((s) => !s)} variant={showForm ? 'ghost' : 'primary'} size="sm">
          {showForm ? (
            <>
              <X size={12} />
              Cancelar
            </>
          ) : (
            <>
              <Plus size={12} />
              Nuevo recordatorio
            </>
          )}
        </Button>
      </div>

      {showForm ? (
        <Card variant="elevated" className="mb-6">
          <CardHeader>
            <CardTitle>Nuevo recordatorio</CardTitle>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              add(e.currentTarget);
            }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <Field label="Medicación">
              <Input name="medicacion" required minLength={2} placeholder="Enalapril" />
            </Field>
            <Field label="Presentación">
              <Input name="presentacion" placeholder="10 mg" />
            </Field>
            <Field label="Posología">
              <Input name="posologia" placeholder="1 comprimido" />
            </Field>
            <Field label="Frecuencia">
              <select
                name="frequency"
                defaultValue="DAILY"
                className="h-11 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
              >
                {FREQ_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
                <option value="CUSTOM">Personalizada</option>
              </select>
            </Field>
            <Field label="Horarios (HH:MM, separados por coma)">
              <Input name="hours" defaultValue="08:00" placeholder="08:00, 20:00" />
            </Field>
            <Field label="Empieza">
              <Input name="startDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
            </Field>
            <Field label="Termina (opcional)">
              <Input name="endDate" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="primary" disabled={pending}>
                {pending ? 'Guardando…' : 'Guardar recordatorio'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-white/10 p-12 text-center text-sm text-pulso-niebla">
          <Clock size={24} className="mx-auto mb-3 opacity-50" />
          Todavía no creaste recordatorios. Empezá con tu primer medicamento habitual.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li
              key={r.id}
              className={`flex items-start justify-between gap-3 rounded-md border border-white/5 bg-white/[0.02] p-4 ${r.active ? '' : 'opacity-60'}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-pulso-blanco-calido">{r.medicacion}</span>
                  {r.presentacion ? (
                    <span className="text-xs text-pulso-niebla">{r.presentacion}</span>
                  ) : null}
                  <Badge variant={r.active ? 'success' : 'neutral'}>
                    {r.active ? 'Activo' : 'Pausado'}
                  </Badge>
                </div>
                {r.posologia ? <div className="text-xs text-pulso-niebla">{r.posologia}</div> : null}
                <div className="mt-1.5 flex items-center gap-2 text-xs">
                  <span className="text-pulso-niebla">{labelFrequency(r.frequency)}</span>
                  <span className="text-pulso-niebla">·</span>
                  <span className="font-mono text-pulso-turquesa">{r.hours.join(', ')}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => toggle(r)} disabled={pending} aria-label="Activar/Pausar">
                  {r.active ? <PowerOff size={12} /> : <Power size={12} />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => remove(r)} disabled={pending} aria-label="Borrar">
                  <X size={12} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-pulso-niebla">
        {label}
      </span>
      {children}
    </label>
  );
}

function labelFrequency(f: string): string {
  return FREQ_PRESETS.find((p) => p.value === f)?.label ?? f;
}
