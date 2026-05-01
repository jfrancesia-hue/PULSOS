import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { apiAuthed } from '@/lib/api';

interface ProfessionalRow {
  id: string;
  nombre: string;
  apellido: string;
  matriculaNacional: string | null;
  matriculaProvincial: string | null;
  provinciaMatricula: string | null;
  especialidades: string[];
  verificadoAt: string | null;
  user: { email: string; status: string; lastLoginAt: string | null };
}

export default async function ProfesionalesPage() {
  const res = await apiAuthed<ProfessionalRow[]>('/admin/professionals');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Gestión
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Profesionales</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Médicas, médicos, bioquímica, kinesiología, enfermería y más. Verificación contra
          colegios queda en Codex P1.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Listado</CardTitle>
            <Badge variant="neutral">{items.length}</Badge>
          </div>
          <CardDescription>Ordenadas por alta más reciente.</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-pulso-niebla">
              <tr>
                <th className="py-2 pr-4 font-medium">Profesional</th>
                <th className="py-2 pr-4 font-medium">Matrícula</th>
                <th className="py-2 pr-4 font-medium">Especialidades</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Verificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-pulso-blanco-calido">
                      Dr/a. {p.nombre} {p.apellido}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">
                    <div>{p.matriculaNacional ?? '—'}</div>
                    {p.matriculaProvincial ? (
                      <div className="text-pulso-niebla">{p.matriculaProvincial}</div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {p.especialidades.slice(0, 3).map((e) => (
                        <Badge key={e} variant="turquesa">
                          {e.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {p.especialidades.length > 3 ? (
                        <Badge variant="neutral">+{p.especialidades.length - 3}</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{p.user.email}</td>
                  <td className="py-3 pr-4">
                    {p.verificadoAt ? (
                      <Badge variant="success">Verificada</Badge>
                    ) : (
                      <Badge variant="warning">Pendiente</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
