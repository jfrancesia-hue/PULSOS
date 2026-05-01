import { QrCode, Bell, Lock, Clock } from 'lucide-react';

export function QrSection() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
            Pulso Emergency
          </div>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Cuando los segundos importan,
            <br />
            <span className="text-pulso-cobre">tu QR ya está ahí.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-pulso-niebla">
            Datos críticos accesibles en emergencias: grupo sanguíneo, alergias, medicación habitual,
            cobertura médica y contacto de emergencia. Cada acceso queda registrado y vos te enterás.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { icon: Lock, text: 'Token firmado y revocable' },
              { icon: Clock, text: 'TTL configurable: 24h, 7d, 30d' },
              { icon: Bell, text: 'Notificación a vos en cada acceso' },
              { icon: QrCode, text: 'Imprimible o digital en el celular' },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.text} className="flex items-center gap-3 text-sm text-pulso-blanco-calido">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-pulso-cobre/15 text-pulso-cobre">
                    <Icon size={14} />
                  </div>
                  <span>{f.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-pulso-cobre/30 via-transparent to-pulso-turquesa/20 blur-3xl" />
            <div className="pulso-glass rounded-2xl p-8 shadow-pulso-xl">
              <QrMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QrMockup() {
  return (
    <div className="flex w-72 flex-col items-center gap-4">
      <div className="text-xs uppercase tracking-[0.18em] text-pulso-niebla">
        Código de Emergencia
      </div>
      <div className="rounded-xl bg-pulso-blanco-calido p-4">
        <FakeQr />
      </div>
      <div className="text-center">
        <div className="font-display text-base font-semibold">Ana M. Martini</div>
        <div className="text-xs text-pulso-niebla">DNI 32.145.678 · O+ · Alergia: Penicilina</div>
      </div>
      <div className="flex w-full items-center justify-between rounded-md border border-pulso-cobre/30 bg-pulso-cobre/5 px-3 py-2">
        <div className="text-2xs uppercase tracking-wider text-pulso-niebla">Activo hasta</div>
        <div className="text-xs font-semibold text-pulso-cobre">31 may 2026</div>
      </div>
    </div>
  );
}

function FakeQr() {
  const cells = Array.from({ length: 169 }, (_, i) => {
    const seeded = (i * 9301 + 49297) % 233280;
    return seeded / 233280 > 0.45;
  });
  return (
    <div className="grid grid-cols-13 gap-px" style={{ gridTemplateColumns: 'repeat(13, 12px)' }}>
      {cells.map((on, i) => (
        <div
          key={i}
          className={on ? 'h-3 w-3 bg-pulso-azul-medianoche' : 'h-3 w-3 bg-transparent'}
        />
      ))}
    </div>
  );
}
