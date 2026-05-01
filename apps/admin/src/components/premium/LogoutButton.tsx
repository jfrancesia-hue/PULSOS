'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from '../../app/(panel)/actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Cerrar sesión"
        className="rounded-md p-1.5 text-pulso-niebla transition-all hover:bg-pulso-cobre/15 hover:text-pulso-cobre"
      >
        <LogOut size={14} />
      </button>
    </form>
  );
}
