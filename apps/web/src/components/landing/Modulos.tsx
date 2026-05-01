import {
  IdCard,
  QrCode,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Network,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';

interface Modulo {
  nombre: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  acento: 'turquesa' | 'cobre';
  feature?: string;
}

const MODULOS: Modulo[] = [
  {
    nombre: 'Pulso ID',
    titulo: 'Identidad sanitaria',
    descripcion:
      'Perfil ciudadano con DNI, cobertura médica, alergias, condiciones críticas y medicación habitual.',
    icon: IdCard,
    acento: 'turquesa',
    feature: 'Pulso ID',
  },
  {
    nombre: 'Pulso Emergency',
    titulo: 'QR de emergencia',
    descripcion:
      'QR personal con datos críticos accesibles en emergencias, log de cada acceso y notificación al ciudadano.',
    icon: QrCode,
    acento: 'cobre',
    feature: 'QR seguro',
  },
  {
    nombre: 'Pulso Clinical',
    titulo: 'Portal profesional',
    descripcion:
      'Búsqueda de paciente, vista resumida del perfil clínico, timeline y carga de evolución.',
    icon: Stethoscope,
    acento: 'turquesa',
    feature: 'Portal Pro',
  },
  {
    nombre: 'Pulso Mica',
    titulo: 'Acompañante IA',
    descripcion:
      'Asistente sanitario en lenguaje simple. Explica estudios, recuerda medicación, hace triage. No prescribe.',
    icon: Sparkles,
    acento: 'turquesa',
    feature: 'IA Claude',
  },
  {
    nombre: 'Pulso Admin',
    titulo: 'Panel institucional',
    descripcion:
      'Gestión de usuarios, instituciones, auditoría de accesos, métricas y control de roles.',
    icon: ShieldCheck,
    acento: 'cobre',
    feature: 'Govtech',
  },
  {
    nombre: 'Pulso Connect',
    titulo: 'Interoperabilidad',
    descripcion:
      'APIs, webhooks y conectores HL7/FHIR para hospitales, obras sociales, farmacias y laboratorios.',
    icon: Network,
    acento: 'turquesa',
    feature: 'HL7/FHIR',
  },
];

export function Modulos() {
  return (
    <section id="modulos" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
              La plataforma
            </div>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Seis módulos que se{' '}
              <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-cobre bg-clip-text text-transparent">
                conectan entre sí
              </span>
            </h2>
            <p className="mt-6 text-lg text-pulso-niebla">
              Cada módulo resuelve un problema real del sistema de salud argentino. Juntos,
              conforman la primera capa de infraestructura sanitaria interoperable del país.
            </p>
          </div>
          <div className="hidden lg:flex lg:gap-2">
            {[1, 2, 3].map((d) => (
              <span
                key={d}
                className="block h-2 w-2 rounded-full"
                style={{ background: d === 2 ? '#D97847' : '#2BD4C9', opacity: d === 1 ? 1 : 0.4 }}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m) => {
            const Icon = m.icon;
            const isCobre = m.acento === 'cobre';
            return (
              <article
                key={m.nombre}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/5 bg-pulso-azul-noche/60 p-7 transition-all hover:-translate-y-1 hover:border-pulso-turquesa/30 hover:shadow-pulso-lg"
              >
                {/* Halo decorativo */}
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-opacity ${
                    isCobre ? 'bg-pulso-cobre/10' : 'bg-pulso-turquesa/10'
                  } opacity-0 group-hover:opacity-100`}
                />

                <div className="relative flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isCobre
                        ? 'bg-gradient-to-br from-pulso-cobre/20 to-pulso-cobre/5 text-pulso-cobre'
                        : 'bg-gradient-to-br from-pulso-turquesa/20 to-pulso-turquesa/5 text-pulso-turquesa'
                    }`}
                  >
                    <Icon size={24} strokeWidth={1.6} />
                  </div>
                  <span
                    className={`rounded-md border px-2 py-1 font-mono text-2xs uppercase tracking-wider ${
                      isCobre
                        ? 'border-pulso-cobre/30 bg-pulso-cobre/5 text-pulso-cobre'
                        : 'border-pulso-turquesa/30 bg-pulso-turquesa/5 text-pulso-turquesa'
                    }`}
                  >
                    {m.feature}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-pulso-niebla">
                    {m.nombre}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-pulso-blanco-calido">
                    {m.titulo}
                  </h3>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-pulso-niebla">
                  {m.descripcion}
                </p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                  <span className="text-pulso-niebla">Conoce más</span>
                  <ArrowUpRight
                    size={14}
                    className="text-pulso-niebla transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pulso-turquesa"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
