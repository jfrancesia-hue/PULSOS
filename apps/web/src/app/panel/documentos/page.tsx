import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@pulso/ui';
import { FileText, Upload, Download } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { apiFetchAuthed } from '@/lib/api';

interface ClinicalDocument {
  id: string;
  tipo: string;
  nombre: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

const TIPO_LABEL: Record<string, string> = {
  ESTUDIO_LAB: 'Estudio de laboratorio',
  ESTUDIO_IMAGEN: 'Imagen diagnóstica',
  RECETA: 'Receta',
  INDICACION: 'Indicación',
  INFORME: 'Informe médico',
  CERTIFICADO: 'Certificado',
  CONSENTIMIENTO: 'Consentimiento',
  OTRO: 'Documento',
};

export default async function DocumentosPage() {
  await requireUser();
  const res = await apiFetchAuthed<ClinicalDocument[]>('/pulso-id/me/documentos');
  const docs = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Documentos
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Tu carpeta clínica</h1>
          <p className="mt-2 max-w-2xl text-pulso-niebla">
            Estudios, recetas e indicaciones cargados por vos o por profesionales autorizados.
          </p>
        </div>
        <Button variant="primary" size="md" disabled>
          <Upload size={14} />
          Subir documento
        </Button>
      </header>

      {docs.length === 0 ? (
        <Card>
          <div className="rounded-md border border-dashed border-white/10 p-12 text-center">
            <FileText size={32} className="mx-auto mb-4 text-pulso-niebla opacity-50" />
            <div className="font-display text-lg font-semibold">Sin documentos cargados</div>
            <p className="mx-auto mt-2 max-w-md text-sm text-pulso-niebla">
              Cuando subas un estudio o un profesional cargue una receta, lo vas a ver acá. La
              subida con storage S3-compatible está prevista para Codex P0.3.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tus documentos</CardTitle>
              <Badge variant="neutral">{docs.length} archivos</Badge>
            </div>
            <CardDescription>Ordenados por fecha de carga.</CardDescription>
          </CardHeader>
          <ul className="divide-y divide-white/5">
            {docs.map((d) => (
              <li key={d.id} className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-pulso-turquesa/15 text-pulso-turquesa">
                  <FileText size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-pulso-blanco-calido">{d.nombre}</div>
                  <div className="mt-0.5 text-xs text-pulso-niebla">
                    {TIPO_LABEL[d.tipo] ?? d.tipo} · {formatSize(d.sizeBytes)} ·{' '}
                    {new Date(d.uploadedAt).toLocaleDateString('es-AR')}
                  </div>
                </div>
                <Button variant="ghost" size="sm" disabled>
                  <Download size={12} />
                  Descargar
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
