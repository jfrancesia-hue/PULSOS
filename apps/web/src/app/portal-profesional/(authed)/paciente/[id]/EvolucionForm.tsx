'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Badge } from '@pulso/ui';
import { Save } from 'lucide-react';
import { saveEvolucionAction } from './actions';

const TIPOS = [
  'EVOLUCION',
  'CONSULTA',
  'ESTUDIO',
  'INDICACION' as never, // si Codex agrega tipo INDICACION en schema
  'DERIVACION',
  'OTRO',
];

export function EvolucionForm({ citizenProfileId }: { citizenProfileId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tipo, setTipo] = useState('EVOLUCION');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    startTransition(async () => {
      const res = await saveEvolucionAction({
        ciudadanoId: citizenProfileId,
        tipo,
        titulo,
        descripcion: descripcion || undefined,
      });
      if (!res.ok) {
        setFeedback({ ok: false, msg: res.error.message });
        return;
      }
      setFeedback({ ok: true, msg: 'Evolución guardada en el timeline.' });
      setTitulo('');
      setDescripcion('');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Tipo de registro">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="h-11 w-full rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 text-sm text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
        >
          <option value="EVOLUCION">Evolución</option>
          <option value="CONSULTA">Consulta</option>
          <option value="ESTUDIO">Estudio</option>
          <option value="DERIVACION">Derivación</option>
          <option value="OTRO">Otro</option>
        </select>
      </Field>

      <Field label="Título">
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          minLength={2}
          maxLength={240}
          placeholder="Ej: Control de tensión arterial"
        />
      </Field>

      <Field label="Descripción">
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          maxLength={8000}
          rows={5}
          placeholder="Notas clínicas, hallazgos, plan…"
          className="w-full resize-none rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 py-3 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-turquesa focus:outline-none"
        />
      </Field>

      {feedback ? (
        <div
          className={`rounded-md border p-3 text-sm ${
            feedback.ok
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {feedback.msg}
        </div>
      ) : null}

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={pending}>
        <Save size={14} />
        {pending ? 'Guardando…' : 'Cargar al timeline'}
      </Button>
      <div className="text-2xs text-pulso-niebla">
        Esta acción queda registrada como CLINICAL_RECORD_CREATED en el log de auditoría.
      </div>
    </form>
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
