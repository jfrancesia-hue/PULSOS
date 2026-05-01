'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@pulso/ui';
import { Check, X, ShieldOff } from 'lucide-react';
import { approveConsentAction, rejectConsentAction, revokeConsentAction } from './actions';

export function PendingConsentActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState(30);

  function approve() {
    start(async () => {
      const res = await approveConsentAction(id, duration);
      if (!res.ok) alert(res.error.message);
      else router.refresh();
    });
  }
  function reject() {
    if (!showReason) {
      setShowReason(true);
      return;
    }
    start(async () => {
      const res = await rejectConsentAction(id, reason || undefined);
      if (!res.ok) alert(res.error.message);
      else router.refresh();
    });
  }

  return (
    <div className="mt-4 space-y-3 rounded-md border border-pulso-cobre/30 bg-pulso-cobre/5 p-4">
      <div className="flex items-center gap-2 text-sm text-pulso-cobre">
        <span className="font-semibold">Esperando tu respuesta</span>
      </div>

      {showReason ? (
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo del rechazo (opcional)"
          rows={2}
          maxLength={500}
          className="w-full resize-none rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-3 py-2 text-sm text-pulso-blanco-calido placeholder:text-pulso-niebla/60 focus:border-pulso-cobre focus:outline-none"
        />
      ) : (
        <div className="flex items-center gap-3 text-xs">
          <label className="text-pulso-niebla">Aprobar por:</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="h-8 rounded-md border border-white/10 bg-pulso-azul-medianoche/60 px-2 text-pulso-blanco-calido focus:border-pulso-turquesa focus:outline-none"
          >
            <option value={1}>1 día</option>
            <option value={7}>7 días</option>
            <option value={30}>30 días</option>
            <option value={90}>90 días</option>
            <option value={365}>1 año</option>
          </select>
        </div>
      )}

      <div className="flex gap-2">
        {!showReason ? (
          <Button onClick={approve} disabled={pending} variant="primary" size="sm">
            <Check size={12} />
            Aprobar acceso
          </Button>
        ) : null}
        <Button onClick={reject} disabled={pending} variant="danger" size="sm">
          <X size={12} />
          {showReason ? 'Confirmar rechazo' : 'Rechazar'}
        </Button>
        {showReason ? (
          <Button onClick={() => setShowReason(false)} variant="ghost" size="sm" disabled={pending}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function RevokeConsentButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  function handle() {
    if (!confirm('¿Revocar este acceso? El profesional dejará de ver tu perfil.')) return;
    start(async () => {
      const res = await revokeConsentAction(id);
      if (!res.ok) alert(res.error.message);
      else router.refresh();
    });
  }
  return (
    <Button onClick={handle} disabled={pending} variant="outline" size="sm" className="mt-3">
      <ShieldOff size={12} />
      Revocar acceso
    </Button>
  );
}
