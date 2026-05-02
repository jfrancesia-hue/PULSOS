'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from './actions';

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Cerrar sesión"
        className="press rounded-md p-1.5 text-pulso-niebla transition-all hover:bg-pulso-cobre/15 hover:text-pulso-cobre"
      >
        <LogOut size={14} className="icon-bounce-hover" />
      </button>
    </form>
  );
}
