import Link from 'next/link';
import { Button } from '@pulso/ui';
import { ArrowRight } from 'lucide-react';

export function CtaInstitucional() {
  return (
    <section className="relative overflow-hidden bg-pulso-azul-medianoche py-24 lg:py-32">
      <div
        className="absolute -left-48 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-pulso-turquesa/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -right-48 top-0 h-96 w-96 rounded-full bg-pulso-cobre/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-8">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Ministerios · Hospitales · Obras sociales
        </div>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-pulso-blanco-calido md:text-5xl lg:text-6xl">
          Construyamos juntos la salud
          <br />
          digital de Argentina.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg text-pulso-niebla">
          Si representás a un ministerio, hospital, obra social u otra institución, agendemos una
          conversación. Pulso se adapta a tu realidad operativa, regulatoria y técnica.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/demo">
            <Button variant="primary" size="lg">
              Solicitar demo institucional
              <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="mailto:hola@nativos.consulting">
            <Button variant="outline" size="lg">
              Hablar con Nativos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
