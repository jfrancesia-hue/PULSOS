import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { apiAuthed } from '@/lib/api';

interface Institution {
  id: string;
  cuit: string;
  razonSocial: string;
  fantasyName: string | null;
  tipo: string;
  provincia: string;
  localidad: string | null;
  verificadoAt: string | null;
}

export default async function InstitucionesPage() {
  const res = await apiAuthed<Institution[]>('/admin/institutions');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Gestión
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Instituciones</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Hospitales, clínicas, obras sociales, ministerios, farmacias y laboratorios registrados.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Listado</CardTitle>
            <Badge variant="neutral">{items.length} instituciones</Badge>
          </div>
          <CardDescription>Ordenadas por fecha de creación.</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-pulso-niebla">
              <tr>
                <th className="py-2 pr-4 font-medium">Razón social</th>
                <th className="py-2 pr-4 font-medium">CUIT</th>
                <th className="py-2 pr-4 font-medium">Tipo</th>
                <th className="py-2 pr-4 font-medium">Ubicación</th>
                <th className="py-2 pr-4 font-medium">Verificada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((i) => (
                <tr key={i.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-pulso-blanco-calido">
                      {i.fantasyName ?? i.razonSocial}
                    </div>
                    {i.fantasyName ? (
                      <div className="text-xs text-pulso-niebla">{i.razonSocial}</div>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{i.cuit}</td>
                  <td className="py-3 pr-4">
                    <Badge variant="neutral">{i.tipo.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-xs text-pulso-niebla">
                    {i.localidad ? `${i.localidad}, ` : ''}
                    {i.provincia.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 pr-4">
                    {i.verificadoAt ? <Badge variant="success">Sí</Badge> : <Badge variant="warning">Pendiente</Badge>}
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
