import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { Sparkles } from 'lucide-react';
import { requireUser } from '@/lib/session';
import { MicaChat } from './MicaChat';

export const metadata = { title: 'Mica · Pulso' };

export default async function MicaPage() {
  await requireUser();

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Pulso Mica
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Tu acompañante sanitaria
        </h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Mica está acá para ayudarte. Te explica, te recuerda, te deriva. No te diagnostica ni te
          receta. Si tu caso es urgente, te lleva a la guardia.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pulso-turquesa to-pulso-turquesa-deep">
                  <Sparkles size={16} className="text-pulso-azul-medianoche" />
                </div>
                <div>
                  <CardTitle>Mica</CardTitle>
                  <CardDescription>IA acompañante · No reemplaza profesional</CardDescription>
                </div>
              </div>
              <Badge variant="success">En línea</Badge>
            </div>
          </CardHeader>
          <MicaChat />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Mica</CardTitle>
              <CardDescription>Lo que sí y lo que no hace.</CardDescription>
            </CardHeader>
            <ul className="space-y-2 text-xs text-pulso-niebla">
              <li>✓ Explica estudios en lenguaje simple</li>
              <li>✓ Recuerda medicación habitual</li>
              <li>✓ Hace triage básico</li>
              <li>✓ Deriva a profesional cuando corresponde</li>
              <li className="border-t border-white/5 pt-2 mt-2 text-pulso-cobre">✗ No prescribe medicación</li>
              <li className="text-pulso-cobre">✗ No diagnostica</li>
              <li className="text-pulso-cobre">✗ No reemplaza al profesional</li>
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Es una emergencia?</CardTitle>
              <CardDescription>Si pasa algo urgente, no hables con Mica.</CardDescription>
            </CardHeader>
            <a href="tel:107" className="block rounded-md border border-pulso-cobre/30 bg-pulso-cobre/5 p-4 text-center text-pulso-cobre transition-colors hover:bg-pulso-cobre/10">
              <div className="font-display text-2xl font-bold">107</div>
              <div className="text-xs">SAME — Llamado de emergencia</div>
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
