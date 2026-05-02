import Link from 'next/link';
import Image from 'next/image';
import { Button, Badge } from '@pulso/ui';
import { ArrowRight, ShieldCheck, Activity, Heart, Sparkles, ChevronRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Imagen de fondo: paisaje argentino con overlay institucional */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1530878955811-92cb38ce4f06?w=2400&q=80"
          alt="Cordillera de los Andes"
          fill
          priority
          quality={85}
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pulso-azul-medianoche/95 via-pulso-azul-profundo/90 to-pulso-azul-medianoche/95" />
      </div>

      <div className="pulso-topo absolute inset-0 -z-10 opacity-40" aria-hidden="true" />

      <div
        className="pointer-events-none absolute -top-32 left-1/4 h-[600px] w-[800px] rounded-full bg-pulso-turquesa/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[600px] rounded-full bg-pulso-cobre/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:py-32">
        <div className="flex flex-col justify-center">
          <Badge variant="turquesa" className="mb-6 w-fit">
            <Activity size={12} />
            Plataforma argentina de salud digital
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Tu salud.
            <br />
            <span className="bg-gradient-to-r from-pulso-turquesa via-pulso-turquesa-glow to-pulso-cobre bg-clip-text text-transparent">
              Conectada.
            </span>
            <br />
            Segura. Siempre.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pulso-niebla">
            Una plataforma que conecta personas, profesionales e instituciones con datos sanitarios
            verificados y una capa de inteligencia preparada para transformar la salud en Argentina.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/registro" className="group">
              <Button variant="cobre-pulse" size="lg">
                Crear mi Pulso ID
                <ArrowRight size={16} className="icon-bounce-hover" />
              </Button>
            </Link>
            <Link href="/demo" className="group">
              <Button variant="outline" size="lg">
                <Sparkles size={16} className="icon-wobble" />
                Demo institucional
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-pulso-niebla">
            <Trust icon={<ShieldCheck size={14} />} text="Audit log append-only" />
            <span className="h-3 w-px bg-white/10" />
            <Trust icon={<ShieldCheck size={14} />} text="Hash chain SHA-256" />
            <span className="h-3 w-px bg-white/10" />
            <Trust icon={<ShieldCheck size={14} />} text="Consentimiento granular" />
            <span className="h-3 w-px bg-white/10" />
            <Trust icon={<ShieldCheck size={14} />} text="Ley 25.326" />
          </div>
        </div>

        <HeroVisual3D />
      </div>

      <div className="relative mx-auto max-w-7xl border-t border-white/5 px-6 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-8 text-xs uppercase tracking-[0.2em] text-pulso-niebla">
          <span className="opacity-60">Diseñado para integrarse con</span>
          {['PAMI', 'IOMA', 'OSDE', 'SwissMedical', 'Min. Salud'].map((p) => (
            <span key={p} className="font-display font-semibold opacity-70 transition-opacity hover:opacity-100">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Trust({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-pulso-turquesa">{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function HeroVisual3D() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-pulso-turquesa/40 via-transparent to-pulso-cobre/30 blur-3xl" />

        <div className="pulso-glass border-glow tilt-3d relative animate-pulse-glow rounded-3xl border-pulso-turquesa/30 p-1 shadow-pulso-xl">
          <div className="rounded-[22px] bg-pulso-azul-medianoche p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pulso-turquesa to-pulso-turquesa-deep shadow-glow-turquesa">
                    <Heart size={20} className="fill-pulso-azul-medianoche text-pulso-azul-medianoche" />
                  </div>
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success ring-2 ring-pulso-azul-medianoche">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-success" />
                  </span>
                </div>
                <div>
                  <div className="text-2xs uppercase tracking-wider text-pulso-niebla">Pulso ID · Activo</div>
                  <div className="font-display text-base font-semibold">Hola, Ana M.</div>
                </div>
              </div>
              <Badge variant="turquesa">A+</Badge>
            </div>

            <div className="mt-5 rounded-xl border border-white/5 bg-gradient-to-br from-pulso-azul-noche/40 to-transparent p-3">
              <div className="mb-2 flex items-center justify-between text-2xs uppercase tracking-wider text-pulso-niebla">
                <span>Latido constante</span>
                <span className="font-mono text-pulso-turquesa">72 bpm</span>
              </div>
              <svg viewBox="0 0 320 60" className="h-12 w-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2BD4C9" stopOpacity="0" />
                    <stop offset="50%" stopColor="#2BD4C9" stopOpacity="1" />
                    <stop offset="100%" stopColor="#5EE7DE" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,30 L60,30 L70,15 L80,45 L90,5 L100,55 L110,30 L160,30 L170,18 L180,42 L190,10 L200,50 L210,30 L320,30"
                  stroke="url(#heartGrad)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <Chip icon="🪪" label="Identidad" />
              <Chip icon="⚡" label="Emergencia" cobre />
              <Chip icon="✨" label="Mica IA" />
            </div>

            <div className="mt-4 space-y-2">
              <DataRow icon="A+" label="Grupo sanguíneo" sub="Verificado" badge="Crítico" badgeVariant="cobre" />
              <DataRow icon="!" label="Penicilina" sub="Alergia severa" badge="Acción" badgeVariant="cobre" iconBg="cobre" />
              <DataRow icon="℞" label="Enalapril 10mg" sub="1 cada 12 horas" badge="Habitual" badgeVariant="turquesa" />
            </div>

            <button className="press ripple group mt-4 flex w-full items-center justify-between rounded-md border border-pulso-turquesa/20 bg-pulso-turquesa/5 px-4 py-2.5 text-xs text-pulso-turquesa transition-colors hover:bg-pulso-turquesa/10">
              <span className="flex items-center gap-2">
                <Sparkles size={12} className="icon-wobble" />
                Hablar con Mica sobre tu medicación
              </span>
              <ChevronRight size={12} className="icon-bounce-hover" />
            </button>
          </div>
        </div>

        <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-pulso-cobre/30 bg-pulso-azul-medianoche/95 px-4 py-3 shadow-pulso-lg backdrop-blur-xl sm:block">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-pulso-cobre/15 text-pulso-cobre">
              <Activity size={16} />
            </div>
            <div>
              <div className="text-2xs uppercase tracking-wider text-pulso-niebla">QR de emergencia</div>
              <div className="text-xs font-semibold">Activo · 30 días</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label, cobre = false }: { icon: string; label: string; cobre?: boolean }) {
  return (
    <div
      className={`press flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-all hover:scale-105 hover:-translate-y-0.5 ${
        cobre ? 'border-pulso-cobre/20 bg-pulso-cobre/5 hover:border-pulso-cobre/40' : 'border-white/5 bg-white/[0.02] hover:border-pulso-turquesa/30'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-2xs uppercase tracking-wider text-pulso-niebla">{label}</span>
    </div>
  );
}

function DataRow({
  icon,
  label,
  sub,
  badge,
  badgeVariant,
  iconBg = 'turquesa',
}: {
  icon: string;
  label: string;
  sub: string;
  badge: string;
  badgeVariant: 'turquesa' | 'cobre';
  iconBg?: 'turquesa' | 'cobre';
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold ${
            iconBg === 'cobre' ? 'bg-pulso-cobre/20 text-pulso-cobre' : 'bg-pulso-turquesa/20 text-pulso-turquesa'
          }`}
        >
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-2xs text-pulso-niebla">{sub}</div>
        </div>
      </div>
      <Badge variant={badgeVariant}>{badge}</Badge>
    </div>
  );
}
