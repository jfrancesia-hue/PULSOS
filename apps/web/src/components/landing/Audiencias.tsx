import Image from 'next/image';
import { Building2, Stethoscope, Users, Pill, Landmark, ArrowUpRight } from 'lucide-react';

const AUDIENCIAS = [
  {
    icon: Users,
    titulo: 'Para ciudadanos',
    cover: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    accent: 'turquesa' as const,
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
    cover: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    accent: 'cobre' as const,
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
    cover: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    accent: 'turquesa' as const,
    bullets: [
      'API de interoperabilidad HL7/FHIR',
      'Panel de gestión y métricas',
      'Auditoría completa de accesos',
      'Identidad institucional verificada',
    ],
  },
  {
    icon: Pill,
    titulo: 'Para farmacias',
    cover: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80',
    accent: 'cobre' as const,
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
    cover: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    accent: 'turquesa' as const,
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
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="pulso-topo h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
            Para todo el sistema
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Una plataforma. <span className="text-pulso-cobre">Cinco audiencias.</span>{' '}
            <br className="hidden lg:block" />
            Un mismo objetivo.
          </h2>
          <p className="mt-6 text-lg text-pulso-niebla">
            Pulso es la capa horizontal que conecta a todos los actores del sistema sanitario, sin
            reemplazar a ninguno. Cada uno encuentra valor concreto desde el primer día.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AUDIENCIAS.map((a) => {
            const Icon = a.icon;
            const isCobre = a.accent === 'cobre';
            return (
              <article
                key={a.titulo}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-pulso-azul-noche transition-all hover:-translate-y-1 hover:border-pulso-turquesa/30 hover:shadow-pulso-xl"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={a.cover}
                    alt={a.titulo}
                    fill
                    quality={75}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pulso-azul-noche via-pulso-azul-noche/40 to-transparent" />
                  <div
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border backdrop-blur-md ${
                      isCobre
                        ? 'border-pulso-cobre/40 bg-pulso-cobre/30 text-pulso-cobre'
                        : 'border-pulso-turquesa/40 bg-pulso-turquesa/20 text-pulso-turquesa'
                    }`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-7">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-semibold text-pulso-blanco-calido">
                      {a.titulo}
                    </h3>
                    <ArrowUpRight
                      size={18}
                      className="text-pulso-niebla transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pulso-turquesa"
                    />
                  </div>
                  <ul className="space-y-2 text-sm text-pulso-niebla">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2">
                        <span
                          className={`mt-2 h-1 w-1 flex-shrink-0 rounded-full ${
                            isCobre ? 'bg-pulso-cobre' : 'bg-pulso-turquesa'
                          }`}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
