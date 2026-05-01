'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@pulso/ui';
import { LogOut, X } from 'lucide-react';
import { revokeSessionAction, revokeAllSessionsAction } from './actions';

export function RevokeSessionButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  function handle() {
    if (!confirm('¿Cerrar esta sesión?')) return;
    start(async () => {
      await revokeSessionAction(id);
      router.refresh();
    });
  }
  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      aria-label="Cerrar sesión en este dispositivo"
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-pulso-niebla hover:bg-danger/10 hover:text-danger disabled:opacity-50"
    >
      <X size={14} />
    </button>
  );
}

export function RevokeAllButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  function handle() {
    if (!confirm('¿Cerrar todas tus sesiones? Vas a tener que volver a ingresar en cada dispositivo.')) return;
    start(async () => {
      await revokeAllSessionsAction();
      router.refresh();
    });
  }
  return (
    <Button variant="outline" size="sm" onClick={handle} disabled={pending}>
      <LogOut size={12} />
      Cerrar todas las sesiones
    </Button>
  );
}
