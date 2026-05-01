import { Card, CardHeader, CardTitle, CardDescription } from '@pulso/ui';
import { requireRole } from '@/lib/session';
import { SearchForm } from './SearchForm';

export const metadata = { title: 'Buscar paciente · Pulso' };

export default async function BuscarPage() {
  await requireRole(['PROFESIONAL'], '/portal-profesional/ingresar');

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
          Pulso Clinical
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Buscar paciente</h1>
        <p className="mt-2 max-w-2xl text-pulso-niebla">
          Buscá por DNI. Si tenés consentimiento vigente, vas a ver el perfil completo. Si no,
          podés solicitarlo y quedará registrado.
        </p>
      </header>

      <SearchForm />

      <Card>
        <CardHeader>
          <CardTitle>Cómo funciona el consentimiento</CardTitle>
          <CardDescription>Tres niveles, todos auditados.</CardDescription>
        </CardHeader>
        <ul className="space-y-3 text-sm text-pulso-niebla">
          <li>
            <strong className="text-pulso-blanco-calido">Sin consentimiento:</strong> ves solo nombre
            parcial e inicial de apellido. No accedés al perfil clínico.
          </li>
          <li>
            <strong className="text-pulso-blanco-calido">Con consentimiento PERFIL_COMPLETO:</strong>{' '}
            ves el Pulso ID completo del paciente.
          </li>
          <li>
            <strong className="text-pulso-blanco-calido">Con consentimiento TIMELINE_CLINICO:</strong>{' '}
            ves la historia clínica.
          </li>
          <li>
            <strong className="text-pulso-blanco-calido">Con consentimiento CARGA_EVOLUCION:</strong>{' '}
            podés cargar evolución, indicaciones y derivaciones.
          </li>
        </ul>
      </Card>
    </div>
  );
}
