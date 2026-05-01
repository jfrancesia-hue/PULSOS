import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@pulso/ui';
import { ArrowLeft, AlertTriangle, FileText } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';
import { EvolucionForm } from './EvolucionForm';

interface ClinicalRecord {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string | null;
  ocurridoEn: string;
  profesional: { nombre: string; apellido: string; especialidades: string[] } | null;
  institucion: { razonSocial: string; fantasyName: string | null } | null;
}

interface CitizenProfile {
  id: string;
  dni: string;
  nombre: string;
  apellido: string;
  grupoSanguineo: string;
  alergias: Array<{ sustancia: string; severidad: string }>;
  condicionesCriticas: Array<{ nombre: string }>;
  medicacionHabitual: Array<{ nombre: string; presentacion?: string; posologia?: string }>;
}

export default async function PacienteDetalle({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['PROFESIONAL'], '/portal-profesional/ingresar');
  const { id } = await params;

  const timelineRes = await apiFetchAuthed<ClinicalRecord[]>(`/clinical/citizen/${id}/timeline`);
  if (!timelineRes.ok) {
    return (
      <div className="space-y-4">
        <Link
          href="/portal-profesional/buscar"
          className="inline-flex items-center gap-2 text-sm text-pulso-niebla hover:text-pulso-turquesa"
        >
          <ArrowLeft size={14} />
          Volver a búsqueda
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>No tenés acceso al timeline</CardTitle>
            <CardDescription>{timelineRes.error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const timeline = timelineRes.data;

  // Reconstruimos datos del paciente desde el primer record (Codex agregaría endpoint dedicado).
  const sample = timeline[0];

  return (
    <div className="space-y-8">
      <Link
        href="/portal-profesional/buscar"
        className="inline-flex items-center gap-2 text-sm text-pulso-niebla hover:text-pulso-turquesa"
      >
        <ArrowLeft size={14} />
        Volver a búsqueda
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
            Perfil clínico autorizado
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            Paciente · ID {id.slice(0, 8)}…
          </h1>
        </div>
        <Badge variant="success">Consent vigente · TIMELINE_CLINICO</Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cargar evolución</CardTitle>
            <CardDescription>
              Quedará en el timeline clínico y en el log de auditoría.
            </CardDescription>
          </CardHeader>
          <EvolucionForm citizenProfileId={id} />
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Timeline clínico</CardTitle>
              <Badge variant="neutral">{timeline.length} eventos</Badge>
            </div>
            <CardDescription>Últimos 50 registros del paciente.</CardDescription>
          </CardHeader>

          {timeline.length === 0 ? (
            <div className="rounded-md border border-dashed border-white/10 p-8 text-center text-sm text-pulso-niebla">
              <FileText size={24} className="mx-auto mb-3 opacity-50" />
              Sin registros clínicos cargados todavía.
            </div>
          ) : (
            <ul className="space-y-3">
              {timeline.map((r) => (
                <li
                  key={r.id}
                  className="rounded-md border border-white/5 bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={r.tipo === 'EVOLUCION' ? 'turquesa' : 'neutral'}>
                        {r.tipo}
                      </Badge>
                      <div className="font-display text-sm font-semibold text-pulso-blanco-calido">
                        {r.titulo}
                      </div>
                    </div>
                    <div className="text-xs text-pulso-niebla">
                      {new Date(r.ocurridoEn).toLocaleString('es-AR')}
                    </div>
                  </div>
                  {r.descripcion ? (
                    <p className="mt-2 text-sm text-pulso-niebla">{r.descripcion}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-pulso-niebla">
                    {r.profesional ? (
                      <span>
                        Dr/a. {r.profesional.nombre} {r.profesional.apellido}
                      </span>
                    ) : null}
                    {r.institucion ? <span>· {r.institucion.fantasyName ?? r.institucion.razonSocial}</span> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
