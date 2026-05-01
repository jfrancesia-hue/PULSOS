import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { apiAuthed } from '@/lib/api';

interface AccessRow {
  id: string;
  token: string;
  ttl: string;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  user: { email: string; citizenProfile: { nombre: string; apellido: string; dni: string } | null };
  _count: { logs: number };
}

export default async function AccesosEmergenciaPage() {
  const res = await apiAuthed<AccessRow[]>('/admin/emergency-accesses');
  const items = res.ok ? res.data : [];

  return (
    <div className="space-y-8">
      <header>
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-cobre">
          Pulso Emergency
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Accesos QR de emergencia</h1>
        <p className="mt-2 text-sm text-pulso-niebla">
          QR generados por ciudadanos. Cada acceso público queda en el log de auditoría.
        </p>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Últimos 100</CardTitle>
            <Badge variant="neutral">{items.length}</Badge>
          </div>
          <CardDescription>Ordenados por fecha de creación.</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-pulso-niebla">
              <tr>
                <th className="py-2 pr-4 font-medium">Ciudadano</th>
                <th className="py-2 pr-4 font-medium">Token</th>
                <th className="py-2 pr-4 font-medium">TTL</th>
                <th className="py-2 pr-4 font-medium">Estado</th>
                <th className="py-2 pr-4 font-medium text-right">Accesos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((a) => {
                const expired = a.expiresAt && new Date(a.expiresAt) < new Date();
                const status = a.revokedAt ? 'REVOCADO' : expired ? 'EXPIRADO' : 'ACTIVO';
                const v = status === 'ACTIVO' ? 'success' : status === 'REVOCADO' ? 'danger' : 'warning';
                return (
                  <tr key={a.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-4">
                      {a.user.citizenProfile ? (
                        <div>
                          <div className="font-medium text-pulso-blanco-calido">
                            {a.user.citizenProfile.nombre} {a.user.citizenProfile.apellido}
                          </div>
                          <div className="text-xs text-pulso-niebla">
                            DNI {a.user.citizenProfile.dni}
                          </div>
                        </div>
                      ) : (
                        <span className="font-mono text-xs">{a.user.email}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-2xs">…{a.token.slice(-12)}</td>
                    <td className="py-3 pr-4 text-xs text-pulso-niebla">{a.ttl}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={v as never}>{status}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono">{a._count.logs}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
