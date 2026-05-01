import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { Network, Hospital, ShoppingBag, Pill, Microscope } from 'lucide-react';

const CATEGORIES = [
  {
    icon: Hospital,
    nombre: 'Hospitales y HCE',
    descripcion: 'HL7v2 + FHIR R4 para integrar historias clínicas institucionales.',
    estado: 'Diseño',
  },
  {
    icon: ShoppingBag,
    nombre: 'Obras sociales y prepagas',
    descripcion: 'API REST por convenio. OAuth2 server provisto por Pulso.',
    estado: 'Diseño',
  },
  {
    icon: Pill,
    nombre: 'Farmacias',
    descripcion: 'Validación de recetas digitales y dispensa.',
    estado: 'Pendiente',
  },
  {
    icon: Microscope,
    nombre: 'Laboratorios',
    descripcion: 'Ingesta de resultados con HL7-LIS o REST.',
    estado: 'Pendiente',
  },
];

export default function ConnectPage() {
  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Pulso Connect
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Capa de interoperabilidad
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-pulso-niebla">
          Pulso Connect conecta hospitales, obras sociales, farmacias y laboratorios bajo un
          contrato común. Especificaciones diseñadas; implementación incremental por partner.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Estado por categoría</CardTitle>
            <Badge variant="warning">Modo preview</Badge>
          </div>
          <CardDescription>
            La arquitectura está documentada en <code>docs/ARCHITECTURE.md</code> y los stubs en{' '}
            <code>packages/integrations</code>. Codex implementa conector real por partner en P2.
          </CardDescription>
        </CardHeader>

        <ul className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <li
                key={c.nombre}
                className="flex items-start gap-4 rounded-md border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-pulso-turquesa/15 text-pulso-turquesa">
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-display font-semibold">{c.nombre}</div>
                    <Badge variant={c.estado === 'Diseño' ? 'turquesa' : 'neutral'}>{c.estado}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-pulso-niebla">{c.descripcion}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
