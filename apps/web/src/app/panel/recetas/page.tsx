import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { FileText } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

interface PrescriptionItem {
  id: string;
  medicacion: string;
  presentacion: string | null;
  posologia: string;
  cantidad: string | null;
}

interface Prescription {
  id: string;
  status: string;
  diagnostico: string | null;
  emitidaEn: string;
  validaHasta: string;
  signatureHash: string;
  items: PrescriptionItem[];
  profesional: { nombre: string; apellido: string; matriculaNacional: string | null };
}

export default async function RecetasPage() {
  await requireUser();
  const res = await apiFetchAuthed<Prescription[]>('/prescriptions/me');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Pulso Clinical
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tus recetas digitales</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Cada receta tiene un hash de firma que permite verificar autenticidad. Las farmacias
          conectadas a Pulso pueden validar y dispensar directamente.
        </p>
      </header>

      {items.length === 0 ? (
        <Card>
          <div className="rounded-md border border-dashed border-white/10 p-12 text-center">
            <FileText size={32} className="mx-auto mb-4 text-pulso-niebla opacity-50" />
            <div className="font-display text-lg font-semibold">Sin recetas</div>
            <p className="mx-auto mt-2 max-w-md text-sm text-pulso-niebla">
              Cuando un profesional con consent vigente te emita una receta, va a aparecer acá.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                    <span className="text-xs text-pulso-niebla">
                      Emitida {new Date(p.emitidaEn).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold">
                    Dr/a. {p.profesional.nombre} {p.profesional.apellido}
                    {p.profesional.matriculaNacional ? (
                      <span className="ml-2 text-xs text-pulso-niebla">
                        · {p.profesional.matriculaNacional}
                      </span>
                    ) : null}
                  </h3>
                  {p.diagnostico ? (
                    <div className="mt-2 text-sm text-pulso-niebla">
                      <span className="font-medium text-pulso-blanco-calido">Diagnóstico: </span>
                      {p.diagnostico}
                    </div>
                  ) : null}
                </div>
                <div className="text-right text-xs text-pulso-niebla">
                  <div>Válida hasta</div>
                  <div className="font-mono text-pulso-blanco-calido">
                    {new Date(p.validaHasta).toLocaleDateString('es-AR')}
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {p.items.map((it) => (
                  <li
                    key={it.id}
                    className="rounded-md border border-white/5 bg-white/[0.02] p-3"
                  >
                    <div className="font-medium text-pulso-blanco-calido">
                      {it.medicacion}
                      {it.presentacion ? (
                        <span className="ml-2 text-xs text-pulso-niebla">{it.presentacion}</span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 text-xs text-pulso-niebla">{it.posologia}</div>
                    {it.cantidad ? (
                      <div className="text-2xs text-pulso-niebla">Cantidad: {it.cantidad}</div>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-2xs text-pulso-niebla">
                <span className="font-mono">Firma: …{p.signatureHash.slice(-12)}</span>
                <Link
                  href={`/panel/recetas/${p.id}`}
                  className="text-pulso-turquesa hover:underline"
                >
                  Ver detalle →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function statusVariant(s: string): 'success' | 'warning' | 'danger' | 'neutral' {
  if (s === 'EMITIDA') return 'success';
  if (s === 'DISPENSADA') return 'neutral';
  if (s === 'PARCIALMENTE_DISPENSADA') return 'warning';
  if (s === 'EXPIRADA' || s === 'ANULADA') return 'danger';
  return 'neutral';
}
