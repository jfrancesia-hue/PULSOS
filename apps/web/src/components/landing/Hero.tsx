import Link from 'next/link';
import { Button, Badge } from '@pulso/ui';
import { ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pulso-topo absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-pulso-mesh opacity-80"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[1200px] -translate-x-1/2 rounded-full bg-pulso-turquesa/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
        <div className="flex flex-col justify-center">
          <Badge variant="turquesa" className="mb-6 w-fit">
            <Activity size={12} />
            Plataforma de salud digital argentina
          </Badge>

          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-pulso-blanco-calido md:text-6xl lg:text-7xl">
            Tu salud.
            <br />
            <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-turquesa-glow bg-clip-text text-transparent">
              Conectada.
            </span>
            <br />
            Segura. Siempre.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pulso-niebla">
            Una plataforma que conecta personas, profesionales e instituciones con datos
            sanitarios verificados y una capa de inteligencia preparada para transformar
            la salud en Argentina.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="#como-funciona">
              <Button variant="primary" size="lg">
                Conocé más
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                Solicitar demo institucional
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-xs text-pulso-niebla">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-pulso-turquesa" />
              <span>Audit log append-only</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-pulso-turquesa" />
              <span>RBAC institucional</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-pulso-turquesa" />
              <span>Consentimiento granular</span>
            </div>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-pulso-turquesa/30 via-transparent to-pulso-cobre/20 blur-3xl" />
        <div className="pulso-glass relative rounded-2xl border-pulso-turquesa/20 p-1 shadow-pulso-xl">
          <div className="rounded-xl bg-pulso-azul-medianoche p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pulso-turquesa/20">
                  <Activity size={18} className="text-pulso-turquesa" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-pulso-niebla">
                    Pulso ID
                  </div>
                  <div className="font-display text-base font-semibold">Hola, Ana</div>
                </div>
              </div>
              <Badge variant="success">Activo</Badge>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: 'Identidad', icon: '🪪' },
                { label: 'Emergencia', icon: '⚡' },
                { label: 'Mica', icon: '✨' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="text-2xs uppercase tracking-wider text-pulso-niebla">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulso-cobre/20 text-xs font-semibold text-pulso-cobre">
                    A+
                  </div>
                  <div>
                    <div className="text-sm font-medium">Grupo sanguíneo</div>
                    <div className="text-xs text-pulso-niebla">Verificado</div>
                  </div>
                </div>
                <Badge variant="cobre">Crítico</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                <div>
                  <div className="text-sm font-medium">Próximo control</div>
                  <div className="text-xs text-pulso-niebla">Dr. González · 12 may</div>
                </div>
                <Badge variant="turquesa">En 11 días</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
