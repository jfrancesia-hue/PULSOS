'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Badge } from '@pulso/ui';
import { changeRoleAction, changeStatusAction } from './actions';

const ROLES = ['CIUDADANO', 'PROFESIONAL', 'FARMACIA', 'INSTITUCION', 'ADMIN', 'SUPERADMIN'];

export function UserActions({
  userId,
  currentRole,
  currentStatus,
}: {
  userId: string;
  currentRole: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  function changeRole(role: string) {
    if (role === currentRole) return;
    if (!confirm(`Cambiar rol de ${currentRole} → ${role}?`)) return;
    startTransition(async () => {
      const res = await changeRoleAction(userId, role);
      if (!res.ok) alert(res.error.message);
      else router.refresh();
    });
  }

  function toggleSuspended() {
    const next = currentStatus === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    if (!confirm(`Cambiar status de ${currentStatus} → ${next}?`)) return;
    startTransition(async () => {
      const res = await changeStatusAction(userId, next);
      if (!res.ok) alert(res.error.message);
      else router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={() => setOpen((o) => !o)} disabled={pending}>
        {open ? 'Cerrar' : 'Acciones'}
      </Button>
      {open ? (
        <div className="absolute right-8 z-10 w-56 rounded-md border border-white/10 bg-pulso-azul-noche p-2 shadow-pulso-lg">
          <div className="mb-1 px-2 py-1 text-2xs uppercase tracking-wider text-pulso-niebla">
            Cambiar rol
          </div>
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => changeRole(r)}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-xs ${
                r === currentRole
                  ? 'bg-pulso-turquesa/15 text-pulso-turquesa'
                  : 'text-pulso-niebla hover:bg-white/[0.05] hover:text-pulso-blanco-calido'
              }`}
            >
              {r}
              {r === currentRole ? ' (actual)' : ''}
            </button>
          ))}
          <div className="my-1 border-t border-white/5"></div>
          <button
            type="button"
            onClick={toggleSuspended}
            className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-danger hover:bg-danger/10"
          >
            {currentStatus === 'SUSPENDED' ? 'Reactivar cuenta' : 'Suspender cuenta'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
