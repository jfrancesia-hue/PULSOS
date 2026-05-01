import { Logo } from '@pulso/ui';
import { Activity } from 'lucide-react';
import { SidebarNav } from './premium/SidebarNav';
import { LogoutButton } from './premium/LogoutButton';

export function Sidebar({ email }: { email?: string }) {
  const initials = (email ?? 'AD').slice(0, 2).toUpperCase();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/5 bg-pulso-azul-medianoche/95 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-y-0 -right-px w-px bg-gradient-to-b from-transparent via-pulso-turquesa/30 to-transparent" />

      <div className="flex items-center justify-between gap-3 border-b border-white/5 px-6 py-6">
        <Logo variant="full" size="md" className="text-pulso-blanco-calido" />
        <span className="rounded-md border border-pulso-cobre/30 bg-pulso-cobre/10 px-2 py-1 text-2xs font-bold uppercase tracking-wider text-pulso-cobre">
          Admin
        </span>
      </div>

      <div className="px-5 pt-4 pb-2">
        <div className="text-2xs font-semibold uppercase tracking-[0.18em] text-pulso-niebla/50">
          Plataforma
        </div>
      </div>

      <SidebarNav />

      <div className="mx-3 mb-3 rounded-lg border border-white/5 bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between text-2xs uppercase tracking-wider text-pulso-niebla">
          <span className="flex items-center gap-1.5">
            <Activity size={10} className="text-pulso-turquesa" />
            Sistema
          </span>
          <span className="font-mono text-success">OK</span>
        </div>
        <svg viewBox="0 0 200 24" className="h-5 w-full">
          <defs>
            <linearGradient id="sidebarPulse" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2BD4C9" stopOpacity="0" />
              <stop offset="50%" stopColor="#2BD4C9" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#D97847" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path
            d="M0,12 L40,12 L48,4 L56,20 L64,2 L72,22 L80,12 L120,12 L128,6 L136,18 L200,12"
            stroke="url(#sidebarPulse)"
            strokeWidth="1.5"
            fill="none"
            strokeLinejoin="round"
            className="pulse-line"
          />
        </svg>
      </div>

      <div className="border-t border-white/5 p-3">
        <div className="flex items-center gap-3 rounded-md bg-gradient-to-r from-pulso-cobre/10 to-transparent px-3 py-2.5 transition-colors hover:from-pulso-cobre/20">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pulso-cobre to-pulso-cobre-deep text-xs font-bold text-pulso-azul-medianoche">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">Pulso Admin</div>
            <div className="truncate text-2xs text-pulso-niebla">{email ?? '—'}</div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
