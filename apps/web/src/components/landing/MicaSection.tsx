import { Sparkles, Heart } from 'lucide-react';

const MENSAJES_DEMO = [
  {
    rol: 'user' as const,
    texto: '¿Qué significa que mi colesterol total es 215?',
  },
  {
    rol: 'mica' as const,
    texto:
      'Hola Ana. Un colesterol total de 215 mg/dL está apenas por encima del rango deseable (menos de 200). No es algo urgente, pero sí algo a hablar con tu médico de cabecera en tu próximo control. Si querés, puedo recordarte agendar el turno.\n\nRecordá: Mica no reemplaza a un profesional médico. Para diagnóstico y tratamiento, consultá siempre con tu médico/a.',
  },
];

export function MicaSection() {
  return (
    <section id="mica" className="relative bg-pulso-azul-medianoche py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Pulso Mica
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Tu acompañante sanitario,
            <br />
            <span className="bg-gradient-to-r from-pulso-turquesa to-pulso-turquesa-glow bg-clip-text text-transparent">
              cálido y prudente.
            </span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-pulso-niebla">
            Mica responde en lenguaje simple, recuerda tu medicación, explica estudios y deriva a un
            profesional cuando corresponde. Es un acompañante, no un médico.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-pulso-niebla">
            {[
              'Hace triage básico seguro y deriva a guardia cuando hace falta',
              'Nunca prescribe, nunca diagnostica, nunca reemplaza al profesional',
              'Construido sobre Anthropic Claude con guardrails post-hoc',
              'Está preparada para WhatsApp y Twilio',
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <Heart size={14} className="mt-1 flex-shrink-0 text-pulso-turquesa" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="pulso-glass space-y-4 rounded-2xl p-6 shadow-pulso-xl">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pulso-turquesa to-pulso-turquesa-deep">
                  <Sparkles size={16} className="text-pulso-azul-medianoche" />
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">Mica</div>
                  <div className="flex items-center gap-1.5 text-2xs text-pulso-niebla">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    En línea · IA acompañante
                  </div>
                </div>
              </div>

              {MENSAJES_DEMO.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.rol === 'user'
                      ? 'ml-8 bg-pulso-turquesa/15 text-pulso-blanco-calido'
                      : 'mr-8 bg-pulso-azul-noche text-pulso-blanco-calido'
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
                <span className="text-pulso-niebla/60">Escribí a Mica…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
