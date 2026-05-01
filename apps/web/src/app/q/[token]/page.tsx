import { notFound } from 'next/navigation';
import { Logo, Badge } from '@pulso/ui';
import { AlertTriangle, Phone, Heart, Pill } from 'lucide-react';

interface EmergencyData {
  nombre: string;
  apellido: string;
  edad: number;
  grupoSanguineo: string;
  alergias: string[];
  condicionesCriticas: string[];
  medicacionHabitual: string[];
  contactoEmergencia: { nombre: string; telefono: string; relacion: string } | null;
  cobertura: { tipo: string; obraSocial: string | null; numeroAfiliado: string | null } | null;
  emitidoEn: string;
}

async function fetchEmergency(token: string): Promise<EmergencyData | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/api/emergency/${token}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as EmergencyData;
  } catch {
    return null;
  }
}

export default async function EmergencyPublicPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await fetchEmergency(token);

  if (!data) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-pulso-azul-medianoche">
      <header className="border-b border-pulso-cobre/30 bg-gradient-to-r from-pulso-cobre/15 via-transparent to-transparent">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
          <Badge variant="cobre">
            <AlertTriangle size={12} />
            Emergencia
          </Badge>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-pulso-cobre/30 bg-pulso-azul-noche/80 p-8 shadow-pulso-xl">
          <div className="border-b border-white/5 pb-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
              Datos críticos para emergencia
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-pulso-blanco-calido">
              {data.nombre} {data.apellido}
            </h1>
            <div className="mt-2 text-sm text-pulso-niebla">
              {data.edad} años · Emitido {new Date(data.emitidoEn).toLocaleString('es-AR')}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <CriticalStat label="Grupo sanguíneo" value={formatGrupo(data.grupoSanguineo)} accent="cobre" />
            <CriticalStat
              label="Alergias"
              value={data.alergias.length === 0 ? 'Sin registrar' : data.alergias.join(', ')}
              accent={data.alergias.length > 0 ? 'cobre' : 'neutral'}
            />
            <CriticalStat
              label="Condiciones"
              value={
                data.condicionesCriticas.length === 0
                  ? 'Sin registrar'
                  : data.condicionesCriticas.join(', ')
              }
              accent={data.condicionesCriticas.length > 0 ? 'turquesa' : 'neutral'}
            />
          </div>

          {data.medicacionHabitual.length > 0 ? (
            <Section icon={<Pill size={16} />} titulo="Medicación habitual">
              <ul className="space-y-1.5 text-sm">
                {data.medicacionHabitual.map((m, i) => (
                  <li key={i} className="text-pulso-blanco-calido">
                    · {m}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {data.contactoEmergencia ? (
            <Section icon={<Phone size={16} />} titulo="Contacto de emergencia">
              <div className="text-pulso-blanco-calido">
                <div className="font-medium">{data.contactoEmergencia.nombre}</div>
                <div className="mt-1 text-sm text-pulso-niebla">
                  {data.contactoEmergencia.relacion} ·{' '}
                  <a
                    href={`tel:${data.contactoEmergencia.telefono.replace(/\s/g, '')}`}
                    className="text-pulso-turquesa hover:underline"
                  >
                    {data.contactoEmergencia.telefono}
                  </a>
                </div>
              </div>
            </Section>
          ) : null}

          {data.cobertura ? (
            <Section icon={<Heart size={16} />} titulo="Cobertura médica">
              <div className="text-sm text-pulso-blanco-calido">
                <div className="font-medium">{data.cobertura.obraSocial ?? data.cobertura.tipo}</div>
                {data.cobertura.numeroAfiliado ? (
                  <div className="mt-1 text-xs text-pulso-niebla">
                    Afiliado: {data.cobertura.numeroAfiliado}
                  </div>
                ) : null}
              </div>
            </Section>
          ) : null}

          <div className="mt-8 rounded-md border border-white/5 bg-pulso-azul-medianoche/60 px-4 py-3 text-xs text-pulso-niebla">
            Este acceso quedó registrado en el log de auditoría de Pulso. El ciudadano fue notificado.
          </div>
        </div>
      </article>
    </main>
  );
}

function CriticalStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: 'cobre' | 'turquesa' | 'neutral';
}) {
  const colorClass =
    accent === 'cobre'
      ? 'text-pulso-cobre'
      : accent === 'turquesa'
      ? 'text-pulso-turquesa'
      : 'text-pulso-blanco-calido';
  return (
    <div className="rounded-lg border border-white/5 bg-pulso-azul-medianoche/60 p-4">
      <div className="text-2xs uppercase tracking-wider text-pulso-niebla">{label}</div>
      <div className={`mt-2 font-display text-xl font-semibold ${colorClass}`}>{value}</div>
    </div>
  );
}

function Section({
  icon,
  titulo,
  children,
}: {
  icon: React.ReactNode;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 border-t border-white/5 pt-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pulso-niebla">
        <span className="text-pulso-turquesa">{icon}</span>
        {titulo}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function formatGrupo(g: string): string {
  return g
    .replace('_POSITIVO', '+')
    .replace('_NEGATIVO', '-')
    .replace('DESCONOCIDO', '?')
    .replace('_', '');
}
