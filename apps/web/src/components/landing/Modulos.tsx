import {
  IdCard,
  QrCode,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Network,
  type LucideIcon,
} from 'lucide-react';

interface Modulo {
  nombre: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  acento: 'turquesa' | 'cobre';
}

const MODULOS: Modulo[] = [
  {
    nombre: 'Pulso ID',
    titulo: 'Identidad sanitaria',
    descripcion:
      'Perfil ciudadano con DNI, cobertura médica, alergias, condiciones críticas y medicación habitual.',
    icon: IdCard,
    acento: 'turquesa',
  },
  {
    nombre: 'Pulso Emergency',
    titulo: 'QR de emergencia',
    descripcion:
      'QR personal con datos críticos accesibles en emergencias, log de cada acceso y notificación al ciudadano.',
    icon: QrCode,
    acento: 'cobre',
  },
  {
    nombre: 'Pulso Clinical',
    titulo: 'Portal profesional',
    descripcion:
      'Búsqueda de paciente, vista resumida del perfil clínico, timeline y carga de evolución.',
    icon: Stethoscope,
    acento: 'turquesa',
  },
  {
    nombre: 'Pulso Mica',
    titulo: 'Acompañante IA',
    descripcion:
      'Asistente sanitario en lenguaje simple. Explica estudios, recuerda medicación, hace triage. No prescribe.',
    icon: Sparkles,
    acento: 'turquesa',
  },
  {
    nombre: 'Pulso Admin',
    titulo: 'Panel institucional',
    descripcion:
      'Gestión de usuarios, instituciones, auditoría de accesos, métricas y control de roles.',
    icon: ShieldCheck,
    acento: 'cobre',
  },
  {
    nombre: 'Pulso Connect',
    titulo: 'Interoperabilidad',
    descripcion:
      'APIs, webhooks y conectores para hospitales, obras sociales, farmacias y laboratorios.',
    icon: Network,
    acento: 'turquesa',
  },
];

export function Modulos() {
  return (
    <section id="modulos" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            La plataforma
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-pulso-blanco-calido md:text-5xl">
            Seis módulos que se conectan entre sí
          </h2>
          <p className="mt-6 text-lg text-pulso-niebla">
            Cada módulo resuelve un problema real del sistema de salud argentino. Juntos, conforman la
            primera capa de infraestructura sanitaria interoperable del país.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m) => {
            const Icon = m.icon;
            const isCobre = m.acento === 'cobre';
            return (
              <article
                key={m.nombre}
                className="group relative flex flex-col gap-4 rounded-xl border border-white/5 bg-pulso-azul-noche/60 p-7 transition-all hover:-translate-y-1 hover:border-pulso-turquesa/30 hover:shadow-pulso-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    isCobre
                      ? 'bg-pulso-cobre/15 text-pulso-cobre'
                      : 'bg-pulso-turquesa/15 text-pulso-turquesa'
                  }`}
                >
                  <Icon size={22} strokeWidth={1.6} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-pulso-niebla">
                    {m.nombre}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-pulso-blanco-calido">
                    {m.titulo}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-pulso-niebla">{m.descripcion}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
