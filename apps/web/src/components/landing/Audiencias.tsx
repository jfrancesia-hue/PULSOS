import { Building2, Stethoscope, Users, Pill, Landmark } from 'lucide-react';

const AUDIENCIAS = [
  {
    icon: Users,
    titulo: 'Para ciudadanos',
    bullets: [
      'Tu identidad sanitaria portátil',
      'QR de emergencia siempre disponible',
      'Mica te acompaña 24/7',
      'Vos decidís quién accede a tus datos',
    ],
  },
  {
    icon: Stethoscope,
    titulo: 'Para profesionales',
    bullets: [
      'Vista clínica completa en segundos',
      'Carga de evolución sin fricción',
      'Consentimiento explícito documentado',
      'Foco en atender, no en buscar datos',
    ],
  },
  {
    icon: Building2,
    titulo: 'Para instituciones',
    bullets: [
      'API de interoperabilidad',
      'Panel de gestión y métricas',
      'Auditoría completa de accesos',
      'Identidad institucional verificada',
    ],
  },
  {
    icon: Pill,
    titulo: 'Para farmacias',
    bullets: [
      'Validación de recetas digitales',
      'Seguimiento de tratamientos crónicos',
      'Trazabilidad de dispensa',
      'Integración con obras sociales',
    ],
  },
  {
    icon: Landmark,
    titulo: 'Para gobiernos',
    bullets: [
      'Tablero epidemiológico en vivo',
      'Capacidad de respuesta a brotes',
      'Datos para diseño de políticas',
      'Despliegue on-premise para soberanía',
    ],
  },
];

export function Audiencias() {
  return (
    <section id="audiencias" className="relative bg-pulso-azul-medianoche py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Para todo el sistema
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-pulso-blanco-calido md:text-5xl">
            Una plataforma. Cinco audiencias. Un mismo objetivo.
          </h2>
          <p className="mt-6 text-lg text-pulso-niebla">
            Pulso es la capa horizontal que conecta a todos los actores del sistema sanitario, sin
            reemplazar a ninguno. Cada uno encuentra valor concreto desde el primer día.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AUDIENCIAS.map((a) => {
            const Icon = a.icon;
            return (
              <article
                key={a.titulo}
                className="group flex flex-col gap-5 rounded-xl border border-white/5 bg-pulso-azul-noche/60 p-7 transition-all hover:border-pulso-turquesa/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pulso-turquesa/15 text-pulso-turquesa">
                  <Icon size={20} strokeWidth={1.6} />
                </div>
                <h3 className="font-display text-xl font-semibold text-pulso-blanco-calido">
                  {a.titulo}
                </h3>
                <ul className="space-y-2 text-sm text-pulso-niebla">
                  {a.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-pulso-turquesa" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
