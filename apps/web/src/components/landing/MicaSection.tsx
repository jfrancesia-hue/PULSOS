import Image from 'next/image';
import { Sparkles, Heart, Shield, Lock } from 'lucide-react';

const MENSAJES_DEMO = [
  { rol: 'user' as const, texto: '¿Qué significa que mi colesterol total es 215?' },
  {
    rol: 'mica' as const,
    texto:
      'Hola Ana. Un colesterol total de 215 mg/dL está apenas por encima del rango deseable (menos de 200). No es algo urgente, pero sí algo a hablar con tu médico de cabecera en tu próximo control. Si querés, puedo recordarte agendar el turno.\n\nRecordá: Mica no reemplaza a un profesional médico.',
  },
];

export function MicaSection() {
  return (
    <section id="mica" className="relative overflow-hidden bg-pulso-azul-medianoche py-24 lg:py-32">
      <div className="absolute inset-0 -z-10 opacity-25">
        <Image
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=2000&q=80"
          alt=""
          fill
          quality={70}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pulso-azul-medianoche via-pulso-azul-medianoche/80 to-pulso-azul-medianoche/60" />
      </div>

      <div
        className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-pulso-turquesa/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Pulso Mica · IA Acompañante
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tu acompañante sanitaria,
            <br />
            <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-turquesa-glow bg-clip-text text-transparent">
              cálida y prudente.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-pulso-niebla">
            Mica responde en lenguaje simple, recuerda tu medicación, explica estudios y deriva a un
            profesional cuando corresponde. Es un acompañante, no un médico.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Feature icon={<Heart size={14} />} title="Triage seguro">
              Deriva a guardia cuando hace falta
            </Feature>
            <Feature icon={<Shield size={14} />} title="No prescribe">
              Guardrails post-hoc verificables
            </Feature>
            <Feature icon={<Sparkles size={14} />} title="Anthropic Claude">
              Modelos de última generación
            </Feature>
            <Feature icon={<Lock size={14} />} title="Privacidad total">
              Conversaciones cifradas
            </Feature>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="pulso-glass space-y-4 rounded-3xl p-6 shadow-pulso-xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-pulso-turquesa to-pulso-turquesa-deep shadow-glow-turquesa">
                    <Sparkles size={18} className="text-pulso-azul-medianoche" />
                  </div>
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-pulso-azul-medianoche" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-base font-semibold">Mica</div>
                  <div className="flex items-center gap-1.5 text-2xs text-pulso-niebla">
                    <span>IA acompañante</span>
                    <span>·</span>
                    <span className="text-success">En línea</span>
                  </div>
                </div>
                <div className="rounded-md border border-pulso-cobre/30 bg-pulso-cobre/10 px-2 py-1 text-2xs uppercase tracking-wider text-pulso-cobre">
                  v 2026.05
                </div>
              </div>

              {MENSAJES_DEMO.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.rol === 'user'
                      ? 'ml-12 bg-gradient-to-br from-pulso-turquesa/20 to-pulso-turquesa/10 text-pulso-blanco-calido'
                      : 'mr-12 bg-pulso-azul-noche text-pulso-blanco-calido'
                  }`}
                >
                  {m.texto.split('\n\n').map((p, j) => (
                    <p key={j} className={j > 0 ? 'mt-3 text-xs italic text-pulso-niebla' : ''}>
                      {p}
                    </p>
                  ))}
                </div>
              ))}

              <div className="flex items-center gap-3 rounded-md border border-white/5 bg-pulso-azul-medianoche/60 px-4 py-3 text-xs text-pulso-niebla">
                <Sparkles size={14} className="text-pulso-turquesa" />
                <span className="text-pulso-niebla/60">Escribí a Mica…</span>
                <kbd className="ml-auto rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-2xs">
                  Enter
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-pulso-turquesa/15 text-pulso-turquesa">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-pulso-blanco-calido">{title}</div>
        <div className="text-xs text-pulso-niebla">{children}</div>
      </div>
    </div>
  );
}
