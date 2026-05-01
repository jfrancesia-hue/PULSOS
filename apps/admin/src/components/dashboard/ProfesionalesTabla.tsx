import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';

const PROFESIONALES = [
  {
    nombre: 'Dr. Martín González',
    matricula: 'M.N. 123.456',
    especialidad: 'Clínica Médica',
    institucion: 'Hospital Universitario Demo',
    estado: 'verificado',
    pacientes: 1248,
  },
  {
    nombre: 'Dra. Lucía Fernández',
    matricula: 'M.N. 234.567',
    especialidad: 'Pediatría',
    institucion: 'Clínica Bernal',
    estado: 'verificado',
    pacientes: 612,
  },
  {
    nombre: 'Dr. Ricardo Salgado',
    matricula: 'M.N. 345.678',
    especialidad: 'Cardiología',
    institucion: 'Hospital Italiano',
    estado: 'verificado',
    pacientes: 894,
  },
  {
    nombre: 'Dra. Patricia Núñez',
    matricula: 'M.N. 456.789',
    especialidad: 'Ginecología',
    institucion: 'Centro Salud Ramos Mejía',
    estado: 'pendiente',
    pacientes: 0,
  },
  {
    nombre: 'Dr. Federico Romero',
    matricula: 'M.N. 567.890',
    especialidad: 'Traumatología',
    institucion: 'Hospital de Clínicas',
    estado: 'verificado',
    pacientes: 433,
  },
];

export function ProfesionalesTabla() {
  return (
    <Card variant="default">
      <CardHeader>
        <CardTitle>Profesionales destacados</CardTitle>
        <CardDescription>Top de la red por volumen de consultas</CardDescription>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-pulso-niebla">
            <tr>
              <th className="pb-3 font-medium">Profesional</th>
              <th className="pb-3 font-medium">Especialidad</th>
              <th className="pb-3 font-medium">Institución</th>
              <th className="pb-3 font-medium text-right">Pacientes</th>
              <th className="pb-3 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {PROFESIONALES.map((p) => (
              <tr key={p.matricula} className="hover:bg-white/[0.02]">
                <td className="py-3 pr-4">
                  <div className="font-medium text-pulso-blanco-calido">{p.nombre}</div>
                  <div className="font-mono text-2xs text-pulso-niebla">{p.matricula}</div>
                </td>
                <td className="py-3 pr-4 text-pulso-niebla">{p.especialidad}</td>
                <td className="py-3 pr-4 text-pulso-niebla">{p.institucion}</td>
                <td className="py-3 pr-4 text-right font-mono text-pulso-blanco-calido">
                  {p.pacientes.toLocaleString('es-AR')}
                </td>
                <td className="py-3 text-right">
                  <Badge variant={p.estado === 'verificado' ? 'success' : 'warning'}>
                    {p.estado}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
