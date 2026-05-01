import Link from 'next/link';
import { Logo, Button, Input } from '@pulso/ui';
import { ArrowLeft } from 'lucide-react';

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-pulso-azul-profundo">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo variant="full" size="md" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm text-pulso-niebla hover:text-pulso-turquesa">
          <ArrowLeft size={14} />
          Volver
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Solicitar demo institucional
        </div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Conversemos sobre cómo Pulso encaja en tu institución.
        </h1>
        <p className="mt-6 text-pulso-niebla">
          Completá el formulario y un equipo de Nativos Consultora se va a poner en contacto en menos
          de 48 horas.
        </p>

        <form className="mt-12 grid gap-5 rounded-2xl border border-white/5 bg-pulso-azul-noche/60 p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nombre">
              <Input placeholder="Cómo te llamás" />
            </Field>
            <Field label="Apellido">
              <Input placeholder="Apellido" />
            </Field>
          </div>
          <Field label="Email institucional">
            <Input type="email" placeholder="vos@institucion.gob.ar" />
          </Field>
          <Field label="Institución">
            <Input placeholder="Ministerio / Hospital / Obra social / Empresa" />
          </Field>
          <Field label="Cargo">
            <Input placeholder="Director, CTO, Jefa de TI…" />
          </Field>
          <Field label="¿Qué te interesa de Pulso?">
            <textarea
              rows={4}
              className="w-full resize-none rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-4 py-3 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-turquesa focus:outline-none"
              placeholder="Contanos brevemente tu situación y qué módulos te interesan…"
            />
          </Field>
          <Button type="submit" variant="primary" size="lg" className="mt-2 w-fit">
            Enviar solicitud
          </Button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-pulso-blanco-calido">{label}</span>
      {children}
    </label>
  );
}
