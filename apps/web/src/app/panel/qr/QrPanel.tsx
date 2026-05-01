'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, Button, Badge } from '@pulso/ui';
import { QrCode, RefreshCw, X, Eye, ExternalLink, Copy } from 'lucide-react';
import { createQrAction, revokeQrAction } from './actions';

interface QrItem {
  id: string;
  token: string;
  ttl: 'H_24' | 'D_7' | 'D_30' | 'NUNCA';
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  _count: { logs: number };
}

const TTL_LABEL: Record<QrItem['ttl'], string> = {
  H_24: '24 horas',
  D_7: '7 días',
  D_30: '30 días',
  NUNCA: 'Sin expiración',
};

export function QrPanel({ qrs }: { qrs: QrItem[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [ttl, setTtl] = useState<QrItem['ttl']>('D_30');
  const [copied, setCopied] = useState<string | null>(null);

  const active = qrs.find((q) => !q.revokedAt && (!q.expiresAt || new Date(q.expiresAt) > new Date()));
  const history = qrs.filter((q) => q.id !== active?.id);

  function generate() {
    startTransition(async () => {
      await createQrAction(ttl);
      router.refresh();
    });
  }
  function revoke(id: string) {
    if (!confirm('¿Seguro que querés revocar este QR? Dejará de funcionar inmediatamente.')) return;
    startTransition(async () => {
      await revokeQrAction(id);
      router.refresh();
    });
  }

  async function copyUrl(token: string) {
    const url = `${window.location.origin}/q/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>QR activo</CardTitle>
            {active ? <Badge variant="success">Vigente</Badge> : <Badge variant="warning">Sin QR</Badge>}
          </div>
          <CardDescription>
            {active
              ? `Caduca: ${active.expiresAt ? new Date(active.expiresAt).toLocaleString('es-AR') : 'sin expiración'}`
              : 'Generá uno cuando lo necesites.'}
          </CardDescription>
        </CardHeader>

        {active ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center rounded-lg bg-pulso-blanco-calido p-6">
              <FakeQr token={active.token} />
            </div>
            <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 font-mono text-xs">
              {typeof window !== 'undefined' ? `${window.location.origin}/q/${active.token}` : `/q/${active.token}`}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => copyUrl(active.token)}>
                <Copy size={12} />
                {copied === active.token ? '¡Copiada!' : 'Copiar link'}
              </Button>
              <a href={`/q/${active.token}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink size={12} />
                  Ver vista pública
                </Button>
              </a>
              <Button variant="danger" size="sm" disabled={pending} onClick={() => revoke(active.id)}>
                <X size={12} />
                Revocar
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-white/10 p-6 text-center text-sm text-pulso-niebla">
            Todavía no tenés un QR activo. Generá uno abajo.
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generar nuevo QR</CardTitle>
          <CardDescription>
            Si generás uno nuevo, el anterior queda invalidado automáticamente. Elegí cuánto tiempo
            querés que esté activo.
          </CardDescription>
        </CardHeader>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(TTL_LABEL) as Array<QrItem['ttl']>).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTtl(t)}
              className={`rounded-md border p-3 text-center text-xs transition-colors ${
                ttl === t
                  ? 'border-pulso-turquesa bg-pulso-turquesa/10 text-pulso-turquesa'
                  : 'border-white/5 bg-white/[0.02] text-pulso-niebla hover:border-pulso-turquesa/30'
              }`}
            >
              <div className="font-medium">{TTL_LABEL[t]}</div>
            </button>
          ))}
        </div>

        <Button onClick={generate} disabled={pending} variant="primary" size="lg" className="mt-6 w-full">
          <RefreshCw size={14} className={pending ? 'animate-spin' : ''} />
          {pending ? 'Generando…' : 'Generar QR'}
        </Button>

        <div className="mt-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-pulso-niebla">
            Historial de QR
          </div>
          {history.length === 0 ? (
            <div className="mt-3 rounded-md border border-dashed border-white/10 p-4 text-center text-xs text-pulso-niebla">
              Sin QR previos.
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((q) => (
                <li
                  key={q.id}
                  className="flex items-center justify-between rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
                >
                  <div>
                    <div className="font-mono text-pulso-blanco-calido">…{q.token.slice(-8)}</div>
                    <div className="mt-0.5 text-pulso-niebla">
                      {q.revokedAt
                        ? `Revocado ${new Date(q.revokedAt).toLocaleDateString('es-AR')}`
                        : q.expiresAt && new Date(q.expiresAt) < new Date()
                          ? 'Expirado'
                          : 'Vigente'}
                      {' · '}
                      {q._count.logs} accesos
                    </div>
                  </div>
                  <Badge variant={q.revokedAt ? 'danger' : 'neutral'}>
                    {q.revokedAt ? 'Revocado' : 'Histórico'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}

function FakeQr({ token }: { token: string }) {
  // Determinístico desde el token para que cada QR se vea distinto.
  const hash = [...token].reduce((acc, c) => acc * 31 + c.charCodeAt(0), 7);
  const cells = Array.from({ length: 225 }, (_, i) => {
    const seed = (hash + i * 9301 + 49297) % 233280;
    return seed / 233280 > 0.46;
  });
  return (
    <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(15, 14px)' }}>
      {cells.map((on, i) => (
        <div key={i} className={on ? 'h-3.5 w-3.5 bg-pulso-azul-medianoche' : 'h-3.5 w-3.5 bg-transparent'} />
      ))}
    </div>
  );
}
