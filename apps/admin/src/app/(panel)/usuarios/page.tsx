import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { apiAuthed } from '@/lib/api';

interface AdminUserRow {
  id: string;
  email: string;
  role: string;
  status: string;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  citizenProfile: { dni: string; nombre: string; apellido: string; provincia: string } | null;
  professionalProfile: { matriculaNacional: string | null; especialidades: string[] } | null;
}

export default async function UsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.q) qs.set('q', params.q);
  if (params.role) qs.set('role', params.role);
  const res = await apiAuthed<AdminUserRow[]>(`/admin/users?${qs.toString()}`);
  const users = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
          Gestión
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Usuarios</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          Cuentas activas en Pulso. Cambios de rol y suspensión disponibles vía API
          (UI completa la implementa Codex en P1).
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Listado</CardTitle>
            <Badge variant="neutral">{users.length} cuentas</Badge>
          </div>
          <CardDescription>Las primeras 100 ordenadas por fecha de creación.</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-pulso-niebla">
              <tr>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Identificación</th>
                <th className="py-2 pr-4 font-medium">Rol</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 pr-4 font-medium">MFA</th>
                <th className="py-2 pr-4 font-medium text-right">Último acceso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 pr-4 font-mono text-xs">{u.email}</td>
                  <td className="py-3 pr-4">
                    {u.citizenProfile ? (
                      <div>
                        <div>
                          {u.citizenProfile.nombre} {u.citizenProfile.apellido}
                        </div>
                        <div className="text-xs text-pulso-niebla">
                          DNI {u.citizenProfile.dni} · {u.citizenProfile.provincia}
                        </div>
                      </div>
                    ) : u.professionalProfile?.matriculaNacional ? (
                      <div className="text-xs">
                        <div className="font-mono">{u.professionalProfile.matriculaNacional}</div>
                        <div className="text-pulso-niebla">
                          {u.professionalProfile.especialidades.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-pulso-niebla">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={u.role === 'CIUDADANO' ? 'turquesa' : u.role === 'SUPERADMIN' ? 'cobre' : 'neutral'}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={
                        u.status === 'ACTIVE'
                          ? 'success'
                          : u.status === 'SUSPENDED'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4">
                    {u.mfaEnabled ? <Badge variant="success">Sí</Badge> : <Badge variant="neutral">No</Badge>}
                  </td>
                  <td className="py-3 pr-4 text-right text-xs text-pulso-niebla">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('es-AR') : '—'}
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
