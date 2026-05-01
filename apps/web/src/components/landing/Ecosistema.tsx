const PARTNERS = [
  'Ministerios de Salud',
  'PAMI',
  'IOMA',
  'OSDE',
  'Hospitales públicos',
  'Hospitales privados',
  'Farmacias',
  'Laboratorios',
];

export function Ecosistema() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Un ecosistema completo
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Diseñado para conectarse con todos los actores del sistema
          </h2>
          <p className="mt-6 text-lg text-pulso-niebla">
            Pulso Connect es la capa de interoperabilidad que se integra con HCEs institucionales,
            obras sociales, prepagas, farmacias y laboratorios mediante APIs estándar y conectores
            específicos.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          {PARTNERS.map((p) => (
            <div
              key={p}
              className="flex h-24 items-center justify-center rounded-lg border border-white/5 bg-pulso-azul-noche/40 text-center text-sm font-medium text-pulso-niebla transition-all hover:border-pulso-turquesa/30 hover:text-pulso-blanco-calido"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
