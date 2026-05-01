import { Card, CardHeader, CardTitle, CardDescription, Badge } from '@pulso/ui';
import { ShieldCheck } from 'lucide-react';
import { apiAuthed } from '@/lib/api';

interface AuditRow {
  id: string;
  occurredAt: string;
  action: string;
  outcome: string;
  actorId: string | null;
  actorRole: string | null;
  targetType: string | null;
  targetId: string | null;
  ip: string | null;
  currentHash: string;
  previousHash: string;
  sequenceNum: string;
}

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; limit?: string }>;
}) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.action) qs.set('action', params.action);
  qs.set('limit', params.limit ?? '100');

  const [auditRes, chainRes] = await Promise.all([
    apiAuthed<AuditRow[]>(`/admin/audit?${qs.toString()}`),
    apiAuthed<{ ok: boolean; totalChecked: number }>('/admin/audit/verify'),
  ]);

  const items = auditRes.ok ? auditRes.data : [];
  const chain = chainRes.ok ? chainRes.data : null;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pulso-turquesa">
            Auditoría
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Audit log</h1>
          <p className="mt-2 max-w-2xl text-sm text-pulso-niebla">
            Append-only con hash chain SHA-256. Cualquier modificación posterior rompe la cadena y
            queda detectada al verificar.
          </p>
        </div>
        {chain ? (
          <Badge variant={chain.ok ? 'success' : 'danger'}>
            <ShieldCheck size={12} />
            {chain.ok ? `Cadena íntegra · ${chain.totalChecked} filas` : 'Quebrada'}
          </Badge>
        ) : null}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>Últimos {items.length} (ordenados por timestamp desc).</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-white/5 text-left uppercase tracking-wider text-pulso-niebla">
              <tr>
                <th className="py-2 pr-3 font-medium">Timestamp</th>
                <th className="py-2 pr-3 font-medium">Acción</th>
                <th className="py-2 pr-3 font-medium">Actor</th>
                <th className="py-2 pr-3 font-medium">Target</th>
                <th className="py-2 pr-3 font-medium">Outcome</th>
                <th className="py-2 pr-3 font-medium">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {items.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02]">
                  <td className="py-2 pr-3 text-pulso-niebla">
                    {new Date(e.occurredAt).toLocaleString('es-AR')}
                  </td>
                  <td className="py-2 pr-3 text-pulso-blanco-calido">{e.action}</td>
                  <td className="py-2 pr-3 text-pulso-niebla">
                    {e.actorRole ?? '—'}
                    {e.actorId ? ` · ${e.actorId.slice(0, 8)}` : ''}
                  </td>
                  <td className="py-2 pr-3 text-pulso-niebla">
                    {e.targetType ?? '—'}
                    {e.targetId ? ` · ${e.targetId.slice(0, 8)}` : ''}
                  </td>
                  <td className="py-2 pr-3">
                    <Badge
                      variant={
                        e.outcome === 'SUCCESS'
                          ? 'success'
                          : e.outcome === 'BLOCKED'
                            ? 'warning'
                            : 'danger'
                      }
                    >
                      {e.outcome}
                    </Badge>
                  </td>
                  <td className="py-2 pr-3 text-pulso-niebla" title={e.currentHash}>
                    …{e.currentHash.slice(-10)}
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
