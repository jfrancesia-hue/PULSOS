const STEPS = [
  {
    num: '01',
    titulo: 'El ciudadano se registra',
    descripcion:
      'Crea su Pulso ID con DNI verificado, completa su perfil clínico y configura su contacto de emergencia.',
  },
  {
    num: '02',
    titulo: 'Genera su QR de emergencia',
    descripcion:
      'Imprime su QR o lo guarda en el celular. Cualquier profesional puede acceder a sus datos críticos en emergencias.',
  },
  {
    num: '03',
    titulo: 'Autoriza profesionales',
    descripcion:
      'Otorga consentimiento granular y temporal a profesionales e instituciones. Cada acceso queda registrado.',
  },
  {
    num: '04',
    titulo: 'Vive con su salud conectada',
    descripcion:
      'Su perfil viaja con él. Mica le recuerda medicación, explica estudios y deriva cuando corresponde.',
  },
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative py-24 lg:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pulso-turquesa/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Cómo funciona
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-pulso-blanco-calido md:text-5xl">
            Cuatro pasos para una salud sin silos
          </h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative">
              <div className="absolute -inset-2 -z-10 rounded-xl bg-gradient-to-br from-pulso-turquesa/0 via-pulso-turquesa/0 to-pulso-turquesa/5 opacity-0 transition-opacity hover:opacity-100" />
              <div className="space-y-4">
                <div className="font-display text-5xl font-bold tracking-tight text-pulso-turquesa/80">
                  {s.num}
                </div>
                <h3 className="font-display text-xl font-semibold text-pulso-blanco-calido">
                  {s.titulo}
                </h3>
                <p className="text-sm leading-relaxed text-pulso-niebla">{s.descripcion}</p>
              </div>
              {i < STEPS.length - 1 ? (
                <div className="absolute right-0 top-6 hidden h-px w-8 -translate-x-4 bg-gradient-to-r from-pulso-turquesa/40 to-transparent lg:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
